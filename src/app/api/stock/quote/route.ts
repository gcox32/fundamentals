import { API_TTL, API_ENDPOINTS, DYNAMODB_TABLES } from '../../config';
import { fetchYahooFinanceData } from '@/utils/yahooFinance';
import type { StockQuote } from '@/types/stock';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol')?.toUpperCase();

  if (!symbol) {
    return Response.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    const data = await fetchYahooFinanceData<StockQuote & { lastUpdated: number }>({
      endpoint: API_ENDPOINTS.STOCK.QUOTE,
      params: {
        ticker: symbol,
        type: 'STOCKS'
      },
      tableName: DYNAMODB_TABLES.STOCK.QUOTE,
      ttlSeconds: API_TTL.STOCK.QUOTE,
      cacheKey: `${symbol}`
    });

    console.log('data', data);  

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch stock quote' },
      { status: 500 }
    );
  }
}

