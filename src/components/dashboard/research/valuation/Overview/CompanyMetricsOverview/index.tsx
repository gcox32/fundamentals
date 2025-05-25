import React from 'react';
import styles from './styles.module.css';
import { CompanyRatios } from '@/types/company';
import { CashFlowStatement } from '@/types/financials';
import OverviewCard from '@/components/dashboard/research/valuation/DashboardCard/OverviewCard';
import { formatPercent, formatNumber, formatPrice } from '@/src/lib/utilities/format';
import { FiInfo } from 'react-icons/fi';
import Tooltip from '@/components/common/Tooltip';
import { metricTooltips } from './tooltips';

interface CompanyMetricsOverviewProps {
  isLoading: boolean;
  ratios?: CompanyRatios[];
  cashFlow?: CashFlowStatement[];
  marketCap?: number;
}

const MetricRow = ({ label, value, tooltipKey }: { label: string, value: React.ReactNode, tooltipKey: keyof typeof metricTooltips }) => (
  <div className={styles.metric}>
    <span className={styles.labelContainer}>
      <span className={styles.label}>{label}</span>
      <Tooltip content={metricTooltips[tooltipKey]}>
        <FiInfo className={styles.infoIcon} />
      </Tooltip>
    </span>
    <span className={styles.value}>{value}</span>
  </div>
);

export default function CompanyMetricsOverview({ 
  isLoading, 
  ratios, 
  cashFlow,
  marketCap 
}: CompanyMetricsOverviewProps) {
  const latestRatios = ratios?.[0];
  const latestCashFlow = cashFlow?.[0];

  // Calculate FCF metrics
  const fcfYield = marketCap && latestCashFlow?.freeCashFlow
    ? (latestCashFlow.freeCashFlow / marketCap) * 100
    : undefined;

  const fcfYieldAdjusted = marketCap && latestCashFlow?.freeCashFlow && latestCashFlow?.stockBasedCompensation
    ? ((latestCashFlow.freeCashFlow - latestCashFlow.stockBasedCompensation) / marketCap) * 100
    : undefined;

  const sbcImpact = latestCashFlow?.stockBasedCompensation && latestCashFlow?.freeCashFlow
    ? (latestCashFlow.stockBasedCompensation / latestCashFlow.freeCashFlow) * 100
    : undefined;

  return (
    <OverviewCard title="Financial Metrics" isLoading={isLoading}>
      <div className={styles.metricsGrid}>
        {/* Valuation Metrics */}
        <div className={styles.metricSection}>
          <h4 className={styles.sectionTitle}>Valuation</h4>
          <MetricRow 
            label="P/E Ratio" 
            value={formatNumber(latestRatios?.peRatioTTM)} 
            tooltipKey="peRatio" 
          />
          <MetricRow 
            label="PEG Ratio" 
            value={formatNumber(latestRatios?.pegRatioTTM)} 
            tooltipKey="pegRatio" 
          />
          <MetricRow 
            label="Price to Book" 
            value={formatNumber(latestRatios?.priceToBookRatioTTM)} 
            tooltipKey="priceToBook" 
          />
        </div>

        {/* Free Cash Flow Metrics */}
        <div className={styles.metricSection}>
          <h4 className={styles.sectionTitle}>Cash Flow</h4>
          <MetricRow 
            label="FCF Yield" 
            value={formatPercent(fcfYield)} 
            tooltipKey="fcfYield" 
          />
          <MetricRow 
            label="FCF Yield (ex-SBC)" 
            value={formatPercent(fcfYieldAdjusted)} 
            tooltipKey="fcfYieldAdjusted" 
          />
          <MetricRow 
            label="SBC Impact" 
            value={formatPercent(sbcImpact)} 
            tooltipKey="sbcImpact" 
          />
        </div>

        {/* Dividend Metrics */}
        <div className={styles.metricSection}>
          <h4 className={styles.sectionTitle}>Dividends</h4>
          <MetricRow 
            label="Dividend Yield" 
            value={formatPercent(latestRatios?.dividendYielPercentageTTM)} 
            tooltipKey="dividendYield" 
          />
          <MetricRow 
            label="Payout Ratio" 
            value={formatPercent(latestRatios?.payoutRatioTTM)} 
            tooltipKey="payoutRatio" 
          />
          <MetricRow 
            label="Dividend per Share" 
            value={formatPrice(latestRatios?.dividendPerShareTTM)} 
            tooltipKey="dividendPerShare" 
          />
        </div>

        {/* Returns Metrics */}
        <div className={styles.metricSection}>
          <h4 className={styles.sectionTitle}>Returns</h4>
          <MetricRow 
            label="Return on Equity" 
            value={formatPercent(latestRatios?.returnOnEquityTTM, true)} 
            tooltipKey="returnOnEquity" 
          />
          <MetricRow 
            label="Return on Assets" 
            value={formatPercent(latestRatios?.returnOnAssetsTTM, true)} 
            tooltipKey="returnOnAssets" 
          />
          <MetricRow 
            label="ROCE" 
            value={formatPercent(latestRatios?.returnOnCapitalEmployedTTM, true)} 
            tooltipKey="returnOnCapital" 
          />
        </div>

        {/* Profit Margins */}
        <div className={styles.metricSection}>
          <h4 className={styles.sectionTitle}>Profit Margins</h4>
          <MetricRow 
            label="Gross Margin" 
            value={formatPercent(latestRatios?.grossProfitMarginTTM, true)} 
            tooltipKey="grossMargin" 
          />
          <MetricRow 
            label="Operating Margin" 
            value={formatPercent(latestRatios?.operatingProfitMarginTTM, true)} 
            tooltipKey="operatingMargin" 
          />
          <MetricRow 
            label="Net Margin" 
            value={formatPercent(latestRatios?.netProfitMarginTTM, true)} 
            tooltipKey="netMargin" 
          />
        </div>
      </div>
    </OverviewCard>
  );
} 