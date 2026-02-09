'use client';

import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import useDebouncedValue from '../_hooks/useDebouncedValue';
import { useStocks } from '../_hooks/useStocks';
import type { StockData } from '../_lib/types';
import StockChart from './StockChart';
import StockControls from './StockControls';
import ToggleOption from './ToggleOption';

type AppClientProps = {
  initialCompanyId?: string;
  initialDate?: string;
  initialStockData?: StockData[];
  initialLastFetchTime?: number | null;
};

export default function AppClient({
  initialCompanyId = 'ABC',
  initialDate = '2024-01-01',
  initialStockData,
  initialLastFetchTime,
}: AppClientProps) {
  const [companyId, setCompanyId] = useState(initialCompanyId);
  const [date, setDate] = useState(initialDate);

  const [tempCompanyId, setTempCompanyId] = useState(companyId);
  const [tempDate, setTempDate] = useState(date);

  const [showPoints, setShowPoints] = useState(false);
  const [showSMA, setShowSMA] = useState(true);
  const [showEMA, setShowEMA] = useState(false);
  const [showRSI, setShowRSI] = useState(false);
  const [smaWindow, setSmaWindow] = useState(5);
  const [emaWindow, setEmaWindow] = useState(8);
  const [rsiWindow, setRsiWindow] = useState(14);

  const debouncedCompanyId = useDebouncedValue(tempCompanyId, 600);
  const debouncedDate = useDebouncedValue(tempDate, 600);

  useEffect(() => {
    setCompanyId((prev: string) => (prev !== debouncedCompanyId ? debouncedCompanyId : prev));
    setDate((prev: string) => (prev !== debouncedDate ? debouncedDate : prev));
  }, [debouncedCompanyId, debouncedDate]);

  const {
    stockData = [],
    status,
    error,
    refetch,
    isFetching,
    lastFetchTime,
  } = useStocks(companyId, date, {
    initialData: initialStockData,
    initialLastFetchTime,
  });

  const [localLastFetchTime, setLocalLastFetchTime] = useState<Date | null>(null);

  useEffect(() => {
    if (!isFetching && status === 'success') {
      setLocalLastFetchTime(new Date());
    }
  }, [isFetching, status, stockData]);

  const loading = status === 'loading' || isFetching;

  const handleTempCompanyIdChange = useCallback((value: string) => {
    setTempCompanyId(value);
  }, []);

  const handleTempDateChange = useCallback((value: string) => {
    setTempDate(value);
  }, []);

  const handleSubmit = useCallback(() => {
    refetch();
  }, [refetch]);

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
    <div className="p-6 text-slate-900">
      <a className="sr-only focus:not-sr-only" href="#main">
        Skip to content
      </a>
      <div id="main" role="main" className="mx-auto max-w-[980px]">
        <header className="mb-2">
          <div className="site-title">MarketPulse Analytics</div>
          <div className="site-subtitle">Live stock visualization</div>
        </header>

        <StockControls
          tempCompanyId={tempCompanyId}
          tempDate={tempDate}
          onTempCompanyIdChange={handleTempCompanyIdChange}
          onTempDateChange={handleTempDateChange}
          onSubmit={handleSubmit}
          enabled={Boolean(companyId && date)}
          loading={loading}
        />

        <div className="last-fetch">
          {localLastFetchTime || lastFetchTime
            ? `Last API call: ${new Date(localLastFetchTime ?? lastFetchTime!).toLocaleString()}`
            : 'No API calls yet'}
        </div>

        <div className="mb-2 flex flex-wrap items-center gap-3">
          <ToggleOption
            label="Show points"
            checked={showPoints}
            onChange={handleShowPointsChange}
          />
          <ToggleOption label="Show SMA" checked={showSMA} onChange={handleShowSmaChange} />
          <ToggleOption label="Show EMA" checked={showEMA} onChange={handleShowEmaChange} />
          <ToggleOption label="Show RSI" checked={showRSI} onChange={handleShowRsiChange} />
          {showSMA && (
            <label className="control-label inline-flex items-center gap-2 text-sm text-slate-900">
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
            <label className="control-label inline-flex items-center gap-2 text-sm text-slate-900">
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
            <label className="control-label inline-flex items-center gap-2 text-sm text-slate-900">
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

        <section
          className="mt-3 max-h-[200px] overflow-auto text-sm text-slate-900"
          aria-label="Stock data table"
        >
          {stockData && stockData.length > 0 && (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 text-left">Time (UTC)</th>
                  <th className="p-2 text-left">Price</th>
                </tr>
              </thead>
              <tbody>
                {stockData.map((s) => {
                  const iso = new Date(s.dateTime).toISOString();
                  return (
                    <tr key={s.dateTime} className="odd:bg-white even:bg-slate-50">
                      <td className="p-2 align-top">{iso}</td>
                      <td className="p-2 align-top">{Math.round(Number(s.price) * 100) / 100}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>

        <footer className="mt-4 text-sm text-slate-500">
          This page calls the backend Stocks API at <code>/api/stocks</code>.
        </footer>
      </div>
    </div>
  );
}
