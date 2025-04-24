import React, { useState } from 'react';
import styles from './styles.module.css';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';

interface ValuationAnalysisSectionProps {
  currentPrice: number;
  isLoading: boolean;
}

type SensitivityFactor = 'Revenue Growth' | 'Net Margin' | 'Discount Rate';

interface ChartData {
  percentage: string;
  value: number;
}

export default function ValuationAnalysisSection({
  currentPrice,
  isLoading
}: ValuationAnalysisSectionProps) {
  const [selectedFactor, setSelectedFactor] = useState<SensitivityFactor>('Revenue Growth');

  // Sample data for the sensitivity analysis
  const sensitivityData = Array.from({ length: 41 }, (_, i) => {
    const percentage = -20 + i;
    const baseValue = 151.16; // Current price
    const multiplier = 1 + (percentage / 100);
    const value = baseValue * multiplier;
    
    return {
      percentage: `${percentage}%`,
      value: value,
      fill: value > currentPrice ? '#00bfa5' : '#ff5252'
    };
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>VALUATION ANALYSIS</h2>

      <div className={styles.analysisCard}>
        <div className={styles.header}>
          <div>
            <h3>Sensitivity Analysis</h3>
            <p>DCF Value Sensitivity Analysis</p>
          </div>
          <div className={styles.googleLogo}>G</div>
        </div>

        <div className={styles.description}>
          Sensitivity Analysis assesses how changes in key factors like revenue growth, margin, and discount rate affect a stock's DCF value. By visualizing various scenarios, from significant downturns to optimistic growth, this tool helps you understand potential valuation shifts, aiding in risk assessment and strategic decision-making.
        </div>

        <div className={styles.factorTabs}>
          {['Revenue Growth', 'Net Margin', 'Discount Rate'].map((factor) => (
            <button
              key={factor}
              className={`${styles.factorTab} ${selectedFactor === factor ? styles.active : ''}`}
              onClick={() => setSelectedFactor(factor as SensitivityFactor)}
            >
              {factor}
            </button>
          ))}
        </div>

        <div className={styles.chartContainer}>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={sensitivityData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="percentage"
                tickFormatter={(value) => value}
                interval={4}
              />
              <YAxis
                domain={['auto', 'auto']}
                tickFormatter={(value) => `${value} USD`}
              />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(2)} USD`, 'DCF Value']}
                labelFormatter={(label) => `Change: ${label}`}
              />
              <ReferenceLine
                y={currentPrice}
                label={{ value: `Last Price: ${currentPrice} USD`, position: 'insideTopLeft' }}
                stroke="#666"
                strokeDasharray="3 3"
              />
              <Bar
                dataKey="value"
                fill="#666666"
                fillOpacity={0.8}
                stroke="none"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 