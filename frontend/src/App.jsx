import { useEffect, useMemo, useRef, useState } from 'react';
import { useStocks } from './hooks/useStocks';
import StockChart from './components/StockChart';
import './App.css';
import logo from './assets/logo.svg';

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

  // data fetching moved to a hook to keep component focused on UI state
  const { stockData = [], status, error, refetch, isFetching, lastFetchTime } = useStocks(
    companyId,
    date
  );

  const loading = status === 'loading' || isFetching;

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
          {lastFetchTime ? `Last API call: ${new Date(lastFetchTime).toLocaleString()}` : 'No API calls yet'}
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

        <StockChart
          stockData={stockData}
          loading={loading}
          showPoints={showPoints}
          showSMA={showSMA}
          smaWindow={smaWindow}
          error={error}
        />

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
