# Style Distribution Component

This component visualizes the distribution of stocks in a portfolio across different market capitalization sizes and investment styles using a heat map visualization.

## Style Classification Methodology

The component uses a comprehensive multi-factor approach to classify stocks into Value, Blend, and Growth categories. The classification is based on a weighted combination of five key valuation metrics:

### Valuation Metrics

1. **Price-to-Earnings (P/E) Ratio** (30% weight)
   - Range: 5-50
   - Lower values indicate more value-oriented stocks
   - Higher values indicate more growth-oriented stocks

2. **Price-to-Book (P/B) Ratio** (20% weight)
   - Range: 0.5-5
   - Lower values suggest value characteristics
   - Higher values suggest growth characteristics

3. **Price-to-Sales (P/S) Ratio** (15% weight)
   - Range: 0.5-10
   - Lower values indicate value stocks
   - Higher values indicate growth stocks

4. **Price-to-Free Cash Flow (P/FCF) Ratio** (15% weight)
   - Range: 5-30
   - Lower values suggest value characteristics
   - Higher values suggest growth characteristics

5. **Price/Earnings-to-Growth (PEG) Ratio** (20% weight)
   - Range: 0.5-2
   - Lower values indicate value stocks
   - Higher values indicate growth stocks

### Classification Process

1. Each metric is normalized to a 0-1 scale where:
   - 0 represents the most value-oriented end of the spectrum
   - 1 represents the most growth-oriented end of the spectrum

2. A weighted average score is calculated using the normalized values and their respective weights

3. Final classification is based on the total score:
   - Score ≤ 0.4: Value
   - Score ≤ 0.7: Blend
   - Score > 0.7: Growth

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