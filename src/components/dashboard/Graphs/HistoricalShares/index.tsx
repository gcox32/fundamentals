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
import type { HistoricalSharesOutstanding } from '@/types/stock';
import graphStyles from '@/components/dashboard/DashboardCard/GraphicalCard/styles.module.css';
import { formatLargeNumber, getQuarterFromDate } from '@/utils/format';
import { useChartContext } from '@/components/dashboard/DashboardCard/GraphicalCard/ChartContext';
import { filterDataByTimeframe } from '@/utils/timeframeFilter';

interface HistoricalSharesProps {
  data?: HistoricalSharesOutstanding;
  isLoading: boolean;
}

export default function HistoricalShares({ data, isLoading }: HistoricalSharesProps) {
  const { isExpanded, timeframe } = useChartContext();

  const chartData = useMemo(() => {
    if (!data?.historical) return [];

    const allData = [...data.historical]
      .map(value => ({
        ...value,
        outstandingShares: Number(value.outstandingShares),
        label: getQuarterFromDate(value.date)
      }))
      .reverse();

    return filterDataByTimeframe(allData, timeframe);
  }, [data, timeframe]);

  if (isLoading || !data) {
    return <div className={graphStyles.loading}>Loading shares outstanding history...</div>;
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
            domain={['auto', 'auto']}
            tickFormatter={(value) => formatLargeNumber(value)}
          />
          <Tooltip
            formatter={(value: number) => [formatLargeNumber(value), 'Shares']}
            labelFormatter={(label) => label}
          />
          <Bar
            dataKey="outstandingShares"
            fill="#8884d8"
            name="Shares Outstanding"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}