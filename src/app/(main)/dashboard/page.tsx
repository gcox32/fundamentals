'use client';

import React, { useState } from 'react';
import StockSearchBar from "@/components/dashboard/StockSearchBar";
import CompanyHeader from "@/components/dashboard/CompanyHeader";
import TimeframeSelector from "@/components/dashboard/TimeframeSelector";
import DashboardCard from "@/components/dashboard/DashboardCard";
import CompanySummary from "@/components/dashboard/CompanySummary";
import styles from './styles.module.css';

export default function Dashboard() {
  const [selectedCompany, setSelectedCompany] = useState<{ symbol: string; name: string; exchange: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const [selectedSegment, setSelectedSegment] = useState('daily');

  const handleCompanySelect = async (company: { symbol: string; name: string; exchange: string }) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSelectedCompany(company);
    setIsLoading(false);
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
              priceInfo={{
                currentPrice: 142.50,
                priceChange: 3.25,
                percentChange: 2.33,
                isAfterHours: true
              }}
            />
            
            <CompanySummary
              isLoading={isLoading}
              profile={{
                sector: "Technology",
                industry: "Software & Services",
                location: "Redmond, Washington",
                description: "Microsoft Corporation develops, manufactures, and sells computer software, consumer electronics, and personal computers and services.",
                website: "https://www.microsoft.com"
              }}
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