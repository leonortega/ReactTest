import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

describe('AppClient', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'setInterval').mockImplementation(() => 0 as unknown as ReturnType<typeof setInterval>);
    vi.spyOn(globalThis, 'clearInterval').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders indicator toggles and view selector', async () => {
    const useStocksModule = await import('../../app/_hooks/useStocks');
    vi.spyOn(useStocksModule, 'useStocks').mockReturnValue({
      stockData: [],
      status: 'success',
      error: null,
      refetch: vi.fn(),
      isFetching: false,
      lastFetchTime: null,
    });

    const { default: AppClient } = await import('../../app/_components/AppClient');

    render(<AppClient initialCompanyId="ABC" initialDate="2024-01-01" />);

    expect(screen.getByText('Show SMA')).toBeInTheDocument();
    expect(screen.getByText('Show EMA')).toBeInTheDocument();
    expect(screen.getByText('Show RSI')).toBeInTheDocument();
    expect(screen.getByRole('form', { name: 'Stock query form' })).toBeInTheDocument();
    expect(screen.getByLabelText('Company ID')).toHaveValue('ABC');
    expect(screen.getByLabelText('Date')).toHaveValue('2024-01-01');
  });

  it('reveals EMA and RSI windows when toggled', async () => {
    const useStocksModule = await import('../../app/_hooks/useStocks');
    vi.spyOn(useStocksModule, 'useStocks').mockReturnValue({
      stockData: [],
      status: 'success',
      error: null,
      refetch: vi.fn(),
      isFetching: false,
      lastFetchTime: null,
    });

    const { default: AppClient } = await import('../../app/_components/AppClient');

    render(<AppClient initialCompanyId="ABC" initialDate="2024-01-01" />);

    fireEvent.click(screen.getByLabelText('Show EMA'));
    fireEvent.click(screen.getByLabelText('Show RSI'));

    expect(screen.getByLabelText('EMA window')).toBeInTheDocument();
    expect(screen.getByLabelText('RSI window')).toBeInTheDocument();
  });
});
