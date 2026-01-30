import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { vi } from 'vitest';
import { useStocks } from '../../app/_hooks/useStocks';

describe('useStocks', () => {
  const stockResponse = [{ dateTime: '2024-01-01T10:00:00Z', price: 100.5 }];

  beforeEach(() => {
    vi.useFakeTimers();
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => stockResponse,
    }) as unknown as typeof fetch;
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('fetches data on mount and on interval', async () => {
    renderHook(() => useStocks('ABC', '2024-01-01'));

    await act(async () => {
      await Promise.resolve();
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    await act(async () => {
      await vi.advanceTimersByTimeAsync(5000);
    });

    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it('uses company and date in request URL', async () => {
    renderHook(() => useStocks('ABC', '2024-01-01'));

    await act(async () => {
      await Promise.resolve();
    });

    expect(globalThis.fetch).toHaveBeenCalled();

    const [url] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toContain('/api/stocks?companyId=ABC&date=2024-01-01&view=intraday');
  });
});
