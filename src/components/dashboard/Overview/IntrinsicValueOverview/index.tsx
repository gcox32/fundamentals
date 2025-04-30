import React from 'react';
import styles from './styles.module.css';
import {
  HistoricalIncomeStatement,
  HistoricalCashFlowStatement,
  HistoricalBalanceSheetStatement
} from '@/types/financials';
import OverviewCard from '@/components/dashboard/DashboardCard/OverviewCard';
import { formatPrice, formatPercent, formatLargeNumber } from '@/utils/format';
import { FiInfo, FiExternalLink } from 'react-icons/fi';
import Tooltip from '@/components/common/Tooltip';
import { valuationTooltips } from './tooltips';
import { calculateValuations } from './calculations';
import { CompanyProfile, CompanyRatios } from '@/types/company';

interface IntrinsicValueOverviewProps {
  isLoading: boolean;
  incomeStatement?: HistoricalIncomeStatement;
  cashFlowStatement?: HistoricalCashFlowStatement;
  balanceSheetStatement?: HistoricalBalanceSheetStatement;
  currentPrice?: number;
  marketCap?: number;
  sharesOutstanding?: number;
  profile?: CompanyProfile;
  ratios?: CompanyRatios[];
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
  profile,
  currentPrice = 0,
  marketCap = 0,
  sharesOutstanding = 0,
  ratios
}: IntrinsicValueOverviewProps) {
  const latestEPS = incomeStatement?.data?.[0]?.eps || 0;


  const valuations = calculateValuations(
    incomeStatement, 
    cashFlowStatement, 
    balanceSheetStatement, 
    sharesOutstanding, 
    currentPrice, 
    marketCap, 
    profile, 
    ratios,
    0.02,
    5,
    7.79
  );

  return (
    <OverviewCard title="Intrinsic Value Analysis" isLoading={isLoading}>
      <div className={styles.container}>
        <div className={styles.mainContent}>
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
              <h4 className={styles.sectionTitle}>Earnings-Based</h4>
              <MetricRow
                label="Fair Value"
                value={formatPrice(valuations?.earnings.value)}
                margin={formatPercent(valuations?.earnings.margin)}
                tooltipKey="earningsValue"
              />
            </div>
          </div>
        </div>

        <div className={styles.sidebar}>
          <div className={styles.toolPromo}>
            <h4 className={styles.promoTitle}>Want to run your own DCF?</h4>
            <p className={styles.promoText}>
              Try our Discounted Cash Flow calculator to create your own valuation model with custom assumptions.
            </p>
            <a href={`/tools/dcf?symbol=${profile?.symbol}`} target="_blank" className={styles.promoButton}>
              Open DCF Calculator
              <FiExternalLink className={styles.promoIcon} />
            </a>
          </div>
        </div>
      </div>
    </OverviewCard>
  );
} 