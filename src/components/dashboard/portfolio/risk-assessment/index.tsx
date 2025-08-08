'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.module.css';
import { HistoricalPriceData } from '@/types/stock';
import { fetchValuationData } from '@/src/lib/valuation/fetchValuationData';
import { formatNumber, formatPercent, formatPrice } from '@/src/lib/utilities/format';
import Tooltip from '@/components/common/Tooltip';
import { FiInfo } from 'react-icons/fi';

interface RiskAssessmentProps {
  portfolioHistoricalPrices: HistoricalPriceData[];
  weights: number[]; // percent weights, e.g. [20, 30, 50]
}

type Timeframe = '1Y' | '3Y' | '5Y';

interface Metrics {
  periodStart: string;
  periodEnd: string;
  cumulativeReturn: number; // %
  annualizedVolatility: number; // %
  sharpeRatio: number;
  maxDrawdown: number; // %
  betaToSPY?: number;
  oneDayVaR95: number; // %
}

function computeMetrics(values: number[], dates: string[], benchmark?: number[]): Metrics | null {
  if (values.length < 2) return null;

  // Returns from value series
  const returns: number[] = [];
  const benchReturns: number[] = [];
  for (let i = 1; i < values.length; i++) {
    returns.push(values[i] / values[i - 1] - 1);
    if (benchmark && benchmark[i - 1] && benchmark[i]) {
      benchReturns.push(benchmark[i] / benchmark[i - 1] - 1);
    }
  }

  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((acc, r) => acc + Math.pow(r - mean, 2), 0) / (returns.length - 1);
  const stdDev = Math.sqrt(variance);
  const annualizedVol = stdDev * Math.sqrt(252);
  const sharpe = stdDev === 0 ? 0 : (mean / stdDev) * Math.sqrt(252);

  // Max Drawdown
  let peak = values[0];
  let maxDD = 0;
  for (const v of values) {
    if (v > peak) peak = v;
    const dd = (v / peak) - 1;
    if (dd < maxDD) maxDD = dd;
  }

  // Beta against SPY if available
  let beta: number | undefined;
  if (benchmark && benchReturns.length === returns.length) {
    const benchMean = benchReturns.reduce((a, b) => a + b, 0) / benchReturns.length;
    const cov = returns.reduce((acc, r, i) => acc + (r - mean) * (benchReturns[i] - benchMean), 0) / (returns.length - 1);
    const benchVar = benchReturns.reduce((acc, r) => acc + Math.pow(r - benchMean, 2), 0) / (benchReturns.length - 1);
    beta = benchVar === 0 ? 0 : cov / benchVar;
  }

  // Historical simulation VaR (95%) 1-day
  const sorted = [...returns].sort((a, b) => a - b);
  const index = Math.max(0, Math.floor(0.05 * sorted.length) - 1);
  const p05 = sorted[index] ?? 0;
  const var95 = -p05; // as positive percent

  return {
    periodStart: dates[0],
    periodEnd: dates[dates.length - 1],
    cumulativeReturn: values[values.length - 1] / values[0] - 1,
    annualizedVolatility: annualizedVol,
    sharpeRatio: sharpe,
    maxDrawdown: -maxDD, // positive percent
    betaToSPY: beta,
    oneDayVaR95: var95,
  };
}

type RfMode = 'ZERO' | 'AUTO_TBILL' | 'CUSTOM';

export default function RiskAssessment({ portfolioHistoricalPrices, weights }: RiskAssessmentProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState<Timeframe>('1Y');
  const [spyData, setSpyData] = useState<HistoricalPriceData | null>(null);
  const [rfMode, setRfMode] = useState<RfMode>(() => (typeof window !== 'undefined' ? (localStorage.getItem('risk.rfMode') as RfMode) || 'ZERO' : 'ZERO'));
  const [rfCustomAnnualPct, setRfCustomAnnualPct] = useState<number>(() => (typeof window !== 'undefined' ? Number(localStorage.getItem('risk.rfCustomAnnualPct') || '0') : 0));
  const [tBillAnnualPct, setTBillAnnualPct] = useState<number | null>(null);
  const [isRfOpen, setIsRfOpen] = useState<boolean>(false);
  const rfRef = useRef<HTMLDivElement | null>(null);

  // Fetch SPY for beta reference
  useEffect(() => {
    fetchValuationData(
      'stock/historical/price',
      'SPY',
      (data: HistoricalPriceData) => setSpyData(data),
      (err) => console.error('Error fetching SPY data:', err)
    );
  }, []);

  // Fetch 3M T-Bill (annualized) for AUTO mode
  useEffect(() => {
    async function fetchTbill() {
      try {
        const res = await fetch('/api/research/fred/DGS3MO');
        if (!res.ok) throw new Error('Failed to fetch DGS3MO');
        const data = await res.json();
        const latestPct = data?.latest?.value;
        if (typeof latestPct === 'number') setTBillAnnualPct(latestPct);
      } catch (e) {
        console.error(e);
      }
    }
    if (rfMode === 'AUTO_TBILL') fetchTbill();
  }, [rfMode]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('risk.rfMode', rfMode);
    localStorage.setItem('risk.rfCustomAnnualPct', String(rfCustomAnnualPct));
  }, [rfMode, rfCustomAnnualPct]);

  // Close RF popover on outside click or Escape
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!isRfOpen) return;
      if (rfRef.current && !rfRef.current.contains(e.target as Node)) {
        setIsRfOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setIsRfOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isRfOpen]);

  const { dates, portfolioValues, spyValues } = useMemo(() => {
    if (!portfolioHistoricalPrices?.length || !weights?.length) {
      return { dates: [] as string[], portfolioValues: [] as number[], spyValues: [] as number[] };
    }

    // Align all dates that exist across the selected symbols
    const allDatesSet = new Set<string>();
    portfolioHistoricalPrices.forEach((s) => s.historical.forEach((p) => allDatesSet.add(p.date)));
    const allDates = Array.from(allDatesSet).sort();

    // Determine timeframe start
    const now = new Date();
    const start = new Date();
    if (selectedTimeframe === '1Y') start.setFullYear(now.getFullYear() - 1);
    if (selectedTimeframe === '3Y') start.setFullYear(now.getFullYear() - 3);
    if (selectedTimeframe === '5Y') start.setFullYear(now.getFullYear() - 5);
    const closestStart = allDates.reduce((closest, curr) => {
      const dCurr = new Date(curr).getTime();
      const dStart = start.getTime();
      const dClosest = new Date(closest).getTime();
      return Math.abs(dCurr - dStart) < Math.abs(dClosest - dStart) ? curr : closest;
    }, allDates[0]);

    const filteredDates = allDates.filter((d) => d >= closestStart);

    // Build portfolio value series (base = 100)
    const normalizedWeights = weights.map((w) => w / 100);
    const values: number[] = [];
    const spySeries: number[] = [];

    // Prepare start prices for normalization
    const startPrices = portfolioHistoricalPrices.map((stock) => stock.historical.find((p) => p.date === closestStart)?.adjClose || null);
    const spyStartPrice = spyData?.historical.find((p) => p.date === closestStart)?.adjClose ?? null;

    filteredDates.forEach((date) => {
      let portfolioValue = 0;
      let hasAll = true;

      portfolioHistoricalPrices.forEach((stock, idx) => {
        const px = stock.historical.find((p) => p.date === date)?.adjClose;
        const startPx = startPrices[idx];
        if (px == null || startPx == null) {
          hasAll = false;
          return;
        }
        // Use notional 100 base
        portfolioValue += 100 * normalizedWeights[idx] * (px / startPx);
      });

      if (hasAll) values.push(portfolioValue);

      if (spyData && spyStartPrice != null) {
        const spyPx = spyData.historical.find((p) => p.date === date)?.adjClose;
        if (spyPx != null) spySeries.push(100 * (spyPx / spyStartPrice));
      }
    });

    return { dates: filteredDates, portfolioValues: values, spyValues: spySeries };
  }, [portfolioHistoricalPrices, weights, selectedTimeframe, spyData]);

  // Determine daily risk-free rate from selection
  const rfDaily = useMemo(() => {
    let annualPct = 0;
    if (rfMode === 'AUTO_TBILL' && tBillAnnualPct != null) annualPct = tBillAnnualPct;
    if (rfMode === 'CUSTOM') annualPct = Number.isFinite(rfCustomAnnualPct) ? rfCustomAnnualPct : 0;
    const annualDecimal = annualPct / 100;
    return Math.pow(1 + annualDecimal, 1 / 252) - 1;
  }, [rfMode, tBillAnnualPct, rfCustomAnnualPct]);

  const rfDisplayText = useMemo(() => {
    if (rfMode === 'ZERO') return '0%';
    if (rfMode === 'AUTO_TBILL') return tBillAnnualPct != null ? `${tBillAnnualPct.toFixed(2)}% · 3M` : '3M T‑Bill…';
    const pct = Number.isFinite(rfCustomAnnualPct) ? rfCustomAnnualPct : 0;
    return `${pct.toFixed(1)}% · Custom`;
  }, [rfMode, tBillAnnualPct, rfCustomAnnualPct]);

  // Wrap computeMetrics to incorporate rf in Sharpe
  const metrics = useMemo(() => {
    if (!portfolioValues.length || !dates.length) return null;
    const bench = spyValues.length === portfolioValues.length ? spyValues : undefined;

    // Recompute sharpe with rfDaily
    // Use computeMetrics then adjust sharpe
    const m = computeMetrics(portfolioValues, dates, bench);
    if (!m) return m;

    // Recalculate Sharpe with rfDaily
    const returns: number[] = [];
    for (let i = 1; i < portfolioValues.length; i++) {
      returns.push(portfolioValues[i] / portfolioValues[i - 1] - 1);
    }
    const excess = returns.map(r => r - rfDaily);
    const mean = excess.reduce((a, b) => a + b, 0) / (excess.length || 1);
    const variance = excess.reduce((acc, r) => acc + Math.pow(r - mean, 2), 0) / Math.max(1, excess.length - 1);
    const stdDev = Math.sqrt(variance);
    const sharpe = stdDev === 0 ? 0 : (mean / stdDev) * Math.sqrt(252);

    return { ...m, sharpeRatio: sharpe } as Metrics;
  }, [portfolioValues, dates, spyValues, rfDaily]);

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        {(['1Y', '3Y', '5Y'] as Timeframe[]).map((tf) => (
          <button key={tf} className={`${styles.button} ${selectedTimeframe === tf ? styles.active : ''}`} onClick={() => setSelectedTimeframe(tf)}>
            {tf}
          </button>
        ))}
      </div>

      {!metrics ? (
        <div className={styles.placeholder}>Insufficient data to compute risk metrics.</div>
      ) : (
        <div className={styles.grid}>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>
              Cumulative Return
              <Tooltip content={"Total portfolio return over the selected period, from start to end value."}>
                <FiInfo className={styles.infoIcon} />
              </Tooltip>
            </div>
            <div className={styles.metricValue}>{formatPercent(metrics.cumulativeReturn * 100)}</div>
            <div className={styles.metricSub}>{new Date(metrics.periodStart).toLocaleDateString()} – {new Date(metrics.periodEnd).toLocaleDateString()}</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>
              Annualized Volatility
              <Tooltip content={"Standard deviation of daily returns scaled by √252 to annualize."}>
                <FiInfo className={styles.infoIcon} />
              </Tooltip>
            </div>
            <div className={styles.metricValue}>{formatPercent(metrics.annualizedVolatility * 100)}</div>
            <div className={styles.metricSub}>Daily std dev × √252</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>
              Sharpe Ratio
              <Tooltip content={"Risk-adjusted return: average excess daily return divided by daily volatility, annualized."}>
                <FiInfo className={styles.infoIcon} />
              </Tooltip>
            </div>
            <div className={styles.metricValue}>{formatNumber(metrics.sharpeRatio)}</div>
            <div className={styles.metricSub}>
              <span className={styles.rfLabel}>RF:</span>
              <div className={styles.rfControl} ref={rfRef}>
                <button className={styles.link} onClick={() => setIsRfOpen(v => !v)}>{rfDisplayText}</button>
                {isRfOpen && (
                  <div className={styles.popover}>
                    <button className={styles.popItem} onClick={() => { setRfMode('ZERO'); setIsRfOpen(false); }}>0% (None)</button>
                    <button className={styles.popItem} onClick={() => { setRfMode('AUTO_TBILL'); setIsRfOpen(false); }}>Auto: 3M T‑Bill</button>
                    <div className={styles.popRow}>
                      <label htmlFor="rfCustom" className={styles.popLabel}>Custom</label>
                      <input id="rfCustom" type="number" step="0.1" className={styles.popInput} value={Number.isFinite(rfCustomAnnualPct) ? rfCustomAnnualPct : 0}
                        onChange={(e) => { const v = Number(e.target.value); setRfCustomAnnualPct(Number.isFinite(v) ? v : 0); setRfMode('CUSTOM'); }}
                        onBlur={() => setRfMode('CUSTOM')}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>
              Max Drawdown
              <Tooltip content={"Largest peak-to-trough decline during the selected period (as a percentage)."}>
                <FiInfo className={styles.infoIcon} />
              </Tooltip>
            </div>
            <div className={styles.metricValue}>{formatPercent(metrics.maxDrawdown * 100)}</div>
            <div className={styles.metricSub}>Peak-to-trough</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>
              Beta vs S&P 500
              <Tooltip content={"Sensitivity to S&P 500 movements: Cov(portfolio, SPY) / Var(SPY) using daily returns."}>
                <FiInfo className={styles.infoIcon} />
              </Tooltip>
            </div>
            <div className={styles.metricValue}>{metrics.betaToSPY == null ? '—' : formatNumber(metrics.betaToSPY)}</div>
            <div className={styles.metricSub}>Cov(port, SPY) / Var(SPY)</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>
              1-Day VaR (95%)
              <Tooltip content={"Estimated worst expected daily loss at 95% confidence (historical simulation)."}>
                <FiInfo className={styles.infoIcon} />
              </Tooltip>
            </div>
            <div className={styles.metricValue}>{formatPercent(metrics.oneDayVaR95 * 100)}</div>
            <div className={styles.metricSub}>Historical simulation</div>
          </div>
        </div>
      )}
    </div>
  );
}


