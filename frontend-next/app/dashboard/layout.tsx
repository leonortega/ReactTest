import type { ReactNode } from 'react';
import DashboardNav from '../_components/DashboardNav';
import Card from '../_components/ui/Card';

export const metadata = {
  title: 'Dashboard | MarketPulse',
  description: 'Portfolio overview, watchlists, and alert monitoring.',
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg">
      <header className="mx-auto grid max-w-[1100px] gap-4 px-6 pt-8">
        <Card variant="elevated" className="grid gap-1 p-5">
          <h1 className="text-2xl font-semibold tracking-tight text-text">MarketPulse Dashboard</h1>
          <p className="text-sm text-text-muted">Manage portfolios, alerts, and preferences.</p>
        </Card>
        <div>
          <DashboardNav />
        </div>
      </header>
      <main className="mx-auto max-w-[1100px] px-6 py-8">{children}</main>
    </div>
  );
}
