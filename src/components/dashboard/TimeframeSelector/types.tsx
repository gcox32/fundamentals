export interface TimeframeSelectorProps {
    selectedTimeframe: string;
    setSelectedTimeframe: (timeframe: string) => void;
    isTTM: boolean;
    setIsTTM: (isTTM: boolean) => void;
}
