import React, { createContext, useContext, useState, useEffect } from 'react';
import { useHiddenCards } from './HiddenCardsContext';

interface DashboardComponent {
  id: string;
  title: string;
  isVisible: boolean;
  isRequired?: boolean;
}

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  dashboardComponents: DashboardComponent[];
  toggleComponent: (id: string) => void;
  resetDashboardLayout: () => void;
  leadingIndicators: DashboardComponent[];
  toggleLeadingIndicator: (id: string) => void;
  resetLeadingIndicators: () => void;
}

const defaultDashboardComponents: DashboardComponent[] = [
  { id: 'stock-overview', title: 'Overview', isVisible: true },
  { id: 'metrics-overview', title: 'Metrics', isVisible: true },
  { id: 'company-events', title: 'Events', isVisible: true },
  { id: 'charts', title: 'Graphs', isVisible: true },
  { id: 'company-profile', title: 'Profile', isVisible: true },
  { id: 'company-news', title: 'News', isVisible: true },
  { id: 'flourishing-grid', title: 'Flourishing', isVisible: true },
  { id: 'intrinsic-value-overview', title: 'Intrinsic Value', isVisible: true },
];

const defaultLeadingIndicators: DashboardComponent[] = [
  { id: 'consumer-health', title: 'Consumer Health', isVisible: true },
  { id: 'business-health', title: 'Business Health', isVisible: true },
  { id: 'inflation-rates', title: 'Inflation Rates', isVisible: true },
  { id: 'credit-markets', title: 'Credit Markets', isVisible: true },
  { id: 'yield-curve', title: 'Yield Curve', isVisible: true },
  { id: 'sector-snapshot', title: 'Sector Snapshot', isVisible: true },
  { id: 'valuation-implications', title: 'Implications', isVisible: true },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { showAllCards } = useHiddenCards();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [dashboardComponents, setDashboardComponents] = useState<DashboardComponent[]>(defaultDashboardComponents);
  const [leadingIndicators, setLeadingIndicators] = useState<DashboardComponent[]>(defaultLeadingIndicators);

  useEffect(() => {
    setIsClient(true);
    const stored = localStorage.getItem('darkMode');
    const storedLayout = localStorage.getItem('dashboardLayout');
    
    if (stored !== null) {
      setIsDarkMode(JSON.parse(stored));
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }

    if (storedLayout !== null) {
      setDashboardComponents(JSON.parse(storedLayout));
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
      localStorage.setItem('dashboardLayout', JSON.stringify(dashboardComponents));
      localStorage.setItem('leadingIndicators', JSON.stringify(leadingIndicators));
      document.documentElement.classList.toggle('dark-mode', isDarkMode);
    }
  }, [isDarkMode, isClient, dashboardComponents, leadingIndicators]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const toggleComponent = (id: string) => {
    setDashboardComponents(prev => 
      prev.map(component => 
        component.id === id && !component.isRequired
          ? { ...component, isVisible: !component.isVisible }
          : component
      )
    );
  };

  const resetDashboardLayout = () => {
    setDashboardComponents(defaultDashboardComponents);
    localStorage.removeItem('dashboardComponents');
    showAllCards();
  };

  const toggleLeadingIndicator = (id: string) => {
    setLeadingIndicators(prev => 
      prev.map(indicator => 
        indicator.id === id && !indicator.isRequired
          ? { ...indicator, isVisible: !indicator.isVisible }
          : indicator
      )
    );
  };

  const resetLeadingIndicators = () => {
    setLeadingIndicators(defaultLeadingIndicators);
    localStorage.removeItem('leadingIndicators');
  };

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleDarkMode, 
      dashboardComponents,
      toggleComponent,
      resetDashboardLayout,
      leadingIndicators,
      toggleLeadingIndicator,
      resetLeadingIndicators
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 