import { defineConfig, loadEnv, type ConfigEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, process.cwd(), '')

  return defineConfig({
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
      open: false,
      ...(env.VITE_API_BASE_URL
        ? {
            proxy: {
              '/api': {
                target: env.VITE_API_BASE_URL,
                changeOrigin: true,
                secure: false,
              },
            },
          }
        : {}),
    },
    test: {
      environment: 'jsdom',
      setupFiles: './tests/setupTests.ts',
      css: true,
      globals: true,
      include: ['tests/**/*.{test,spec}.{ts,tsx}'],
      exclude: ['tests/e2e/**', '**/node_modules/**', 'dist/**'],
    },
  })
}
