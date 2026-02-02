import { render, screen } from '@testing-library/react';
import DashboardPage from '../../app/dashboard/page';
import { writeStore } from '../../app/_lib/storage';

const setupStores = async () => {
  await writeStore('watchlists.json', {
    items: [
      { id: 'w1', name: 'Core', symbols: ['ABC'], createdAt: new Date().toISOString() },
    ],
  });
  await writeStore('alerts.json', {
    items: [
      {
        id: 'a1',
        symbol: 'ABC',
        threshold: 120,
        direction: 'above',
        schedule: 'realtime',
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
        channel: 'in-app',
        message: 'Alert fired',
        createdAt: new Date().toISOString(),
        read: false,
      },
    ],
  });
};

describe('DashboardPage', () => {
  beforeEach(async () => {
    await setupStores();
  });

  it('renders portfolio overview counts', async () => {
    render(await DashboardPage());

    expect(screen.getByText('Portfolio overview')).toBeInTheDocument();
    expect(screen.getByText(/unread notifications/i)).toBeInTheDocument();
    expect(screen.getAllByText(/\d+/)).toHaveLength(3);
  });
});
