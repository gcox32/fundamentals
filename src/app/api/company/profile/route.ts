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
      endpoint: 'markets/stock/modules',
      params: {
        ticker: symbol,
        module: 'profile'
      },
      tableName: 'Fundamental-CompanyProfile',
      ttlSeconds: 30 * 24 * 60 * 60, // 30 days
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