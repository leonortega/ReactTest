'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { StockData } from '../_lib/types';

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
  const [stockData, setStockData] = useState<StockData[]>(options?.initialData ?? []);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    options?.initialData ? 'success' : 'idle',
  );
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(
    options?.initialLastFetchTime ?? null,
  );
  const initialKeyRef = useRef(`${companyId}-${date}`);
  const hasUsedInitialRef = useRef(false);

  const fetchStocks = useCallback(() => {
    if (!companyId || !date) return;

    setStatus('loading');
    setIsFetching(true);
    setError(null);

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ??
      process.env.VITE_API_BASE_URL ??
      '/api';
    const normalizedBaseUrl = apiBaseUrl.endsWith('/')
      ? apiBaseUrl.slice(0, -1)
      : apiBaseUrl;
    const url = `${normalizedBaseUrl}/stocks?companyId=${encodeURIComponent(companyId)}&date=${encodeURIComponent(date)}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch stocks');
        return res.json();
      })
      .then((data) => {
        setStockData(data);
        setStatus('success');
        setLastFetchTime(Date.now());
      })
      .catch((err) => {
        setError(err.message);
        setStatus('error');
      })
      .finally(() => setIsFetching(false));
  }, [companyId, date]);

  useEffect(() => {
    if (!(companyId && date)) return;

    const key = `${companyId}-${date}`;
    if (!hasUsedInitialRef.current && options?.initialData && key === initialKeyRef.current) {
      hasUsedInitialRef.current = true;
      return;
    }

    fetchStocks();
  }, [companyId, date, fetchStocks, options?.initialData]);

  useEffect(() => {
    if (!(companyId && date)) return;

    const id = window.setInterval(() => {
      fetchStocks();
    }, 5000);

    return () => window.clearInterval(id);
  }, [companyId, date, fetchStocks]);

  return {
    stockData,
    status,
    error,
    refetch: fetchStocks,
    isFetching,
    lastFetchTime,
  };
}
