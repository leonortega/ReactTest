import { useEffect, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import './App.css';
import logo from './assets/logo.svg';

Chart.register(...registerables);

function formatTimeLabel(iso) {
  const d = new Date(iso);
  return d.toISOString().slice(11, 16); // HH:MM
}

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

async function fetchStocks({ queryKey, signal }) {
  const [_key, { companyId, date }] = queryKey;
  const url = `/api/stocks/${encodeURIComponent(companyId)}?date=${encodeURIComponent(date)}`;
  const res = await fetch(url, { signal });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Request failed: ${res.status} ${body}`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

function App() {
  // committed values used for fetching
  const [companyId, setCompanyId] = useState('ABC');
  const [date, setDate] = useState('2024-01-01');

  // local input states to debounce user typing
  const [tempCompanyId, setTempCompanyId] = useState(companyId);
  const [tempDate, setTempDate] = useState(date);

  const [showPoints, setShowPoints] = useState(false);
  const [showSMA, setShowSMA] = useState(true);
  const [smaWindow, setSmaWindow] = useState(5);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  // debounce timers
  const debounceRef = useRef(null);

  // update committed values after user stops typing for 600ms
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setCompanyId((prev) => {
        if (prev !== tempCompanyId) return tempCompanyId;
        return prev;
      });
      setDate((prev) => {
        if (prev !== tempDate) return tempDate;
        return prev;
      });
    }, 600);
    return () => clearTimeout(debounceRef.current);
  }, [tempCompanyId, tempDate]);

  // useQuery to fetch and background refetch every 5s
  const enabled = Boolean(companyId && date);
  const {
    data: stockData = [],
    status,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['stocks', { companyId, date }],
    queryFn: fetchStocks,
    enabled,
    refetchInterval: 5000, // background refetch every 5s
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    retry: 1,
    onSuccess: () => setLastFetchTime(new Date()),
  });

  const loading = status === 'loading' || isFetching;

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
    <div className="rs-container">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="rs-inner" id="main" role="main">
        <header className="rs-header">
          <img src={logo} alt="React Stocks logo" width={40} height={40} loading="lazy" />
          <div>
            <div className="site-title">React Stocks Demo</div>
            <div className="site-subtitle">Live stock visualization</div>
          </div>
        </header>

        <form
          className="rs-form"
          onSubmit={(e) => {
            e.preventDefault();
            refetch();
          }}
          aria-label="Stock query form"
        >
          <div>
            <label className="field-label" htmlFor="company-input">
              Company ID
            </label>
            <input
              id="company-input"
              aria-label="Company ID"
              value={tempCompanyId}
              onChange={(e) => setTempCompanyId(e.target.value)}
            />
          </div>

          <div>
            <label className="field-label" htmlFor="date-input">
              Date
            </label>
            <input
              id="date-input"
              aria-label="Date"
              type="date"
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
            />
          </div>

          <div>
            <button
              className="rs-btn"
              type="submit"
              aria-label="Refresh data"
              disabled={!enabled || loading}
            >
              {loading ? 'Loading...' : 'Refresh now'}
            </button>
          </div>
        </form>

        <div className="last-fetch" aria-live="polite" aria-atomic="true">
          {lastFetchTime
            ? `Last API call: ${new Date(lastFetchTime).toLocaleString()}`
            : 'No API calls yet'}
        </div>

        <div className="rs-controls">
          <label className="control-label">
            <input
              type="checkbox"
              checked={showPoints}
              onChange={(e) => setShowPoints(e.target.checked)}
            />{' '}
            Show points
          </label>
          <label className="control-label">
            <input
              type="checkbox"
              checked={showSMA}
              onChange={(e) => setShowSMA(e.target.checked)}
            />{' '}
            Show SMA
          </label>
          {showSMA && (
            <label className="sma-window control-label">
              Window
              <input
                aria-label="SMA window"
                type="number"
                min={1}
                value={smaWindow}
                onChange={(e) => setSmaWindow(Number(e.target.value) || 1)}
                className="small-input"
              />
            </label>
          )}
        </div>

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

        <section className="rs-table" aria-label="Stock data table">
          {stockData && stockData.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th scope="col">Time (UTC)</th>
                  <th scope="col">Price</th>
                </tr>
              </thead>
              <tbody>
                {stockData.map((s) => (
                  <tr key={s.dateTime}>
                    <td>{new Date(s.dateTime).toISOString()}</td>
                    <td>{Number(s.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <footer className="footer">
          This page calls the backend Stocks API at <code>/api/stocks/{'{companyId}'}</code>.
        </footer>
      </div>
    </div>
  );
}

export default App;
