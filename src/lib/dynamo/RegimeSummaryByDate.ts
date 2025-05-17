import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!
  }
});

export async function getRegimeSummaryByDate(date: string) {
  const command = new GetItemCommand({
    TableName: "Fundamental-LeadingIndicators-RegimeSummary",
    Key: { date: { S: date } },
  });

  const res = await client.send(command);
  return res.Item ? unmarshall(res.Item) : null;
}

export async function setRegimeSummaryByDate(item: any) {
    const command = new PutItemCommand({
      TableName: "Fundamental-LeadingIndicators-RegimeSummary",
      Item: marshall(item),
    });
  
    await client.send(command);
  }
  