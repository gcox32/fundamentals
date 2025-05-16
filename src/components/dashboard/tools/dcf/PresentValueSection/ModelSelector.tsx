import React from 'react';
import styles from './styles.module.css';
import type { OperatingModel } from './types';

interface ModelSelectorProps {
  operatingModel: OperatingModel;
  onOperatingModelChange: (model: OperatingModel) => void;
}

export default function ModelSelector({
  operatingModel,
  onOperatingModelChange
}: ModelSelectorProps) {
  return (
    <div className={styles.modelSelector}>
      <div className={styles.modelTrack}>
        <div 
          className={styles.modelSlider} 
          data-position={operatingModel === 'FCFE' ? 'left' : 'right'}
        />
        <button
          className={`${styles.modelOption} ${operatingModel === 'FCFE' ? styles.active : ''}`}
          onClick={() => onOperatingModelChange('FCFE')}
        >
          FCFE Model
        </button>
        <button
          className={`${styles.modelOption} ${operatingModel === 'EPS' ? styles.active : ''}`}
          onClick={() => onOperatingModelChange('EPS')}
        >
          EPS Model
        </button>
      </div>
    </div>
  );
}