import { createWatchlist } from '../../_actions/watchlists';
import { readStore } from '../../_lib/storage';
import type { Watchlist } from '../../_lib/types';

export default async function WatchlistsPage() {
  const store = await readStore<{ items: Watchlist[] }>('watchlists.json', { items: [] });

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Create watchlist</h2>
        <form action={createWatchlist} className="mt-4 grid gap-3 md:grid-cols-3">
          <input name="name" placeholder="Watchlist name" className="input-base" required />
          <input
            name="symbols"
            placeholder="Symbols (comma separated)"
            className="input-base md:col-span-2"
          />
          <button className="btn-primary md:col-span-3" type="submit">
            Save watchlist
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Your watchlists</h2>
        {store.items.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">No watchlists yet.</p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {store.items.map((watchlist) => (
              <li key={watchlist.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm text-slate-500">
                  {new Date(watchlist.createdAt).toLocaleString()}
                </div>
                <div className="text-lg font-semibold">{watchlist.name}</div>
                <div className="text-sm text-slate-600">
                  {watchlist.symbols.join(', ') || 'No symbols yet'}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
