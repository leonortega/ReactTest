'use server';

import { revalidatePath } from 'next/cache';
import { createId } from '../_lib/ids';
import { readStore, writeStore } from '../_lib/storage';
import type { Watchlist } from '../_lib/types';

const storeFile = 'watchlists.json';

export async function createWatchlist(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  const symbolsRaw = String(formData.get('symbols') ?? '').trim();

  if (!name) {
    return;
  }

  const symbols = symbolsRaw
    .split(',')
    .map((symbol) => symbol.trim().toUpperCase())
    .filter(Boolean);

  const store = await readStore<{ items: Watchlist[] }>(storeFile, { items: [] });
  store.items.unshift({
    id: createId(),
    name,
    symbols,
    createdAt: new Date().toISOString(),
  });

  await writeStore(storeFile, store);
  revalidatePath('/app/watchlists');
  revalidatePath('/app');
}
