import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

function formatTimeLabel(iso) {
  const d = new Date(iso);
  return d.toISOString().slice(11, 16); // HH:MM
}

StockChart.propTypes = {
  stockData: PropTypes.arrayOf(
    PropTypes.shape({
      dateTime: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  loading: PropTypes.bool,
  showPoints: PropTypes.bool,
  showSMA: PropTypes.bool,
  smaWindow: PropTypes.number,
  error: PropTypes.any,
};

StockChart.defaultProps = {
  stockData: [],
  loading: false,
  showPoints: false,
  showSMA: true,
  smaWindow: 5,
  error: null,
};

function computeSMA(values, window) {
  if (window <= 1) return values.slice();
  const result = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = values.slice(start, i + 1);
    const avg = slice.reduce((s, v) => s + v, 0) / slice.length;
    result.push(Number(avg.toFixed(2)));
  }
  return result;
}

export default function StockChart({ stockData = [], loading, showPoints, showSMA, smaWindow, error }) {
  const chartData = useMemo(() => {
    if (!stockData || stockData.length === 0) return null;
    const points = stockData
      .map((p) => ({ t: new Date(p.dateTime), price: Number(p.price) }))
      .sort((a, b) => a.t - b.t);

    const labels = points.map((p) => formatTimeLabel(p.t.toISOString()));
    const prices = points.map((p) => Number(p.price));
    const sma = computeSMA(prices, smaWindow);

    return { labels, prices, sma };
  }, [stockData, smaWindow]);

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            title: (items) => {
              if (!items || !items[0]) return '';
              return items[0].label;
            },
          },
        },
      },
      interaction: { mode: 'nearest', axis: 'x', intersect: false },
      scales: {
        x: { display: true, title: { display: true, text: 'Time (UTC)' } },
        y: { display: true, title: { display: true, text: 'Price' } },
      },
    }),
    []
  );

  const dataForChart = useMemo(() => {
    if (!chartData) return { labels: [], datasets: [] };

    const datasets = [
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

    return { labels: chartData.labels, datasets };
  }, [chartData, showPoints, showSMA, smaWindow]);

  return (
    <section className="rs-chart" aria-busy={loading} aria-label="Stock chart">
      {error && (
        <div className="error-message" role="alert">
          <strong>Error:</strong> {String(error)}
        </div>
      )}

      {chartData && chartData.labels.length > 0 ? (
        <Line data={dataForChart} options={options} />
      ) : (
        !loading && <div className="no-data">No data</div>
      )}
    </section>
  );
}
