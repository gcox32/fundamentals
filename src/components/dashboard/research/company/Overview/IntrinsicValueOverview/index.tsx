import React from 'react';
import styles from './styles.module.css';
import {
  HistoricalIncomeStatement,
  HistoricalCashFlowStatement,
  HistoricalBalanceSheetStatement
} from '@/types/financials';
import OverviewCard from '@/components/dashboard/research/company/DashboardCard/OverviewCard';
import { formatPrice, formatPercent, formatLargeNumber } from '@/src/lib/utilities/format';
import { FiInfo, FiExternalLink } from 'react-icons/fi';
import Tooltip from '@/components/common/Tooltip';
import { valuationTooltips } from './tooltips';
import { calculateEpsPerShare, calculateFcfePerShare } from '@/src/lib/valuation/dcfModels';
import { computeBaselineGrowthRates, computeCapmDiscountPercent } from '@/src/lib/valuation/dcfAssumptions';
import { dcfConfig } from '@/src/app/(main)/tools/dcf/config';
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


  // FCFE-Based DCF and EPS Growth DCF using the same starting assumptions as the DCF tool
  let fcfeDcfValue = 0;
  let fcfeDcfMargin = 0;
  let epsDcfValue = 0;
  let epsDcfMargin = 0;
  if (incomeStatement?.data?.[0] && cashFlowStatement?.data?.[0] && balanceSheetStatement?.data?.[0] && sharesOutstanding) {
    const { fcfeGrowth, epsGrowth } = computeBaselineGrowthRates(incomeStatement, cashFlowStatement);
    const discountRate = computeCapmDiscountPercent(profile?.beta ?? null);

    // FCFE model (use shared defaults + baseline growth and CAPM when available)
    fcfeDcfValue = calculateFcfePerShare(
      incomeStatement,
      cashFlowStatement,
      balanceSheetStatement,
      sharesOutstanding,
      {
        fcfeGrowthRate: fcfeGrowth,
        discountRatePercent: discountRate,
        forecastPeriodYears: dcfConfig.forecastPeriod,
        terminalGrowth: dcfConfig.terminalGrowth,
      }
    );
    if (fcfeDcfValue) fcfeDcfMargin = ((fcfeDcfValue - (currentPrice || 0)) / fcfeDcfValue) * 100;

    // EPS model
    epsDcfValue = calculateEpsPerShare(
      incomeStatement,
      sharesOutstanding,
      {
        epsGrowthRate: epsGrowth,
        discountRatePercent: discountRate,
        forecastPeriodYears: dcfConfig.forecastPeriod,
        exitMultiple: dcfConfig.exitMultiple,
      }
    );
    if (epsDcfValue) epsDcfMargin = ((epsDcfValue - (currentPrice || 0)) / epsDcfValue) * 100;
  }

  return (
    <OverviewCard 
      title="Intrinsic Value Analysis" 
      isLoading={isLoading}
      className="mt-5"
    >
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

            {/* Valuation Metrics */}
            <div className={styles.metricSection}>
              <h4 className={styles.sectionTitle}>FCFE-Based DCF</h4>
              <MetricRow
                label="Fair Value"
                value={formatPrice(fcfeDcfValue)}
                margin={formatPercent(fcfeDcfMargin)}
                tooltipKey="fcfeDcfValue"
              />
            </div>

            <div className={styles.metricSection}>
              <h4 className={styles.sectionTitle}>EPS Growth DCF</h4>
              <MetricRow
                label="Fair Value"
                value={formatPrice(epsDcfValue)}
                margin={formatPercent(epsDcfMargin)}
                tooltipKey="epsDcfValue"
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
              DCF Calculator
              <FiExternalLink className={styles.promoIcon} />
            </a>
          </div>
        </div>
      </div>
    </OverviewCard>
  );
} 