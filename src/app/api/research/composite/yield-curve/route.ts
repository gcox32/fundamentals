import { fetchYieldCurve } from '@/lib/fred';
import { NextResponse } from 'next/server';

export async function GET() {
  const data = await fetchYieldCurve();
  return NextResponse.json(data);
}
