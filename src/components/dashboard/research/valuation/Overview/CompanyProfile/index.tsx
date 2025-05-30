import React from 'react';
import styles from './styles.module.css';
import type { CompanyProfile } from '@/types/company';
import { FaMapMarkerAlt, FaUsers, FaChartPie, FaIndustry, FaGlobe } from 'react-icons/fa';
import OverviewCard from '@/components/dashboard/research/valuation/DashboardCard/OverviewCard';
import { formatAddress, formatEmployees } from '@/src/lib/utilities/format';

interface CompanyProfileProps {
  isLoading: boolean;
  profile?: CompanyProfile;
}

export default function CompanyProfile({ isLoading, profile }: CompanyProfileProps) {

  return (
    <OverviewCard title="Company Profile" isLoading={isLoading} className={styles.marginTopTwo}>
      <div className={styles.profileContainer}>
        <div className={styles.profileGrid}>
          <div className={styles.profileItem}>
            <span className={styles.label}>
              <FaChartPie className={styles.icon} /> Sector
            </span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : profile?.sector || 'N/A'}
            </span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.label}>
              <FaIndustry className={styles.icon} /> Industry
            </span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : profile?.industry || 'N/A'}
            </span>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.label}>
              <FaMapMarkerAlt className={styles.icon} /> Headquarters
            </span>
            <span className={styles.value}>{isLoading ? 'Loading...' : formatAddress(profile as CompanyProfile)}</span>
          </div>
          <div className={styles.profileItem} style={{ overflowX: 'scroll' }}>
            <span className={styles.label}>
              <FaGlobe className={styles.icon} /> Website
            </span>
            <a 
              href={profile?.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={styles.link}
            >
              {isLoading ? 'Loading...' : profile?.website || 'N/A'}
            </a>
          </div>
          <div className={styles.profileItem}>
            <span className={styles.label}>
              <FaUsers className={styles.icon} /> Employees
            </span>
            <span className={styles.value}>
              {isLoading ? 'Loading...' : formatEmployees(profile?.fullTimeEmployees)}
            </span>
          </div>
        </div>
        <p className={styles.description}>
          {isLoading ? 'Loading...' : profile?.description || 'No description available.'}
        </p>
      </div>
    </OverviewCard>
  );
} 