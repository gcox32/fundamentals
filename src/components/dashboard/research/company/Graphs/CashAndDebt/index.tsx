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
import type { HistoricalBalanceSheetStatement } from '@/types/financials';
import graphStyles from '@/components/dashboard/research/company/DashboardCard/GraphicalCard/styles.module.css';
import { formatLargeNumber } from '@/src/lib/utilities/format';
import { useChartContext } from '@/components/dashboard/research/company/DashboardCard/GraphicalCard/ChartContext';
import { filterDataByTimeframe } from '@/src/lib/utilities/timeframeFilter';
import { useTheme } from '@/src/contexts/ThemeContext';

interface CashAndDebtProps {
  data?: HistoricalBalanceSheetStatement;
  isLoading: boolean;
}

export default function CashAndDebt({ data, isLoading }: CashAndDebtProps) {
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
      cash: statement.cashAndCashEquivalents,
      debt: statement.longTermDebt,
      label: `${statement.period} ${statement.calendarYear}`
    })).reverse(); // Most recent first

    // Note: For balance sheet items like Cash and Debt, we use the latest quarter's values
    // instead of summing them, as these are point-in-time values, not flow values
    const processedData = isTTM
      ? allData.map((item) => item) // Just pass through the data as is
      : allData;

    return filterDataByTimeframe(processedData, timeframe);
  }, [data, timeframe, isTTM]);

  if (isLoading || !data) {
    return <div className={graphStyles.loading}>Loading cash and debt...</div>;
  }

  return (
    <div >
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
            dataKey="cash"
            fill="#4CAF50"
            name="Cash"
            hide={hiddenSeries.has('cash')}
          />
          <Bar
            dataKey="debt"
            fill="#f44336"
            name="Debt"
            hide={hiddenSeries.has('debt')}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 