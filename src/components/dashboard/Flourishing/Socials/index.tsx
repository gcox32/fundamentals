import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaReddit, FaTwitter, FaChartLine } from 'react-icons/fa';
import FlourishingCard from '../../DashboardCard/FlourishingCard';
import styles from './styles.module.css';

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

    return (
        <div ref={setNodeRef} style={style}>
            <FlourishingCard
                id="socials-overview"
                title="Social Media Insights"
                onHide={onHide}
                isDragging={isDragging}
                dragHandleListeners={{ ...attributes, ...listeners }}
            >
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
            </FlourishingCard>
        </div>
    );
}
