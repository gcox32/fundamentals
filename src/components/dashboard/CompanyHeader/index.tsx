import React from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import loadingStyles from '@/styles/loading.module.css';
import PriceInfo from '../PriceInfo';

interface CompanyHeaderProps {
  symbol: string;
  name: string;
  exchange: string;
  isLoading?: boolean;
  priceInfo?: {
    currentPrice: number;
    priceChange: number;
    percentChange: number;
    isAfterHours: boolean;
  };
}

export default function CompanyHeader({
  symbol,
  name,
  exchange,
  isLoading,
  priceInfo
}: CompanyHeaderProps) {
  return (
    <div className={`${styles.companyHeader} ${isLoading ? loadingStyles.loading : ''}`}>
      <div className={styles.companyHeaderContainer}>
        <div className={styles.logoContainer}>
          <Image
            src={isLoading ? '/images/placeholder.png' : `https://assets.letmedemo.com/public/fundamental/icons/companies/${symbol}.png`}
            alt={`${name} logo`}
            width={68}
            height={68}
            className={`${styles.logo} ${isLoading ? loadingStyles.pulse : ''}`}
            onError={(e) => {
              e.currentTarget.src = 'https://assets.letmedemo.com/fundamental/icons/companies/placeholder.png';
            }}
            unoptimized
          />
        </div>
        <div className={styles.companyInfo}>
          <h2 className={`${styles.companyName} ${isLoading ? loadingStyles.pulse : ''}`}>
            {isLoading ? 'Loading' : name}
          </h2>
          <span className={`${styles.companySymbol} ${isLoading ? loadingStyles.pulse : ''}`}>
            {isLoading ? 'Loading' : symbol} | {isLoading ? 'Loading' : exchange}
          </span>
        </div>
      </div>
      <PriceInfo
        currentPrice={priceInfo?.currentPrice ?? 0}
        priceChange={priceInfo?.priceChange ?? 0}
        percentChange={priceInfo?.percentChange ?? 0}
        isAfterHours={priceInfo?.isAfterHours ?? false}
        isLoading={isLoading}
      />
    </div>
  );
}