'use client';

import React, { useState } from 'react';
import StockSearchBar from "@/components/dashboard/StockSearchBar";
import CompanyHeader from "@/components/dashboard/CompanyHeader";
import TimeframeSelector from "@/components/dashboard/TimeframeSelector";
import GraphicalCard from "@/src/components/dashboard/DashboardCard/GraphicalCard";
import CompanyProfile from "@/src/components/dashboard/CompanyProfile";
import CompanyEvents from "@/components/dashboard/CompanyEvents";
import CompanyNews from "@/components/dashboard/CompanyNews";
import CompanyMetricsOverview from "@/src/components/dashboard/CompanyMetricsOverview";
import StockOverview from "@/src/components/dashboard/StockOverview";
import styles from './styles.module.css';
import { fetchDashboardData } from '@/utils/fetchDashboardData';
import type { StockQuote, HistoricalPriceData, HistoricalSharesOutstanding, HistoricalDividendData } from '@/types/stock';
import type { CompanyOutlook, HistoricalRevenueBySegment } from '@/types/company';
import HistoricalPrice from "@/components/dashboard/HistoricalPrice";
import HistoricalShares from "@/components/dashboard/HistoricalShares";
import RevenueBySegment from "@/components/dashboard/RevenueBySegment";
import DividendHistory from "@/components/dashboard/DividendHistory";

interface SelectedCompany {
  symbol: string;
  name: string;
  exchange: string;
  quote?: StockQuote;
  events?: any;
  outlook?: CompanyOutlook;
  historicalPrice?: HistoricalPriceData;
  historicalShares?: HistoricalSharesOutstanding;
  revenueBySegment?: HistoricalRevenueBySegment;
  dividendHistory?: HistoricalDividendData;
}

export default function Dashboard() {
  const [selectedCompany, setSelectedCompany] = useState<SelectedCompany | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('5Y');
  const [selectedSegment, setSelectedSegment] = useState('daily');

  const handleCompanySelect = async (company: { symbol: string; name: string; exchange: string }) => {
    console.log('Company selected:', company);
    setIsLoading(true);
    setSelectedCompany(company);
    
    try {
      // Events
      fetchDashboardData('company/events', company.symbol, (data) => {
        setSelectedCompany((prev: SelectedCompany | null) => prev ? { ...prev, events: data } : null);
      }, (error) => {
        console.error('Failed to fetch company events:', error);
      });

      // Quote
      fetchDashboardData('stock/quote', company.symbol, (data) => {
        setSelectedCompany((prev: SelectedCompany | null) => prev ? { ...prev, quote: data } : null);
      }, (error) => {
        console.error('Failed to fetch stock quote:', error);
      });

      // Outlook (includes profile and news)
      fetchDashboardData('company/outlook', company.symbol, (data) => {
        setSelectedCompany((prev: SelectedCompany | null) => prev ? { ...prev, outlook: data } : null);
      }, (error) => {
        console.error('Failed to fetch company outlook:', error);
      });

      // Historical Price
      fetchDashboardData('stock/historical/price', company.symbol, (data) => {
        setSelectedCompany((prev: SelectedCompany | null) => prev ? { ...prev, historicalPrice: data } : null);
      }, (error) => {
        console.error('Failed to fetch historical price:', error);
      });

      // Historical Shares Outstanding
      fetchDashboardData('stock/historical/shares-outstanding', company.symbol, (data) => {
        setSelectedCompany((prev: SelectedCompany | null) => prev ? { ...prev, historicalShares: data } : null);
      }, (error) => {
        console.error('Failed to fetch historical shares data:', error);
      });

      // Revenue by Segment
      fetchDashboardData('company/revenue-by-segment', company.symbol, (data) => {
        setSelectedCompany((prev: SelectedCompany | null) => prev ? { ...prev, revenueBySegment: data } : null);
      }, (error) => {
        console.error('Failed to fetch revenue segments:', error);
      });

      // Dividend History
      fetchDashboardData('stock/historical/dividends', company.symbol, (data) => {
        setSelectedCompany((prev: SelectedCompany | null) => prev ? { ...prev, dividendHistory: data } : null);
      }, (error) => {
        // console.error('Failed to fetch dividend history:', error);
        setSelectedCompany((prev: SelectedCompany | null) => prev ? { ...prev, dividendHistory: { symbol: prev.symbol, historical: [], lastUpdated: Date.now() } } : null);
      });

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
              selectedSegment={selectedSegment}
              setSelectedSegment={setSelectedSegment}
            />
            <div className={styles.cardGrid}>
              <GraphicalCard title="Price History" isLoading={isLoading}>
                <HistoricalPrice 
                  data={selectedCompany?.historicalPrice}
                  isLoading={isLoading}
                />
              </GraphicalCard>
              
              <GraphicalCard title="Revenue by Segment" isLoading={isLoading}>
                <RevenueBySegment 
                  data={selectedCompany?.revenueBySegment}
                  isLoading={isLoading}
                />
              </GraphicalCard>
              
              <GraphicalCard title="Dividend History" isLoading={isLoading}>
                <DividendHistory 
                  data={selectedCompany?.dividendHistory}
                  isLoading={isLoading}
                />
              </GraphicalCard>
              
              <GraphicalCard title="Shares Outstanding" isLoading={isLoading}>
                <HistoricalShares 
                  data={selectedCompany?.historicalShares}
                  isLoading={isLoading}
                />
              </GraphicalCard>
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