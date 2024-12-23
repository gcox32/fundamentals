import React from 'react';
import styles from './styles.module.css';
import OverviewCard from '@/components/dashboard/DashboardCard/OverviewCard';
import { formatPrice, formatNumber, formatLargeNumber } from '@/utils/format';
import { StockQuote } from '@/types/stock';
import { CompanyProfile } from '@/types/company';

interface StockOverviewProps {
  isLoading: boolean;
  quote?: StockQuote;
  profile?: CompanyProfile;
}

export default function StockOverview({ isLoading, quote, profile }: StockOverviewProps) {
  return (
    <OverviewCard title="Trading" isLoading={isLoading}>
      <div className={styles.metricsGrid}>
        <div className={styles.metricSection}>
          <h4 className={styles.sectionTitle}>Trading Info</h4>
          <div className={styles.metric}>
            <span className={styles.label}>Market Cap</span>
            <span className={styles.value}>{formatLargeNumber(quote?.marketCap)}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>Beta</span>
            <span className={styles.value}>{formatNumber(profile?.beta)}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>Avg Volume</span>
            <span className={styles.value}>{formatLargeNumber(quote?.avgVolume)}</span>
          </div>
        </div>

        <div className={styles.metricSection}>
          <h4 className={styles.sectionTitle}>Price Range</h4>
          <div className={styles.metric}>
            <span className={styles.label}>52-week High</span>
            <span className={styles.value}>{formatPrice(quote?.yearHigh)}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>52-week Low</span>
            <span className={styles.value}>{formatPrice(quote?.yearLow)}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>50-day Average</span>
            <span className={styles.value}>{formatPrice(quote?.priceAvg50)}</span>
          </div>
        </div>

        <div className={styles.metricSection}>
          <h4 className={styles.sectionTitle}>Today's Trading</h4>
          <div className={styles.metric}>
            <span className={styles.label}>Volume</span>
            <span className={styles.value}>{formatLargeNumber(quote?.volume)}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>Day High</span>
            <span className={styles.value}>{formatPrice(quote?.dayHigh)}</span>
          </div>
          <div className={styles.metric}>
            <span className={styles.label}>Day Low</span>
            <span className={styles.value}>{formatPrice(quote?.dayLow)}</span>
          </div>
        </div>
      </div>
    </OverviewCard>
  );
} 