import {
    fetchCPI,
    fetchPPI,
    fetchRate,
    fetchCreditSpreads,
    fetchYieldCurve,
    fetchCFNAI,
    fetchPCE,
} from './index';

export async function generateDailyLeadingIndicators() {
    const [cpi, ppi, fedFunds, credit, curve, business, consumer] = await Promise.all([
        fetchCPI(),
        fetchPPI(),
        fetchRate(),
        fetchCreditSpreads(),
        fetchYieldCurve(),
        fetchCFNAI(),
        fetchPCE(),
    ]);

    return {
        cpi,
        ppi,
        fedFunds,
        credit,
        curve,
        business,
        consumer,
    };
}

type MacroCompositeInputs = {
    cfnai: Awaited<ReturnType<typeof fetchCFNAI>>;
    curve: Awaited<ReturnType<typeof fetchYieldCurve>>;
    credit: Awaited<ReturnType<typeof fetchCreditSpreads>>;
    cpi: Awaited<ReturnType<typeof fetchCPI>>;
    ppi: Awaited<ReturnType<typeof fetchPPI>>;
    rate: Awaited<ReturnType<typeof fetchRate>>;
};

type MacroComposite = {
    score: number; // 0-100
    regime: string;
    tilt: 'Positive' | 'Neutral' | 'Cautious';
    drivers: string[];
    asOf: string;
};

function interpolate(value: number, points: Array<[number, number]>): number {
    if (points.length === 0) return 0;
    // Ensure points sorted by x
    const sorted = [...points].sort((a, b) => a[0] - b[0]);
    if (value <= sorted[0][0]) return sorted[0][1];
    if (value >= sorted[sorted.length - 1][0]) return sorted[sorted.length - 1][1];
    for (let i = 0; i < sorted.length - 1; i++) {
        const [x1, y1] = sorted[i];
        const [x2, y2] = sorted[i + 1];
        if (value >= x1 && value <= x2) {
            const t = (value - x1) / (x2 - x1);
            return y1 + t * (y2 - y1);
        }
    }
    return sorted[sorted.length - 1][1];
}

export function computeMacroComposite(inputs: MacroCompositeInputs): MacroComposite {
    const { cfnai, curve, credit, cpi, ppi, rate } = inputs;

    const cfnaiLatest = typeof cfnai.latest === 'number' ? cfnai.latest : cfnai.latest.value;
    const curveLatest = curve.latest.spread;
    const creditLatest = credit.latest.hySpread;

    // 1) Growth (CFNAI) 35%
    const cfnaiScore = interpolate(cfnaiLatest, [
        [-1.0, 0],
        [-0.7, 20],
        [0.0, 60],
        [0.2, 80],
        [0.5, 100],
    ]);

    // 2) Yield Curve (2s10s) 20%
    const curveScore = interpolate(curveLatest, [
        [-1.0, 0],
        [-0.5, 25],
        [0.0, 50],
        [0.5, 75],
        [1.0, 100],
    ]);

    // 3) Credit (HY spread bps) 20% — inverse
    const creditScore = interpolate(creditLatest, [
        [800, 0],
        [600, 25],
        [500, 50],
        [400, 75],
        [300, 100],
    ]);

    // 4) Inflation momentum 15%
    const cpiTrend = (cpi.trend || '').toLowerCase();
    const ppiTrend = (ppi.trend || '').toLowerCase();
    const disinflating = (s: string) => s.includes('disinfl');
    const rising = (s: string) => s.includes('rising');
    let inflationScore = 50;
    if (disinflating(cpiTrend) && disinflating(ppiTrend)) inflationScore = 100;
    else if (rising(cpiTrend) && rising(ppiTrend)) inflationScore = 0;

    // 5) Policy stance 10%
    let policyScore = 60; // Neutral default
    const stance = (rate.trend || '').toLowerCase();
    if (stance.includes('restrict')) policyScore = 25;
    else if (stance.includes('accommod')) policyScore = 85;

    const score = Math.round(
        cfnaiScore * 0.35 +
        curveScore * 0.20 +
        creditScore * 0.20 +
        inflationScore * 0.15 +
        policyScore * 0.10
    );

    // Regime classification
    let regime = 'Slowdown';
    if (score >= 70) {
        const early = disinflating(cpiTrend) && curveLatest >= 0;
        regime = `Expansion (${early ? 'Early' : 'Late'})`;
    } else if (score >= 50) {
        regime = curveLatest < 0 ? 'Soft Patch (Inverted Curve)' : 'Late Expansion';
    } else if (score < 30) {
        regime = 'Contraction Risk';
    }

    // Tilt (3–6m) — based on direction of CFNAI, HY spreads, curve
    const cfnaiPrev = cfnai.series.at(-2)?.value ?? cfnaiLatest;
    const cfnaiDelta = cfnaiLatest - cfnaiPrev;

    const creditPrev = credit.series.at(-2)?.hySpread ?? creditLatest;
    const creditDelta = creditLatest - creditPrev; // widening if positive

    const curvePrev = curve.series.at(-2)?.spread ?? curveLatest;
    const curveDelta = curveLatest - curvePrev; // steepening if positive

    let tilt: MacroComposite['tilt'] = 'Neutral';
    const improving = cfnaiDelta > 0 && creditDelta < 0 && curveDelta > 0;
    const worsening = cfnaiDelta < 0 && creditDelta > 0 && curveDelta <= 0;
    if (improving) tilt = 'Positive';
    else if (worsening) tilt = 'Cautious';

    const drivers: string[] = [];
    drivers.push(`CFNAI ${cfnaiDelta >= 0 ? 'improving' : 'softening'}`);
    drivers.push(`Curve ${curveLatest.toFixed(2)}% (${curveDelta >= 0 ? 'steepening' : 'flattening'})`);
    drivers.push(`HY ${Math.round(creditLatest)} bps (${creditDelta <= 0 ? 'narrowing' : 'widening'})`);
    drivers.push(`Inflation ${disinflating(cpiTrend) ? 'disinflating' : rising(cpiTrend) ? 'rising' : 'flat'}`);

    const asOf = cfnai.latest.date ?? cpi.latest?.date ?? new Date().toISOString();

    return { score, regime, tilt, drivers: drivers.slice(0, 3), asOf };
}
