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
import styles from './styles.module.css';
import { formatLargeNumber } from '@/utils/format';
import { useChartContext } from '@/components/dashboard/DashboardCard/GraphicalCard/ChartContext';
import { filterDataByTimeframe } from '@/utils/timeframeFilter';
import clsx from 'clsx';

interface ExpensesProps {
  data?: HistoricalIncomeStatement;
  isLoading: boolean;
}

export default function Expenses({ data, isLoading }: ExpensesProps) {
  const { isExpanded, timeframe } = useChartContext();
  const [showBreakdown, setShowBreakdown] = useState(false);

  const chartData = useMemo(() => {
    if (!data?.data) return [];

    const allData = data.data.map(statement => {
      const expenseCategories = {
        costOfRevenue: statement.costOfRevenue,
        researchAndDevelopment: statement.researchAndDevelopmentExpenses,
        sellingGeneralAndAdmin: statement.sellingGeneralAndAdministrativeExpenses,
        depreciationAndAmortization: statement.depreciationAndAmortization,
        interestExpense: statement.interestExpense,
        incomeTaxExpense: statement.incomeTaxExpense,
      };

      return {
        ...expenseCategories,
        totalExpenses: Object.values(expenseCategories).reduce((sum, value) => sum + (value || 0), 0),
        date: statement.date,
        label: `${statement.period} ${statement.calendarYear}`
      };
    }).reverse(); // Most recent first

    return filterDataByTimeframe(allData, timeframe);
  }, [data, timeframe]);

  if (isLoading || !data) {
    return <div className={graphStyles.loading}>Loading expenses data...</div>;
  }

  const expenseCategories = [
    { key: 'costOfRevenue', name: 'Cost of Revenue', color: '#FF9800' },
    { key: 'researchAndDevelopment', name: 'R&D', color: '#4CAF50' },
    { key: 'sellingGeneralAndAdmin', name: 'SG&A', color: '#2196F3' },
    { key: 'depreciationAndAmortization', name: 'Depreciation & Amortization', color: '#E91E63' },
    { key: 'interestExpense', name: 'Interest Expense', color: '#9C27B0' },
    { key: 'incomeTaxExpense', name: 'Income Tax', color: '#673AB7' }
  ];

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
              const displayName = {
                totalExpenses: 'Total Expenses',
                costOfRevenue: 'Cost of Revenue',
                researchAndDevelopment: 'R&D',
                sellingGeneralAndAdmin: 'Selling, General & Admin',
                depreciationAndAmortization: 'Depreciation & Amortization',
                interestExpense: 'Interest Expense',
                incomeTaxExpense: 'Income Tax'
              }[name] || name;
              return [formattedValue, displayName];
            }}
            labelFormatter={(label) => label}
          />
          {isExpanded && showBreakdown && <Legend />}
          
          {showBreakdown && isExpanded ? (
            expenseCategories.map(category => (
              <Bar
                key={category.key}
                dataKey={category.key}
                stackId="expenses"
                fill={category.color}
                name={category.name}
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