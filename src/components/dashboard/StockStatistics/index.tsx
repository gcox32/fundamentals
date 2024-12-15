import React from 'react';
import styles from './styles.module.css';
import type { StockStatistics } from '@/types/stock';
import { FaChartLine, FaPercent, FaUsers, FaBalanceScale, FaMoneyBillWave } from 'react-icons/fa';
import OverviewCard from '@/components/dashboard/DashboardCard/OverviewCard';

interface StockStatisticsProps {
  isLoading: boolean;
  statistics?: StockStatistics;
}

export default function StockStatistics({ isLoading, statistics }: StockStatisticsProps) {
  return (
    <OverviewCard title="Key Statistics" isLoading={isLoading}>
      <div className={styles.statisticsContainer}>
        <div className={styles.statisticsGrid}>
          <div className={styles.statisticItem}>
            <span className={styles.label}>
              <FaMoneyBillWave className={styles.icon} /> Enterprise Value
            </span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : statistics?.enterpriseValue.fmt}
            </span>
          </div>

          <div className={styles.statisticItem}>
            <span className={styles.label}>
              <FaChartLine className={styles.icon} /> Beta
            </span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : statistics?.beta.fmt}
            </span>
          </div>

          <div className={styles.statisticItem}>
            <span className={styles.label}>
              <FaBalanceScale className={styles.icon} /> Forward P/E
            </span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : statistics?.forwardPE.fmt}
            </span>
          </div>

          <div className={styles.statisticItem}>
            <span className={styles.label}>
              <FaBalanceScale className={styles.icon} /> Price/Book
            </span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : statistics?.priceToBook.fmt}
            </span>
          </div>

          <div className={styles.statisticItem}>
            <span className={styles.label}>
              <FaPercent className={styles.icon} /> Profit Margins
            </span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : statistics?.profitMargins.fmt}
            </span>
          </div>

          <div className={styles.statisticItem}>
            <span className={styles.label}>
              <FaChartLine className={styles.icon} /> 52 Week Change
            </span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : statistics?.["52WeekChange"].fmt}
            </span>
          </div>

          <div className={styles.statisticItem}>
            <span className={styles.label}>
              <FaUsers className={styles.icon} /> Shares Outstanding
            </span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : statistics?.sharesOutstanding.fmt}
            </span>
          </div>

          <div className={styles.statisticItem}>
            <span className={styles.label}>
              <FaUsers className={styles.icon} /> Float Shares
            </span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : statistics?.floatShares.fmt}
            </span>
          </div>

          <div className={styles.statisticItem}>
            <span className={styles.label}>
              <FaUsers className={styles.icon} /> Insider Ownership
            </span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : statistics?.heldPercentInsiders.fmt}
            </span>
          </div>

          <div className={styles.statisticItem}>
            <span className={styles.label}>
              <FaUsers className={styles.icon} /> Institutional Ownership
            </span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : statistics?.heldPercentInstitutions.fmt}
            </span>
          </div>
        </div>
      </div>
    </OverviewCard>
  );
} 