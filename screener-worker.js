// ───────────────────────────────────────────────────────────────────────────
// LSE Screener — Cloudflare Worker (data pipeline)  ·  v4: Yahoo Finance
//
// What it does:
//   1. On a daily cron, builds a price history per ticker and derives 12-month
//      return, 3-month return and annualised volatility; reads P/E, yield and
//      ROE from a quoteSummary call; and derives a QUALITY pair — debt-to-equity
//      (gearing) and earnings consistency — from balance-sheet & income data.
//      Caches one JSON snapshot.
//   2. On HTTP GET, serves that snapshot to the static dashboard.
//
// The maths (totalReturn / annualisedVol / earningsConsistency and helpers) is
// unit-tested against known inputs — don't tweak it casually.
//
// ── Provider ────────────────────────────────────────────────────────────────
// Uses Yahoo Finance's *unofficial* query endpoints (v8/finance/chart and
// v10/finance/quoteSummary). No API key needed, but quoteSummary requires a
// crumb+cookie pair obtained per-session from Yahoo's consent flow. Trade-off:
// unsupported, can break without notice. If a future Yahoo change blocks the
// Worker's egress IPs, fall back to a paid wrapper (RapidAPI yahoo-finance15,
// yahoofinanceapi.com) or another provider (EODHD, Twelve Data) — only the
// fetch* functions are provider-specific; the maths and caching are not.
//
// ── Setup ───────────────────────────────────────────────────────────────────
//   wrangler.toml:
//     name = "lse-screener"
//     main = "screener-worker.js"
//     compatibility_date = "2025-01-01"
//     kv_namespaces = [{ binding = "SCREENER", id = "<your-kv-id>" }]
//     [triggers]
//     crons = ["30 18 * * 1-5"]   # 18:30 UTC weekdays, after LSE close
//   No secret required — Yahoo's unofficial endpoints are unauthenticated.
// ─────────────────────────────────────────────────────────────────────────────

const WATCHLIST = [
  // Yahoo uses .L (not Alpha Vantage's .LON) for LSE listings.
  'SHEL.L','AZN.L','HSBA.L','ULVR.L','TSCO.L',
  'BP.L','GSK.L','RIO.L','BATS.L','DGE.L','LSEG.L','REL.L',
  'NG.L','RR.L','BARC.L','LLOY.L','VOD.L','GLEN.L','PRU.L','AAL.L',
];

const SNAPSHOT_KEY = 'snapshot:v1';
const RET_12M_DAYS = 365;   // calendar days
const RET_3M_DAYS  = 91;
const VOL_WINDOW   = 252;   // trading days (~1yr) of daily returns
const EPS_YEARS    = 5;     // years of EPS used for the consistency score
const BATCH_SIZE   = 5;     // tickers per parallel batch (5 × 2 calls = 10 concurrent)

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

export default {
  async scheduled(event, env, ctx){ await refreshAll(env); },

  async fetch(request, env, ctx){
    const cors = {
      'Access-Control-Allow-Origin': 'https://lse-screener.pages.dev',
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=900',
    };
    const path = new URL(request.url).pathname;
    if (path === '/refresh'){
      const r = await refreshAll(env);
      return new Response(JSON.stringify({ ok:true, ...r }), { headers:cors });
    }
    const cached = await env.SCREENER.get(SNAPSHOT_KEY);
    if (!cached) return new Response(JSON.stringify({ error:'No snapshot yet. Hit /refresh.' }),
      { status:503, headers:cors });
    return new Response(cached, { headers:cors });
  },
};

// ── Yahoo crumb/cookie auth ─────────────────────────────────────────────────
// Yahoo's v10 quoteSummary requires a crumb+cookie obtained per-session. The
// v8 chart endpoint works without it, but we need both per ticker.
async function getYahooCrumb(){
  // Step 1: hit fc.yahoo.com to receive consent cookies
  const consentRes = await fetch('https://fc.yahoo.com/', {
    headers: { 'User-Agent': UA },
    redirect: 'manual',
  });
  // Consume body to avoid stalled-response warning
  await consentRes.text();
  const setCookies = consentRes.headers.getAll('set-cookie');
  const cookieStr = setCookies.map(c => c.split(';')[0]).join('; ');

  // Step 2: exchange cookies for a crumb token
  const crumbRes = await fetch('https://query2.finance.yahoo.com/v1/test/getcrumb', {
    headers: { 'User-Agent': UA, 'Cookie': cookieStr },
  });
  if (!crumbRes.ok) throw new Error(`Crumb fetch HTTP ${crumbRes.status}`);
  const crumb = await crumbRes.text();
  return { crumb, cookies: cookieStr };
}

// ── Refresh the whole watchlist in batches ───────────────────────────────────
// Batches of BATCH_SIZE tickers run in parallel; batches run sequentially. Each
// ticker makes 2 sequential HTTP calls (chart then quoteSummary), so at most
// BATCH_SIZE × 2 connections are open at once. A failed ticker keeps its prior
// snapshot entry.
async function refreshAll(env){
  const auth = await getYahooCrumb();

  const raw = await env.SCREENER.get(SNAPSHOT_KEY);
  const prior = raw ? JSON.parse(raw) : { stocks:[] };
  const priorByTkr = new Map((prior.stocks || []).map(s => [s.tkr, s]));

  const results = [];
  let ok = 0;

  for (let i = 0; i < WATCHLIST.length; i += BATCH_SIZE){
    const batch = WATCHLIST.slice(i, i + BATCH_SIZE);
    const settled = await Promise.allSettled(batch.map(t => fetchOne(t, auth)));
    settled.forEach((r, j) => {
      const tkr = batch[j].split('.')[0];
      if (r.status === 'fulfilled'){
        results.push(r.value);
        ok++;
      } else {
        console.error(`Failed ${batch[j]}:`, r.reason && r.reason.message);
        const p = priorByTkr.get(tkr);
        if (p) results.push(p);
      }
    });
  }

  const snap = { updated: new Date().toISOString(), count: results.length, stocks: results };
  await env.SCREENER.put(SNAPSHOT_KEY, JSON.stringify(snap));
  return { refreshed: ok, failed: WATCHLIST.length - ok, total: WATCHLIST.length };
}

// ── One ticker: price/returns/vol + value/quality fundamentals ───────────────
// Calls are sequential within a ticker to ensure each response body is fully
// consumed before the next fires — prevents CF's stalled-response deadlock.
async function fetchOne(ticker, auth){
  const series = await fetchSeries(ticker);
  const f      = await fetchFundamentals(ticker, auth);
  const latest = series[series.length - 1] || null;

  return {
    tkr:   ticker.split('.')[0],
    price: latest ? Math.round(latest.close) : null,
    r12:   totalReturn(series, RET_12M_DAYS),
    r3:    totalReturn(series, RET_3M_DAYS),
    vol:   annualisedVol(series, VOL_WINDOW),
    pe:    num(f.pe),
    yield: pctNum(f.divYieldDecimal),
    roe:   pctNum(f.roeDecimal),
    de:    f.de,
    econ:  earningsConsistency(f.epsAnnual, EPS_YEARS),
  };
}

// ── Provider-specific fetches (Yahoo Finance) ────────────────────────────────
async function yahooJson(url){
  const res = await fetch(url, {
    headers: { 'User-Agent': UA, 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error(`Yahoo ${new URL(url).pathname} HTTP ${res.status}`);
  return res.json();
}

async function yahooJsonAuth(url, auth){
  const sep = url.includes('?') ? '&' : '?';
  const res = await fetch(`${url}${sep}crumb=${encodeURIComponent(auth.crumb)}`, {
    headers: { 'User-Agent': UA, 'Accept': 'application/json', 'Cookie': auth.cookies },
  });
  if (!res.ok) throw new Error(`Yahoo ${new URL(url).pathname} HTTP ${res.status}`);
  return res.json();
}

async function fetchSeries(ticker){
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}`
    + '?range=2y&interval=1d&events=div%2Csplit';
  const json = await yahooJson(url);
  const result = json && json.chart && json.chart.result && json.chart.result[0];
  if (!result) throw new Error(
    (json && json.chart && json.chart.error && json.chart.error.description) || 'no series');
  const ts = result.timestamp || [];
  const close = (result.indicators && result.indicators.quote
    && result.indicators.quote[0] && result.indicators.quote[0].close) || [];
  const adj = (result.indicators && result.indicators.adjclose
    && result.indicators.adjclose[0] && result.indicators.adjclose[0].adjclose) || [];
  const out = [];
  for (let i = 0; i < ts.length; i++){
    const c = close[i];
    if (!Number.isFinite(c)) continue;
    const date = new Date(ts[i] * 1000).toISOString().slice(0, 10);
    const a = Number.isFinite(adj[i]) ? adj[i] : c;
    out.push({ date, close: c, adj: a });
  }
  out.sort((a, b) => a.date < b.date ? -1 : 1);
  return out;
}

async function fetchFundamentals(ticker, auth){
  const url = `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${encodeURIComponent(ticker)}`
    + '?modules=summaryDetail%2CdefaultKeyStatistics%2CfinancialData%2CincomeStatementHistory';
  const json = await yahooJsonAuth(url, auth);
  const r = json && json.quoteSummary && json.quoteSummary.result && json.quoteSummary.result[0];
  if (!r) throw new Error(
    (json && json.quoteSummary && json.quoteSummary.error && json.quoteSummary.error.description) || 'no fundamentals');
  const sd = r.summaryDetail || {};
  const fd = r.financialData || {};
  const ks = r.defaultKeyStatistics || {};
  const incHist = (r.incomeStatementHistory && r.incomeStatementHistory.incomeStatementHistory) || [];

  // Yahoo's financialData.debtToEquity is pre-computed as a percentage (e.g.
  // 43.32 = 43.32%) — convert to a ratio (0.4332) to match the dashboard.
  const rawDE = pickRaw(fd.debtToEquity);
  return {
    pe:              pickRaw(sd.trailingPE, ks.trailingPE),
    divYieldDecimal: pickRaw(sd.dividendYield, sd.trailingAnnualDividendYield),
    roeDecimal:      pickRaw(fd.returnOnEquity),
    de:              rawDE != null ? rawDE / 100 : null,
    epsAnnual:       incHist.map(s => ({ reportedEPS: pickRaw(s.netIncome) })),
  };
}

function pickRaw(...candidates){
  for (const c of candidates){
    if (c && Number.isFinite(c.raw)) return c.raw;
  }
  return null;
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
function earningsConsistency(annualReports, maxYears){
  if (!Array.isArray(annualReports)) return null;
  const eps = annualReports.slice(0, maxYears).map(r => num(r.reportedEPS)).filter(v => v != null);
  if (eps.length < 3) return null;
  const posFrac = eps.filter(v => v > 0).length / eps.length;
  const chron = [...eps].reverse();
  const g = [];
  for (let i = 1; i < chron.length; i++){
    const prev = chron[i-1];
    if (prev !== 0){
      let r = (chron[i] - prev) / Math.abs(prev);
      r = Math.max(-1, Math.min(1, r));
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

const num = v => { const n = parseFloat(v); return Number.isFinite(n) ? n : null; };
const pctNum = v => { const n = parseFloat(v); return Number.isFinite(n) ? n * 100 : null; };
