'use client';

import React, { useState } from 'react';
import StockSearchBar from "@/components/dashboard/StockSearchBar";
import CompanyHeader from "@/components/dashboard/Overview/CompanyHeader";
import TimeframeSelector from "@/components/dashboard/TimeframeSelector";
import GraphicalCard from "@/src/components/dashboard/DashboardCard/GraphicalCard";
import CompanyProfile from "@/src/components/dashboard/Overview/CompanyProfile";
import CompanyEvents from "@/src/components/dashboard/Overview/CompanyEvents";
import CompanyNews from "@/src/components/dashboard/Overview/CompanyNews";
import CompanyMetricsOverview from "@/src/components/dashboard/Overview/CompanyMetricsOverview";
import StockOverview from "@/src/components/dashboard/Overview/StockOverview";
import styles from './styles.module.css';
import { fetchDashboardData } from '@/utils/fetchDashboardData';
import { graphCards } from './graphConfig';
import { SelectedCompany } from './types';

export default function Dashboard() {
  const [selectedCompany, setSelectedCompany] = useState<SelectedCompany | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('5Y');

  const handleCompanySelect = async (company: { symbol: string; name: string; assetType: string }) => {
    setIsLoading(true);
    
    // Initialize with basic company info and null values for all data fields
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
      balanceSheetStatement: undefined
    };
    
    setSelectedCompany(initialCompany);

    const updateCompanyData = (key: keyof SelectedCompany) => (data: any) => {
      setSelectedCompany(prev => prev ? { ...prev, [key]: data } : null);
    };

    const handleError = (key: keyof SelectedCompany, defaultValue?: any, silent=false) => (error: any) => {
      if (!silent) {
        console.error(`Failed to fetch ${key}:`, error);
      }
      if (defaultValue) {
        setSelectedCompany(prev => prev ? { ...prev, [key]: defaultValue } : null);
      }
    };

    try {
      // Events
      fetchDashboardData('company/events', company.symbol, 
        updateCompanyData('events'),
        handleError('events')
      );

      // Quote
      fetchDashboardData('stock/quote', company.symbol,
        updateCompanyData('quote'),
        handleError('quote')
      );

      // Outlook
      fetchDashboardData('company/outlook', company.symbol,
        updateCompanyData('outlook'),
        handleError('outlook')
      );

      // Historical Price
      fetchDashboardData('stock/historical/price', company.symbol,
        updateCompanyData('historicalPrice'),
        handleError('historicalPrice')
      );

      // Historical Shares Outstanding
      fetchDashboardData('stock/historical/shares-outstanding', company.symbol,
        updateCompanyData('historicalShares'),
        handleError('historicalShares')
      );

      // Dividend History
      fetchDashboardData('stock/historical/dividends', company.symbol,
        updateCompanyData('dividendHistory'),
        handleError('dividendHistory', { 
          symbol: company.symbol, 
          historical: [], 
          lastUpdated: Date.now() 
        },
        true
      )
      );

      // Income Statement
      fetchDashboardData('company/income', company.symbol,
        updateCompanyData('incomeStatement'),
        handleError('incomeStatement')
      );

      // Cash Flow Statement
      fetchDashboardData('company/cash-flow', company.symbol,
        updateCompanyData('cashFlowStatement'),
        handleError('cashFlowStatement')
      );

      // Balance Sheet Statement
      fetchDashboardData('company/balance-sheet', company.symbol,
        updateCompanyData('balanceSheetStatement'),
        handleError('balanceSheetStatement')
      );

    } catch (error) {
      console.error('Error in handleCompanySelect:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className="container mx-auto px-4 py-8">
        <StockSearchBar onSubmit={handleCompanySelect} />
        
        {(selectedCompany || isLoading) && (
          <>
            <CompanyHeader 
              symbol={selectedCompany?.symbol || '' } 
              name={selectedCompany?.name || ''} 
              exchange={selectedCompany?.exchange || ''}
              isLoading={isLoading}
              quote={selectedCompany?.quote}
            />

            <StockOverview
              isLoading={isLoading}
              quote={selectedCompany?.quote}
              profile={selectedCompany?.outlook?.profile}
            />

            <CompanyMetricsOverview
              isLoading={isLoading}
              ratios={selectedCompany?.outlook?.ratios}
            />

            <CompanyEvents 
              isLoading={isLoading}
              events={selectedCompany?.events}
            />

            <TimeframeSelector
              selectedTimeframe={selectedTimeframe}
              setSelectedTimeframe={setSelectedTimeframe}
            />
            <div className={styles.cardGrid}>
              {graphCards.map(({ title, Component, dataKey, noDataCheck }) => (
                <GraphicalCard 
                  key={title}
                  title={title} 
                  isLoading={isLoading}
                  timeframe={selectedTimeframe}
                  noData={noDataCheck ? noDataCheck(selectedCompany?.[dataKey as keyof SelectedCompany]) : undefined}
                >
                  <Component 
                    {...(Array.isArray(dataKey) 
                      ? dataKey.reduce((acc, key) => ({ ...acc, [key]: selectedCompany?.[key as keyof SelectedCompany] }), {})
                      : { data: selectedCompany?.[dataKey as keyof SelectedCompany] }
                    )}
                    isLoading={isLoading}
                  />
                </GraphicalCard>
              ))}
            </div>

            <CompanyProfile
              isLoading={isLoading}
              profile={selectedCompany?.outlook?.profile}
            />

            <CompanyNews 
              isLoading={isLoading}
              news={selectedCompany?.outlook?.stockNews}
            />
          </>
        )}
      </div>
    </div>
  );
} 