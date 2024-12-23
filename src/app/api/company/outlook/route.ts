import { API_ENDPOINTS, DYNAMODB_TABLES, API_TTL } from '../../config';
import { fetchFMPData } from '@/utils/fmpFinance';
import type { CompanyOutlook } from '@/types/company';

interface CompanyOutlookCache {
    [key: string]: any;
    lastUpdated: number;
    symbol: string;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    let symbol = searchParams.get('symbol')?.toUpperCase();

    if (!symbol) {
        return Response.json({ error: 'Symbol is required' }, { status: 400 });
    }

    symbol = symbol.replace('.', '-');

    try {
        const response = await fetchFMPData<CompanyOutlookCache>({
            endpoint: API_ENDPOINTS.COMPANY.OUTLOOK,
            tableName: DYNAMODB_TABLES.COMPANY.OUTLOOK,
            ttlSeconds: API_TTL.COMPANY.OUTLOOK,
            cacheKey: symbol,
            params: {
                symbol: symbol
            }
        });

        // The outlook endpoint returns the data directly, not in an array
        const outlook = response as unknown as CompanyOutlook;
        if (!outlook || !outlook.profile) {
            return Response.json(
                { error: 'Company outlook not found' },
                { status: 404 }
            );
        }

        return Response.json(outlook);
    } catch (error) {
        console.error('Error fetching company outlook:', error);
        return Response.json(
            { error: 'Failed to fetch company outlook' },
            { status: 500 }
        );
    }
}