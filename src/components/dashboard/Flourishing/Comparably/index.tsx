import React from 'react';
import styles from './styles.module.css';
import OverviewCard from '@/components/dashboard/DashboardCard/OverviewCard';
import { FaUsers, FaDollarSign, FaBalanceScale } from 'react-icons/fa';

interface ComparablyOverviewProps {
    isLoading?: boolean;
}

export default function ComparablyOverview({ isLoading }: ComparablyOverviewProps) {
    // Mock data
    const mockData = {
        diversity: {
            score: 8.7,
            description: "Industry-leading diversity and inclusion metrics"
        },
        compensation: {
            score: 7.9,
            description: "Competitive compensation and benefits package"
        },
        workLife: {
            score: 8.2,
            description: "Strong work-life balance and flexibility"
        }
    };

    return (
        <OverviewCard title="Comparably Ratings" isLoading={isLoading}>
            <div className={styles.comparablyContainer}>
                <div className={styles.metricCard}>
                    <div className={styles.metricIcon}>
                        <FaUsers />
                    </div>
                    <div className={styles.metricInfo}>
                        <h4>Diversity Score</h4>
                        <div className={styles.score}>{mockData.diversity.score}/10</div>
                        <p>{mockData.diversity.description}</p>
                    </div>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricIcon}>
                        <FaDollarSign />
                    </div>
                    <div className={styles.metricInfo}>
                        <h4>Compensation</h4>
                        <div className={styles.score}>{mockData.compensation.score}/10</div>
                        <p>{mockData.compensation.description}</p>
                    </div>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricIcon}>
                        <FaBalanceScale />
                    </div>
                    <div className={styles.metricInfo}>
                        <h4>Work-Life Balance</h4>
                        <div className={styles.score}>{mockData.workLife.score}/10</div>
                        <p>{mockData.workLife.description}</p>
                    </div>
                </div>
            </div>
        </OverviewCard>
    );
}
