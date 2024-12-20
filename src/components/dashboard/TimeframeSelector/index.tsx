'use client';

import React from 'react';
import styles from './styles.module.css';
import toggleStyles from '@/components/common/Toggle/styles.module.css';
import { TimeframeSelectorProps } from './types';
import { timeframes } from './config';

export default function TimeframeSelector({
  selectedTimeframe,
  setSelectedTimeframe,
  isTTM,
  setIsTTM
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
      <div className={toggleStyles.toggleWrapper}>
        <button
          onClick={() => setIsTTM(false)}
          className={`${toggleStyles.toggleButton} ${!isTTM ? toggleStyles.active : toggleStyles.inactive}`}
        >
          Quarterly
        </button>
        <button
          onClick={() => setIsTTM(true)}
          className={`${toggleStyles.toggleButton} ${isTTM ? toggleStyles.active : toggleStyles.inactive}`}
        >
          TTM
        </button>
        <div className={`${toggleStyles.slider} ${isTTM ? toggleStyles.sliderRight : toggleStyles.sliderLeft}`} />
      </div>
    </div>
  );
} 