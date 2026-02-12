'use client';

import { useEffect, useMemo, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  Legend,
  LineController,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartOptions,
  type ChartData,
  type ChartDataset,
  type TooltipItem,
} from 'chart.js';
import type { StockPoint, ApiError } from '../_lib/types';
import Card, { CardTitle } from './ui/Card';

Chart.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

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

type ChartPalette = {
  text: string;
  textMuted: string;
  axisText: string;
  legendText: string;
  grid: string;
  border: string;
  surface: string;
  brand: string;
  brandFill: string;
  sma: string;
  smaFill: string;
  ema: string;
  emaFill: string;
  rsi: string;
  rsiFill: string;
};

function asRgb(raw: string, alpha?: number) {
  const values = raw
    .split(/[,\s]+/)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value))
    .slice(0, 3);
  const [r = 0, g = 0, b = 0] = values;

  if (alpha === undefined) return `rgb(${r}, ${g}, ${b})`;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function readChartPalette(theme: 'light' | 'dark'): ChartPalette {
  const fallback = {
    textRaw: '15 23 42',
    textMutedRaw: '71 85 105',
    borderRaw: '226 232 240',
    surfaceRaw: '255 255 255',
    brandRaw: '14 116 144',
    smaRaw: '217 119 6',
    emaRaw: '22 163 74',
    rsiRaw: '56 189 248',
  };

  if (typeof document === 'undefined') {
    return {
      text: asRgb(fallback.textRaw),
      textMuted: asRgb(fallback.textMutedRaw),
      axisText: theme === 'dark' ? asRgb('111 121 138') : asRgb('97 103 112'),
      legendText: theme === 'dark' ? asRgb('111 121 138') : asRgb('97 103 112'),
      grid: theme === 'dark' ? asRgb('18 31 56', 0.55) : asRgb('148 154 164', 0.35),
      border: asRgb(fallback.borderRaw),
      surface: asRgb(fallback.surfaceRaw),
      brand: asRgb(fallback.brandRaw),
      brandFill: asRgb(fallback.brandRaw, 0.14),
      sma: asRgb(fallback.smaRaw),
      smaFill: asRgb(fallback.smaRaw, 0.12),
      ema: asRgb(fallback.emaRaw),
      emaFill: asRgb(fallback.emaRaw, 0.12),
      rsi: asRgb(fallback.rsiRaw),
      rsiFill: asRgb(fallback.rsiRaw, 0.12),
    };
  }

  const style = getComputedStyle(document.documentElement);
  const read = (name: string, defaultRaw: string) => style.getPropertyValue(name).trim() || defaultRaw;

  const textRaw = read('--text', fallback.textRaw);
  const textMutedRaw = read('--text-muted', fallback.textMutedRaw);
  const borderRaw = read('--border', fallback.borderRaw);
  const surfaceRaw = read('--surface', fallback.surfaceRaw);
  const brandRaw = read('--brand', fallback.brandRaw);
  const smaRaw = read('--warning', fallback.smaRaw);
  const emaRaw = read('--success', fallback.emaRaw);
  const rsiRaw = read('--brand-strong', fallback.rsiRaw);
  const isDark = theme === 'dark';
  const axisText = isDark ? asRgb('111 121 138') : asRgb('97 103 112');
  const grid = isDark ? asRgb('18 31 56', 0.55) : asRgb('148 154 164', 0.35);

  return {
    text: asRgb(textRaw),
    textMuted: asRgb(textMutedRaw),
    axisText,
    legendText: axisText,
    grid,
    border: asRgb(borderRaw),
    surface: asRgb(surfaceRaw),
    brand: asRgb(brandRaw),
    brandFill: asRgb(brandRaw, 0.14),
    sma: asRgb(smaRaw),
    smaFill: asRgb(smaRaw, 0.12),
    ema: asRgb(emaRaw),
    emaFill: asRgb(emaRaw, 0.12),
    rsi: asRgb(rsiRaw),
    rsiFill: asRgb(rsiRaw, 0.12),
  };
}

function computeSMA(values: number[], window: number) {
  if (!values || values.length === 0) return [];
  if (window <= 1) return values.slice();
  const result: number[] = new Array(values.length);
  let rollingSum = 0;

  for (let i = 0; i < values.length; i++) {
    rollingSum += values[i];
    if (i >= window) rollingSum -= values[i - window];
    const divisor = i < window ? i + 1 : window;
    const avg = rollingSum / divisor;
    result[i] = Math.round(avg * 100) / 100;
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
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof document === 'undefined') return 'light';
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;
    const syncTheme = () => {
      setTheme(html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');
    };

    syncTheme();
    const observer = new MutationObserver(syncTheme);
    observer.observe(html, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  const palette = useMemo(() => readChartPalette(theme), [theme]);

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
      x: {
        display: true,
        title: { display: true, text: 'Time (UTC)', color: palette.axisText },
        ticks: { color: palette.axisText },
        grid: { color: palette.grid },
        border: { color: palette.grid },
      },
      y: {
        display: true,
        title: { display: true, text: 'Price', color: palette.axisText },
        ticks: { color: palette.axisText },
        grid: { color: palette.grid },
        border: { color: palette.grid },
      },
    };

    if (showRSI) {
      scales.rsi = {
        type: 'linear',
        display: true,
        position: 'right',
        min: 0,
        max: 100,
        ticks: { color: palette.axisText },
        grid: { drawOnChartArea: false, color: palette.grid },
        border: { color: palette.grid },
        title: { display: true, text: 'RSI', color: palette.axisText },
      };
    }

    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: palette.legendText,
          },
        },
        tooltip: {
          backgroundColor: palette.surface,
          titleColor: palette.text,
          bodyColor: palette.text,
          borderColor: palette.border,
          borderWidth: 1,
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
  }, [palette, showRSI]);

  const dataForChart: ChartData<'line', number[], string> = useMemo(() => {
    if (!chartData) return { labels: [], datasets: [] };

    const datasets: ChartDataset<'line', number[]>[] = [
      {
        label: 'Price',
        data: chartData.prices,
        borderColor: palette.brand,
        backgroundColor: palette.brandFill,
        tension: 0.2,
        pointRadius: showPoints ? 3 : 0,
        borderWidth: 2,
      },
    ];

    if (showSMA) {
      datasets.push({
        label: `SMA (${smaWindow})`,
        data: chartData.sma,
        borderColor: palette.sma,
        backgroundColor: palette.smaFill,
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
        borderColor: palette.ema,
        backgroundColor: palette.emaFill,
        tension: 0.2,
        pointRadius: 0,
        borderWidth: 2,
      });
    }

    if (showRSI) {
      datasets.push({
        label: `RSI (${rsiWindow})`,
        data: chartData.rsi,
        borderColor: palette.rsi,
        backgroundColor: palette.rsiFill,
        tension: 0.2,
        pointRadius: 0,
        borderWidth: 2,
        yAxisID: 'rsi',
      });
    }

    return { labels: chartData.labels, datasets };
  }, [chartData, palette, showPoints, showSMA, smaWindow, showEMA, emaWindow, showRSI, rsiWindow]);

  return (
    <Card
      as="section"
      variant="panel"
      className="box-border h-[420px] w-full overflow-hidden"
      aria-busy={loading}
      aria-label="Stock chart"
    >
      <header className="mb-3 flex items-start justify-between gap-3">
        <div>
          <CardTitle className="text-base">Price chart</CardTitle>
          <p className="text-sm text-text-muted">
            {loading
              ? 'Refreshing data...'
              : chartData
                ? `${chartData.labels.length} points loaded`
                : 'Awaiting data'}
          </p>
        </div>
      </header>

      {error && (
        <div className="error-message" role="alert">
          <strong>Error:</strong> {String(error)}
        </div>
      )}

      <div className="h-[320px]">
        {chartData && chartData.labels.length > 0 ? (
          <Line key={theme} data={dataForChart} options={options} />
        ) : loading ? (
          <div className="h-full animate-pulse rounded-md bg-surface-2" />
        ) : (
          <div className="last-fetch">No data</div>
        )}
      </div>
    </Card>
  );
}
