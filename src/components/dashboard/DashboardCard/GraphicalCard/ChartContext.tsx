import { createContext, useContext } from 'react';

interface ChartContextType {
    isExpanded: boolean;
    timeframe: string;
}

export const ChartContext = createContext<ChartContextType>({ 
    isExpanded: false,
    timeframe: '1M'  // default to 1 month
});

export const useChartContext = () => useContext(ChartContext); 