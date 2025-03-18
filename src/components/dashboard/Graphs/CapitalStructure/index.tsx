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
import graphStyles from '@/components/dashboard/DashboardCard/GraphicalCard/styles.module.css';
import { formatLargeNumber } from '@/utils/format';
import { useChartContext } from '@/components/dashboard/DashboardCard/GraphicalCard/ChartContext';
import { filterDataByTimeframe } from '@/utils/timeframeFilter';

interface CapitalStructureProps {
  data?: HistoricalBalanceSheetStatement;
  isLoading: boolean;
}

export default function CapitalStructure({ data, isLoading }: CapitalStructureProps) {
  const { isExpanded, timeframe, isTTM } = useChartContext();
  const [hiddenSeries, setHiddenSeries] = useState<Set<string>>(new Set());

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
      equity: statement.totalStockholdersEquity,
      debt: statement.totalDebt,
      positiveEquity: statement.totalStockholdersEquity > 0 ? statement.totalStockholdersEquity : 0,
      negativeEquity: statement.totalStockholdersEquity < 0 ? statement.totalStockholdersEquity : 0,
      debtToEquity: statement.totalDebt && statement.totalStockholdersEquity 
        ? (statement.totalDebt / statement.totalStockholdersEquity * 100).toFixed(2)
        : null,
      label: `${statement.period} ${statement.calendarYear}`
    })).reverse();

    return filterDataByTimeframe(allData, timeframe);
  }, [data, timeframe, isTTM]);

  if (isLoading || !data) {
    return <div className={graphStyles.loading}>Loading capital structure...</div>;
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
            formatter={(value: number, name: string) => {
              switch (name) {
                case 'debtToEquity':
                  return value === null ? ['N/A', 'Debt to Equity'] : [`${value}%`, 'Debt to Equity'];
                case 'negativeEquity':
                  return [`-$${formatLargeNumber(value)}`, 'Total Equity'];
                default:
                  return [`$${formatLargeNumber(value)}`, name === 'positiveEquity' ? 'Total Equity' : name];
              }
            }}
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
            dataKey="positiveEquity"
            fill="#4CAF50"
            name="Total Equity"
            hide={hiddenSeries.has('equity')}
            stackId="equity"
          />
          <Bar
            dataKey="negativeEquity"
            fill="#FF9800"
            name={`Shareholders' Deficit`}
            hide={hiddenSeries.has('equity')}
            stackId="equity"
          />
          <Bar
            dataKey="debt"
            fill="#f44336"
            name="Total Debt"
            hide={hiddenSeries.has('debt')}
          />
        </BarChart>
      </ResponsiveContainer>
      {chartData.some(d => Math.abs(d.negativeEquity) > 0) && (
        <div className={graphStyles.warning}>
          <p>⚠️ Negative equity indicates the company's liabilities exceed its assets, which may signal financial distress.</p>
        </div>
      )}
    </div>
  );
} 