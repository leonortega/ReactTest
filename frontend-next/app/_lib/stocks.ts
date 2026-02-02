import type { StockData } from './types';

const defaultBaseUrl = 'http://localhost:8080/api';

export async function fetchStockData(
  companyId: string,
  date: string,
  view: 'intraday' | 'historical' = 'intraday',
): Promise<StockData[]> {
  const baseUrl = (
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    defaultBaseUrl
  ).replace(/\/$/, '');
  const apiUrl = `${baseUrl}/stocks/${encodeURIComponent(companyId)}?date=${encodeURIComponent(date)}&view=${encodeURIComponent(view)}`;

  const response = await fetch(apiUrl, { next: { revalidate: 10 } });
  if (!response.ok) {
    throw new Error('Failed to fetch stocks');
  }

  return response.json();
}
