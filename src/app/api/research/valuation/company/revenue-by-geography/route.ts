import { API_TTL, API_ENDPOINTS, DYNAMODB_TABLES } from '../../config';
import { fetchFMPData } from '@/src/lib/fmpFinance';
import type { HistoricalRevenueByGeography } from '@/types/company';

interface CacheableRevenueData {
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
    const response = await fetchFMPData<CacheableRevenueData>({
      endpoint: API_ENDPOINTS.COMPANY.REVENUE_BY_GEOGRAPHY,
      tableName: DYNAMODB_TABLES.COMPANY.REVENUE_BY_GEOGRAPHY,
      ttlSeconds: API_TTL.COMPANY.REVENUE_BY_GEOGRAPHY,
      cacheKey: symbol,
      params: {
        symbol,
        structure: 'flat',
        period: 'quarter'
      }
    });

    // Transform the response into the expected format
    const revenueData: HistoricalRevenueByGeography = {
      symbol,
      data: Object.entries(response)
        .filter(([key]) => !isNaN(Number(key)))
        .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
      lastUpdated: response.lastUpdated
    };

    if (!Object.keys(revenueData.data).length) {
      return Response.json(
        { error: 'Revenue geography data not found' },
        { status: 404 }
      );
    }

    return Response.json(revenueData);
  } catch (error) {
    console.error('Error fetching revenue by geography:', error);
    return Response.json(
      { error: 'Failed to fetch revenue by geography' },
      { status: 500 }
    );
  }
}
