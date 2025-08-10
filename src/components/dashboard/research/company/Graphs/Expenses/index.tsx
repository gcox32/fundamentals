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
import type { HistoricalIncomeStatement, HistoricalCashFlowStatement } from '@/types/financials';
import graphStyles from '@/components/dashboard/research/company/DashboardCard/GraphicalCard/styles.module.css';
import styles from '@/components/common/Toggle/styles.module.css';
import { formatLargeNumber } from '@/src/lib/utilities/format';
import { useChartContext } from '@/components/dashboard/research/company/DashboardCard/GraphicalCard/ChartContext';
import { filterDataByTimeframe } from '@/src/lib/utilities/timeframeFilter';
import clsx from 'clsx';
import { useTheme } from '@/src/contexts/ThemeContext';

interface ExpensesProps {
  incomeStatement?: HistoricalIncomeStatement;
  cashFlowStatement?: HistoricalCashFlowStatement;
  isLoading: boolean;
}

// Define expense categories with their display names and colors
const expenseCategories = [
  { key: 'costOfRevenue', name: 'Cost of Revenue', color: '#FF9800', tooltip: 'Direct costs of producing goods/services' },
  { key: 'researchAndDevelopment', name: 'R&D', color: '#4CAF50', tooltip: 'Investment in future innovation' },
  { key: 'salesAndMarketing', name: 'Sales & Marketing', color: '#2196F3', tooltip: 'Cost of acquiring customers' },
  { key: 'capitalExpenditures', name: 'Capital Expenditure', color: '#E91E63', tooltip: 'Investment in physical assets' }
] as const;

type ExpenseCategory = typeof expenseCategories[number]['key'];

export default function Expenses({ incomeStatement: data, cashFlowStatement: cashFlow, isLoading }: ExpensesProps) {
  const { isExpanded, timeframe, isTTM } = useChartContext();
  const [showBreakdown, setShowBreakdown] = useState(false);
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
    
    if (!data?.data || !cashFlow?.data) {
        console.log("No data available, returning empty array");
        return [];
    }

    const allData = data.data.map(statement => {
        const matchingCashFlow = cashFlow.data.find(cf => {
            return cf.date === statement.date;
        });
        
        const expenseValues = {
            costOfRevenue: statement.costOfRevenue || 0,
            researchAndDevelopment: statement.researchAndDevelopmentExpenses || 0,
            salesAndMarketing: statement.sellingGeneralAndAdministrativeExpenses || 0,
            capitalExpenditures: Math.abs(matchingCashFlow?.capitalExpenditure || 0)
        };

        const totalExpenses = Object.values(expenseValues).reduce((sum, value) => sum + value, 0);

        return {
            date: statement.date,
            label: `${statement.period} ${statement.calendarYear}`,
            ...expenseValues,
            totalExpenses
        };
    }).reverse();

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
  }, [data, cashFlow, timeframe, isTTM]);

  if (isLoading || !data || !cashFlow) {
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
      <ResponsiveContainer width="100%" height={isExpanded ? 550 : 300}>
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
            tickFormatter={(value) => formatLargeNumber(value)}
          />
          <Tooltip
            formatter={(value: number, name: string) => {
              const category = expenseCategories.find(cat => cat.key === name);
              const formattedValue = `$${formatLargeNumber(value)}`;
              const displayName = category?.name || name;
              return [
                formattedValue, 
                <>
                  <div>{displayName}</div>
                  {category?.tooltip && <div style={{ fontSize: '0.8em', opacity: 0.8 }}>{category.tooltip}</div>}
                </>
              ];
            }}
            labelFormatter={(label) => label}
          />
          {isExpanded && showBreakdown && (
            <Legend 
              onClick={(e) => {
                if (typeof e.dataKey === 'string') {
                  toggleSeries(e.dataKey);
                }
              }}
              wrapperStyle={{ cursor: 'pointer' }}
            />
          )}
          
          {showBreakdown && isExpanded ? (
            expenseCategories.map(({ key, name, color }) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="expenses"
                fill={color}
                name={name}
                hide={hiddenSeries.has(key)}
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