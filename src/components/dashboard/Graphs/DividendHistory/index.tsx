import React, { useMemo } from 'react';
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
import graphStyles from '@/components/dashboard/DashboardCard/GraphicalCard/styles.module.css';
import { formatPrice, getQuarterFromDate } from '@/utils/format';
import { useChartContext } from '@/components/dashboard/DashboardCard/GraphicalCard/ChartContext';
import { filterDataByTimeframe } from '@/utils/timeframeFilter';

interface DividendHistoryProps {
  data?: HistoricalDividendData;
  isLoading: boolean;
  noData?: boolean | undefined;
}

export default function DividendHistory({ data, isLoading }: DividendHistoryProps) {
  const { isExpanded, timeframe } = useChartContext();

  const chartData = useMemo(() => {
    if (!data?.historical?.length) return [];
    const allData = [...data.historical].map(item => ({
      ...item,
      label: getQuarterFromDate(item.date)
    })).reverse();
    return filterDataByTimeframe(allData, timeframe);
  }, [data, timeframe]);
  
  if (isLoading) {
    return <div className={graphStyles.loading}>Loading dividend history...</div>;
  }

  if (!data?.historical?.length) {
    return (
      <div className={graphStyles.noData}>
        No dividend history available. This company may not pay dividends.
      </div>
    );
  }

  return (
    <div className={graphStyles.chartContainer}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="label"
            interval="preserveStartEnd"
            angle={isExpanded ? -45 : 0}
            textAnchor={isExpanded ? "end" : "middle"}
            height={isExpanded ? 60 : 30}
            hide={!isExpanded}
          />
          <YAxis 
            hide={!isExpanded}
            tickFormatter={(value) => formatPrice(value)}
          />
          <Tooltip
            formatter={(value: number) => [`${formatPrice(value)}`, 'Dividend']}
            labelFormatter={(label) => label}
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