import React from 'react';
import { assetTypes } from '../StockSearchBar/config';
import styles from './styles.module.css';

interface AssetTypeSelectorProps {
  selectedAssetType: string;
  onAssetTypeChange: (assetType: string) => void;
}

export default function AssetTypeSelector({ 
  selectedAssetType, 
  onAssetTypeChange 
}: AssetTypeSelectorProps) {
  return (
    <div className={styles.container}>
      <div className={styles.buttonGroup}>
        {assetTypes.map((type) => (
          <button
            key={type.code}
            className={`${styles.button} ${selectedAssetType === type.code ? styles.active : ''}`}
            onClick={() => onAssetTypeChange(type.code)}
          >
            {type.name}
          </button>
        ))}
      </div>
    </div>
  );
} 