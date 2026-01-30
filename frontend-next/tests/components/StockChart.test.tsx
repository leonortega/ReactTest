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
});
