import { createContext, useContext } from 'react';

interface ChartContextType {
    isExpanded: boolean;
}

export const ChartContext = createContext<ChartContextType>({ isExpanded: false });

export const useChartContext = () => useContext(ChartContext); 