import { API_TTL, API_ENDPOINTS, DYNAMODB_TABLES } from '../../config';
import { fetchFMPData } from '@/src/lib/fmpFinance';
import type { StockQuote } from '@/types/stock';

interface QuoteCache {
  [key: string]: any;
  lastUpdated: number;
  symbol: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let symbol = searchParams.get('symbol')?.toUpperCase();

  if (!symbol) {
    return Response.json({ error: 'Symbol is required' }, { status: 400 });
  }

  symbol = symbol.replace('.', '-');

  try {
    const response = await fetchFMPData<QuoteCache>({
      endpoint: API_ENDPOINTS.STOCK.QUOTE.replace('<ticker>', symbol),
      tableName: DYNAMODB_TABLES.STOCK.QUOTE,
      ttlSeconds: API_TTL.STOCK.QUOTE,
      cacheKey: symbol
    });

    // Extract quote from response
    const quote = response['0'] as StockQuote;
    if (!quote) {
      return Response.json(
        { error: 'Stock quote not found' },
        { status: 404 }
      );
    }

    return Response.json(quote);
  } catch (error) {
    console.error('Error fetching stock quote:', error);
    return Response.json(
      { error: 'Failed to fetch stock quote' },
      { status: 500 }
    );
  }
}

