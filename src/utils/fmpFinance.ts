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
const FMP_API_KEY = process.env.FMP_API_KEY;

interface CacheableData {
  lastUpdated: number;
  [key: string]: any;
  symbol: string;
}

export async function fetchFMPData<T extends CacheableData>({
  endpoint,
  params = {},
  tableName,
  ttlSeconds,
  cacheKey
}: {
  endpoint: string;
  params?: Record<string, string>;
  tableName: string;
  ttlSeconds: number;
  cacheKey: string;
}): Promise<T> {
  try {
    console.log('=== FMP Data Fetch Start ===');
    console.log('Cache Key:', cacheKey);
    console.log('Table Name:', tableName);
    console.log('Endpoint:', endpoint);

    // Check cache first
    console.log('Checking DynamoDB cache...');
    const cacheResult = await docClient.send(
      new GetCommand({
        TableName: tableName,
        Key: { symbol: cacheKey }
      })
    );

    if (cacheResult.Item) {
      console.log('Found cached item:', JSON.stringify(cacheResult.Item, null, 2));
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
    
    console.log('Fetching from FMP API:', fullEndpoint.replace(FMP_API_KEY!, '[REDACTED]'));
    const response = await fetch(fullEndpoint);

    if (!response.ok) {
      console.error('FMP API Error:', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`FMP API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));

    const dataWithTimestamp = {
      ...data,
      symbol: cacheKey,
      lastUpdated: Date.now()
    } as T;

    // Cache the response
    console.log('Caching response in DynamoDB...');
    const putItem = {
      symbol: cacheKey,
      data: dataWithTimestamp,
      ttl: Math.floor(Date.now() / 1000) + ttlSeconds
    };
    console.log('Cache item:', JSON.stringify(putItem, null, 2));

    await docClient.send(
      new PutCommand({
        TableName: tableName,
        Item: putItem
      })
    );
    console.log('Successfully cached data');
    console.log('=== FMP Data Fetch Complete ===');

    return dataWithTimestamp;
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