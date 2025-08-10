import type { HistoricalIncomeStatement, HistoricalCashFlowStatement } from '@/types/financials';
import { dcfConfig } from '@/src/app/(main)/tools/dcf/config';

const ttmSum = (arr: number[], start: number): number => {
  let sum = 0;
  let count = 0;
  for (let i = start; i < Math.min(start + 4, arr.length); i++) {
    sum += arr[i] || 0;
    count++;
  }
  if (count === 0) return 0;
  return count < 4 ? (sum / count) * 4 : sum;
};

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

export function computeBaselineGrowthRates(
  incomeStatement?: HistoricalIncomeStatement,
  cashFlowStatement?: HistoricalCashFlowStatement
): { fcfeGrowth: number; epsGrowth: number } {
  let fcfeGrowth = dcfConfig.fcfeDefaultGrowthRate;
  let epsGrowth = dcfConfig.epsDefaultGrowthRate;

  if (cashFlowStatement?.data?.length) {
    const fcf = cashFlowStatement.data.map(d => d.freeCashFlow || 0);
    const latest = ttmSum(fcf, 0);
    const prior = ttmSum(fcf, 4);
    if (prior > 0) {
      fcfeGrowth = clamp((latest / prior) - 1, dcfConfig.fcfGrowthClamp.min, dcfConfig.fcfGrowthClamp.max);
    }
  }

  if (incomeStatement?.data?.length) {
    const epsQuarters = incomeStatement.data.map(d => d.epsdiluted || 0);
    const latest = ttmSum(epsQuarters, 0);
    const prior = ttmSum(epsQuarters, 4);
    if (prior > 0) {
      epsGrowth = clamp((latest / prior) - 1, dcfConfig.epsGrowthClamp.min, dcfConfig.epsGrowthClamp.max);
    }
  }

  // Standardize precision to two decimals (e.g., 0.12 => 12%) so all consumers align
  const round2 = (v: number) => Math.round(v * 100) / 100;
  return { fcfeGrowth: round2(fcfeGrowth), epsGrowth: round2(epsGrowth) };
}

export function computeCapmDiscountPercent(beta?: number | null): number {
  const rf = dcfConfig.riskFreeRate;
  const mrp = dcfConfig.marketRiskPremium;
  if (beta === undefined || beta === null) {
    return dcfConfig.discountRate;
  }
  const rate = (rf + beta * mrp) * 100;
  return Math.round(rate * 100) / 100; // 2 decimal places
}


