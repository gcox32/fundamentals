import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!
  }
});

const docClient = DynamoDBDocumentClient.from(client);
const RAPID_API_KEY = process.env.RAPID_API_KEY;

interface CacheableData {
  [key: string]: any;
  lastUpdated: number;
  symbol: string;
}

export async function fetchYahooFinanceData<T extends CacheableData>({
  endpoint,
  params,
  tableName,
  ttlSeconds,
  cacheKey
}: {
  endpoint: string;
  params: Record<string, string>;
  tableName: string;
  ttlSeconds: number;
  cacheKey: string;
}): Promise<Omit<T, 'lastUpdated'>> {
  try {
    // Try to get from DynamoDB first
    const getCommand = new GetCommand({
      TableName: tableName,
      Key: { symbol: cacheKey }
    });

    console.log(`Checking DynamoDB for: ${cacheKey}`);
    const { Item: cachedData } = await docClient.send(getCommand);

    // If found and not stale, return it
    if (cachedData && 
        Date.now() - (cachedData as T).lastUpdated < ttlSeconds * 1000) {
      console.log(`Found fresh cached data for: ${cacheKey}`);
      const { lastUpdated, ...data } = cachedData as T;
      return data;
    }

    // Build the query string from params
    const queryString = new URLSearchParams(params).toString();
    
    console.log(`Fetching fresh data from Yahoo Finance for: ${cacheKey}`);
    const response = await fetch(
      `https://yahoo-finance15.p.rapidapi.com/api/v1/${endpoint}?${queryString}`,
      {
        headers: {
          'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com',
          'X-RapidAPI-Key': RAPID_API_KEY!
        }
      }
    );

    if (!response.ok) {
      console.error('Yahoo Finance API error:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Failed to fetch data from Yahoo Finance: ${response.statusText}`);
    }

    const { body } = await response.json();

    // Store in DynamoDB with metadata
    const dbItem: T = {
      ...body,
      symbol: cacheKey,
      lastUpdated: Date.now()
    } as T;

    console.log(`Storing data in DynamoDB for: ${cacheKey}`);
    const putCommand = new PutCommand({
      TableName: tableName,
      Item: dbItem
    });

    await docClient.send(putCommand);
    console.log(`Successfully stored data in DynamoDB for: ${cacheKey}`);

    // Return the data without metadata
    const { lastUpdated, ...data } = dbItem;
    return data;
  } catch (error) {
    console.error('Data fetch error:', {
      symbol: cacheKey,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
} 