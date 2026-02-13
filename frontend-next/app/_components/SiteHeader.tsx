import Image from 'next/image';
import Link from 'next/link';
import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import { updateTheme } from '../_actions/preferences';
import type { Preferences } from '../_lib/types';
import logo from '../../public/logo.svg';

type SiteHeaderProps = {
  theme: Preferences['theme'];
};

export default function SiteHeader({ theme }: SiteHeaderProps) {
  const isDark = theme === 'dark';
  const nextTheme = isDark ? 'light' : 'dark';

  return (
    <header className="border-b border-border/80 bg-surface/90 backdrop-blur">
      <div className="mx-auto flex max-w-[1100px] items-center gap-3 px-6 py-5">
        <Link className="flex items-center gap-3 no-underline" href="/" aria-label="MarketPulse home">
          <Image src={logo} alt="MarketPulse" width={40} height={40} priority />
          <div>
            <div className="site-title">MarketPulse</div>
            <div className="site-subtitle">Real-time stock intelligence</div>
          </div>
        </Link>
        <form action={updateTheme} className="ml-auto">
          <input type="hidden" name="theme" value={nextTheme} />
          <button
            className="relative flex h-10 w-[92px] items-center rounded-full border border-border bg-surface px-2 text-text transition-colors duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
            type="submit"
            aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
            title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            <SunIcon
              aria-hidden="true"
              className={`absolute left-3 h-4 w-4 ${isDark ? 'text-text-muted/60' : 'text-warning'}`}
            />
            <MoonIcon
              aria-hidden="true"
              className={`absolute right-3 h-4 w-4 ${isDark ? 'text-brand' : 'text-text-muted/70'}`}
            />
            <span
              className={`absolute left-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white shadow-1 transition-transform duration-base ${
                isDark ? 'translate-x-[46px]' : 'translate-x-0'
              }`}
            >
              {isDark ? (
                <MoonIcon aria-hidden="true" className="h-4 w-4 text-white" />
              ) : (
                <SunIcon aria-hidden="true" className="h-4 w-4 text-white" />
              )}
            </span>
          </button>
        </form>
      </div>
    </header>
  );
}
