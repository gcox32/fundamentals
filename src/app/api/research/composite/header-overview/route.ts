import { NextResponse } from 'next/server';
import { getHeaderOverviewByDate, setHeaderOverviewByDate } from '@/lib/dynamo';
import { fetchRecessionProbability, fetchEconomicStatus } from '@/lib/fred';
import { fetchFearGreedIndex } from '@/src/lib/aggregators/rapid';
const todayKey = new Date().toISOString().split('T')[0];

export async function GET() {
  const cached = await getHeaderOverviewByDate(todayKey);

  if (cached) return NextResponse.json(cached);

  const [recessionProb, economicStatus, fearGreed] = await Promise.all([
    fetchRecessionProbability(),
    fetchEconomicStatus(),
    fetchFearGreedIndex()
  ]);

  // TODO: Add Fear-Greed once sources are settled
  const data = {
    date: todayKey,
    type: 'HEADER_OVERVIEW',
    recessionProb,
    economicStatus,
    fearGreed,
    ttl: Math.floor(Date.now() / 1000) + 86400,
  };
  
  await setHeaderOverviewByDate(data);
  return NextResponse.json(data);
}
