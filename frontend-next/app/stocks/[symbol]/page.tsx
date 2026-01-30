import StockAnalyticsPage from '../../_components/StockAnalyticsPage';

export const revalidate = 10;

export function generateMetadata({ params }: { params: { symbol: string } }) {
  const symbol = decodeURIComponent(params.symbol).toUpperCase();
  return {
    title: `${symbol} Analytics | MarketPulse`,
    description: `Live analytics for ${symbol} including SMA, EMA, and RSI signals.`,
    openGraph: {
      title: `${symbol} Analytics | MarketPulse`,
      description: `Live analytics for ${symbol} including SMA, EMA, and RSI signals.`,
      type: 'website',
    },
  };
}

export default function StockPage({
  params,
  searchParams,
}: {
  params: { symbol: string };
  searchParams?: { date?: string; view?: string };
}) {
  const companyId = decodeURIComponent(params.symbol).toUpperCase();
  const date = searchParams?.date ?? new Date().toISOString().slice(0, 10);
  const view = (searchParams?.view ?? 'intraday') as 'intraday' | 'historical';

  return <StockAnalyticsPage companyId={companyId} date={date} view={view} />;
}
