import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import type { HistoricalSharesOutstanding } from '@/types/stock';
import graphStyles from '../DashboardCard/GraphicalCard/styles.module.css';
import { formatLargeNumber } from '@/utils/format';

interface HistoricalSharesProps {
  data?: HistoricalSharesOutstanding;
  isLoading: boolean;
}

export default function HistoricalShares({ data, isLoading }: HistoricalSharesProps) {
  if (isLoading || !data) {
    return <div className={graphStyles.loading}>Loading shares outstanding history...</div>;
  }

  // Convert object with numeric keys to array, filtering out non-numeric keys
  const chartData = Object.entries(data)
    .filter(([key]) => !isNaN(Number(key)))
    .map(([_, value]) => ({
      ...value,
      outstandingShares: Number(value.outstandingShares)
    }))
    .reverse();

  return (
    <div className={graphStyles.chartContainer}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
            interval="preserveStartEnd"
          />
          <YAxis 
            hide
            domain={['auto', 'auto']}
            tickFormatter={(value) => formatLargeNumber(value)}
          />
          <Tooltip
            formatter={(value: number) => [formatLargeNumber(value), 'Shares']}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Bar
            dataKey="outstandingShares"
            fill="#8884d8"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 