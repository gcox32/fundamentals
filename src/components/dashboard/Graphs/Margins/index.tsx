import React, { useMemo } from 'react';
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
import type { HistoricalIncomeStatement } from '@/types/financials';
import graphStyles from '@/components/dashboard/DashboardCard/GraphicalCard/styles.module.css';
import { formatPercent } from '@/utils/format';
import { useChartContext } from '@/components/dashboard/DashboardCard/GraphicalCard/ChartContext';
import { filterDataByTimeframe } from '@/utils/timeframeFilter';

interface MarginsProps {
  data?: HistoricalIncomeStatement;
  isLoading: boolean;
}

export default function Margins({ data, isLoading }: MarginsProps) {
  const { isExpanded, timeframe } = useChartContext();

  const chartData = useMemo(() => {
    if (!data?.data) return [];

    const allData = data.data.map(statement => {
      const revenue = statement.revenue || 0;
      const grossProfit = (revenue - (statement.costOfRevenue || 0));
      const operatingIncome = statement.operatingIncome || 0;
      const netIncome = statement.netIncome || 0;

      // Calculate margins as percentages
      const grossMargin = revenue ? (grossProfit / revenue) * 100 : 0;
      const operatingMargin = revenue ? (operatingIncome / revenue) * 100 : 0;
      const netMargin = revenue ? (netIncome / revenue) * 100 : 0;

      return {
        date: statement.date,
        grossMargin,
        operatingMargin,
        netMargin,
        label: `${statement.period} ${statement.calendarYear}`
      };
    }).reverse(); // Most recent first

    return filterDataByTimeframe(allData, timeframe);
  }, [data, timeframe]);

  if (isLoading || !data) {
    return <div className={graphStyles.loading}>Loading margins data...</div>;
  }

  return (
    <div className={graphStyles.chartContainer}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
            tickFormatter={(value) => `${formatPercent(value)}`}
          />
          <Tooltip
            formatter={(value: number) => `${formatPercent(value)}`}
            labelFormatter={(label) => label}
          />
          {isExpanded && <Legend />}
          
          <Line
            type="monotone"
            dataKey="grossMargin"
            stroke="#4CAF50"
            name="Gross Margin"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="operatingMargin"
            stroke="#2196F3"
            name="Operating Margin"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="netMargin"
            stroke="#9C27B0"
            name="Net Margin"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 