import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | MarketPulse',
  description: 'Flexible plans for teams tracking real-time market insights.',
  openGraph: {
    title: 'Pricing | MarketPulse',
    description: 'Flexible plans for teams tracking real-time market insights.',
    type: 'website',
  },
};

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-[980px] px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Pricing</h1>
        <p className="text-slate-600">Pick a plan that fits your trading workflow.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[
          { name: 'Starter', price: '$0', detail: 'Market snapshots and basic alerts.' },
          { name: 'Team', price: '$29', detail: 'Shared watchlists and multi-user dashboards.' },
          {
            name: 'Enterprise',
            price: 'Custom',
            detail: 'Dedicated data feeds and compliance support.',
          },
        ].map((tier) => (
          <div
            key={tier.name}
            className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="text-xl font-semibold">{tier.name}</div>
            <div className="mt-2 text-3xl font-semibold text-slate-900">{tier.price}</div>
            <p className="mt-3 text-sm text-slate-600">{tier.detail}</p>
            <Link className="mt-4 inline-flex text-sm font-medium" href="/app">
              Get started
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
