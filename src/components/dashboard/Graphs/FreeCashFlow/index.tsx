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
import type { HistoricalCashFlowStatement } from '@/types/financials';
import graphStyles from '@/components/dashboard/DashboardCard/GraphicalCard/styles.module.css';
import { formatLargeNumber } from '@/utils/format';
import { useChartContext } from '@/components/dashboard/DashboardCard/GraphicalCard/ChartContext';
import { filterDataByTimeframe } from '@/utils/timeframeFilter';

interface FreeCashFlowProps {
  data?: HistoricalCashFlowStatement;
  isLoading: boolean;
}

export default function FreeCashFlow({ data, isLoading }: FreeCashFlowProps) {
  const { isExpanded, timeframe } = useChartContext();

  const chartData = useMemo(() => {
    if (!data?.data) return [];

    const allData = data.data.map(statement => ({
      date: statement.date,
      freeCashFlow: statement.freeCashFlow,
      stockCompensation: statement.stockBasedCompensation,
      label: `${statement.period} ${statement.calendarYear}`
    })).reverse(); // Most recent first

    return filterDataByTimeframe(allData, timeframe);
  }, [data, timeframe]);

  if (isLoading || !data) {
    return <div className={graphStyles.loading}>Loading free cash flow...</div>;
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
            formatter={(value: number, name: string) => [`$${formatLargeNumber(value)}`, name]}
            labelFormatter={(label) => label}
          />
          {isExpanded && <Legend />}
          <Bar
            dataKey="freeCashFlow"
            fill="#4CAF50"
            name="Free Cash Flow"
          />
          <Bar
            dataKey="stockCompensation"
            fill="#FF9800"
            name="Stock Compensation"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 