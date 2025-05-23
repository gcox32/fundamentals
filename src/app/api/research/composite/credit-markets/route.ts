import { fetchCreditSpreads } from '@/lib/fred';
import { NextResponse } from 'next/server';

export async function GET() {
  const data = await fetchCreditSpreads();
  return NextResponse.json(data);
}
