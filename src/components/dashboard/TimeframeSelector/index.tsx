'use client';

import React from 'react';
import styles from './styles.module.css';

interface TimeframeSelectorProps {
  selectedTimeframe: string;
  setSelectedTimeframe: (timeframe: string) => void;
  selectedSegment: string;
  setSelectedSegment: (segment: string) => void;
}

const timeframes = [
  { value: '1W', label: '1 Week' },
  { value: '1M', label: '1 Month' },
  { value: '3M', label: '3 Months' },
  { value: '6M', label: '6 Months' },
  { value: 'YTD', label: 'YTD' },
  { value: '1Y', label: '1 Year' },
  { value: '3Y', label: '3 Years' },
  { value: '5Y', label: '5 Years' },
  { value: 'ALL', label: 'All Time' }
];

const segments = [
  { value: 'daily', label: 'Daily' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' }
];

export default function TimeframeSelector({
  selectedTimeframe,
  setSelectedTimeframe,
  selectedSegment,
  setSelectedSegment
}: TimeframeSelectorProps) {
  return (
    <div className={styles.container}>
      <div className={styles.selectorGroup}>
        {timeframes.map((timeframe) => (
          <button
            key={timeframe.value}
            className={`${styles.selectorButton} ${
              selectedTimeframe === timeframe.value ? styles.selected : ''
            }`}
            onClick={() => setSelectedTimeframe(timeframe.value)}
          >
            {timeframe.value}
          </button>
        ))}
      </div>

      <div className={styles.divider} />

      <div className={styles.selectorGroup}>
        {segments.map((segment) => (
          <button
            key={segment.value}
            className={`${styles.selectorButton} ${
              selectedSegment === segment.value ? styles.selected : ''
            }`}
            onClick={() => setSelectedSegment(segment.value)}
          >
            {segment.label}
          </button>
        ))}
      </div>
    </div>
  );
} 