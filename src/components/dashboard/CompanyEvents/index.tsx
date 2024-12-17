import React from 'react';
import styles from './styles.module.css';
import { CompanyCalendarEvents } from '@/types/company';
import { FaCalendarAlt, FaDollarSign, FaChartLine } from 'react-icons/fa';
import OverviewCard from '@/components/dashboard/DashboardCard/OverviewCard';

interface CompanyEventsProps {
    isLoading?: boolean;
    events?: CompanyCalendarEvents;
}

export default function CompanyEvents({ isLoading, events }: CompanyEventsProps) {
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
        <OverviewCard title="Upcoming Events" isLoading={isLoading}>
            <div className={styles.eventsFlex}>
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
                <div className={styles.eventCard}>
                    <div className={styles.eventIcon}>
                        <FaChartLine />
                    </div>
                    <div className={styles.eventInfo}>
                        <h4>Next Earnings</h4>
                        <p>{isLoading ? 'Loading...' : formatDate(events?.earnings?.earningsDate)}</p>
                    </div>
                </div>
            </div>
        </OverviewCard>
    );
} 