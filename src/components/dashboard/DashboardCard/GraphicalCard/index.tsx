import React from 'react';
import DashboardCard from '../index';
import styles from './styles.module.css';

interface GraphicalCardProps {
    title: string;
    isLoading?: boolean;
    children: React.ReactNode;
    onClick?: () => void;
}

export default function GraphicalCard({ title, isLoading, children, onClick }: GraphicalCardProps) {
    return (
        <DashboardCard 
            title={title} 
            isLoading={isLoading}
            className={styles.graphicalCard}
        >
            <div onClick={onClick} className={styles.clickableContent}>
                {children}
            </div>
        </DashboardCard>
    );
}