import { API_TTL, API_ENDPOINTS, DYNAMODB_TABLES } from '../../config';
import { fetchYahooFinanceData } from '@/utils/yahooFinance';
import type { StockStatistics } from '@/types/stock';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol')?.toUpperCase();

  if (!symbol) {
    return Response.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    const data = await fetchYahooFinanceData<StockStatistics & { lastUpdated: number }>({
      endpoint: API_ENDPOINTS.COMPANY.STATISTICS,
      params: {
        ticker: symbol,
        module: 'statistics'
      },
      tableName: DYNAMODB_TABLES.COMPANY.STATISTICS,
      ttlSeconds: API_TTL.COMPANY.STATISTICS,
      cacheKey: `${symbol}`
    });

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch company statistics' },
      { status: 500 }
    );
  }
}