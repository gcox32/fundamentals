'use client';

import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/research-hub/SearchBar';
import CompanyGrid from '@/components/research-hub/CompanyGrid';
import FundCarousel from '@/components/research-hub/FundCarousel';
import investmentUniverse from './investment-universe.json';
import styles from './styles.module.css';

interface Company {
  symbol: string;
  name: string;
  description: string;
  totalPercentage: number;
  assetType: string;
}

interface Fund {
  symbol: string;
  name: string;
  description: string;
}

export default function ResearchHub() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [displayedCompanies, setDisplayedCompanies] = useState<Company[]>([]);

  const [funds] = useState<Fund[]>(() => {
    // Filter out bond funds and map to Fund interface
    return investmentUniverse.mutual_funds
      .filter(fund => fund.ticker !== 'ETIBX' && fund.ticker !== 'ETIRX')
      .map(fund => ({
        symbol: fund.ticker,
        name: fund.name,
        description: getFundDescription(fund.ticker)
      }));
  });

  // Helper function to get fund descriptions
  function getFundDescription(ticker: string): string {
    switch (ticker) {
      case 'ETILX':
        return 'Seeks to provide long-term capital appreciation by investing in companies that demonstrate values and business practices that are ethical, sustainable, and profitable.';
      case 'ETIHX':
        return 'Seeks to provide long-term capital appreciation by investing in healthcare and life sciences companies.';
      case 'ETLIX':
        return 'Seeks to provide long-term capital appreciation by investing in large-cap companies that create compelling value for their customers, employees, suppliers, host communities, the environment, and society broadly.';
      case 'ETIMX':
        return 'A balanced fund that seeks to provide both capital appreciation and income generation through a diversified portfolio of stocks and bonds.';
      case 'ETIEX':
        return 'Seeks to provide long-term capital appreciation by investing in companies positioned to benefit from technological innovation and development.';
      case 'ETIDX':
        return 'Seeks to provide dividend growth and appreciation through investing in companies with sustainable competitive advantages and consistent dividend growth.';
      default:
        return '';
    }
  }

  useEffect(() => {
    // Initialize with top companies by percentage
    const allCompanies = (investmentUniverse.companies || [])
      .map(company => ({
        symbol: company.ticker,
        name: company.name,
        description: company.description,
        assetType: 'STOCK',
        totalPercentage: Object.entries(company.percentage_of_each_fund)
          .filter(([fund]) => fund !== 'ETIBX' && fund !== 'ETIRX')
          .reduce((sum: number, [_, val]) => sum + (val || 0), 0) || 0
      }))
      .sort((a, b) => b.totalPercentage - a.totalPercentage);

    setCompanies(allCompanies);
    setDisplayedCompanies(allCompanies.slice(0, 12));
  }, []);

  const handleCompanySelect = (company: Company) => {
    const selectedCompanyData = companies.find(c => c.symbol === company.symbol);
    if (selectedCompanyData) {
      setSelectedCompany(selectedCompanyData);
      console.log('Selected company:', selectedCompanyData);
    }
  };

  const handleSearchSubmit = (searchResult: { symbol: string; name: string; assetType: string }) => {
    const company: Company = {
      ...searchResult,
      description: '',
      totalPercentage: 0
    };
    handleCompanySelect(company);
  };

  const handleFundSelect = (fund: Fund) => {
    // If clicking the already selected fund, deselect it
    if (selectedFund?.symbol === fund.symbol) {
      setSelectedFund(null);
      setDisplayedCompanies(companies.slice(0, 12));
      return;
    }

    setSelectedFund(fund);

    // Filter and sort companies by their percentage in the selected fund
    const fundCompanies = companies
      .map(company => {
        const originalCompany = investmentUniverse.companies
          .find(c => c.ticker === company.symbol);
        const fundPercentage = originalCompany ? 
          (originalCompany.percentage_of_each_fund as Record<string, number | null>)[fund.symbol] || 0 : 0;
        
        return {
          ...company,
          totalPercentage: fundPercentage
        };
      })
      .filter(company => company.totalPercentage > 0)
      .sort((a, b) => b.totalPercentage - a.totalPercentage)
      .slice(0, 12);

    setDisplayedCompanies(fundCompanies);
  };

  const getSectionTitle = () => {
    if (!selectedFund) {
      return "Top Holdings In Our Investment Universe";
    }
    return `Top Holdings in the ${selectedFund.name}`;
  };

  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <h1 className={styles.title}>Research Hub</h1>
        <p className={styles.subtitle}>
          Explore companies in Eventide's investment universe that are creating value for society
          while pursuing attractive investment returns.
        </p>
        <div className={styles.searchContainer}>
          <SearchBar onSubmit={handleSearchSubmit} />
        </div>
      </section>

      <section className={styles.fundsSection}>
        <h2 className={styles.sectionTitle}>Our Funds</h2>
        <FundCarousel 
          funds={funds}
          onFundSelect={handleFundSelect}
          selectedFund={selectedFund}
        />
      </section>

      <section className={styles.companiesSection}>
        <h2 className={styles.sectionTitle}>{getSectionTitle()}</h2>
        <CompanyGrid 
          companies={displayedCompanies}
          onCompanySelect={handleCompanySelect}
        />
      </section>
    </main>
  );
}
