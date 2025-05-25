import { DynamoDBClient, GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';

const client = new DynamoDBClient({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID!,
        secretAccessKey: process.env.SECRET_ACCESS_KEY!
    }
});

const TABLE = 'Fundamental-Portfolio-SuperAssessment';

export async function getAssessment(key: string) {
	const cmd = new GetItemCommand({
		TableName: TABLE,
		Key: { id: { S: key } },
	});
	const res = await client.send(cmd);
	if (!res.Item) return null;
	return {
		text: res.Item.text.S,
		generatedAt: res.Item.generatedAt.S,
	};
}

export async function putAssessment({
	key,
	text,
    generatedAt
}: {
	key: string;
	text: string;
	generatedAt: string;
}) {
	const now = new Date().toISOString();
	const cmd = new PutItemCommand({
		TableName: TABLE,
		Item: {
			id: { S: key },
			text: { S: text },
			generatedAt: { S: now },
			ttl: { N: `${Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365}` }, // 1-year expiry
		},
	});
	await client.send(cmd);
}
