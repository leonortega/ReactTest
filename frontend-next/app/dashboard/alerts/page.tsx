import { createAlert } from '../../_actions/alerts';
import { readStore } from '../../_lib/storage';
import type { Alert, Notification } from '../../_lib/types';
import Button from '../../_components/ui/Button';
import Card, { CardTitle } from '../../_components/ui/Card';
import { Field, FieldInput, FieldSelect } from '../../_components/ui/Field';

export default async function AlertsPage() {
  const [alertsStore, notificationsStore] = await Promise.all([
    readStore<{ items: Alert[] }>('alerts.json', { items: [] }),
    readStore<{ items: Notification[] }>('notifications.json', { items: [] }),
  ]);

  return (
    <div className="grid gap-6">
      <Card variant="form">
        <CardTitle>Create alert</CardTitle>
        <form action={createAlert} className="mt-4 grid gap-3 md:grid-cols-4">
          <Field label="Symbol" htmlFor="alert-symbol" required>
            <FieldInput id="alert-symbol" name="symbol" placeholder="Symbol" required />
          </Field>
          <Field label="Threshold" htmlFor="alert-threshold" required>
            <FieldInput
              id="alert-threshold"
              name="threshold"
              type="number"
              step="0.01"
              placeholder="Threshold"
              required
            />
          </Field>
          <Field label="Direction" htmlFor="alert-direction">
            <FieldSelect id="alert-direction" name="direction">
              <option value="above">Above</option>
              <option value="below">Below</option>
            </FieldSelect>
          </Field>
          <Field label="Schedule" htmlFor="alert-schedule">
            <FieldSelect id="alert-schedule" name="schedule">
              <option value="realtime">Realtime</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
            </FieldSelect>
          </Field>
          <Button className="md:col-span-4" type="submit">
            Save alert
          </Button>
        </form>
      </Card>

      <Card variant="panel">
        <CardTitle>Active alerts</CardTitle>
        {alertsStore.items.length === 0 ? (
          <p className="mt-3 text-sm text-text-muted">No alerts configured.</p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {alertsStore.items.map((alert) => (
              <Card key={alert.id} as="li" variant="metric" className="list-none">
                <div className="text-sm text-text-muted">
                  {new Date(alert.createdAt).toLocaleString()}
                </div>
                <div className="mt-1 text-lg font-semibold text-text">
                  {alert.symbol} {alert.direction} {alert.threshold}
                </div>
                <div className="text-sm text-text-muted">Schedule: {alert.schedule}</div>
              </Card>
            ))}
          </ul>
        )}
      </Card>

      <Card variant="panel">
        <CardTitle>Notifications</CardTitle>
        {notificationsStore.items.length === 0 ? (
          <p className="mt-3 text-sm text-text-muted">No notifications yet.</p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {notificationsStore.items.slice(0, 5).map((note) => (
              <Card key={note.id} as="li" variant="metric" className="list-none">
                <div className="text-xs uppercase tracking-wide text-text-muted">{note.channel}</div>
                <div className="text-sm text-text">{note.message}</div>
              </Card>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
