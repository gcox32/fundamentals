export const API_TTL = {
    COMPANY: {
        EVENTS: 7 * 24 * 60 * 60,      // 7 days
        NEWS: 6 * 60 * 60,             // 6 hours
        OUTLOOK: 1 * 24 * 60 * 60,     // 1 day
    },
    STOCK: {
        QUOTE: 15 * 60,                 // 15 minutes
        HISTORICAL_PRICE: 1 * 24 * 60 * 60,     // 1 day
        HISTORICAL_SHARES_OUTSTANDING: 1 * 24 * 60 * 60,    // 1 day
    }
} as const; 

export const API_ENDPOINTS = {
    COMPANY: {
        EVENTS: 'v1/markets/stock/modules',
        NEWS: 'v3/stock_news',
        OUTLOOK: 'v4/company-outlook',
    },
    STOCK: {
        QUOTE: 'v3/quote/<ticker>',
        HISTORICAL_PRICE: 'v3/historical-price-full/<ticker>',
        HISTORICAL_SHARES_OUTSTANDING: 'v4/historical/shares_float',
    }
} as const; 

export const DYNAMODB_TABLES = {
    COMPANY: {
        EVENTS: 'Fundamental-CompanyEvents',
        NEWS: 'Fundamental-MarketNews',
        OUTLOOK: 'Fundamental-CompanyOutlook',
    },
    STOCK: {
        QUOTE: 'Fundamental-StockQuote',
        HISTORICAL_PRICE: 'Fundamental-StockHistoricalPrice',
        HISTORICAL_SHARES_OUTSTANDING: 'Fundamental-HistoricalSharesOutstanding',
    }
} as const; 