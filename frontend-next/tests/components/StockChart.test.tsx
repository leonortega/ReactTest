import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import StockChart from '../../app/_components/StockChart';

vi.mock('react-chartjs-2', () => ({
  Line: ({ data }: { data: unknown }) => <div data-testid="chart">{JSON.stringify(data)}</div>,
}));

describe('StockChart', () => {
  it('shows empty state when no data', () => {
    render(<StockChart stockData={[]} loading={false} />);

    expect(screen.getByText(/no data/i)).toBeInTheDocument();
  });

  it('renders chart when data exists', () => {
    const stockData = [
      { dateTime: '2024-01-01T10:00:00Z', price: 100 },
      { dateTime: '2024-01-01T11:00:00Z', price: 101 },
    ];

    render(<StockChart stockData={stockData} loading={false} />);

    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });

  it('shows error message when error exists', () => {
    render(<StockChart stockData={[]} loading={false} error="boom" />);

    expect(screen.getByRole('alert')).toHaveTextContent(/boom/i);
  });

  it('computes RSI using Wilder smoothing', () => {
    const prices = [
      100, 101, 102, 101, 103, 104, 103, 105, 106, 104,
      103, 102, 101, 102, 103, 104, 105, 106, 107, 108,
    ];
    const stockData = prices.map((price, index) => ({
      dateTime: new Date(Date.UTC(2024, 0, 1, 10, index)).toISOString(),
      price,
    }));

    render(<StockChart stockData={stockData} loading={false} showRSI />);

    const chartPayload = screen.getByTestId('chart').textContent ?? '{}';
    const parsed = JSON.parse(chartPayload) as {
      datasets?: Array<{ label?: string; data?: number[] }>;
    };
    const rsiDataset = parsed.datasets?.find((dataset) => dataset.label?.startsWith('RSI'));

    expect(rsiDataset).toBeDefined();
    expect(rsiDataset?.data?.[15]).toBeCloseTo(61.28, 2);
  });
});
