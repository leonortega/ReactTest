import AppClient from './AppClient';
import type { StockData } from '../_lib/types';
import { SWRConfig } from 'swr';

export default async function StockAnalyticsPage({
  companyId,
  date,
}: {
  companyId: string;
  date: string;
}) {
  const key = `/api/stocks/${encodeURIComponent(companyId)}?date=${encodeURIComponent(
    date,
  )}`;

  let initialStockData: StockData[] | undefined = undefined;
  let initialLastFetchTime: number | null = null;

  try {
    const res = await fetch(key, { cache: 'no-store' });
    if (res.ok) {
      initialStockData = (await res.json()) as StockData[];
      initialLastFetchTime = Date.now();
    }
  } catch {
    // ignore server fetch errors and allow client to fetch
  }

  const fallback = initialStockData ? { [key]: initialStockData } : {};

  return (
    <SWRConfig value={{ fallback }}>
      <AppClient
        initialCompanyId={companyId}
        initialDate={date}
        initialStockData={initialStockData}
        initialLastFetchTime={initialLastFetchTime}
      />
    </SWRConfig>
  );
}
