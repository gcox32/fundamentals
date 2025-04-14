import { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import styles from './styles.module.css';
import { formatPrice } from '@/utils/format';
import { calculateDCF, calculateEarningsBased } from '@/components/dashboard/Overview/IntrinsicValueOverview/calculations';

interface ValuationChartProps {
  symbol: string;
  type: 'fcf' | 'eps';
  assumptions: {
    // FCF Assumptions
    currentFcf: number;
    fcfGrowthRate: number;
    terminalGrowthRate: number;
    discountRate: number;
    sharesOutstanding: number;
    projectionYears: number;
    marketValueEquity: number;
    marketValueDebt: number;
    costOfEquity: number;
    costOfDebt: number;
    taxRate: number;

    // EPS Assumptions
    currentEps: number;
    epsGrowthRate: number;
    terminalPE: number;
  };
  isLoading: boolean;
}

export default function ValuationChart({ symbol, type, assumptions, isLoading }: ValuationChartProps) {
  const chartData = useMemo(() => {
    if (isLoading || !symbol) return [];

    const data = [];
    const sharesOutstanding = assumptions.sharesOutstanding || 1;

    if (type === 'fcf') {
      let fcf = assumptions.currentFcf;
      
      // Calculate intrinsic value using the full DCF function
      const intrinsicValue = calculateDCF(
        fcf,
        assumptions.fcfGrowthRate,
        assumptions.sharesOutstanding,
        assumptions.marketValueEquity,
        assumptions.marketValueDebt,
        assumptions.costOfEquity,
        assumptions.costOfDebt,
        assumptions.taxRate,
        assumptions.terminalGrowthRate,
        assumptions.projectionYears
      );

      // Start with current year
      data.push({
        year: `${new Date().getFullYear()}`,
        projectedValue: fcf / assumptions.sharesOutstanding,
        presentValue: fcf / assumptions.sharesOutstanding,
        terminalValue: 0
      });

      // Use the same WACC calculation as in calculateDCF
      const discountRate = assumptions.discountRate || 0.1;

      let projectedCashFlow = fcf;
      for (let year = 1; year <= assumptions.projectionYears; year++) {
        projectedCashFlow *= (1 + assumptions.fcfGrowthRate);
        const discountedFCF = projectedCashFlow / Math.pow(1 + discountRate, year);

        data.push({
          year: `${new Date().getFullYear() + year}`,
          projectedValue: projectedCashFlow / assumptions.sharesOutstanding,
          presentValue: discountedFCF / assumptions.sharesOutstanding,
          terminalValue: 0
        });
      }

      // Calculate terminal value using the same formula
      const terminalValue = (projectedCashFlow * (1 + assumptions.terminalGrowthRate)) /
        (discountRate - assumptions.terminalGrowthRate);
      const presentTerminalValue = terminalValue / Math.pow(1 + discountRate, assumptions.projectionYears);

      data[data.length - 1].terminalValue = presentTerminalValue / assumptions.sharesOutstanding;

      return data;
    }

    if (type === 'eps') {
      const eps = assumptions.currentEps;

      // Start with current year
      data.push({
        year: `${new Date().getFullYear()}`,
        projectedValue: eps,
        impliedPrice: calculateEarningsBased(eps, assumptions.epsGrowthRate, assumptions.terminalPE)
      });

      // Project future earnings using same logic as calculateEarningsBased
      for (let year = 1; year <= assumptions.projectionYears; year++) {
        const projectedEps = eps * Math.pow(1 + assumptions.epsGrowthRate, year);
        const impliedPrice = calculateEarningsBased(projectedEps, assumptions.epsGrowthRate, assumptions.terminalPE);

        data.push({
          year: `${new Date().getFullYear() + year}`,
          projectedValue: projectedEps,
          impliedPrice
        });
      }

      return data;
    }

    return [];
  }, [type, assumptions, symbol, isLoading]);

  // Add this to verify data before rendering
  console.log('Rendering chart with data:', chartData);

  if (isLoading || !chartData.length) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner} />
        <p>Loading company data...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.chartTitle}>
        {type === 'fcf' ? `${symbol} DCF Value Projection` : `${symbol} EPS Growth Projection`}
      </h3>

      <div className={styles.summaryPanel}>
        {type === 'fcf' ? (() => {
          const fcfData = chartData as {
            year: string;
            projectedValue: number;
            presentValue: number;
            terminalValue: number;
          }[];

          const intrinsicValue = fcfData.reduce(
            (acc, point) => acc + point.presentValue,
            0
          ) + (fcfData.at(-1)?.terminalValue || 0);

          return (
            <p>
              <strong>Intrinsic Value:</strong> {formatPrice(intrinsicValue)}
            </p>
          );
        })() : (() => {
          const epsData = chartData as {
            year: string;
            projectedValue: number;
            impliedPrice: number | null;
          }[];

          const impliedPrice = (epsData.at(-1)?.projectedValue || 0) * assumptions.terminalPE;

          return (
            <p>
              <strong>Implied Price (Final Year):</strong> {formatPrice(impliedPrice)}
            </p>
          );
        })()}
      </div>

      <div className={styles.chartContainer}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis
              tickFormatter={formatPrice}
              domain={['auto', 'auto']}
              label={{
                value: type === 'fcf' ? 'FCF per Share' : 'EPS',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <Tooltip
              labelFormatter={(label) => label}
              formatter={(value: number) => [formatPrice(value), '$/share']}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="projectedValue"
              stroke="#8884d8"
              name={type === 'fcf' ? 'Projected FCF/Share' : 'Projected EPS'}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 