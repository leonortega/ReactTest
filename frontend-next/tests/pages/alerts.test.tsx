import { render, screen } from '@testing-library/react';
import AlertsPage from '../../app/app/alerts/page';
import { writeStore } from '../../app/_lib/storage';

beforeEach(async () => {
  await writeStore('alerts.json', {
    items: [
      {
        id: 'a1',
        symbol: 'ABC',
        threshold: 110,
        direction: 'below',
        schedule: 'daily',
        status: 'active',
        createdAt: new Date().toISOString(),
      },
    ],
  });
  await writeStore('notifications.json', {
    items: [
      {
        id: 'n1',
        alertId: 'a1',
        channel: 'email',
        message: 'Alert configured',
        createdAt: new Date().toISOString(),
        read: false,
      },
    ],
  });
});

describe('AlertsPage', () => {
  it('renders alerts and notifications', async () => {
    render(await AlertsPage());

    expect(screen.getByText('Create alert')).toBeInTheDocument();
    expect(screen.getByText(/notifications/i)).toBeInTheDocument();
    expect(screen.getByText(/alert configured/i)).toBeInTheDocument();
  });
});
