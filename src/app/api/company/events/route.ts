import { fetchYahooFinanceData } from '@/utils/yahooFinance';
import { CompanyCalendarEvents } from '@/types/company';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol')?.toUpperCase();

  if (!symbol) {
    return Response.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    const data = await fetchYahooFinanceData<CompanyCalendarEvents & { lastUpdated: number }>({
      endpoint: 'markets/stock/modules',
      params: {
        ticker: symbol,
        module: 'calendar-events'
      },
      tableName: 'Fundamental-CompanyEvents',
      ttlSeconds: 7 * 24 * 60 * 60, // 7 days
      cacheKey: `${symbol}`
    });

    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch company events' },
      { status: 500 }
    );
  }
}