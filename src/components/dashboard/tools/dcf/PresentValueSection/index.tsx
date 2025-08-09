import React, { useMemo } from 'react';
import styles from './styles.module.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from 'recharts';
import type {
  HistoricalIncomeStatement,
  HistoricalCashFlowStatement,
  HistoricalBalanceSheetStatement
} from '@/types/financials';
import { calculateFCFEValuation, calculateEPSValuation } from '@/src/lib/valuation/valuations';
import ModelSelector from './ModelSelector';
import type { OperatingModel } from './types';
import { dcfConfig } from '@/src/app/(main)/tools/dcf/config';
import InfoTooltip from '@/components/common/Tooltip';
import { FiInfo } from 'react-icons/fi';
import { tooltipText } from '@/components/common/Tooltip/dictionary';

interface PresentValueSectionProps {
  isLoading: boolean;

  incomeStatement?: HistoricalIncomeStatement;
  cashFlowStatement?: HistoricalCashFlowStatement;
  balanceSheetStatement?: HistoricalBalanceSheetStatement;
  sharesOutstanding?: number;

  forecastPeriod?: number;
  discountRate?: number;
  terminalGrowth?: number;
  operatingModel?: OperatingModel;
  onOperatingModelChange?: (model: OperatingModel) => void;
  onForecastPeriodChange?: (period: number) => void;
  onDiscountRateChange?: (rate: number) => void;
  onTerminalGrowthChange?: (growth: number) => void;
  exitMultiple?: number;
  onExitMultipleChange?: (multiple: number) => void;
  fcfeGrowthRate?: number;
  onFcfeGrowthRateChange?: (rate: number) => void;
  epsGrowthRate?: number;
  onEpsGrowthRateChange?: (rate: number) => void;
}

function formatLargeNumber(value: number | undefined | null) {
  if (value === undefined || value === null) return '';
  if (Math.abs(value) >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  } else if (Math.abs(value) >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  }
  return value.toFixed(2);
}

export default function PresentValueSection({
  isLoading,
  incomeStatement,
  cashFlowStatement,
  balanceSheetStatement,
  sharesOutstanding = 0,
  forecastPeriod = 5,
  discountRate = dcfConfig.discountRate,
  terminalGrowth = dcfConfig.terminalGrowth,
  operatingModel = 'FCFE',
  exitMultiple = dcfConfig.exitMultiple,
  onOperatingModelChange,
  onForecastPeriodChange,
  onDiscountRateChange,
  onTerminalGrowthChange,
  onExitMultipleChange,
  fcfeGrowthRate = dcfConfig.fcfeDefaultGrowthRate,
  onFcfeGrowthRateChange,
  epsGrowthRate = dcfConfig.epsDefaultGrowthRate,
  onEpsGrowthRateChange
}: PresentValueSectionProps) {

  // Calculate FCFE inputs from financial statements
  const fcfeInputs = useMemo(() => {
    if (!incomeStatement?.data?.[0] || !cashFlowStatement?.data?.[0] || !balanceSheetStatement?.data?.[0]) {
      return null;
    }

    const latestIncome = incomeStatement.data[0];
    const latestCashFlow = cashFlowStatement.data[0];
    const latestBalance = balanceSheetStatement.data[0];

    // Calculate change in NWC
    const prevBalance = balanceSheetStatement.data[1];
    const changeInNWC = (
      (latestBalance.totalCurrentAssets - latestBalance.totalCurrentLiabilities) -
      (prevBalance.totalCurrentAssets - prevBalance.totalCurrentLiabilities)
    );

    return {
      netIncome: latestIncome.netIncome || 0,
      depreciation: latestCashFlow.depreciationAndAmortization || 0,
      capEx: latestCashFlow.capitalExpenditure || 0,
      changeInNWC,
      netBorrowing: 0, // Default to 0, can be adjusted by user
      growthRate: fcfeGrowthRate,
      discountRate: discountRate / 100,
      terminalGrowthRate: terminalGrowth,
      forecastPeriod
    };
  }, [incomeStatement, cashFlowStatement, balanceSheetStatement, forecastPeriod, discountRate, terminalGrowth, fcfeGrowthRate]);

  // Calculate EPS inputs from financial statements
  const epsInputs = useMemo(() => {
    if (!incomeStatement?.data?.[0] || !sharesOutstanding) {
      return null;
    }

    const latestIncome = incomeStatement.data[0];
    const eps = (latestIncome.netIncome || 0) / sharesOutstanding;

    return {
      eps,
      growthRate: epsGrowthRate,
      discountRate: discountRate / 100,
      forecastPeriod,
      exitMultiple
    };
  }, [incomeStatement, sharesOutstanding, forecastPeriod, discountRate, exitMultiple, epsGrowthRate]);

  // Calculate projected values for both models
  const projectedValues = useMemo(() => {
    const years = Array.from({ length: forecastPeriod + 1 }, (_, i) => i);
    const data = [];

    if (operatingModel === 'FCFE' && fcfeInputs) {
      const { presentValue, terminalValue } = calculateFCFEValuation(fcfeInputs);
      const totalValue = presentValue + terminalValue;
      const perShareValue = totalValue / sharesOutstanding;

      let currentFCFE = fcfeInputs.netIncome + fcfeInputs.depreciation - fcfeInputs.capEx - fcfeInputs.changeInNWC + fcfeInputs.netBorrowing;
      
      for (let year of years) {
        if (year === 0) {
          data.push({
            year: 'Current',
            value: currentFCFE / sharesOutstanding
          });
        } else {
          currentFCFE *= (1 + fcfeInputs.growthRate);
          data.push({
            year: `Year ${year}`,
            value: currentFCFE / sharesOutstanding
          });
        }
      }
    } else if (operatingModel === 'EPS' && epsInputs) {
      const { presentValue, terminalValue } = calculateEPSValuation(epsInputs);
      const totalValue = presentValue + terminalValue;
      const perShareValue = totalValue;

      let currentEPS = epsInputs.eps;
      
      for (let year of years) {
        if (year === 0) {
          data.push({
            year: 'Current',
            value: currentEPS
          });
        } else {
          currentEPS *= (1 + epsInputs.growthRate);
          data.push({
            year: `Year ${year}`,
            value: currentEPS
          });
        }
      }
    }

    return data;
  }, [operatingModel, fcfeInputs, epsInputs, forecastPeriod, sharesOutstanding]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading DCF data...</div>
      </div>
    );
  }

  if (!incomeStatement || !cashFlowStatement || !balanceSheetStatement) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Missing required financial data for DCF calculation</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>PRESENT VALUE CALCULATION</h2>

      <div className={styles.description}>
        This block calculates the present value of a company's forecasted cash flows based on the selected operating model.
        Choose between Free Cash Flow to Equity (FCFE) or EPS Growth models, and adjust key parameters to see their impact on valuation.
      </div>

      <div className={styles.modelCard}>
        <div className={styles.modelHeader}>
          <h3>DCF Model</h3>
          <p>Base Case Scenario</p>
        </div>

        <div className={styles.controls}>
          <ModelSelector
            operatingModel={operatingModel}
            onOperatingModelChange={onOperatingModelChange ?? (() => {})}
          />

          <div className={styles.inputsGrid}>
            <div className={styles.fixedInputs}>
              <h4>Historical Inputs</h4>
              {operatingModel === 'FCFE' ? (
                <>
                  <div className={styles.inputRow}>
                    <label>
                      Net Income
                      <InfoTooltip content={tooltipText.dcf.netIncome}>
                        <FiInfo className={styles.infoIcon} />
                      </InfoTooltip>
                    </label>
                    <span className={styles.value}>{formatLargeNumber(fcfeInputs?.netIncome)}</span>
                  </div>
                  <div className={styles.inputRow}>
                    <label>
                      Depreciation
                      <InfoTooltip content={tooltipText.dcf.depreciation}>
                        <FiInfo className={styles.infoIcon} />
                      </InfoTooltip>
                    </label>
                    <span className={styles.value}>{formatLargeNumber(fcfeInputs?.depreciation)}</span>
                  </div>
                  <div className={styles.inputRow}>
                    <label>
                      Capital Expenditure
                      <InfoTooltip content={tooltipText.dcf.capitalExpenditure}>
                        <FiInfo className={styles.infoIcon} />
                      </InfoTooltip>
                    </label>
                    <span className={styles.value}>{formatLargeNumber(fcfeInputs?.capEx)}</span>
                  </div>
                  <div className={styles.inputRow}>
                    <label>
                      Change in NWC
                      <InfoTooltip content={tooltipText.dcf.changeInNwc}>
                        <FiInfo className={styles.infoIcon} />
                      </InfoTooltip>
                    </label>
                    <span className={styles.value}>{formatLargeNumber(fcfeInputs?.changeInNWC)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.inputRow}>
                    <label>
                      Current EPS
                      <InfoTooltip content={tooltipText.dcf.currentEps}>
                        <FiInfo className={styles.infoIcon} />
                      </InfoTooltip>
                    </label>
                    <span className={styles.value}>{formatLargeNumber(epsInputs?.eps)}</span>
                  </div>
                  <div className={styles.inputRow}>
                    <label>
                      Shares Outstanding
                      <InfoTooltip content={tooltipText.dcf.sharesOutstanding}>
                        <FiInfo className={styles.infoIcon} />
                      </InfoTooltip>
                    </label>
                    <span className={styles.value}>{formatLargeNumber(sharesOutstanding)}</span>
                  </div>
                </>
              )}
            </div>

            <div className={styles.adjustableInputs}>
              <h4>Adjustable Inputs</h4>
              <div className={styles.sliderGroup}>
                <div className={styles.sliderControl}>
                  <label>
                    Forecast Period
                    <InfoTooltip content={tooltipText.dcf.forecastPeriod}>
                      <FiInfo className={styles.infoIcon} />
                    </InfoTooltip>
                  </label>
                  <div className={styles.inputGroup}>
                    <input
                      type="range"
                      min="3"
                      max="10"
                      value={forecastPeriod}
                      onChange={(e) => onForecastPeriodChange?.(Number(e.target.value))}
                    />
                    <input
                      type="number"
                      min="3"
                      max="10"
                      value={forecastPeriod}
                      onChange={(e) => onForecastPeriodChange?.(Number(e.target.value))}
                      className={styles.numberInput}
                    />
                    <span className={styles.unitLabel}>Years</span>
                  </div>
                </div>

                <div className={styles.sliderControl}>
                  <label>
                    Discount Rate
                    <InfoTooltip content={tooltipText.dcf.discountRate}>
                      <FiInfo className={styles.infoIcon} />
                    </InfoTooltip>
                  </label>
                  <div className={styles.inputGroup}>
                    <input
                      type="range"
                      min="0"
                      max="20"
                      step="0.05"
                      value={discountRate}
                      onChange={(e) => onDiscountRateChange?.(Number(e.target.value))}
                    />
                    <input
                      type="number"
                      min="0"
                      max="20"
                      step="0.05"
                      value={discountRate}
                      onChange={(e) => onDiscountRateChange?.(Number(e.target.value))}
                      className={styles.numberInput}
                    />
                    <span className={styles.unitLabel}>%</span>
                  </div>
                </div>

                {operatingModel === 'FCFE' ? (
                  <div className={styles.sliderControl}>
                    <label>
                      FCFE Growth Rate
                      <InfoTooltip content={tooltipText.dcf.fcfeGrowthRate}>
                        <FiInfo className={styles.infoIcon} />
                      </InfoTooltip>
                    </label>
                    <div className={styles.inputGroup}>
                      <input
                        type="range"
                        min="0"
                        max="0.30"
                        step="0.005"
                        value={fcfeGrowthRate}
                        onChange={(e) => onFcfeGrowthRateChange?.(Number(e.target.value))}
                      />
                      <input
                        type="number"
                        min="0"
                        max="30"
                        step="0.25"
                        value={Number(fcfeGrowthRate * 100).toFixed(2)}
                        onChange={(e) => onFcfeGrowthRateChange?.(Number(e.target.value) / 100)}
                        className={styles.numberInput}
                      />
                      <span className={styles.unitLabel}>%</span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.sliderControl}>
                    <label>
                      EPS Growth Rate
                      <InfoTooltip content={tooltipText.dcf.epsGrowthRate}>
                        <FiInfo className={styles.infoIcon} />
                      </InfoTooltip>
                    </label>
                    <div className={styles.inputGroup}>
                      <input
                        type="range"
                        min="0"
                        max="0.30"
                        step="0.005"
                        value={epsGrowthRate}
                        onChange={(e) => onEpsGrowthRateChange?.(Number(e.target.value))}
                      />
                      <input
                        type="number"
                        min="0"
                        max="30"
                        step="0.25"
                        value={Number(epsGrowthRate * 100).toFixed(2)}
                        onChange={(e) => onEpsGrowthRateChange?.(Number(e.target.value) / 100)}
                        className={styles.numberInput}
                      />
                      <span className={styles.unitLabel}>%</span>
                    </div>
                  </div>
                )}

                {operatingModel === 'FCFE' ? (
                  <div className={styles.sliderControl}>
                    <label>
                      Terminal Growth
                      <InfoTooltip content={tooltipText.dcf.terminalGrowth}>
                        <FiInfo className={styles.infoIcon} />
                      </InfoTooltip>
                    </label>
                    <div className={styles.inputGroup}>
                      <input
                        type="range"
                        min="0"
                        max="0.03"
                        step="0.0005"
                        value={terminalGrowth}
                        onChange={(e) => onTerminalGrowthChange?.(Number(e.target.value))}
                      />
                      <input
                        type="number"
                        min="0"
                        max="3"
                        step="0.05"
                        value={Number(terminalGrowth * 100).toFixed(2)}
                        onChange={(e) => onTerminalGrowthChange?.(Number(e.target.value) / 100)}
                        className={styles.numberInput}
                      />
                      <span className={styles.unitLabel}>%</span>
                    </div>
                  </div>
                ) : (
                  <div className={styles.sliderControl}>
                    <label>
                      Exit Multiple
                      <InfoTooltip content={tooltipText.dcf.exitMultiple}>
                        <FiInfo className={styles.infoIcon} />
                      </InfoTooltip>
                    </label>
                    <div className={styles.inputGroup}>
                      <input
                        type="range"
                        min="5"
                        max="40"
                        step="0.5"
                        value={exitMultiple}
                        onChange={(e) => onExitMultipleChange?.(Number(e.target.value))}
                      />
                      <input
                        type="number"
                        min="5"
                        max="40"
                        step="0.5"
                        value={Number(exitMultiple)}
                        onChange={(e) => onExitMultipleChange?.(Number(e.target.value))}
                        className={styles.numberInput}
                      />
                      <span className={styles.unitLabel}>P/E</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.chartContainer}>
            <h4>{operatingModel === 'FCFE' ? 'FCFE per Share' : 'EPS'} Projection</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={projectedValues}>
                <CartesianGrid horizontal={true} vertical={false} stroke={"#f0f0f0"} />
                <XAxis dataKey="year" />
                <YAxis
                  orientation="right"
                  tickFormatter={(value) => formatLargeNumber(value)}
                />
                <RechartsTooltip
                  formatter={(value: number) => [`$${value.toFixed(2)}`, operatingModel === 'FCFE' ? 'FCFE per Share' : 'EPS']}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 