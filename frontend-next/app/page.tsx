import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { highlights } from './_lib/content';
import logo from '../public/logo.svg';

export const metadata: Metadata = {
  title: 'MarketPulse | Real-time stock intelligence',
  description: 'Monitor portfolios, watchlists, and alerts with live analytics.',
  openGraph: {
    title: 'MarketPulse | Real-time stock intelligence',
    description: 'Monitor portfolios, watchlists, and alerts with live analytics.',
    type: 'website',
  },
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'MarketPulse',
  applicationCategory: 'FinanceApplication',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-[980px] px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <header className="flex flex-col gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <Image src={logo} alt="MarketPulse" width={48} height={48} priority />
          <div>
            <div className="site-title text-2xl">MarketPulse</div>
            <div className="site-subtitle">Real-time stock intelligence</div>
          </div>
        </div>
        <div className="ml-auto flex gap-3">
          <Link className="btn-primary" href="/app">
            Open dashboard
          </Link>
          <Link className="btn-primary bg-slate-200 text-slate-900" href="/pricing">
            View pricing
          </Link>
        </div>
      </header>

      <section className="mt-10 grid gap-6 md:grid-cols-3">
        {highlights.map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
          </div>
        ))}
      </section>

      <section className="mt-10 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Quick start</h2>
        <p className="mt-2 text-sm text-slate-600">
          Explore the dashboard or jump directly into analytics for a symbol.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="btn-primary" href="/app/stocks/ABC">
            View ABC analytics
          </Link>
          <Link className="btn-primary bg-slate-200 text-slate-900" href="/docs">
            Read the docs
          </Link>
        </div>
      </section>
    </main>
  );
}
