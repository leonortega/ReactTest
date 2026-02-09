import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Docs | MarketPulse',
  description: 'Documentation for getting started and integrating MarketPulse.',
  openGraph: {
    title: 'Docs | MarketPulse',
    description: 'Documentation for getting started and integrating MarketPulse.',
    type: 'website',
  },
};

export default function DocsPage() {
  return (
    <main className="mx-auto max-w-[980px] px-6 py-12">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold">Docs</h1>
        <p className="text-slate-600">
          Everything you need to wire MarketPulse into your workflow.
        </p>
      </div>

      <div className="grid gap-4">
        {[
          { title: 'Quickstart', desc: 'Launch the dashboard and connect to your data feed.' },
          { title: 'Alerts', desc: 'Create price thresholds and scheduled checks.' },
          { title: 'Watchlists', desc: 'Share symbols and notes across the team.' },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold">{item.title}</h2>
            <p className="text-sm text-slate-600">{item.desc}</p>
          </div>
        ))}
      </div>

      <Link className="mt-6 inline-flex text-sm font-medium" href="/blog">
        Read the blog
      </Link>
    </main>
  );
}
