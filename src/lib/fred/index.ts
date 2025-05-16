const FRED_BASE = "https://api.stlouisfed.org/fred/series/observations";
const API_KEY = process.env.FRED_API_KEY!;
const months = 12;
const COMMON_PARAMS = `api_key=${API_KEY}&file_type=json&sort_order=desc&limit=${months}`;

interface FREDObservation {
    date: string;
    value: string;
    realtime_start?: string;
    realtime_end?: string;
}

interface FREDResponse {
    observations: FREDObservation[];
}

const fetchSeries = async (seriesId: string): Promise<FREDObservation[]> => {
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
    const prev = reversed.at(-2)!.value;

    const trend = latest < prev ? "Disinflation" : latest > prev ? "Rising Inflation" : "Stable";

    // Calculate MoM and YoY percentage changes
    const momSeries = reversed.slice(1).map((obs, i) => {
        const prevVal = reversed[i].value;
        const pct = ((obs.value - prevVal) / prevVal) * 100;
        return { date: obs.date, value: pct };
    });

    const yoySeries = reversed.slice(12).map((obs, i) => {
        const val12moAgo = reversed[i].value;
        const pct = ((obs.value - val12moAgo) / val12moAgo) * 100;
        return { date: obs.date, value: pct };
    });

    return {
        latest,
        trend,
        series: {
            mom: momSeries,
            yoy: yoySeries,
        },
    };
}

async function fetchRate() {
    const series: FREDObservation[] = await fetchSeries("FEDFUNDS");
    const latest = parseFloat(series[0].value);
    const trend = latest >= 5 ? "Restrictive" : latest < 3 ? "Accommodative" : "Neutral";

    return {
        latest: `${latest.toFixed(2)}%`,
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

export { fetchCPI, fetchRate, fetchSentiment };