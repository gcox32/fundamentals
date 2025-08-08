import { NextResponse, NextRequest } from "next/server";
import { 
    fetchPCE, 
    fetchCPI, 
    fetchEconomicStatus, 
    fetchCFNAI, 
    fetchRate, 
    fetchSentiment, 
    fetchRecessionProbability,
    fetch3MTBill
 } from "@/lib/fred";
import { getSeriesId } from './config';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ series_id: string }> }
) {
    try {
        const params = await context.params;
        const seriesId = await getSeriesId(params);

        let data;
        switch (seriesId) {
            case "CPI":
                data = await fetchCPI();
                break;
            case "FEDFUNDS":
                data = await fetchRate();
                break;
            case "UMCSENT":
                data = await fetchSentiment();
                break;
            case "GDP":
                data = await fetchEconomicStatus();
                break;
            case "USREC":
                data = await fetchRecessionProbability();
                break;
            case "PCE":
                data = await fetchPCE();
                break;
            case "CFNAI":
                data = await fetchCFNAI();
                break;
            case "DGS3MO":
                data = await fetch3MTBill();
                break;
        }
        // Use seriesId in your API logic
        return Response.json(data);
    } catch (error) {
        return Response.json({ error: (error as Error).message }, { status: 400 });
    }
}