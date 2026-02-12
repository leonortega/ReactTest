'use client';

import { useCallback, useState, type ChangeEvent } from 'react';
import { useStocks } from '../_hooks/useStocks';
import StockChart from './StockChart';
import StockControls from './StockControls';
import ToggleOption from './ToggleOption';
import Card, { CardTitle } from './ui/Card';

type AppClientProps = {
  initialCompanyId?: string;
  initialDate?: string;
};

export default function AppClient({
  initialCompanyId = 'ABC',
  initialDate = '2024-01-01',
}: AppClientProps) {
  const [tempCompanyId, setTempCompanyId] = useState(initialCompanyId);
  const [tempDate, setTempDate] = useState(initialDate);
  const [queryCompanyId, setQueryCompanyId] = useState(initialCompanyId);
  const [queryDate, setQueryDate] = useState(initialDate);

  const [showPoints, setShowPoints] = useState(false);
  const [showSMA, setShowSMA] = useState(true);
  const [showEMA, setShowEMA] = useState(false);
  const [showRSI, setShowRSI] = useState(false);
  const [smaWindow, setSmaWindow] = useState(5);
  const [emaWindow, setEmaWindow] = useState(8);
  const [rsiWindow, setRsiWindow] = useState(14);

  const {
    stockData = [],
    status,
    error,
    refetch,
    isFetching,
    lastFetchTime,
  } = useStocks(queryCompanyId, queryDate);

  const loading = status === 'loading' || isFetching;

  const handleTempCompanyIdChange = useCallback((value: string) => {
    setTempCompanyId(value);
  }, []);

  const handleTempDateChange = useCallback((value: string) => {
    setTempDate(value);
  }, []);

  const handleSubmit = useCallback(() => {
    const nextCompanyId = tempCompanyId.trim().toUpperCase();
    const nextDate = tempDate;

    if (!nextCompanyId || !nextDate) return;

    if (nextCompanyId !== queryCompanyId || nextDate !== queryDate) {
      setQueryCompanyId(nextCompanyId);
      setQueryDate(nextDate);
      return;
    }

    refetch();
  }, [queryCompanyId, queryDate, refetch, tempCompanyId, tempDate]);

  const handleShowPointsChange = useCallback((checked: boolean) => {
    setShowPoints(checked);
  }, []);

  const handleShowSmaChange = useCallback((checked: boolean) => {
    setShowSMA(checked);
  }, []);

  const handleShowEmaChange = useCallback((checked: boolean) => {
    setShowEMA(checked);
  }, []);

  const handleShowRsiChange = useCallback((checked: boolean) => {
    setShowRSI(checked);
  }, []);

  const handleSmaWindowChange = useCallback((value: string) => {
    setSmaWindow(Number(value) || 1);
  }, []);

  const handleEmaWindowChange = useCallback((value: string) => {
    setEmaWindow(Number(value) || 1);
  }, []);

  const handleRsiWindowChange = useCallback((value: string) => {
    setRsiWindow(Number(value) || 1);
  }, []);

  return (
    <div className="px-6 py-8 text-text">
      <a className="sr-only focus:not-sr-only" href="#main">
        Skip to content
      </a>
      <main id="main" role="main" className="mx-auto grid max-w-[980px] gap-4">
        <header className="grid gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-text">MarketPulse Analytics</h1>
          <p className="site-subtitle">Live stock visualization</p>
        </header>

        <Card variant="form" className="grid gap-3">
          <StockControls
            tempCompanyId={tempCompanyId}
            tempDate={tempDate}
            onTempCompanyIdChange={handleTempCompanyIdChange}
            onTempDateChange={handleTempDateChange}
            onSubmit={handleSubmit}
            enabled={Boolean(tempCompanyId && tempDate)}
            loading={loading}
          />

          <div className="last-fetch mb-0">
            {lastFetchTime
              ? `Last API call: ${new Date(lastFetchTime).toLocaleString()}`
              : 'No API calls yet'}
          </div>
        </Card>

        <Card variant="panel" className="grid gap-3">
          <CardTitle className="text-base">Indicators</CardTitle>
          <div className="mb-1 flex flex-wrap items-center gap-3">
            <ToggleOption
              label="Show points"
              checked={showPoints}
              onChange={handleShowPointsChange}
            />
            <ToggleOption label="Show SMA" checked={showSMA} onChange={handleShowSmaChange} />
            <ToggleOption label="Show EMA" checked={showEMA} onChange={handleShowEmaChange} />
            <ToggleOption label="Show RSI" checked={showRSI} onChange={handleShowRsiChange} />
            {showSMA && (
              <label className="control-label inline-flex items-center gap-2">
                <span>Window</span>
                <input
                  aria-label="SMA window"
                  type="number"
                  min={1}
                  value={smaWindow}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleSmaWindowChange(e.target.value)
                  }
                  className="small-input"
                />
              </label>
            )}
            {showEMA && (
              <label className="control-label inline-flex items-center gap-2">
                <span>EMA</span>
                <input
                  aria-label="EMA window"
                  type="number"
                  min={1}
                  value={emaWindow}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleEmaWindowChange(e.target.value)
                  }
                  className="small-input"
                />
              </label>
            )}
            {showRSI && (
              <label className="control-label inline-flex items-center gap-2">
                <span>RSI</span>
                <input
                  aria-label="RSI window"
                  type="number"
                  min={1}
                  value={rsiWindow}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleRsiWindowChange(e.target.value)
                  }
                  className="small-input"
                />
              </label>
            )}
          </div>
        </Card>

        <StockChart
          stockData={stockData}
          loading={loading}
          showPoints={showPoints}
          showSMA={showSMA}
          showEMA={showEMA}
          showRSI={showRSI}
          smaWindow={smaWindow}
          emaWindow={emaWindow}
          rsiWindow={rsiWindow}
          error={error}
        />

        <Card variant="panel" className="overflow-hidden p-0">
          <section className="max-h-[240px] overflow-auto text-sm text-text" aria-label="Stock data table">
            {stockData && stockData.length > 0 ? (
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="sticky top-0 bg-surface-2 p-2 text-left text-xs uppercase tracking-wide text-text-muted">
                      Time (UTC)
                    </th>
                    <th className="sticky top-0 bg-surface-2 p-2 text-right text-xs uppercase tracking-wide text-text-muted">
                      Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stockData.map((s) => {
                    const iso = new Date(s.dateTime).toISOString();
                    return (
                      <tr key={s.dateTime} className="border-b border-border/60 odd:bg-surface even:bg-surface-2">
                        <td className="p-2 align-top text-data">{iso}</td>
                        <td className="p-2 text-right align-top text-data">
                          {Math.round(Number(s.price) * 100) / 100}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              !loading && <div className="p-4 text-sm text-text-muted">No data in table</div>
            )}
          </section>
        </Card>

        <footer className="text-sm text-text-muted">
          This page calls the backend Stocks API at <code>/api/stocks</code>.
        </footer>
      </main>
    </div>
  );
}
