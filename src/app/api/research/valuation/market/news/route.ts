import { API_TTL, API_ENDPOINTS, DYNAMODB_TABLES } from '../../config';
import { fetchFMPData } from '@/src/lib/fmpFinance';
import type { MarketNews } from '@/types/company';

interface NewsCache {
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
    const toDate = new Date();
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - 7);

    const response = await fetchFMPData<NewsCache>({
      endpoint: API_ENDPOINTS.COMPANY.NEWS,
      params: {
        tickers: symbol,
        page: '0',
        from: fromDate.toISOString().split('T')[0],
        to: toDate.toISOString().split('T')[0]
      },
      tableName: DYNAMODB_TABLES.COMPANY.NEWS,
      ttlSeconds: API_TTL.COMPANY.NEWS,
      cacheKey: symbol
    });

    // Convert object to array and filter out metadata
    const newsArray = Object.entries(response)
      .filter(([key]) => !isNaN(Number(key)))
      .map(([_, value]) => value as MarketNews);

    if (!newsArray.length) {
      return Response.json(
        { error: 'No news found for this symbol' },
        { status: 404 }
      );
    }

    return Response.json(newsArray);
  } catch (error) {
    console.error('Error fetching market news:', error);
    return Response.json(
      { error: 'Failed to fetch market news' },
      { status: 500 }
    );
  }
}