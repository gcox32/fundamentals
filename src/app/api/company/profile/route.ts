import { NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { CompanyProfile, CompanyProfileWithMetadata } from '@/types/company';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!
  }
});
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME;
const RAPID_API_KEY = process.env.RAPID_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol')?.toUpperCase();

  console.log('Profile request received for symbol:', symbol);

  if (!symbol) {
    console.log('No symbol provided');
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    // First, try to get from DynamoDB
    const getCommand = new GetCommand({
      TableName: TABLE_NAME,
      Key: { symbol }
    });

    console.log('Checking DynamoDB for:', symbol);
    const { Item: cachedProfile } = await docClient.send(getCommand);

    // If found and not stale (e.g., less than 1 month old), return it
    if (cachedProfile && 
        Date.now() - (cachedProfile as CompanyProfileWithMetadata).lastUpdated < 30 * 24 * 60 * 60 * 1000) {
      console.log('Found fresh cached profile for:', symbol);
      const { lastUpdated, ...profileData } = cachedProfile as CompanyProfileWithMetadata;
      return NextResponse.json(profileData);
    }

    console.log('Fetching fresh profile from Yahoo Finance for:', symbol);
    // If not found or stale, fetch from Yahoo Finance API
    const response = await fetch(
      `https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock/modules?ticker=${symbol}&module=profile`,
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
      throw new Error('Failed to fetch company profile');
    }

    const data = await response.json();
    console.log('Received profile data from Yahoo Finance for:', symbol);
    const profile = data.body as CompanyProfile;
    profile.symbol = symbol;

    // Store in DynamoDB with granular fields
    const dbItem: CompanyProfileWithMetadata = {
      ...profile,
      lastUpdated: Date.now()
    };

    console.log('Storing profile in DynamoDB for:', symbol, dbItem);
    const putCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: dbItem
    });

    await docClient.send(putCommand);
    console.log('Successfully stored profile in DynamoDB for:', symbol);

    // Return the profile without metadata
    const { lastUpdated, ...profileData } = dbItem;
    return NextResponse.json(profileData);
  } catch (error) {
    console.error('Profile fetch error:', {
      symbol,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { error: 'Failed to fetch company profile' }, 
      { status: 500 }
    );
  }
}