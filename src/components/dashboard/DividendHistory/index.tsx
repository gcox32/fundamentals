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
import type { HistoricalDividendData } from '@/types/stock';
import graphStyles from '../DashboardCard/GraphicalCard/styles.module.css';
import { formatPrice } from '@/utils/format';

interface DividendHistoryProps {
  data?: HistoricalDividendData;
  isLoading: boolean;
}

export default function DividendHistory({ data, isLoading }: DividendHistoryProps) {
  if (isLoading || !data) {
    return <div className={graphStyles.loading}>Loading dividend history...</div>;
  }

  const chartData = [...data.historical].reverse();

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
            hide={true}
            tickFormatter={(value) => formatPrice(value)}
          />
          <Tooltip
            formatter={(value: number) => [`${formatPrice(value)}`, 'Dividend']}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Bar
            dataKey="adjDividend"
            fill="#4CAF50"
            name="Dividend"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 