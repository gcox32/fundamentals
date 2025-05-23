import { COMMON_PARAMS, FRED_BASE } from "./config";
import { FREDObservation, FREDResponse } from "./types";

async function fetchSeries(seriesId: string): Promise<FREDObservation[]> {
    const res = await fetch(`${FRED_BASE}?series_id=${seriesId}&${COMMON_PARAMS}`);
    const data: FREDResponse = await res.json();
    return data.observations;
};

async function fetchCPI() {
    const series = await fetchSeries("CPIAUCSL"); // latest 12–15 months

    // Reverse to get oldest → newest
    const reversed = [...series]
        .filter(obs => obs.value !== '.')
        .map(obs => ({ date: obs.date, value: parseFloat(obs.value) }))
        .reverse();

    const latest = reversed.at(-1)!.value;
    const latestDate = reversed.at(-1)!.date;
    const prev = reversed.at(-2)!.value;

    const trend = latest < prev ? "Disinflation" : latest > prev ? "Rising Inflation" : "Stable";

    // Calculate MoM and YoY percentage changes
    const momSeries = reversed.slice(1).map((obs, i) => {
        const prevVal = reversed[i].value;
        const pct = ((obs.value - prevVal) / prevVal) * 100;
        return { date: obs.date, value: pct };
    });

    // Only calculate YoY if we have enough data points
    const yoySeries = reversed.length >= 13 
        ? reversed.slice(12).map((obs, i) => {
            const val12moAgo = reversed[i].value;
            const pct = ((obs.value - val12moAgo) / val12moAgo) * 100;
            return { date: obs.date, value: pct };
        })
        : [];

    return {
        latest: {
            value: latest,
            date: latestDate
        },
        trend,
        series: {
            mom: momSeries.map(item => ({
                date: item.date,
                value: item.value
            })),
            yoy: yoySeries.map(item => ({
                date: item.date,
                value: item.value
            }))
        },
    };
}

async function fetchRate() {
    const series: FREDObservation[] = await fetchSeries("FEDFUNDS");
    const latest = parseFloat(series[0].value);
    const trend = latest >= 5 ? "Restrictive" : latest < 3 ? "Accommodative" : "Neutral";

    return {
        latest: {
            value: latest,
            date: series[0].date
        },
        trend,
        series: series.map(obs => ({
            date: obs.date,
            value: parseFloat(obs.value),
        })).reverse(),
    };
}

async function fetchSentiment() {
    const series: FREDObservation[] = await fetchSeries("UMCSENT");
    const latest = parseFloat(series[0].value);
    const prev = parseFloat(series[1].value);
    const trend = latest > prev ? "Improving" : latest < prev ? "Worsening" : "Stable";

    return {
        latest,
        trend,
        series: series.map(obs => ({
            date: obs.date,
            value: parseFloat(obs.value),
        })).reverse(),
    };
}

async function fetchEconomicStatus() {
    const series = await fetchSeries("GDP"); // Real GDP, quarterly, SAAR
    const [latest, prev] = series.slice(0, 2).map(obs => parseFloat(obs.value));

    const growthRate = ((latest - prev) / prev) * 100;

    let value = 'Expansion';
    if (growthRate < 0) value = 'Contraction';
    else if (growthRate < 1) value = 'Stagnation';
    else if (growthRate < 2.5) value = 'Late-cycle';

    return {
        value,
        basis: `Real GDP grew ${growthRate.toFixed(2)}% QoQ annualized`,
        raw: growthRate,
        date: series[0].date,
        source: 'FRED: GDP',
    };
}

async function fetchRecessionProbability() {
    const series: FREDObservation[] = await fetchSeries("USREC");
    const latest = parseFloat(series[0].value);
    return {
        value: `${latest}%`,
        raw: latest,
        date: series[0].date,
        source: 'FRED: USREC',
    };
}

async function fetchPCE() {
    const series = await fetchSeries("PCE");

    const reversed = [...series]
        .filter(obs => obs.value !== '.')
        .map(obs => ({ date: obs.date, value: parseFloat(obs.value) }))
        .reverse();

    const latest = reversed.at(-1)!;
    const prev = reversed.at(-2)!;

    const growth = ((latest.value - prev.value) / prev.value) * 100;
    const trend =
        growth > 0.5 ? "Strong Growth" :
            growth > 0.1 ? "Moderate Growth" :
                growth > -0.1 ? "Flat" :
                    "Decline";

    return {
        latest,
        trend,
        growth: growth.toFixed(2),
        series: reversed,
    };
}

async function fetchCFNAI() {
    const series = await fetchSeries("CFNAI");
    const clean = series
        .filter(obs => obs.value !== '.')
        .map(obs => ({
            date: obs.date,
            value: parseFloat(obs.value),
        }))
        .reverse();

    const latest = clean.at(-1)!;
    console.log(latest);
    const prev = clean.at(-2)!;
    const change = latest.value - prev.value;

    const trend =
        latest.value > 0.2 ? "Above-Trend Growth" :
            latest.value > 0 ? "Modest Growth" :
                latest.value > -0.7 ? "Below Trend" :
                    "Recession Risk";

    return {
        latest,
        trend,
        change: change.toFixed(2),
        series: clean,
    };
}

async function fetchPPI() {
    const series = await fetchSeries("PPIACO");

    const clean = series
        .filter(obs => obs.value !== '.')
        .map(obs => ({
            date: obs.date,
            value: parseFloat(obs.value),
        }))
        .reverse();

    const latest = clean.at(-1)!;
    const prev = clean.at(-2)!;
    const trend = latest.value < prev.value ? 'Disinflation' : 'Inflation Rising';

    return {
        latest: {
            value: latest.value,
            date: latest.date
        },
        trend,
        change: (latest.value - prev.value).toFixed(2),
        series: clean,
    };
}

export {
    fetchCPI,
    fetchRate,
    fetchSentiment,
    fetchEconomicStatus,
    fetchRecessionProbability,
    fetchPCE,
    fetchCFNAI,
    fetchPPI
};