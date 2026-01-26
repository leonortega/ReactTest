import type { Dispatch, SetStateAction } from 'react';

export interface StockControlsProps {
  tempCompanyId: string;
  tempDate: string;
  onTempCompanyIdChange: Dispatch<SetStateAction<string>>;
  onTempDateChange: Dispatch<SetStateAction<string>>;
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
      className="flex gap-3 items-end mb-3 flex-wrap"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      aria-label="Stock query form"
    >

      <div>
        <label className="block mb-1 control-label" htmlFor="company-input">
          Company ID
        </label>
        <input
          id="company-input"
          aria-label="Company ID"
          value={tempCompanyId || ''}
          onChange={(e) => onTempCompanyIdChange(e.target.value)}
          className="input-base"
        />
      </div>

      <div>
        <label className="block mb-1 control-label" htmlFor="date-input">
          Date
        </label>
        <input
          id="date-input"
          aria-label="Date"
          type="date"
          value={tempDate || ''}
          onChange={(e) => onTempDateChange(e.target.value)}
          className="input-base"
        />
      </div>

      <div>
        <button className="btn-primary" type="submit" aria-label="Refresh data" disabled={!enabled || loading}>
          {loading ? 'Loading...' : 'Refresh now'}
        </button>
      </div>
    </form>
  );
}


