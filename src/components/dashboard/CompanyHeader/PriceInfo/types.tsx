export interface PriceInfoProps {
    currentPrice: number;
    priceChange: number;
    percentChange: number;
    isAfterHours: boolean;
    isLoading?: boolean;
}