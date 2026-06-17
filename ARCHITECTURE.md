# LSE Share Screener — Build & Architecture Reference

How the system is put together, where each piece runs, and how data flows through it.

_Last updated: 16 June 2026_

> See also: [`README.md`](README.md) (step-by-step deploy) and [`COWORK-HANDOFF.md`](COWORK-HANDOFF.md) (debugging context).

---

## 1. What this is

The LSE Share Screener is a personal, end-of-day stock screener for London-listed shares. It refreshes market data on its own overnight, then ranks a watchlist of shares by a weighted blend of four factors — Momentum, Value, Quality and Stability — on a dashboard you open in the morning.

Nothing runs on your own machine in normal use. The data engine lives on Cloudflare's servers and refreshes itself on a schedule; the dashboard is a static page; and an optional Claude connector handles ad-hoc deep-dives. Your laptop can be switched off and the data still updates.

**Not financial advice.** _A ranking reflects past data and is a research starting point, not a buy signal._

---

## 2. The moving parts

The system is built from three deployable pieces plus two supporting stores. Each piece has one job.

| Piece | What it does | Where it runs |
|-------|--------------|---------------|
| `screener-worker.js` | The data engine. Fetches prices and fundamentals, does the maths, caches a JSON snapshot, and serves it. | Cloudflare Workers |
| `public/index.html` | The dashboard you actually look at. Reads the snapshot and ranks the watchlist. | Cloudflare Pages |
| KV namespace (`SCREENER`) | Key-value store holding the snapshot, per-ticker price history, cached fundamentals, and the refresh cursor. | Cloudflare KV |
| Alpha Vantage | The market-data provider the Worker calls for prices, overview, balance sheet and earnings. | External API |
| MCP connector + prompts | Optional Claude connector for ad-hoc research. Not hosted — configured inside Claude. | Claude (your account) |

The key idea: the dashboard never calls the market-data API directly. The Worker is the only thing that talks to Alpha Vantage, and it writes its results into KV. The dashboard just reads what the Worker last cached. This keeps API usage predictable and means the page loads instantly regardless of how slow the data provider is.

---

## 3. How data flows

On a normal day the flow is one direction, end to end:

```
Cron tick (after LSE close)
      │
      ▼
  Worker.refreshNext()  ──►  Alpha Vantage  (prices + fundamentals)
      │
      ▼
  KV store  (snapshot:v1, series:*, fund:*, cursor:v1)
      │
      ▼
  Worker.fetch()  (HTTP GET)  ◄──  Dashboard (public/index.html)
      │
      ▼
        You
```

**Refresh path (overnight):** a scheduled cron wakes the Worker, which fetches one ticker from Alpha Vantage, runs the maths, and upserts the result into the KV snapshot.

**Read path (morning):** you open the dashboard; it does a single HTTP GET to the Worker, which returns the cached snapshot JSON. No API calls happen on the read path.

---

## 4. The data engine (Worker)

The Worker has two entry points, defined in the default export of `screener-worker.js`.

### 4.1 Two entry points

- `scheduled(event, env, ctx)` — runs on the cron. Each invocation calls `refreshNext()` to refresh exactly one ticker.
- `fetch(request, env, ctx)` — handles HTTP. A GET to `/` returns the cached snapshot. A GET to `/refresh` manually steps the refresh by one ticker and returns the result inline.

### 4.2 Incremental, one-ticker-at-a-time refresh

Rather than refreshing the whole watchlist in one go, the Worker refreshes a single ticker per invocation. This is the central design decision and it exists for two reasons:

- A single Worker invocation cannot make all the API calls for the whole list within Cloudflare's execution time limit.
- The free Alpha Vantage tier caps usage at 5 calls per minute and 25 calls per day. One ticker is up to 4 calls (~40 seconds with throttling), which stays safely inside the per-minute cap.

A round-robin cursor (`cursor:v1` in KV) tracks which ticker is next. After each refresh the cursor advances, wrapping around at the end of the list. If a ticker fails, its previous data is kept and the cursor still advances — so one bad symbol can never wedge the rotation.

### 4.3 Per-call throttle

Every provider call routes through `avFetch()`, which spaces calls at least `MIN_CALL_GAP_MS` (13 seconds) apart. This keeps any burst under the 5-calls-per-minute cap. The balance-sheet and earnings calls are made sequentially (not in parallel) so they each pass through the throttle individually.

### 4.4 What gets computed per ticker

| Field | Meaning | Source |
|-------|---------|--------|
| `r12` / `r3` | 12-month and 3-month total return | Derived from the price series |
| `vol` | Annualised volatility (~1yr of daily returns) | Derived from the price series |
| `pe` / `yield` / `roe` | P/E ratio, dividend yield, return on equity | `OVERVIEW` call |
| `de` | Debt-to-equity (gearing); lower is better | `BALANCE_SHEET` (cached monthly) |
| `econ` | Earnings consistency score, 0–1 | `EARNINGS` (cached monthly) |

The maths (`totalReturn`, `annualisedVol`, `debtToEquity`, `earningsConsistency`) is pure and unit-tested against known inputs, and returns `null` on bad or insufficient data rather than `NaN`. Treat it as settled — don't tweak it casually.

---

## 5. What lives in KV (and for how long)

All persistent state sits in one KV namespace, bound in the Worker as `SCREENER`. There are four kinds of key:

| Key | Holds | Refresh cadence |
|-----|-------|-----------------|
| `snapshot:v1` | The full served JSON: every ticker's computed fields, plus `updated` timestamp and count. | Upserted one ticker at a time |
| `series:<TICKER>` | Price history per ticker (~2 years retained), merged by date. | Topped up each refresh (compact) |
| `fund:<TICKER>` | Cached debt-to-equity and earnings consistency. | Refetched at most every 30 days (`FUND_TTL_DAYS`) |
| `cursor:v1` | Index of the next ticker to refresh (round-robin). | Advances every invocation |

The two-tier caching is deliberate. Prices change daily, so the series is topped up every refresh with a small "compact" pull and merged into the stored history. Balance-sheet and earnings only change at reporting time, so they are cached for 30 days. This is what keeps the daily call budget low: most days cost about 2 calls per ticker, rising to about 4 once a month when the fundamentals refresh.

---

## 6. Configuration & setup

The build is configured in two places: `wrangler.toml` (deployment) and a handful of constants at the top of the Worker.

### 6.1 wrangler.toml

```toml
name = "lse-screener"
main = "screener-worker.js"
compatibility_date = "2025-01-01"

kv_namespaces = [{ binding = "SCREENER", id = "<your-kv-id>" }]

[triggers]
crons = [
  "30 18 * * 1-5",  # 18:30 UTC weekdays, after LSE close
  "32 18 * * 1-5",  # five staggered ticks, 2 min apart,
  "34 18 * * 1-5",  # walk the 5-ticker watchlist in one
  "36 18 * * 1-5",  # daily pass (one tick per ticker)
  "38 18 * * 1-5",
]
```

The staggered crons are how the one-ticker-per-tick design covers the whole list. There is one tick per ticker. **If the watchlist grows, add one more cron tick per added ticker.**

### 6.2 Key constants in the Worker

| Constant | What it controls |
|----------|------------------|
| `WATCHLIST` | The tickers to track. LSE symbols use the `.LON` suffix Alpha Vantage expects (e.g. `TSCO.LON`), not `.L`. |
| `USE_FREE_TIER` | `true` uses the free raw-close endpoint (price return only). Set `false` with a premium key to restore adjusted total return. |
| `MIN_CALL_GAP_MS` | Minimum gap between provider calls (13s) — the per-minute throttle. |
| `FUND_TTL_DAYS` | How long balance-sheet/earnings stay cached (30 days). |
| `SERIES_KEEP` / `VOL_WINDOW` | How much price history to retain (~2yr) and the volatility window (252 trading days). |

### 6.3 The API key

The market-data key is stored as a Wrangler secret named `DATA_API_KEY`, never committed to the repo. Set or rotate it with:

```bash
npx wrangler secret put DATA_API_KEY
```

---

## 7. The deploy model — two targets

This is the part that's easy to trip over: there are two independent targets, and they are not the same action.

| Action | What it does | Effect |
|--------|--------------|--------|
| `npx wrangler deploy` | Pushes the Worker code and the cron triggers to Cloudflare. | Makes it actually run / changes live behaviour |
| `git push` | Pushes source to GitHub. | Versions the code; does not change the running Worker |

**Keep them in sync.** A `wrangler deploy` changes what's live but not what's in source control; a `git push` versions your code but does not redeploy. After a change you normally do both.

### 7.1 Deploying the dashboard

The dashboard is a static page deployed to Cloudflare Pages, either by connecting the GitHub repo (build command: none; output directory: `public`) or from the CLI with `npx wrangler pages deploy public`. Set the `WORKER_URL` constant near the top of `index.html` to your Worker's URL; left empty it runs on demo data.

### 7.2 CORS

The Worker's responses set `Access-Control-Allow-Origin` to the dashboard's Pages origin. If you change the dashboard domain, update that header in the Worker's `fetch` handler and redeploy.

---

## 8. Operating it

### 8.1 Daily rhythm

1. **Overnight** — nothing to do. The cron refreshes the snapshot on Cloudflare's servers.
2. **Morning (~2 min)** — open the dashboard, adjust the factor weights, read the ranking.
3. **Drill down** — for any name worth a closer look, switch to Claude + the connector and run a research prompt.

### 8.2 Re-seeding by hand

The cron fills the snapshot automatically, but you can force it. Hitting `/refresh` steps the refresh by one ticker (it pauses ~40s before responding — that's the throttle, not a hang). Call it once per ticker for a full pass. Watch progress with `npx wrangler tail` in another terminal.

### 8.3 Common changes

- **Change the watchlist:** edit `WATCHLIST` in the Worker, add a matching cron tick, redeploy. Add company labels to the `META` map in the HTML.
- **Adjust the schedule:** edit the `crons` line in `wrangler.toml` and redeploy.
- **Switch data providers:** only the `fetch*` functions are provider-specific; the maths and caching are not. Swapping to EODHD or Twelve Data means rewriting those fetchers.

---

## 9. Cost & gotchas

- **Cost:** Pages, Workers and KV all sit inside Cloudflare's free tier at this scale. The only real cost is the market-data plan.
- **Free-tier data limits:** Alpha Vantage's free tier (25 calls/day, 5/min, adjusted history gated) won't cover ~20 tickers. The watchlist is trimmed to 5 to stay inside it; a full list needs a paid AV key or another provider.
- **Symbol suffix:** London listings need the `.LON` suffix, not `.L`. An empty `/refresh` result is usually a symbol problem.
- **Quota resets:** the daily 25-call cap resets at 04:00 UTC (05:00 UK). If everything is failing with rate-limit notes, you've likely exhausted the day's calls through testing.
- **12-month return on the free tier:** the free endpoint only gives ~100 days of history, so the 12-month figure fills in only after the daily cache has accrued a year of prices.
