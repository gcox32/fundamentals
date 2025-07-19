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
import type { HistoricalDividendData } from '@/types/stock';
import graphStyles from '@/components/dashboard/research/valuation/DashboardCard/GraphicalCard/styles.module.css';
import { formatPrice, getQuarterFromDate } from '@/src/lib/utilities/format';
import { useChartContext } from '@/components/dashboard/research/valuation/DashboardCard/GraphicalCard/ChartContext';
import { filterDataByTimeframe } from '@/src/lib/utilities/timeframeFilter';
import { useTheme } from '@/src/contexts/ThemeContext';

interface DividendHistoryProps {
  data?: HistoricalDividendData;
  isLoading: boolean;
  noData?: boolean | undefined;
}

export default function DividendHistory({ data, isLoading }: DividendHistoryProps) {
  const { isExpanded, timeframe, isTTM } = useChartContext();
  const { isDarkMode } = useTheme();
  const chartData = useMemo(() => {
    if (!data?.historical?.length) return [];
    const allData = [...data.historical].map(item => ({
      ...item,
      label: getQuarterFromDate(item.date)
    })).reverse();

    const processedData = isTTM
      ? allData.map((item, index, array) => {
          if (index < 3) return item;
          const ttmDividend = array
            .slice(index - 3, index + 1)
            .reduce((sum, curr) => sum + (curr.adjDividend || 0), 0);
          return {
            ...item,
            adjDividend: ttmDividend
          };
        })
      : allData;

    return filterDataByTimeframe(processedData, timeframe);
  }, [data, timeframe, isTTM]);
  
  if (isLoading) {
    return <div className={graphStyles.loading}>Loading dividend history...</div>;
  }

  if (!data?.historical?.length) {
    return (
      <div className={graphStyles.noData}>
        No dividend history available. This company may not pay dividends.
      </div>
    );
  }

  return (
    <div className={graphStyles.chartContainer}>
      <ResponsiveContainer width="100%" height={isExpanded ? 750 : 300}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid horizontal={true} vertical={false} stroke={isDarkMode ? "#404040" : "#f0f0f0"} />
          <XAxis 
            dataKey="label"
            interval="preserveStartEnd"
            angle={isExpanded ? -45 : 0}
            textAnchor={isExpanded ? "end" : "middle"}
            height={isExpanded ? 60 : 30}
            hide={!isExpanded}
          />
          <YAxis 
            hide={!isExpanded}
            tickFormatter={(value) => formatPrice(value)}
          />
          <Tooltip
            formatter={(value: number) => [`${formatPrice(value)}`, 'Dividend']}
            labelFormatter={(label) => label}
          />
          <Bar
            dataKey="adjDividend"
            fill="#4CAF50"
            name="Dividend"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}