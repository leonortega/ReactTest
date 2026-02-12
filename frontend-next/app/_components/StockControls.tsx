'use client';

import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { memo, useCallback, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import Button from './ui/Button';
import { Field, FieldInput } from './ui/Field';

export interface StockControlsProps {
  tempCompanyId: string;
  tempDate: string;
  onTempCompanyIdChange: (value: string) => void;
  onTempDateChange: (value: string) => void;
  onSubmit: () => void;
  enabled: boolean;
  loading: boolean;
}

function StockControls({
  tempCompanyId,
  tempDate,
  onTempCompanyIdChange,
  onTempDateChange,
  onSubmit,
  enabled,
  loading,
}: StockControlsProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);

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
      className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
      onSubmit={handleSubmit}
      aria-label="Stock query form"
    >
      <Field label="Company ID" htmlFor="company-input">
        <FieldInput
          id="company-input"
          aria-label="Company ID"
          value={tempCompanyId || ''}
          onChange={handleCompanyChange}
          className="h-10"
        />
      </Field>

      <Field label="Date" htmlFor="date-input">
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

      <div className="md:self-end">
        <Button type="submit" aria-label="Refresh data" disabled={!enabled || loading} size="md">
          {loading ? 'Loading...' : 'Refresh now'}
        </Button>
      </div>
    </form>
  );
}

export default memo(StockControls);
