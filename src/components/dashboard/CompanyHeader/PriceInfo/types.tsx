export interface PriceInfoProps {
    currentPrice: number;
    priceChange: number;
    percentChange: number;
    marketStatus: 'pre' | 'regular' | 'after' | 'closed';
    isLoading?: boolean;
}