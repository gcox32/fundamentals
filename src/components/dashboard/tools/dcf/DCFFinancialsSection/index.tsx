import React from 'react';
import styles from './styles.module.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface DCFFinancialsSectionProps {
  isLoading: boolean;
}

interface FinancialMetric {
  label: string;
  current: number;
  projected: number;
  suffix: string;
}

export default function DCFFinancialsSection({ isLoading }: DCFFinancialsSectionProps) {
  const metrics: FinancialMetric[] = [
    { label: 'Revenue', current: 399.3, projected: 602, suffix: 'B' },
    { label: 'Net Income', current: 110.2, projected: 168.9, suffix: 'B' },
    { label: 'FCFE', current: 105.3, projected: 165.5, suffix: 'B' },
  ];

  // Sample data for the line chart
  const chartData = [
    { year: '2020', revenue: 399.3, netIncome: 110.2, fcfe: 105.3 },
    { year: '2021', revenue: 420, netIncome: 115, fcfe: 108 },
    { year: '2022', revenue: 450, netIncome: 120, fcfe: 112 },
    { year: '2023', revenue: 480, netIncome: 130, fcfe: 120 },
    { year: '2024', revenue: 510, netIncome: 140, fcfe: 130 },
    { year: '2025', revenue: 540, netIncome: 150, fcfe: 140 },
    { year: '2026', revenue: 560, netIncome: 155, fcfe: 145 },
    { year: '2027', revenue: 575, netIncome: 160, fcfe: 150 },
    { year: '2028', revenue: 585, netIncome: 165, fcfe: 158 },
    { year: '2029', revenue: 595, netIncome: 167, fcfe: 162 },
    { year: 'Terminal', revenue: 602, netIncome: 168.9, fcfe: 165.5 },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3>DCF Financials</h3>
          <p>Financials used in DCF Calculation</p>
        </div>
        <div className={styles.googleLogo}>G</div>
      </div>

      <div className={styles.metrics}>
        {metrics.map((metric) => (
          <div key={metric.label} className={styles.metricCard}>
            <div className={styles.metricIcon}>✓</div>
            <div className={styles.metricLabel}>{metric.label}</div>
            <div className={styles.metricValues}>
              <span>{metric.current}{metric.suffix}</span>
              <span className={styles.arrow}>→</span>
              <span>{metric.projected}{metric.suffix}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.chartHeader}>
          <div>Historical Financials</div>
          <div>Forecasted Financials</div>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="year"
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(value) => `${value}B`}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number) => [`${value}B`, '']}
              labelStyle={{ color: '#666' }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#2196f3"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="netIncome"
              stroke="#4caf50"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="fcfe"
              stroke="#ff9800"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 