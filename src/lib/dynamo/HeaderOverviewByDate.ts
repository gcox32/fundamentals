import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

const client = new DynamoDBClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!
  }
});

const TABLE_NAME = 'Fundamental-LeadingIndicators-Overview';
export async function getHeaderOverviewByDate(date: string) {
    const command = new GetItemCommand({
      TableName: TABLE_NAME,
      Key: { date: { S: date } },
    });
    const res = await client.send(command);
    const item = res.Item ? unmarshall(res.Item) : null;
    return item?.type === 'HEADER_OVERVIEW' ? item : null;
  }
  
  export async function setHeaderOverviewByDate(item: any) {
    const command = new PutItemCommand({
      TableName: TABLE_NAME,
      Item: marshall(item),
    });
    await client.send(command);
  }
  