'use server';

import { revalidatePath } from 'next/cache';
import { readStore, writeStore } from '../_lib/storage';
import type { Preferences } from '../_lib/types';

const storeFile = 'preferences.json';

const fallback: Preferences = {
  theme: 'system',
  currency: 'USD',
  notifications: { email: true, inApp: true },
};

export async function updatePreferences(formData: FormData) {
  const theme = String(formData.get('theme') ?? 'system') as Preferences['theme'];
  const currency = String(formData.get('currency') ?? 'USD') as Preferences['currency'];
  const email = Boolean(formData.get('email'));
  const inApp = Boolean(formData.get('inApp'));

  const store = await readStore<Preferences>(storeFile, fallback);
  const next = {
    ...store,
    theme,
    currency,
    notifications: {
      email,
      inApp,
    },
  } satisfies Preferences;

  await writeStore(storeFile, next);
  revalidatePath('/dashboard/preferences');
  revalidatePath('/dashboard');
}

export async function updateTheme(formData: FormData) {
  const theme = String(formData.get('theme') ?? 'system') as Preferences['theme'];
  const store = await readStore<Preferences>(storeFile, fallback);
  const next = {
    ...store,
    theme,
  } satisfies Preferences;

  await writeStore(storeFile, next);
  revalidatePath('/');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/preferences');
}
