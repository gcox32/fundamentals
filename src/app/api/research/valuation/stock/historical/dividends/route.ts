import { API_TTL, API_ENDPOINTS, DYNAMODB_TABLES } from '../../../config';
import { fetchFMPData } from '@/src/lib/fmpFinance';
import type { HistoricalDividendData } from '@/types/stock';

interface DividendCache {
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
    const response = await fetchFMPData<DividendCache>({
      endpoint: API_ENDPOINTS.STOCK.HISTORICAL_DIVIDENDS.replace('<ticker>', symbol),
      tableName: DYNAMODB_TABLES.STOCK.HISTORICAL_DIVIDENDS,
      ttlSeconds: API_TTL.STOCK.HISTORICAL_DIVIDENDS,
      cacheKey: symbol,
      params: {
        symbol
      }
    });

    // Transform the response into the expected format
    const dividendData: HistoricalDividendData = {
      symbol,
      historical: response.historical || [],
      lastUpdated: response.lastUpdated
    };

    if (!dividendData.historical.length) {
      return Response.json(
        { error: 'Dividend history not found' },
        { status: 404 }
      );
    }

    return Response.json(dividendData);
  } catch (error) {
    console.error('Error fetching dividend history:', error);
    return Response.json(
      { error: 'Failed to fetch dividend history' },
      { status: 500 }
    );
  }
} 