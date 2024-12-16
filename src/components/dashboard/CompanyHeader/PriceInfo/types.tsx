export interface PriceInfoProps {
    currentPrice: number;
    priceChange: number;
    percentChange: number;
    marketStatus: string;
    isLoading?: boolean;
}