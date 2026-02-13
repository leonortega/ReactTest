'use client';

import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { memo, useCallback, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  STOCK_AUTO_REFRESH_MAX_SECONDS,
  STOCK_AUTO_REFRESH_MIN_SECONDS,
} from '../_lib/stockPollingConfig';
import Button from './ui/Button';
import { Field, FieldInput } from './ui/Field';

export interface StockControlsProps {
  tempCompanyId: string;
  tempDate: string;
  autoRefreshEnabled: boolean;
  autoRefreshSeconds: number;
  onTempCompanyIdChange: (value: string) => void;
  onTempDateChange: (value: string) => void;
  onAutoRefreshEnabledChange: (checked: boolean) => void;
  onAutoRefreshSecondsChange: (value: string) => void;
  onSubmit: () => void;
  enabled: boolean;
  loading: boolean;
}

function StockControls({
  tempCompanyId,
  tempDate,
  autoRefreshEnabled,
  autoRefreshSeconds,
  onTempCompanyIdChange,
  onTempDateChange,
  onAutoRefreshEnabledChange,
  onAutoRefreshSecondsChange,
  onSubmit,
  enabled,
  loading,
}: StockControlsProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const canDecreaseAutoRefresh = autoRefreshEnabled && autoRefreshSeconds > STOCK_AUTO_REFRESH_MIN_SECONDS;
  const canIncreaseAutoRefresh = autoRefreshEnabled && autoRefreshSeconds < STOCK_AUTO_REFRESH_MAX_SECONDS;

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      onSubmit();
    },
    [onSubmit],
  );

  const handleCompanyChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onTempCompanyIdChange(event.target.value);
    },
    [onTempCompanyIdChange],
  );

  const handleDateChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onTempDateChange(event.target.value);
    },
    [onTempDateChange],
  );

  const handleAutoRefreshEnabledChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onAutoRefreshEnabledChange(event.target.checked);
    },
    [onAutoRefreshEnabledChange],
  );

  const handleAutoRefreshSecondsChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onAutoRefreshSecondsChange(event.target.value);
    },
    [onAutoRefreshSecondsChange],
  );

  const handleDecreaseAutoRefresh = useCallback(() => {
    onAutoRefreshSecondsChange(String(autoRefreshSeconds - 5));
  }, [autoRefreshSeconds, onAutoRefreshSecondsChange]);

  const handleIncreaseAutoRefresh = useCallback(() => {
    onAutoRefreshSecondsChange(String(autoRefreshSeconds + 5));
  }, [autoRefreshSeconds, onAutoRefreshSecondsChange]);

  const handleOpenDatePicker = useCallback(() => {
    const input = dateInputRef.current;
    if (!input) return;

    input.focus();
    try {
      input.showPicker();
      return;
    } catch {
      input.click();
    }
  }, []);

  return (
    <form
      className="grid gap-4 md:grid-cols-12 md:items-end"
      onSubmit={handleSubmit}
      aria-label="Stock query form"
    >
      <Field label="Company ID" htmlFor="company-input" className="md:col-span-5">
        <FieldInput
          id="company-input"
          aria-label="Company ID"
          value={tempCompanyId || ''}
          onChange={handleCompanyChange}
          className="h-10"
        />
      </Field>

      <Field label="Date" htmlFor="date-input" className="md:col-span-5">
        <div className="relative">
          <FieldInput
            id="date-input"
            ref={dateInputRef}
            aria-label="Date"
            type="date"
            value={tempDate || ''}
            onChange={handleDateChange}
            className="date-native-hidden h-10 pr-10"
          />
          <button
            type="button"
            aria-label="Open calendar"
            onClick={handleOpenDatePicker}
            className="absolute right-2 top-1/2 inline-flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-text-muted transition-colors duration-fast hover:text-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            <CalendarDaysIcon className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </Field>

      <div className="md:col-span-2">
        <Button
          type="submit"
          aria-label="Refresh data"
          variant={autoRefreshEnabled ? 'ghost' : 'primary'}
          disabled={!enabled || loading}
          size="md"
          fullWidth
        >
          {loading ? 'Loading...' : 'Refresh now'}
        </Button>
      </div>

      <Field label="Auto update" htmlFor="auto-refresh-seconds-input" className="md:col-span-12">
        <div className="grid gap-2 rounded-md border border-border/40 bg-surface-2/30 px-3 py-2.5">
          <div className="flex flex-wrap items-center gap-4">
            <label className="control-label inline-flex min-h-[44px] items-center gap-2 rounded-md px-1">
              <input
                type="checkbox"
                aria-label="Enable auto update"
                checked={autoRefreshEnabled}
                onChange={handleAutoRefreshEnabledChange}
                className="form-checkbox"
              />
              <span>Enable auto update</span>
            </label>

            <label
              className={`control-label inline-flex min-h-[44px] items-center gap-2 rounded-md px-1 ${
                autoRefreshEnabled ? 'text-text' : 'text-text-muted'
              }`}
              htmlFor="auto-refresh-seconds-input"
            >
              <span>Every</span>
              <div className="inline-flex items-center rounded-md border border-border bg-surface px-1">
                <button
                  type="button"
                  aria-label="Decrease auto update interval"
                  className="h-8 rounded px-2 text-xs font-medium text-text-muted transition-colors duration-fast hover:bg-surface-2 hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleDecreaseAutoRefresh}
                  disabled={!canDecreaseAutoRefresh}
                >
                  -5
                </button>
                <FieldInput
                  id="auto-refresh-seconds-input"
                  aria-label="Auto update interval seconds"
                  type="number"
                  min={STOCK_AUTO_REFRESH_MIN_SECONDS}
                  max={STOCK_AUTO_REFRESH_MAX_SECONDS}
                  step={5}
                  value={autoRefreshSeconds}
                  onChange={handleAutoRefreshSecondsChange}
                  disabled={!autoRefreshEnabled}
                  className="h-9 w-16 border-transparent bg-transparent px-0 text-center [appearance:textfield] focus-visible:ring-0"
                />
                <button
                  type="button"
                  aria-label="Increase auto update interval"
                  className="h-8 rounded px-2 text-xs font-medium text-text-muted transition-colors duration-fast hover:bg-surface-2 hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleIncreaseAutoRefresh}
                  disabled={!canIncreaseAutoRefresh}
                >
                  +5
                </button>
              </div>
              <span>seconds</span>
            </label>
          </div>

          <p className="pl-1 text-xs text-text-muted/90">
            {STOCK_AUTO_REFRESH_MIN_SECONDS}-{STOCK_AUTO_REFRESH_MAX_SECONDS} sec, step 5.
          </p>
        </div>
      </Field>
    </form>
  );
}

export default memo(StockControls);
