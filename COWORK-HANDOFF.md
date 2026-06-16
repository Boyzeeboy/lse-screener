# LSE Screener — Cowork Handoff

Context for continuing deployment/debugging in Cowork. Read this first.

**Status (2026-06-16):** root cause found and fixed in code. Code is ready to
deploy; **live data can't be verified until the Alpha Vantage daily quota resets
at 04:00 UTC / 05:00 UK on 2026-06-17.**

## What this project is

A personal end-of-day LSE share screener:
- **`screener-worker.js`** — Cloudflare Worker. Fetches price + fundamentals from
  Alpha Vantage, caches a JSON snapshot in KV (binding `SCREENER`), serves it.
  Runs on a cron; can be stepped manually via `/refresh`.
- **`public/index.html`** — static dashboard (Cloudflare Pages). Reads the
  Worker's JSON and ranks shares by a weighted composite (Momentum / Value /
  Quality / Stability), with a Buffett weight preset and a rules-based "Signal"
  column. Has a `WORKER_URL` constant near the top.
- **`wrangler.toml`** — Worker config (KV id + staggered crons).
- **`README.md`**, **`screener-research-prompts.md`** — docs.

Repo is on GitHub. Worker is live at
**`https://lse-screener.wgrossiter.workers.dev`**.

## Diagnosis (confirmed this session)

The empty snapshot (`{"count":0,"stocks":[]}`) was **NOT** a code-logic bug, a
bad symbol, or an unsupported endpoint. Verified by direct Alpha Vantage calls:

- `TIME_SERIES_DAILY` and `GLOBAL_QUOTE` for `TSCO.LON` both return live data, so
  the **`.LON` symbol, the free endpoint, and the key all work**. (Worst-case
  "switch providers" is ruled out.)
- `wrangler tail` during a `/refresh` showed every ticker failing with
  *"standard API rate limit is 25 requests per day"* → the **daily 25-call cap**
  was exhausted by repeated testing. Resets **04:00 UTC (05:00 UK)** daily.
- The original code also had a real bug: it throttled *between tickers* (1.2s)
  but fired ~4 calls per ticker back-to-back, bursting ~20 calls at once and
  tripping the separate **5-calls/minute** cap.
- An attempted "background `/refresh`" (via `ctx.waitUntil`) was **cancelled by
  Cloudflare** before a ~5-min throttled run could finish — a single invocation
  can't make all the calls within the Worker time limit.

## Fixes applied this session (in `screener-worker.js` + `wrangler.toml`)

1. **Per-call throttle.** Every Alpha Vantage call now routes through `avFetch()`,
   which spaces calls ≥ `MIN_CALL_GAP_MS` (13s) apart → stays under 5/min. The
   balance-sheet/earnings pair was changed from `Promise.all` to sequential so it
   doesn't burst two calls at once.
2. **Incremental rotating refresh.** Replaced the whole-watchlist `refresh()` with
   `refreshNext()`: each invocation refreshes **one** ticker (≤4 calls, ~40s),
   upserts it into the snapshot, and advances a round-robin cursor in KV
   (`cursor:v1`). A failed ticker keeps its prior data and the cursor still
   advances, so one bad symbol can't wedge the rotation. This survives the Worker
   time limit and both rate caps.
3. **`/refresh` = single step.** Now awaited inline (no background `waitUntil`),
   returns `{ok,ticker,position,total,next,note}`. The curl pauses ~40s before
   responding — that's the throttle, not a hang. Call it once per ticker (5× for
   a full pass).
4. **Staggered cron.** `wrangler.toml` now has 5 ticks 2 min apart
   (18:30–18:38 UTC, Mon–Fri) so the cursor walks the 5-ticker watchlist in one
   daily pass after the LSE close. **Add one tick per ticker if the watchlist
   grows.**

All JS passes `node --check`; the financial maths is untouched (still unit-tested).

## Immediate next steps

1. **Deploy now (free — no API calls):**
   ```
   npx wrangler deploy        # pushes new code AND the 5 staggered cron triggers
   ```
2. **Do NOT test today** — the 25/day quota is spent until 05:00 UK on 2026-06-17.
   `/refresh` will only log "25 per day" errors until then.
3. **Commit the changes:**
   ```
   git add screener-worker.js wrangler.toml COWORK-HANDOFF.md
   git commit -m "Throttle AV calls under 5/min; incremental rotating refresh; staggered cron"
   git push
   ```
4. **After 05:00 UK on 2026-06-17, populate it** — either:
   - *Hands-off:* do nothing; the cron runs 18:30–18:38 UTC and fills all five.
   - *Manual:* run `curl https://lse-screener.wgrossiter.workers.dev/refresh`
     five times (wait for each ~40s response). After the fifth, the root URL
     shows `count:5`. Use `npx wrangler tail` in another tab to watch.

## Operating notes

- **Call budget:** cold first pass = 20 calls (4×5 tickers). After that,
  balance-sheet/earnings are cached `FUND_TTL_DAYS` (30 days), so daily cost drops
  to ~10 (≈2/ticker) — comfortably under 25.
- The **API key is a Wrangler secret** (`DATA_API_KEY`), never in the repo. It was
  exposed in the Cowork chat this session for one diagnostic call — **consider
  rotating it**: `npx wrangler secret put DATA_API_KEY`.
- Two deploy targets, keep in sync: `npx wrangler deploy` (→ Cloudflare, makes it
  run) and `git push` (→ GitHub, versions it).

## Still pending after data flows

1. **Dashboard (Pages):** set `WORKER_URL` in `public/index.html` to the Worker
   URL, deploy to Cloudflare Pages (output dir `public`), commit.
2. **Tighten CORS:** change `'Access-Control-Allow-Origin': '*'` in the Worker to
   the Pages domain, redeploy.
3. **Expand watchlist to 20:** needs a paid AV tier (or swap to EODHD / Twelve
   Data — only the `fetch*` functions change; set `USE_FREE_TIER = false` for AV
   premium to restore adjusted total return). Add one cron tick per added ticker.
4. **(Later)** backtest the Signal rule before trusting it.

## Verified already (don't re-litigate)

The financial maths (returns, volatility, debt-to-equity, earnings consistency)
is unit-tested; the scoring + signal logic runs clean; all JS passes
`node --check`. The `.LON` symbol + free endpoint + key are confirmed working.
Remaining work is Cloudflare wiring + waiting out the daily quota, not code
correctness.
