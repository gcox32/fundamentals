export const API_TTL = {
    COMPANY: {
        PROFILE: 30 * 24 * 60 * 60,    // 30 days
        EVENTS: 7 * 24 * 60 * 60,      // 7 days
        NEWS: 6 * 60 * 60,             // 6 hours
        STATISTICS: 3 * 24 * 60 * 60,   // 3 days
    }
} as const; 

export const API_ENDPOINTS = {
    COMPANY: {
        PROFILE: 'v1/markets/stock/modules',
        EVENTS: 'v1/markets/stock/modules',
        NEWS: 'v2/market/news',
        STATISTICS: 'v1/markets/stock/modules',
    }
} as const; 

export const DYNAMODB_TABLES = {
    COMPANY: {
        PROFILE: 'Fundamental-CompanyProfile',
        EVENTS: 'Fundamental-CompanyEvents',
        NEWS: 'Fundamental-MarketNews',
        STATISTICS: 'Fundamental-StockStatistics',
    }
} as const; 