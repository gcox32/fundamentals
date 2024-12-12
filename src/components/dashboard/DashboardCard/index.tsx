import React from 'react';
import styles from './styles.module.css';
import loadingStyles from '@/styles/loading.module.css';
interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
  isLoading?: boolean;
}

export default function DashboardCard({ title, children, isLoading }: DashboardCardProps) {
  return (
    <div className={`${styles.card} ${isLoading ? loadingStyles.loading : ''}`}>
      <h2 className={`${styles.cardTitle} ${isLoading ? loadingStyles.pulse : ''}`}>{title}</h2>
      <div className={`${styles.cardContent} ${isLoading ? loadingStyles.pulse : ''}`}>
        {children}
      </div>
    </div>
  );
} 