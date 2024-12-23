import React, { useMemo, useState } from 'react';
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

    const allData = data.data.map(statement => {
      const revenue = statement.revenue || 0;
      const grossProfit = (revenue - (statement.costOfRevenue || 0));
      const operatingIncome = statement.operatingIncome || 0;
      const netIncome = statement.netIncome || 0;

      return {
        date: statement.date,
        revenue,
        grossProfit,
        operatingIncome,
        netIncome,
        grossMargin: revenue ? (grossProfit / revenue) * 100 : 0,
        operatingMargin: revenue ? (operatingIncome / revenue) * 100 : 0,
        netMargin: revenue ? (netIncome / revenue) * 100 : 0,
        label: `${statement.period} ${statement.calendarYear}`
      };
    }).reverse(); // Most recent first

    const processedData = isTTM
      ? allData.map((item, index, array) => {
          if (index < 3) return item;
          const ttmData = array.slice(index - 3, index + 1).reduce((acc, curr) => ({
            revenue: (acc.revenue || 0) + (curr.revenue || 0),
            grossProfit: (acc.grossProfit || 0) + (curr.grossProfit || 0),
            operatingIncome: (acc.operatingIncome || 0) + (curr.operatingIncome || 0),
            netIncome: (acc.netIncome || 0) + (curr.netIncome || 0),
          }), { revenue: 0, grossProfit: 0, operatingIncome: 0, netIncome: 0 });
          
          return {
            ...item,
            revenue: ttmData.revenue,
            grossProfit: ttmData.grossProfit,
            operatingIncome: ttmData.operatingIncome,
            netIncome: ttmData.netIncome,
            grossMargin: ttmData.revenue ? (ttmData.grossProfit / ttmData.revenue) * 100 : 0,
            operatingMargin: ttmData.revenue ? (ttmData.operatingIncome / ttmData.revenue) * 100 : 0,
            netMargin: ttmData.revenue ? (ttmData.netIncome / ttmData.revenue) * 100 : 0
          };
        })
      : allData;

    return filterDataByTimeframe(processedData, timeframe);
  }, [data, timeframe, isTTM]);

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
          
          <Line
            type="monotone"
            dataKey="grossMargin"
            stroke="#4CAF50"
            name="Gross Margin"
            strokeWidth={2}
            dot={false}
            hide={hiddenSeries.has('grossMargin')}
          />
          <Line
            type="monotone"
            dataKey="operatingMargin"
            stroke="#2196F3"
            name="Operating Margin"
            strokeWidth={2}
            dot={false}
            hide={hiddenSeries.has('operatingMargin')}
          />
          <Line
            type="monotone"
            dataKey="netMargin"
            stroke="#9C27B0"
            name="Net Margin"
            strokeWidth={2}
            dot={false}
            hide={hiddenSeries.has('netMargin')}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 