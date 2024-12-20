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
import type { HistoricalIncomeStatement, HistoricalBalanceSheetStatement } from '@/types/financials';
import graphStyles from '@/components/dashboard/DashboardCard/GraphicalCard/styles.module.css';
import { formatPercent } from '@/utils/format';
import { useChartContext } from '@/components/dashboard/DashboardCard/GraphicalCard/ChartContext';
import { filterDataByTimeframe } from '@/utils/timeframeFilter';

interface ROCEProps {
  incomeStatement?: HistoricalIncomeStatement;
  balanceSheetStatement?: HistoricalBalanceSheetStatement;
  isLoading: boolean;
}

export default function ROCE({ incomeStatement, balanceSheetStatement, isLoading }: ROCEProps) {
  const { isExpanded, timeframe } = useChartContext();

  const chartData = useMemo(() => {
    if (!incomeStatement?.data || !balanceSheetStatement?.data) return [];

    // Create a map of dates to balance sheet data for quick lookup
    const balanceSheetMap = balanceSheetStatement.data.reduce((acc, statement) => {
      acc[statement.date] = statement;
      return acc;
    }, {} as Record<string, typeof balanceSheetStatement.data[0]>);

    const allData = incomeStatement.data
      .filter(statement => balanceSheetMap[statement.date]) // Only include dates where we have both statements
      .map(statement => {
        const balanceSheetData = balanceSheetMap[statement.date];
        const capitalEmployed = balanceSheetData.totalAssets - balanceSheetData.totalCurrentLiabilities;
        const ebit = statement.operatingIncome;
        
        return {
          date: statement.date,
          roce: capitalEmployed > 0 ? (ebit / capitalEmployed) * 100 : 0, // Convert to percentage
          label: `${statement.period} ${statement.calendarYear}`
        };
      })
      .reverse(); // Most recent first

    return filterDataByTimeframe(allData, timeframe);
  }, [incomeStatement, balanceSheetStatement, timeframe]);

  if (isLoading || !incomeStatement || !balanceSheetStatement) {
    return <div className={graphStyles.loading}>Loading ROCE...</div>;
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
            tickFormatter={(value) => formatPercent(value / 100)} // Convert back to decimal for formatting
          />
          <Tooltip
            formatter={(value: number) => [formatPercent(value / 100), 'ROCE']}
            labelFormatter={(label) => label}
          />
          <Bar
            dataKey="roce"
            fill="#673AB7"
            name="ROCE"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 