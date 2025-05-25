import { getLeadingIndicatorsByDate, setLeadingIndicatorsForDate } from '@/lib/dynamo/cachePanels';
import { generateDailyLeadingIndicators } from '@/lib/fred/helpers';
import { NextResponse } from 'next/server';

const today = new Date().toISOString().split('T')[0];

export async function GET() {
    const cached = await getLeadingIndicatorsByDate(today);
    if (cached) return NextResponse.json(cached);

    const data = await generateDailyLeadingIndicators();
    await setLeadingIndicatorsForDate(today, data);
    return NextResponse.json(data);
}
