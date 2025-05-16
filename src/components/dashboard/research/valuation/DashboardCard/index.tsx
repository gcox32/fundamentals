import React from 'react';
import styles from './styles.module.css';
import loadingStyles from '@/styles/loading.module.css';

interface DashboardCardProps {
    title: string;
    isLoading?: boolean;
    children: React.ReactNode;
    className?: string;
}

export default function DashboardCard({ title, isLoading, children, className }: DashboardCardProps) {
    return (
        <div className={`${styles.card} ${isLoading ? loadingStyles.loading : ''} ${className || ''}`}>
            {title && <h3 className={styles.cardTitle}>{title}</h3>}
            <div className={styles.cardContent}>
                {children}
            </div>
        </div>
    );
}
