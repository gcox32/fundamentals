import React from 'react';
import styles from './styles.module.css';

interface DCFCalculationSectionProps {
  presentValue: number;
  equityValue: number;
  sharesOutstanding: number;
  dcfValue: number;
  undervaluedPercent: number;
  symbol: string;
}

export default function DCFCalculationSection({
  presentValue,
  equityValue,
  sharesOutstanding,
  dcfValue,
  undervaluedPercent,
  symbol
}: DCFCalculationSectionProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>DCF VALUE CALCULATION</h2>
      
      <div className={styles.description}>
        This stage translates the present value into DCF value per share. For firm valuation models, it adjusts present value for debt and assets to derive equity value (skipped if using equity valuation model). Finally, this equity value is divided by the number of shares to determine the DCF value per share.
      </div>

      <div className={styles.calculationCard}>
        <div className={styles.header}>
          <div className={styles.headerIcon}>📊</div>
          <div className={styles.headerText}>
            <h3>Present Value to DCF Value</h3>
            <p>Capital Structure</p>
          </div>
          <div className={styles.googleLogo}>G</div>
        </div>

        <div className={styles.calculationGrid}>
          <div className={styles.row}>
            <span className={styles.label}>Present Value</span>
            <span className={styles.value}>{presentValue}T USD</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>Equity Value</span>
            <span className={styles.value}>{equityValue}T USD</span>
          </div>
          <div className={styles.row}>
            <span className={styles.label}>÷ Shares Outstanding</span>
            <span className={styles.value}>{sharesOutstanding.toFixed(2)}B</span>
          </div>
          <div className={`${styles.row} ${styles.result}`}>
            <span className={styles.label}>{symbol} DCF Value</span>
            <span className={styles.value}>{dcfValue.toFixed(2)} USD</span>
          </div>
        </div>

        <div className={`${styles.valuationStatus} ${undervaluedPercent > 0 ? styles.undervalued : styles.overvalued}`}>
          {undervaluedPercent > 0 ? 'UNDERVALUED' : 'OVERVALUED'} BY {Math.abs(undervaluedPercent)}%
        </div>

        <div className={styles.explanation}>
          <p>You are using the equity valuation model. In this approach, further calculations for converting firm value to equity value are not required. The present value, obtained in the present value calculation block, already represents the equity value.</p>
          <p>The DCF value per share is derived by dividing the present value by the number of shares:</p>
          <div className={styles.formula}>
            Present Value: {presentValue}T USD / Number of Shares: {sharesOutstanding.toFixed(2)}B = DCF Value: {dcfValue.toFixed(2)} USD
          </div>
        </div>
      </div>
    </div>
  );
} 