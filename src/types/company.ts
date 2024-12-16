export interface CompanyProfile {
  symbol: string;
  price: number;
  beta: number;
  volAvg: number;
  mktCap: number;
  lastDiv: number;
  range: string;
  changes: number;
  companyName: string;
  currency: string;
  cik: string;
  isin: string;
  cusip: string;
  exchange: string;
  exchangeShortName: string;
  industry: string;
  website: string;
  description: string;
  ceo: string;
  sector: string;
  country: string;
  fullTimeEmployees: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  dcfDiff: number;
  dcf: number;
  image: string;
  ipoDate: string;
  defaultImage: boolean;
  isEtf: boolean;
  isActivelyTrading: boolean;
  isAdr: boolean;
  isFund: boolean;
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