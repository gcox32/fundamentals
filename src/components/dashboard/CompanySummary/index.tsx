import React from 'react';
import styles from './styles.module.css';
import loadingStyles from '@/styles/loading.module.css';
import { CompanySummaryProps } from './types';

export default function CompanySummary({ isLoading, profile, events, valuation }: CompanySummaryProps) {
  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className={`${styles.summaryContainer} ${isLoading ? loadingStyles.loading : ''}`}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Company Profile</h3>
        <div className={styles.profileGrid}>
          <div className={styles.profileItem}>
            <span className={styles.label}>Sector</span>
            <span className={styles.value}>{isLoading ? 'Loading...' : profile?.sector}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.label}>Industry</span>
            <span className={styles.value}>{isLoading ? 'Loading...' : profile?.industry}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.label}>Location</span>
            <span className={styles.value}>{isLoading ? 'Loading...' : profile?.location}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.label}>Website</span>
            <a href={profile?.website} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {isLoading ? 'Loading...' : profile?.website}
            </a>
          </div>
        </div>
        <p className={styles.description}>{isLoading ? 'Loading...' : profile?.description}</p>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Upcoming Events</h3>
        <div className={styles.eventsGrid}>
          <div className={styles.eventItem}>
            <span className={styles.label}>Next Earnings</span>
            <span className={styles.value}>{isLoading ? 'Loading...' : events?.nextEarningsDate}</span>
          </div>
          <div className={styles.eventItem}>
            <span className={styles.label}>Next Dividend</span>
            <span className={styles.value}>{isLoading ? 'Loading...' : events?.nextDividendDate}</span>
          </div>
          <div className={styles.eventItem}>
            <span className={styles.label}>Ex-Dividend Date</span>
            <span className={styles.value}>{isLoading ? 'Loading...' : events?.nextExDividendDate}</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Valuation</h3>
        <div className={styles.valuationGrid}>
          <div className={styles.valuationItem}>
            <span className={styles.label}>Market Cap</span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : formatMarketCap(valuation?.marketCap || 0)}
            </span>
          </div>
          <div className={styles.valuationItem}>
            <span className={styles.label}>P/E Ratio (TTM)</span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : valuation?.peRatioTTM?.toFixed(2)}
            </span>
          </div>
          <div className={styles.valuationItem}>
            <span className={styles.label}>P/E Ratio (Forward)</span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : valuation?.peRatioForward?.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 