import React from 'react';
import styles from './styles.module.css';
import loadingStyles from '@/styles/loading.module.css';
import { CompanySummaryProps } from '@/types/company';
import { FaMapMarkerAlt, FaUsers, FaChartPie, FaIndustry, FaGlobe } from 'react-icons/fa';

export default function CompanyProfile({ isLoading, profile, events, valuation }: CompanySummaryProps) {
  const formatMarketCap = (value: number) => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
  };

  const formatAddress = () => {
    if (!profile) return '';
    if (profile.country === 'United States') {
        profile.country = 'United\u00A0States';
    }
    const parts = [
      profile.city,
      profile.state,
      profile.country
    ].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className={`${styles.summaryContainer} ${isLoading ? loadingStyles.loading : ''}`}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Company Profile</h3>
        <div className={styles.profileContainer}>
        <div className={styles.profileGrid}>
          <div className={styles.profileItem}>
            <span className={styles.label}>
              <FaChartPie className={styles.icon} /> Sector
            </span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : profile?.sector}
            </span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.label}>
              <FaIndustry className={styles.icon} /> Industry
            </span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : profile?.industry}
            </span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.label}>
              <FaMapMarkerAlt className={styles.icon} /> Headquarters
            </span>
            <span className={styles.value}>{isLoading ? 'Loading...' : formatAddress()}</span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.label}>
              <FaGlobe className={styles.icon} /> Website
            </span>
            <a href={profile?.website} target="_blank" rel="noopener noreferrer" className={styles.link}>
              {isLoading ? 'Loading...' : profile?.website}
            </a>
          </div>
          {profile?.fullTimeEmployees && (
            <div className={styles.profileItem}>
              <span className={styles.label}>
                <FaUsers className={styles.icon} /> Employees
              </span>
              <span className={styles.value}>
                {profile.fullTimeEmployees.toLocaleString()}
              </span>
            </div>
          )}
        </div>
        <p className={styles.description}>{isLoading ? 'Loading...' : profile?.longBusinessSummary}</p>
        </div>
      </div>
    </div>
  );
} 