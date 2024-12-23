import { fetchYahooFinanceData } from '@/utils/yahooFinance';
import { CompanyCalendarEvents } from '@/types/company';
import { API_TTL, API_ENDPOINTS, DYNAMODB_TABLES } from '../../config';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let symbol = searchParams.get('symbol')?.toUpperCase();

  if (!symbol) {
    return Response.json({ error: 'Symbol is required' }, { status: 400 });
  }

  symbol = symbol.replace('.', '-');

  try {
    const data = await fetchYahooFinanceData<CompanyCalendarEvents & { lastUpdated: number }>({
      endpoint: API_ENDPOINTS.COMPANY.EVENTS,
      params: {
        ticker: symbol,
        module: 'calendar-events'
      },
      tableName: DYNAMODB_TABLES.COMPANY.EVENTS,
      ttlSeconds: API_TTL.COMPANY.EVENTS,
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