import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { vi } from 'vitest';
import DashboardNav from '../../app/_components/DashboardNav';

const mockUsePathname = vi.fn<() => string | null>();

vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('DashboardNav', () => {
  it('marks only alert history as active on history route', () => {
    mockUsePathname.mockReturnValue('/dashboard/alerts/history');

    render(<DashboardNav />);

    expect(screen.getByRole('link', { name: 'Alert history' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Alerts' })).not.toHaveAttribute('aria-current');
  });
});
