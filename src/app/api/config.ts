export const API_TTL = {
    COMPANY: {
        PROFILE: 30 * 24 * 60 * 60,    // 30 days
        EVENTS: 7 * 24 * 60 * 60,      // 7 days
        NEWS: 6 * 60 * 60,             // 6 hours
        STATISTICS: 3 * 24 * 60 * 60,   // 3 days
        OUTLOOK: 1 * 24 * 60 * 60,     // 1 day
    },
    STOCK: {
        SNAPSHOT: 24 * 60 * 60,         // 24 hours
        QUOTE: 15 * 60,                 // 15 minutes
    }
} as const; 

export const API_ENDPOINTS = {
    COMPANY: {
        PROFILE: 'v3/profile/<ticker>',
        EVENTS: 'v1/markets/stock/modules',
        NEWS: 'v3/stock_news',
        STATISTICS: 'v1/markets/stock/modules',
        OUTLOOK: 'v4/company-outlook',
    },
    STOCK: {
        SNAPSHOT: 'v1/markets/stock/quotes',
        QUOTE: 'v3/quote/<ticker>',
    }
} as const; 

export const DYNAMODB_TABLES = {
    COMPANY: {
        PROFILE: 'Fundamental-CompanyProfile',
        EVENTS: 'Fundamental-CompanyEvents',
        NEWS: 'Fundamental-MarketNews',
        STATISTICS: 'Fundamental-StockStatistics',
        OUTLOOK: 'Fundamental-CompanyOutlook',
    },
    STOCK: {
        SNAPSHOT: 'Fundamental-StockSnapshot',
        QUOTE: 'Fundamental-StockQuote',
    }
} as const; 