import { NextResponse, type NextRequest } from 'next/server';
import type { StockData } from '../../../_lib/types';

const defaultBaseUrl = 'http://localhost:8080/api';
// Do not cache responses for polling clients
const cacheHeader = 'no-store';
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const maxRequestsPerWindow = 60;
const windowMs = 60_000;

function checkRateLimit(key: string) {
  const now = Date.now();
  const existing = rateLimit.get(key);

  if (!existing || existing.resetAt < now) {
    rateLimit.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (existing.count >= maxRequestsPerWindow) {
    return false;
  }

  existing.count += 1;
  return true;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> },
) {
  const { searchParams } = new URL(request.url);
  const resolvedParams = await params;
  const companyId = resolvedParams.companyId ? decodeURIComponent(resolvedParams.companyId) : null;
  const date = searchParams.get('date');

  if (!companyId || !date) {
    return NextResponse.json({ error: 'companyId and date are required' }, { status: 400 });
  }

  const ip = request.headers.get('x-forwarded-for') ?? 'local';
  const rateKey = `${ip}|${companyId}|${date}`;

  if (ip !== 'local' && !checkRateLimit(rateKey)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429, headers: { 'Cache-Control': cacheHeader } },
    );
  }

  const configuredBaseUrl = process.env.INTERNAL_API_BASE_URL ?? '';
  const baseUrl = (configuredBaseUrl.startsWith('http') ? configuredBaseUrl : defaultBaseUrl).replace(
    /\/$/,
    '',
  );
  const apiUrl = `${baseUrl}/stocks/${encodeURIComponent(companyId)}?date=${encodeURIComponent(date)}`;

  try {
    const response = await fetch(apiUrl, { cache: 'no-store' });
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch stocks' },
        { status: response.status, headers: { 'Cache-Control': cacheHeader } },
      );
    }

    const data = (await response.json()) as StockData[];
    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: 'Invalid response' },
        { status: 502, headers: { 'Cache-Control': cacheHeader } },
      );
    }

    return NextResponse.json(data, { status: 200, headers: { 'Cache-Control': cacheHeader } });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500, headers: { 'Cache-Control': cacheHeader } },
    );
  }
}
