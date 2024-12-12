import React from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import loadingStyles from '@/styles/loading.module.css';

interface CompanyHeaderProps {
  symbol: string;
  name: string;
  exchange: string;
  isLoading?: boolean;
}

export default function CompanyHeader({ symbol, name, exchange, isLoading }: CompanyHeaderProps) {
  return (
    <div className={`${styles.companyHeader} ${isLoading ? loadingStyles.loading : ''}`}>
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
        <h1 className={`${styles.companyName} ${isLoading ? loadingStyles.pulse : ''}`}>{isLoading ? 'Loading' : name}</h1>
        <span className={`${styles.companySymbol} ${isLoading ? loadingStyles.pulse : ''}`}>{isLoading ? 'Loading' : symbol} | {isLoading ? 'Loading' : exchange}</span>
      </div>
    </div>
  );
} 