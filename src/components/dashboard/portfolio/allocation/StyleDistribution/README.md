# Style Distribution Component

This component visualizes the distribution of stocks in a portfolio across different market capitalization sizes and investment styles using a heat map visualization.

## Style Classification Methodology

The component uses a multi-factor approach to classify holdings into Value, Blend, and Growth, combining valuation, yield, and profitability signals. Metrics are normalized onto a common 0–1 scale and combined via weights, then mapped to Value/Blend/Growth using thresholds.

### Metrics and Weights

- Valuation (lower values tilt Value):
  - **P/E** (25%) — range cap: 5 to 50
  - **P/B** (15%) — range cap: 0.5 to 5
  - **P/S** (10%) — range cap: 0.5 to 10
  - **P/FCF** (15%) — range cap: 5 to 30
  - **PEG** (20%) — range cap: 0.5 to 2
- Yield (higher values tilt Value):
  - **Dividend Yield** (5%) — range cap: 0% to 8%
- Profitability/Growth proxy (higher values tilt Growth):
  - **Return on Equity (ROE)** (10%) — range cap: 0% to 30%

Notes:
- Ranges are clamped to reduce outlier impact and stabilize normalization.
- If one or more metrics are unavailable for a company, the available metrics are used and weights are re-normalized proportionally (so missing data doesn’t bias toward any style).

### Classification Process

1. Normalize each metric to 0–1, where 0 = Value-tilt and 1 = Growth-tilt. For “higher is better” toward Value (e.g., Dividend Yield), the scale is inverted appropriately.
2. Compute a weighted average using the metric weights (re-normalized over available metrics).
3. Map the score to style:
   - Score ≤ 0.4 → Value
   - Score ≤ 0.7 → Blend
   - Score > 0.7 → Growth

## Market Capitalization Classification

Stocks are also classified by market capitalization:

- **Small Cap**: < $10B
- **Medium Cap**: $10B - $50B
- **Large Cap**: > $50B

## Visualization

The component creates a 3x3 heat map where:
- Rows represent market cap categories (Large, Medium, Small)
- Columns represent investment styles (Value, Blend, Growth)
- Cell colors indicate the percentage allocation
- Hovering over cells shows detailed breakdown of holdings

## Usage

```tsx
<StyleDistribution 
    companyOutlooks={companyOutlooks} 
    weights={weights} 
/>
```

### Props

- `companyOutlooks`: Array of company outlook data including financial ratios
- `weights`: Array of objects containing ticker symbols and their portfolio weights

## Notes

- If financial ratios are unavailable for a company, it defaults to the "Blend" category
- The visualization is responsive and includes tooltips for detailed information
- Color intensity in the heat map is proportional to the allocation percentage 