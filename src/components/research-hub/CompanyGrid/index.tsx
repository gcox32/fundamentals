'use client';

import React from 'react';
import styles from './styles.module.css';
import { FaChartLine, FaBuilding, FaSearch } from 'react-icons/fa';
import Image from 'next/image';

interface Company {
  symbol: string;
  name: string;
  description: string;
  totalPercentage: number;
  assetType: string;
}

interface CompanyGridProps {
  companies: Company[];
  onCompanySelect: (company: Company) => void;
}

function EmptyState() {
  return (
    <div className={styles.emptyState}>
      <FaSearch className={styles.emptyIcon} />
      <h3>No matching companies found</h3>
      <p>Try adjusting your search criteria or selected themes</p>
    </div>
  );
}

export default function CompanyGrid({ companies, onCompanySelect }: CompanyGridProps) {
  const getCompanyLogoUrl = (symbol: string) =>
    `https://assets.letmedemo.com/public/fundamental/icons/companies/${symbol.replace('.', '')}.png`;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const symbol = img.alt;
    
    // Try the IEX API logo first
    img.src = `https://storage.googleapis.com/iex/api/logos/${symbol}.png`;
    
    // If IEX fails, use placeholder
    img.onerror = () => {
      img.src = '/images/placeholder.png';
      // Remove the error handler to prevent infinite loop
      img.onerror = null;
    };
  };

  return (
    <div className={styles.grid}>
      {companies.length > 0 ? (
        companies.map((company) => (
          <button
            key={company.symbol}
            className={styles.card}
            onClick={() => onCompanySelect(company)}
          >
            <div className={styles.header}>
              <div className={styles.titleSection}>
                <div className={styles.symbolWrapper}>
                  <div className={styles.logoWrapper}>
                    <Image
                      src={getCompanyLogoUrl(company.symbol)}
                      alt={company.symbol}
                      width={24}
                      height={24}
                      className={styles.companyLogo}
                      onError={handleImageError}
                      unoptimized
                    />
                  </div>
                  <h3 className={styles.symbol}>{company.symbol}</h3>
                </div>
                <p className={styles.name}>{company.name}</p>
              </div>
              <div className={styles.percentage}>
                <span>{(company.totalPercentage * 100).toFixed(2)}%</span>
              </div>
            </div>
            
            <div className={styles.body}>
              <div className={styles.description}>
                <FaBuilding className={styles.icon} />
                <p>{company.description}</p>
              </div>
            </div>
          </button>
        ))
      ) : (
        <EmptyState />
      )}
    </div>
  );
} 