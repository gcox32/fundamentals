import React from 'react';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/src/contexts/SearchContext';

export default function SearchResults() {
  const router = useRouter();
  const { 
    searchResults, 
    selectedResultIndex, 
    setSelectedResultIndex,
    setIsSearchOpen,
    setSearchQuery 
  } = useSearch();

  const handleResultClick = (href: string) => {
    router.push(href);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  if (searchResults.length === 0) {
    return null;
  }

  return (
    <div className="search-results">
      {searchResults.map((result, index) => (
        <button
          key={`${result.category}-${result.label}`}
          className={`search-result ${index === selectedResultIndex ? 'selected' : ''}`}
          onClick={() => handleResultClick(result.href)}
          onMouseEnter={() => setSelectedResultIndex(index)}
        >
          <div className="result-icon">{result.icon}</div>
          <div className="result-content">
            <span className="result-label">{result.label}</span>
            <span className="result-category">{result.category}</span>
          </div>
        </button>
      ))}
    </div>
  );
} 