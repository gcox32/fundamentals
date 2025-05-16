import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaUsers, FaDollarSign, FaBalanceScale } from 'react-icons/fa';
import FlourishingCard from '../../DashboardCard/FlourishingCard';
import styles from '../styles.module.css';

interface ComparablyOverviewProps {
    isLoading: boolean;
    onHide?: (id: string) => void;
}

export default function ComparablyOverview({ isLoading, onHide }: ComparablyOverviewProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: 'comparably-overview' });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

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

    const standardContent = (
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
    );

    const expandedContent = (
        <div className={styles.flourishingCardContainer}>
            {standardContent}
            <div className={styles.additionalContent}>
                <h3>Detailed Analysis</h3>
                <div className={styles.detailedMetrics}>
                    <div className={styles.metricSection}>
                        <h4>Diversity & Inclusion Details</h4>
                        <ul>
                            <li>Gender Pay Equity: 9.1/10</li>
                            <li>Leadership Diversity: 8.5/10</li>
                            <li>Inclusive Culture: 8.8/10</li>
                        </ul>
                    </div>
                    <div className={styles.metricSection}>
                        <h4>Compensation Analysis</h4>
                        <ul>
                            <li>Market Competitiveness: 8.2/10</li>
                            <li>Benefits Package: 8.5/10</li>
                            <li>Performance Bonuses: 7.8/10</li>
                        </ul>
                    </div>
                    <div className={styles.metricSection}>
                        <h4>Work-Life Balance Details</h4>
                        <ul>
                            <li>Flexible Hours: 8.4/10</li>
                            <li>Remote Work Options: 8.7/10</li>
                            <li>Time Off Policies: 8.1/10</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div ref={setNodeRef} style={style}>
            <FlourishingCard
                id="comparably-overview"
                title="Comparably Ratings"
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
