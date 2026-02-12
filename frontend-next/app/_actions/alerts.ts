'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createId } from '../_lib/ids';
import { updateStore } from '../_lib/storage';
import type { Alert, AlertJob, Notification } from '../_lib/types';

const alertsFile = 'alerts.json';
const notificationsFile = 'notifications.json';
const jobsFile = 'jobs.json';
const symbolPattern = /^[A-Z0-9.-]{1,15}$/;

function parseSymbol(value: FormDataEntryValue | null): string | null {
  const symbol = String(value ?? '')
    .trim()
    .toUpperCase();
  return symbolPattern.test(symbol) ? symbol : null;
}

function parseThreshold(value: FormDataEntryValue | null): number | null {
  const threshold = Number(value);
  if (!Number.isFinite(threshold) || threshold <= 0) return null;
  return Math.round(threshold * 100) / 100;
}

function parseDirection(value: FormDataEntryValue | null): Alert['direction'] | null {
  return value === 'above' || value === 'below' ? value : null;
}

function parseSchedule(value: FormDataEntryValue | null): Alert['schedule'] | null {
  return value === 'realtime' || value === 'daily' || value === 'weekly' ? value : null;
}

export async function createAlert(formData: FormData) {
  const symbol = parseSymbol(formData.get('symbol'));
  const threshold = parseThreshold(formData.get('threshold'));
  const directionEntry = formData.get('direction');
  const scheduleEntry = formData.get('schedule');
  const direction = directionEntry === null ? 'above' : parseDirection(directionEntry);
  const schedule = scheduleEntry === null ? 'realtime' : parseSchedule(scheduleEntry);

  if (!symbol || threshold === null || !direction || !schedule) {
    redirect('/dashboard/alerts?error=invalid-input');
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
