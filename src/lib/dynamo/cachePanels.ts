import {
    GetItemCommand,
    PutItemCommand,
  } from '@aws-sdk/client-dynamodb';
  import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
  import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
  
  const client = new DynamoDBClient({
    region: process.env.REGION,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY_ID!,
      secretAccessKey: process.env.SECRET_ACCESS_KEY!
    }
  });

  const TABLE_NAME = 'Fundamental-LeadingIndicators-Panels';
  
  export async function getLeadingIndicatorsByDate(date: string) {
    const command = new GetItemCommand({
      TableName: TABLE_NAME,
      Key: { date: { S: date } },
    });
  
    const res = await client.send(command);
    return res.Item ? unmarshall(res.Item) : null;
  }
  
  export async function setLeadingIndicatorsForDate(date: string, data: Record<string, any>) {
    const item = {
      date: date,
      ...data,
      ttl: Math.floor(Date.now() / 1000) + 86400,
    };
  
    const command = new PutItemCommand({
      TableName: TABLE_NAME,
      Item: marshall(item),
    });
  
    await client.send(command);
  }
  