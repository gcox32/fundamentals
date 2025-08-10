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
import type { HistoricalIncomeStatement, HistoricalBalanceSheetStatement } from '@/types/financials';
import graphStyles from '@/components/dashboard/research/company/DashboardCard/GraphicalCard/styles.module.css';
import { formatPercent } from '@/src/lib/utilities/format';
import { useChartContext } from '@/components/dashboard/research/company/DashboardCard/GraphicalCard/ChartContext';
import { filterDataByTimeframe } from '@/src/lib/utilities/timeframeFilter';
import { useTheme } from '@/src/contexts/ThemeContext';

interface ROICProps {
  incomeStatement?: HistoricalIncomeStatement;
  balanceSheetStatement?: HistoricalBalanceSheetStatement;
  isLoading: boolean;
}

export default function ROIC({ incomeStatement, balanceSheetStatement, isLoading }: ROICProps) {
  const { isExpanded, timeframe, isTTM } = useChartContext();
  const { isDarkMode } = useTheme();
  const chartData = useMemo(() => {
    if (!incomeStatement?.data || !balanceSheetStatement?.data) return [];

    // Create a map of dates to balance sheet data for quick lookup
    const balanceSheetMap = balanceSheetStatement.data.reduce((acc, statement) => {
      acc[statement.date] = statement;
      return acc;
    }, {} as Record<string, typeof balanceSheetStatement.data[0]>);

    const allData = incomeStatement.data
      .filter(statement => balanceSheetMap[statement.date]) // Only include dates where we have both statements
      .map(statement => {
        const balanceSheetData = balanceSheetMap[statement.date];
        
        // Calculate NOPAT (Net Operating Profit After Taxes)
        const operatingIncome = statement.operatingIncome || 0;
        const taxRate = statement.incomeTaxExpense && statement.incomeBeforeTax 
          ? statement.incomeTaxExpense / statement.incomeBeforeTax 
          : 0.25; // Use 25% as default tax rate if not available
        const nopat = operatingIncome * (1 - taxRate);

        // Calculate Invested Capital
        // Invested Capital = Total Assets - Current Liabilities - Cash and Equivalents
        const investedCapital = (balanceSheetData.totalAssets || 0) 
          - (balanceSheetData.totalCurrentLiabilities || 0)
          - (balanceSheetData.cashAndCashEquivalents || 0);

        // Calculate ROIC
        const roic = investedCapital > 0 ? (nopat / investedCapital) * 100 : 0;
        
        return {
          date: statement.date,
          nopat,
          investedCapital,
          roic,
          label: `${statement.period} ${statement.calendarYear}`
        };
      })
      .reverse(); // Most recent first

    const processedData = isTTM
      ? allData.map((item, index, array) => {
          if (index < 3) return item;
          
          // Calculate TTM NOPAT
          const ttmNOPAT = array
            .slice(index - 3, index + 1)
            .reduce((sum, curr) => sum + curr.nopat, 0);
          
          // Use the latest quarter's invested capital
          const latestInvestedCapital = item.investedCapital;
          
          // Calculate TTM ROIC
          const ttmROIC = latestInvestedCapital > 0 
            ? (ttmNOPAT / latestInvestedCapital) * 100 
            : 0;

          return {
            ...item,
            nopat: ttmNOPAT,
            roic: ttmROIC
          };
        })
      : allData;

    return filterDataByTimeframe(processedData, timeframe);
  }, [incomeStatement, balanceSheetStatement, timeframe, isTTM]);

  if (isLoading || !incomeStatement || !balanceSheetStatement) {
    return <div className={graphStyles.loading}>Loading ROIC...</div>;
  }

  return (
    <div className={graphStyles.chartContainer}>
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
            tickFormatter={(value) => formatPercent(value)}
          />
          <Tooltip
            formatter={(value: number) => [formatPercent(value), 'ROIC']}
            labelFormatter={(label) => label}
          />
          <Bar
            dataKey="roic"
            fill="#00BCD4"
            name="ROIC"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
} 