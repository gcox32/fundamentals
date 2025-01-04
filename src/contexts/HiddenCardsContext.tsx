'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface HiddenCardsContextType {
  hiddenCards: Set<string>;
  hideCard: (id: string) => void;
  showAllCards: () => void;
}

const HiddenCardsContext = createContext<HiddenCardsContextType | undefined>(undefined);

export function HiddenCardsProvider({ children }: { children: React.ReactNode }) {
  const [hiddenCards, setHiddenCards] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    const saved = localStorage.getItem('hiddenCards');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem('hiddenCards', JSON.stringify(Array.from(hiddenCards)));
  }, [hiddenCards]);

  const hideCard = (id: string) => {
    setHiddenCards(prev => {
      const newHiddenCards = new Set(prev);
      newHiddenCards.add(id);
      return newHiddenCards;
    });
  };

  const showAllCards = () => {
    setHiddenCards(new Set());
    localStorage.removeItem('hiddenCards');
  };

  return (
    <HiddenCardsContext.Provider value={{ hiddenCards, hideCard, showAllCards }}>
      {children}
    </HiddenCardsContext.Provider>
  );
}

export function useHiddenCards() {
  const context = useContext(HiddenCardsContext);
  if (context === undefined) {
    throw new Error('useHiddenCards must be used within a HiddenCardsProvider');
  }
  return context;
} 