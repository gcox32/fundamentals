// Calculate compound annual growth rate (CAGR)
export const calculateGrowthRate = (values: number[]): number => {
    if (values.length < 2) return 0;
    const years = values.length - 1;
    const endValue = values[0];
    const startValue = values[values.length - 1];
    if (startValue <= 0) return 0;
    return Math.pow(endValue / startValue, 1 / years) - 1;
  };
  
  // Discounted Cash Flow valuation
  export const calculateDCF = (
    freeCashFlow: number, 
    growthRate: number,
    sharesOutstanding: number
  ): number => {
    const discountRate = 0.10; // 10% discount rate
    const terminalGrowthRate = 0.02; // 2% terminal growth
    const projectionYears = 5;
    
    let presentValue = 0;
    let projectedCashFlow = freeCashFlow;
  
    // Calculate present value of projected cash flows
    for (let year = 1; year <= projectionYears; year++) {
      projectedCashFlow *= (1 + growthRate);
      presentValue += projectedCashFlow / Math.pow(1 + discountRate, year);
    }
  
    // Calculate terminal value
    const terminalValue = (projectedCashFlow * (1 + terminalGrowthRate)) / 
      (discountRate - terminalGrowthRate);
    const presentTerminalValue = terminalValue / Math.pow(1 + discountRate, projectionYears);
  
    // Return per share value
    return (presentValue + presentTerminalValue) / sharesOutstanding;
  };
  
  // Graham's Formula: V = EPS × (8.5 + 2g) × 4.4 / Y
  // where g is growth rate and Y is current AAA corporate bond yield (using 4.5% as default)
  export const calculateGraham = (eps: number, growthRate: number): number => {
    const bondYield = 0.045; // 4.5% AAA corporate bond yield
    return eps * (8.5 + 2 * (growthRate * 100)) * 4.4 / bondYield;
  };
  
  // Earnings-based valuation using industry average P/E ratio
  export const calculateEarningsBased = (eps: number): number => {
    const industryPE = 15; // Using 15 as a conservative P/E ratio
    return eps * industryPE;
  };
  
  // Asset-based valuation (Net Asset Value per share)
  export const calculateAssetBased = (
    totalAssets: number,
    totalLiabilities: number,
    shareholdersEquity: number,
    sharesOutstanding: number
  ): number => {
    // Return per share value
    return shareholdersEquity / sharesOutstanding;
  };