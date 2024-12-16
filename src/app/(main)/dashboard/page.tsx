'use client';

import React, { useState } from 'react';
import StockSearchBar from "@/components/dashboard/StockSearchBar";
import CompanyHeader from "@/components/dashboard/CompanyHeader";
import TimeframeSelector from "@/components/dashboard/TimeframeSelector";
import GraphicalCard from "@/src/components/dashboard/DashboardCard/GraphicalCard";
import CompanyProfile from "@/src/components/dashboard/CompanyProfile";
import CompanyEventsNews from "@/components/dashboard/CompanyEventsNews";
import styles from './styles.module.css';
import { fetchDashboardData } from '@/utils/fetchDashboardData';
import { StockQuote } from '@/types/stock';
import { CompanyProfile as CompanyProfileType } from '@/types/company';

interface SelectedCompany {
  symbol: string;
  name: string;
  exchange: string;
  profile?: CompanyProfileType;
  quote?: StockQuote;
  events?: any;
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
      // Profile
      fetchDashboardData('company/profile', company.symbol, (data) => {
        setSelectedCompany((prev: SelectedCompany | null) => prev ? { ...prev, profile: data } : null);
      }, (error) => {
        console.error('Failed to fetch company profile:', error);
      });
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
              profile={selectedCompany?.profile}
            />

            <CompanyEventsNews 
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
          </>
        )}
      </div>
    </div>
  );
} 