import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

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
