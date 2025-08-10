'use client';

import { useState, useEffect, Suspense, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './styles.module.css';
import StockSearchBar from '@/components/dashboard/research/company/StockSearchBar';
import { fetchValuationData } from '@/src/lib/valuation/fetchValuationData';
import { SelectedCompany } from '@/src/app/(main)/research/company/types';
import DCFValueSection from '@/src/components/dashboard/tools/dcf/DCFValueSection';
import PresentValueSection from '@/src/components/dashboard/tools/dcf/PresentValueSection';
import FloatingDCFValue from '@/src/components/dashboard/tools/dcf/FloatingDCFValue';
import { calculateGrowthRate, calculateValuations } from '@/components/dashboard/research/company/Overview/IntrinsicValueOverview/calculations';
import { calculateEpsPerShare, calculateFcfePerShare } from '@/src/lib/valuation/dcfModels';
import { computeBaselineGrowthRates, computeCapmDiscountPercent } from '@/src/lib/valuation/dcfAssumptions';
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

function DCFContent() {
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
    exitMultiple: dcfConfig.exitMultiple,
    fcfeGrowthRate: dcfConfig.fcfeDefaultGrowthRate,
    epsGrowthRate: dcfConfig.epsDefaultGrowthRate
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
    const epsQuarters = selectedCompany.incomeStatement.data.map(d => d.epsdiluted || 0);

    // Helper: compute TTM sum starting at index
    const ttmSum = (arr: number[], start: number): number => {
      let sum = 0;
      for (let i = start; i < Math.min(start + 4, arr.length); i++) {
        sum += arr[i] || 0;
      }
      // annualize if fewer than 4 quarters
      const count = Math.min(4, arr.length - start);
      return count < 4 ? (sum / Math.max(count, 1)) * 4 : sum;
    };
    const safeClamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

    // FCFE growth: use YoY TTM growth on FCF; fallback to sequential growth average
    const latestFcfTTM = ttmSum(quarterlyFcfValues, 0);
    const priorFcfTTM = ttmSum(quarterlyFcfValues, 4);
    let baseFcfGrowthRate = 0;
    if (priorFcfTTM > 0) {
      baseFcfGrowthRate = (latestFcfTTM / priorFcfTTM) - 1;
    } else {
      baseFcfGrowthRate = calculateGrowthRate(quarterlyFcfValues);
    }
    baseFcfGrowthRate = safeClamp(baseFcfGrowthRate, dcfConfig.fcfGrowthClamp.min, dcfConfig.fcfGrowthClamp.max);

    // EPS growth: use YoY TTM EPS growth
    const latestEpsTTM = ttmSum(epsQuarters, 0);
    const priorEpsTTM = ttmSum(epsQuarters, 4);
    let baseEarningsGrowthRate = 0;
    if (priorEpsTTM > 0) {
      baseEarningsGrowthRate = (latestEpsTTM / priorEpsTTM) - 1;
    } else {
      baseEarningsGrowthRate = calculateGrowthRate(
        selectedCompany.incomeStatement.data.map(d => d.netIncome || 0)
      );
    }
    baseEarningsGrowthRate = safeClamp(baseEarningsGrowthRate, dcfConfig.epsGrowthClamp.min, dcfConfig.epsGrowthClamp.max);

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

    const costOfEquity = selectedCompany.profile?.beta !== undefined
      ? dcfConfig.riskFreeRate + (selectedCompany.profile.beta * dcfConfig.marketRiskPremium)
      : dcfConfig.riskFreeRate + dcfConfig.marketRiskPremium;

    return [
      {
        key: 'Free Cash Flow Growth Rate',
        value: `${(adjustedFcfGrowthRate * 100).toFixed(2)}%`,
        baseValue: baseFcfGrowthRate,
        adjustment: growthRateAdjustment,
        isEditable: true,
        onValueChange: (newValue: number) => {
          setDcfParameters(prev => ({ ...prev, fcfeGrowthRate: newValue / 100 }));
        }
      },
      {
        key: 'Earnings Growth Rate',
        value: `${(adjustedEarningsGrowthRate * 100).toFixed(2)}%`,
        baseValue: baseEarningsGrowthRate,
        adjustment: growthRateAdjustment,
        isEditable: true,
        onValueChange: (newValue: number) => {
          setDcfParameters(prev => ({ ...prev, epsGrowthRate: newValue / 100 }));
        }
      },
      {
        key: 'Tax Rate',
        value: `${(taxRate * 100).toFixed(2)}%`
      },
      {
        key: 'Cost of Equity (CAPM)',
        value: `${(costOfEquity * 100).toFixed(2)}%`
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

  // Auto-set baseline discount rate from CAPM when beta available (only once per symbol load)
  useEffect(() => {
    const beta = selectedCompany?.outlook?.profile?.beta;
    if (beta === undefined || beta === null) return;
    const capm = computeCapmDiscountPercent(beta);
    if (
      Math.abs(dcfParameters.discountRate - capm) > dcfConfig.capmAutoApplyDeviationPct &&
      (dcfParameters.discountRate === dcfConfig.discountRate || dcfParameters.discountRate === 0)
    ) {
      setDcfParameters(prev => ({ ...prev, discountRate: Number(capm.toFixed(2)) }));
    }
  }, [selectedCompany?.outlook?.profile?.beta]);

  // Auto-set baseline growth rates from computed base if still at defaults
  useEffect(() => {
    if (!selectedCompany?.incomeStatement?.data?.[0] || !selectedCompany?.cashFlowStatement?.data?.[0]) return;
    const { fcfeGrowth, epsGrowth } = computeBaselineGrowthRates(
      selectedCompany.incomeStatement,
      selectedCompany.cashFlowStatement
    );
    const updated: any = {};
    if (dcfParameters.fcfeGrowthRate === dcfConfig.fcfeDefaultGrowthRate) {
      updated.fcfeGrowthRate = fcfeGrowth;
    }
    if (dcfParameters.epsGrowthRate === dcfConfig.epsDefaultGrowthRate) {
      updated.epsGrowthRate = epsGrowth;
    }
    if (Object.keys(updated).length) {
      setDcfParameters(prev => ({ ...prev, ...updated }));
    }
  }, [selectedCompany?.incomeStatement?.data?.[0], selectedCompany?.cashFlowStatement?.data?.[0]]);

  const assumptions = useMemo<DCFAssumption[]>(() => {
    return calculateAssumptions();
  }, [selectedCompany, caseScenarioType, dcfParameters]);

  const dcfValue = useMemo(() => {
    if (!selectedCompany?.quote?.sharesOutstanding || !selectedCompany?.incomeStatement?.data?.[0]) {
      return 0;
    }

    const adjustment = caseScenarioType === 'worst' ? dcfConfig.worstCaseFactor : caseScenarioType === 'best' ? dcfConfig.bestCaseFactor : 1;

    if (dcfParameters.operatingModel === 'EPS') {
      const perShare = calculateEpsPerShare(
        selectedCompany.incomeStatement,
        selectedCompany.quote.sharesOutstanding,
        {
          epsGrowthRate: dcfParameters.epsGrowthRate,
          discountRatePercent: dcfParameters.discountRate,
          forecastPeriodYears: dcfParameters.forecastPeriod,
          exitMultiple: dcfParameters.exitMultiple,
        }
      );
      return perShare * adjustment;
    }

    if (!selectedCompany?.cashFlowStatement?.data?.[0] || !selectedCompany?.balanceSheetStatement?.data?.[0]) {
      return 0;
    }
    // Compute FCFE-based DCF using user-selected growth assumptions (aligned with PresentValueSection)
    const latestIncome = selectedCompany.incomeStatement.data[0];
    const latestCF = selectedCompany.cashFlowStatement.data[0];
    const latestBalance = selectedCompany.balanceSheetStatement.data[0];
    const prevBalance = selectedCompany.balanceSheetStatement.data[1];
    const changeInNWC = prevBalance
      ? (latestBalance.totalCurrentAssets - latestBalance.totalCurrentLiabilities) -
        (prevBalance.totalCurrentAssets - prevBalance.totalCurrentLiabilities)
      : 0;

    const perShare = calculateFcfePerShare(
      selectedCompany.incomeStatement,
      selectedCompany.cashFlowStatement,
      selectedCompany.balanceSheetStatement,
      selectedCompany.quote.sharesOutstanding,
      {
        fcfeGrowthRate: dcfParameters.fcfeGrowthRate,
        discountRatePercent: dcfParameters.discountRate,
        forecastPeriodYears: dcfParameters.forecastPeriod,
        terminalGrowth: dcfParameters.terminalGrowth,
      }
    );
    return perShare * adjustment;
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
        operatingModel={dcfParameters.operatingModel}
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
            operatingModel={dcfParameters.operatingModel}
            fcfeGrowthRate={dcfParameters.fcfeGrowthRate}
            epsGrowthRate={dcfParameters.epsGrowthRate}
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
          fcfeGrowthRate={dcfParameters.fcfeGrowthRate}
          epsGrowthRate={dcfParameters.epsGrowthRate}
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
          onFcfeGrowthRateChange={(rate) => {
            setDcfParameters(prev => ({ ...prev, fcfeGrowthRate: rate }));
          }}
          onEpsGrowthRateChange={(rate) => {
            setDcfParameters(prev => ({ ...prev, epsGrowthRate: rate }));
          }}
        />
      )}

    </div>
  );
}

export default function DCFPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DCFContent />
    </Suspense>
  );
} 