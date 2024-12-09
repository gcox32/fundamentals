import React, { createContext, useContext, useState, useEffect } from 'react';
import { NavGroup } from '@/src/components/layout/PersistentSidebar/types';
import { staticRoutes } from './config';

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
  searchResults: SearchResult[];
  selectedResultIndex: number;
  setSelectedResultIndex: (index: number) => void;
  navGroups: NavGroup[];
  setNavGroups: (groups: NavGroup[]) => void;
}

export interface SearchResult {
  label: string;
  href: string;
  icon?: React.ReactNode;
  category: string;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [selectedResultIndex, setSelectedResultIndex] = useState(-1);
  const [navGroups, setNavGroups] = useState<NavGroup[]>([]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const results: SearchResult[] = [];
      
      // Search through navigation items
      navGroups.forEach(group => {
        group.items.forEach(item => {
          if (
            item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
            group.title.toLowerCase().includes(searchQuery.toLowerCase())
          ) {
            results.push({
              label: item.label,
              href: item.href,
              icon: item.icon,
              category: group.title
            });
          }
        });
      });

      // Search through static routes
      staticRoutes.forEach(route => {
        if (route.label.toLowerCase().includes(searchQuery.toLowerCase())) {
          results.push(route);
        }
      });

      setSearchResults(results);
      setSelectedResultIndex(-1);
    } else {
      setSearchResults([]);
      setSelectedResultIndex(-1);
    }
  }, [searchQuery, navGroups]);

  return (
    <SearchContext.Provider value={{ 
      searchQuery, 
      setSearchQuery, 
      isSearchOpen, 
      setIsSearchOpen,
      searchResults,
      selectedResultIndex,
      setSelectedResultIndex,
      navGroups,
      setNavGroups
    }}>
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
} 