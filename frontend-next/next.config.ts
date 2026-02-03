import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async rewrites() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api';
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
