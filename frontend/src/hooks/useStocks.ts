import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export type StockPoint = {
  dateTime: string;
  price: string | number;
};

export type ApiError = {
  status: number;
  message: string;
  body?: string;
};

export type UseStocksResult = {
  stockData: StockPoint[];
  status: 'idle' | 'loading' | 'error' | 'success';
  error: ApiError | null;
  refetch: () => void;
  isFetching: boolean;
  lastFetchTime: Date | null;
};

async function fetchStocks({ queryKey, signal }: { queryKey: unknown[]; signal: AbortSignal }) {
  const [_key, { companyId, date }] = queryKey as [string, { companyId: string; date: string }];

  const apiPath = `/stocks/${encodeURIComponent(companyId)}?date=${encodeURIComponent(date)}`;
  const url = `${import.meta.env.VITE_API_BASE_URL}${apiPath.startsWith('/') ? '' : '/'}${apiPath}`;

  const res = await fetch(url, { signal });
  if (!res.ok) {
    const body = await res.text();
    const apiErr: ApiError = { status: res.status, message: res.statusText || 'Request failed', body };
    throw apiErr;
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export function useStocks(companyId: string, date: string): UseStocksResult {
  const [lastFetchTime, setLastFetchTime] = useState<Date | null>(null);

  const enabled = Boolean(companyId && date);
  const query = useQuery<StockPoint[], ApiError, StockPoint[]>({
    queryKey: ['stocks', { companyId, date }],
    queryFn: fetchStocks,
    enabled,
    refetchInterval: 5000,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: 1,
    onSuccess: () => setLastFetchTime(new Date()),
  });

  return {
    stockData: query.data ?? [],
    status: query.status as UseStocksResult['status'],
    error: (query.error as ApiError) ?? null,
    refetch: query.refetch as () => void,
    isFetching: query.isFetching,
    lastFetchTime,
  };
}
