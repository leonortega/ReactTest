import { readStore } from '../../../_lib/storage';
import type { Alert } from '../../../_lib/types';
import Card, { CardTitle } from '../../../_components/ui/Card';

export default async function AlertsHistoryPage() {
  const alertsStore = await readStore<{ items: Alert[] }>('alerts.json', { items: [] });

  return (
    <Card variant="panel">
      <CardTitle>Alert history</CardTitle>
      {alertsStore.items.length === 0 ? (
        <p className="mt-3 text-sm text-text-muted">No alerts created yet.</p>
      ) : (
        <div className="mt-4 overflow-auto rounded-md border border-border">
          <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-surface-2 text-left text-text-muted">
              <th className="p-2">Symbol</th>
              <th className="p-2">Threshold</th>
              <th className="p-2">Schedule</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {alertsStore.items.map((alert) => (
              <tr key={alert.id} className="border-t border-border/70 odd:bg-surface even:bg-surface-2">
                <td className="p-2 text-data">{alert.symbol}</td>
                <td className="p-2 text-data">
                  {alert.direction} {alert.threshold}
                </td>
                <td className="p-2 text-data">{alert.schedule}</td>
                <td className="p-2 capitalize text-data">{alert.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      )}
    </Card>
  );
}
