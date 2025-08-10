'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from './styles.module.css';
import Image from 'next/image';
import { StockResult } from './types';

interface StockSearchBarProps {
  onSubmit: (company: { symbol: string; name: string, assetType: string }) => void;
  selectedAssetType: string;
}

export default function StockSearchBar({ onSubmit, selectedAssetType }: StockSearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<StockResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [selectedResult, setSelectedResult] = useState<StockResult | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/research/valuation/stocks/search?q=${encodeURIComponent(searchQuery)}&type=${encodeURIComponent(selectedAssetType)}`);
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedAssetType]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if ((e.key === 'Enter' || e.key === 'Tab') && selectedIndex >= 0 && selectedIndex < results.length) {
      e.preventDefault();
      const selected = results[selectedIndex];
      setSelectedResult(selected);
      setSearchQuery(selected.symbol);
      setSelectedIndex(-1);
      
      if (e.key === 'Enter') {
        handleSubmit(e);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !selectedResult) return;

    onSubmit({
      symbol: selectedResult.symbol,
      name: selectedResult.name,
      assetType: selectedAssetType
    });
    setSearchQuery('');
    setResults([]);
    setSelectedResult(null);
  };

  const getCompanyLogoUrl = (symbol: string) =>
    `https://assets.letmedemo.com/public/fundamental/icons/companies/${symbol}.png`;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/images/placeholder.png';
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchContainer}>
      <div
        ref={searchRef}
        className={`${styles.searchBar} ${isFocused ? styles.focused : ''}`}
      >
        <div className={styles.searchIcon}>
          <FaSearch />
        </div>

        <div className={styles.inputWrapper}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder="Search by company name or ticker"
            className={styles.searchInput}
          />

          {results.length > 0 && isFocused && (
            <div className={styles.resultsDropdown}>
              {results.map((result, index) => (
                <button
                  key={result.symbol}
                  type="button"
                  className={`${styles.resultItem} ${index === selectedIndex ? styles.selected : ''}`}
                  onClick={() => {
                    setSelectedResult(result);
                    setSearchQuery(result.symbol);
                  }}
                >
                  <div className={styles.logoWrapper}>
                    <Image
                      src={getCompanyLogoUrl(result.symbol)}
                      alt={`${result.name} logo`}
                      width={24}
                      height={24}
                      className={styles.companyLogo}
                      onError={handleImageError}
                      unoptimized
                    />
                  </div>
                  <span className={styles.symbol}>{result.symbol}</span>
                  <span className={styles.name}>{result.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <div className={styles.divider} />
        <button
          type="submit"
          className={styles.searchButton}
          disabled={!searchQuery.trim() || !selectedResult || selectedAssetType !== 'STOCK'}
        >
          <span className={styles.searchButtonText}>Search</span>
          <FaSearch className={styles.searchButtonIcon} />
        </button>


      </div>
    </form>
  );
} 