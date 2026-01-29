import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  outputDir: './test-results',
  use: {
    browserName: 'chromium',
    channel: 'chrome',
    baseURL: 'http://localhost:5173',
  },
  webServer: {
    command: 'npm run dev -- --host',
    port: 5173,
    reuseExistingServer: !process.env.CI,
    env: {
      VITE_API_BASE_URL: 'http://localhost:60480/api',
    },
  },
});
