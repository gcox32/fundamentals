import React from 'react';
import styles from './styles.module.css';
import loadingStyles from '@/styles/loading.module.css';

interface PriceInfoProps {
  currentPrice: number;
  priceChange: number;
  percentChange: number;
  isAfterHours: boolean;
  isLoading?: boolean;
}

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
      <span className={`${styles.priceChange} ${priceChange >= 0 ? styles.positive : styles.negative}`}>
        {isLoading ? 'Loading' : formatChange(priceChange)}
      </span>
      |
      <span className={`${styles.percentChange} ${percentChange >= 0 ? styles.positive : styles.negative}`}>
        {isLoading ? 'Loading' : formatPercent(percentChange)}
      </span>
      {isAfterHours && !isLoading && (
        <span className={styles.afterHours}>AH</span>
      )}
    </div>
  );
} 