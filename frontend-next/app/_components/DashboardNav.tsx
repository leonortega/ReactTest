import Link from 'next/link';

const links = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/stocks/ABC', label: 'Stock analytics' },
  { href: '/dashboard/watchlists', label: 'Watchlists' },
  { href: '/dashboard/alerts', label: 'Alerts' },
  { href: '/dashboard/alerts/history', label: 'Alert history' },
  { href: '/dashboard/preferences', label: 'Preferences' },
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
