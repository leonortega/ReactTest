import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setupTests.ts',
    css: true,
    globals: true,
    include: ['tests/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['tests/e2e/**', '**/node_modules/**', '.next/**'],
    maxConcurrency: 1,
    sequence: {
      concurrent: false,
    },
  },
});
