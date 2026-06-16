// ───────────────────────────────────────────────────────────────────────────
// LSE Screener — Cloudflare Worker (data pipeline)  ·  v3: durable-quality
//
// What it does:
//   1. On a daily cron, builds a price history per ticker and derives 12-month
//      return, 3-month return and annualised volatility; reads P/E, yield and
//      ROE from a fundamentals call; and derives a QUALITY pair — debt-to-equity
//      (gearing) and earnings consistency — from balance-sheet & earnings data.
//      Caches one JSON snapshot.
//   2. On HTTP GET, serves that snapshot to the static dashboard.
//
// The maths (totalReturn / annualisedVol / debtToEquity / earningsConsistency
// and helpers) is unit-tested against known inputs — don't tweak it casually.
//
// ── Call budget (matters on metered tiers) ───────────────────────────────────
//   • Daily per ticker: series (compact) + OVERVIEW = ~2 calls.
//   • Monthly per ticker: + BALANCE_SHEET + EARNINGS = 2 more, cached for
//     FUND_TTL_DAYS so they don't refetch daily (these only change at reporting).
//   So most days cost ~2 calls/ticker; once a month, ~4. The free Alpha Vantage
//   tier (25/day, adjusted history gated) still won't cover ~20 tickers — use a
//   paid AV key or EODHD / Twelve Data. Only the fetch* functions are
//   provider-specific; the maths and caching are not.
//
// ── Setup ────────────────────────────────────────────────────────────────────
//   wrangler.toml:
//     name = "lse-screener"
//     main = "screener-worker.js"
//     compatibility_date = "2025-01-01"
//     kv_namespaces = [{ binding = "SCREENER", id = "<your-kv-id>" }]
//     [triggers]
//     crons = ["30 18 * * 1-5"]   # 18:30 UTC weekdays, after LSE close
//   Secret:  npx wrangler secret put DATA_API_KEY
// ─────────────────────────────────────────────────────────────────────────────

const WATCHLIST = [
  // Trimmed to 5 with the .LON suffix Alpha Vantage uses for LSE, to stay inside
  // the free 25-calls/day cap while you test. Expand once on a paid/other plan.
  'SHEL.LON','AZN.LON','HSBA.LON','ULVR.LON','TSCO.LON',
  // Full set (re-enable later):
  // 'BP.LON','GSK.LON','RIO.LON','BATS.LON','DGE.LON','LSEG.LON','REL.LON',
  // 'NG.LON','RR.LON','BARC.LON','LLOY.LON','VOD.LON','GLEN.LON','PRU.LON','AAL.LON',
];

const SNAPSHOT_KEY  = 'snapshot:v1';
const CURSOR_KEY    = 'cursor:v1';   // index of the next ticker to refresh (round-robin)
const RET_12M_DAYS  = 365;   // calendar days
const RET_3M_DAYS   = 91;
const VOL_WINDOW    = 252;   // trading days (~1yr) of daily returns
const SERIES_KEEP   = 520;   // ~2yr of price points retained per ticker
const FUND_TTL_DAYS = 30;    // refetch balance-sheet/earnings at most monthly
// Free Alpha Vantage tier: uses TIME_SERIES_DAILY (raw close) + compact history,
// the endpoints a free key can reach. This means PRICE return (dividends
// excluded) and ~100 days of history, so 12-month return fills in only after the
// daily cache accrues a year. Set false once you have a premium AV key (or have
// adapted the fetchers to EODHD/Twelve Data) to restore adjusted TOTAL return.
const USE_FREE_TIER = true;
const EPS_YEARS     = 5;     // years of EPS used for the consistency score
// Free Alpha Vantage caps BOTH ways: 25 calls/day AND 5 calls/minute. The daily
// cap we manage with caching + a small watchlist; the per-minute cap we manage
// here by spacing EVERY provider call ≥ this gap apart (≥12s → ≤5/min). One
// ticker is ≤4 calls (~40s), which is why the refresh is incremental — one ticker
// per invocation (see refreshNext) rather than the whole list in one go.
const MIN_CALL_GAP_MS = 13000;

export default {
  // One ticker per invocation. The cron fires several staggered ticks after the
  // LSE close (see wrangler.toml), so the round-robin cursor walks the whole
  // watchlist over a few minutes — each tick is short (≤4 calls, ~40s) and stays
  // comfortably inside the Worker time limit and the 5-calls/min cap.
  async scheduled(event, env, ctx){ await refreshNext(env); },

  async fetch(request, env, ctx){
    const cors = {
      'Access-Control-Allow-Origin': '*',           // tighten to your Pages domain
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=900',
    };
    if (new URL(request.url).pathname === '/refresh'){
      // Manual single step: refresh just the NEXT ticker and return its result.
      // Awaited inline (≤4 calls, ~40s) — no background waitUntil to be cancelled.
      // Call it once per ticker to step through the list (5× for a full pass).
      const r = await refreshNext(env);
      return new Response(JSON.stringify({ ok:true, ...r }), { headers:cors });
    }
    const cached = await env.SCREENER.get(SNAPSHOT_KEY);
    if (!cached) return new Response(JSON.stringify({ error:'No snapshot yet. Hit /refresh.' }),
      { status:503, headers:cors });
    return new Response(cached, { headers:cors });
  },
};

// ── Refresh exactly ONE ticker (the one at the cursor), then advance ───────────
// Incremental by design: a single invocation can't make all ~20 calls within the
// Worker time limit AND the 5/min cap, so each call/tick does one ticker, upserts
// it into the shared snapshot, and moves the cursor on. A failed ticker keeps its
// previous snapshot entry (we only overwrite on success) and the cursor still
// advances, so one bad symbol never wedges the rotation.
async function refreshNext(env){
  const idx    = await getCursor(env);
  const ticker = WATCHLIST[idx];
  let ok = false;
  try {
    const entry = await fetchOne(ticker, env);
    await upsertStock(env, entry);
    ok = true;
  } catch (err){
    console.error(`Failed ${ticker}:`, err.message);   // keep prior data, don't abort
  }
  const next = (idx + 1) % WATCHLIST.length;
  await env.SCREENER.put(CURSOR_KEY, String(next));
  return { ticker, ok, position: idx + 1, total: WATCHLIST.length, next: WATCHLIST[next],
    note: ok ? 'Ticker refreshed. Call /refresh again for the next one.'
             : 'Ticker failed (see `wrangler tail`). Cursor advanced; call /refresh again.' };
}

// Round-robin cursor, clamped so a watchlist edit can't leave it out of range.
async function getCursor(env){
  const n = parseInt(await env.SCREENER.get(CURSOR_KEY), 10);
  return (Number.isInteger(n) && n >= 0 && n < WATCHLIST.length) ? n : 0;
}

// Insert-or-replace this ticker in the served snapshot, keeping the others intact.
async function upsertStock(env, entry){
  const raw  = await env.SCREENER.get(SNAPSHOT_KEY);
  const snap = raw ? JSON.parse(raw) : { updated:null, count:0, stocks:[] };
  if (!Array.isArray(snap.stocks)) snap.stocks = [];
  const i = snap.stocks.findIndex(s => s.tkr === entry.tkr);
  if (i >= 0) snap.stocks[i] = entry; else snap.stocks.push(entry);
  snap.updated = new Date().toISOString();
  snap.count   = snap.stocks.length;
  await env.SCREENER.put(SNAPSHOT_KEY, JSON.stringify(snap));
}

// ── One ticker: price/returns/vol + value/quality fundamentals ────────────────
async function fetchOne(ticker, env){
  const series   = await getSeries(ticker, env);          // ascending by date
  const overview = await fetchOverview(ticker, env.DATA_API_KEY);
  const extras   = await getQualityExtras(ticker, env);   // {de, econ}, cached monthly
  const latest   = series[series.length - 1] || null;

  return {
    tkr:   ticker.split('.')[0],
    price: latest ? Math.round(latest.close) : null,  // raw close = actual price
    r12:   totalReturn(series, RET_12M_DAYS),
    r3:    totalReturn(series, RET_3M_DAYS),
    vol:   annualisedVol(series, VOL_WINDOW),
    pe:    num(overview.PERatio),
    yield: pctNum(overview.DividendYield),            // AV gives a decimal → %
    roe:   pctNum(overview.ReturnOnEquityTTM),
    de:    extras.de,                                 // debt-to-equity (lower better)
    econ:  extras.econ,                               // earnings consistency 0..1
  };
}

// ── Price series with delta caching: full once, then top up with compact ─────
async function getSeries(ticker, env){
  const key = 'series:' + ticker;
  const cachedRaw = await env.SCREENER.get(key);
  const cached = cachedRaw ? JSON.parse(cachedRaw) : null;

  const size = USE_FREE_TIER ? 'compact'
             : ((cached && cached.length > 150) ? 'compact' : 'full');
  const fresh = await fetchSeries(ticker, env.DATA_API_KEY, size);

  const byDate = new Map();
  (cached || []).forEach(p => byDate.set(p.date, p));
  fresh.forEach(p => byDate.set(p.date, p));        // fresh overwrites stale
  const merged = [...byDate.values()]
    .sort((a, b) => a.date < b.date ? -1 : 1)
    .slice(-SERIES_KEEP);

  await env.SCREENER.put(key, JSON.stringify(merged));
  return merged;
}

// ── Quality extras (gearing + earnings consistency), cached monthly ───────────
async function getQualityExtras(ticker, env){
  const key = 'fund:' + ticker;
  const cachedRaw = await env.SCREENER.get(key);
  if (cachedRaw){
    const c = JSON.parse(cachedRaw);
    const ageDays = (Date.now() - new Date(c.fetchedAt).getTime()) / 86400000;
    if (ageDays < FUND_TTL_DAYS) return { de: c.de, econ: c.econ };
  }
  // stale or missing → refetch the two reporting-cadence endpoints.
  // Sequential (not Promise.all) so each goes through the throttle on its own —
  // firing them in parallel would put 2 calls in the same instant and bust 5/min.
  const bs   = await fetchBalanceSheet(ticker, env.DATA_API_KEY);
  const earn = await fetchEarnings(ticker, env.DATA_API_KEY);
  const de   = debtToEquity(bs && bs.annualReports && bs.annualReports[0]);
  const econ = earningsConsistency(earn && earn.annualReports, EPS_YEARS);
  await env.SCREENER.put(key, JSON.stringify({ de, econ, fetchedAt: new Date().toISOString() }));
  return { de, econ };
}

// ── Per-call throttle: keep every Alpha Vantage call ≥ MIN_CALL_GAP_MS apart so
//    a burst never trips the free 5-requests/minute cap. Module-scoped clock is
//    fine here: refresh() awaits calls strictly sequentially.
let _lastCallAt = 0;
async function avFetch(url){
  const wait = _lastCallAt + MIN_CALL_GAP_MS - Date.now();
  if (wait > 0) await sleep(wait);
  _lastCallAt = Date.now();
  return fetch(url).then(r => r.json());
}

// ── Provider-specific fetches (Alpha Vantage) ────────────────────────────────
async function fetchSeries(ticker, key, size){
  const fn = USE_FREE_TIER ? 'TIME_SERIES_DAILY' : 'TIME_SERIES_DAILY_ADJUSTED';
  const url = 'https://www.alphavantage.co/query'
    + `?function=${fn}&symbol=${ticker}`
    + `&outputsize=${size}&apikey=${key}`;
  const json = await avFetch(url);
  const ts = json['Time Series (Daily)'];
  if (!ts) throw new Error(json.Note || json.Information || json['Error Message'] || 'no series');
  return Object.entries(ts).map(([date, o]) => {
    const raw = parseFloat(o['4. close']);
    const adj = parseFloat(o['5. adjusted close']);                  // absent on the free endpoint
    return { date, close: raw, adj: Number.isFinite(adj) ? adj : raw };  // → falls back to raw close
  }).sort((a, b) => a.date < b.date ? -1 : 1);
}

async function fetchOverview(ticker, key){
  const url = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${ticker}&apikey=${key}`;
  return avFetch(url);
}
async function fetchBalanceSheet(ticker, key){
  const url = `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${ticker}&apikey=${key}`;
  return avFetch(url);
}
async function fetchEarnings(ticker, key){
  const url = `https://www.alphavantage.co/query?function=EARNINGS&symbol=${ticker}&apikey=${key}`;
  return avFetch(url);
}

// ═══════════════════════════════════════════════════════════════════════════
//  PURE MATHS — unit-tested. Returns null on insufficient/bad data (never NaN).
// ═══════════════════════════════════════════════════════════════════════════
function isoMinusDays(iso, days){
  const d = new Date(iso + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}
function closeOnOrBefore(series, target){
  let res = null;
  for (const p of series){ if (p.date <= target) res = p; else break; }
  return res;
}
function totalReturn(series, calDays){
  if (series.length < 2) return null;
  const latest = series[series.length - 1];
  const past = closeOnOrBefore(series, isoMinusDays(latest.date, calDays));
  if (!past || !(past.adj > 0) || !(latest.adj > 0)) return null;
  return (latest.adj / past.adj - 1) * 100;
}
function annualisedVol(series, window){
  const pts = series.slice(-(window + 1));
  const rets = [];
  for (let i = 1; i < pts.length; i++){
    const a = pts[i-1].adj, b = pts[i].adj;
    if (a > 0 && b > 0) rets.push(Math.log(b / a));
  }
  if (rets.length < 20) return null;
  const mean = rets.reduce((s, x) => s + x, 0) / rets.length;
  const variance = rets.reduce((s, x) => s + (x - mean) ** 2, 0) / (rets.length - 1);
  return Math.sqrt(variance) * Math.sqrt(252) * 100;
}
// Debt-to-equity (lower better). Negative/zero equity → null (often buyback-
// driven, not necessarily distress — safer to skip than mis-rank as low-geared).
function debtToEquity(report){
  if (!report) return null;
  const eq = num(report.totalShareholderEquity);
  if (eq == null || eq <= 0) return null;
  let debt = num(report.shortLongTermDebtTotal);
  if (debt == null){
    const s = num(report.shortTermDebt) || 0;
    const l = num(report.longTermDebt) || 0;
    debt = (report.shortTermDebt == null && report.longTermDebt == null) ? null : s + l;
  }
  if (debt == null) return null;
  return debt / eq;
}
// Earnings consistency 0..1 (higher better). Rewards reliably-positive, smoothly
// changing EPS; penalises loss years and erratic swings. null if < 3 years.
function earningsConsistency(annualReports, maxYears){
  if (!Array.isArray(annualReports)) return null;
  const eps = annualReports.slice(0, maxYears).map(r => num(r.reportedEPS)).filter(v => v != null);
  if (eps.length < 3) return null;
  const posFrac = eps.filter(v => v > 0).length / eps.length;
  const chron = [...eps].reverse();                  // oldest → newest
  const g = [];
  for (let i = 1; i < chron.length; i++){
    const prev = chron[i-1];
    if (prev !== 0){
      let r = (chron[i] - prev) / Math.abs(prev);
      r = Math.max(-1, Math.min(1, r));              // cap ±100%
      g.push(r);
    }
  }
  let smoothness = 1;
  if (g.length >= 2){
    const mean = g.reduce((a, b) => a + b, 0) / g.length;
    const variance = g.reduce((a, b) => a + (b - mean) ** 2, 0) / (g.length - 1);
    smoothness = 1 / (1 + Math.sqrt(variance));
  }
  return posFrac * smoothness;
}

// ── Small parse helpers ───────────────────────────────────────────────────────
const num = v => { const n = parseFloat(v); return Number.isFinite(n) ? n : null; };
const pctNum = v => { const n = parseFloat(v); return Number.isFinite(n) ? n * 100 : null; };
const sleep = ms => new Promise(r => setTimeout(r, ms));
