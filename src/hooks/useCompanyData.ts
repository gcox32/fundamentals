'use client';

import { useCompany } from '@/contexts/CompanyContext';
import { fetchDashboardData } from '@/utils/fetchDashboardData';
import { SelectedCompany } from '@/app/(main)/dashboard/types';

export function useCompanyData() {
  const { selectedCompany, setSelectedCompany, setIsLoading } = useCompany();

  const updateCompanyData = (key: keyof SelectedCompany) => (data: any) => {
    setSelectedCompany(selectedCompany ? { ...selectedCompany, [key]: data } : null);
  };

  const handleError = (key: keyof SelectedCompany, defaultValue?: any, silent = false) => (error: any) => {
    if (!silent) console.error(`Failed to fetch ${key}:`, error);
    if (defaultValue) {
      setSelectedCompany(selectedCompany ? { ...selectedCompany, [key]: defaultValue } : null);
    }
  };

  const handleCompanySelect = async (company: { symbol: string; name: string; assetType: string }) => {
    setIsLoading(true);

    const initialCompany: SelectedCompany = {
      symbol: company.symbol,
      name: company.name,
      assetType: company.assetType,
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
      revenueByGeography: undefined
    };

    setSelectedCompany(initialCompany);

    try {
      // Fetch all company data (copied from dashboard page)
      // Reference lines 104-188 from dashboard/page.tsx
      fetchDashboardData('company/events', company.symbol,
        updateCompanyData('events'),
        handleError('events')
      );

      // ... (rest of the fetch calls)

    } catch (error) {
      console.error('Error in handleCompanySelect:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleCompanySelect };
} 