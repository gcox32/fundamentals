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
import type { HistoricalIncomeStatement } from '@/types/financials';
import graphStyles from '@/components/dashboard/DashboardCard/GraphicalCard/styles.module.css';
import { formatLargeNumber } from '@/utils/format';
import { useChartContext } from '@/components/dashboard/DashboardCard/GraphicalCard/ChartContext';
import { filterDataByTimeframe } from '@/utils/timeframeFilter';

interface RevenueProps {
  data?: HistoricalIncomeStatement;
  isLoading: boolean;
}

export default function Revenue({ data, isLoading }: RevenueProps) {
  const { isExpanded, timeframe, isTTM } = useChartContext();

  const chartData = useMemo(() => {
    if (!data?.data) return [];

    const allData = data.data.map(statement => ({
      date: statement.date,
      revenue: statement.revenue,
      label: `${statement.period} ${statement.calendarYear}`
    })).reverse(); // Most recent first

    console.log('Timeframe:', timeframe);
    console.log('TTM mode:', isTTM); // For debugging

    const processedData = isTTM
      ? allData.map((item, index, array) => {
          if (index < 3) return item;
          const ttmRevenue = array
            .slice(index - 3, index + 1)
            .reduce((sum, curr) => sum + (curr.revenue || 0), 0);
          return {
            ...item,
            revenue: ttmRevenue
          };
        })
      : allData;

    return filterDataByTimeframe(processedData, timeframe);
  }, [data, timeframe, isTTM]);

  if (isLoading || !data) {
    return <div className={graphStyles.loading}>Loading revenue...</div>;
  }

  return (
    <div className={graphStyles.chartContainer}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            angle={isExpanded ? -45 : 0}
            textAnchor={isExpanded ? "end" : "middle"}
            height={isExpanded ? 60 : 30}
            hide={!isExpanded}
            dataKey="label"
            interval="preserveStartEnd"
          />
          <YAxis 
            hide={!isExpanded}
            tickFormatter={(value) => formatLargeNumber(value)}
          />
          <Tooltip
            formatter={(value: number) => [`$${formatLargeNumber(value)}`, 'Revenue']}
            labelFormatter={(label) => label}
          />
          <Bar
            dataKey="revenue"
            fill="#2196F3"
            name="Revenue"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 