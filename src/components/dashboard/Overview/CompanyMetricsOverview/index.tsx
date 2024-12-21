import React from 'react';
import styles from './styles.module.css';
import { CompanyRatios } from '@/types/company';
import { CashFlowStatement } from '@/types/financials';
import OverviewCard from '@/components/dashboard/DashboardCard/OverviewCard';
import { formatPercent, formatNumber, formatPrice } from '@/utils/format';

interface CompanyMetricsOverviewProps {
  isLoading: boolean;
  ratios?: CompanyRatios[];
  cashFlow?: CashFlowStatement[];
  marketCap?: number;
}

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
            <span className={styles.label}>FCF Yield</span>
            <span className={styles.value}>{formatPercent(fcfYield)}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>FCF Yield (ex-SBC)</span>
            <span className={styles.value}>{formatPercent(fcfYieldAdjusted)}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>SBC Impact</span>
            <span className={styles.value}>{formatPercent(sbcImpact)}</span>
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

        {/* Returns Metrics */}
        <div className={styles.metricSection}>
          <h4 className={styles.sectionTitle}>Returns</h4>
          <div className={styles.metric}>
            <span className={styles.label}>Return on Equity</span>
            <span className={styles.value}>{formatPercent(latestRatios?.returnOnEquityTTM)}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>Return on Assets</span>
            <span className={styles.value}>{formatPercent(latestRatios?.returnOnAssetsTTM)}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>Return on Capital Employed</span>
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