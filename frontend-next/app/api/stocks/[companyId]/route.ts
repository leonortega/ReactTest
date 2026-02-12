import { NextResponse, type NextRequest } from 'next/server';
import type { StockData } from '../../../_lib/types';
import { parseCompanyId, parseIsoDate } from '../../../_lib/requestValidation';

// Do not cache responses for polling clients
const cacheHeader = 'no-store';
const maxRequestsPerWindow = 60;
const windowMs = 60_000;
const maxRateLimitEntries = 10_000;

type RateLimitEntry = { count: number; resetAt: number };
const rateLimitEntries = new Map<string, RateLimitEntry>();

function getRateLimitKey(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const forwardedIp = forwardedFor?.split(',')[0]?.trim();
  const realIp = request.headers.get('x-real-ip')?.trim();
  const clientIp = forwardedIp || realIp || 'anonymous';
  const userAgent = (request.headers.get('user-agent') ?? 'unknown').trim().slice(0, 80);
  return `${clientIp}|${userAgent}`;
}

function checkRateLimit(key: string): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  for (const [entryKey, entry] of rateLimitEntries.entries()) {
    if (entry.resetAt <= now) {
      rateLimitEntries.delete(entryKey);
    }
  }

  const existing = rateLimitEntries.get(key);
  if (!existing || existing.resetAt <= now) {
    rateLimitEntries.set(key, { count: 1, resetAt: now + windowMs });
  } else if (existing.count >= maxRequestsPerWindow) {
    const retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return { allowed: false, retryAfterSeconds };
  } else {
    rateLimitEntries.set(key, { ...existing, count: existing.count + 1 });
  }

  if (rateLimitEntries.size > maxRateLimitEntries) {
    const overflow = rateLimitEntries.size - maxRateLimitEntries;
    const oldestKeys = [...rateLimitEntries.entries()]
      .sort((a, b) => a[1].resetAt - b[1].resetAt)
      .slice(0, overflow)
      .map(([entryKey]) => entryKey);
    for (const oldKey of oldestKeys) {
      rateLimitEntries.delete(oldKey);
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

function getInternalApiBaseUrl(): string | null {
  const configuredValue = process.env.INTERNAL_API_BASE_URL;
  if (!configuredValue) {
    return null;
  }

  const normalized = configuredValue.trim().replace(/^['"]|['"]$/g, '');
  return normalized || null;
}

export function __resetRateLimitForTests() {
  rateLimitEntries.clear();
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ companyId: string }> },
) {
  const { searchParams } = new URL(request.url);
  const resolvedParams = await params;
  const companyId = parseCompanyId(resolvedParams.companyId);
  const date = parseIsoDate(searchParams.get('date'));

  if (!companyId || !date) {
    return NextResponse.json(
      { error: 'companyId and date are required' },
      { status: 400, headers: { 'Cache-Control': cacheHeader } },
    );
  }

  // Enforce rate limiting for every request to prevent unauthenticated bypasses.
  const { allowed, retryAfterSeconds } = checkRateLimit(getRateLimitKey(request));
  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: {
          'Cache-Control': cacheHeader,
          'Retry-After': String(retryAfterSeconds),
        },
      },
    );
  }

  const baseUrl = getInternalApiBaseUrl();

  if (!baseUrl) {
    return NextResponse.json(
      { error: 'INTERNAL_API_BASE_URL is not configured' },
      { status: 500, headers: { 'Cache-Control': cacheHeader } },
    );
  }

  const apiUrl = `${baseUrl.replace(/\/$/, '')}/stocks/${encodeURIComponent(companyId)}?date=${encodeURIComponent(
    date,
  )}`;

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
    console.error('Failed to fetch stocks from upstream API', { companyId, date, error });
    return NextResponse.json(
      { error: 'Unable to reach Stocks API configured by INTERNAL_API_BASE_URL' },
      { status: 502, headers: { 'Cache-Control': cacheHeader } },
    );
  }
}
