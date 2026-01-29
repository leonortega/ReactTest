import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import StockControls from '../StockControls';

const setup = () => {
  const user = userEvent.setup();
  const onTempCompanyIdChange = vi.fn();
  const onTempDateChange = vi.fn();
  const onSubmit = vi.fn();

  render(
    <StockControls
      tempCompanyId="ABC"
      tempDate="2024-01-01"
      onTempCompanyIdChange={onTempCompanyIdChange}
      onTempDateChange={onTempDateChange}
      onSubmit={onSubmit}
      enabled
      loading={false}
    />
  );

  return { user, onTempCompanyIdChange, onTempDateChange, onSubmit };
};

describe('StockControls', () => {
  it('submits the form when refresh is clicked', async () => {
    const { user, onSubmit } = setup();

    await user.click(screen.getByRole('button', { name: /refresh/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('updates fields when inputs change', async () => {
    const { user, onTempCompanyIdChange, onTempDateChange } = setup();

    const companyInput = screen.getByLabelText(/company id/i);
    const dateInput = screen.getByLabelText(/date/i);

    await user.clear(companyInput);
    await user.type(companyInput, 'XYZ');
    await user.clear(dateInput);
    await user.type(dateInput, '2024-02-10');

    expect(onTempCompanyIdChange).toHaveBeenCalled();
    expect(onTempDateChange).toHaveBeenCalled();
  });
});
