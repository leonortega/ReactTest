'use server';

import { revalidatePath } from 'next/cache';
import { updateStore } from '../_lib/storage';
import type { Preferences } from '../_lib/types';

const storeFile = 'preferences.json';

const fallback: Preferences = {
  theme: 'light',
  currency: 'USD',
  notifications: { email: true, inApp: true },
};

function parseTheme(value: FormDataEntryValue | null): Preferences['theme'] {
  return value === 'dark' ? 'dark' : 'light';
}

function parseCurrency(value: FormDataEntryValue | null): Preferences['currency'] {
  return value === 'EUR' || value === 'GBP' ? value : 'USD';
}

function parseCheckbox(value: FormDataEntryValue | null): boolean {
  return value === 'on' || value === 'true' || value === '1';
}

export async function updatePreferences(formData: FormData) {
  const theme = parseTheme(formData.get('theme'));
  const currency = parseCurrency(formData.get('currency'));
  const email = parseCheckbox(formData.get('email'));
  const inApp = parseCheckbox(formData.get('inApp'));

  await updateStore<Preferences>(storeFile, fallback, (store) => ({
    ...store,
    theme,
    currency,
    notifications: {
      email,
      inApp,
    },
  }));

  revalidatePath('/dashboard/preferences');
  revalidatePath('/dashboard');
}

export async function updateTheme(formData: FormData) {
  const theme = parseTheme(formData.get('theme'));

  await updateStore<Preferences>(storeFile, fallback, (store) => ({
    ...store,
    theme,
  }));

  revalidatePath('/');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/preferences');
}
