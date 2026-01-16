import { useState, useEffect, useCallback } from 'react';

export interface StockData {
  dateTime: string;
  price: number;
}

// compatibility types used by components
export type StockPoint = StockData;
export type ApiError = string | null;

export interface UseStocksResult {
  stockData: StockData[];
  status: 'idle' | 'loading' | 'success' | 'error';
  error: string | null;
  refetch: () => void;
  isFetching: boolean;
  lastFetchTime: number | null;
}

export function useStocks(companyId: string, date: string): UseStocksResult {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState<number | null>(null);

  const fetchStocks = useCallback(() => {
    setStatus('loading');
    setIsFetching(true);
    setError(null);

    const env = (import.meta as any).env;
    const base = env && env.VITE_API_BASE_URL ? String(env.VITE_API_BASE_URL) : '';

    const url = base
      ? `${base.replace(/\/$/, '')}/stocks/${companyId}?date=${date}`
      : `/stocks/${companyId}?date=${date}`;

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
    if (companyId && date) {
      fetchStocks();
    }
  }, [companyId, date, fetchStocks]);

  useEffect(() => {
    if (!(companyId && date)) return;

    const id = setInterval(() => {
      fetchStocks();
    }, 5000);

    return () => clearInterval(id);
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
