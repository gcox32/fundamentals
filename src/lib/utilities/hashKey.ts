import crypto from 'crypto';

export function hashKey(input: any) {
	const stringified = JSON.stringify(input);
	return crypto.createHash('sha256').update(stringified).digest('hex');
}
