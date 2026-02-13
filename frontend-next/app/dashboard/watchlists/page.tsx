import { createWatchlist } from '../../_actions/watchlists';
import { readStore } from '../../_lib/storage';
import type { Watchlist } from '../../_lib/types';
import Button from '../../_components/ui/Button';
import Card, { CardTitle } from '../../_components/ui/Card';
import { Field, FieldInput } from '../../_components/ui/Field';

type WatchlistsSearchParams = {
  error?: string;
};

function getErrorMessage(errorCode?: string): string | null {
  if (errorCode === 'invalid-input') {
    return 'Please provide a watchlist name and valid symbols.';
  }
  return null;
}

export default async function WatchlistsPage({
  searchParams,
}: {
  searchParams?: Promise<WatchlistsSearchParams>;
} = {}) {
  const resolvedSearchParams = await searchParams;
  const errorMessage = getErrorMessage(resolvedSearchParams?.error);
  const store = await readStore<{ items: Watchlist[] }>('watchlists.json', { items: [] });

  return (
    <div className="grid gap-6">
      {errorMessage && (
        <Card variant="panel" className="border-danger/40 bg-danger/10">
          <p role="alert" className="text-sm text-danger">
            {errorMessage}
          </p>
        </Card>
      )}

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
              pattern="[A-Za-z0-9.,\\-\\s]*"
              title="Use comma-separated symbols with letters, numbers, dot, and dash."
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
