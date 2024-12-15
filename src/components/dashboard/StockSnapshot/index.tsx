import React from 'react';
import styles from './styles.module.css';
import type { StockSnapshotItem } from '@/types/stock';
import { FaChartLine, FaPercent, FaDollarSign, FaExchangeAlt, FaChartBar } from 'react-icons/fa';
import OverviewCard from '@/components/dashboard/DashboardCard/OverviewCard';

interface StockSnapshotProps {
  isLoading: boolean;
  snapshot?: StockSnapshotItem;
}

export default function StockSnapshot({ isLoading, snapshot }: StockSnapshotProps) {
  const formatNumber = (num: number) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    return num.toLocaleString();
  };

  return (
    <OverviewCard title="Market Snapshot" isLoading={isLoading}>
      <div className={styles.snapshotContainer}>
        <div className={styles.snapshotGrid}>
          <div className={styles.snapshotItem}>
            <span className={styles.label}>
              <FaChartLine className={styles.icon} /> Day Range
            </span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : snapshot?.regularMarketDayRange}
            </span>
          </div>

          <div className={styles.snapshotItem}>
            <span className={styles.label}>
              <FaChartLine className={styles.icon} /> 52 Week Range
            </span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : snapshot?.fiftyTwoWeekRange}
            </span>
          </div>

          <div className={styles.snapshotItem}>
            <span className={styles.label}>
              <FaChartBar className={styles.icon} /> Volume
            </span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : formatNumber(snapshot?.regularMarketVolume || 0)}
            </span>
          </div>

          <div className={styles.snapshotItem}>
            <span className={styles.label}>
              <FaChartBar className={styles.icon} /> Avg. Volume
            </span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : formatNumber(snapshot?.averageDailyVolume3Month || 0)}
            </span>
          </div>

          <div className={styles.snapshotItem}>
            <span className={styles.label}>
              <FaDollarSign className={styles.icon} /> Market Cap
            </span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : formatNumber(snapshot?.marketCap || 0)}
            </span>
          </div>

          <div className={styles.snapshotItem}>
            <span className={styles.label}>
              <FaPercent className={styles.icon} /> P/E Ratio
            </span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : snapshot?.trailingPE.toFixed(2)}
            </span>
          </div>

          <div className={styles.snapshotItem}>
            <span className={styles.label}>
              <FaDollarSign className={styles.icon} /> Dividend Rate
            </span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : snapshot?.dividendRate.toFixed(2)}
            </span>
          </div>

          <div className={styles.snapshotItem}>
            <span className={styles.label}>
              <FaPercent className={styles.icon} /> Dividend Yield
            </span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : `${(snapshot?.dividendYield || 0).toFixed(2)}%`}
            </span>
          </div>
        </div>
      </div>
    </OverviewCard>
  );
} 