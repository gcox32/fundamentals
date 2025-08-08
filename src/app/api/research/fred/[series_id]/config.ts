export type seriesIdOptions = 
    | "CPI"
    | "FEDFUNDS"
    | "UMCSENT"
    | "GDP"
    | "USREC"
    | "PCE"
    | "CFNAI"
    | "DGS3MO";

export async function getSeriesId(params: { series_id: string }): Promise<seriesIdOptions> {
    const { series_id } = params;
    if (!isValidSeriesId(series_id)) {
        throw new Error(`Invalid series ID: ${series_id}`);
    }
    return series_id as seriesIdOptions;
}

function isValidSeriesId(id: string): id is seriesIdOptions {
    return ["CPI", "FEDFUNDS", "UMCSENT", "GDP", "USREC", "PCE", "CFNAI", "DGS3MO"].includes(id);
} 