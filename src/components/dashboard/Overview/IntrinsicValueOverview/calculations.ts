/**
 * Calculates the Weighted Average Cost of Capital (WACC) for a company.
 *
 * WACC represents the company's cost of capital by weighting the cost of equity and debt
 * based on their proportions in the company's capital structure. It accounts for the tax
 * shield benefit of debt.
 *
 * @param marketValueEquity - Market value of equity (e.g., market capitalization).
 * @param marketValueDebt - Market value of debt (e.g., total outstanding debt).
 * @param costOfEquity - Cost of equity (e.g., expected return for shareholders).
 * @param costOfDebt - Cost of debt (e.g., average interest rate on loans).
 * @param taxRate - Corporate tax rate (e.g., 0.21 for 21%).
 * @returns The WACC as a decimal (e.g., 0.08 for 8%).
 */
export const calculateWacc = (
  marketValueEquity: number,
  marketValueDebt: number,
  costOfEquity: number,
  costOfDebt: number,
  taxRate: number
): number => {
  if (marketValueEquity <= 0 || marketValueDebt < 0 || costOfEquity <= 0 || costOfDebt <= 0) {
    throw new Error("Invalid input: Equity, debt, and their costs must be positive values.");
  }
  if (taxRate < 0 || taxRate > 1) {
    throw new Error("Invalid tax rate: Must be between 0 and 1.");
  }

  const totalCapital = marketValueEquity + marketValueDebt;
  const equityWeight = marketValueEquity / totalCapital;
  const debtWeight = marketValueDebt / totalCapital;

  // Calculate WACC
  return equityWeight * costOfEquity + debtWeight * costOfDebt * (1 - taxRate);
};


/**
 * Calculate annualized Free Cash Flow (FCF) from the last n quarters.
 * If fewer than 4 quarters are used, it extrapolates to an annual value.
 *
 * @param fcfQuarters - Array of FCF values for the most recent quarters (most recent first).
 * @param n - Number of quarters to include in the calculation.
 * @returns Annualized FCF based on the given quarters.
 */
export const calculateAnnualFreeCashFlow = (fcfQuarters: number[], n: number): number => {
  if (n <= 0 || n > fcfQuarters.length) {
    throw new Error("Invalid number of quarters specified.");
  }

  const selectedQuarters = fcfQuarters.slice(0, n); // Take the last n quarters
  const totalFcf = selectedQuarters.reduce((sum, fcf) => sum + fcf, 0);

  // If fewer than 4 quarters, extrapolate to annual value
  const annualizedFcf = n < 4 ? (totalFcf / n) * 4 : totalFcf;

  return Math.round(annualizedFcf * 100) / 100; // Round to 2 decimal places
};

/**
 * Calculate the average growth rate based on sequential periods.
 *
 * @param values - Array of historical FCF values (most recent first).
 * @returns Average growth rate as a decimal (e.g., 0.10 for 10% growth).
 */
export const calculateGrowthRate = (values: number[]): number => {
  if (values.length < 2) return 0;
  const valuesLength = values.length > 4 ? 4 : values.length;
  // Calculate sequential growth rates
  const growthRates = [];
  for (let i = 1; i < valuesLength; i++) {
    const previous = values[i];
    const current = values[i - 1];
    if (previous > 0) {
      growthRates.push((current / previous) - 1);
    }
  }

  // Return the average growth rate
  if (growthRates.length === 0) return 0;
  return growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
};


export const calculateDCF = (
  freeCashFlow: number,
  growthRate: number,
  sharesOutstanding: number,
  marketValueEquity: number,
  marketValueDebt: number,
  costOfEquity: number,
  costOfDebt: number,
  taxRate: number,
  terminalGrowthRate: number = 0.02,
  projectionYears: number = 5
): number => {
  // Calculate WACC
  const discountRate = calculateWacc(marketValueEquity, marketValueDebt, costOfEquity, costOfDebt, taxRate);
  console.log('discountRate', discountRate);

  let totalPresentValue = 0;
  let projectedCashFlow = freeCashFlow;
  console.log('projectedCashFlow', projectedCashFlow / sharesOutstanding);

  // Calculate the present value of projected cash flows
  for (let year = 1; year <= projectionYears; year++) {
    projectedCashFlow *= (1 + growthRate); // Project next year's cash flow
    totalPresentValue += projectedCashFlow / Math.pow(1 + discountRate, year); // Discount to present
  }
  console.log('totalPresentValue', totalPresentValue / sharesOutstanding);

  // Calculate terminal value
  const terminalValue = (projectedCashFlow * (1 + terminalGrowthRate)) /
    (discountRate - terminalGrowthRate);
  const presentTerminalValue = terminalValue / Math.pow(1 + discountRate, projectionYears);
  console.log('terminal value:', presentTerminalValue / sharesOutstanding);

  // Calculate intrinsic value per share
  const intrinsicValuePerShare = (totalPresentValue + presentTerminalValue) / sharesOutstanding;
  console.log('intrinsicValuePerShare', intrinsicValuePerShare);

  // Return rounded value
  return Math.round(intrinsicValuePerShare * 100) / 100; // Round to 2 decimal places
};


// Graham's Formula: V = EPS × (8.5 + 2g) × 4.4 / Y
// where g is growth rate and Y is current AAA corporate bond yield (using 4.5% as default)
export const calculateGraham = (eps: number, growthRate: number): number => {
  const bondYield = 0.045; // 4.5% AAA corporate bond yield
  return eps * (8.5 + 2 * (growthRate * 100)) * 4.4 / bondYield;
};

// Earnings-based valuation using industry average P/E ratio
export const calculateEarningsBased = (
  eps: number, 
  growthRate: number,
  peRatio: number = 15
): number => {
  if (eps <= 0) return 0;
  console.log('eps', eps);
  console.log('growthRate', growthRate);
  console.log('peRatio', peRatio);
  
  // Calculate future earnings considering growth
  const futureEps = eps * (1 + growthRate);
  
  // Apply P/E multiple to future earnings
  const intrinsicValue = futureEps * peRatio;
  
  return Math.round(intrinsicValue * 100) / 100;
};

// Asset-based valuation (Net Asset Value per share)
export const calculateAssetBased = (
  totalAssets: number,
  totalLiabilities: number
): number => {
  // Return per share value
  return totalAssets - totalLiabilities;
};

export const calculateAnnualEPS = (epsQuarters: number[], n: number): number => {
  if (n <= 0 || n > epsQuarters.length) {
    throw new Error("Invalid number of quarters specified.");
  }

  const selectedQuarters = epsQuarters.slice(0, n); // Take the last n quarters
  const totalEps = selectedQuarters.reduce((sum, eps) => sum + eps, 0);

  // If fewer than 4 quarters, extrapolate to annual value
  const annualizedEps = n < 4 ? (totalEps / n) * 4 : totalEps;

  return Math.round(annualizedEps * 100) / 100; // Round to 2 decimal places
};