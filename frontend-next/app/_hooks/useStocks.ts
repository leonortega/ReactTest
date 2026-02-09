 'use client';

import { useRef } from 'react';
import useSWR from 'swr';
import type { StockData } from '../_lib/types';
import fetchJson from '../_lib/fetcher';

export interface UseStocksOptions {
  initialData?: StockData[];
  initialLastFetchTime?: number | null;
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
  options?: UseStocksOptions,
): UseStocksResult {

  const initialKeyRef = useRef(`${companyId}-${date}`);

  const key = companyId && date ? `/api/stocks/${encodeURIComponent(companyId)}?date=${encodeURIComponent(date)}` : null;
  const controllersRef = useRef<Record<string, AbortController | null>>({}); // No changes made

  const fetcher = async (url: string) => {
    // cancel any previous inflight request for the same key
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
      // clear controller after request settles
      if (controllersRef.current[url] === controller) controllersRef.current[url] = null;
    }
  };

  const { data, error, isValidating, mutate } = useSWR<StockData[]>(key, fetcher, {
    refreshInterval: 5000,
    revalidateOnFocus: false,
    dedupingInterval: 5000,
    fallbackData: options?.initialData,
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
    lastFetchTime: status === 'success' ? Date.now() : options?.initialLastFetchTime ?? null,
  };
}
