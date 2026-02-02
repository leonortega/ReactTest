import StockAnalyticsPage from '../../../_components/StockAnalyticsPage';

export const revalidate = 10;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const decodedSymbol = decodeURIComponent(symbol).toUpperCase();
  return {
    title: `${decodedSymbol} Analytics | MarketPulse`,
    description: `Live analytics for ${decodedSymbol} including SMA, EMA, and RSI signals.`,
    openGraph: {
      title: `${decodedSymbol} Analytics | MarketPulse`,
      description: `Live analytics for ${decodedSymbol} including SMA, EMA, and RSI signals.`,
      type: 'website',
    },
  };
}

export default async function AppStockPage({
  params,
  searchParams,
}: {
  params: Promise<{ symbol: string }>;
  searchParams?: Promise<{ date?: string; view?: string }>;
}) {
  const [{ symbol }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const companyId = decodeURIComponent(symbol).toUpperCase();
  const date = resolvedSearchParams?.date ?? new Date().toISOString().slice(0, 10);
  const view = (resolvedSearchParams?.view ?? 'intraday') as 'intraday' | 'historical';

  return <StockAnalyticsPage companyId={companyId} date={date} view={view} />;
}
