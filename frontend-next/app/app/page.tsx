import Link from 'next/link';
import { readStore } from '../_lib/storage';
import type { Alert, Notification, Preferences, Watchlist } from '../_lib/types';

export default async function DashboardPage() {
  const watchlists = await readStore<{ items: Watchlist[] }>('watchlists.json', { items: [] });
  const alerts = await readStore<{ items: Alert[] }>('alerts.json', { items: [] });
  const notifications = await readStore<{ items: Notification[] }>('notifications.json', {
    items: [],
  });
  const preferences = await readStore<Preferences>('preferences.json', {
    theme: 'system',
    currency: 'USD',
    notifications: { email: true, inApp: true },
  });

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Portfolio overview</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm text-slate-600">Watchlists</div>
            <div className="text-2xl font-semibold">{watchlists.items.length}</div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm text-slate-600">Active alerts</div>
            <div className="text-2xl font-semibold">
              {alerts.items.filter((alert) => alert.status === 'active').length}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="text-sm text-slate-600">Unread notifications</div>
            <div className="text-2xl font-semibold">
              {notifications.items.filter((note) => !note.read).length}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Preferences</h2>
        <div className="mt-2 text-sm text-slate-600">
          Theme: {preferences.theme} � Currency: {preferences.currency}
        </div>
        <Link className="mt-3 inline-flex text-sm font-medium" href="/app/preferences">
          Update preferences
        </Link>
      </section>
    </div>
  );
}
