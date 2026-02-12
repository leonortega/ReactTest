import { promises as fs } from 'fs';
import { join } from 'path';

const fileLocks = new Map<string, Promise<void>>();

function getDataDir() {
  return process.env.MP_DATA_DIR ?? join(process.cwd(), 'data');
}

async function ensureDir() {
  await fs.mkdir(getDataDir(), { recursive: true });
}

async function resolvePath(fileName: string) {
  await ensureDir();
  return join(getDataDir(), fileName);
}

async function withFileLock<T>(fileName: string, task: () => Promise<T>): Promise<T> {
  const previous = fileLocks.get(fileName) ?? Promise.resolve();
  let release!: () => void;
  const pending = new Promise<void>((resolve) => {
    release = resolve;
  });
  const current = previous.then(() => pending);
  fileLocks.set(fileName, current);

  await previous;

  try {
    return await task();
  } finally {
    release();
    if (fileLocks.get(fileName) === current) {
      fileLocks.delete(fileName);
    }
  }
}

async function readStoreInternal<T>(fileName: string, fallback: T): Promise<T> {
  const filePath = await resolvePath(fileName);
  let raw: string;

  try {
    raw = await fs.readFile(filePath, 'utf-8');
  } catch (err) {
    const error = err as NodeJS.ErrnoException;
    if (error.code !== 'ENOENT') throw err;
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
    return fallback;
  }
}

async function writeStoreInternal<T>(fileName: string, data: T) {
  const filePath = await resolvePath(fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function readStore<T>(fileName: string, fallback: T): Promise<T> {
  return readStoreInternal(fileName, fallback);
}

export async function writeStore<T>(fileName: string, data: T) {
  return withFileLock(fileName, () => writeStoreInternal(fileName, data));
}

export async function updateStore<T>(
  fileName: string,
  fallback: T,
  updater: (current: T) => T | Promise<T>,
): Promise<T> {
  return withFileLock(fileName, async () => {
    const current = await readStoreInternal(fileName, fallback);
    const next = await updater(current);
    await writeStoreInternal(fileName, next);
    return next;
  });
}
