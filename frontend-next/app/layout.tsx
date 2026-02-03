import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import SiteHeader from './_components/SiteHeader';
import { readStore } from './_lib/storage';
import type { Preferences } from './_lib/types';

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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const preferences = await readStore<Preferences>('preferences.json', {
    theme: 'system',
    currency: 'USD',
    notifications: { email: true, inApp: true },
  });
  const themeAttribute = preferences.theme === 'dark' ? 'dark' : undefined;

  return (
    <html lang="en" data-theme={themeAttribute}>
      <body className={`${inter.className} min-h-screen bg-slate-50 text-slate-900 antialiased`}>
        <SiteHeader theme={preferences.theme} />
        {children}
      </body>
    </html>
  );
}
