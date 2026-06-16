# LSE Share Screener

A personal end-of-day screener for London-listed shares. A scheduled Cloudflare
Worker refreshes the data overnight; a static dashboard ranks the watchlist by a
weighted blend of four factors — **Momentum** (12m + 3m total return), **Value**
(low P/E + high yield), **Quality** (ROE + low gearing + earnings consistency)
and **Stability** (low volatility); an Alpha Vantage MCP connector handles
ad-hoc deep-dives inside Claude.

> Not financial advice. A ranking reflects past data and is a research starting
> point, not a buy signal.

## The three pieces

| File | What it is | Hosted on |
|------|------------|-----------|
| `screener-worker.js` | Data engine — nightly fetch + cache, serves JSON | Cloudflare **Workers** |
| `lse-screener.html` | The dashboard you actually look at | Cloudflare **Pages** |
| `screener-research-prompts.md` | Prompt library for the MCP connector | Not hosted — Notion / local |

**Data flow:** Worker (cron) → fetches from data provider → caches in KV →
dashboard reads that JSON → you. The dashboard never calls the data API directly.

## Prerequisites

- A Cloudflare account (free tier is fine for hosting).
- A market-data API key. The free Alpha Vantage tier (~25 calls/day, adjusted
  history gated) **won't** cover ~20 tickers — use a paid AV key or EODHD /
  Twelve Data for live use. (Budget ~2 calls/ticker on a normal day; ~4 once a
  month when the balance-sheet and earnings data refresh — see below.)
- Node.js installed (for `npx wrangler`).
- A Claude Pro/Max account (for the MCP connector).

---

## Part A — Deploy the Worker (data engine)

Run these from the folder containing `screener-worker.js`.

**1. Install + log in to Wrangler**
```bash
npm install -g wrangler      # or use npx wrangler for each command
wrangler login
```

**2. Create the KV store** (caches the daily snapshot + price history)
```bash
npx wrangler kv namespace create SCREENER
```
Copy the `id` it prints into the `kv_namespaces` line below.

**3. Create `wrangler.toml`** next to the worker file:
```toml
name = "lse-screener"
main = "screener-worker.js"
compatibility_date = "2025-01-01"

kv_namespaces = [{ binding = "SCREENER", id = "PASTE_KV_ID_HERE" }]

[triggers]
crons = ["30 18 * * 1-5"]   # 18:30 UTC, weekdays — after the LSE close
```

**4. Store your data API key as a secret** (never hard-code it)
```bash
npx wrangler secret put DATA_API_KEY
# paste the key when prompted
```

**5. Deploy**
```bash
npx wrangler deploy
```
You'll get a URL like `https://lse-screener.<you>.workers.dev`. Keep it.

**6. Seed the first snapshot** — the cron hasn't run yet, so populate it once
by hand by visiting:
```
https://lse-screener.<you>.workers.dev/refresh
```
Then visit the root URL — you should see JSON. After this, the cron keeps it
fresh automatically.

> **Symbol gotcha:** Alpha Vantage expects the `.LON` suffix for London listings
> (e.g. `TSCO.LON`), not `.L`. If `/refresh` returns an empty list, edit the
> `WATCHLIST` in the worker to use `.LON` and redeploy.

---

## Part B — Deploy the Dashboard (Pages)

**1. Point it at your Worker.** In `lse-screener.html`, set:
```js
const WORKER_URL = 'https://lse-screener.<you>.workers.dev';
```
(Left empty, it runs on demo data — useful for testing the UI.)

**2a. Deploy via GitHub** (the same flow as before)
- Push the repo to GitHub.
- Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → connect
  the repo.
- Build command: *none*. Output directory: the folder with the HTML (or root).

**2b. …or deploy from the CLI**
```bash
npx wrangler pages deploy .      # run from the folder with the HTML
```

**3. Tighten CORS.** Once you know your Pages domain, open the Worker's `fetch`
handler and change `'Access-Control-Allow-Origin': '*'` to your Pages URL, then
`npx wrangler deploy` again.

---

## Part C — The MCP connector (no hosting)

Nothing to deploy — it's configured inside Claude.

1. **claude.ai/settings/connectors** → **Add custom connector**.
2. URL: `https://mcp.alphavantage.co/mcp?apikey=YOUR_API_KEY` (or use OAuth and
   enter the key when prompted).
3. Keep `screener-research-prompts.md` in Notion. Paste its **House Definitions**
   block at the start of a session so the connector's numbers match the dashboard.

---

## Daily rhythm

1. **Overnight — nothing to do.** The Worker's cron refreshes the snapshot on
   Cloudflare's servers (your laptop can be off).
2. **Morning (~2 min).** Open the bookmarked dashboard. Drag the factor weights
   to taste; read the ranking.
3. **Drill down.** For any name worth a closer look, switch to Claude + the AV
   connector and run a prompt (value-trap check, dividend-safety check, etc).

The loop: *auto-refresh nightly → scan in the morning → deep-dive one or two names.*

---

## Maintenance & cost

- **Change the watchlist:** edit `WATCHLIST` in the worker, redeploy. Add company
  names/tiers to the `META` map in the HTML so they show up labelled.
- **Quality data cadence:** ROE updates with the daily fundamentals call; gearing
  (D/E) and earnings consistency come from balance-sheet and earnings reports
  cached for `FUND_TTL_DAYS` (30) since they only change at reporting time.
- **Adjust the schedule:** edit the `crons` line in `wrangler.toml`.
- **Cost:** Pages, Workers and KV sit inside Cloudflare's free tier at this scale.
  The only real cost is the market-data plan.
- **Re-seed any time:** hit `/refresh` to force an immediate update.
