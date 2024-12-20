'use client';

import React, { useState, useEffect } from 'react';
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
import DraggableCardGrid from '@/components/dashboard/DraggableCardGrid';
import VisibilityWrapper from '@/components/dashboard/VisibilityWrapper';

const DEFAULT_CARD_ORDER = graphCards.map((card, index) => `graph-${index}`);

export default function Dashboard() {
  const [selectedCompany, setSelectedCompany] = useState<SelectedCompany | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('5Y');
  const [isTTM, setIsTTM] = useState(false);
  const [cardOrder, setCardOrder] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const savedOrder = localStorage.getItem('graphCardOrder');
      return savedOrder ? JSON.parse(savedOrder) : DEFAULT_CARD_ORDER;
    }
    return DEFAULT_CARD_ORDER;
  });

  useEffect(() => {
    if (cardOrder !== DEFAULT_CARD_ORDER) {
      localStorage.setItem('graphCardOrder', JSON.stringify(cardOrder));
    }
  }, [cardOrder]);

  const handleOrderChange = (newOrder: string[]) => {
    setCardOrder(newOrder);
  };

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

            <VisibilityWrapper componentId="stock-overview">
              <StockOverview
                isLoading={isLoading}
                quote={selectedCompany?.quote}
                profile={selectedCompany?.outlook?.profile}
              />
            </VisibilityWrapper>

            <VisibilityWrapper componentId="metrics-overview">
              <CompanyMetricsOverview
                isLoading={isLoading}
                ratios={selectedCompany?.outlook?.ratios}
              />
            </VisibilityWrapper>

            <VisibilityWrapper componentId="company-events">
              <CompanyEvents 
                isLoading={isLoading}
                events={selectedCompany?.events}
              />
            </VisibilityWrapper>

            <TimeframeSelector
              selectedTimeframe={selectedTimeframe}
              setSelectedTimeframe={setSelectedTimeframe}
              isTTM={isTTM}
              setIsTTM={setIsTTM}
            />

            <VisibilityWrapper componentId="charts">
              <DraggableCardGrid
                cardIds={cardOrder}
                onOrderChange={handleOrderChange}
              >
                {cardOrder.map(id => {
                  const index = parseInt(id.split('-')[1]);
                  const card = graphCards[index];
                  if (!card) return null;

                  return (
                    <GraphicalCard
                      key={id}
                      id={id}
                      title={card.title}
                      isLoading={isLoading}
                      timeframe={selectedTimeframe}
                      isTTM={isTTM}
                      noData={card.noDataCheck ? card.noDataCheck(selectedCompany?.[card.dataKey as keyof SelectedCompany]) : undefined}
                    >
                      <card.Component
                        {...(Array.isArray(card.dataKey)
                          ? card.dataKey.reduce((acc, key) => ({ ...acc, [key]: selectedCompany?.[key as keyof SelectedCompany] }), {})
                          : { data: selectedCompany?.[card.dataKey as keyof SelectedCompany] }
                        )}
                        isLoading={isLoading}
                      />
                    </GraphicalCard>
                  );
                })}
              </DraggableCardGrid>
            </VisibilityWrapper>

            <VisibilityWrapper componentId="company-profile">
              <CompanyProfile
                isLoading={isLoading}
                profile={selectedCompany?.outlook?.profile}
              />
            </VisibilityWrapper>

            <VisibilityWrapper componentId="company-news">
              <CompanyNews
                isLoading={isLoading}
                news={selectedCompany?.outlook?.stockNews}
              />
            </VisibilityWrapper>
          </>
        )}
      </div>
    </div>
  );
} 