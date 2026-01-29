import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return defineConfig({
    plugins: [react()],
    // Touching this line for TS migration consistency
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
      setupFiles: './src/setupTests.ts',
      css: true,
      globals: true,
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
      exclude: ['e2e/**', '**/node_modules/**', 'dist/**'],
    },
  })
}