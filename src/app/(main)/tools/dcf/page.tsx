'use client';

import { useState, useEffect, Suspense, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './styles.module.css';
import StockSearchBar from '@/components/dashboard/research/valuation/StockSearchBar';
import { fetchValuationData } from '@/src/lib/fetchValuationData';
import { SelectedCompany } from '@/app/(main)/research/valuation/types';
import DCFValueSection from '@/src/components/dashboard/tools/dcf/DCFValueSection';
import PresentValueSection from '@/src/components/dashboard/tools/dcf/PresentValueSection';
import FloatingDCFValue from '@/src/components/dashboard/tools/dcf/FloatingDCFValue';
import { calculateGrowthRate, calculateValuations } from '@/components/dashboard/research/valuation/Overview/IntrinsicValueOverview/calculations';
import { dcfConfig } from './config';
type CaseScenarioType = 'worst' | 'base' | 'best';

interface DCFAssumption {
  key: string;
  value: string;
  baseValue?: number;
  adjustment?: number;
}

interface ExtendedSelectedCompany extends SelectedCompany {
  dcfValue: number;
  presentValue: number;
  equityValue: number;
  undervaluedPercent: number;
  profile?: {
    beta?: number;
  };
}

export default function DCFPage() {
  const searchParams = useSearchParams();
  const [symbol, setSymbol] = useState<string | null>(searchParams.get('symbol'));
  const [selectedCompany, setSelectedCompany] = useState<ExtendedSelectedCompany | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [caseScenarioType, setCaseScenarioType] = useState<CaseScenarioType>('base');
  const [isFloatingValueVisible, setIsFloatingValueVisible] = useState(false);
  const dcfSectionRef = useRef<HTMLDivElement>(null);

  // Add state for DCF parameters
  const [dcfParameters, setDcfParameters] = useState({
    forecastPeriod: dcfConfig.forecastPeriod,
    discountRate: dcfConfig.discountRate,
    terminalGrowth: dcfConfig.terminalGrowth,
    operatingModel: dcfConfig.operatingModel,
    exitMultiple: dcfConfig.exitMultiple
  });

  const fetchCompanyData = useCallback(() => {
    if (!symbol) return;

    setIsLoading(true);
    const initialCompany: ExtendedSelectedCompany = {
      symbol,
      name: '',
      assetType: 'STOCK',
      exchange: undefined,
      quote: undefined,
      events: undefined,
      outlook: undefined,
      historicalPrice: undefined,
      historicalShares: undefined,
      dividendHistory: undefined,
      incomeStatement: undefined,
      cashFlowStatement: undefined,
      balanceSheetStatement: undefined,
      revenueBySegment: undefined,
      revenueByGeography: undefined,
      dcfValue: 0,
      presentValue: 0,
      equityValue: 0,
      undervaluedPercent: 0
    };

    setSelectedCompany(initialCompany);

    const updateCompanyData = (key: keyof ExtendedSelectedCompany) => (data: any) => {
      setSelectedCompany(prev => prev ? { ...prev, [key]: data } : null);
    };

    const handleError = (key: keyof ExtendedSelectedCompany, defaultValue?: any) => (error: any) => {
      console.error(`Failed to fetch ${key}:`, error);
      if (defaultValue) {
        setSelectedCompany(prev => prev ? { ...prev, [key]: defaultValue } : null);
      }
    };

    try {
      // Fetch all required data in parallel
      fetchValuationData('company/income', symbol,
        updateCompanyData('incomeStatement'),
        handleError('incomeStatement')
      );

      fetchValuationData('company/cash-flow', symbol,
        updateCompanyData('cashFlowStatement'),
        handleError('cashFlowStatement')
      );

      fetchValuationData('company/balance-sheet', symbol,
        updateCompanyData('balanceSheetStatement'),
        handleError('balanceSheetStatement')
      );

      fetchValuationData('stock/quote', symbol,
        updateCompanyData('quote'),
        handleError('quote')
      );

      fetchValuationData('company/outlook', symbol,
        updateCompanyData('outlook'),
        handleError('outlook')
      );

    } catch (error) {
      console.error('Error in fetchCompanyData:', error);
    } finally {
      setIsLoading(false);
    }
  }, [symbol]);

  const calculateAssumptions = useCallback(() => {
    if (!selectedCompany?.incomeStatement?.data?.[0] ||
      !selectedCompany?.cashFlowStatement?.data?.[0] ||
      !selectedCompany?.balanceSheetStatement?.data?.[0]) {
      return [];
    }

    const latest = {
      income: selectedCompany.incomeStatement.data[0],
      cashFlow: selectedCompany.cashFlowStatement.data[0],
      balance: selectedCompany.balanceSheetStatement.data[0]
    };

    const quarterlyFcfValues = selectedCompany.cashFlowStatement.data.map(d => d.freeCashFlow || 0);
    const baseFcfGrowthRate = calculateGrowthRate(quarterlyFcfValues);
    const baseEarningsGrowthRate = calculateGrowthRate(
      selectedCompany.incomeStatement.data.map(d => d.netIncome || 0)
    );

    // Apply scenario adjustments to growth rates
    const getGrowthRateAdjustment = (scenario: CaseScenarioType) => {
      switch (scenario) {
        case 'worst':
          return dcfConfig.worstCaseFactor; // 20% reduction
        case 'best':
          return dcfConfig.bestCaseFactor; // 20% increase
        default:
          return 1; // No adjustment
      }
    };

    const growthRateAdjustment = getGrowthRateAdjustment(caseScenarioType);
    const adjustedFcfGrowthRate = baseFcfGrowthRate * growthRateAdjustment;
    const adjustedEarningsGrowthRate = baseEarningsGrowthRate * growthRateAdjustment;

    const taxRate = latest.income.incomeTaxExpense && latest.income.incomeBeforeTax && latest.income.incomeTaxExpense > 0
      ? latest.income.incomeTaxExpense / latest.income.incomeBeforeTax
      : dcfConfig.taxRate;

    const beta = selectedCompany.profile?.beta
      ? dcfConfig.riskFreeRate + (selectedCompany.profile.beta * dcfConfig.marketRiskPremium)
      : dcfConfig.riskFreeRate + dcfConfig.marketRiskPremium;

    return [
      {
        key: 'Free Cash Flow Growth Rate',
        value: `${(adjustedFcfGrowthRate * 100).toFixed(2)}%`,
        baseValue: baseFcfGrowthRate,
        adjustment: growthRateAdjustment
      },
      {
        key: 'Earnings Growth Rate',
        value: `${(adjustedEarningsGrowthRate * 100).toFixed(2)}%`,
        baseValue: baseEarningsGrowthRate,
        adjustment: growthRateAdjustment
      },
      {
        key: 'Tax Rate',
        value: `${(taxRate * 100).toFixed(2)}%`
      },
      {
        key: 'Cost of Equity (Beta)',
        value: `${(beta * 100).toFixed(2)}%`
      },
      {
        key: 'Terminal Growth Rate',
        value: `${(dcfParameters.terminalGrowth * 100).toFixed(2)}%`,
        isEditable: true,
        onValueChange: (newValue: number) => {
          setDcfParameters(prev => ({ ...prev, terminalGrowth: newValue / 100 }));
        }
      },
      {
        key: 'Projection Period',
        value: `${dcfParameters.forecastPeriod} years`,
        isEditable: true,
        onValueChange: (newValue: number) => {
          setDcfParameters(prev => ({ ...prev, forecastPeriod: newValue }));
        }
      },
      {
        key: 'Discount Rate',
        value: `${dcfParameters.discountRate.toFixed(2)}%`,
        isEditable: true,
        onValueChange: (newValue: number) => {
          setDcfParameters(prev => ({ ...prev, discountRate: newValue }));
        }
      },
      {
        key: 'Beta',
        value: selectedCompany.profile?.beta ? selectedCompany.profile.beta.toFixed(2) : '1.00'
      },
      {
        key: 'Risk-Free Rate',
        value: `${Number(dcfConfig.riskFreeRate * 100).toFixed(2)}%`
      },
      {
        key: 'Market Risk Premium',
        value: `${Number(dcfConfig.marketRiskPremium * 100).toFixed(2)}%`
      },
      {
        key: 'Exit Multiple',
        value: `${dcfParameters.exitMultiple} P/E`,
        isEditable: true,
        onValueChange: (newValue: number) => {
          setDcfParameters(prev => ({ ...prev, exitMultiple: newValue }));
        }
      }
    ];
  }, [selectedCompany, caseScenarioType, dcfParameters]);

  const assumptions = useMemo<DCFAssumption[]>(() => {
    return calculateAssumptions();
  }, [selectedCompany, caseScenarioType, dcfParameters]);

  const dcfValue = useMemo(() => {
    if (!selectedCompany?.incomeStatement?.data?.[0] ||
      !selectedCompany?.cashFlowStatement?.data?.[0] ||
      !selectedCompany?.balanceSheetStatement?.data?.[0] ||
      !selectedCompany?.quote?.sharesOutstanding) {
      return 0;
    }

    const baseValuations = calculateValuations(
      selectedCompany.incomeStatement,
      selectedCompany.cashFlowStatement,
      selectedCompany.balanceSheetStatement,
      selectedCompany.quote.sharesOutstanding,
      selectedCompany.quote.price || 0,
      selectedCompany.quote.marketCap || 0,
      selectedCompany.outlook?.profile,
      selectedCompany.outlook?.ratios,
      dcfParameters.terminalGrowth,
      dcfParameters.forecastPeriod,
      dcfParameters.discountRate,
      dcfParameters.exitMultiple
    );

    if (!baseValuations) return 0;

    const adjustment = caseScenarioType === 'worst' ? dcfConfig.worstCaseFactor : caseScenarioType === 'best' ? dcfConfig.bestCaseFactor : 1;
    const value = baseValuations.dcf.value * adjustment;
    return value;
  }, [selectedCompany, caseScenarioType, dcfParameters]);

  const undervaluedPercent = useMemo(() => {
    if (!selectedCompany?.quote?.price || !dcfValue) return 0;
    const percent = ((dcfValue - selectedCompany.quote.price) / dcfValue) * 100;
    return percent;
  }, [selectedCompany?.quote?.price, dcfValue]);

  // Update selectedCompany only when financial data changes
  useEffect(() => {
    if (selectedCompany &&
      selectedCompany.incomeStatement?.data?.[0] &&
      selectedCompany.cashFlowStatement?.data?.[0] &&
      selectedCompany.balanceSheetStatement?.data?.[0] &&
      selectedCompany.quote?.sharesOutstanding) {
      setSelectedCompany(prev => prev ? {
        ...prev,
        dcfValue,
        undervaluedPercent
      } : null);
    }
  }, [
    selectedCompany?.incomeStatement?.data?.[0],
    selectedCompany?.cashFlowStatement?.data?.[0],
    selectedCompany?.balanceSheetStatement?.data?.[0],
    selectedCompany?.quote?.sharesOutstanding,
    dcfValue,
    undervaluedPercent
  ]);

  useEffect(() => {
    fetchCompanyData();
  }, [fetchCompanyData]);

  useEffect(() => {
    const handleScroll = () => {
      if (dcfSectionRef.current) {
        const rect = dcfSectionRef.current.getBoundingClientRect();
        setIsFloatingValueVisible(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.container}>
      <FloatingDCFValue
        value={dcfValue}
        caseScenario={caseScenarioType}
        setCaseScenario={setCaseScenarioType}
        isVisible={isFloatingValueVisible}
        assessment={undervaluedPercent > 0 ? 'UNDERVALUATION' : 'OVERVALUATION'}
        percentage={undervaluedPercent}
      />

      <div className={styles.header}>
        <h1>Discounted Cash Flow Analysis</h1>
        <Suspense fallback={<div>Loading...</div>}>
          <StockSearchBar
            onSubmit={(company) => {
              setSymbol(company.symbol);
            }}
            selectedAssetType="STOCK"
          />
        </Suspense>
      </div>

      {symbol && (
        <div ref={dcfSectionRef}>
          <DCFValueSection
            symbol={symbol}
            marketPrice={selectedCompany?.quote?.price || 0}
            isLoading={isLoading}
            caseScenario={caseScenarioType}
            onCaseScenarioChange={setCaseScenarioType}
            exchange={selectedCompany?.exchange}
            incomeStatement={selectedCompany?.incomeStatement}
            cashFlowStatement={selectedCompany?.cashFlowStatement}
            balanceSheetStatement={selectedCompany?.balanceSheetStatement}
            profile={selectedCompany?.outlook?.profile}
            marketCap={selectedCompany?.quote?.marketCap}
            sharesOutstanding={selectedCompany?.quote?.sharesOutstanding}
            ratios={selectedCompany?.outlook?.ratios}
            assumptions={assumptions}
            forecastPeriod={dcfParameters.forecastPeriod}
            discountRate={dcfParameters.discountRate}
            terminalGrowth={dcfParameters.terminalGrowth}
            exitMultiple={dcfParameters.exitMultiple}
          />
        </div>
      )}

      {symbol && (
        <PresentValueSection
          isLoading={isLoading}
          incomeStatement={selectedCompany?.incomeStatement}
          cashFlowStatement={selectedCompany?.cashFlowStatement}
          balanceSheetStatement={selectedCompany?.balanceSheetStatement}
          sharesOutstanding={selectedCompany?.quote?.sharesOutstanding}
          forecastPeriod={dcfParameters.forecastPeriod}
          discountRate={dcfParameters.discountRate}
          terminalGrowth={dcfParameters.terminalGrowth}
          operatingModel={dcfParameters.operatingModel}
          exitMultiple={dcfParameters.exitMultiple}
          onOperatingModelChange={(model) => {
            setDcfParameters(prev => ({ ...prev, operatingModel: model }));
          }}
          onForecastPeriodChange={(period) => {
            setDcfParameters(prev => ({ ...prev, forecastPeriod: period }));
          }}
          onDiscountRateChange={(rate) => {
            setDcfParameters(prev => ({ ...prev, discountRate: rate }));
          }}
          onTerminalGrowthChange={(growth) => {
            setDcfParameters(prev => ({ ...prev, terminalGrowth: growth }));
          }}
          onExitMultipleChange={(multiple) => {
            setDcfParameters(prev => ({ ...prev, exitMultiple: multiple }));
          }}
        />
      )}

    </div>
  );
} 