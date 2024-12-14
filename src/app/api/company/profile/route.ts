import { API_TTL, API_ENDPOINTS, DYNAMODB_TABLES } from '../../config';
import { fetchYahooFinanceData } from '@/utils/yahooFinance';
import { CompanyProfile } from '@/types/company';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol')?.toUpperCase();

  if (!symbol) {
    return Response.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    const data = await fetchYahooFinanceData<CompanyProfile & { lastUpdated: number }>({
      endpoint: API_ENDPOINTS.COMPANY.PROFILE,
      params: {
        ticker: symbol,
        module: 'profile'
      },
      tableName: DYNAMODB_TABLES.COMPANY.PROFILE,
      ttlSeconds: API_TTL.COMPANY.PROFILE,
      cacheKey: `${symbol}`
    });

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch company profile' },
      { status: 500 }
    );
  }
}