import { API_TTL, API_ENDPOINTS, DYNAMODB_TABLES } from '../../config';
import { fetchFMPData } from '@/src/lib/aggregators/fmpFinance';
import type { HistoricalBalanceSheetStatement } from '@/types/financials';

interface BalanceSheetCache {
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
    const response = await fetchFMPData<BalanceSheetCache>({
      endpoint: API_ENDPOINTS.COMPANY.BALANCE_SHEET_STATEMENT.replace('<ticker>', symbol),
      tableName: DYNAMODB_TABLES.COMPANY.BALANCE_SHEET_STATEMENT,
      ttlSeconds: API_TTL.COMPANY.BALANCE_SHEET_STATEMENT,
      cacheKey: symbol,
      params: {
        period: 'quarter'
      }
    });

    // Extract the quarterly data from the response
    const statements = Object.entries(response)
      .filter(([key]) => !isNaN(Number(key)))
      .map(([_, value]) => value);

    const balanceSheetData: HistoricalBalanceSheetStatement = {
      symbol,
      data: statements,
      lastUpdated: response.lastUpdated
    };

    if (!balanceSheetData.data.length) {
      return Response.json(
        { error: 'Balance sheet data not found' },
        { status: 404 }
      );
    }

    return Response.json(balanceSheetData);
  } catch (error) {
    console.error('Error fetching balance sheet:', error);
    return Response.json(
      { error: 'Failed to fetch balance sheet' },
      { status: 500 }
    );
  }
}
