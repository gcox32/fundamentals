import React from 'react';
import styles from './styles.module.css';
import loadingStyles from '@/styles/loading.module.css';
import { PriceInfoProps } from './types';

export default function PriceInfo({
  currentPrice,
  priceChange,
  percentChange,
  marketStatus,
  isLoading
}: PriceInfoProps) {
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatChange = (change: number) => (change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2));
  const formatPercent = (percent: number) => (percent >= 0 ? `+${percent.toFixed(2)}%` : `${percent.toFixed(2)}%`);

  const getMarketStatusBadge = () => {
    if (marketStatus === 'pre') return <span className={styles.marketStatus}>Pre</span>;
    if (marketStatus === 'after') return <span className={styles.marketStatus}>AH</span>;
    return null;
  };

  return (
    <div className={`${styles.priceContainer} ${isLoading ? loadingStyles.pulse : ''}`}>
      <span className={styles.currentPrice}>
        {isLoading ? 'Loading' : formatPrice(currentPrice)}
      </span>
      <div className={`${styles.priceChangeContainer} ${priceChange >= 0 ? styles.positive : styles.negative}`}>
        <span className={styles.priceChange}>
          {isLoading ? 'Loading' : formatChange(priceChange)}
        </span>
        |
        <span className={styles.percentChange}>
          {isLoading ? 'Loading' : formatPercent(percentChange)}
        </span>
      </div>
      {!isLoading && getMarketStatusBadge()}
    </div>
  );
} 