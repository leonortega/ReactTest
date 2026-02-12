'use server';

import { revalidatePath } from 'next/cache';
import { createId } from '../_lib/ids';
import { updateStore } from '../_lib/storage';
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

  const alert: Alert = {
    id: createId(),
    symbol,
    threshold,
    direction,
    schedule,
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  await updateStore<{ items: Alert[] }>(alertsFile, { items: [] }, (store) => ({
    ...store,
    items: [alert, ...store.items],
  }));

  const message = `Alert set for ${symbol} ${direction} ${threshold}.`;
  const notifications: Notification[] = [
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
  ];

  await updateStore<{ items: Notification[] }>(notificationsFile, { items: [] }, (store) => ({
    ...store,
    items: [...notifications, ...store.items],
  }));

  const job: AlertJob = {
    id: createId(),
    alertId: alert.id,
    runAt: new Date(Date.now() + 60_000).toISOString(),
    status: 'queued',
  };

  await updateStore<{ items: AlertJob[] }>(jobsFile, { items: [] }, (store) => ({
    ...store,
    items: [job, ...store.items],
  }));

  revalidatePath('/dashboard/alerts');
  revalidatePath('/dashboard/alerts/history');
  revalidatePath('/dashboard');
}
