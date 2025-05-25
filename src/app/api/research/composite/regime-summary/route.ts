import { getRegimeSummaryByDate, setRegimeSummaryByDate } from '@/lib/dynamo';
import { fetchCPI, fetchRate, fetchSentiment } from '@/lib/fred';
import { NextResponse } from 'next/server';

const todayKey = new Date().toISOString().split('T')[0];

export async function GET() {
  const cached = await getRegimeSummaryByDate(todayKey);
  if (cached) return NextResponse.json(cached);

  const [cpi, rate, sentiment] = await Promise.all([
    fetchCPI(),
    fetchRate(),
    fetchSentiment(),
  ]);

  const item = {
    date: todayKey,
    cpi,
    rate,
    sentiment,
    ttl: Math.floor(Date.now() / 1000) + 86400, // expires in 1 day
  };

  await setRegimeSummaryByDate(item);
  return NextResponse.json(item);
}
