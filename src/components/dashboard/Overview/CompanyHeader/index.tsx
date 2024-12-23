import React from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import loadingStyles from '@/styles/loading.module.css';
import PriceInfo from './PriceInfo';
import { CompanyHeaderProps } from './types';
import OverviewCard from '@/components/dashboard/DashboardCard/OverviewCard';
import { StockQuote } from '@/types/stock';

export default function CompanyHeader({
  symbol,
  name,
  exchange,
  isLoading,
  quote
}: Omit<CompanyHeaderProps, 'priceInfo'> & { quote?: StockQuote }) {
  const priceInfo = quote ? {
    currentPrice: quote.price,
    priceChange: quote.change,
    percentChange: quote.changesPercentage,
    marketStatus: 'regular'
  } : undefined;

  const displayExchange = quote?.exchange || '';

  return (
    <OverviewCard title="" isLoading={isLoading} className={styles.headerCard}>
      <div className={styles.companyHeaderContainer}>
        <div className={styles.logoContainer}>
          <Image
            src={isLoading ? '/images/placeholder.png' : `https://assets.letmedemo.com/public/fundamental/icons/companies/${symbol.replace('.', '')}.png`}
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
            {isLoading ? 'Loading' : symbol} {isLoading ? '| Loading' : `| ${displayExchange}`}
          </span>
        </div>
      </div>
      <PriceInfo
        currentPrice={priceInfo?.currentPrice ?? 0}
        priceChange={priceInfo?.priceChange ?? 0}
        percentChange={priceInfo?.percentChange ?? 0}
        marketStatus="regular"
        isLoading={isLoading}
      />
    </OverviewCard>
  );
}