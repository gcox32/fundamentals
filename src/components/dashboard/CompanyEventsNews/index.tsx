import React from 'react';
import styles from './styles.module.css';
import loadingStyles from '@/styles/loading.module.css';
import { CompanyCalendarEvents, CompanyNews } from '@/types/company';
import { FaCalendarAlt, FaDollarSign, FaChartLine, FaNewspaper } from 'react-icons/fa';

interface CompanyEventsNewsProps {
    isLoading?: boolean;
    events?: CompanyCalendarEvents;
    news?: CompanyNews;
}

export default function CompanyEventsNews({ isLoading, events }: CompanyEventsNewsProps) {
    const formatDate = (event?: { raw: number; fmt: string } | Array<{ raw: number; fmt: string }>) => {
        if (!event) return 'Not Available';
        if (Array.isArray(event)) {
            return event[0] ? new Date(event[0].raw * 1000).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            }) : 'Not Available';
        }
        return new Date(event.raw * 1000).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.eventsSection}>
                <h3 className={styles.sectionTitle}>Upcoming Events</h3>
                <div className={styles.eventsFlex}>
                    <div className={styles.eventCard}>
                        <div className={styles.eventIcon}>
                            <FaChartLine />
                        </div>
                        <div className={styles.eventInfo}>
                            <h4>Next Earnings</h4>
                            <p>{isLoading ? 'Loading...' : formatDate(events?.earnings?.earningsDate)}</p>
                        </div>
                    </div>

                    <div className={styles.eventCard}>
                        <div className={styles.eventIcon}>
                            <FaCalendarAlt />
                        </div>
                        <div className={styles.eventInfo}>
                            <h4>Ex-Dividend Date</h4>
                            <p>{isLoading ? 'Loading...' : formatDate(events?.exDividendDate)}</p>
                        </div>
                    </div>

                    <div className={styles.eventCard}>
                        <div className={styles.eventIcon}>
                            <FaDollarSign />
                        </div>
                        <div className={styles.eventInfo}>
                            <h4>Next Dividend</h4>
                            <p>{isLoading ? 'Loading...' : formatDate(events?.dividendDate)}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.newsSection}>
                <h3 className={styles.sectionTitle}>Latest News</h3>
                <div className={styles.comingSoon}>
                    News feed coming soon
                </div>
            </div>
        </div>
    );
}
