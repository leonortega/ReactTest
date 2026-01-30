'use server';

import { revalidatePath } from 'next/cache';
import { createId } from '../_lib/ids';
import { readStore, writeStore } from '../_lib/storage';
import type { Alert, AlertJob, Notification } from '../_lib/types';

const alertsFile = 'alerts.json';
const notificationsFile = 'notifications.json';
const jobsFile = 'jobs.json';

export async function createAlert(formData: FormData) {
  const symbol = String(formData.get('symbol') ?? '')
    .trim()
    .toUpperCase();
  const threshold = Number(formData.get('threshold'));
  const direction = String(formData.get('direction') ?? 'above') as Alert['direction'];
  const schedule = String(formData.get('schedule') ?? 'realtime') as Alert['schedule'];

  if (!symbol || Number.isNaN(threshold)) {
    return;
  }

  const alertsStore = await readStore<{ items: Alert[] }>(alertsFile, { items: [] });
  const alert: Alert = {
    id: createId(),
    symbol,
    threshold,
    direction,
    schedule,
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  alertsStore.items.unshift(alert);
  await writeStore(alertsFile, alertsStore);

  const notificationsStore = await readStore<{ items: Notification[] }>(notificationsFile, {
    items: [],
  });
  const message = `Alert set for ${symbol} ${direction} ${threshold}.`;
  notificationsStore.items.unshift(
    {
      id: createId(),
      alertId: alert.id,
      channel: 'in-app',
      message,
      createdAt: new Date().toISOString(),
      read: false,
    },
    {
      id: createId(),
      alertId: alert.id,
      channel: 'email',
      message,
      createdAt: new Date().toISOString(),
      read: false,
    },
  );
  await writeStore(notificationsFile, notificationsStore);

  const jobsStore = await readStore<{ items: AlertJob[] }>(jobsFile, { items: [] });
  jobsStore.items.unshift({
    id: createId(),
    alertId: alert.id,
    runAt: new Date(Date.now() + 60_000).toISOString(),
    status: 'queued',
  });
  await writeStore(jobsFile, jobsStore);

  revalidatePath('/app/alerts');
  revalidatePath('/app/alerts/history');
  revalidatePath('/app');
}
