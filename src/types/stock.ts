export interface StockStatistics {
    symbol: string;
    maxAge: number;
    enterpriseValue: {
        raw: number;
        fmt: string;
        longFmt: string;
    };
    beta: {
        raw: number;
        fmt: string;
    };
    forwardPE: {
        raw: number;
        fmt: string;
    };
    priceToBook: {
        raw: number;
        fmt: string;
    };
    profitMargins: {
        raw: number;
        fmt: string;
    };
    sharesOutstanding: {
        raw: number;
        fmt: string;
        longFmt: string;
    };
    floatShares: {
        raw: number;
        fmt: string;
        longFmt: string;
    };
    heldPercentInsiders: {
        raw: number;
        fmt: string;
    };
    heldPercentInstitutions: {
        raw: number;
        fmt: string;
    };
    shortRatio: {
        raw: number;
        fmt: string;
    };
    ["52WeekChange"]: {
        raw: number;
        fmt: string;
    };
}

export interface StockSnapshotItem {
  symbol: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  marketState: string;
  regularMarketDayRange: string;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  averageDailyVolume3Month: number;
  marketCap: number;
  fiftyTwoWeekRange: string;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  trailingPE: number;
  dividendRate: number;
  dividendYield: number;
  trailingAnnualDividendYield: number;
  priceToBook: number;
  forwardPE: number;
  bookValue: number;
  sharesOutstanding: number;
  averageDailyVolume10Day: number;
  currency: string;
  longName: string;
  shortName: string;
  exchangeTimezoneName: string;
  exchangeTimezoneShortName: string;
  exchange: string;
  fullExchangeName: string;
}