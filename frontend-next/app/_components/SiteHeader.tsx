import Image from 'next/image';
import Link from 'next/link';
import logo from '../../public/logo.svg';

export default function SiteHeader() {
  return (
    <header className="mx-auto flex max-w-[1100px] items-center gap-3 px-6 py-6">
      <Link className="flex items-center gap-3" href="/" aria-label="MarketPulse home">
        <Image src={logo} alt="MarketPulse" width={40} height={40} priority />
        <div>
          <div className="site-title text-lg">MarketPulse</div>
          <div className="site-subtitle">Real-time stock intelligence</div>
        </div>
      </Link>
    </header>
  );
}
