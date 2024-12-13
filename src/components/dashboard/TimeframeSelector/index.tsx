'use client';

import React from 'react';
import styles from './styles.module.css';
import { TimeframeSelectorProps } from './types';
import { timeframes, segments } from './config';

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