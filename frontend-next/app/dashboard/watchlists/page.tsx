import { createWatchlist } from '../../_actions/watchlists';
import { readStore } from '../../_lib/storage';
import type { Watchlist } from '../../_lib/types';
import Button from '../../_components/ui/Button';
import Card, { CardTitle } from '../../_components/ui/Card';
import { Field, FieldInput } from '../../_components/ui/Field';

export default async function WatchlistsPage() {
  const store = await readStore<{ items: Watchlist[] }>('watchlists.json', { items: [] });

  return (
    <div className="grid gap-6">
      <Card variant="form">
        <CardTitle>Create watchlist</CardTitle>
        <form action={createWatchlist} className="mt-4 grid gap-3 md:grid-cols-3">
          <Field className="md:col-span-1" label="Name" htmlFor="watchlist-name" required>
            <FieldInput
              id="watchlist-name"
              name="name"
              placeholder="Watchlist name"
              required
            />
          </Field>
          <Field className="md:col-span-2" label="Symbols" htmlFor="watchlist-symbols">
            <FieldInput
              id="watchlist-symbols"
              name="symbols"
              placeholder="Symbols (comma separated)"
            />
          </Field>
          <Button className="md:col-span-3" type="submit">
            Save watchlist
          </Button>
        </form>
      </Card>

      <Card variant="panel">
        <CardTitle>Your watchlists</CardTitle>
        {store.items.length === 0 ? (
          <p className="mt-3 text-sm text-text-muted">No watchlists yet.</p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {store.items.map((watchlist) => (
              <Card key={watchlist.id} as="li" variant="metric" className="list-none">
                <div className="text-sm text-text-muted">
                  {new Date(watchlist.createdAt).toLocaleString()}
                </div>
                <div className="mt-1 text-lg font-semibold text-text">{watchlist.name}</div>
                <div className="text-sm text-text-muted">
                  {watchlist.symbols.join(', ') || 'No symbols yet'}
                </div>
              </Card>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
