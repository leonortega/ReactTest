import { describe, expect, it, vi, beforeEach } from 'vitest';

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
}));

vi.mock('../../app/_lib/ids', () => ({
  createId: () => 'id-1',
}));

import { createAlert } from '../../app/_actions/alerts';
import { updatePreferences } from '../../app/_actions/preferences';
import { createWatchlist } from '../../app/_actions/watchlists';
import { readStore, writeStore } from '../../app/_lib/storage';

beforeEach(async () => {
  await writeStore('watchlists.json', { items: [] });
  await writeStore('alerts.json', { items: [] });
  await writeStore('notifications.json', { items: [] });
  await writeStore('jobs.json', { items: [] });
  await writeStore('preferences.json', {
    theme: 'system',
    currency: 'USD',
    notifications: { email: true, inApp: true },
  });
});

describe('server actions', () => {
  it('creates a watchlist entry', async () => {
    const formData = new FormData();
    formData.set('name', 'Core');
    formData.set('symbols', 'abc, xyz');

    await createWatchlist(formData);

    const store = await readStore<{ items: Array<{ name: string; symbols: string[] }> }>('watchlists.json', {
      items: [],
    });

    expect(store.items[0].name).toBe('Core');
    expect(store.items[0].symbols).toEqual(['ABC', 'XYZ']);
  });

  it('creates alert, notifications, and job entries', async () => {
    const formData = new FormData();
    formData.set('symbol', 'ABC');
    formData.set('threshold', '120');
    formData.set('direction', 'above');
    formData.set('schedule', 'realtime');

    await createAlert(formData);

    const alerts = await readStore<{ items: Array<{ symbol: string }> }>('alerts.json', { items: [] });
    const notifications = await readStore<{ items: Array<{ channel: string }> }>('notifications.json', {
      items: [],
    });
    const jobs = await readStore<{ items: Array<{ status: string }> }>('jobs.json', { items: [] });

    expect(alerts.items[0].symbol).toBe('ABC');
    expect(notifications.items.length).toBeGreaterThan(0);
    expect(jobs.items[0].status).toBe('queued');
  });

  it('updates user preferences', async () => {
    const formData = new FormData();
    formData.set('theme', 'dark');
    formData.set('currency', 'EUR');
    formData.set('email', '');
    formData.set('inApp', 'on');

    await updatePreferences(formData);

    const preferences = await readStore<{
      theme: string;
      currency: string;
      notifications: { email: boolean; inApp: boolean };
    }>('preferences.json', {
      theme: 'system',
      currency: 'USD',
      notifications: { email: true, inApp: true },
    });

    expect(preferences.theme).toBe('dark');
    expect(preferences.currency).toBe('EUR');
    expect(preferences.notifications.email).toBe(false);
    expect(preferences.notifications.inApp).toBe(true);
  });
});
