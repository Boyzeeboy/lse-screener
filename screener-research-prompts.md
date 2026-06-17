# LSE Screener — Research Prompts

Ready-to-paste prompts for deep-dive research sessions in Claude, tuned to match
the dashboard's metric definitions exactly. Paste the **House Definitions** block
once at the start of a research session so Claude computes things the same way
the Worker does — then use the prompts below.

> **Symbols:** Yahoo Finance uses the `.L` suffix for London listings
> (e.g. `TSCO.L`, `AZN.L`), *not* `.LON`.
>
> **Data source:** The Worker pulls from Yahoo's unofficial `query1`/`query2`
> endpoints (v8 chart for prices, v10 quoteSummary for fundamentals). These are
> the same endpoints Yahoo's own site uses — reliable but unsupported.
>
> **Honesty:** these are research and sanity-check prompts, not buy signals.
> LSE prices come in pence (GBp) — ask Claude to flag missing data and state
> units rather than guess.

---

## House Definitions (paste once per session)

```
When I ask about a share, use these exact definitions so your answers match my
LSE screener dashboard. Look up data on Yahoo Finance (finance.yahoo.com) using
the .L suffix for London listings.

- 12-month return = TOTAL return from adjusted close (dividends included),
  anchored to the trading day nearest 365 calendar days before the latest close.
- 3-month return  = same method, 91 calendar days.
- Volatility = annualised: sample standard deviation of daily LOG returns over
  the trailing 252 trading days, multiplied by sqrt(252), expressed as a %.
- P/E = trailing P/E from Yahoo's summary data.
- Dividend yield and ROE come from Yahoo's quoteSummary (dividendYield and
  returnOnEquity are decimals — multiply by 100 for %).
- Debt-to-equity = Yahoo's financialData.debtToEquity (pre-computed as a
  percentage, e.g. 43.32 = 43.32%) — divide by 100 to get the ratio shown on
  the dashboard.
- Four factors: Momentum (12m + 3m return), Value (low P/E + high yield),
  Quality (ROE + low debt-to-equity + earnings consistency), Stability (low
  volatility).
- Quality detail: gearing = debt-to-equity (lower is better; skip it if
  shareholder equity is negative rather than scoring it as low-geared).
  Earnings consistency = reliably positive net income with smooth year-on-year
  change over ~5 years (loss years and erratic swings score worse).

Always state the currency/units, and say "no data" rather than estimating when a
figure is missing. Nothing you say is financial advice.
```

---

## 1. Confirm the LSE symbol

```
Look up {COMPANY} on Yahoo Finance and confirm the exact .L symbol for the
London Stock Exchange listing. Show the symbol, exchange and currency.
```

## 2. Single-stock snapshot (mirrors one dashboard row)

```
For {TICKER}.L, give me a one-row snapshot matching my dashboard columns:
price, 12-month total return, 3-month return, P/E, dividend yield, ROE,
debt-to-equity, earnings consistency (5yr), and annualised volatility.
Use my House Definitions. Note anything that's missing.
```

## 3. Head-to-head comparison

```
Compare {TICKER_A}.L and {TICKER_B}.L across all four of my factors
(Momentum, Value, Quality, Stability) using the House Definitions. Lay it out
as a table, and tell me which one leads on each factor and why.
```

## 4. Validate the Worker's maths

```
Independently compute {TICKER}.L's 12-month total return and annualised
volatility from Yahoo Finance's historical prices (adjusted close), showing the
two anchor prices and the dates you used. My Worker reported r12 = {X}% and
vol = {Y}% — do they match? If not, where's the discrepancy likely coming from?
```

## 5. Explain a ranking

```
{TICKER}.L scored high on Value but low on Stability in my screener. Pull the
underlying figures from Yahoo Finance and explain in plain terms what's driving
each — i.e. why it looks cheap, and why it's volatile.
```

---

## Factor deep-dives (the caveats, made actionable)

## 6. Value-trap check

```
{TICKER}.L has a low P/E in my screener. Pull the earnings trend and recent
news from Yahoo Finance. Is this cheap-for-a-reason — declining earnings,
bad news — or genuinely under-priced? Lay out the evidence both ways.
```

## 7. Dividend-safety check

```
{TICKER}.L shows a high yield. Assess whether the dividend looks sustainable:
pull earnings history and cash flow data from Yahoo Finance, estimate dividend
cover, and flag if the yield is high because the price has fallen. Evidence
only — not a recommendation.
```

## 8. Quality check (the full Buffett-style picture)

```
Assess {TICKER}.L's durable quality on my three Quality sub-metrics. Pull from
Yahoo Finance: ROE (financialData), debt-to-equity (flag if equity is negative),
and income statement history (5 years of net income — are they reliably positive
and smooth, or is there a loss year / big swings?). Conclude whether this looks
like a durable, well-run business or a one-good-year flatter.
```

## 9. Momentum-reversal check

```
{TICKER}.L ranks high on Momentum. Pull RSI (14-day) and the 50- and 200-day
SMA from Yahoo Finance. Is it overbought or extended, and is the trend intact
or rolling over?
```

## 10. Stability / drawdown context

```
For {TICKER}.L, beyond annualised volatility, show its largest peak-to-trough
drawdown over the past 2 years and how it moved in the worst month. Use Yahoo
Finance's historical adjusted close data.
```

---

## 11. What's moving it right now

```
Summarise the last 2 weeks of news for {TICKER}.L from Yahoo Finance and tie it
to the price move over the same window. Keep it to the few items that actually
moved the stock.
```

## 12. Whole-watchlist context

```
For these LSE tickers — {LIST} — pull summary data from Yahoo Finance and rank
them by dividend yield and by P/E. Keep it to summary-level data only.
```

---

### Notes

- **Yahoo Finance is the source.** The Worker and these prompts both pull from
  Yahoo. Prices are in GBp (pence) for most LSE stocks.
- **Keep the dashboard authoritative for ranking.** These prompts are for
  drilling into *one* name or a *pair*; the screener stays the source of truth
  for the ranked composite across the whole watchlist.
- **Not financial advice.** Every prompt here surfaces data and context to help
  you think — none of it tells you what to hold.
