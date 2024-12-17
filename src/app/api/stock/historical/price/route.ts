import { API_TTL, API_ENDPOINTS, DYNAMODB_TABLES } from '../../../config';
import { fetchFMPData } from '@/utils/fmpFinance';
import type { HistoricalPriceData } from '@/types/stock';

interface HistoricalPriceCache {
    [key: string]: any;
    lastUpdated: number;
    symbol: string;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol')?.toUpperCase();
    const from = searchParams.get('from');
    const to = searchParams.get('to');

    if (!symbol) {
        return Response.json({ error: 'Symbol is required' }, { status: 400 });
    }

    try {
        const params: Record<string, string> = {};
        if (from) params.from = from;
        if (to) params.to = to;

        const response = await fetchFMPData<HistoricalPriceCache>({
            endpoint: API_ENDPOINTS.STOCK.HISTORICAL_PRICE.replace('<ticker>', symbol),
            params,
            tableName: DYNAMODB_TABLES.STOCK.HISTORICAL_PRICE,
            ttlSeconds: API_TTL.STOCK.HISTORICAL_PRICE,
            cacheKey: symbol
        });

        if (!response) {
            return Response.json(
                { error: 'Historical price data not found' },
                { status: 404 }
            );
        }

        return Response.json(response as HistoricalPriceData);
    } catch (error) {
        console.error('Error fetching historical price data:', error);
        return Response.json(
            { error: 'Failed to fetch historical price data' },
            { status: 500 }
        );
    }
}
