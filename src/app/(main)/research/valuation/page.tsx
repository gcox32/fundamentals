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
import AssetTypeSelector from '@/components/dashboard/AssetTypeSelector';
import EventideOverview from "@/src/components/dashboard/Flourishing/Eventide";
import GlassdoorOverview from "@/src/components/dashboard/Flourishing/Glassdoor";
import ComparablyOverview from "@/src/components/dashboard/Flourishing/Comparably";
import SocialsOverview from "@/src/components/dashboard/Flourishing/Socials";
import { useHiddenCards } from '@/contexts/HiddenCardsContext';
import IntrinsicValueOverview from "@/src/components/dashboard/Overview/IntrinsicValueOverview";

const DEFAULT_CARD_ORDER = graphCards.map((card, index) => `graph-${index}`);

const FLOURISHING_CARD_ORDER = [
  'eventide-overview',
  'glassdoor-overview',
  'comparably-overview',
  'socials-overview'
];

export default function Dashboard() {
  const { hiddenCards, hideCard, showAllCards } = useHiddenCards();
  const [selectedCompany, setSelectedCompany] = useState<SelectedCompany | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('5Y');
  const [isTTM, setIsTTM] = useState(false);
  const [cardOrder, setCardOrder] = useState<string[]>(() => {
    if (typeof window === 'undefined') return DEFAULT_CARD_ORDER;
    return JSON.parse(localStorage.getItem('cardOrder') || JSON.stringify(DEFAULT_CARD_ORDER));
  });
  const [selectedAssetType, setSelectedAssetType] = useState('STOCK');
  const [activeTab, setActiveTab] = useState<'fundamental' | 'flourishing'>('fundamental');
  const [flourishingOrder, setFlourishingOrder] = useState<string[]>(() => {
    if (typeof window === 'undefined') return FLOURISHING_CARD_ORDER;
    return JSON.parse(localStorage.getItem('flourishingOrder') || JSON.stringify(FLOURISHING_CARD_ORDER));
  });

  useEffect(() => {
    if (cardOrder !== DEFAULT_CARD_ORDER) {
      localStorage.setItem('graphCardOrder', JSON.stringify(cardOrder));
    }
  }, [cardOrder]);

  const handleOrderChange = (newOrder: string[]) => {
    setCardOrder(newOrder);
  };

  const handleHideCard = (id: string) => {
    hideCard(id);
  };

  const handleFlourishingOrderChange = (newOrder: string[]) => {
    setFlourishingOrder(newOrder);
    localStorage.setItem('flourishingOrder', JSON.stringify(newOrder));
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
      balanceSheetStatement: undefined,
      revenueBySegment: undefined,
      revenueByGeography: undefined
    };

    setSelectedCompany(initialCompany);

    const updateCompanyData = (key: keyof SelectedCompany) => (data: any) => {
      setSelectedCompany(prev => prev ? { ...prev, [key]: data } : null);
    };

    const handleError = (key: keyof SelectedCompany, defaultValue?: any, silent = false) => (error: any) => {
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

      // Revenue by Segment
      fetchDashboardData('company/revenue-by-segment', company.symbol,
        updateCompanyData('revenueBySegment'),
        handleError('revenueBySegment',
          {
            symbol: company.symbol,
            historical: [],
            lastUpdated: Date.now()
          },
          true
        )
      );

      // Revenue by Geography
      fetchDashboardData('company/revenue-by-geography', company.symbol,
        updateCompanyData('revenueByGeography'),
        handleError('revenueByGeography',
          {
            symbol: company.symbol,
            historical: [],
            lastUpdated: Date.now()
          },
          true
        )
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
        <div className={styles.controlsContainer}>
          <StockSearchBar
            onSubmit={handleCompanySelect}
            selectedAssetType={selectedAssetType}
          />
          <AssetTypeSelector
            selectedAssetType={selectedAssetType}
            onAssetTypeChange={setSelectedAssetType}
          />
        </div>
        {selectedCompany && (
          <div className={styles.tabsContainer}>
            <button
              className={`${styles.tabButton} ${activeTab === 'fundamental' ? styles.active : ''}`}
              onClick={() => setActiveTab('fundamental')}
            >
              Fundamental
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'flourishing' ? styles.active : ''}`}
              onClick={() => setActiveTab('flourishing')}
            >
              Flourishing
            </button>
          </div>
        )}

        {(selectedCompany || isLoading) && (
          <>
            <CompanyHeader
              symbol={selectedCompany?.symbol || ''}
              name={selectedCompany?.name || ''}
              exchange={selectedCompany?.exchange || ''}
              isLoading={isLoading}
              quote={selectedCompany?.quote}
            />

            {activeTab === 'fundamental' && (
              <div className={`${styles.tabContent} ${styles.visible}`}>
                <>
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
                      cashFlow={selectedCompany?.cashFlowStatement?.data}
                      marketCap={selectedCompany?.quote?.marketCap}
                    />
                  </VisibilityWrapper>

                  <VisibilityWrapper componentId="company-events">
                    <CompanyEvents
                      isLoading={isLoading}
                      events={selectedCompany?.events}
                    />
                  </VisibilityWrapper>

                  <VisibilityWrapper componentId="charts">
                    <div className={styles.chartControls}>
                      <TimeframeSelector
                        selectedTimeframe={selectedTimeframe}
                        setSelectedTimeframe={setSelectedTimeframe}
                        isTTM={isTTM}
                        setIsTTM={setIsTTM}
                      />
                    </div>
                    <DraggableCardGrid
                      cardIds={cardOrder.filter(id => !hiddenCards.has(id))}
                      onOrderChange={handleOrderChange}
                    >
                      {cardOrder
                        .filter(id => !hiddenCards.has(id))
                        .map(id => {
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
                              onHide={handleHideCard}
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

                  <VisibilityWrapper componentId="intrinsic-value-overview">
                    <IntrinsicValueOverview
                      isLoading={isLoading}
                      incomeStatement={selectedCompany?.incomeStatement}
                      cashFlowStatement={selectedCompany?.cashFlowStatement}
                      balanceSheetStatement={selectedCompany?.balanceSheetStatement}
                      profile={selectedCompany?.outlook?.profile}
                      currentPrice={selectedCompany?.quote?.price}
                      marketCap={selectedCompany?.quote?.marketCap}
                      sharesOutstanding={selectedCompany?.quote?.sharesOutstanding}
                      ratios={selectedCompany?.outlook?.ratios}
                    />
                  </VisibilityWrapper>
                </>
              </div>
            )}

            {activeTab === 'flourishing' && (
              <div className={`${styles.tabContent} ${styles.visible}`}>
                <>
                  <VisibilityWrapper componentId="company-profile">
                    <CompanyProfile
                      isLoading={isLoading}
                      profile={selectedCompany?.outlook?.profile}
                    />
                  </VisibilityWrapper>

                  <VisibilityWrapper componentId="flourishing-grid">
                    <DraggableCardGrid
                      cardIds={flourishingOrder.filter(id => !hiddenCards.has(id))}
                      onOrderChange={handleFlourishingOrderChange}
                    >
                      {flourishingOrder
                        .filter(id => !hiddenCards.has(id))
                        .map(id => {
                          switch (id) {
                            case 'eventide-overview':
                              return <EventideOverview key={id} isLoading={isLoading} onHide={() => handleHideCard(id)} />;
                            case 'glassdoor-overview':
                              return <GlassdoorOverview key={id} isLoading={isLoading} onHide={() => handleHideCard(id)} />;
                            case 'comparably-overview':
                              return <ComparablyOverview key={id} isLoading={isLoading} onHide={() => handleHideCard(id)} />;
                            case 'socials-overview':
                              return <SocialsOverview key={id} isLoading={isLoading} onHide={() => handleHideCard(id)} />;
                            default:
                              return null;
                          }
                        })}
                    </DraggableCardGrid>
                  </VisibilityWrapper>

                  <VisibilityWrapper componentId="company-news">
                    <CompanyNews
                      isLoading={isLoading}
                      symbol={selectedCompany?.symbol}
                    />
                  </VisibilityWrapper>
                </>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
} 