import { API_TTL, API_ENDPOINTS, DYNAMODB_TABLES } from '../../../config';
import { fetchFMPData } from '@/utils/fmpFinance';
import type { HistoricalSharesOutstanding, HistoricalShares } from '@/types/stock';

type RawSharesData = Array<{
    date: string;
    freeFloat: number;
    floatShares: number;
    outstandingShares: number;
    source: string | null;
    symbol: string;
}>;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    let symbol = searchParams.get('symbol')?.toUpperCase();

    if (!symbol) {
        return Response.json({ error: 'Symbol is required' }, { status: 400 });
    }

    symbol = symbol.replace('.', '-');

    try {
        const response = await fetchFMPData<HistoricalSharesOutstanding, RawSharesData>({
            endpoint: API_ENDPOINTS.STOCK.HISTORICAL_SHARES_OUTSTANDING,
            params: { symbol },
            tableName: DYNAMODB_TABLES.STOCK.HISTORICAL_SHARES_OUTSTANDING,
            ttlSeconds: API_TTL.STOCK.HISTORICAL_SHARES_OUTSTANDING,
            cacheKey: symbol,
            transform: (rawData) => ({
                symbol,
                historical: rawData
                    .filter((_, index) => index % 30 === 0)
                    .map(item => ({
                        date: item.date,
                        freeFloat: item.freeFloat,
                        floatShares: item.floatShares,
                        outstandingShares: item.outstandingShares,
                        source: item.source
                    })),
                lastUpdated: Date.now()
            })
        });

        if (!response?.historical?.length) {
            return Response.json(
                { error: 'Historical shares outstanding data not found' },
                { status: 404 }
            );
        }

        return Response.json(response);
    } catch (error) {
        console.error('Error fetching historical shares outstanding data:', error);
        return Response.json(
            { error: 'Failed to fetch historical shares outstanding data' },
            { status: 500 }
        );
    }
}