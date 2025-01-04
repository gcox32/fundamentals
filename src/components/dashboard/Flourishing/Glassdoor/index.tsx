import React from 'react';
import styles from './styles.module.css';
import OverviewCard from '@/components/dashboard/DashboardCard/OverviewCard';
import { FaStar, FaThumbsUp, FaUserTie } from 'react-icons/fa';

interface GlassdoorOverviewProps {
    isLoading?: boolean;
}

export default function GlassdoorOverview({ isLoading }: GlassdoorOverviewProps) {
    // Mock data
    const mockData = {
        overallRating: {
            score: 4.2,
            description: "Above industry average employee satisfaction"
        },
        cultureValues: {
            score: 4.5,
            description: "Strong company culture and values alignment"
        },
        leadership: {
            score: 4.0,
            description: "Transparent and effective leadership team"
        }
    };

    return (
        <OverviewCard title="Glassdoor Insights" isLoading={isLoading}>
            <div className={styles.glassdoorContainer}>
                <div className={styles.metricCard}>
                    <div className={styles.metricIcon}>
                        <FaStar />
                    </div>
                    <div className={styles.metricInfo}>
                        <h4>Overall Rating</h4>
                        <div className={styles.score}>{mockData.overallRating.score}/5</div>
                        <p>{mockData.overallRating.description}</p>
                    </div>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricIcon}>
                        <FaThumbsUp />
                    </div>
                    <div className={styles.metricInfo}>
                        <h4>Culture & Values</h4>
                        <div className={styles.score}>{mockData.cultureValues.score}/5</div>
                        <p>{mockData.cultureValues.description}</p>
                    </div>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricIcon}>
                        <FaUserTie />
                    </div>
                    <div className={styles.metricInfo}>
                        <h4>Leadership</h4>
                        <div className={styles.score}>{mockData.leadership.score}/5</div>
                        <p>{mockData.leadership.description}</p>
                    </div>
                </div>
            </div>
        </OverviewCard>
    );
}
