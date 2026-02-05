import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async rewrites() {
    const baseUrl = process.env.INTERNAL_API_BASE_URL ?? 'http://127.0.0.1:8080';
    const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    return [
      {
        source: '/api/:path*',
        destination: `${normalizedBaseUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
