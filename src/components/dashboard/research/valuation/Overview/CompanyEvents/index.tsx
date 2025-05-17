import React from 'react';
import styles from './styles.module.css';
import { CompanyCalendarEvents } from '@/types/company';
import { FaCalendarAlt, FaDollarSign, FaChartLine } from 'react-icons/fa';
import OverviewCard from '@/components/dashboard/research/valuation/DashboardCard/OverviewCard';
import { formatDate } from '@/src/lib/format';
interface CompanyEventsProps {
    isLoading?: boolean;
    events?: CompanyCalendarEvents;
}

export default function CompanyEvents({ isLoading, events }: CompanyEventsProps) {

    return (
        <OverviewCard title="Upcoming Events" isLoading={isLoading}>
            <div className={styles.eventsFlex}>
                <div className={styles.eventCard}>
                    <div className={styles.eventIcon}>
                        <FaCalendarAlt />
                    </div>
                    <div className={styles.eventInfo}>
                        <h4>Ex-Dividend Date</h4>
                        <p>{isLoading ? 'Loading...' : formatDate(events?.nextExDividendDate)}</p>
                    </div>
                </div>
                <div className={styles.eventCard}>
                    <div className={styles.eventIcon}>
                        <FaDollarSign />
                    </div>
                    <div className={styles.eventInfo}>
                        <h4>Next Dividend</h4>
                        <p>{isLoading ? 'Loading...' : formatDate(events?.nextDividendDate)}</p>
                    </div>
                </div>
                <div className={styles.eventCard}>
                    <div className={styles.eventIcon}>
                        <FaChartLine />
                    </div>
                    <div className={styles.eventInfo}>
                        <h4>Next Earnings</h4>
                        <p>{isLoading ? 'Loading...' : formatDate(events?.nextEarningsDate)}</p>
                    </div>
                </div>
            </div>
        </OverviewCard>
    );
} 