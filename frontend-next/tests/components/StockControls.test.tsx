import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import StockControls from '../../app/_components/StockControls';

const setup = ({ autoRefreshSeconds = 5 } = {}) => {
  const user = userEvent.setup();
  const onTempCompanyIdChange = vi.fn();
  const onTempDateChange = vi.fn();
  const onAutoRefreshEnabledChange = vi.fn();
  const onAutoRefreshSecondsChange = vi.fn();
  const onSubmit = vi.fn();

  render(
    <StockControls
      tempCompanyId="ABC"
      tempDate="2024-01-01"
      autoRefreshEnabled
      autoRefreshSeconds={autoRefreshSeconds}
      onTempCompanyIdChange={onTempCompanyIdChange}
      onTempDateChange={onTempDateChange}
      onAutoRefreshEnabledChange={onAutoRefreshEnabledChange}
      onAutoRefreshSecondsChange={onAutoRefreshSecondsChange}
      onSubmit={onSubmit}
      enabled
      loading={false}
    />,
  );

  return {
    user,
    onTempCompanyIdChange,
    onTempDateChange,
    onAutoRefreshEnabledChange,
    onAutoRefreshSecondsChange,
    onSubmit,
  };
};

describe('StockControls', () => {
  it('submits the form when refresh is clicked', async () => {
    const { user, onSubmit } = setup();

    await user.click(screen.getByRole('button', { name: /refresh/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('updates fields when inputs change', async () => {
    const {
      user,
      onTempCompanyIdChange,
      onTempDateChange,
      onAutoRefreshEnabledChange,
      onAutoRefreshSecondsChange,
    } = setup();

    const companyInput = screen.getByLabelText(/company id/i);
    const dateInput = screen.getByLabelText('Date');
    const autoRefreshToggle = screen.getByLabelText(/enable auto update/i);
    const autoRefreshSecondsInput = screen.getByLabelText(/auto update interval seconds/i);

    await user.clear(companyInput);
    await user.type(companyInput, 'XYZ');
    await user.clear(dateInput);
    await user.type(dateInput, '2024-02-10');
    await user.click(autoRefreshToggle);
    await user.clear(autoRefreshSecondsInput);
    await user.type(autoRefreshSecondsInput, '45');

    expect(onTempCompanyIdChange).toHaveBeenCalled();
    expect(onTempDateChange).toHaveBeenCalled();
    expect(onAutoRefreshEnabledChange).toHaveBeenCalledWith(false);
    expect(onAutoRefreshSecondsChange).toHaveBeenCalled();
  });

  it('changes auto-refresh by stepper buttons', async () => {
    const { user, onAutoRefreshSecondsChange } = setup({ autoRefreshSeconds: 10 });

    await user.click(screen.getByRole('button', { name: 'Decrease auto update interval' }));
    await user.click(screen.getByRole('button', { name: 'Increase auto update interval' }));

    expect(onAutoRefreshSecondsChange).toHaveBeenCalledWith('5');
    expect(onAutoRefreshSecondsChange).toHaveBeenCalledWith('15');
  });
});
