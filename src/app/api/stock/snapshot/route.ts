import { API_TTL, API_ENDPOINTS, DYNAMODB_TABLES } from '../../config';
import { fetchYahooFinanceData } from '@/utils/yahooFinance';
import type { StockSnapshotItem } from '@/types/stock';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol')?.toUpperCase();

  if (!symbol) {
    return Response.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    const data = await fetchYahooFinanceData<{ '0': StockSnapshotItem; symbol: string; lastUpdated: number }>({
      endpoint: API_ENDPOINTS.STOCK.SNAPSHOT,
      params: {
        ticker: symbol,
        module: 'quotes'
      },
      tableName: DYNAMODB_TABLES.STOCK.SNAPSHOT,
      ttlSeconds: API_TTL.STOCK.SNAPSHOT,
      cacheKey: `${symbol}`
    });

    // Extract the data from the '0' key
    const snapshotItem = data['0'];
    return Response.json(snapshotItem);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch stock snapshot' },
      { status: 500 }
    );
  }
}
