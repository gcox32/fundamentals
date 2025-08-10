import { NextResponse } from 'next/server';
import { getHeaderOverviewByDate, setHeaderOverviewByDate } from '@/lib/dynamo';
import { fetchCFNAI, fetchYieldCurve, fetchCreditSpreads, fetchCPI, fetchPPI, fetchRate } from '@/lib/fred';
import { computeMacroComposite } from '@/lib/fred/helpers';
import { fetchFearGreedIndex } from '@/src/lib/aggregators/rapid';
import { fetchRecessionMarket } from '@/lib/aggregators/polymarket';
const todayKey = new Date().toISOString().split('T')[0];

export async function GET() {
	const cached = await getHeaderOverviewByDate(todayKey);

	if (cached) return NextResponse.json(cached);

    const [recessionMarket, fearGreed, cfnai, curve, credit, cpi, ppi, rate] = await Promise.all([
        fetchRecessionMarket(),
        fetchFearGreedIndex(),
        fetchCFNAI(),
        fetchYieldCurve(),
        fetchCreditSpreads(),
        fetchCPI(),
        fetchPPI(),
        fetchRate(),
    ]);

    const macroComposite = computeMacroComposite({ cfnai, curve, credit, cpi, ppi, rate });

	const data = {
		date: todayKey,
		type: 'HEADER_OVERVIEW',
		recessionMarket,
        economicStatus: { value: macroComposite.regime, basis: `Macro Health ${macroComposite.score}/100 • Tilt: ${macroComposite.tilt}` },
        macroComposite,
		fearGreed,
		ttl: Math.floor(Date.now() / 1000) + 86400,
	};

	await setHeaderOverviewByDate(data);
	return NextResponse.json(data);
}
