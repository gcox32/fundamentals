import React, { createContext, useContext, useState, useEffect } from 'react';

interface SidebarContextType {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  isMobileView: boolean;
  isMobileOpen: boolean;
  setMobileOpen: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
      setIsClient(true);
      const handleResize = () => {
          setIsMobileView(window.innerWidth <= 768);
      };

      handleResize();
      window.addEventListener('resize', handleResize);
      
      const stored = localStorage.getItem('sidebarExpanded');
      if (stored !== null) {
          setIsExpanded(JSON.parse(stored));
      }

      return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
      <SidebarContext.Provider value={{ 
          isExpanded, 
          setIsExpanded,
          isMobileView,
          isMobileOpen,
          setMobileOpen
      }}>
          {children}
      </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
} 