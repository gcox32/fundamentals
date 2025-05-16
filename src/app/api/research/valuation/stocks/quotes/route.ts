import { API_TTL, API_ENDPOINTS, DYNAMODB_TABLES } from '../../config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import type { StockQuote } from '@/types/stock';

const client = new DynamoDBClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!
  }
});

const docClient = DynamoDBDocumentClient.from(client);
const FMP_API_KEY = process.env.FMP_API_KEY;

interface QuotesCache {
  lastUpdated: number;
  portfolioId: string;
  symbols: string[];
  quotes: StockQuote[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let symbols = searchParams.get('symbols')?.toUpperCase();
  const portfolioId = searchParams.get('portfolioId');

  if (!symbols || !portfolioId) {
    return Response.json({ error: 'Symbols and portfolioId are required' }, { status: 400 });
  }

  // Clean up symbols
  const symbolsArray = symbols.split(',').map(s => s.trim().replace('.', '-'));
  const symbolsString = symbolsArray.join(',');

  try {
    // Check cache first
    const cacheResult = await docClient.send(
      new GetCommand({
        TableName: DYNAMODB_TABLES.STOCK.BATCH_QUOTE,
        Key: { portfolioId }
      })
    );

    if (cacheResult.Item) {
      const cachedData = cacheResult.Item.data as QuotesCache;
      const age = Date.now() - cachedData.lastUpdated;
      
      // If cache is fresh and symbols match, return cached data
      if (age < API_TTL.STOCK.BATCH_QUOTE * 1000 && 
          JSON.stringify(cachedData.symbols.sort()) === JSON.stringify(symbolsArray.sort())) {
        return Response.json(
          cachedData.quotes.reduce((acc, quote) => {
            acc[quote.symbol] = quote;
            return acc;
          }, {} as Record<string, StockQuote>)
        );
      }
    }

    // Fetch fresh data
    const response = await fetch(
      `https://financialmodelingprep.com/api/${API_ENDPOINTS.STOCK.BATCH_QUOTE.replace('<tickers>', symbolsString)}?apikey=${FMP_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const quotes = await response.json() as StockQuote[];
    
    if (!Array.isArray(quotes)) {
      return Response.json(
        { error: 'Invalid response format' },
        { status: 500 }
      );
    }

    // Cache the response
    const cacheData: QuotesCache = {
      portfolioId,
      symbols: symbolsArray,
      lastUpdated: Date.now(),
      quotes
    };

    await docClient.send(
      new PutCommand({
        TableName: DYNAMODB_TABLES.STOCK.BATCH_QUOTE,
        Item: {
          portfolioId,
          data: cacheData,
          ttl: Math.floor(Date.now() / 1000) + API_TTL.STOCK.BATCH_QUOTE
        }
      })
    );

    // Return quotes map
    const quotesMap = quotes.reduce((acc, quote) => {
      acc[quote.symbol] = quote;
      return acc;
    }, {} as Record<string, StockQuote>);

    return Response.json(quotesMap);
  } catch (error) {
    console.error('Error fetching stock quotes:', error);
    return Response.json(
      { error: 'Failed to fetch stock quotes' },
      { status: 500 }
    );
  }
}
