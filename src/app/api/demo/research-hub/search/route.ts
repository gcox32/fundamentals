import { NextRequest, NextResponse } from 'next/server';
import investmentUniverse from '@/src/app/(main)/demo/research-hub/investment-universe.json';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q')?.toLowerCase();

  if (!query?.trim()) {
    return NextResponse.json([]);
  }

  const companies = investmentUniverse.companies || [];
  
  const results = companies
    .filter(company => {
      const nameMatch = company.name.toLowerCase().includes(query);
      const tickerMatch = company.ticker.toLowerCase().includes(query);
      const descriptionMatch = company.description?.toLowerCase().includes(query);
      
      return nameMatch || tickerMatch || descriptionMatch;
    })
    .map(company => ({
      symbol: company.ticker,
      name: company.name,
      description: company.description,
      assetType: 'STOCK',
      // Calculate total percentage across all funds
      totalPercentage: Object.values(company.percentage_of_each_fund)
        .reduce((sum: number, val: number | null) => sum + (val || 0), 0)
    }))
    .sort((a, b) => (b.totalPercentage || 0) - (a.totalPercentage || 0))
    .slice(0, 10);

  return NextResponse.json(results);
} 