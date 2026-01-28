import { memo } from 'react';

export type ToggleOptionProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function ToggleOption({ label, checked, onChange }: ToggleOptionProps) {
  return (
    <label className="control-label inline-flex items-center gap-1">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="form-checkbox"
      />
      <span className="ml-1">{label}</span>
    </label>
  );
}

export default memo(ToggleOption);
