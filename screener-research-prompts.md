# LSE Screener — MCP Research Prompts

Ready-to-paste prompts for the Alpha Vantage MCP connector, tuned to match the
dashboard's metric definitions exactly. Paste the **House Definitions** block
once at the start of a research session so Claude computes things the same way
the Worker does — then use the prompts below.

> **Symbols:** Alpha Vantage usually expects the `.LON` suffix for London
> listings (e.g. `TSCO.LON`, `AZN.LON`), *not* `.L`. Confirm with the first
> prompt before trusting any numbers — and fix the Worker's `WATCHLIST` to match.
>
> **Honesty:** these are research and sanity-check prompts, not buy signals. AV's
> LSE coverage can be patchy and prices come in pence (GBp) — ask Claude to flag
> missing data and state units rather than guess.

---

## House Definitions (paste once per session)

```
You have the Alpha Vantage MCP connector. When I ask about a share, use these
exact definitions so your answers match my dashboard:

- 12-month return = TOTAL return from adjusted close (dividends included),
  anchored to the trading day nearest 365 calendar days before the latest close.
- 3-month return  = same method, 91 calendar days.
- Volatility = annualised: sample standard deviation of daily LOG returns over
  the trailing 252 trading days, multiplied by sqrt(252), expressed as a %.
- P/E, dividend yield and ROE come from COMPANY_OVERVIEW (yield and ROE are
  decimals there — multiply by 100 for %).
- Four factors: Momentum (12m + 3m return), Value (low P/E + high yield),
  Quality (ROE + low debt-to-equity + earnings consistency), Stability (low
  volatility).
- Quality detail: gearing = debt-to-equity (lower is better; skip it if
  shareholder equity is negative rather than scoring it as low-geared).
  Earnings consistency = reliably positive EPS with smooth year-on-year change
  over ~5 years (loss years and erratic swings score worse).

Pull data via the MCP tools (TIME_SERIES_DAILY_ADJUSTED, COMPANY_OVERVIEW, etc).
Always state the currency/units, and say "no data" rather than estimating when a
figure is missing. Nothing you say is financial advice.
```

---

## 1. Confirm the LSE symbol

```
Use SYMBOL_SEARCH to find the exact Alpha Vantage symbol for {COMPANY} on the
London Stock Exchange. Show the symbol, region and currency.
```

## 2. Single-stock snapshot (mirrors one dashboard row)

```
For {TICKER}, give me a one-row snapshot matching my dashboard columns:
price, 12-month total return, 3-month return, P/E, dividend yield, ROE,
debt-to-equity, earnings consistency (5yr), and annualised volatility.
Use my House Definitions. Note anything that's missing.
```

## 3. Head-to-head comparison

```
Compare {TICKER_A} and {TICKER_B} across all four of my factors
(Momentum, Value, Quality, Stability) using the House Definitions. Lay it out
as a table, and tell me which one leads on each factor and why.
```

## 4. Validate the Worker's maths

```
Independently compute {TICKER}'s 12-month total return and annualised
volatility from TIME_SERIES_DAILY_ADJUSTED, showing the two anchor prices and
the dates you used. My Worker reported r12 = {X}% and vol = {Y}% — do they match?
If not, where's the discrepancy likely coming from?
```

## 5. Explain a ranking

```
{TICKER} scored high on Value but low on Stability in my screener. Pull the
underlying figures and explain in plain terms what's driving each — i.e. why it
looks cheap, and why it's volatile.
```

---

## Factor deep-dives (the caveats, made actionable)

## 6. Value-trap check

```
{TICKER} has a low P/E in my screener. Pull earnings trend (EARNINGS) and recent
news sentiment (NEWS_SENTIMENT). Is this cheap-for-a-reason — declining earnings,
bad news — or genuinely under-priced? Lay out the evidence both ways.
```

## 7. Dividend-safety check

```
{TICKER} shows a high yield. Assess whether the dividend looks sustainable: pull
EARNINGS and CASH_FLOW, estimate dividend cover, and flag if the yield is high
because the price has fallen. Evidence only — not a recommendation.
```

## 8. Quality check (the full Buffett-style picture)

```
Assess {TICKER}'s durable quality on my three Quality sub-metrics. Pull
COMPANY_OVERVIEW (ROE), BALANCE_SHEET (compute debt-to-equity; flag if equity is
negative) and EARNINGS (5 years of annual EPS — are they reliably positive and
smooth, or is there a loss year / big swings?). Conclude whether this looks like
a durable, well-run business or a one-good-year flatter.
```

## 9. Momentum-reversal check

```
{TICKER} ranks high on Momentum. Pull RSI (14-day) and the 50- and 200-day SMA.
Is it overbought or extended, and is the trend intact or rolling over? Plot price
with RSI guidelines at 30 and 70.
```

## 10. Stability / drawdown context

```
For {TICKER}, beyond annualised volatility, show its largest peak-to-trough
drawdown over the past 2 years and how it moved in the worst month. Use
TIME_SERIES_DAILY_ADJUSTED.
```

---

## 11. What's moving it right now

```
Summarise the last 2 weeks of news and sentiment for {TICKER} via NEWS_SENTIMENT,
and tie it to the price move over the same window. Keep it to the few items that
actually moved the stock.
```

## 12. Whole-watchlist context (run sparingly — rate limits)

```
For these LSE tickers — {LIST} — pull COMPANY_OVERVIEW only and rank them by
dividend yield and by P/E. (Skip the time-series calls to stay within the daily
request limit.)
```

---

### Notes

- **Rate limits still apply.** The MCP runs on your AV key — free tier is ~25
  calls/day and the adjusted series is premium-gated. Prompts 4, 9 and 10 each
  burn a time-series call per ticker, so use them on individual names, not the
  whole list.
- **Keep the dashboard authoritative for ranking.** The connector is for
  drilling into *one* name or a *pair*; the screener stays the source of truth
  for the ranked composite across the whole watchlist.
- **Not financial advice.** Every prompt here surfaces data and context to help
  you think — none of it tells you what to hold.
