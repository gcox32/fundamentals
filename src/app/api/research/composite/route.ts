import { NextResponse } from "next/server";
import { getLeadingIndicatorsByDate, setLeadingIndicatorsForDate } from "@/lib/dynamo/cachePanels";
import {
    fetchCFNAI,
    fetchCPI,
    fetchCreditSpreads,
    fetchPCE,
    fetchPPI,
    fetchRate,
    fetchYieldCurve
} from "@/src/lib/fred";

const today = new Date().toISOString().split('T')[0];

export async function GET() {
    const cached = await getLeadingIndicatorsByDate(today);
    if (cached) return NextResponse.json(cached);

    const [consumerHealth, businessHealth, inflationRates, creditMarkets, marketIndicators] = await Promise.all([
        getConsumerHealth(),
        getBusinessHealth(),
        getInflationRates(),
        getCreditMarkets(),
        getMarketIndicators()
    ]);
    const data = {
        consumerHealth,
        businessHealth,
        inflationRates,
        creditMarkets,
        marketIndicators
    };
    await setLeadingIndicatorsForDate(today, data);
    return NextResponse.json(data);
}

// consumer
async function getConsumerHealth() {
    const data = await fetchPCE();
    return data;
}

// business
async function getBusinessHealth() {
    const data = await fetchCFNAI();
    return data;
}

// inflation
async function getInflationRates() {
    const [cpi, ppi, fedFunds] = await Promise.all([
        fetchCPI(),
        fetchPPI(),
        fetchRate()
    ]);
    return { cpi, ppi, fedFunds };
}

// credit
async function getCreditMarkets() {
    const data = await fetchCreditSpreads();
    return data;
}

// market
async function getMarketIndicators() {
    const data = await fetchYieldCurve();
    return data;
}