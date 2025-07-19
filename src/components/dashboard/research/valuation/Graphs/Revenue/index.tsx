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
import type { HistoricalIncomeStatement } from '@/types/financials';
import type { HistoricalRevenueBySegment, HistoricalRevenueByGeography } from '@/types/company';
import graphStyles from '@/components/dashboard/research/valuation/DashboardCard/GraphicalCard/styles.module.css';
import styles from '@/components/common/Toggle/styles.module.css';
import { formatLargeNumber, getQuarterFromDate } from '@/src/lib/utilities/format';
import { useChartContext } from '@/components/dashboard/research/valuation/DashboardCard/GraphicalCard/ChartContext';
import { filterDataByTimeframe } from '@/src/lib/utilities/timeframeFilter';
import { useTheme } from '@/src/contexts/ThemeContext';
import clsx from 'clsx';

type RevenueView = 'total' | 'segment' | 'region';

interface RevenueProps {
  incomeStatement?: HistoricalIncomeStatement;
  revenueBySegment?: HistoricalRevenueBySegment;
  revenueByGeography?: HistoricalRevenueByGeography;
  isLoading: boolean;
}

interface ChartDataItem {
  date: string;
  label: string;
  total: number;
  [key: string]: string | number;
}

const COLORS = [
  '#2196F3', '#4CAF50', '#FFC107', '#FF5722', '#9C27B0',
  '#3F51B5', '#009688', '#FF9800', '#F44336', '#673AB7'
];

export default function Revenue({ 
  incomeStatement: data, 
  revenueBySegment: segmentData, 
  revenueByGeography: geographyData, 
  isLoading 
}: RevenueProps) {
  const { isExpanded, timeframe, isTTM } = useChartContext();
  const [selectedView, setSelectedView] = useState<RevenueView>('total');
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
    if (selectedView === 'total' && data?.data) {
      const allData = data.data.map(statement => ({
        date: statement.date,
        revenue: statement.revenue,
        label: `${statement.period} ${statement.calendarYear}`
      })).reverse();

      const processedData = isTTM
        ? allData.map((item, index, array) => {
            if (index < 3) return item;
            const ttmRevenue = array
              .slice(index - 3, index + 1)
              .reduce((sum, curr) => sum + (curr.revenue || 0), 0);
            return {
              ...item,
              revenue: ttmRevenue
            };
          })
        : allData;

      return filterDataByTimeframe(processedData, timeframe);
    }

    if (selectedView === 'segment' && segmentData?.data) {
      const segments = new Set<string>();
      Object.values(segmentData.data).forEach(dateData => {
        Object.entries(dateData).forEach(([_, segmentData]) => {
          Object.keys(segmentData).forEach(segment => segments.add(segment));
        });
      });

      const processedData: ChartDataItem[] = Object.entries(segmentData.data)
        .sort((a, b) => Number(b[0]) - Number(a[0])) // Sort by date descending
        .map(([_, dateData]) => {
          const [[date, segments]] = Object.entries(dateData);
          const baseData: ChartDataItem = {
            date,
            label: getQuarterFromDate(date),
            total: Object.values(segments).reduce((sum, value) => sum + (value || 0), 0)
          };

          Object.keys(segments).forEach(segment => {
            baseData[segment] = segments[segment] || 0;
          });

          return baseData;
        });

      const processedDataWithTTM = isTTM
        ? processedData.map((item, index, array) => {
            if (index < 3) return item;
            const ttmData = { ...item };
            Array.from(segments).forEach(segment => {
              ttmData[segment] = array
                .slice(index - 3, index + 1)
                .reduce((sum, curr) => sum + (Number(curr[segment]) || 0), 0);
            });
            ttmData.total = Array.from(segments)
              .reduce((sum, segment) => sum + Number(ttmData[segment]), 0);
            return ttmData;
          })
        : processedData;

      return filterDataByTimeframe(processedDataWithTTM, timeframe);
    }

    if (selectedView === 'region' && geographyData?.data) {
      const regions = new Set<string>();
      Object.values(geographyData.data).forEach(dateData => {
        Object.entries(dateData).forEach(([_, regionData]) => {
          Object.keys(regionData).forEach(region => regions.add(region));
        });
      });

      const processedData: ChartDataItem[] = Object.entries(geographyData.data)
        .sort((a, b) => Number(b[0]) - Number(a[0])) // Sort by date descending
        .map(([_, dateData]) => {
          const [[date, regions]] = Object.entries(dateData);
          const baseData: ChartDataItem = {
            date,
            label: getQuarterFromDate(date),
            total: Object.values(regions).reduce((sum, value) => sum + (value || 0), 0)
          };

          Object.keys(regions).forEach(region => {
            baseData[region] = regions[region] || 0;
          });

          return baseData;
        });

      const processedDataWithTTM = isTTM
        ? processedData.map((item, index, array) => {
            if (index < 3) return item;
            const ttmData = { ...item };
            Array.from(regions).forEach(region => {
              ttmData[region] = array
                .slice(index - 3, index + 1)
                .reduce((sum, curr) => sum + (Number(curr[region]) || 0), 0);
            });
            ttmData.total = Array.from(regions)
              .reduce((sum, region) => sum + Number(ttmData[region]), 0);
            return ttmData;
          })
        : processedData;

      return filterDataByTimeframe(processedDataWithTTM, timeframe);
    }

    return [];
  }, [data, segmentData, geographyData, selectedView, timeframe, isTTM]);

  const getDataKeys = (): string[] => {
    if (selectedView === 'total') return ['revenue'];
    if (selectedView === 'segment' && segmentData?.data) {
      const segments = new Set<string>();
      Object.values(segmentData.data).forEach(dateData => {
        Object.entries(dateData).forEach(([_, segmentData]) => {
          Object.keys(segmentData).forEach(segment => segments.add(segment));
        });
      });
      return Array.from(segments);
    }
    if (selectedView === 'region' && geographyData?.data) {
      const regions = new Set<string>();
      Object.values(geographyData.data).forEach(dateData => {
        Object.entries(dateData).forEach(([_, regionData]) => {
          Object.keys(regionData).forEach(region => regions.add(region));
        });
      });
      return Array.from(regions);
    }
    return [];
  };

  if (isLoading) {
    return <div className={graphStyles.loading}>Loading revenue...</div>;
  }

  if (!data && selectedView === 'total') {
    return <div className={graphStyles.noData}>No revenue data available</div>;
  }

  if (!segmentData && selectedView === 'segment') {
    return <div className={graphStyles.noData}>No segment data available</div>;
  }

  if (!geographyData && selectedView === 'region') {
    return <div className={graphStyles.noData}>No geographic data available</div>;
  }

  const dataKeys = getDataKeys();

  return (
    <div className={graphStyles.chartContainer}>
      {isExpanded && (
        <div className={styles.toggleContainer}>
          <div className={`${styles.toggleWrapper} ${styles.tripleToggle}`}>
            <button
              onClick={() => setSelectedView('total')}
              className={clsx(styles.toggleButton, selectedView === 'total' ? styles.active : styles.inactive)}
            >
              Total
            </button>
            <button
              onClick={() => setSelectedView('segment')}
              className={clsx(styles.toggleButton, selectedView === 'segment' ? styles.active : styles.inactive)}
            >
              By Segment
            </button>
            <button
              onClick={() => setSelectedView('region')}
              className={clsx(styles.toggleButton, selectedView === 'region' ? styles.active : styles.inactive)}
            >
              By Region
            </button>
            <div 
              className={clsx(
                styles.slider, 
                selectedView === 'total' ? styles.sliderLeft : 
                selectedView === 'segment' ? styles.sliderCenter : 
                styles.sliderRight
              )} 
            />
          </div>
        </div>
      )}
      <ResponsiveContainer width="100%" height={isExpanded ? 550 : 300}>
        <BarChart 
          data={chartData} 
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
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
              `$${formatLargeNumber(value)}`,
              name === 'revenue' ? 'Revenue' : name
            ]}
            labelFormatter={(label) => label}
          />
          {selectedView !== 'total' && (
            <Legend 
              onClick={(e) => {
                if (typeof e.dataKey === 'string') {
                  toggleSeries(e.dataKey);
                }
              }}
              wrapperStyle={{ cursor: 'pointer' }}
            />
          )}
          {selectedView === 'total' ? (
            <Bar
              dataKey="revenue"
              fill="#2196F3"
              name="Revenue"
            />
          ) : (
            dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="revenue"
                fill={COLORS[index % COLORS.length]}
                name={key}
                hide={hiddenSeries.has(key)}
              />
            ))
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 