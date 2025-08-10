import type { PriceInfoProps } from '@/components/dashboard/research/company/Overview/CompanyHeader/PriceInfo/types';
import type { StockQuote } from '@/types/stock';
import type { CompanyOutlook, HistoricalRevenueByGeography, HistoricalRevenueBySegment } from '@/types/company';
import type { HistoricalPriceData, HistoricalSharesOutstanding, HistoricalDividendData } from '@/types/stock';
import type { HistoricalIncomeStatement, HistoricalCashFlowStatement, HistoricalBalanceSheetStatement } from '@/types/financials';

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

export interface SelectedCompany {
    symbol: string;
    name: string;
    assetType: string;
    exchange: string | undefined;
    quote?: StockQuote;
    events?: any;
    outlook?: CompanyOutlook;
    historicalPrice?: HistoricalPriceData;
    historicalShares?: HistoricalSharesOutstanding;
    dividendHistory?: HistoricalDividendData;
    incomeStatement?: HistoricalIncomeStatement;
    cashFlowStatement?: HistoricalCashFlowStatement;
    balanceSheetStatement?: HistoricalBalanceSheetStatement;
    revenueBySegment?: HistoricalRevenueBySegment;
    revenueByGeography?: HistoricalRevenueByGeography;
  }
