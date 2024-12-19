import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import type { HistoricalIncomeStatement } from '@/types/financials';
import graphStyles from '@/components/dashboard/DashboardCard/GraphicalCard/styles.module.css';
import { formatLargeNumber } from '@/utils/format';
import { useChartContext } from '@/components/dashboard/DashboardCard/GraphicalCard/ChartContext';
import { filterDataByTimeframe } from '@/utils/timeframeFilter';

interface NetIncomeProps {
  data?: HistoricalIncomeStatement;
  isLoading: boolean;
}

export default function NetIncome({ data, isLoading }: NetIncomeProps) {
  const { isExpanded, timeframe } = useChartContext();

  const chartData = useMemo(() => {
    if (!data?.data) return [];

    const allData = data.data.map(statement => ({
      date: statement.date,
      netIncome: statement.netIncome,
      netIncomeRatio: statement.netIncomeRatio,
      label: `${statement.period} ${statement.calendarYear}`
    })).reverse(); // Most recent first

    return filterDataByTimeframe(allData, timeframe);
  }, [data, timeframe]);

  if (isLoading || !data) {
    return <div className={graphStyles.loading}>Loading net income data...</div>;
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
            formatter={(value: number, name: string) => [
              name === 'Net Income' ? `$${formatLargeNumber(value)}` : `${(value * 100).toFixed(2)}%`,
              name
            ]}
            labelFormatter={(label) => label}
          />
          {isExpanded && <Legend />}
          <Bar
            dataKey="netIncome"
            fill="#2196F3"
            name="Net Income"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 