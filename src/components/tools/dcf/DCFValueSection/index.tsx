import React, { useMemo, useCallback, useState } from 'react';
import Image from 'next/image';
import styles from './styles.module.css';
import { calculateValuations, calculateGrowthRate } from '@/components/dashboard/Overview/IntrinsicValueOverview/calculations';
import type { 
  HistoricalIncomeStatement, 
  HistoricalCashFlowStatement, 
  HistoricalBalanceSheetStatement 
} from '@/types/financials';
import type { CompanyProfile } from '@/types/company';
import { DCFAssumptionsModal } from './modals';
type CaseScenario = 'worst' | 'base' | 'best';

interface DCFValueSectionProps {
  symbol: string;
  marketPrice: number;
  isLoading: boolean;
  caseScenario: CaseScenario;
  onCaseScenarioChange: (scenario: CaseScenario) => void;
  exchange?: string;
  // Financial data
  incomeStatement?: HistoricalIncomeStatement;
  cashFlowStatement?: HistoricalCashFlowStatement;
  balanceSheetStatement?: HistoricalBalanceSheetStatement;
  profile?: CompanyProfile;
  marketCap?: number;
  sharesOutstanding?: number;
  ratios?: any;
  assumptions: {
    key: string;
    value: string;
  }[];
  // DCF parameters
  forecastPeriod?: number;
  discountRate?: number;
  terminalGrowth?: number;
  exitMultiple?: number;
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function formatPercentage(value: number) {
  return `${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
}

function getScenarioAdjustment(scenario: CaseScenario): number {
  switch (scenario) {
    case 'worst':
      return 0.8; // 20% reduction for worst case
    case 'best':
      return 1.2; // 20% increase for best case
    default:
      return 1; // No adjustment for base case
  }
}

export default function DCFValueSection({ 
  symbol, 
  marketPrice, 
  isLoading,
  caseScenario,
  onCaseScenarioChange,
  exchange = 'NASDAQ',
  incomeStatement,
  cashFlowStatement,
  balanceSheetStatement,
  profile,
  marketCap = 0,
  sharesOutstanding = 0,
  ratios,
  assumptions,
  forecastPeriod,
  discountRate,
  terminalGrowth,
  exitMultiple
}: DCFValueSectionProps) {
  const [isDCFAssumptionsModalOpen, setIsDCFAssumptionsModalOpen] = useState(false);
  const handleScenarioChange = useCallback((scenario: CaseScenario) => {
    onCaseScenarioChange(scenario);
  }, [onCaseScenarioChange]);

  const valuations = useMemo(() => {
    if (!incomeStatement || !cashFlowStatement || !balanceSheetStatement) {
      return null;
    }

    const baseValuations = calculateValuations(
      incomeStatement,
      cashFlowStatement,
      balanceSheetStatement,
      sharesOutstanding,
      marketPrice,
      marketCap,
      profile,
      ratios,
      terminalGrowth || 0.02,
      forecastPeriod || 5,
      discountRate
    );

    if (!baseValuations) return null;

    const adjustment = getScenarioAdjustment(caseScenario);
    return {
      ...baseValuations,
      dcf: {
        value: baseValuations.dcf.value * adjustment,
        margin: ((baseValuations.dcf.value * adjustment - marketPrice) / (baseValuations.dcf.value * adjustment)) * 100
      }
    };
  }, [
    incomeStatement,
    cashFlowStatement,
    balanceSheetStatement,
    sharesOutstanding,
    marketPrice,
    marketCap,
    profile,
    ratios,
    caseScenario,
    terminalGrowth,
    forecastPeriod,
    discountRate,
    exitMultiple
  ]);

  const isLoadingState = isLoading || !valuations;
  const dcfValue = valuations?.dcf.value || 0;
  const undervaluedPercent = valuations?.dcf.margin || 0;
  const isUndervalued = undervaluedPercent > 0;

  if (isLoadingState) {
    return (
      <div className={styles.container}>
        <div className={styles.topSection}>
          <div className={styles.leftSection}>
            <div className={styles.companyInfo}>
              <div className={styles.symbolSection}>
                <div className={styles.logoContainer}>
                  <div className={`${styles.logo} ${styles.pulse}`} />
                </div>
                <div className={styles.stockSymbol}>
                  <span className={`${styles.symbol} ${styles.pulse}`} style={{ width: '80px' }} />
                  <span className={`${styles.exchange} ${styles.pulse}`} style={{ width: '60px' }} />
                </div>
              </div>
              <p className={styles.valuationSummary}>
                <span className={styles.pulse} style={{ width: '100%', height: '24px' }} />
              </p>
            </div>
            <div className={styles.faq}>
              <ul>
                <li><span className={styles.pulse} style={{ width: '120px', height: '16px' }} /></li>
                <li><span className={styles.pulse} style={{ width: '150px', height: '16px' }} /></li>
                <li><span className={styles.pulse} style={{ width: '140px', height: '16px' }} /></li>
              </ul>
            </div>
          </div>
          <div className={styles.rightSection}>
            <div className={styles.valueHeader}>
              <h2 className={`${styles.valueTitle} ${styles.pulse}`} style={{ width: '120px' }} />
              <p className={`${styles.caseLabel} ${styles.pulse}`} style={{ width: '80px' }} />
            </div>
            <div className={`${styles.dcfValueLarge} ${styles.pulse}`} style={{ width: '200px', height: '48px' }} />
            <div className={styles.comparisonBars}>
              <div className={styles.barContainer}>
                <div className={`${styles.dcfBar} ${styles.pulse}`} style={{ width: '100%' }} />
              </div>
              <div className={styles.barContainer}>
                <div className={`${styles.priceBar} ${styles.pulse}`} style={{ width: '100%' }} />
              </div>
            </div>
            <div className={`${styles.valuationTag} ${styles.pulse}`} style={{ width: '180px', height: '32px' }} />
          </div>
        </div>

        <div className={styles.scenarioSelector}>
          <div className={styles.scenarioTrack}>
            <div className={`${styles.scenarioSlider} ${styles.pulse}`} />
            <button className={`${styles.scenarioOption} ${styles.pulse}`} style={{ width: '100px' }} />
            <button className={`${styles.scenarioOption} ${styles.pulse}`} style={{ width: '100px' }} />
            <button className={`${styles.scenarioOption} ${styles.pulse}`} style={{ width: '100px' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {isDCFAssumptionsModalOpen && <DCFAssumptionsModal isOpen={isDCFAssumptionsModalOpen} onClose={() => setIsDCFAssumptionsModalOpen(false)} assumptions={assumptions} />}
      <div className={styles.topSection}>
        <div className={styles.leftSection}>
          <div className={styles.companyInfo}>
            <div className={styles.symbolSection}>
              <div className={styles.logoContainer}>
                <Image
                  src={`https://assets.letmedemo.com/public/fundamental/icons/companies/${symbol.replace('.', '')}.png`}
                  alt={`${symbol} logo`}
                  width={48}
                  height={48}
                  className={styles.logo}
                  onError={(e) => {
                    e.currentTarget.src = `https://storage.googleapis.com/iex/api/logos/${symbol}.png`;
                    e.currentTarget.onerror = () => {
                      e.currentTarget.style.display = 'none';
                    };
                  }}
                  unoptimized
                />
              </div>
              <div className={styles.stockSymbol}>
                <span className={styles.symbol}>{symbol}</span> <span className={styles.exchange}>{`| ${exchange}`}</span>
              </div>
            </div>
            <p className={styles.valuationSummary}>
              Estimated DCF Value of one <span className={styles.valuationValue}>{symbol}</span> stock is <span className={styles.valuationValue}>{formatCurrency(dcfValue)}</span>.
              Compared to the current market price of <span className={styles.valuationValue}>{formatCurrency(marketPrice)}</span>,
              the stock is <span className={`${styles.valuationStatus} ${isUndervalued ? styles.undervalued : styles.overvalued}`}>
                {isUndervalued ? 'Undervalued' : 'Overvalued'} by {formatPercentage(Math.abs(undervaluedPercent))}
              </span>.
            </p>
          </div>
          <div className={styles.faq}>
            <ul>
              <li><a href="#" onClick={() => setIsDCFAssumptionsModalOpen(true)}>What are the assumptions?</a></li>
            </ul>
          </div>
        </div>
        <div className={styles.rightSection}>
          <div className={styles.valueHeader}>
            <h2 className={styles.valueTitle}>{symbol} DCF Value</h2>
            <p className={styles.caseLabel}>{caseScenario.charAt(0).toUpperCase() + caseScenario.slice(1)} Case</p>
          </div>
          <div className={styles.dcfValueLarge}>{formatCurrency(dcfValue)}</div>
          <div className={styles.comparisonBars}>
            <div className={styles.barContainer}>
              <div 
                className={styles.dcfBar}
                style={{
                  width: `${(dcfValue / marketPrice) * 100}%`
                }}
              >
                <span className={styles.barLabel}>
                  DCF Value
                  <span className={styles.barValue}>{formatCurrency(dcfValue)}</span>
                </span>
              </div>
            </div>
            <div className={styles.barContainer}>
              <div 
                className={styles.priceBar} 
                style={{ 
                  width: `${(marketPrice / dcfValue) * 100}%`
                }}
              >
                <span className={styles.barLabel}>
                  Price
                  <span className={styles.barValue}>{formatCurrency(marketPrice)}</span>
                </span>
              </div>
            </div>
          </div>
          <div className={`${styles.valuationTag} ${!isUndervalued ? styles.overvalued : ''}`}>
            {isUndervalued ? 'UNDERVALUATION' : 'OVERVALUATION'} {formatPercentage(Math.abs(undervaluedPercent))}
          </div>
        </div>
      </div>

      <div className={styles.scenarioSelector}>
        <div className={styles.scenarioTrack}>
          <div 
            className={styles.scenarioSlider} 
            data-position={caseScenario}
          />
          <button
            className={`${styles.scenarioOption} ${caseScenario === 'worst' ? styles.active : ''}`}
            onClick={() => handleScenarioChange('worst')}
          >
            Worst Case
          </button>
          <button
            className={`${styles.scenarioOption} ${caseScenario === 'base' ? styles.active : ''}`}
            onClick={() => handleScenarioChange('base')}
          >
            Base Case
          </button>
          <button
            className={`${styles.scenarioOption} ${caseScenario === 'best' ? styles.active : ''}`}
            onClick={() => handleScenarioChange('best')}
          >
            Best Case
          </button>
        </div>
      </div>
    </div>
  );
} 