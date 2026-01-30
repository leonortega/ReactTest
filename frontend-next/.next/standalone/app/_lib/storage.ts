import { promises as fs } from 'fs';
import path from 'path';

function getDataDir() {
  return process.env.MP_DATA_DIR ?? path.join(process.cwd(), 'data');
}

async function ensureDir() {
  await fs.mkdir(getDataDir(), { recursive: true });
}

async function ensureFile<T>(fileName: string, fallback: T) {
  await ensureDir();
  const filePath = path.join(getDataDir(), fileName);
  try {
    await fs.access(filePath);
  } catch {
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
  }
  return filePath;
}

export async function readStore<T>(fileName: string, fallback: T): Promise<T> {
  const filePath = await ensureFile(fileName, fallback);
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

export async function writeStore<T>(fileName: string, data: T) {
  const filePath = await ensureFile(fileName, data);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}
