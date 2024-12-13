import React from 'react';
import styles from './styles.module.css';
import loadingStyles from '@/styles/loading.module.css';
import { PriceInfoProps } from './types';

export default function PriceInfo({
  currentPrice,
  priceChange,
  percentChange,
  isAfterHours,
  isLoading
}: PriceInfoProps) {
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  const formatChange = (change: number) => (change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2));
  const formatPercent = (percent: number) => (percent >= 0 ? `+${percent.toFixed(2)}%` : `${percent.toFixed(2)}%`);

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
      {isAfterHours && !isLoading && (
        <span className={styles.afterHours}>AH</span>
      )}
    </div>
  );
} 