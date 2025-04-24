'use client';

import { useState, useEffect, Suspense, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from './styles.module.css';
import StockSearchBar from '@/components/dashboard/StockSearchBar';
import { fetchDashboardData } from '@/utils/fetchDashboardData';
import { SelectedCompany } from '@/app/(main)/dashboard/types';
import { 
  CompanyProfile, 
  CompanyRatios, 
  CompanyMetrics, 
  CompanyInsideTrades 
} from '@/types/company';
import DCFValueSection from '@/src/components/tools/dcf/DCFValueSection';
import PresentValueSection from '@/src/components/tools/dcf/PresentValueSection';
import DCFCalculationSection from '@/src/components/tools/dcf/DCFCalculationSection';
import ValuationAnalysisSection from '@/src/components/tools/dcf/ValuationAnalysisSection';
import DCFFinancialsSection from '@/src/components/tools/dcf/DCFFinancialsSection';
import FloatingDCFValue from '@/src/components/tools/dcf/FloatingDCFValue';
import { calculateGrowthRate, calculateValuations } from '@/components/dashboard/Overview/IntrinsicValueOverview/calculations';

type CaseScenarioType = 'worst' | 'base' | 'best';

interface CompanyOutlook {
  profile?: CompanyProfile;
  ratios?: CompanyRatios[];
  metrics?: CompanyMetrics | null;
  insideTrades?: CompanyInsideTrades[];
  dividends?: any[];
  earnings?: any[];
  financials?: any[];
  financialsQuarter?: any[];
}

interface DCFAssumption {
  key: string;
  value: string;
  baseValue?: number;
  adjustment?: number;
}

interface GrowthRates {
  fcfGrowth: number;
  earningsGrowth: number;
}

interface AssumptionsResult {
  growthRates: GrowthRates;
  discountRate: number;
  terminalGrowthRate: number;
  baseFcfGrowth: number;
  baseEarningsGrowth: number;
  fcfAdjustment: number;
  earningsAdjustment: number;
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
      fetchDashboardData('company/income', symbol,
        updateCompanyData('incomeStatement'),
        handleError('incomeStatement')
      );

      fetchDashboardData('company/cash-flow', symbol,
        updateCompanyData('cashFlowStatement'),
        handleError('cashFlowStatement')
      );

      fetchDashboardData('company/balance-sheet', symbol,
        updateCompanyData('balanceSheetStatement'),
        handleError('balanceSheetStatement')
      );

      fetchDashboardData('stock/quote', symbol,
        updateCompanyData('quote'),
        handleError('quote')
      );

      fetchDashboardData('company/outlook', symbol,
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
          return 0.8; // 20% reduction
        case 'best':
          return 1.2; // 20% increase
        default:
          return 1; // No adjustment
      }
    };

    const growthRateAdjustment = getGrowthRateAdjustment(caseScenarioType);
    const adjustedFcfGrowthRate = baseFcfGrowthRate * growthRateAdjustment;
    const adjustedEarningsGrowthRate = baseEarningsGrowthRate * growthRateAdjustment;

    const taxRate = latest.income.incomeTaxExpense && latest.income.incomeBeforeTax && latest.income.incomeTaxExpense > 0
      ? latest.income.incomeTaxExpense / latest.income.incomeBeforeTax
      : 0.21;

    const beta = selectedCompany.profile?.beta
      ? 0.035 + (selectedCompany.profile.beta * 0.055)
      : 0.035 + 0.055;

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
        value: '2.00%'
      },
      {
        key: 'Projection Period',
        value: '5 years'
      },
      {
        key: 'Beta',
        value: selectedCompany.profile?.beta ? selectedCompany.profile.beta.toFixed(2) : '1.00'
      },
      {
        key: 'Risk-Free Rate',
        value: '3.50%'
      },
      {
        key: 'Market Risk Premium',
        value: '5.50%'
      }
    ];
  }, [selectedCompany, caseScenarioType]);

  const assumptions = useMemo<DCFAssumption[]>(() => {
    return calculateAssumptions();
  }, [selectedCompany, caseScenarioType]);

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
      selectedCompany.outlook?.ratios
    );

    if (!baseValuations) return 0;

    const adjustment = caseScenarioType === 'worst' ? 0.8 : caseScenarioType === 'best' ? 1.2 : 1;
    return baseValuations.dcf.value * adjustment;
  }, [selectedCompany, caseScenarioType]);

  const undervaluedPercent = useMemo(() => {
    if (!selectedCompany?.quote?.price || !dcfValue) return 0;
    return ((dcfValue - selectedCompany.quote.price) / dcfValue) * 100;
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
          />
        </div>
      )}

      {symbol && (
        <PresentValueSection
          onSave={() => {
            // Handle save functionality
            console.log('Saving DCF model...');
          }}
          isLoading={isLoading}
        />
      )}

      {symbol && (
        <DCFCalculationSection
          presentValue={selectedCompany?.presentValue || 0}
          equityValue={selectedCompany?.equityValue || 0}
          sharesOutstanding={selectedCompany?.quote?.sharesOutstanding || 0}
          dcfValue={selectedCompany?.dcfValue || 0}
          undervaluedPercent={selectedCompany?.undervaluedPercent || 0}
          symbol={symbol}
        />
      )}

      {symbol && (
        <ValuationAnalysisSection
          currentPrice={selectedCompany?.quote?.price || 0}
          isLoading={isLoading}
        />
      )}

      {symbol && (
        <DCFFinancialsSection
          isLoading={isLoading}
        />
      )}
    </div>
  );
} 