import React from 'react';
import styles from './styles.module.css';
import OverviewCard from '@/components/dashboard/DashboardCard/OverviewCard';
import { FaReddit, FaTwitter, FaChartLine } from 'react-icons/fa';

interface SocialsOverviewProps {
    isLoading?: boolean;
}

export default function SocialsOverview({ isLoading }: SocialsOverviewProps) {
    // Mock data
    const mockData = {
        redditSentiment: {
            score: 76,
            description: "Positive community sentiment on Reddit"
        },
        twitterEngagement: {
            score: 82,
            description: "High social media engagement rate"
        },
        marketPerception: {
            score: 8.4,
            description: "Strong overall market perception"
        }
    };

    return (
        <OverviewCard title="Social Media Insights" isLoading={isLoading}>
            <div className={styles.socialsContainer}>
                <div className={styles.metricCard}>
                    <div className={styles.metricIcon}>
                        <FaReddit />
                    </div>
                    <div className={styles.metricInfo}>
                        <h4>Reddit Sentiment</h4>
                        <div className={styles.score}>{mockData.redditSentiment.score}%</div>
                        <p>{mockData.redditSentiment.description}</p>
                    </div>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricIcon}>
                        <FaTwitter />
                    </div>
                    <div className={styles.metricInfo}>
                        <h4>Twitter Engagement</h4>
                        <div className={styles.score}>{mockData.twitterEngagement.score}%</div>
                        <p>{mockData.twitterEngagement.description}</p>
                    </div>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricIcon}>
                        <FaChartLine />
                    </div>
                    <div className={styles.metricInfo}>
                        <h4>Market Perception</h4>
                        <div className={styles.score}>{mockData.marketPerception.score}/10</div>
                        <p>{mockData.marketPerception.description}</p>
                    </div>
                </div>
            </div>
        </OverviewCard>
    );
}
