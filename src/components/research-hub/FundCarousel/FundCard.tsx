import React from 'react';
import Image from 'next/image';
import styles from './styles.module.css';

interface Fund {
  symbol: string;
  name: string;
  description: string;
}

interface FundCardProps {
  fund: Fund;
  isSelected: boolean;
  style: React.CSSProperties;
  onClick: () => void;
}

export default function FundCard({ fund, isSelected, style, onClick }: FundCardProps) {
  return (
    <button
      className={`${styles.fundCard} ${isSelected ? styles.selected : ''}`}
      onClick={onClick}
      style={style}
    >
      <div className={styles.cardContent}>
        <div className={styles.logoContainer}>
          <Image 
            src="/images/eventide-logo.svg"
            alt="Eventide Logo"
            width={80}
            height={24}
            className={styles.logo}
          />
        </div>
        <h3 className={styles.fundSymbol}>{fund.symbol}</h3>
        <p className={styles.fundName}>{fund.name}</p>
        <p className={styles.fundDescription}>{fund.description}</p>
      </div>
    </button>
  );
} 