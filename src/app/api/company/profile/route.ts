import { API_TTL, API_ENDPOINTS, DYNAMODB_TABLES } from '../../config';
import { fetchFMPData } from '@/utils/fmpFinance';
import { CompanyProfile } from '@/types/company';

interface CacheableProfileData {
  [key: string]: any;
  lastUpdated: number;
  symbol: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get('symbol')?.toUpperCase();

  if (!symbol) {
    return Response.json({ error: 'Symbol is required' }, { status: 400 });
  }

  try {
    const response = await fetchFMPData<CacheableProfileData>({
      endpoint: API_ENDPOINTS.COMPANY.PROFILE.replace('<ticker>', symbol),
      tableName: DYNAMODB_TABLES.COMPANY.PROFILE,
      ttlSeconds: API_TTL.COMPANY.PROFILE,
      cacheKey: symbol
    });

    // Extract profile from response
    const profile = response['0'] as CompanyProfile;
    if (!profile) {
      return Response.json(
        { error: 'Company profile not found' },
        { status: 404 }
      );
    }

    return Response.json(profile);
  } catch (error) {
    console.error('Error fetching company profile:', error);
    return Response.json(
      { error: 'Failed to fetch company profile' },
      { status: 500 }
    );
  }
}