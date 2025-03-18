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
import { HistoricalPriceData } from '@/types/stock';
import { formatPrice } from '@/utils/format';
import graphStyles from '@/components/dashboard/DashboardCard/GraphicalCard/styles.module.css';
import { useChartContext } from '@/components/dashboard/DashboardCard/GraphicalCard/ChartContext';
import { filterDataByTimeframe } from '@/utils/timeframeFilter';
import { HistoricalIncomeStatement } from '@/src/types/financials';

interface HistoricalPriceProps {
  historicalPrice?: HistoricalPriceData;
  incomeStatement?: HistoricalIncomeStatement;
  isLoading: boolean;
}

export default function HistoricalPrice({ historicalPrice: data, incomeStatement, isLoading  }: HistoricalPriceProps) {
  const { isExpanded, timeframe } = useChartContext();
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
    if (!data?.historical) {
      console.log('data structure', data);
      return [];
    }
    const allData = [...data.historical].reverse();
    const filteredData = filterDataByTimeframe(allData, timeframe);

    // Create a map of TTM EPS values by date
    const ttmEpsMap = new Map<string, number>();
    if (incomeStatement?.data) {
      const quarterlyData = [...incomeStatement.data].reverse();
      
      // Pre-calculate all possible TTM values
      quarterlyData.forEach((_, index, array) => {
        // For the first 3 quarters, use whatever data we have
        const lookbackPeriod = Math.min(4, index + 1);
        const ttmEps = array
          .slice(index - lookbackPeriod + 1, index + 1)
          .reduce((sum, quarter) => sum + (quarter.epsdiluted || 0), 0);
        
        // Annualize if we have less than 4 quarters
        const annualizedEps = ttmEps * (4 / lookbackPeriod);
        ttmEpsMap.set(array[index].date, annualizedEps);
      });
    }

    // Calculate moving averages and P/E ratio
    return filteredData.map((item, index, array) => {
      const ma50 = index >= 49 
        ? array.slice(index - 49, index + 1).reduce((sum, curr) => sum + curr.close, 0) / 50 
        : null;
      
      const ma200 = index >= 199 
        ? array.slice(index - 199, index + 1).reduce((sum, curr) => sum + curr.close, 0) / 200 
        : null;

      const ttmEps = ttmEpsMap.get(item.date) || null;
      const peRatio = ttmEps && ttmEps !== 0 ? item.close / ttmEps : null;
      console.log('peRatio', peRatio);
      return {
        ...item,
        ma50,
        ma200,
        peRatio
      };
    });
  }, [data, incomeStatement, timeframe]);

  if (isLoading || !data || !incomeStatement?.data) {
    return <div className={graphStyles.loading}>Loading price history...</div>;
  }

  return (
    <div className={graphStyles.chartContainer}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
            interval="preserveStartEnd"
            angle={isExpanded ? -45 : 0}
            textAnchor={isExpanded ? "end" : "middle"}
            height={isExpanded ? 60 : 30}
            hide={!isExpanded}
          />
          <YAxis 
            hide={!isExpanded}
            domain={['auto', 'auto']}
            tickFormatter={(value) => formatPrice(value)}
          />
          {isExpanded && (
            <YAxis 
              yAxisId="pe"
              orientation="right"
              domain={['auto', 'auto']}
              tickFormatter={(value) => value.toFixed(1)}
              hide={hiddenSeries.has('peRatio')}
            />
          )}
          <Tooltip
            formatter={(value: number, name: string) => {
              switch (name) {
                case 'P/E Ratio':
                  return [value.toFixed(2), name];
                case 'Price':
                case '50 Day MA':
                case '200 Day MA':
                  return [formatPrice(value), name];
                default:
                  return [value, name];
              }
            }}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
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
            dataKey="close"
            stroke="#8884d8"
            dot={false}
            activeDot={{ r: 8 }}
            name="Price"
            hide={hiddenSeries.has('close')}
          />
          {isExpanded && (
              <Line
                type="monotone"
                dataKey="ma50"
                stroke="#2196F3"
                dot={false}
                name="50 Day MA"
                hide={hiddenSeries.has('ma50')}
              />
          )}
          {isExpanded && (
              <Line
                type="monotone"
                dataKey="ma200"
                stroke="#4CAF50"
                dot={false}
                name="200 Day MA"
                hide={hiddenSeries.has('ma200')}
              />
          )}
          {isExpanded && (
            <Line
              type="monotone"
              dataKey="peRatio"
              stroke="#FF5722"
              // dot={false}
              yAxisId="pe"
              name="P/E Ratio"
              hide={hiddenSeries.has('peRatio')}
              connectNulls={true}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 