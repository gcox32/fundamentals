import React, { useEffect, useRef } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useSearch } from '@/src/contexts/SearchContext';
import { useRouter } from 'next/navigation';
import SearchResults from './SearchResults';
import './styles.css';

export default function SearchBar() {
  const { 
    searchQuery, 
    setSearchQuery, 
    isSearchOpen, 
    setIsSearchOpen,
    searchResults,
    selectedResultIndex,
    setSelectedResultIndex
  } = useSearch();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedResultIndex(
        selectedResultIndex < searchResults.length - 1 ? selectedResultIndex + 1 : selectedResultIndex
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedResultIndex(selectedResultIndex > 0 ? selectedResultIndex - 1 : selectedResultIndex);
    } else if (e.key === 'Enter' && selectedResultIndex >= 0) {
      e.preventDefault();
      const selectedResult = searchResults[selectedResultIndex];
      if (selectedResult) {
        router.push(selectedResult.href);
        setIsSearchOpen(false);
        setSearchQuery('');
      }
    }
  };

  return (
    <div className={`search-container ${isSearchOpen ? 'open' : ''}`}>
      <div className="search-input-wrapper">
        <FaSearch className="search-icon" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="search-input"
        />
        {searchQuery && (
          <button
            className="clear-button"
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            <FaTimes />
          </button>
        )}
      </div>
      <div className="search-shortcut">⌘K</div>
      <SearchResults />
    </div>
  );
} 