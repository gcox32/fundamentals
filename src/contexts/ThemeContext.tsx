import React, { createContext, useContext, useState, useEffect } from 'react';

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
}

const defaultDashboardComponents: DashboardComponent[] = [
  { id: 'stock-overview', title: 'Overview', isVisible: true },
  { id: 'metrics-overview', title: 'Metrics', isVisible: true },
  { id: 'company-events', title: 'Events', isVisible: true },
  { id: 'charts', title: 'Graphs', isVisible: true },
  { id: 'company-profile', title: 'Profile', isVisible: true },
  { id: 'company-news', title: 'News', isVisible: true },
  { id: 'eventide-overview', title: 'Eventide', isVisible: true },
  { id: 'glassdoor-overview', title: 'Glassdoor', isVisible: true },
  { id: 'comparably-overview', title: 'Comparably', isVisible: true },
  { id: 'socials-overview', title: 'Socials', isVisible: true },
];

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [dashboardComponents, setDashboardComponents] = useState<DashboardComponent[]>(defaultDashboardComponents);

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
      document.documentElement.classList.toggle('dark-mode', isDarkMode);
    }
  }, [isDarkMode, isClient, dashboardComponents]);

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
  };

  return (
    <ThemeContext.Provider value={{ 
      isDarkMode, 
      toggleDarkMode, 
      dashboardComponents,
      toggleComponent,
      resetDashboardLayout
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