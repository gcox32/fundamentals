import React from 'react';
import styles from './styles.module.css';
import { CompanyRatios } from '@/types/company';
import OverviewCard from '@/components/dashboard/DashboardCard/OverviewCard';
import { formatPercent, formatNumber, formatPrice } from '@/utils/format';

interface CompanyMetricsOverviewProps {
  isLoading: boolean;
  ratios?: CompanyRatios[];
}

export default function CompanyMetricsOverview({ isLoading, ratios }: CompanyMetricsOverviewProps) {
  const latestRatios = ratios?.[0];

  return (
    <OverviewCard title="Financial Metrics" isLoading={isLoading}>
      <div className={styles.metricsGrid}>
        {/* Valuation Metrics */}
        <div className={styles.metricSection}>
          <h4 className={styles.sectionTitle}>Valuation</h4>
          <div className={styles.metric}>
            <span className={styles.label}>P/E Ratio</span>
            <span className={styles.value}>{formatNumber(latestRatios?.peRatioTTM)}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>PEG Ratio</span>
            <span className={styles.value}>{formatNumber(latestRatios?.pegRatioTTM)}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>Price to Book</span>
            <span className={styles.value}>{formatNumber(latestRatios?.priceToBookRatioTTM)}</span>
          </div>
        </div>

        {/* Free Cash Flow Metrics */}
        <div className={styles.metricSection}>
          <h4 className={styles.sectionTitle}>Cash Flow</h4>
          <div className={styles.metric}>
            <span className={styles.label}>FCF per Share</span>
            <span className={styles.value}>{formatPrice(latestRatios?.freeCashFlowPerShareTTM)}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>Operating CF Ratio</span>
            <span className={styles.value}>{formatNumber(latestRatios?.operatingCashFlowSalesRatioTTM)}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>CF Coverage</span>
            <span className={styles.value}>{formatNumber(latestRatios?.cashFlowCoverageRatiosTTM)}</span>
          </div>
        </div>

        {/* Dividend Metrics */}
        <div className={styles.metricSection}>
          <h4 className={styles.sectionTitle}>Dividends</h4>
          <div className={styles.metric}>
            <span className={styles.label}>Dividend Yield</span>
            <span className={styles.value}>{formatPercent(latestRatios?.dividendYielPercentageTTM)}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>Payout Ratio</span>
            <span className={styles.value}>{formatPercent(latestRatios?.payoutRatioTTM)}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>Dividend per Share</span>
            <span className={styles.value}>{formatPrice(latestRatios?.dividendPerShareTTM)}</span>
          </div>
        </div>

        {/* Debt Metrics */}
        <div className={styles.metricSection}>
          <h4 className={styles.sectionTitle}>Cash & Debt</h4>
          <div className={styles.metric}>
            <span className={styles.label}>Current Ratio</span>
            <span className={styles.value}>{formatNumber(latestRatios?.currentRatioTTM)}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>Total Debt/Capital</span>
            <span className={styles.value}>{formatPercent(latestRatios?.totalDebtToCapitalizationTTM)}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>CF/Debt Ratio</span>
            <span className={styles.value}>{formatNumber(latestRatios?.cashFlowToDebtRatioTTM)}</span>
          </div>
        </div>

        {/* Returns Metrics */}
        <div className={styles.metricSection}>
          <h4 className={styles.sectionTitle}>Returns on Equity</h4>
          <div className={styles.metric}>
            <span className={styles.label}>ROE</span>
            <span className={styles.value}>{formatPercent(latestRatios?.returnOnEquityTTM)}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>ROA</span>
            <span className={styles.value}>{formatPercent(latestRatios?.returnOnAssetsTTM)}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>ROCE</span>
            <span className={styles.value}>{formatPercent(latestRatios?.returnOnCapitalEmployedTTM)}</span>
          </div>
        </div>

        {/* Profit Margins */}
        <div className={styles.metricSection}>
          <h4 className={styles.sectionTitle}>Profit Margins</h4>
          <div className={styles.metric}>
            <span className={styles.label}>Gross Margin</span>
            <span className={styles.value}>{formatPercent(latestRatios?.grossProfitMarginTTM)}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>Operating Margin</span>
            <span className={styles.value}>{formatPercent(latestRatios?.operatingProfitMarginTTM)}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>Net Margin</span>
            <span className={styles.value}>{formatPercent(latestRatios?.netProfitMarginTTM)}</span>
          </div>
        </div>
      </div>
    </OverviewCard>
  );
} 