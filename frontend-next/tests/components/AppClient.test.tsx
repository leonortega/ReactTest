import { act, fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import AppClient from '../../app/_components/AppClient';
import { useStocks } from '../../app/_hooks/useStocks';
import {
  DEFAULT_STOCK_AUTO_REFRESH_SECONDS,
  STOCK_AUTO_REFRESH_MAX_SECONDS,
  STOCK_AUTO_REFRESH_MIN_SECONDS,
} from '../../app/_lib/stockPollingConfig';

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
    expect(screen.getByLabelText('Enable auto update')).toBeChecked();
    expect(screen.getByLabelText('Auto update interval seconds')).toHaveValue(
      DEFAULT_STOCK_AUTO_REFRESH_SECONDS,
    );
    expect(
      screen.getByText(`Auto update on (${DEFAULT_STOCK_AUTO_REFRESH_SECONDS}s)`),
    ).toBeInTheDocument();
    expect(screen.getByText('Next refresh after first successful call')).toBeInTheDocument();
    expect(screen.getByText('No API calls yet')).toBeInTheDocument();
    expect(mockUseStocks).toHaveBeenLastCalledWith(
      'ABC',
      '2024-01-01',
      expect.objectContaining({
        autoRefreshEnabled: true,
        autoRefreshSeconds: DEFAULT_STOCK_AUTO_REFRESH_SECONDS,
      }),
    );
  });

  it('reveals EMA and RSI windows when toggled', () => {
    render(<AppClient initialCompanyId="ABC" initialDate="2024-01-01" />);

    fireEvent.click(screen.getByLabelText('Show EMA'));
    fireEvent.click(screen.getByLabelText('Show RSI'));

    expect(screen.getByLabelText('EMA window')).toBeInTheDocument();
    expect(screen.getByLabelText('RSI window')).toBeInTheDocument();
  });

  it('disables auto refresh and clamps interval boundaries', () => {
    render(<AppClient initialCompanyId="ABC" initialDate="2024-01-01" />);

    fireEvent.click(screen.getByLabelText('Enable auto update'));

    expect(mockUseStocks).toHaveBeenLastCalledWith(
      'ABC',
      '2024-01-01',
      expect.objectContaining({
        autoRefreshEnabled: false,
      }),
    );

    const intervalInput = screen.getByLabelText('Auto update interval seconds');
    fireEvent.change(intervalInput, { target: { value: '2' } });

    expect(mockUseStocks).toHaveBeenLastCalledWith(
      'ABC',
      '2024-01-01',
      expect.objectContaining({
        autoRefreshSeconds: STOCK_AUTO_REFRESH_MIN_SECONDS,
      }),
    );

    fireEvent.change(intervalInput, { target: { value: '500' } });

    expect(mockUseStocks).toHaveBeenLastCalledWith(
      'ABC',
      '2024-01-01',
      expect.objectContaining({
        autoRefreshSeconds: STOCK_AUTO_REFRESH_MAX_SECONDS,
      }),
    );
  });

  it('applies updated filters automatically when auto update is enabled', () => {
    vi.useFakeTimers();
    try {
      render(<AppClient initialCompanyId="ABC" initialDate="2024-01-01" />);

      fireEvent.change(screen.getByLabelText('Company ID'), { target: { value: 'XYZ' } });

      expect(mockUseStocks).toHaveBeenLastCalledWith(
        'ABC',
        '2024-01-01',
        expect.objectContaining({
          autoRefreshEnabled: false,
        }),
      );

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(mockUseStocks).toHaveBeenLastCalledWith(
        'XYZ',
        '2024-01-01',
        expect.objectContaining({
          autoRefreshEnabled: true,
        }),
      );
    } finally {
      vi.useRealTimers();
    }
  });
});
