import React from 'react';

export interface StockControlsProps {
  tempCompanyId: string;
  tempDate: string;
  onTempCompanyIdChange: (v: string) => void;
  onTempDateChange: (v: string) => void;
  onSubmit: () => void;
  enabled: boolean;
  loading: boolean;
}

export default function StockControls({
  tempCompanyId,
  tempDate,
  onTempCompanyIdChange,
  onTempDateChange,
  onSubmit,
  enabled,
  loading,
}: StockControlsProps) {
  return (
    <form
      className="rs-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
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
          onChange={(e) => onTempCompanyIdChange(e.target.value)}
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
          onChange={(e) => onTempDateChange(e.target.value)}
        />
      </div>

      <div>
        <button className="rs-btn" type="submit" aria-label="Refresh data" disabled={!enabled || loading}>
          {loading ? 'Loading...' : 'Refresh now'}
        </button>
      </div>
    </form>
  );
}


