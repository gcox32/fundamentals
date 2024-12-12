'use client';

import React, { useState } from 'react';
import StockSearchBar from "@/components/dashboard/StockSearchBar";
import CompanyHeader from "@/components/dashboard/CompanyHeader";
import DashboardCard from "@/components/dashboard/DashboardCard";
import styles from './styles.module.css';

export default function Dashboard() {
  const [selectedCompany, setSelectedCompany] = useState<{ symbol: string; name: string; exchange: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCompanySelect = async (company: { symbol: string; name: string; exchange: string }) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSelectedCompany(company);
    setIsLoading(false);
  };

  return (
    <div 
      style={{
        backgroundImage: `linear-gradient(to bottom, var(--background-secondary), var(--background))`,
        borderRadius: '16px'
      }}
    >
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
            
            <div className={styles.cardGrid}>
              <DashboardCard title="Price History" isLoading={isLoading}>
                <div>{isLoading ? 'Loading price history...' : ''}</div>
              </DashboardCard>
              
              <DashboardCard title="Key Metrics" isLoading={isLoading}>
                <div>{isLoading ? 'Loading metrics...' : ''}</div>
              </DashboardCard>
              
              <DashboardCard title="News" isLoading={isLoading}>
                <div>{isLoading ? 'Loading news...' : ''}</div>
              </DashboardCard>
              
              <DashboardCard title="Company Overview" isLoading={isLoading}>
                <div>{isLoading ? 'Loading company info...' : ''}</div>
              </DashboardCard>
            </div>
          </>
        )}
      </div>
    </div>
  );
} 