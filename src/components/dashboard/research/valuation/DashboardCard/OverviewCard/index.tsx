import React from 'react';
import DashboardCard from '../index';
import styles from './styles.module.css';

interface OverviewCardProps {
    title: string;
    isLoading?: boolean;
    children: React.ReactNode;
    className?: string;
}

export default function OverviewCard({ title, isLoading, children, className="" }: OverviewCardProps) {
    return (
        <DashboardCard 
            title={title} 
            isLoading={isLoading}
            className={`${styles.overviewCard} ${className}`}
        >
            {children}
        </DashboardCard>
    );
}