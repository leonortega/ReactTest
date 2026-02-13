import './globals.css';
import type { Metadata } from 'next';
import { IBM_Plex_Mono, Manrope } from 'next/font/google';
import SiteHeader from './_components/SiteHeader';
import { readStore } from './_lib/storage';
import type { Preferences } from './_lib/types';

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-plex-mono',
});

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
    theme: 'light',
    currency: 'USD',
    notifications: { email: true, inApp: true },
  });
  const theme = preferences.theme === 'dark' ? 'dark' : 'light';

  return (
    <html lang="en" data-theme={theme}>
      <body
        className={`${manrope.className} ${manrope.variable} ${ibmPlexMono.variable} min-h-screen bg-bg text-text antialiased`}
      >
        <SiteHeader theme={theme} />
        {children}
      </body>
    </html>
  );
}
