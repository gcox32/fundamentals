export interface CompanyHeaderProps {
    symbol: string;
    name: string;
    exchange: string;
    isLoading?: boolean;
    priceInfo?: {
        currentPrice: number;
        priceChange: number;
        percentChange: number;
        isAfterHours: boolean;
    };
}