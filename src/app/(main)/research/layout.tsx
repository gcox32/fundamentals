'use client';

import { CompanyProvider } from '@/contexts/CompanyContext';
import StockSearchBar from '@/components/dashboard/StockSearchBar';
import { useCompanyData } from '@/hooks/useCompanyData';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function MarketResearchLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const [selectedAssetType, setSelectedAssetType] = useState('STOCK');
  const { handleCompanySelect } = useCompanyData();
  const pathname = usePathname();

  return (
    <CompanyProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          <Link 
            href="/market-research/fundamental"
            className={`tab ${pathname.includes('fundamental') ? 'active' : ''}`}
          >
            Fundamental
          </Link>
          <Link 
            href="/market-research/flourishing"
            className={`tab ${pathname.includes('flourishing') ? 'active' : ''}`}
          >
            Flourishing
          </Link>
        </div>

        <StockSearchBar 
          onSubmit={handleCompanySelect}
          selectedAssetType={selectedAssetType}
        />
        
        {children}
      </div>
    </CompanyProvider>
  );
}