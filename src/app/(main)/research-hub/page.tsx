'use client';

import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/research-hub/SearchBar';
import CompanyGrid from '@/components/research-hub/CompanyGrid';
import FundCarousel from '@/components/research-hub/FundCarousel';
import investmentUniverse from './investment-universe.json';
import styles from './styles.module.css';
import ResearchModal from '@/components/research-hub/ResearchModal';
import ThemeFilter from '@/components/research-hub/ThemeFilter';

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

interface ThemeCount {
    name: string;
    count: number;
}

export default function ResearchHub() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
    const [displayedCompanies, setDisplayedCompanies] = useState<Company[]>([]);
    const [selectedCompanyForResearch, setSelectedCompanyForResearch] = useState<Company | null>(null);
    const [availableThemes, setAvailableThemes] = useState<ThemeCount[]>([]);
    const [selectedThemes, setSelectedThemes] = useState<string[]>([]);

    const [funds] = useState<Fund[]>(() => {
        // Combine mutual funds and ETFs, excluding bond funds
        const mutualFunds = investmentUniverse.mutual_funds
            // .filter(fund => fund.ticker !== 'ETIBX' && fund.ticker !== 'ETIRX')
            .map(fund => ({
                symbol: fund.ticker,
                name: fund.name,
                description: getFundDescription(fund.ticker)
            }));

        const etfs = investmentUniverse.etfs
            .map(etf => ({
                symbol: etf.ticker,
                name: etf.name,
                description: getFundDescription(etf.ticker)
            }));

        return [...mutualFunds, ...etfs];
    });

    // Helper function to get fund descriptions
    function getFundDescription(ticker: string): string {
        switch (ticker) {
            case 'ETILX':
                return 'Focused on identifying and investing in companies capable of increasing profitability and growth by serving well the needs of customers, employees, suppliers, communities, the environment, and society broadly.';
            case 'ETIHX':
                return 'Targeting large unmet medical needs, rare and orphan diseases.';
            case 'ETLIX':
                return 'Focused on identifying and investing in companies capable of increasing profitability and growth by serving well the needs of customers, employees, suppliers, communities, the environment, and society.';
            case 'ETIMX':
                return 'Focused on identifying and investing in companies capable of increasing profitability, growth, and income distribution by serving well the needs of customers, employees, suppliers, communities, the environment, and society broadly.';
            case 'ETIEX':
                return 'Targeting large scale unmet technological needs to address compelling requirements in society.';
            case 'ETIDX':
                return 'Investing in companies whose future is tied to their own ability to create value, rather than to macroeconomic and industry performance.';
            case 'ETIBX':
                return 'Seeks to invest in limited-term bonds and other securities that offer positive yield advantage, discounted price, and improving credit profile.';
            case 'ETIRX':
                return 'Seeks to invest in bonds and other securities that offer positive yield advantage, discounted price, and improving credit profile.';
            case 'ELCV':
                return 'Seeks to invest in companies providing long-term solutions necessary to human flourishing, while also delivering robust and stable dividend yields.';
            case 'EUSM':
                return 'A cost-effective core investment solution for values-driven investors seeking to participate in the U.S. equity market';
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
        setAvailableThemes(calculateThemeCounts(allCompanies));
    }, []);

    const handleCompanySelect = (company: Company) => {
        setSelectedCompanyForResearch(company);
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
            
            // Reset theme counts to include all companies
            setAvailableThemes(calculateThemeCounts(companies));
            
            // Apply only theme filtering if themes are selected
            if (selectedThemes.length > 0) {
                const themeFilteredCompanies = companies
                    .filter(company => {
                        const originalCompany = investmentUniverse.companies
                            .find(c => c.ticker === company.symbol);
                        return originalCompany?.themes.some(t => selectedThemes.includes(t));
                    })
                    .slice(0, 12);
                setDisplayedCompanies(themeFilteredCompanies);
            } else {
                setDisplayedCompanies(companies.slice(0, 12));
            }
            return;
        }

        setSelectedFund(fund);

        // Filter companies for the selected fund
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
            .filter(company => company.totalPercentage > 0);

        // Update theme counts based on companies in this fund
        setAvailableThemes(calculateThemeCounts(fundCompanies));

        // Filter displayed companies by both fund and themes
        const filteredCompanies = fundCompanies
            .filter(company => {
                const originalCompany = investmentUniverse.companies
                    .find(c => c.ticker === company.symbol);
                const matchesThemes = selectedThemes.length === 0 || 
                    originalCompany?.themes.some(t => selectedThemes.includes(t));
                return matchesThemes;
            })
            .sort((a, b) => b.totalPercentage - a.totalPercentage)
            .slice(0, 12);

        setDisplayedCompanies(filteredCompanies);
    };

    const handleThemeSelect = (theme: string) => {
        setSelectedThemes(prevThemes => {
            const newThemes = prevThemes.includes(theme)
                ? prevThemes.filter(t => t !== theme)
                : [...prevThemes, theme];
            
            // If no themes selected, show only fund-filtered companies or default
            if (newThemes.length === 0) {
                if (selectedFund) {
                    const fundCompanies = companies
                        .map(company => {
                            const originalCompany = investmentUniverse.companies
                                .find(c => c.ticker === company.symbol);
                            const fundPercentage = originalCompany ?
                                (originalCompany.percentage_of_each_fund as Record<string, number | null>)[selectedFund.symbol] || 0 : 0;
                            return {
                                ...company,
                                totalPercentage: fundPercentage
                            };
                        })
                        .filter(company => company.totalPercentage > 0)
                        .sort((a, b) => b.totalPercentage - a.totalPercentage)
                        .slice(0, 12);
                    setDisplayedCompanies(fundCompanies);
                } else {
                    setDisplayedCompanies(companies.slice(0, 12));
                }
            } else {
                // Filter by both themes and fund if a fund is selected
                const filteredCompanies = companies
                    .map(company => {
                        const originalCompany = investmentUniverse.companies
                            .find(c => c.ticker === company.symbol);
                        const fundPercentage = selectedFund ? 
                            (originalCompany?.percentage_of_each_fund as Record<string, number | null>)[selectedFund.symbol] || 0 : 1;
                        return {
                            ...company,
                            totalPercentage: fundPercentage
                        };
                    })
                    .filter(company => {
                        const originalCompany = investmentUniverse.companies
                            .find(c => c.ticker === company.symbol);
                        const matchesThemes = originalCompany?.themes.some(t => newThemes.includes(t));
                        return matchesThemes && (!selectedFund || company.totalPercentage > 0);
                    })
                    .sort((a, b) => b.totalPercentage - a.totalPercentage)
                    .slice(0, 12);
                setDisplayedCompanies(filteredCompanies);
            }
            
            // Scroll to companies section after filter
            document.querySelector('.companiesSection')?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });

            return newThemes;
        });
    };

    const getSectionTitle = () => {
        if (!selectedFund) {
            return "Top Holdings In Our Investment Universe";
        }
        return `Top Holdings in the ${selectedFund.name}`;
    };

    const getSectionDescription = () => {
        if (!selectedFund) {
            return `Percentages represent the stake each company has in the total of all Eventide funds. Some companies may be held in multiple funds.`;
        }
        return `Percentages represent the stake each company has in the ${selectedFund.name}.`;
    };

    const calculateThemeCounts = (companiesForCounting: Company[]) => {
        // Initialize themeCounts with all available themes set to 0
        const themeCounts = new Map<string, number>();
        investmentUniverse.companies.forEach(company => {
            company.themes.forEach(theme => {
                if (!themeCounts.has(theme)) {
                    themeCounts.set(theme, 0);
                }
            });
        });
        
        // Count themes from the filtered companies
        companiesForCounting.forEach(company => {
            const originalCompany = investmentUniverse.companies
                .find(c => c.ticker === company.symbol);
            
            originalCompany?.themes.forEach(theme => {
                themeCounts.set(theme, (themeCounts.get(theme) || 0) + 1);
            });
        });
        
        return Array.from(themeCounts.entries())
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => a.name.localeCompare(b.name));
    };

    return (
        <main className={styles.container}>
            <section className={styles.hero}>
                <h1 className={styles.title}>Research Hub</h1>
                <p className={styles.subtitle}>
                    Explore the nearly 3000 companies in Eventide's investment universe; investments that are making the world rejoice.
                </p>
                <p className={styles.subtitle}>
                    Search explicitly for companies, scan our funds, or explore compelling investment themes.
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

            <section className={styles.themesSection}>
                <h2 className={styles.sectionTitle}>Filter by Theme</h2>
                <ThemeFilter
                    themes={availableThemes}
                    selectedThemes={selectedThemes}
                    onThemeSelect={handleThemeSelect}
                />
            </section>

            <section className={styles.companiesSection}>
                <h2 className={styles.sectionTitle}>{getSectionTitle()}</h2>
                <p className={styles.sectionDescription}>*{getSectionDescription()}</p>
                <CompanyGrid
                    companies={displayedCompanies}
                    onCompanySelect={handleCompanySelect}
                />
            </section>

            {selectedCompanyForResearch && (
                <ResearchModal
                    company={selectedCompanyForResearch}
                    onClose={() => setSelectedCompanyForResearch(null)}
                />
            )}
        </main>
    );
}
