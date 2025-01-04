import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaStar, FaThumbsUp, FaUserTie } from 'react-icons/fa';
import FlourishingCard from '../../DashboardCard/FlourishingCard';
import styles from './styles.module.css';

interface GlassdoorOverviewProps {
    isLoading: boolean;
    onHide?: (id: string) => void;
}

export default function GlassdoorOverview({ isLoading, onHide }: GlassdoorOverviewProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: 'glassdoor-overview' });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

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
        <div ref={setNodeRef} style={style}>
            <FlourishingCard
                id="glassdoor-overview"
                title="Glassdoor Insights"
                onHide={onHide}
                isDragging={isDragging}
                dragHandleListeners={{ ...attributes, ...listeners }}
            >
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
            </FlourishingCard>
        </div>
    );
}
