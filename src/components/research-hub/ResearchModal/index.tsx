import React from 'react';
import styles from './styles.module.css';
import Image from 'next/image';
import { FaTimes } from 'react-icons/fa';

interface Company {
  symbol: string;
  name: string;
  description: string;
  totalPercentage: number;
  assetType: string;
}

interface ResearchModalProps {
  company: Company;
  onClose: () => void;
}

export default function ResearchModal({ company, onClose }: ResearchModalProps) {
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
      img.onerror = null;
    };
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <FaTimes />
        </button>

        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <Image
              src={getCompanyLogoUrl(company.symbol)}
              alt={company.symbol}
              width={80}
              height={80}
              className={styles.companyLogo}
              onError={handleImageError}
              unoptimized
            />
          </div>
          <div className={styles.titleContainer}>
            <h1 className={styles.companyName}>{company.name}</h1>
            <p className={styles.companySymbol}>{company.symbol}</p>
          </div>
        </div>

        <div className={styles.reportContent}>
          <section className={styles.section}>
            <h2>Executive Summary</h2>
            <p>{company.description}</p>
          </section>

          <section className={styles.section}>
            <h2>Business Overview</h2>
            <p>Detailed analysis of the company's business model, competitive advantages, and market position.</p>
          </section>

          <section className={styles.section}>
            <h2>Investment Thesis</h2>
            <div className={styles.thesisPoints}>
              <div className={styles.thesisPoint}>
                <h3>Strengths</h3>
                <ul>
                  <li>Market leadership position</li>
                  <li>Strong financial performance</li>
                  <li>Innovation capabilities</li>
                </ul>
              </div>
              <div className={styles.thesisPoint}>
                <h3>Opportunities</h3>
                <ul>
                  <li>Market expansion potential</li>
                  <li>New product development</li>
                  <li>Strategic acquisitions</li>
                </ul>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2>Risk Factors</h2>
            <ul className={styles.riskList}>
              <li>Competitive market dynamics</li>
              <li>Regulatory environment</li>
              <li>Economic conditions</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
} 