import { fetchYahooFinanceData } from '@/utils/yahooFinance';
import { CompanyNews } from '@/types/company';
import { API_TTL, API_ENDPOINTS, DYNAMODB_TABLES } from '../../config';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol')?.toUpperCase();

  if (!symbol) {
    return Response.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    const data = await fetchYahooFinanceData<CompanyNews & { lastUpdated: number }>({
      endpoint: API_ENDPOINTS.COMPANY.NEWS,
      params: {
        tickers: symbol,
        type: 'ALL'
      },
      tableName: DYNAMODB_TABLES.COMPANY.NEWS,
      ttlSeconds: API_TTL.COMPANY.NEWS,
      cacheKey: `${symbol}`
    });

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch company news' },
      { status: 500 }
    );
  }
}
