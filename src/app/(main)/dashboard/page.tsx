'use client';

import React, { useState } from 'react';
import StockSearchBar from "@/components/dashboard/StockSearchBar";
import CompanyHeader from "@/components/dashboard/CompanyHeader";
import TimeframeSelector from "@/components/dashboard/TimeframeSelector";
import GraphicalCard from "@/src/components/dashboard/DashboardCard/GraphicalCard";
import CompanyProfile from "@/src/components/dashboard/CompanyProfile";
import CompanyEventsNews from "@/components/dashboard/CompanyEventsNews";
import styles from './styles.module.css';
import { CompanyData } from '@/types/company';


export default function Dashboard() {
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const [selectedSegment, setSelectedSegment] = useState('daily');

  const handleCompanySelect = async (company: { symbol: string; name: string; exchange: string }) => {
    console.log('Company selected:', company);
    setIsLoading(true);
    
    try {
      const [profileResponse, eventsResponse] = await Promise.all([
        fetch(`/api/company/profile?symbol=${company.symbol}`),
        fetch(`/api/company/events?symbol=${company.symbol}`)
      ]);

      if (!profileResponse.ok || !eventsResponse.ok) {
        throw new Error('Failed to fetch company data');
      }

      const [profileData, eventsData] = await Promise.all([
        profileResponse.json(),
        eventsResponse.json()
      ]);

      setSelectedCompany({
        ...company,
        profile: profileData,
        events: eventsData
      });
    } catch (error) {
      console.error('Error in handleCompanySelect:', error);
      setSelectedCompany(company);
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
              symbol={selectedCompany?.symbol || 'Loading'} 
              name={selectedCompany?.name || 'Loading Company Data'} 
              exchange={selectedCompany?.exchange || 'Loading'}
              isLoading={isLoading}
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