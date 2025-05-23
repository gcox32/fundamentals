export interface FREDObservation {
    date: string;
    value: string;
    realtime_start?: string;
    realtime_end?: string;
}

export interface FREDResponse {
    observations: FREDObservation[];
}