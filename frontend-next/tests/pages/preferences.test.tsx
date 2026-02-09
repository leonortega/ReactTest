import { render, screen } from '@testing-library/react';
import PreferencesPage from '../../app/dashboard/preferences/page';
import { writeStore } from '../../app/_lib/storage';

beforeEach(async () => {
  await writeStore('preferences.json', {
    theme: 'dark',
    currency: 'EUR',
    notifications: { email: false, inApp: true },
  });
});

describe('PreferencesPage', () => {
  it('renders stored preferences', async () => {
    render(await PreferencesPage());

    expect(screen.getByText('Preferences')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Dark')).toBeInTheDocument();
    expect(screen.getByDisplayValue('EUR')).toBeInTheDocument();
  });
});
