import type { StockStatistics } from './stock';

interface CompanyOfficer {
    maxAge: number;
    name: string;
    age?: number;
    title: string;
    yearBorn?: number;
    fiscalYear: number;
    totalPay?: {
        raw: number;
        fmt: string;
        longFmt: string;
    };
    exercisedValue: {
        raw: number;
        fmt: string | null;
        longFmt: string;
    };
    unexercisedValue: {
        raw: number;
        fmt: string | null;
        longFmt: string;
    };
}

interface Valuation {
    marketCap: number;
    peRatioTTM: number;
    peRatioForward: number;
}

export interface CompanyProfile {
    symbol: string;
    address1: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
    website: string;
    industry: string;
    industryKey: string;
    industryDisp: string;
    sector: string;
    sectorKey: string;
    sectorDisp: string;
    longBusinessSummary: string;
    fullTimeEmployees: number;
    companyOfficers: CompanyOfficer[];
}

export interface CompanyProfileWithMetadata extends CompanyProfile {
    lastUpdated: number;
}

export interface CompanyData {
    symbol: string;
    name: string;
    exchange: string;
    profile?: CompanyProfile;
    events?: CompanyCalendarEvents;
    news?: CompanyNews;
    statistics?: StockStatistics;
}

export interface CompanyValuation {
    marketCap: number;
    peRatioTTM: number;
    peRatioForward: number;
}

export interface CompanySummaryProps {
    isLoading?: boolean;
    profile?: CompanyProfile;
    events?: CompanyCalendarEvents;
    valuation?: CompanyValuation;
}

export interface CompanyCalendarEvents {
    symbol: string;
    maxAge: number;
    earnings: {
        earningsDate: Array<{
            raw: number;
            fmt: string;
        }>;
        earningsCallDate: Array<{
            raw: number;
            fmt: string;
        }>;
        earningsAverage: {
            raw: number;
            fmt: string;
        };
        earningsHigh: {
            raw: number;
            fmt: string;
        };
        earningsLow: {
            raw: number;
            fmt: string;
        };
        revenueAverage: {
            raw: number;
            fmt: string;
            longFmt: string;
        };
        revenueHigh: {
            raw: number;
            fmt: string;
            longFmt: string;
        };
        revenueLow: {
            raw: number;
            fmt: string;
            longFmt: string;
        };
        isEarningsDateEstimate: boolean;
    };
    dividendDate?: {
        raw: number;
        fmt: string;
    };
    exDividendDate?: {
        raw: number;
        fmt: string;
    };
}

export interface NewsItem {
    guid: string;
    link: string;
    pubDate: string;
    source: string;
    title: string;
}

export interface CompanyNews {
    symbol: string;
    maxAge: number;
    items: NewsItem[];
}
