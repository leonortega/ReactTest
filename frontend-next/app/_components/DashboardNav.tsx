'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Card from './ui/Card';
import { getButtonClassName } from './ui/Button';

type DashboardLink = {
  href: string;
  label: string;
  matchPath?: string;
  exact?: boolean;
};

const links: DashboardLink[] = [
  { href: '/dashboard', label: 'Overview', exact: true },
  { href: '/dashboard/stocks/ABC', label: 'Stock analytics', matchPath: '/dashboard/stocks' },
  { href: '/dashboard/watchlists', label: 'Watchlists' },
  { href: '/dashboard/alerts', label: 'Alerts' },
  { href: '/dashboard/alerts/history', label: 'Alert history' },
  { href: '/dashboard/preferences', label: 'Preferences' },
];

export default function DashboardNav() {
  const pathname = usePathname() ?? '';
  const currentPath = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

  const isMatch = (link: DashboardLink) => {
    const matchPath = link.matchPath ?? link.href;
    if (link.exact) return currentPath === matchPath;
    return currentPath === matchPath || currentPath.startsWith(`${matchPath}/`);
  };

  const activeHref = links
    .filter((link) => isMatch(link))
    .sort((a, b) => (b.matchPath ?? b.href).length - (a.matchPath ?? a.href).length)[0]?.href;

  return (
    <Card as="nav" variant="panel" className="flex flex-wrap gap-2 p-3" aria-label="Dashboard sections">
      {links.map((link) => (
        <Link
          key={link.href}
          className={getButtonClassName({
            variant: activeHref === link.href ? 'primary' : 'ghost',
            size: 'sm',
            className: 'no-underline',
          })}
          href={link.href}
          aria-current={activeHref === link.href ? 'page' : undefined}
        >
          {link.label}
        </Link>
      ))}
    </Card>
  );
}
