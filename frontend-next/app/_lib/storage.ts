import { promises as fs } from 'fs';
import { join } from 'path';

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

export async function readStore<T>(fileName: string, fallback: T): Promise<T> {
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

export async function writeStore<T>(fileName: string, data: T) {
  const filePath = await resolvePath(fileName);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
