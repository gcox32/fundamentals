import { PriceInfoProps } from './PriceInfo/types';

export interface CompanyHeaderProps {
    symbol: string;
    name: string;
    exchange: string;
    isLoading?: boolean;
    priceInfo?: PriceInfoProps;
}

