# LSE Share Screener - Architecture

How the system is put together, where each piece runs, and what to touch when it changes.

_Last updated: 23 August 2026_

> See also: [`README.md`](README.md) for deployment steps and [`COWORK-HANDOFF.md`](COWORK-HANDOFF.md) for debugging context.

---

## 1. What This Is

The LSE Share Screener is a personal end-of-day dashboard for London-listed shares. A Cloudflare Worker refreshes a watchlist from Yahoo Finance after the London close, stores one JSON snapshot in Cloudflare KV, and a static Pages dashboard reads that snapshot and ranks the shares by weighted factors.

The dashboard is a research starting point, not a trading system and not financial advice.

---

## 2. Moving Parts

| Piece | What it does | Where it runs |
|-------|--------------|---------------|
| `screener-worker.js` | Fetches Yahoo data, computes metrics, writes and serves the snapshot | Cloudflare Workers |
| `public/index.html` | Static dashboard; reads the Worker JSON and ranks the watchlist in-browser | Cloudflare Pages |
| KV namespace `SCREENER` | Stores the latest JSON snapshot at `snapshot:v1` | Cloudflare KV |
| Yahoo Finance | Unofficial market-data source for prices and fundamentals | External service |
| `screener-research-prompts.md` | Optional prompt library for deeper research | Local / Notion / Claude |

The dashboard never calls Yahoo directly. Yahoo access is isolated inside the Worker, so provider changes should mostly stay inside the `fetchSeries`, `fetchFundamentals`, `yahooJson`, and `yahooJsonAuth` functions.

---

## 3. Data Flow

```text
Cron tick or authorized /refresh
      |
      v
  refreshAll(env)
      |
      +--> getYahooCrumb()
      |
      +--> batches of fetchOne(ticker)
              |
              +--> fetchSeries(ticker)
              +--> fetchFundamentals(ticker, auth)
              +--> compute returns, momentum, volatility, value and quality fields
      |
      v
  KV: snapshot:v1
      |
      v
  Worker HTTP GET /
      |
      v
  public/index.html dashboard
```

Normal use has two paths:

- Refresh path: the scheduled Worker cron calls `refreshAll(env)` and rebuilds the whole watchlist snapshot.
- Read path: the dashboard performs one GET to the Worker root URL and receives the cached snapshot JSON.

Manual refresh is available at `/refresh`, but it is protected by `REFRESH_TOKEN`.

---

## 4. Worker Design

The Worker exposes two entry points:

| Entry point | Behavior |
|-------------|----------|
| `scheduled(event, env, ctx)` | Runs from Cloudflare cron and refreshes the full watchlist |
| `fetch(request, env, ctx)` | Serves cached JSON, individual stock JSON, or protected manual refresh |

HTTP routes:

| Route | Response |
|-------|----------|
| `/` | Latest `snapshot:v1` JSON from KV |
| `/stock/:ticker` | One stock row from the latest snapshot, plus `updated` |
| `/refresh` | Rebuilds the full snapshot if authorized |

`/refresh` accepts either:

```text
Authorization: Bearer <REFRESH_TOKEN>
X-Refresh-Token: <REFRESH_TOKEN>
```

If `REFRESH_TOKEN` is missing from the Worker environment, manual refresh is denied. Scheduled cron refresh does not need the token.

---

## 5. Yahoo Provider

The Worker uses Yahoo Finance's unofficial endpoints:

| Function | Endpoint | Used for |
|----------|----------|----------|
| `fetchSeries` | `query1.finance.yahoo.com/v8/finance/chart/:ticker` | 2 years of daily prices, adjusted close, dividends and splits |
| `fetchFundamentals` | `query2.finance.yahoo.com/v10/finance/quoteSummary/:ticker` | P/E, dividend yield, ROE, debt-to-equity and income history |
| `getYahooCrumb` | `fc.yahoo.com` plus `query2.finance.yahoo.com/v1/test/getcrumb` | Session cookie and crumb for `quoteSummary` |

Yahoo uses `.L` suffixes for London listings, for example `TSCO.L`. The dashboard strips that suffix in the served ticker field, so the UI shows `TSCO`.

The provider is unofficial and can break without notice. If that happens, keep the scoring and snapshot contract stable and replace only the provider-specific fetch layer.

---

## 6. Refresh Model

`refreshAll(env)` refreshes the complete `WATCHLIST` in one invocation:

1. Fetches a Yahoo crumb and cookie.
2. Reads the prior `snapshot:v1` from KV.
3. Processes tickers in batches of `BATCH_SIZE`.
4. Calls `fetchOne(ticker, auth)` for each ticker.
5. Keeps a prior row for any ticker that fails during refresh.
6. Writes a new snapshot to KV.

Current constants:

| Constant | Meaning |
|----------|---------|
| `WATCHLIST` | Yahoo tickers to refresh, using `.L` suffixes |
| `SNAPSHOT_KEY` | KV key for the served snapshot, currently `snapshot:v1` |
| `BATCH_SIZE` | Number of tickers fetched concurrently per batch |
| `RET_12M_DAYS` | Calendar days for 12-month return |
| `RET_3M_DAYS` | Calendar days for 3-month return |
| `MOM_LAG_DAYS` | Days skipped for 12-1 momentum |
| `VOL_WINDOW` | Trading-day window for annualised volatility |
| `EPS_YEARS` | Number of annual reports used for earnings consistency |

This version does not keep separate per-ticker price or fundamentals caches. The only persistent data is the latest snapshot.

---

## 7. Snapshot Contract

The Worker writes:

```json
{
  "updated": "2026-08-23T18:30:00.000Z",
  "count": 20,
  "stocks": [
    {
      "tkr": "TSCO",
      "price": 368,
      "r12": 13.8,
      "r3": 2.4,
      "mom": 9.5,
      "vol": 16.2,
      "pe": 13.2,
      "yield": 3.5,
      "roe": 13.9,
      "de": 0.8,
      "econ": 0.74
    }
  ]
}
```

Field meanings:

| Field | Meaning | Computed where |
|-------|---------|----------------|
| `price` | Latest close, rounded to pence | Worker |
| `r12` | 12-month adjusted total return, percent | Worker |
| `r3` | 3-month adjusted total return, percent | Worker |
| `mom` | 12-1 month adjusted return, percent | Worker |
| `vol` | Annualised volatility, percent | Worker |
| `pe` | Trailing P/E | Yahoo summary detail / key statistics |
| `yield` | Dividend yield, percent | Yahoo summary detail |
| `roe` | Return on equity, percent | Yahoo financial data |
| `de` | Debt-to-equity ratio | Yahoo financial data |
| `econ` | Earnings consistency score from 0 to 1 | Worker |

The dashboard enriches rows with company names and index tiers from its local `META` map, then computes percentile ranks, factor scores, composite score and signal labels in-browser.

---

## 8. Security And CORS

The Worker intentionally separates public reads from private refresh:

- Public: `GET /` and `GET /stock/:ticker`.
- Private: `GET /refresh`, protected by `REFRESH_TOKEN`.

CORS is restricted by `ALLOWED_ORIGIN`. If unset, the Worker defaults to:

```text
https://lse-screener.pages.dev
```

Requests with no `Origin` header are allowed so command-line tools, cron internals and direct server-to-server calls still work. Browser requests from any other origin receive `403`.

Set the values with Wrangler:

```bash
npx wrangler secret put REFRESH_TOKEN
npx wrangler vars set ALLOWED_ORIGIN https://your-pages-domain.pages.dev
```

---

## 9. Deployment Model

There are two deployment targets:

| Command | What it deploys |
|---------|-----------------|
| `npx wrangler deploy` | Worker code, KV binding and cron schedule |
| `npx wrangler pages deploy public` | Static dashboard |

The dashboard also has a hardcoded Worker URL:

```js
const WORKER_URL = 'https://lse-screener.<you>.workers.dev';
```

If the Worker URL changes, update `public/index.html` and redeploy Pages. If the Pages domain changes, update `ALLOWED_ORIGIN` and redeploy or update the Worker environment.

---

## 10. Operating Notes

Daily flow:

1. The cron runs at `18:30 UTC` on weekdays, after the LSE close.
2. The Worker refreshes the full watchlist and writes `snapshot:v1`.
3. The dashboard reads the cached snapshot when opened.

Manual seed or refresh:

```bash
curl -H "Authorization: Bearer $REFRESH_TOKEN" \
  https://lse-screener.<you>.workers.dev/refresh
```

Common changes:

- Add a ticker: update `WATCHLIST` in `screener-worker.js`, add metadata in `META` inside `public/index.html`, redeploy both if needed.
- Change the Pages domain: update `ALLOWED_ORIGIN`.
- Change refresh time: edit the cron in `wrangler.toml` and run `npx wrangler deploy`.
- Switch providers: keep the snapshot fields stable and replace the provider fetch functions.

---

## 11. Known Tradeoffs

- Yahoo Finance is unofficial and may change its crumb, cookie or response behavior.
- Fundamentals are fetched on every refresh rather than cached separately.
- A failed ticker keeps its prior row only if a previous snapshot exists.
- The dashboard score is relative to the current watchlist, not an absolute market score.
- Signal labels are transparent gates for research triage, not backtested investment advice.
