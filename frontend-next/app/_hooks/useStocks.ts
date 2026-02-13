'use client';

import { useState } from 'react';
import useSWR from 'swr';
import {
  DEFAULT_STOCK_AUTO_REFRESH_SECONDS,
  clampStockAutoRefreshSeconds,
} from '../_lib/stockPollingConfig';
import type { StockData } from '../_lib/types';

type ErrorPayload = {
  error?: string;
};

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    let message = 'Failed to fetch';
    try {
      const payload = (await response.json()) as ErrorPayload;
      if (typeof payload?.error === 'string' && payload.error.trim()) {
        message = payload.error;
      }
    } catch {
      // ignore parse errors and keep generic message
    }
    throw new Error(message);
  }
  return (await response.json()) as T;
}

export interface UseStocksResult {
  stockData: StockData[];
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  refetch: () => void;
  isFetching: boolean;
  lastFetchTime: number | null;
}

type UseStocksOptions = {
  autoRefreshEnabled?: boolean;
  autoRefreshSeconds?: number;
};

export function useStocks(
  companyId: string,
  date: string,
  options: UseStocksOptions = {},
): UseStocksResult {
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);
  const autoRefreshEnabled = options.autoRefreshEnabled ?? true;
  const autoRefreshSeconds = clampStockAutoRefreshSeconds(
    options.autoRefreshSeconds ?? DEFAULT_STOCK_AUTO_REFRESH_SECONDS,
  );
  const refreshIntervalMs = autoRefreshEnabled ? autoRefreshSeconds * 1000 : 0;

  const key =
    companyId && date
      ? `/api/stocks/${encodeURIComponent(companyId)}?date=${encodeURIComponent(date)}`
      : null;

  const { data, error, isValidating, mutate } = useSWR<StockData[]>(key, fetchJson, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    refreshInterval: key ? refreshIntervalMs : 0,
    refreshWhenHidden: false,
    refreshWhenOffline: false,
    dedupingInterval: 1000,
    onSuccess: () => {
      setLastFetchTime(Date.now());
    },
  });

  const status: 'idle' | 'loading' | 'success' | 'error' = key === null ? 'idle' : isValidating && !data ? 'loading' : error ? 'error' : 'success';

  return {
    stockData: data ?? [],
    status,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    refetch: () => {
      void mutate();
    },
    isFetching: Boolean(isValidating),
    lastFetchTime,
  };
}
