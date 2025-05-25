import { API_TTL, API_ENDPOINTS, DYNAMODB_TABLES } from '../../config';
import { fetchFMPData } from '@/src/lib/aggregators/fmpFinance';
import type { HistoricalIncomeStatement } from '@/types/financials';

interface IncomeStatementCache {
  [key: string]: any;
  symbol: string;
  lastUpdated: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol')?.toUpperCase();

  if (!symbol) {
    return Response.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    const response = await fetchFMPData<IncomeStatementCache>({
      endpoint: API_ENDPOINTS.COMPANY.INCOME_STATEMENT.replace('<ticker>', symbol),
      tableName: DYNAMODB_TABLES.COMPANY.INCOME_STATEMENT,
      ttlSeconds: API_TTL.COMPANY.INCOME_STATEMENT,
      cacheKey: symbol,
      params: {
        period: 'quarter'
      }
    });

    // Extract the quarterly data from the response
    const statements = Object.entries(response)
      .filter(([key]) => !isNaN(Number(key)))
      .map(([_, value]) => value);

    const incomeData: HistoricalIncomeStatement = {
      symbol,
      data: statements,
      lastUpdated: response.lastUpdated
    };

    if (!incomeData.data.length) {
      return Response.json(
        { error: 'Income statement data not found' },
        { status: 404 }
      );
    }

    return Response.json(incomeData);
  } catch (error) {
    console.error('Error fetching income statement:', error);
    return Response.json(
      { error: 'Failed to fetch income statement' },
      { status: 500 }
    );
  }
}
