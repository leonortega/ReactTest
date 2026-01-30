'use client';

import { memo, useCallback } from 'react';
import type { ChangeEvent, FormEvent } from 'react';

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

  return (
    <form
      className="mb-3 flex flex-wrap items-end gap-3"
      onSubmit={handleSubmit}
      aria-label="Stock query form"
    >
      <div>
        <label className="control-label mb-1 block" htmlFor="company-input">
          Company ID
        </label>
        <input
          id="company-input"
          aria-label="Company ID"
          value={tempCompanyId || ''}
          onChange={handleCompanyChange}
          className="input-base"
        />
      </div>

      <div>
        <label className="control-label mb-1 block" htmlFor="date-input">
          Date
        </label>
        <input
          id="date-input"
          aria-label="Date"
          type="date"
          value={tempDate || ''}
          onChange={handleDateChange}
          className="input-base"
        />
      </div>

      <div>
        <button
          className="btn-primary"
          type="submit"
          aria-label="Refresh data"
          disabled={!enabled || loading}
        >
          {loading ? 'Loading...' : 'Refresh now'}
        </button>
      </div>
    </form>
  );
}

export default memo(StockControls);
