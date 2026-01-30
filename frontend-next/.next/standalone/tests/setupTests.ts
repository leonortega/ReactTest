import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll, vi } from 'vitest';
import { createElement, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import os from 'node:os';

let server: typeof import('./mocks/server').server;
let dataDir = '';

vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => createElement('img', props),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...rest
  }: AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    children?: ReactNode;
  }) => createElement('a', { href, ...rest }, children),
}));

beforeAll(async () => {
  dataDir = await fs.mkdtemp(path.join(os.tmpdir(), 'frontend-next-tests-'));
  process.env.MP_DATA_DIR = dataDir;
  if ('localStorage' in globalThis) {
    delete (globalThis as { localStorage?: Storage }).localStorage;
  }

  ({ server } = await import('./mocks/server'));
  server.listen({ onUnhandledRequest: 'error' });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
  if (dataDir) {
    return fs.rm(dataDir, { recursive: true, force: true });
  }
});
