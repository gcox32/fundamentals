import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';

interface FloatingDCFValueProps {
  value: number;
  caseScenario: 'worst' | 'base' | 'best';
  setCaseScenario: (scenario: 'worst' | 'base' | 'best') => void;
  isVisible: boolean;
  assessment: 'OVERVALUATION' | 'UNDERVALUATION';
  percentage: number;
  operatingModel?: 'FCFE' | 'EPS';
}

export default function FloatingDCFValue({
  value,
  caseScenario,
  setCaseScenario,
  isVisible,
  assessment,
  percentage,
  operatingModel = 'FCFE'
}: FloatingDCFValueProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`${styles.container} ${isVisible ? styles.visible : ''}`}
    >
      <div className={styles.content}>
        <div className={styles.header}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <span className={styles.chevron}>{isExpanded ? '▲' : '▼'}</span>
            <div className={styles.dcfValue}>
              DCF Value: <span className={styles.value} style={{ color: assessment === 'OVERVALUATION' ? 'red' : 'green' }}>{`$${value.toFixed(2)}`}</span>
            </div>
        </div>

        <div className={`${styles.details} ${isExpanded ? styles.expanded : ''}`}>
          <div className={`${styles.assessment} ${assessment === 'OVERVALUATION' ? styles.overvalued : styles.undervalued}`}>
            {assessment} {Math.abs(percentage).toFixed(2)}%
          </div>
          <div className={styles.meta}>
            Model: <strong>{operatingModel}</strong>
          </div>
          <div className={styles.scenarios}>
            <button
              className={`${styles.scenarioButton} ${styles.worstCase} ${caseScenario === 'worst' ? styles.active : ''}`}
              onClick={() => setCaseScenario('worst')}
            >
              Worst Case
            </button>
            <button
              className={`${styles.scenarioButton} ${styles.baseCase} ${caseScenario === 'base' ? styles.active : ''}`}
              onClick={() => setCaseScenario('base')}
            >
              Base Case
            </button>
            <button
              className={`${styles.scenarioButton} ${styles.bestCase} ${caseScenario === 'best' ? styles.active : ''}`}
              onClick={() => setCaseScenario('best')}
            >
              Best Case
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 