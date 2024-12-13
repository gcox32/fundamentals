import { PriceInfoProps } from '@/components/dashboard/CompanyHeader/PriceInfo/types';

export interface MarketStatus {
    market: 'regular' | 'extended-hours' | 'closed';
    afterHours: boolean;
    earlyHours: boolean;
    exchanges: {
        nasdaq: string;
        nyse: string;
        otc: string;
    };
    serverTime: string;
}

export interface CompanyType {
    symbol: string;
    name: string;
    exchange: string;
    priceInfo?: PriceInfoProps;
    marketStatus?: MarketStatus;
}