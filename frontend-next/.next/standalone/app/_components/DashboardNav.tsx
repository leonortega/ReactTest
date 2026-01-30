import Link from 'next/link';

const links = [
  { href: '/app', label: 'Overview' },
  { href: '/app/stocks/ABC', label: 'Stock analytics' },
  { href: '/app/watchlists', label: 'Watchlists' },
  { href: '/app/alerts', label: 'Alerts' },
  { href: '/app/alerts/history', label: 'Alert history' },
  { href: '/app/preferences', label: 'Preferences' },
];

export default function DashboardNav() {
  return (
    <nav className="flex flex-wrap gap-3 text-sm text-slate-600">
      {links.map((link) => (
        <Link key={link.href} className="rounded bg-white px-3 py-2 shadow-sm" href={link.href}>
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
