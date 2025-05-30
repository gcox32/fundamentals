import { fetchCPI, fetchPPI, fetchRate } from "@/lib/fred";
import { NextResponse } from "next/server";

export async function GET() {
    const [cpi, ppi, fedFunds] = await Promise.all([
        fetchCPI(), 
        fetchPPI(), 
        fetchRate()
    ]);

    return NextResponse.json({ cpi, ppi, fedFunds });
}