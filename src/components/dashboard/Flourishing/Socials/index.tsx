import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaReddit, FaTwitter, FaChartLine } from 'react-icons/fa';
import FlourishingCard from '../../DashboardCard/FlourishingCard';
import styles from '../styles.module.css';

interface SocialsOverviewProps {
    isLoading: boolean;
    onHide?: (id: string) => void;
}

export default function SocialsOverview({ isLoading, onHide }: SocialsOverviewProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: 'socials-overview' });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

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

    const standardContent = (
        <div className={styles.flourishingCardContainer}>
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
    );

    const expandedContent = (
        <div className={styles.expandedSocialsContainer}>
            {standardContent}
            <div className={styles.additionalContent}>
                <h3>Detailed Social Analysis</h3>
                <div className={styles.detailedMetrics}>
                    <div className={styles.metricSection}>
                        <h4>Reddit Analytics</h4>
                        <ul>
                            <li>Subreddit Mentions: 2,450/month</li>
                            <li>Positive Comments: 82%</li>
                            <li>Community Growth: +15% MoM</li>
                        </ul>
                    </div>
                    <div className={styles.metricSection}>
                        <h4>Twitter Metrics</h4>
                        <ul>
                            <li>Monthly Impressions: 1.2M</li>
                            <li>Engagement Rate: 3.8%</li>
                            <li>Brand Sentiment: 78% positive</li>
                        </ul>
                    </div>
                    <div className={styles.metricSection}>
                        <h4>Market Impact</h4>
                        <ul>
                            <li>Social Share of Voice: 8.9/10</li>
                            <li>Brand Authority Score: 8.2/10</li>
                            <li>Industry Influence: 8.6/10</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div ref={setNodeRef} style={style}>
            <FlourishingCard
                id="socials-overview"
                title="Social Media Insights"
                onHide={onHide}
                isDragging={isDragging}
                dragHandleListeners={{ ...attributes, ...listeners }}
                expandedContent={expandedContent}
            >
                {standardContent}
            </FlourishingCard>
        </div>
    );
}
