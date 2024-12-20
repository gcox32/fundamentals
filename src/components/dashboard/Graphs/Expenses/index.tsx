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
import graphStyles from '@/components/dashboard/DashboardCard/GraphicalCard/styles.module.css';
import styles from '@/components/common/Toggle/styles.module.css';
import { formatLargeNumber } from '@/utils/format';
import { useChartContext } from '@/components/dashboard/DashboardCard/GraphicalCard/ChartContext';
import { filterDataByTimeframe } from '@/utils/timeframeFilter';
import clsx from 'clsx';

interface ExpensesProps {
  data?: HistoricalIncomeStatement;
  isLoading: boolean;
}

// Define expense categories with their display names and colors
const expenseCategories = [
  { key: 'costOfRevenue', name: 'Cost of Revenue', color: '#FF9800' },
  { key: 'researchAndDevelopment', name: 'R&D', color: '#4CAF50' },
  { key: 'sellingGeneralAndAdmin', name: 'SG&A', color: '#2196F3' },
  { key: 'depreciationAndAmortization', name: 'D&A', color: '#E91E63' },
  { key: 'interestExpense', name: 'Interest', color: '#9C27B0' },
  { key: 'otherExpenses', name: 'Other', color: '#607D8B' },
  { key: 'incomeTaxExpense', name: 'Income Tax', color: '#673AB7' }
] as const;

type ExpenseCategory = typeof expenseCategories[number]['key'];

export default function Expenses({ data, isLoading }: ExpensesProps) {
  const { isExpanded, timeframe, isTTM } = useChartContext();
  const [showBreakdown, setShowBreakdown] = useState(false);

  const chartData = useMemo(() => {
    if (!data?.data) return [];

    const allData = data.data.map(statement => {
      // Calculate base expense values
      const expenseValues = {
        costOfRevenue: statement.costOfRevenue || 0,
        researchAndDevelopment: statement.researchAndDevelopmentExpenses || 0,
        sellingGeneralAndAdmin: statement.sellingGeneralAndAdministrativeExpenses || 0,
        depreciationAndAmortization: statement.depreciationAndAmortization || 0,
        interestExpense: statement.interestExpense || 0,
        incomeTaxExpense: statement.incomeTaxExpense || 0,
        otherExpenses: (statement.otherExpenses || 0) + (statement.operatingExpenses || 0)
      };

      // Calculate total expenses
      const totalExpenses = Object.values(expenseValues).reduce((sum, value) => sum + value, 0);

      return {
        date: statement.date,
        label: `${statement.period} ${statement.calendarYear}`,
        ...expenseValues,
        totalExpenses
      };
    }).reverse(); // Most recent first

    const processedData = isTTM
      ? allData.map((item, index, array) => {
          if (index < 3) return item;

          // Calculate TTM by summing the last 4 quarters for each expense category
          const ttmData = array.slice(index - 3, index + 1).reduce((acc, curr) => {
            expenseCategories.forEach(({ key }) => {
              acc[key] = (acc[key] || 0) + (curr[key] || 0);
            });
            return acc;
          }, {} as Record<ExpenseCategory, number>);

          // Calculate total TTM expenses
          const totalTTMExpenses = Object.values(ttmData).reduce((sum, value) => sum + value, 0);

          return {
            ...item,
            ...ttmData,
            totalExpenses: totalTTMExpenses
          };
        })
      : allData;

    return filterDataByTimeframe(processedData, timeframe);
  }, [data, timeframe, isTTM]);

  if (isLoading || !data) {
    return <div className={graphStyles.loading}>Loading expenses data...</div>;
  }

  return (
    <div className={graphStyles.chartContainer}>
      {isExpanded && (
        <div className={styles.toggleContainer}>
          <div className={styles.toggleWrapper}>
            <button
              onClick={() => setShowBreakdown(false)}
              className={clsx(styles.toggleButton, !showBreakdown ? styles.active : styles.inactive)}
            >
              Total
            </button>
            <button
              onClick={() => setShowBreakdown(true)}
              className={clsx(styles.toggleButton, showBreakdown ? styles.active : styles.inactive)}
            >
              Breakdown
            </button>
            <div className={clsx(styles.slider, showBreakdown ? styles.sliderRight : styles.sliderLeft)} />
          </div>
        </div>
      )}
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
              const formattedValue = `$${formatLargeNumber(value)}`;
              const displayName = expenseCategories.find(cat => cat.key === name)?.name || name;
              return [formattedValue, displayName];
            }}
            labelFormatter={(label) => label}
          />
          {isExpanded && showBreakdown && <Legend />}
          
          {showBreakdown && isExpanded ? (
            expenseCategories.map(({ key, name, color }) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="expenses"
                fill={color}
                name={name}
              />
            ))
          ) : (
            <Bar
              dataKey="totalExpenses"
              fill="#2196F3"
              name="Total Expenses"
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 