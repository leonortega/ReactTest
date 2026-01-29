import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest';

let server: typeof import('./mocks/server').server;

beforeAll(async () => {
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
});
