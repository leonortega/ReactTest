import StockAnalyticsPage from '../../../_components/StockAnalyticsPage';
import { notFound } from 'next/navigation';
import { parseCompanyId, parseIsoDateParam } from '../../../_lib/requestValidation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol } = await params;
  const decodedSymbol = parseCompanyId(symbol);
  const symbolLabel = decodedSymbol ?? 'Stock';
  return {
    title: `${symbolLabel} Analytics | MarketPulse`,
    description: `Live analytics for ${symbolLabel} including SMA, EMA, and RSI signals.`,
    openGraph: {
      title: `${symbolLabel} Analytics | MarketPulse`,
      description: `Live analytics for ${symbolLabel} including SMA, EMA, and RSI signals.`,
      type: 'website',
    },
  };
}

export default async function AppStockPage({
  params,
  searchParams,
}: {
  params: Promise<{ symbol: string }>;
  searchParams?: Promise<{ date?: string | string[] }>;
}) {
  const [{ symbol }, resolvedSearchParams] = await Promise.all([
    params,
    searchParams,
  ]);
  const companyId = parseCompanyId(symbol);
  if (!companyId) {
    notFound();
  }

  const date =
    parseIsoDateParam(resolvedSearchParams?.date) ?? new Date().toISOString().slice(0, 10);

  return <StockAnalyticsPage companyId={companyId} date={date} />;
}
