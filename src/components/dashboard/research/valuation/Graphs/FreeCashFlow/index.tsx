import React, { useMemo, useState } from 'react';
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
import graphStyles from '@/components/dashboard/research/valuation/DashboardCard/GraphicalCard/styles.module.css';
import { formatLargeNumber } from '@/src/lib/utilities/format';
import { useChartContext } from '@/components/dashboard/research/valuation/DashboardCard/GraphicalCard/ChartContext';
import { filterDataByTimeframe } from '@/src/lib/utilities/timeframeFilter';
import { useTheme } from '@/src/contexts/ThemeContext';

interface FreeCashFlowProps {
  data?: HistoricalCashFlowStatement;
  isLoading: boolean;
}

export default function FreeCashFlow({ data, isLoading }: FreeCashFlowProps) {
  const { isExpanded, timeframe, isTTM } = useChartContext();
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());
  const { isDarkMode } = useTheme();
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
    if (!data?.data) return [];

    const allData = data.data.map(statement => ({
      date: statement.date,
      operatingCashFlow: statement.operatingCashFlow,
      capitalExpenditure: statement.capitalExpenditure,
      stockCompensation: statement.stockBasedCompensation,
      freeCashFlow: statement.operatingCashFlow - Math.abs(statement.capitalExpenditure),
      label: `${statement.period} ${statement.calendarYear}`
    })).reverse(); // Most recent first

    const processedData = isTTM
      ? allData.map((item, index, array) => {
          if (index < 3) return item;
          const ttmData = array.slice(index - 3, index + 1).reduce((acc, curr) => ({
            operatingCashFlow: (acc.operatingCashFlow || 0) + (curr.operatingCashFlow || 0),
            capitalExpenditure: (acc.capitalExpenditure || 0) + (curr.capitalExpenditure || 0),
            stockCompensation: (acc.stockCompensation || 0) + (curr.stockCompensation || 0),
          }), { operatingCashFlow: 0, capitalExpenditure: 0, stockCompensation: 0 });
          
          return {
            ...item,
            operatingCashFlow: ttmData.operatingCashFlow,
            capitalExpenditure: ttmData.capitalExpenditure,
            stockCompensation: ttmData.stockCompensation,
            freeCashFlow: ttmData.operatingCashFlow - Math.abs(ttmData.capitalExpenditure)
          };
        })
      : allData;

    return filterDataByTimeframe(processedData, timeframe);
  }, [data, timeframe, isTTM]);

  if (isLoading || !data) {
    return <div className={graphStyles.loading}>Loading free cash flow...</div>;
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
            formatter={(value: number, name: string) => [`$${formatLargeNumber(value)}`, name]}
            labelFormatter={(label) => label}
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
          <Bar
            dataKey="freeCashFlow"
            fill="#4CAF50"
            name="Free Cash Flow"
            hide={hiddenSeries.has('freeCashFlow')}
          />
          <Bar
            dataKey="stockCompensation"
            fill="#FF9800"
            name="Stock Compensation"
            hide={!isExpanded || hiddenSeries.has('stockCompensation')}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 