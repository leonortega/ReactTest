import { render, screen } from '@testing-library/react';
import WatchlistsPage from '../../app/dashboard/watchlists/page';
import { writeStore } from '../../app/_lib/storage';

beforeEach(async () => {
  await writeStore('watchlists.json', { items: [] });
});

describe('WatchlistsPage', () => {
  it('renders empty state', async () => {
    render(await WatchlistsPage());

    expect(screen.getByText('Create watchlist')).toBeInTheDocument();
    expect(screen.getByText(/no watchlists yet/i)).toBeInTheDocument();
  });
});
