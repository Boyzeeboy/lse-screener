# LSE Screener — Research Prompts

Ready-to-paste prompts for deep-dive research sessions in Claude, tuned to match
the dashboard's metric definitions exactly. Paste the **House Definitions** block
once at the start of a research session so Claude computes things the same way
the Worker does — then use the prompts below.

> **Data source:** Prompts 2–5 and 12 pull pre-computed metrics from your
> Cloudflare Worker (`/stock/{TICKER}`), so the numbers match the dashboard
> exactly. Prompts 6–11 supplement with Yahoo Finance web search for context
> the Worker doesn't store (news, cash flow, RSI, etc.).
>
> **Symbols:** use the short ticker without `.L` for the Worker endpoint
> (e.g. `HSBA`, `TSCO`). Prompts that search Yahoo Finance use `{TICKER}.L`.
>
> **Honesty:** these are research and sanity-check prompts, not buy signals.
> LSE prices come in pence (GBp) — ask Claude to flag missing data and state
> units rather than guess.

---

## Day-to-day research process

The placeholders work in two layers, and it helps to keep them straight:

1. **Start the session — paste House Definitions once, verbatim.** Copy the
   whole **House Definitions** block exactly as written and leave `{TICKER}`
   as the literal placeholder. You are not researching a stock yet — you are
   teaching Claude the rule ("when I name a ticker, fetch
   `…/stock/{TICKER}`") so every metric is computed the house way. Don't
   substitute a real symbol here.

2. **Run a prompt — now substitute the real values.** Pick a numbered prompt
   below, copy it, and replace each placeholder with an actual value before
   sending:
   - `{TICKER}` → the short symbol, no `.L`, for the Worker API (e.g. `HSBA`).
   - `{TICKER}.L` → keep the `.L` suffix for Yahoo Finance searches (e.g.
     `HSBA.L`). Both refer to the same stock; only the Worker endpoint drops
     the suffix.
   - `{TICKER_A}` / `{TICKER_B}` → the two symbols in a comparison (prompt 3).
   - `{X}` / `{Y}` → the figures the Worker returned, when a prompt asks Claude
     to verify them (prompt 4).

3. **Stay in one session.** Because House Definitions is pasted once, you can
   fire off several numbered prompts back-to-back and Claude keeps using the
   same definitions. Start a fresh session and you re-paste House Definitions
   first.

In short: leave `{TICKER}` as-is in House Definitions; swap it for a real
symbol everywhere in the numbered prompts.

---

## House Definitions (paste once per session)

```
You have access to my LSE screener Worker API. When I name a ticker, fetch its
data from:

  https://lse-screener.wgrossiter.workers.dev/stock/{TICKER}

That returns JSON with the exact metrics my dashboard uses:
  price, r12 (12-month total return %), r3 (3-month total return %),
  vol (annualised volatility %), pe, yield (%), roe (%), de (debt-to-equity
  ratio), econ (earnings consistency 0–1).

Metric definitions:
- 12-month return = total return from adjusted close (dividends included),
  anchored to the trading day nearest 365 calendar days before the latest close.
- 3-month return  = same method, 91 calendar days.
- Volatility = annualised: sample standard deviation of daily log returns over
  the trailing 252 trading days, × sqrt(252), expressed as %.
- P/E = trailing P/E.
- Yield and ROE are already percentages in the API response.
- D/E = debt-to-equity ratio (lower is better; null if equity is negative).
- Earnings consistency (econ) = 0–1 score; reliably positive net income with
  smooth year-on-year change over ~5 years.
- Four factors: Momentum (12m + 3m return), Value (low P/E + high yield),
  Quality (ROE + low D/E + earnings consistency), Stability (low volatility).

For deeper context (news, cash flow, RSI, drawdowns), search Yahoo Finance
using the .L suffix (e.g. HSBA.L).

Always state currency/units, and say "no data" rather than estimating when a
figure is missing. Nothing you say is financial advice.
```

---

## 1. Confirm a ticker is in the watchlist

```
Fetch https://lse-screener.wgrossiter.workers.dev/stock/{TICKER} and show me
what comes back. If it returns a 404, the ticker isn't in my watchlist.
```

## 2. Single-stock snapshot (mirrors one dashboard row)

```
For {TICKER}, fetch the data from my screener API and lay out a one-row
snapshot matching my dashboard columns: price, 12-month total return, 3-month
return, P/E, dividend yield, ROE, debt-to-equity, earnings consistency, and
annualised volatility. Note anything that's null.
```

## 3. Head-to-head comparison

```
Fetch {TICKER_A} and {TICKER_B} from my screener API. Compare them across all
four of my factors (Momentum, Value, Quality, Stability). Lay it out as a
table, and tell me which one leads on each factor and why.
```

## 4. Validate the Worker's maths

```
Fetch {TICKER} from my screener API — it reports r12 = {X}% and vol = {Y}%.
Now independently look up {TICKER}.L on Yahoo Finance and try to verify those
figures from the historical adjusted close data. Do they match? If not, where's
the discrepancy likely coming from?
```

## 5. Explain a ranking

```
Fetch {TICKER} from my screener API. It scored high on Value but low on
Stability. Using the returned metrics, explain in plain terms what's driving
each — i.e. why it looks cheap, and why it's volatile.
```

---

## Factor deep-dives (the caveats, made actionable)

## 6. Value-trap check

```
Fetch {TICKER} from my screener API — it has a low P/E. Now search for
{TICKER}.L earnings trend and recent news on Yahoo Finance. Is this
cheap-for-a-reason — declining earnings, bad news — or genuinely under-priced?
Lay out the evidence both ways.
```

## 7. Dividend-safety check

```
Fetch {TICKER} from my screener API — it shows a high yield. Now search Yahoo
Finance for {TICKER}.L earnings and cash flow. Assess whether the dividend
looks sustainable: estimate dividend cover, and flag if the yield is high
because the price has fallen. Evidence only — not a recommendation.
```

## 8. Quality check (the full Buffett-style picture)

```
Fetch {TICKER} from my screener API for ROE, D/E and earnings consistency.
Then search Yahoo Finance for {TICKER}.L's income statement and balance sheet
history. Assess durable quality: is ROE sustainably high, is gearing
comfortable, and are earnings reliably positive and smooth — or is this a
one-good-year flatter?
```

## 9. Momentum-reversal check

```
Fetch {TICKER} from my screener API — it ranks high on Momentum. Now search
Yahoo Finance for {TICKER}.L's RSI (14-day) and the 50- and 200-day SMA. Is it
overbought or extended, and is the trend intact or rolling over?
```

## 10. Stability / drawdown context

```
Fetch {TICKER} from my screener API for its annualised volatility. Then search
Yahoo Finance for {TICKER}.L's price history. Beyond volatility, show its
largest peak-to-trough drawdown over the past 2 years and how it moved in the
worst month.
```

---

## 11. What's moving it right now

```
Search for recent news on {TICKER}.L and summarise the last 2 weeks. Tie it to
the price move over the same window. Keep it to the few items that actually
moved the stock.
```

## 12. Whole-watchlist overview

```
Fetch the full snapshot from https://lse-screener.wgrossiter.workers.dev/ and
rank the watchlist by dividend yield and by P/E. Show both rankings as tables.
```

---

### Notes

- **The Worker API is the source of truth** for the metrics the dashboard
  displays. Prompts 2–5 and 12 pull directly from it so the numbers always
  match.
- **Yahoo Finance supplements** for context the Worker doesn't store: news,
  cash flow, RSI, drawdown history, etc. (prompts 6–11).
- **Watchlist only.** The `/stock/{TICKER}` endpoint covers the 20 tickers in
  the Worker's `WATCHLIST`. For stocks outside it, search Yahoo Finance directly.
- **Data freshness.** The Worker's cron runs at 18:30 UTC on weekdays. The
  snapshot reflects end-of-day data from the most recent run.
- **Not financial advice.** Every prompt here surfaces data and context to help
  you think — none of it tells you what to hold.
