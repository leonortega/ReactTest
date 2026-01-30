import type { ReactNode } from 'react';
import DashboardNav from '../_components/DashboardNav';

export const metadata = {
  title: 'Dashboard | MarketPulse',
  description: 'Portfolio overview, watchlists, and alert monitoring.',
};

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="mx-auto max-w-[1100px] px-6 pt-10">
        <h1 className="text-2xl font-semibold">MarketPulse Dashboard</h1>
        <p className="text-sm text-slate-600">Manage portfolios, alerts, and preferences.</p>
        <div className="mt-4">
          <DashboardNav />
        </div>
      </header>
      <main className="mx-auto max-w-[1100px] px-6 py-8">{children}</main>
    </div>
  );
}
