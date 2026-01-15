import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import PropTypes from 'prop-types';

async function fetchStocks({ queryKey, signal }) {
  const [_key, { companyId, date }] = queryKey;

  const apiPath = `/stocks/${encodeURIComponent(companyId)}?date=${encodeURIComponent(date)}`;
  const url = `${import.meta.env.VITE_API_BASE_URL}${apiPath.startsWith('/') ? '' : '/'}${apiPath}`;

  const res = await fetch(url, { signal });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Request failed: ${res.status} ${body}`);
  }

useStocks.propTypes = {
  companyId: PropTypes.string,
  date: PropTypes.string,
};

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export function useStocks(companyId, date) {
  const [lastFetchTime, setLastFetchTime] = useState(null);

  const enabled = Boolean(companyId && date);
  const query = useQuery({
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
    status: query.status,
    error: query.error,
    refetch: query.refetch,
    isFetching: query.isFetching,
    lastFetchTime,
  };
}
