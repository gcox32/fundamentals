import React from 'react';
import styles from './styles.module.css';
import { 
  HistoricalIncomeStatement, 
  HistoricalCashFlowStatement, 
  HistoricalBalanceSheetStatement 
} from '@/types/financials';
import OverviewCard from '@/components/dashboard/DashboardCard/OverviewCard';
import { formatPrice, formatPercent, formatLargeNumber } from '@/utils/format';
import { FiInfo } from 'react-icons/fi';
import Tooltip from '@/components/common/Tooltip';
import { valuationTooltips } from './tooltips';
import { calculateGrowthRate, calculateDCF, calculateGraham, calculateEarningsBased, calculateAssetBased } from './calculations';

interface IntrinsicValueOverviewProps {
  isLoading: boolean;
  incomeStatement?: HistoricalIncomeStatement;
  cashFlowStatement?: HistoricalCashFlowStatement;
  balanceSheetStatement?: HistoricalBalanceSheetStatement;
  currentPrice?: number;
  marketCap?: number;
  sharesOutstanding?: number;
  quote?: {
    price: number;
    marketCap: number;
    sharesOutstanding: number;
  };
}

const MetricRow = ({ 
  label, 
  value, 
  margin, 
  tooltipKey 
}: { 
  label: string;
  value: string;
  margin?: string;
  tooltipKey: keyof typeof valuationTooltips;
}) => (
  <div className={styles.metric}>
    <span className={styles.labelContainer}>
      <span className={styles.label}>{label}</span>
      <Tooltip content={valuationTooltips[tooltipKey]}>
        <FiInfo className={styles.infoIcon} />
      </Tooltip>
    </span>
    <div className={styles.valueContainer}>
      <span className={styles.value}>{value}</span>
      {margin && <span className={styles.margin}>{margin}</span>}
    </div>
  </div>
);

export default function IntrinsicValueOverview({
  isLoading,
  incomeStatement,
  cashFlowStatement,
  balanceSheetStatement,
  currentPrice = 0,
  marketCap = 0,
  sharesOutstanding = 0
}: IntrinsicValueOverviewProps) {
  const latestEPS = incomeStatement?.data?.[0]?.eps || 0;

  const calculateValuations = () => {
    if (!incomeStatement?.data?.[0] || !cashFlowStatement?.data?.[0] || !balanceSheetStatement?.data?.[0] || !sharesOutstanding) {
      return null;
    }

    const latest = {
      income: incomeStatement.data[0],
      cashFlow: cashFlowStatement.data[0],
      balance: balanceSheetStatement.data[0]
    };

    // Calculate growth rates from historical data
    const fcfGrowthRate = calculateGrowthRate(
      cashFlowStatement.data.map(d => d.freeCashFlow || 0)
    );
    const earningsGrowthRate = calculateGrowthRate(
      incomeStatement.data.map(d => d.netIncome || 0)
    );

    // Calculate different valuations
    const dcfValue = calculateDCF(
      latest.cashFlow.freeCashFlow, 
      fcfGrowthRate,
      sharesOutstanding
    );
    const grahamValue = calculateGraham(latest.income.eps || 0, earningsGrowthRate);
    const earningsValue = calculateEarningsBased(latest.income.eps || 0);
    const assetValue = calculateAssetBased(
      latest.balance.totalAssets,
      latest.balance.totalLiabilities,
      latest.balance.totalStockholdersEquity,
      sharesOutstanding
    );

    // Calculate margins of safety
    const getMargin = (value: number) => {
      if (!currentPrice || !value) return 0;
      return ((value - currentPrice) / currentPrice) * 100;
    };

    return {
      dcf: { value: dcfValue, margin: getMargin(dcfValue) },
      graham: { value: grahamValue, margin: getMargin(grahamValue) },
      earnings: { value: earningsValue, margin: getMargin(earningsValue) },
      asset: { value: assetValue, margin: getMargin(assetValue) }
    };
  };

  const valuations = calculateValuations();

  return (
    <OverviewCard title="Intrinsic Value Analysis" isLoading={isLoading}>
      <div className={styles.metricsGrid}>
        {/* Market Metrics Section */}
        <div className={styles.metricSection}>
          <h4 className={styles.sectionTitle}>Market Overview</h4>
          <MetricRow
            label="Current Price"
            value={formatPrice(currentPrice)}
            tooltipKey="currentPrice"
          />
          <MetricRow
            label="Market Cap"
            value={`$${formatLargeNumber(marketCap)}`}
            tooltipKey="marketCap"
          />
          <MetricRow
            label="EPS (TTM)"
            value={formatPrice(latestEPS)}
            tooltipKey="eps"
          />
        </div>

        {/* Valuation Metrics - Each in its own section */}
        <div className={styles.metricSection}>
          <h4 className={styles.sectionTitle}>DCF Valuation</h4>
          <MetricRow
            label="DCF Value"
            value={formatPrice(valuations?.dcf.value)}
            margin={formatPercent(valuations?.dcf.margin)}
            tooltipKey="dcfValue"
          />
        </div>

        <div className={styles.metricSection}>
          <h4 className={styles.sectionTitle}>Graham Formula</h4>
          <MetricRow
            label="Graham Value"
            value={formatPrice(valuations?.graham.value)}
            margin={formatPercent(valuations?.graham.margin)}
            tooltipKey="grahamValue"
          />
        </div>

        <div className={styles.metricSection}>
          <h4 className={styles.sectionTitle}>Earnings-Based</h4>
          <MetricRow
            label="Fair Value"
            value={formatPrice(valuations?.earnings.value)}
            margin={formatPercent(valuations?.earnings.margin)}
            tooltipKey="earningsValue"
          />
        </div>

        <div className={styles.metricSection}>
          <h4 className={styles.sectionTitle}>Asset-Based</h4>
          <MetricRow
            label="Net Asset Value"
            value={formatPrice(valuations?.asset.value)}
            margin={formatPercent(valuations?.asset.margin)}
            tooltipKey="assetValue"
          />
        </div>
      </div>
    </OverviewCard>
  );
} 