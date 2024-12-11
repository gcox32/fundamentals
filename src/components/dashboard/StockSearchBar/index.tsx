'use client';

import React, { useState } from 'react';
import { FaSearch, FaTimesCircle } from 'react-icons/fa';
import { exchanges } from './config';
import styles from './styles.module.css';

export default function StockSearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedExchange, setSelectedExchange] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Search:', { query: searchQuery, exchange: selectedExchange });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.searchContainer}>
      <div className={`${styles.searchBar} ${isFocused ? styles.focused : ''}`}>
        <div className={styles.searchIcon}>
          <FaSearch />
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search by company name or ticker symbol..."
          className={styles.searchInput}
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className={styles.clearButton}
            aria-label="Clear search"
          >
            <FaTimesCircle />
          </button>
        )}

        <div className={styles.divider} />

        <select
          value={selectedExchange}
          onChange={(e) => setSelectedExchange(e.target.value)}
          className={styles.exchangeSelect}
        >
          {exchanges.map((exchange) => (
            <option key={exchange.code} value={exchange.code}>
              {exchange.code}
            </option>
          ))}
        </select>

        <button type="submit" className={styles.searchButton}>
          Search
        </button>
      </div>
    </form>
  );
} 