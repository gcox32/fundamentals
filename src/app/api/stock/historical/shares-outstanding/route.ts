import { API_TTL, API_ENDPOINTS, DYNAMODB_TABLES } from '../../../config';
import { fetchFMPData } from '@/utils/fmpFinance';
import type { HistoricalSharesOutstanding } from '@/types/stock';

interface SharesOutstandingCache {
    [key: string]: any;
    lastUpdated: number;
    symbol: string;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol')?.toUpperCase();

    if (!symbol) {
        return Response.json({ error: 'Symbol is required' }, { status: 400 });
    }

    try {
        const response = await fetchFMPData<SharesOutstandingCache>({
            endpoint: API_ENDPOINTS.STOCK.HISTORICAL_SHARES_OUTSTANDING,
            params: {
                symbol: symbol,
            },
            tableName: DYNAMODB_TABLES.STOCK.HISTORICAL_SHARES_OUTSTANDING,
            ttlSeconds: API_TTL.STOCK.HISTORICAL_SHARES_OUTSTANDING,
            cacheKey: symbol
        });

        if (!response) {
            return Response.json(
                { error: 'Historical shares outstanding data not found' },
                { status: 404 }
            );
        }

        return Response.json(response as HistoricalSharesOutstanding);
    } catch (error) {
        console.error('Error fetching historical shares outstanding data:', error);
        return Response.json(
            { error: 'Failed to fetch historical shares outstanding data' },
            { status: 500 }
        );
    }
}