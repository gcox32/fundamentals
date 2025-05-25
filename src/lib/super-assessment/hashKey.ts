import { createHash } from 'crypto';

export function hashKey({ investor, userId, holdings }: {
	investor: string;
	userId: string;
	holdings: { ticker: string; weight: number }[];
}) {
	const input = { investor, userId, holdings };
	return createHash('sha256').update(JSON.stringify(input)).digest('hex');
}
