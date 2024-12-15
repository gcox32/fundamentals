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