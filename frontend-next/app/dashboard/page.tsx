import Link from 'next/link';
import { readStore } from '../_lib/storage';
import type { Alert, Notification, Preferences, Watchlist } from '../_lib/types';
import Card, { CardDescription, CardTitle } from '../_components/ui/Card';
import { getButtonClassName } from '../_components/ui/Button';

export default async function DashboardPage() {
  const [watchlists, alerts, notifications, preferences] = await Promise.all([
    readStore<{ items: Watchlist[] }>('watchlists.json', { items: [] }),
    readStore<{ items: Alert[] }>('alerts.json', { items: [] }),
    readStore<{ items: Notification[] }>('notifications.json', { items: [] }),
    readStore<Preferences>('preferences.json', {
      theme: 'light',
      currency: 'USD',
      notifications: { email: true, inApp: true },
    }),
  ]);
  const theme = preferences.theme === 'dark' ? 'dark' : 'light';

  return (
    <div className="grid gap-6">
      <Card variant="panel">
        <CardTitle>Portfolio overview</CardTitle>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <Card variant="metric" as="article">
            <div className="text-sm text-text-muted">Watchlists</div>
            <div className="text-data text-3xl font-semibold text-text">{watchlists.items.length}</div>
          </Card>
          <Card variant="metric" as="article">
            <div className="text-sm text-text-muted">Active alerts</div>
            <div className="text-data text-3xl font-semibold text-text">
              {alerts.items.filter((alert) => alert.status === 'active').length}
            </div>
          </Card>
          <Card variant="metric" as="article">
            <div className="text-sm text-text-muted">Unread notifications</div>
            <div className="text-data text-3xl font-semibold text-text">
              {notifications.items.filter((note) => !note.read).length}
            </div>
          </Card>
        </div>
      </Card>

      <Card variant="panel">
        <CardTitle>Preferences</CardTitle>
        <CardDescription className="mt-2">
          Theme: {theme} &middot; Currency: {preferences.currency}
        </CardDescription>
        <Link
          className={getButtonClassName({
            variant: 'secondary',
            size: 'sm',
            className: 'mt-4 w-fit no-underline',
          })}
          href="/dashboard/preferences"
        >
          Update preferences
        </Link>
      </Card>
    </div>
  );
}
