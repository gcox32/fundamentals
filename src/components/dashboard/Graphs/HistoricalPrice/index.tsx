import React, { useMemo, useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
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
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

  const toggleSeries = (dataKey: string) => {
    setHiddenSeries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dataKey)) {
        newSet.delete(dataKey);
      } else {
        newSet.add(dataKey);
      }
      return newSet;
    });
  };

  const chartData = useMemo(() => {
    if (!data?.historical) return [];
    const allData = [...data.historical].reverse();
    const filteredData = filterDataByTimeframe(allData, timeframe);

    // Calculate moving averages
    return filteredData.map((item, index, array) => {
      const ma50 = index >= 49 
        ? array.slice(index - 49, index + 1).reduce((sum, curr) => sum + curr.close, 0) / 50 
        : null;
      
      const ma200 = index >= 199 
        ? array.slice(index - 199, index + 1).reduce((sum, curr) => sum + curr.close, 0) / 200 
        : null;

      return {
        ...item,
        ma50,
        ma200
      };
    });
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
          {isExpanded && (
            <Legend 
              onClick={(e) => {
                if (typeof e.dataKey === 'string') {
                  toggleSeries(e.dataKey);
                }
              }}
              wrapperStyle={{ cursor: 'pointer' }}
            />
          )}
          <Line
            type="monotone"
            dataKey="close"
            stroke="#8884d8"
            dot={false}
            activeDot={{ r: 8 }}
            name="Price"
            hide={hiddenSeries.has('close')}
          />
          {isExpanded && (
            <>
              <Line
                type="monotone"
                dataKey="ma50"
                stroke="#2196F3"
                dot={false}
                name="50 Day MA"
                hide={hiddenSeries.has('ma50')}
              />
              <Line
                type="monotone"
                dataKey="ma200"
                stroke="#4CAF50"
                dot={false}
                name="200 Day MA"
                hide={hiddenSeries.has('ma200')}
              />
            </>
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 