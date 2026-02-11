import AppClient from './AppClient';

export default function StockAnalyticsPage({
  companyId,
  date,
}: {
  companyId: string;
  date: string;
}) {
  return <AppClient initialCompanyId={companyId} initialDate={date} />;
}
