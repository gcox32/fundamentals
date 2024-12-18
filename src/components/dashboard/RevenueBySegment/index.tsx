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
import type { HistoricalRevenueBySegment } from '@/types/company';
import graphStyles from '../DashboardCard/GraphicalCard/styles.module.css';
import { formatLargeNumber } from '@/utils/format';
import { useChartContext } from '../DashboardCard/GraphicalCard/ChartContext';
interface HistoricalRevenueBySegmentProps {
  data?: HistoricalRevenueBySegment;
  isLoading: boolean;
}

// Material Design-inspired color palette
const COLOR_PALETTE = [
  '#2196F3', // Blue
  '#4CAF50', // Green
  '#FFC107', // Amber
  '#9C27B0', // Purple
  '#FF5722', // Deep Orange
  '#00BCD4', // Cyan
  '#3F51B5', // Indigo
  '#F44336', // Red
  '#009688', // Teal
  '#673AB7'  // Deep Purple
];

export default function RevenueBySegment({ data, isLoading }: HistoricalRevenueBySegmentProps) {
  const { isExpanded } = useChartContext();

  if (isLoading || !data) {
    return <div className={graphStyles.loading}>Loading revenue segments...</div>;
  }

  // Transform the data for the stacked bar chart
  const chartData = useMemo(() => {
    if (!data.data) return [];

    return Object.entries(data.data)
      .sort((a, b) => Number(a[0]) - Number(b[0])) // Sort by numeric index
      .map(([_, dateData]) => {
        const [[date, segments]] = Object.entries(dateData);
        return {
          date,
          ...segments
        };
      })
      .reverse(); // Most recent first
  }, [data]);

  // Get all unique segment names
  const segments = useMemo(() => {
    const allSegments = new Set<string>();
    chartData.forEach(item => {
      Object.keys(item).forEach(key => {
        if (key !== 'date') allSegments.add(key);
      });
    });
    return Array.from(allSegments);
  }, [chartData]);

  // Create a mapping of segments to colors
  const segmentColors = useMemo(() => {
    return segments.reduce<Record<string, string>>((acc, segment, index) => ({
      ...acc,
      [segment]: COLOR_PALETTE[index % COLOR_PALETTE.length]
    }), {});
  }, [segments]);

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
            dataKey="date" 
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
            interval="preserveStartEnd"
          />
          <YAxis 
            hide={!isExpanded}
            tickFormatter={(value) => formatLargeNumber(value)}
          />
          <Tooltip
            formatter={(value: number, name: string) => [`$${formatLargeNumber(value)}`, name]}
            labelFormatter={(label) => new Date(label).toLocaleDateString()}
          />
          {segments.map((segment) => (
            <Bar
              key={segment}
              dataKey={segment}
              stackId="revenue"
              fill={segmentColors[segment]}
              name={segment}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 