import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import SiteHeader from './_components/SiteHeader';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'MarketPulse',
  description: 'Real-time stock intelligence platform.',
  openGraph: {
    title: 'MarketPulse',
    description: 'Real-time stock intelligence platform.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 antialiased`}>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
