import { useEffect, useRef, useState } from 'react';
import { useStocks } from './hooks/useStocks';
import StockChart from './components/StockChart';
import StockControls from './components/StockControls';
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
  const debounceRef = useRef<number | undefined>(undefined);

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

  const [localLastFetchTime, setLocalLastFetchTime] = useState<Date | null>(null);

  useEffect(() => {
    if (!isFetching && status === 'success') {
      setLocalLastFetchTime(new Date());
    }
  }, [isFetching, status, stockData]);

  const loading = status === 'loading' || isFetching;

  return (
    <div className="p-6 text-slate-900">
      <a className="sr-only focus:not-sr-only" href="#main">
        Skip to content
      </a>
      <div id="main" role="main" className="mx-auto max-w-[980px]">
        <header className="mb-2 flex items-center gap-3">
          <img src={logo} alt="React Stocks logo" width={40} height={40} loading="lazy" />
          <div>
            <div className="site-title">React Stocks Demo</div>
            <div className="site-subtitle">Live stock visualization</div>
          </div>
        </header>

        <StockControls
          tempCompanyId={tempCompanyId}
          tempDate={tempDate}
          onTempCompanyIdChange={setTempCompanyId}
          onTempDateChange={setTempDate}
          onSubmit={() => refetch()}
          enabled={Boolean(companyId && date)}
          loading={loading}
        />

        <div className="text-last-fetch" aria-live="polite" aria-atomic="true">
          {(localLastFetchTime || lastFetchTime)
            ? `Last API call: ${new Date(localLastFetchTime ?? lastFetchTime!).toLocaleString()}`
            : 'No API calls yet'}
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-2">
          <label className="inline-flex items-center gap-1 control-label">
            <input
              type="checkbox"
              checked={showPoints}
              onChange={(e) => setShowPoints(e.target.checked)}
              className="form-checkbox"
            />
            <span className="ml-1">Show points</span>
          </label>
          <label className="inline-flex items-center gap-1 control-label">
            <input
              type="checkbox"
              checked={showSMA}
              onChange={(e) => setShowSMA(e.target.checked)}
              className="form-checkbox"
            />
            <span className="ml-1">Show SMA</span>
          </label>
          {showSMA && (
            <label className="control-label inline-flex items-center gap-2 text-sm text-slate-900">
              <span>Window</span>
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

        <section className="mt-3 max-h-[200px] overflow-auto text-sm text-slate-900" aria-label="Stock data table">
          {stockData && stockData.length > 0 && (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left">Time (UTC)</th>
                  <th className="p-2 text-left">Price</th>
                </tr>
              </thead>
              <tbody>
                {stockData.map((s) => (
                  <tr key={s.dateTime} className="odd:bg-white even:bg-slate-50">
                    <td className="p-2 align-top">{new Date(s.dateTime).toISOString()}</td>
                    <td className="p-2 align-top">{Number(s.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>

        <footer className="mt-4 text-sm text-slate-500">
          This page calls the backend Stocks API at <code>/api/stocks/{'{companyId}'}</code>.
        </footer>
      </div>
    </div>
  );
}

export default App;
