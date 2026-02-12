import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import AppClient from '../../app/_components/AppClient';
import { useStocks } from '../../app/_hooks/useStocks';

vi.mock('../../app/_hooks/useStocks', () => ({
  useStocks: vi.fn(),
}));

const mockUseStocks = vi.mocked(useStocks);

describe('AppClient', () => {
  beforeEach(() => {
    mockUseStocks.mockReturnValue({
      stockData: [],
      status: 'success',
      error: null,
      refetch: vi.fn(),
      isFetching: false,
      lastFetchTime: null,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders indicator toggles and view selector', () => {
    render(<AppClient initialCompanyId="ABC" initialDate="2024-01-01" />);

    expect(screen.getByText('Show SMA')).toBeInTheDocument();
    expect(screen.getByText('Show EMA')).toBeInTheDocument();
    expect(screen.getByText('Show RSI')).toBeInTheDocument();
    expect(screen.getByRole('form', { name: 'Stock query form' })).toBeInTheDocument();
    expect(screen.getByLabelText('Company ID')).toHaveValue('ABC');
    expect(screen.getByLabelText('Date')).toHaveValue('2024-01-01');
  });

  it('reveals EMA and RSI windows when toggled', () => {
    render(<AppClient initialCompanyId="ABC" initialDate="2024-01-01" />);

    fireEvent.click(screen.getByLabelText('Show EMA'));
    fireEvent.click(screen.getByLabelText('Show RSI'));

    expect(screen.getByLabelText('EMA window')).toBeInTheDocument();
    expect(screen.getByLabelText('RSI window')).toBeInTheDocument();
  });
});
