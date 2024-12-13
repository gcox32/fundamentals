export interface TimeframeSelectorProps {
    selectedTimeframe: string;
    setSelectedTimeframe: (timeframe: string) => void;
    selectedSegment: string;
    setSelectedSegment: (segment: string) => void;
}
