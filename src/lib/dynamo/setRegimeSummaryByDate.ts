import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

const client = new DynamoDBClient({
  region: process.env.REGION,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID!,
    secretAccessKey: process.env.SECRET_ACCESS_KEY!
  }
});

export async function setRegimeSummaryByDate(item: any) {
  const command = new PutItemCommand({
    TableName: "Fundamental-LeadingIndicators-RegimeSummary",
    Item: marshall(item),
  });

  await client.send(command);
}
