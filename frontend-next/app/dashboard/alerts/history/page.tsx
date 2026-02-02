import { readStore } from '../../../_lib/storage';
import type { Alert } from '../../../_lib/types';

export default async function AlertsHistoryPage() {
  const alertsStore = await readStore<{ items: Alert[] }>('alerts.json', { items: [] });

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Alert history</h2>
      {alertsStore.items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-600">No alerts created yet.</p>
      ) : (
        <table className="mt-4 w-full border-collapse text-sm">
          <thead>
            <tr className="text-left text-slate-600">
              <th className="pb-2">Symbol</th>
              <th className="pb-2">Threshold</th>
              <th className="pb-2">Schedule</th>
              <th className="pb-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {alertsStore.items.map((alert) => (
              <tr key={alert.id} className="border-t border-slate-100">
                <td className="py-2">{alert.symbol}</td>
                <td className="py-2">
                  {alert.direction} {alert.threshold}
                </td>
                <td className="py-2">{alert.schedule}</td>
                <td className="py-2 capitalize">{alert.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
