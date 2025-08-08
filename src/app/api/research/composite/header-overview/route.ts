import { NextResponse } from 'next/server';
import { getHeaderOverviewByDate, setHeaderOverviewByDate } from '@/lib/dynamo';
import { fetchEconomicStatus } from '@/lib/fred';
import { fetchFearGreedIndex } from '@/src/lib/aggregators/rapid';
import { fetchRecessionMarket } from '@/lib/aggregators/polymarket';
const todayKey = new Date().toISOString().split('T')[0];

export async function GET() {
	const cached = await getHeaderOverviewByDate(todayKey);

	if (cached) return NextResponse.json(cached);

	const [recessionMarket, economicStatus, fearGreed] = await Promise.all([
		fetchRecessionMarket(),
		fetchEconomicStatus(),
		fetchFearGreedIndex()
	]);

	const data = {
		date: todayKey,
		type: 'HEADER_OVERVIEW',
		recessionMarket,
		economicStatus,
		fearGreed,
		ttl: Math.floor(Date.now() / 1000) + 86400,
	};

	await setHeaderOverviewByDate(data);
	return NextResponse.json(data);
}
