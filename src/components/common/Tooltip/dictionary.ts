export const tooltipText = {
  valuation: {
    currentPrice: 'Current market price per share',
    marketCap: "Total market value of the company's outstanding shares",
    eps: 'Earnings Per Share (Trailing Twelve Months)',
    dcfValue: 'Discounted Cash Flow valuation based on projected future cash flows',
    fcfeDcfValue: 'Fair value from FCFE-based DCF (projects FCFE and applies a terminal growth rate).',
    epsDcfValue: 'Fair value from EPS Growth DCF (discounts growing EPS and applies an exit multiple).',
    grahamValue: "Benjamin Graham's formula considering EPS and growth rate",
    earningsValue: 'Value based on normalized P/E ratio and current earnings',
    assetValue: 'Net Asset Value per share based on balance sheet',
  },
  dcf: {
    // Adjustable inputs
    forecastPeriod: 'Years to project FCFE/EPS before applying terminal value.',
    discountRate: 'Cost of equity used to discount future FCFE/EPS to present value.',
    fcfeGrowthRate: 'Assumed annual growth rate of Free Cash Flow to Equity during the forecast period.',
    epsGrowthRate: 'Assumed annual EPS growth during the forecast period.',
    terminalGrowth: 'Perpetual growth rate after the forecast period (Gordon Growth). Keep conservative.',
    exitMultiple: 'Terminal P/E multiple applied to final-year EPS to estimate terminal value.',

    // Historical inputs - FCFE
    netIncome: 'Profit after all expenses and taxes. Starting point for FCFE.',
    depreciation: 'Non-cash expense added back to cash flow.',
    capitalExpenditure: 'Cash outlay for long-term assets; reduces FCFE.',
    changeInNwc: 'Change in net working capital (current assets - current liabilities). Uses latest two periods.',

    // Historical inputs - EPS
    currentEps: 'Earnings per share based on latest net income and shares outstanding.',
    sharesOutstanding: 'Weighted average diluted shares used to derive per-share values.',
  },
} as const;

export type TooltipText = typeof tooltipText;

