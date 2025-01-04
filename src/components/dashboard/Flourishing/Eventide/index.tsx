import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import FlourishingCard from '../../DashboardCard/FlourishingCard';
import styles from '../styles.module.css';
import { FaStar, FaHandshake, FaLeaf } from 'react-icons/fa';
interface EventideOverviewProps {
    isLoading?: boolean;
    onHide?: () => void;
}

export default function EventideOverview({ isLoading, onHide }: EventideOverviewProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: 'eventide-overview' });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

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

    const standardContent = (
        <div className={styles.flourishingCardContainer}>
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
    );

    const expandedContent = (
        <div className={styles.expandedEventideContainer}>
            {standardContent}
            <div className={styles.additionalContent}>
                <h3>Detailed Analysis</h3>
                <div className={styles.detailedMetrics}>
                    <div className={styles.metricSection}>
                        <h4>Business Alignment Details</h4>
                        <ul>
                            <li>Product Impact Score: 9.0/10</li>
                            <li>Customer Value: 8.8/10</li>
                            <li>Market Leadership: 7.9/10</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div ref={setNodeRef} style={style}>
            <FlourishingCard
                id="eventide-overview"
                title="Eventide Analysis"
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
