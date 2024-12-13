'use client';

import React, { useState } from 'react';
import StockSearchBar from "@/components/dashboard/StockSearchBar";
import CompanyHeader from "@/components/dashboard/CompanyHeader";
import TimeframeSelector from "@/components/dashboard/TimeframeSelector";
import DashboardCard from "@/components/dashboard/DashboardCard";
import CompanySummary from "@/components/dashboard/CompanySummary";
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
      console.log('Fetching profile for:', company.symbol);
      const response = await fetch(`/api/company/profile?symbol=${company.symbol}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Profile fetch failed:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error('Failed to fetch company profile');
      }

      console.log('Profile fetch successful');
      const profileData = await response.json();
      console.log('Profile data:', profileData);

      setSelectedCompany({
        ...company,
        profile: profileData
      });
    } catch (error) {
      console.error('Error in handleCompanySelect:', error);
      setSelectedCompany(company);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      backgroundImage: `linear-gradient(to bottom, var(--background-secondary), var(--background))`,
      borderRadius: '16px'
    }}>
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
            
            <CompanySummary
              isLoading={isLoading}
              profile={selectedCompany?.profile}
              events={{
                nextEarningsDate: "2024-04-25",
                nextDividendDate: "2024-06-08",
                nextExDividendDate: "2024-05-15"
              }}
              valuation={{
                marketCap: 3.2e12,
                peRatioTTM: 38.5,
                peRatioForward: 35.2
              }}
            />
            <TimeframeSelector
              selectedTimeframe={selectedTimeframe}
              setSelectedTimeframe={setSelectedTimeframe}
              selectedSegment={selectedSegment}
              setSelectedSegment={setSelectedSegment}
            />
            <div className={styles.cardGrid}>
              <DashboardCard title="Price History" isLoading={isLoading}>
                <div>{isLoading ? 'Loading price history...' : ''}</div>
              </DashboardCard>
              
              <DashboardCard title="Revenue" isLoading={isLoading}>
                <div>{isLoading ? 'Loading revenue...' : ''}</div>
              </DashboardCard>
              
              <DashboardCard title="Dividend History" isLoading={isLoading}>
                <div>{isLoading ? 'Loading dividends...' : ''}</div>
              </DashboardCard>
              
              <DashboardCard title="Shares Outstanding" isLoading={isLoading}>
                <div>{isLoading ? 'Loading buybacks...' : ''}</div>
              </DashboardCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 