import { renderHook, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { vi } from 'vitest';
import { useStocks } from '../../app/_hooks/useStocks';
import type { ReactNode } from 'react';

const swrWrapper = ({ children }: { children?: ReactNode }) => (
  <SWRConfig value={{ provider: () => new Map() }}>{children}</SWRConfig>
);

describe('useStocks', () => {
  const stockResponse = [{ dateTime: '2024-01-01T10:00:00Z', price: 100.5 }];

  beforeEach(() => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => stockResponse,
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches data on mount', async () => {
    const { result } = renderHook(() => useStocks('ABC', '2024-01-01'), { wrapper: swrWrapper });

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });

    expect(result.current.stockData).toEqual(stockResponse);
  });

  it('uses company and date in request URL', async () => {
    const { result } = renderHook(() => useStocks('ABC', '2024-01-01'), { wrapper: swrWrapper });

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalled();
    });

    const [url] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('/api/stocks/ABC?date=2024-01-01');
    expect(result.current.status).toBe('success');
  });

  it('surfaces API error message', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Rate limit exceeded' }),
    }) as unknown as typeof fetch;

    const { result } = renderHook(() => useStocks('ABC', '2024-01-01'), { wrapper: swrWrapper });

    await waitFor(() => {
      expect(result.current.status).toBe('error');
    });

    expect(result.current.error).toBe('Rate limit exceeded');
  });
});
