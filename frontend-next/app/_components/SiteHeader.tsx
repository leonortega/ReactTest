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
    <header className="mx-auto flex max-w-[1100px] items-center gap-3 px-6 py-6">
      <Link className="flex items-center gap-3" href="/" aria-label="MarketPulse home">
        <Image src={logo} alt="MarketPulse" width={40} height={40} priority />
        <div>
          <div className="site-title text-lg">MarketPulse</div>
          <div className="site-subtitle">Real-time stock intelligence</div>
        </div>
      </Link>
      <form action={updateTheme} className="ml-auto">
        <input type="hidden" name="theme" value={nextTheme} />
        <button
          className={`relative flex h-10 w-[88px] items-center rounded-full border px-2 ${
            isDark
              ? 'border-slate-900/80 bg-slate-900 text-white'
              : 'border-slate-200 bg-white text-slate-900'
          }`}
          type="submit"
          aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          <SunIcon
            aria-hidden="true"
            className={`absolute left-3 h-4 w-4 ${isDark ? 'text-white/35' : 'text-slate-700'}`}
          />
          <MoonIcon
            aria-hidden="true"
            className={`absolute right-3 h-4 w-4 ${isDark ? 'text-white' : 'text-slate-300'}`}
          />
          <span
            className={`absolute left-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 transition-transform duration-200 ${
              isDark ? 'translate-x-[44px]' : 'translate-x-0'
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
    </header>
  );
}
