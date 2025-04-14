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
import { calculateGrowthRate, calculateDCF, calculateEarningsBased, calculateAnnualFreeCashFlow, calculateAnnualEPS } from './calculations';
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

  const calculateValuations = () => {
    if (!incomeStatement?.data?.[0] || !cashFlowStatement?.data?.[0] || !balanceSheetStatement?.data?.[0] || !sharesOutstanding) {
      return null;
    }

    const latest = {
      income: incomeStatement.data[0],
      cashFlow: cashFlowStatement.data[0],
      balance: balanceSheetStatement.data[0]
    };

    // Convert quarterly FCF values to annualized values before calculating growth
    const quarterlyFcfValues = cashFlowStatement.data.map(d => d.freeCashFlow || 0);
    const fcfGrowthRate = calculateGrowthRate(quarterlyFcfValues);

    // console.log('fcfGrowthRate', fcfGrowthRate);
    const earningsGrowthRate = calculateGrowthRate(
      incomeStatement.data.map(d => d.netIncome || 0)
    );

    const freeCashFlow = calculateAnnualFreeCashFlow(
      cashFlowStatement.data.map(d => d.freeCashFlow || 0),
      Math.min(4, cashFlowStatement.data.length)
    );
    if (freeCashFlow <= 0) {
      return null; // Skip DCF calculation if FCF is invalid
    }
    const taxRate = latest.income.incomeTaxExpense && latest.income.incomeBeforeTax && latest.income.incomeTaxExpense > 0
      ? latest.income.incomeTaxExpense / latest.income.incomeBeforeTax
      : 0.21;

    const beta = profile?.beta
      ? 0.035 + (profile.beta * 0.055)
      : 0.035 + 0.055; // Default to market average (beta = 1)

    // Calculate different valuations
    const dcfValue = calculateDCF(
      freeCashFlow,
      fcfGrowthRate,
      sharesOutstanding,
      marketCap || 0,
      latest.balance.totalDebt || 0,
      beta,
      latest.income.interestExpense && latest.balance.totalDebt
        ? (latest.income.interestExpense / latest.balance.totalDebt)
        : 0.05,
      taxRate,
      0.02,
      5
    );

    const earningsValue = calculateEarningsBased(
      calculateAnnualEPS(
        incomeStatement.data.map(d => d.epsdiluted || 0),
        Math.min(4, incomeStatement.data.length)
      ),
      earningsGrowthRate,
      ratios?.[0]?.peRatioTTM || 22
    );
    // Calculate margins of safety
    const getMargin = (value: number) => {
      if (!currentPrice || !value) return 0;
      return ((value - currentPrice) / value) * 100;
    };

    return {
      dcf: { value: dcfValue, margin: getMargin(dcfValue) },
      earnings: { value: earningsValue, margin: getMargin(earningsValue) }
    };
  };

  const valuations = calculateValuations();

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