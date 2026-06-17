# LSE Share Screener

A personal end-of-day screener for London-listed shares. A scheduled Cloudflare
Worker refreshes the data overnight from Yahoo Finance; a static dashboard ranks
the watchlist by a weighted blend of four factors — **Momentum** (12m + 3m total
return), **Value** (low P/E + high yield), **Quality** (ROE + low gearing +
earnings consistency) and **Stability** (low volatility); an Alpha Vantage MCP
connector handles ad-hoc deep-dives inside Claude.

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
- Node.js installed (for `npx wrangler`).
- A Claude Pro/Max account (for the MCP connector — optional, only for the
  ad-hoc deep-dives in Part C).

The Worker pulls from Yahoo Finance's unofficial `query1` endpoints — no API
key, no rate limit. They are unsupported, so if Yahoo ever blocks Cloudflare's
egress IPs you'd need to fall back to a paid wrapper (RapidAPI yahoo-finance15,
yahoofinanceapi.com) or another provider (EODHD, Twelve Data). Only the
`fetch*` functions in `screener-worker.js` are provider-specific.

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

**4. Deploy**
```bash
npx wrangler deploy
```
You'll get a URL like `https://lse-screener.<you>.workers.dev`. Keep it.

**5. Seed the first snapshot** — the cron hasn't run yet, so populate it once
by hand by visiting:
```
https://lse-screener.<you>.workers.dev/refresh
```
Then visit the root URL — you should see JSON. After this, the cron keeps it
fresh automatically.

> **Symbol gotcha:** Yahoo expects the `.L` suffix for London listings
> (e.g. `TSCO.L`), not Alpha Vantage's `.LON`. If `/refresh` returns an empty
> list, double-check the suffix in `WATCHLIST`.

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
- **Quality data cadence:** all factors refresh on every cron run — Yahoo's
  `quoteSummary` endpoint returns price-derived (P/E, yield), TTM (ROE) and
  reporting-cadence (balance sheet, income history) figures in a single call.
- **Adjust the schedule:** edit the `crons` line in `wrangler.toml`.
- **Cost:** Pages, Workers and KV sit inside Cloudflare's free tier at this scale.
  No data plan needed — Yahoo's unofficial endpoints are free.
- **Re-seed any time:** hit `/refresh` to force an immediate update.
