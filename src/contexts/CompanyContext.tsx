'use client';

import React, { createContext, useContext, useState } from 'react';
import { SelectedCompany } from '@/app/(main)/dashboard/types';

interface CompanyContextType {
  selectedCompany: SelectedCompany | null;
  setSelectedCompany: (company: SelectedCompany | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export function CompanyProvider({ children }: { children: React.ReactNode }) {
  const [selectedCompany, setSelectedCompany] = useState<SelectedCompany | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <CompanyContext.Provider value={{
      selectedCompany,
      setSelectedCompany,
      isLoading,
      setIsLoading,
    }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (undefined === context) {
    throw new Error('useCompany must be used within a CompanyProvider');
  }
  return context;
}