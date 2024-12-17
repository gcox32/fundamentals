export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  changesPercentage: number;
  change: number;
  dayLow: number;
  dayHigh: number;
  yearHigh: number;
  yearLow: number;
  marketCap: number;
  priceAvg50: number;
  priceAvg200: number;
  exchange: string;
  volume: number;
  avgVolume: number;
  open: number;
  previousClose: number;
  eps: number;
  pe: number;
  earningsAnnouncement: string;
  sharesOutstanding: number;
  timestamp: number;
}

export interface HistoricalPrice {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
    adjClose: number;
    volume: number;
    unadjustedVolume: number;
    change: number;
    changePercent: number;
    vwap: number;
    label: string;
    changeOverTime: number;
}

export interface HistoricalPriceData {
    symbol: string;
    historical: HistoricalPrice[];
    lastUpdated?: number;
}   

export interface HistoricalShares {
    date: string;
    freeFloat: number;
    floatShares: number;
    outstandingShares: number;
    source: string | null;
}

export interface HistoricalSharesOutstanding {
    symbol: string;
    historical: HistoricalShares[];
    lastUpdated: number;
}

export interface HistoricalDividend {
    date: string;
    label: string;
    adjDividend: number;
    dividend: number;
    recordDate: string;
    paymentDate: string;
    declarationDate: string;
}

export interface HistoricalDividendData {
    symbol: string;
    historical: HistoricalDividend[];
    lastUpdated?: number;
}