'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createId } from '../_lib/ids';
import { updateStore } from '../_lib/storage';
import type { Watchlist } from '../_lib/types';

const storeFile = 'watchlists.json';
const symbolPattern = /^[A-Z0-9.-]{1,15}$/;

function parseSymbols(raw: string): string[] | null {
  if (!raw.trim()) return [];
  const symbols = raw
    .split(',')
    .map((symbol) => symbol.trim().toUpperCase())
    .filter(Boolean);

  if (!symbols.every((symbol) => symbolPattern.test(symbol))) {
    return null;
  }

  return symbols;
}

export async function createWatchlist(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const symbolsRaw = String(formData.get('symbols') ?? '').trim();
  const symbols = parseSymbols(symbolsRaw);

  if (!name || symbols === null) {
    redirect('/dashboard/watchlists?error=invalid-input');
  }

  const newItem: Watchlist = {
    id: createId(),
    name,
    symbols,
    createdAt: new Date().toISOString(),
  };

  await updateStore<{ items: Watchlist[] }>(storeFile, { items: [] }, (store) => ({
    ...store,
    items: [newItem, ...store.items],
  }));

  revalidatePath('/dashboard/watchlists');
  revalidatePath('/dashboard');
}
