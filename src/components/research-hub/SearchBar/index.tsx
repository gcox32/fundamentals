'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaSearch } from 'react-icons/fa';
import styles from './styles.module.css';
import Image from 'next/image';

interface SearchResult {
  symbol: string;
  name: string;
  description: string;
  assetType: string;
  totalPercentage: number;
}

interface SearchBarProps {
  onSubmit: (company: { symbol: string; name: string; assetType: string }) => void;
}

export default function SearchBar({ onSubmit }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/research-hub/search?q=${encodeURIComponent(searchQuery)}`);
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
  }, [searchQuery]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const selected = results[selectedIndex];
      handleResultSelect(selected);
    }
  };

  const handleResultSelect = (result: SearchResult) => {
    setSelectedResult(result);
    setSearchQuery(result.symbol);
    onSubmit({
      symbol: result.symbol,
      name: result.name,
      assetType: result.assetType
    });
    setResults([]);
    setSelectedIndex(-1);
  };

  return (
    <div className={styles.searchContainer}>
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
            placeholder="Search Eventide's investment universe..."
            className={styles.searchInput}
          />

          {results.length > 0 && isFocused && (
            <div className={styles.resultsDropdown}>
              {results.map((result, index) => (
                <button
                  key={result.symbol}
                  type="button"
                  className={`${styles.resultItem} ${index === selectedIndex ? styles.selected : ''}`}
                  onClick={() => handleResultSelect(result)}
                >
                  <div className={styles.resultContent}>
                    <div className={styles.resultHeader}>
                      <span className={styles.symbol}>{result.symbol}</span>
                      <span className={styles.name}>{result.name}</span>
                    </div>
                    <p className={styles.description}>{result.description}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 