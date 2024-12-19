import React, { useMemo } from 'react';
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
import graphStyles from '@/components/dashboard/DashboardCard/GraphicalCard/styles.module.css';
import { useChartContext } from '@/components/dashboard/DashboardCard/GraphicalCard/ChartContext';
import { filterDataByTimeframe } from '@/utils/timeframeFilter';

interface HistoricalPriceProps {
  data?: HistoricalPriceData;
  isLoading: boolean;
}

export default function HistoricalPrice({ data, isLoading }: HistoricalPriceProps) {
  const { isExpanded, timeframe } = useChartContext();

  const chartData = useMemo(() => {
    if (!data?.historical) return [];
    const allData = [...data.historical].reverse();
    return filterDataByTimeframe(allData, timeframe);
  }, [data, timeframe]);

  if (isLoading || !data?.historical) {
    return <div className={graphStyles.loading}>Loading price history...</div>;
  }

  return (
    <div className={graphStyles.chartContainer}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
            interval="preserveStartEnd"
            angle={isExpanded ? -45 : 0}
            textAnchor={isExpanded ? "end" : "middle"}
            height={isExpanded ? 60 : 30}
            hide={!isExpanded}
          />
          <YAxis 
            hide={!isExpanded}
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