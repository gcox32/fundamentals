import { createContext, useContext } from 'react';

interface ChartContextType {
    isExpanded: boolean;
    timeframe: string;
    isTTM: boolean;
}

export const ChartContext = createContext<ChartContextType>({ 
    isExpanded: false,
    timeframe: '1M',  // default to 1 month
    isTTM: false
});

export const useChartContext = () => useContext(ChartContext); 