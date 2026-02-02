import AppClient from './AppClient';
import type { StockData } from '../_lib/types';

export default async function StockAnalyticsPage({
  companyId,
  date,
}: {
  companyId: string;
  date: string;
}) {
  let initialStockData: StockData[] | undefined;
  let initialLastFetchTime: number | null = null;

  return (
    <AppClient
      initialCompanyId={companyId}
      initialDate={date}
      initialStockData={initialStockData}
      initialLastFetchTime={initialLastFetchTime}
    />
  );
}
