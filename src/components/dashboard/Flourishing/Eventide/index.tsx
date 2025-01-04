import React from 'react';
import styles from './styles.module.css';
import OverviewCard from '@/components/dashboard/DashboardCard/OverviewCard';
import { FaStar, FaHandshake, FaLeaf } from 'react-icons/fa';

interface EventideOverviewProps {
    isLoading?: boolean;
}

export default function EventideOverview({ isLoading }: EventideOverviewProps) {
    // Mock data
    const mockData = {
        businessAlignment: {
            score: 8.5,
            description: "Strong alignment with human flourishing principles"
        },
        ethicalLeadership: {
            score: 7.8,
            description: "Demonstrated commitment to ethical business practices"
        },
        sustainabilityFocus: {
            score: 9.0,
            description: "Industry-leading environmental initiatives"
        }
    };

    return (
        <OverviewCard title="Eventide Analysis" isLoading={isLoading}>
            <div className={styles.eventideContainer}>
                <div className={styles.metricCard}>
                    <div className={styles.metricIcon}>
                        <FaHandshake />
                    </div>
                    <div className={styles.metricInfo}>
                        <h4>Business Alignment</h4>
                        <div className={styles.score}>{mockData.businessAlignment.score}/10</div>
                        <p>{mockData.businessAlignment.description}</p>
                    </div>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricIcon}>
                        <FaStar />
                    </div>
                    <div className={styles.metricInfo}>
                        <h4>Ethical Leadership</h4>
                        <div className={styles.score}>{mockData.ethicalLeadership.score}/10</div>
                        <p>{mockData.ethicalLeadership.description}</p>
                    </div>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricIcon}>
                        <FaLeaf />
                    </div>
                    <div className={styles.metricInfo}>
                        <h4>Sustainability Focus</h4>
                        <div className={styles.score}>{mockData.sustainabilityFocus.score}/10</div>
                        <p>{mockData.sustainabilityFocus.description}</p>
                    </div>
                </div>
            </div>
        </OverviewCard>
    );
}
