'use client';

import { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  registerables,
  type ChartOptions,
  type ChartData,
  type ChartDataset,
  type TooltipItem,
} from 'chart.js';
import type { StockPoint, ApiError } from '../_lib/types';

Chart.register(...registerables);

function formatTimeLabel(iso: string) {
  const d = new Date(iso);
  return d.toISOString().slice(11, 16);
}

type StockChartProps = {
  stockData?: StockPoint[];
  loading?: boolean;
  showPoints?: boolean;
  showSMA?: boolean;
  showEMA?: boolean;
  showRSI?: boolean;
  smaWindow?: number;
  emaWindow?: number;
  rsiWindow?: number;
  error?: ApiError | null;
};

function computeSMA(values: number[], window: number) {
  if (!values || values.length === 0) return [];
  if (window <= 1) return values.slice();
  const result: number[] = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = values.slice(start, i + 1);
    const avg = slice.reduce((s, v) => s + v, 0) / slice.length;
    result.push(Math.round(avg * 100) / 100);
  }
  return result;
}

function computeEMA(values: number[], window: number) {
  if (!values || values.length === 0) return [];
  if (window <= 1) return values.slice();
  const multiplier = 2 / (window + 1);
  const result: number[] = [];
  for (let i = 0; i < values.length; i++) {
    if (i === 0) {
      result.push(values[i]);
      continue;
    }
    const prev = result[i - 1];
    const next = (values[i] - prev) * multiplier + prev;
    result.push(Math.round(next * 100) / 100);
  }
  return result;
}

function computeRSI(values: number[], window: number) {
  if (!values || values.length === 0) return [];
  if (window <= 1) return values.map(() => 50);
  const result: number[] = [];
  let avgGain = 0;
  let avgLoss = 0;

  for (let i = 1; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    const gain = Math.max(diff, 0);
    const loss = Math.abs(Math.min(diff, 0));

    if (i <= window) {
      avgGain += gain;
      avgLoss += loss;
      result.push(50);
    } else {
      avgGain = (avgGain * (window - 1) + gain) / window;
      avgLoss = (avgLoss * (window - 1) + loss) / window;
      const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
      const rsi = 100 - 100 / (1 + rs);
      result.push(Math.round(rsi * 100) / 100);
    }
  }

  return [50, ...result].slice(0, values.length);
}

export default function StockChart({
  stockData = [],
  loading = false,
  showPoints = false,
  showSMA = true,
  showEMA = false,
  showRSI = false,
  smaWindow = 5,
  emaWindow = 8,
  rsiWindow = 14,
  error = null,
}: StockChartProps) {
  const chartData = useMemo(() => {
    if (!stockData || stockData.length === 0) return null;
    const points = stockData
      .map((p) => ({ t: new Date(p.dateTime), price: Number(p.price) }))
      .sort((a, b) => a.t.getTime() - b.t.getTime());

    const labels = points.map((p) => formatTimeLabel(p.t.toISOString()));
    const prices = points.map((p) => Number(p.price));
    const sma = computeSMA(prices, smaWindow);
    const ema = computeEMA(prices, emaWindow);
    const rsi = computeRSI(prices, rsiWindow);

    return { labels, prices, sma, ema, rsi };
  }, [stockData, smaWindow, emaWindow, rsiWindow]);

  const options: ChartOptions<'line'> = useMemo(() => {
    const scales: ChartOptions<'line'>['scales'] = {
      x: { display: true, title: { display: true, text: 'Time (UTC)' } },
      y: { display: true, title: { display: true, text: 'Price' } },
    };

    if (showRSI) {
      scales.rsi = {
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        max: 100,
        grid: { drawOnChartArea: false },
        title: { display: true, text: 'RSI' },
      };
    }

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            title: (items: TooltipItem<'line'>[]) => {
              if (!items || !items[0]) return '';
              return String(items[0].label);
            },
          },
        },
      },
      interaction: { mode: 'nearest', axis: 'x', intersect: false },
      scales,
    };
  }, [showRSI]);

  const dataForChart: ChartData<'line', number[], string> = useMemo(() => {
    if (!chartData) return { labels: [], datasets: [] };

    const datasets: ChartDataset<'line', number[]>[] = [
      {
        label: 'Price',
        data: chartData.prices,
        borderColor: '#1f77b4',
        backgroundColor: 'rgba(31,119,180,0.08)',
        tension: 0.2,
        pointRadius: showPoints ? 3 : 0,
        borderWidth: 2,
      },
    ];

    if (showSMA) {
      datasets.push({
        label: `SMA (${smaWindow})`,
        data: chartData.sma,
        borderColor: '#ff7f0e',
        backgroundColor: 'rgba(255,127,14,0.05)',
        tension: 0.2,
        pointRadius: 0,
        borderDash: [6, 4],
        borderWidth: 2,
      });
    }

    if (showEMA) {
      datasets.push({
        label: `EMA (${emaWindow})`,
        data: chartData.ema,
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34,197,94,0.05)',
        tension: 0.2,
        pointRadius: 0,
        borderWidth: 2,
      });
    }

    if (showRSI) {
      datasets.push({
        label: `RSI (${rsiWindow})`,
        data: chartData.rsi,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139,92,246,0.05)',
        tension: 0.2,
        pointRadius: 0,
        borderWidth: 2,
        yAxisID: 'rsi',
      });
    }

    return { labels: chartData.labels, datasets };
  }, [chartData, showPoints, showSMA, smaWindow, showEMA, emaWindow, showRSI, rsiWindow]);

  return (
    <section
      className="rs-chart box-border h-[380px] w-full overflow-hidden bg-white p-3"
      aria-busy={loading}
      aria-label="Stock chart"
    >
      {error && (
        <div className="error-message" role="alert">
          <strong>Error:</strong> {String(error)}
        </div>
      )}

      {chartData && chartData.labels.length > 0 ? (
        <Line data={dataForChart} options={options} />
      ) : (
        !loading && <div className="last-fetch">No data</div>
      )}
    </section>
  );
}
