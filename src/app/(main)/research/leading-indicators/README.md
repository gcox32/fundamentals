# Leading Indicators View – Stock Research Tool

This module adds a **second leg** to the stock research "stool" alongside valuation: **Macroeconomic Leading Indicators**. It is designed to provide a **comprehensive**, **actionable**, and optionally **interactive** overview of the macroeconomic environment to support investment decisions.

---

## Purpose

- **Comprehensive**: Capture the key macroeconomic indicators that historically lead market movements.
- **Actionable**: Translate economic data into signals investors can use.
- **Interactive (Stretch Goal)**: Allow users to explore scenarios and visualize potential implications.

---

## View Structure

### 1. Top-Level Summary Panel
High-level status of macro environment:
- Economic Expansion/Contraction (LEI)
- Fear-Greed Index
- Recession Probability
- Inflation Regime
- Rate Regime (e.g., yield curve)
- Consumer Sentiment Index
- Signal summary (Green / Yellow / Red)

### 2. Thematic Indicator Blocks
Each block contains historical charts, recent readings, and interpretation.

#### A. Consumer Health
- Personal Consumption Expenditures (PCE)
- Retail Sales (Real & Nominal)
- Consumer Credit Growth
- Initial Unemployment Claims
- Real Disposable Income

#### B. Business Health
- ISM Manufacturing & Services PMI
- Durable Goods Orders
- Capacity Utilization
- NFIB Small Business Optimism Index

#### C. Inflation & Rates
- CPI (Headline & Core)
- PPI
- 10Y Breakeven Inflation
- Fed Funds Rate & path

#### D. Credit Markets
- Corporate Bond Spreads (IG & HY)
- Bank Lending Standards (SLOOS)
- Mortgage Rate Spread vs 10Y Treasury

#### E. Market-Based Indicators
- Yield Curve (2Y/10Y, 3M/10Y)
- Dollar Index (DXY)
- Oil / Commodities
- VIX (Volatility Index)

---

## 🧭 Actionable Features

### Sector Impact Snapshot
Shows macroeconomic conditions' historical effect on equity sectors:
- Tech, Industrials, Consumer, etc.
- Status icons: 🔺 Favorable, ⚠️ Mixed, 🔻 Unfavorable

### Valuation Implications
- e.g., "P/E multiples compress when CPI > 4%"
- Summary callouts connecting indicators to valuation context

### Forward-Looking Heatmap
- Visual map of which indicators typically lead vs lag
- Current status overlaid on timeline for forecasting

---

## Interactivity (Stretch Goals)

- **Scenario Simulator**: Adjust inflation, rates, growth, etc., and view market impact estimates.
- **Macro Playground**: Sliders connected to a simplified valuation model.
- **Historical Context Tool**: Compare today’s data with past recession entries.

---

## Implementation Notes

- **Frontend**: Next.js with Tailwind + Recharts (or Chart.js)
- **Data**: FRED API, Quandl, government CSVs, or third-party macro feeds
- **Backend**: Schedule daily/weekly ETL jobs to cache data in S3 or DynamoDB
- **Componentization**: Each macro theme block as reusable component for modularity

---

## Development Checklist

- [ ] Implement Summary Panel
- [ ] Build Thematic Indicator Components
- [ ] Integrate API/ETL for data sources
- [ ] Add Sector Impact + Valuation Implications
- [ ] Style & Layout the Dashboard
- [ ] Optional: Add interactive features

---

## Philosophy

This view assumes that valuation alone is insufficient without an understanding of the **context** in which those valuations exist. Macro indicators provide the background music to any individual stock's performance. This tool seeks to make that music both audible and interpretable.

---
