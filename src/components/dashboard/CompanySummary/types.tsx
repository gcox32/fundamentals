export interface CompanySummaryProps {
    isLoading?: boolean;
    profile?: {
        sector: string;
        industry: string;
        location: string;
        description: string;
        website: string;
    };
    events?: {
        nextEarningsDate: string;
        nextDividendDate: string;
        nextExDividendDate: string;
    };
    valuation?: {
        marketCap: number;
        peRatioTTM: number;
        peRatioForward: number;
    };
}