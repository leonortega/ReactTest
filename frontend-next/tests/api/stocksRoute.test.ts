import type { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { __resetRateLimitForTests, GET } from '../../app/api/stocks/[companyId]/route';

function createRequest(url: string, headers: HeadersInit = {}): NextRequest {
  return new Request(url, { headers }) as unknown as NextRequest;
}

describe('stocks route', () => {
  beforeEach(() => {
    process.env.INTERNAL_API_BASE_URL = 'http://stocks-api.test/api';
    __resetRateLimitForTests();
    vi.restoreAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 400 when companyId is malformed', async () => {
    const response = await GET(
      createRequest('http://localhost:3000/api/stocks/abc?date=2026-02-12'),
      { params: Promise.resolve({ companyId: '%E0%A4%A' }) },
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'companyId and date are required',
    });
  });

  it('returns 400 when date is invalid', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const response = await GET(
      createRequest('http://localhost:3000/api/stocks/ABC?date=2026/02/12'),
      { params: Promise.resolve({ companyId: 'ABC' }) },
    );

    expect(response.status).toBe(400);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('returns 400 for non-existent calendar date', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const response = await GET(
      createRequest('http://localhost:3000/api/stocks/ABC?date=2026-02-30'),
      { params: Promise.resolve({ companyId: 'ABC' }) },
    );

    expect(response.status).toBe(400);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('returns 429 after exceeding per-minute limit', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockImplementation(async () =>
      new Response(JSON.stringify([{ dateTime: '2026-02-12T10:00:00Z', price: 100.5 }]), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const url = 'http://localhost:3000/api/stocks/ABC?date=2026-02-12';
    const headers = {
      'x-forwarded-for': '203.0.113.10',
      'user-agent': 'vitest-rate-limit',
    };

    for (let index = 0; index < 60; index += 1) {
      const response = await GET(createRequest(url, headers), {
        params: Promise.resolve({ companyId: 'ABC' }),
      });
      expect(response.status).toBe(200);
    }

    const blockedResponse = await GET(createRequest(url, headers), {
      params: Promise.resolve({ companyId: 'ABC' }),
    });

    expect(blockedResponse.status).toBe(429);
    await expect(blockedResponse.json()).resolves.toEqual({ error: 'Rate limit exceeded' });
    expect(fetchMock).toHaveBeenCalledTimes(60);
  });

  it('returns clear 502 error when upstream request fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('backend exploded'));

    const response = await GET(
      createRequest('http://localhost:3000/api/stocks/ABC?date=2026-02-12'),
      { params: Promise.resolve({ companyId: 'ABC' }) },
    );

    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(502);
    expect(body.error).toBe('Unable to reach Stocks API configured by INTERNAL_API_BASE_URL');
    expect(body.error).not.toContain('backend exploded');
  });
});
