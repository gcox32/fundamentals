import { CompanyEventDividends, CompanyEventEarnings, CompanyCalendarEvents } from '@/types/company';
import { API_TTL, API_ENDPOINTS, DYNAMODB_TABLES } from '../../config';
import { fetchFMPData } from '@/src/lib/aggregators/fmpFinance';

interface FMPResponse {
  [key: string]: any;
  lastUpdated: number;
  symbol: string;
}

function objectToArray<T>(obj: Record<string, any>): T[] {
  return Object.keys(obj)
    .filter(key => !isNaN(Number(key)))
    .map(key => obj[key]);
}

function parseDate(dateStr: string | undefined): { raw: number; fmt: string } {
  if (!dateStr) return { raw: 0, fmt: '' };
  
  // FMP dates are in YYYY-MM-DD format
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day); // month is 0-based in JS
  
  return {
    raw: date.getTime(),
    fmt: dateStr
  };
}

function getNextDates(earningsObj: FMPResponse, dividendsObj: FMPResponse, symbol: string): CompanyCalendarEvents {
  const now = new Date().getTime();
  
  // Convert objects to arrays and get next dates
  const earnings = objectToArray<CompanyEventEarnings>(earningsObj);
  const dividends = objectToArray<CompanyEventDividends>(dividendsObj);
  
  // Get next earnings date
  const nextEarnings = earnings
    .filter(e => new Date(e.date).getTime() > now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  // Get next dividend
  const nextDividend = dividends[0];

  const nextDatesResponse = {
    symbol,
    nextEarningsDate: parseDate(nextEarnings?.date),
    nextDividendDate: parseDate(nextDividend?.paymentDate),
    nextExDividendDate: parseDate(nextDividend?.recordDate)
  };

  return nextDatesResponse;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let symbol = searchParams.get('symbol')?.toUpperCase();

  if (!symbol) {
    return Response.json({ error: 'Symbol is required' }, { status: 400 });
  }

  symbol = symbol.replace('.', '-');

  try {
    const dividends = await fetchFMPData<FMPResponse>({
      endpoint: API_ENDPOINTS.COMPANY.DIVIDENDS,
      params: {
        symbol: symbol,
        limit: "1"
      },
      tableName: DYNAMODB_TABLES.COMPANY.EVENTS,
      ttlSeconds: API_TTL.COMPANY.EVENTS,
      cacheKey: `${symbol}_dividends`,
      stable: true
    });

    const earnings = await fetchFMPData<FMPResponse>({
      endpoint: API_ENDPOINTS.COMPANY.EARNINGS,
      params: {
        symbol: symbol,
        limit: "4"
      },
      tableName: DYNAMODB_TABLES.COMPANY.EVENTS,
      ttlSeconds: API_TTL.COMPANY.EVENTS,
      cacheKey: `${symbol}_earnings`,
      stable: true
    }); 

    return Response.json(getNextDates(earnings, dividends, symbol));
  } catch (error) {
    return Response.json(
      { error: 'Failed to fetch company events' },
      { status: 500 }
    );
  }
}