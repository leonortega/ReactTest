import AppClient from './AppClient';
import { fetchStockData } from '../_lib/stocks';
import type { StockData } from '../_lib/types';

export default async function StockAnalyticsPage({
  companyId,
  date,
  view,
}: {
  companyId: string;
  date: string;
  view: 'intraday' | 'historical';
}) {
  let initialStockData: StockData[] | undefined;
  let initialLastFetchTime: number | null = null;
  const shouldSkipServerFetch = process.env.SKIP_SERVER_STOCKS_FETCH === 'true';

  if (!shouldSkipServerFetch) {
    try {
      initialStockData = await fetchStockData(companyId, date, view);
      initialLastFetchTime = Date.now();
    } catch {
      initialStockData = undefined;
      initialLastFetchTime = null;
    }
  }

  return (
    <AppClient
      initialCompanyId={companyId}
      initialDate={date}
      initialStockData={initialStockData}
      initialLastFetchTime={initialLastFetchTime}
      initialView={view}
    />
  );
}
