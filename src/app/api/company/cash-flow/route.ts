import { API_TTL, API_ENDPOINTS, DYNAMODB_TABLES } from '../../config';
import { fetchFMPData } from '@/utils/fmpFinance';
import type { HistoricalCashFlowStatement } from '@/types/financials';

interface CashFlowCache {
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
    const response = await fetchFMPData<CashFlowCache>({
      endpoint: API_ENDPOINTS.COMPANY.CASH_FLOW_STATEMENT.replace('<ticker>', symbol),
      tableName: DYNAMODB_TABLES.COMPANY.CASH_FLOW_STATEMENT,
      ttlSeconds: API_TTL.COMPANY.CASH_FLOW_STATEMENT,
      cacheKey: symbol,
      params: {
        period: 'quarter'
      }
    });

    // Extract the quarterly data from the response
    const statements = Object.entries(response)
      .filter(([key]) => !isNaN(Number(key)))
      .map(([_, value]) => value);

    const cashFlowData: HistoricalCashFlowStatement = {
      symbol,
      data: statements,
      lastUpdated: response.lastUpdated
    };

    if (!cashFlowData.data.length) {
      return Response.json(
        { error: 'Cash flow statement data not found' },
        { status: 404 }
      );
    }

    return Response.json(cashFlowData);
  } catch (error) {
    console.error('Error fetching cash flow statement:', error);
    return Response.json(
      { error: 'Failed to fetch cash flow statement' },
      { status: 500 }
    );
  }
}
