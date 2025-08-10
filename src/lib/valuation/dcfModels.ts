import type {
  HistoricalIncomeStatement,
  HistoricalCashFlowStatement,
  HistoricalBalanceSheetStatement,
} from '@/types/financials';
import { calculateFCFEValuation, calculateEPSValuation } from '@/src/lib/valuation/valuations';
import { dcfConfig } from '@/src/app/(main)/tools/dcf/config';

export type DCFModelOptions = {
  discountRatePercent?: number;
  forecastPeriodYears?: number;
  terminalGrowth?: number;
  exitMultiple?: number;
  fcfeGrowthRate?: number;
  epsGrowthRate?: number;
};

export function calculateFcfePerShare(
  incomeStatement: HistoricalIncomeStatement,
  cashFlowStatement: HistoricalCashFlowStatement,
  balanceSheetStatement: HistoricalBalanceSheetStatement,
  sharesOutstanding: number,
  options: DCFModelOptions = {}
): number {
  const latestIncome = incomeStatement.data?.[0];
  const latestCF = cashFlowStatement.data?.[0];
  const latestBalance = balanceSheetStatement.data?.[0];
  if (!latestIncome || !latestCF || !latestBalance || !sharesOutstanding) return 0;

  const prevBalance = balanceSheetStatement.data?.[1];
  const changeInNWC = prevBalance
    ? (latestBalance.totalCurrentAssets - latestBalance.totalCurrentLiabilities) -
      (prevBalance.totalCurrentAssets - prevBalance.totalCurrentLiabilities)
    : 0;

  const growthRate = options.fcfeGrowthRate ?? dcfConfig.fcfeDefaultGrowthRate;
  const discountRate = (options.discountRatePercent ?? dcfConfig.discountRate) / 100;
  const terminalGrowth = options.terminalGrowth ?? dcfConfig.terminalGrowth;
  const forecastPeriod = options.forecastPeriodYears ?? dcfConfig.forecastPeriod;

  const { presentValue, terminalValue } = calculateFCFEValuation({
    netIncome: latestIncome.netIncome || 0,
    depreciation: latestCF.depreciationAndAmortization || 0,
    capEx: latestCF.capitalExpenditure || 0,
    changeInNWC,
    netBorrowing: 0,
    growthRate,
    discountRate,
    terminalGrowthRate: terminalGrowth,
    forecastPeriod,
  });

  const totalEquityValue = presentValue + terminalValue;
  return sharesOutstanding ? totalEquityValue / sharesOutstanding : 0;
}

export function calculateEpsPerShare(
  incomeStatement: HistoricalIncomeStatement,
  sharesOutstanding: number,
  options: DCFModelOptions = {}
): number {
  const latestIncome = incomeStatement.data?.[0];
  if (!latestIncome || !sharesOutstanding) return 0;

  const eps = (latestIncome.netIncome || 0) / sharesOutstanding;
  const growthRate = options.epsGrowthRate ?? dcfConfig.epsDefaultGrowthRate;
  const discountRate = (options.discountRatePercent ?? dcfConfig.discountRate) / 100;
  const forecastPeriod = options.forecastPeriodYears ?? dcfConfig.forecastPeriod;
  const exitMultiple = options.exitMultiple ?? dcfConfig.exitMultiple;

  const { totalIntrinsicValuePerShare } = calculateEPSValuation({
    eps,
    growthRate,
    discountRate,
    forecastPeriod,
    exitMultiple,
  });

  return totalIntrinsicValuePerShare;
}


