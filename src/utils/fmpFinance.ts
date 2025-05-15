import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!
  }
});

const docClient = DynamoDBDocumentClient.from(client);
const FMP_API_KEY = process.env.FMP_API_KEY;

interface CacheableData {
  lastUpdated: number;
  symbol: string;
  [key: string]: any;
}

interface FetchOptions<T extends CacheableData, R = any> {
  endpoint: string;
  params?: Record<string, string>;
  tableName: string;
  ttlSeconds: number;
  cacheKey: string;
  transform?: (rawData: R) => T;
}

export async function fetchFMPData<T extends CacheableData, R = any>({
  endpoint,
  params = {},
  tableName,
  ttlSeconds,
  cacheKey,
  transform
}: FetchOptions<T, R>): Promise<T> {
  try {
    // Check cache first
    console.log('Checking DynamoDB cache...');
    const cacheResult = await docClient.send(
      new GetCommand({
        TableName: tableName,
        Key: { symbol: cacheKey }
      })
    );

    if (cacheResult.Item) {
      const cachedData = cacheResult.Item.data as T;
      const age = Date.now() - cachedData.lastUpdated;
      
      if (age < ttlSeconds * 1000) {
        console.log(`Cache hit! Data age: ${age/1000}s`);
        return cachedData;
      }
      console.log(`Cache expired. Age: ${age/1000}s, TTL: ${ttlSeconds}s`);
    } else {
      console.log('No cached data found');
    }

    // Add API key to params
    params = { ...params, apikey: FMP_API_KEY! };

    // Build the query string
    const queryString = new URLSearchParams(params).toString();
    const fullEndpoint = `https://financialmodelingprep.com/api/${endpoint}?${queryString}` as string;
    
    const response = await fetch(fullEndpoint);

    if (!response.ok) {
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`API responded with status: ${response.status}`);
    }

    const rawData = await response.json() as R;
    
    // Transform the data if a transform function is provided
    const transformedData = transform ? transform(rawData) : ({
      ...rawData,
      symbol: cacheKey,
      lastUpdated: Date.now()
    } as unknown as T);

    // Cache the response
    const putItem = {
      symbol: cacheKey,
      data: transformedData,
      ttl: Math.floor(Date.now() / 1000) + ttlSeconds
    };

    await docClient.send(
      new PutCommand({
        TableName: tableName,
        Item: putItem
      })
    );

    return transformedData;
  } catch (error) {
    console.error('Error in fetchFMPData:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      params: {
        endpoint,
        tableName,
        cacheKey
      }
    });
    throw error;
  }
} 