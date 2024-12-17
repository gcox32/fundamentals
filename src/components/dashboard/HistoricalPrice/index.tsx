import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { HistoricalPriceData } from '@/types/stock';
import { formatPrice } from '@/utils/format';
import graphStyles from '../DashboardCard/GraphicalCard/styles.module.css';

interface HistoricalPriceProps {
  data?: HistoricalPriceData;
  isLoading: boolean;
}

export default function HistoricalPrice({ data, isLoading }: HistoricalPriceProps) {
  if (isLoading || !data?.historical) {
    return <div className={graphStyles.loading}>Loading price history...</div>;
  }

  const chartData = [...data.historical].reverse();

  return (
    <div className={graphStyles.chartContainer}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 

            dataKey="date" 
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
            interval="preserveStartEnd"
          />
          <YAxis 
            hide
            domain={['auto', 'auto']}
            tickFormatter={(value) => formatPrice(value)}
          />
          <Tooltip
            formatter={(value: number) => [formatPrice(value), 'Price']}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#8884d8"
            dot={false}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 