'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ValuationInputs from '@/components/tools/dcf/ValuationInputs';
import ValuationChart from '@/components/tools/dcf/ValuationChart';
import styles from './styles.module.css';
import StockSearchBar from '@/components/dashboard/StockSearchBar';
import { fetchDashboardData } from '@/utils/fetchDashboardData';
import CompanyHeader from '@/src/components/dashboard/Overview/CompanyHeader';
import { SelectedCompany } from '@/app/(main)/dashboard/types';

type ValuationType = 'fcf' | 'eps';

export default function DCFPage() {
  const searchParams = useSearchParams();
  const [symbol, setSymbol] = useState<any>(null);
  useEffect(() => {
    if (searchParams.get('symbol')) {
      setSymbol(searchParams.get('symbol'));
    }
  }, [searchParams]);

  const [selectedCompany, setSelectedCompany] = useState<SelectedCompany | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [valuationType, setValuationType] = useState<ValuationType>('fcf');
  const [assumptions, setAssumptions] = useState({
    // FCF Assumptions
    currentFcf: 0,
    fcfGrowthRate: 0.10,
    terminalGrowthRate: 0.02,
    discountRate: 0.10,
    sharesOutstanding: 0,
    projectionYears: 5,
    marketValueEquity: 1,
    marketValueDebt: 1,
    costOfEquity: 0.09, // Default to 9%
    costOfDebt: 0.05,   // Default to 5%
    taxRate: 0.21,      // Default to 21%

    // EPS Assumptions
    currentEps: 0,
    epsGrowthRate: 0.10,
    terminalPE: 15,
  });

  async function fetchCompanyData() {
    if (!symbol) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);

      // Fetch income statement for EPS data
      fetchDashboardData(
        'company/income',
        symbol,
        (data) => {
          const latestEps = data.data?.[0]?.epsdiluted || 0;
          setAssumptions(prev => ({
            ...prev,
            currentEps: latestEps,
          }));
        },
        (error) => console.error('Error fetching income statement:', error)
      );

      // Fetch cash flow statement for FCF data
      fetchDashboardData(
        'company/cash-flow',
        symbol,
        (data) => {
          const latestFcf = data.data?.[0]?.freeCashFlow || 0;
          setAssumptions(prev => ({
            ...prev,
            currentFcf: latestFcf,
          }));
        },
        (error) => console.error('Error fetching cash flow statement:', error)
      );

      // Fetch quote data for shares outstanding
      fetchDashboardData(
        'stock/quote',
        symbol,
        (data) => {
          const sharesOutstanding = data?.sharesOutstanding || 0;
          const marketCap = data?.marketCap || 0;
          setAssumptions(prev => ({
            ...prev,
            sharesOutstanding: sharesOutstanding,
            marketValueEquity: marketCap,
            costOfEquity: data?.beta ? 0.035 + (data.beta * 0.055) : 0.09,
          }));

          // Update company data with quote information
          setSelectedCompany({
            symbol: symbol,
            name: data?.name || '',
            exchange: data?.exchange || '',
            assetType: 'STOCK',
            quote: data
          });
        },
        (error) => console.error('Error fetching quote data:', error)
      );

      // Add balance sheet fetch for debt value
      fetchDashboardData(
        'company/balance-sheet',
        symbol,
        (data) => {
          const totalDebt = data.data?.[0]?.totalDebt || 0;
          setAssumptions(prev => ({
            ...prev,
            marketValueDebt: totalDebt,
          }));
        },
        (error) => console.error('Error fetching balance sheet data:', error)
      );

    } catch (error) {
      console.error('Error fetching company data:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchCompanyData();
  }, [symbol]);

  return (
    <div className={styles.container}>
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

        {(selectedCompany || isLoading) && (
          <CompanyHeader
            symbol={symbol || ''}
            name={selectedCompany?.name || ''}
            exchange={selectedCompany?.exchange || ''}
            isLoading={isLoading}
            quote={selectedCompany?.quote}
          />
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.inputSection}>
          <ValuationInputs
            type={valuationType}
            assumptions={assumptions}
            onTypeChange={setValuationType}
            onAssumptionsChange={setAssumptions}
            isLoading={isLoading}
          />
        </div>

        <div className={styles.chartSection}>
          <ValuationChart
            symbol={symbol || ''}
            type={valuationType}
            assumptions={assumptions}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
} 