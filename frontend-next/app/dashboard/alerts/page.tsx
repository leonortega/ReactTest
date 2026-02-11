import { createAlert } from '../../_actions/alerts';
import { readStore } from '../../_lib/storage';
import type { Alert, Notification } from '../../_lib/types';

export default async function AlertsPage() {
  const [alertsStore, notificationsStore] = await Promise.all([
    readStore<{ items: Alert[] }>('alerts.json', { items: [] }),
    readStore<{ items: Notification[] }>('notifications.json', { items: [] }),
  ]);

  return (
    <div className="grid gap-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Create alert</h2>
        <form action={createAlert} className="mt-4 grid gap-3 md:grid-cols-4">
          <input name="symbol" placeholder="Symbol" className="input-base" required />
          <input
            name="threshold"
            type="number"
            step="0.01"
            placeholder="Threshold"
            className="input-base"
            required
          />
          <select name="direction" className="input-base">
            <option value="above">Above</option>
            <option value="below">Below</option>
          </select>
          <select name="schedule" className="input-base">
            <option value="realtime">Realtime</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
          <button className="btn-primary md:col-span-4" type="submit">
            Save alert
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Active alerts</h2>
        {alertsStore.items.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">No alerts configured.</p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {alertsStore.items.map((alert) => (
              <li key={alert.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-sm text-slate-500">
                  {new Date(alert.createdAt).toLocaleString()}
                </div>
                <div className="text-lg font-semibold">
                  {alert.symbol} {alert.direction} {alert.threshold}
                </div>
                <div className="text-sm text-slate-600">Schedule: {alert.schedule}</div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Notifications</h2>
        {notificationsStore.items.length === 0 ? (
          <p className="mt-3 text-sm text-slate-600">No notifications yet.</p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {notificationsStore.items.slice(0, 5).map((note) => (
              <li key={note.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs uppercase text-slate-500">{note.channel}</div>
                <div className="text-sm text-slate-700">{note.message}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
