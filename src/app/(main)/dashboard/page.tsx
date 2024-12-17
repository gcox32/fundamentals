'use client';

import React, { useState } from 'react';
import StockSearchBar from "@/components/dashboard/StockSearchBar";
import CompanyHeader from "@/components/dashboard/CompanyHeader";
import TimeframeSelector from "@/components/dashboard/TimeframeSelector";
import GraphicalCard from "@/src/components/dashboard/DashboardCard/GraphicalCard";
import CompanyProfile from "@/src/components/dashboard/CompanyProfile";
import CompanyEvents from "@/components/dashboard/CompanyEvents";
import CompanyNews from "@/components/dashboard/CompanyNews";
import styles from './styles.module.css';
import { fetchDashboardData } from '@/utils/fetchDashboardData';
import { StockQuote } from '@/types/stock';
import { CompanyProfile as CompanyProfileType, MarketNews, CompanyOutlook } from '@/types/company';

interface SelectedCompany {
  symbol: string;
  name: string;
  exchange: string;
  quote?: StockQuote;
  events?: any;
  outlook?: CompanyOutlook;
}

export default function Dashboard() {
  const [selectedCompany, setSelectedCompany] = useState<SelectedCompany | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
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
            
            <CompanyProfile
              isLoading={isLoading}
              profile={selectedCompany?.outlook?.profile}
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
                <div>{isLoading ? 'Loading price history...' : ''}</div>
              </GraphicalCard>
              
              <GraphicalCard title="Revenue" isLoading={isLoading}>
                <div>{isLoading ? 'Loading revenue...' : ''}</div>
              </GraphicalCard>
              
              <GraphicalCard title="Dividend History" isLoading={isLoading}>
                <div>{isLoading ? 'Loading dividends...' : ''}</div>
              </GraphicalCard>
              
              <GraphicalCard title="Shares Outstanding" isLoading={isLoading}>
                <div>{isLoading ? 'Loading buybacks...' : ''}</div>
              </GraphicalCard>
            </div>
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