import { NextResponse, type NextRequest } from 'next/server';
import type { StockData } from '../../../_lib/types';
import { updateStore } from '../../../_lib/storage';

// Do not cache responses for polling clients
const cacheHeader = 'no-store';
const maxRequestsPerWindow = 60;
const windowMs = 60_000;
const maxRateLimitEntries = 10_000;
const rateLimitFile = 'rate-limit.json';

type RateLimitEntry = { count: number; resetAt: number };
type RateLimitStore = { entries: Record<string, RateLimitEntry> };

async function checkRateLimit(key: string): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const now = Date.now();
  let allowed = true;
  let retryAfterSeconds = 0;

  await updateStore<RateLimitStore>(
    rateLimitFile,
    { entries: {} },
    (store) => {
      const nextEntries = { ...store.entries };

      for (const [entryKey, entry] of Object.entries(nextEntries)) {
        if (entry.resetAt <= now) {
          delete nextEntries[entryKey];
        }
      }

      const existing = nextEntries[key];
      if (!existing || existing.resetAt <= now) {
        nextEntries[key] = { count: 1, resetAt: now + windowMs };
      } else if (existing.count >= maxRequestsPerWindow) {
        allowed = false;
        retryAfterSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
      } else {
        nextEntries[key] = { ...existing, count: existing.count + 1 };
      }

      const keys = Object.keys(nextEntries);
      if (keys.length > maxRateLimitEntries) {
        const overflow = keys.length - maxRateLimitEntries;
        const oldestKeys = keys
          .sort((a, b) => nextEntries[a].resetAt - nextEntries[b].resetAt)
          .slice(0, overflow);
        for (const oldKey of oldestKeys) {
          delete nextEntries[oldKey];
        }
      }

      return { entries: nextEntries };
    },
  );

  return { allowed, retryAfterSeconds };
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

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
  // Rate-limit by caller identity to prevent bypass through query variation.
  const rateKey = ip;

  if (ip !== 'local') {
    const { allowed, retryAfterSeconds } = await checkRateLimit(rateKey);
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
  }

  const baseUrl = process.env.INTERNAL_API_BASE_URL;

  if (!baseUrl) {
    return NextResponse.json({ error: 'INTERNAL_API_BASE_URL is not configured' }, { status: 500 });
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
    return NextResponse.json(
      { error: String(error) },
      { status: 500, headers: { 'Cache-Control': cacheHeader } },
    );
  }
}
