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
import graphStyles from '@/components/dashboard/research/valuation/DashboardCard/GraphicalCard/styles.module.css';
import { formatLargeNumber } from '@/src/lib/utilities/format';
import { useChartContext } from '@/components/dashboard/research/valuation/DashboardCard/GraphicalCard/ChartContext';
import { filterDataByTimeframe } from '@/src/lib/utilities/timeframeFilter';
import { useTheme } from '@/src/contexts/ThemeContext';

interface NetIncomeProps {
  data?: HistoricalIncomeStatement;
  isLoading: boolean;
}

export default function NetIncome({ data, isLoading }: NetIncomeProps) {
  const { isExpanded, timeframe, isTTM } = useChartContext();
  const { isDarkMode } = useTheme();
  const chartData = useMemo(() => {
    if (!data?.data) return [];

    const allData = data.data.map(statement => ({
      date: statement.date,
      netIncome: statement.netIncome,
      label: `${statement.period} ${statement.calendarYear}`
    })).reverse(); // Most recent first

    const processedData = isTTM
      ? allData.map((item, index, array) => {
          if (index < 3) return item;
          const ttmNetIncome = array
            .slice(index - 3, index + 1)
            .reduce((sum, curr) => sum + (curr.netIncome || 0), 0);
          return {
            ...item,
            netIncome: ttmNetIncome
          };
        })
      : allData;

    return filterDataByTimeframe(processedData, timeframe);
  }, [data, timeframe, isTTM]);

  if (isLoading || !data) {
    return <div className={graphStyles.loading}>Loading net income data...</div>;
  }

  return (
    <div className={graphStyles.chartContainer}>
      <ResponsiveContainer width="100%" height={isExpanded ? 550 : 300}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid horizontal={true} vertical={false} stroke={isDarkMode ? "#404040" : "#f0f0f0"} />
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