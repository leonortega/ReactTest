import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  outputDir: './test-results',
  use: {
    browserName: 'chromium',
    channel: 'chrome',
    baseURL: 'http://localhost:3000',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
    env: {
      SKIP_SERVER_STOCKS_FETCH: 'true',
    },
  },
});
