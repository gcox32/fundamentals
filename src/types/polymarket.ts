export interface Market {
    id: string;
    question: string;
    description: string;
    outcomes: string; // still stringified
    outcomePrices: string; // still stringified
    active: boolean;
    closed: boolean;
    endDate: string;
    startDate: string;
    updatedAt: string;
    volume: string;
    liquidity: string;
    image?: string;
    slug?: string;
    lastTradePrice?: number;
    bestBid?: number;
    bestAsk?: number;
    spread?: number;
}

export interface ParsedMarket {
    id: string;
    question: string;
    description: string;
    outcomes: string[];
    outcomePrices: string[];
    endDate: string;
    startDate: string;
    updatedAt: string;
    volume: number;
    liquidity: number;
    image?: string;
    slug?: string;
    yesPrice: number;
    noPrice: number;
    spread?: number;
    bestBid?: number;
    bestAsk?: number;
}