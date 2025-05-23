export const FRED_BASE = "https://api.stlouisfed.org/fred/series/observations";
export const API_KEY = process.env.FRED_API_KEY!;
export const months = 12;
export const COMMON_PARAMS = `api_key=${API_KEY}&file_type=json&sort_order=desc&limit=${months}`;