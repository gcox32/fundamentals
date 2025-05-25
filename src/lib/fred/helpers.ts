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
