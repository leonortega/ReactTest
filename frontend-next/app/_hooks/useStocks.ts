'use client';

import { useRef, useState } from 'react';
import useSWR from 'swr';
import type { StockData } from '../_lib/types';

async function fetchJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, signal ? { signal } : undefined);
  if (!response.ok) throw new Error('Failed to fetch');
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

export function useStocks(
  companyId: string,
  date: string,
): UseStocksResult {
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);

  const key =
    companyId && date
      ? `/api/stocks/${encodeURIComponent(companyId)}?date=${encodeURIComponent(date)}`
      : null;
  const controllersRef = useRef<Record<string, AbortController | null>>({});

  const fetcher = async (url: string) => {
    try {
      controllersRef.current[url]?.abort();
    } catch {
      /* ignore */
    }
    const controller = new AbortController();
    controllersRef.current[url] = controller;

    try {
      return await fetchJson<StockData[]>(url, controller.signal);
    } finally {
      if (controllersRef.current[url] === controller) controllersRef.current[url] = null;
    }
  };

  const { data, error, isValidating, mutate } = useSWR<StockData[]>(key, fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: false,
    dedupingInterval: 5000,
    onSuccess: () => {
      setLastFetchTime(Date.now());
    },
  });

  const status: 'idle' | 'loading' | 'success' | 'error' = key === null ? 'idle' : isValidating && !data ? 'loading' : error ? 'error' : 'success';

  return {
    stockData: data ?? [],
    status,
    error: error ? String(error.message) : null,
    refetch: () => {
      void mutate();
    },
    isFetching: Boolean(isValidating),
    lastFetchTime,
  };
}
