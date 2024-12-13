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

interface Events {
    nextEarningsDate: string;
    nextDividendDate: string;
    nextExDividendDate: string;
}

interface Valuation {
    marketCap: number;
    peRatioTTM: number;
    peRatioForward: number;
}

export interface CompanySummaryProps {
    isLoading?: boolean;
    profile?: CompanyProfile;
    events?: Events;
    valuation?: Valuation;
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
}

export interface CompanyEvents {
    nextEarningsDate: string;
    nextDividendDate: string;
    nextExDividendDate: string;
}

export interface CompanyValuation {
    marketCap: number;
    peRatioTTM: number;
    peRatioForward: number;
}

export interface CompanySummaryProps {
    isLoading?: boolean;
    profile?: CompanyProfile;
    events?: CompanyEvents;
    valuation?: CompanyValuation;
}