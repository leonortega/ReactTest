import type { StockData } from './types';
import fetchJson from './fetcher';

export async function fetchStockData(
  companyId: string,
  date: string,
  view: 'intraday' | 'historical' = 'intraday',
): Promise<StockData[]> {
  const apiUrl = `/api/stocks/${encodeURIComponent(companyId)}?date=${encodeURIComponent(
    date,
  )}&view=${encodeURIComponent(view)}`;

  return await fetchJson<StockData[]>(apiUrl);
}
