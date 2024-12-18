'use client';

import React from 'react';
import styles from './styles.module.css';
import { TimeframeSelectorProps } from './types';
import { timeframes } from './config';

export default function TimeframeSelector({
  selectedTimeframe,
  setSelectedTimeframe
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

    </div>
  );
} 