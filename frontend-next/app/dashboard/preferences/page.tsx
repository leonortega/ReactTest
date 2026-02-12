import { updatePreferences } from '../../_actions/preferences';
import { readStore } from '../../_lib/storage';
import type { Preferences } from '../../_lib/types';
import Button from '../../_components/ui/Button';
import Card, { CardTitle } from '../../_components/ui/Card';
import { Field, FieldSelect } from '../../_components/ui/Field';

export default async function PreferencesPage() {
  const preferences = await readStore<Preferences>('preferences.json', {
    theme: 'light',
    currency: 'USD',
    notifications: { email: true, inApp: true },
  });
  const theme = preferences.theme === 'dark' ? 'dark' : 'light';

  return (
    <Card variant="form">
      <CardTitle>Preferences</CardTitle>
      <form action={updatePreferences} className="mt-4 grid gap-4 md:grid-cols-2">
        <Field label="Theme" htmlFor="preferences-theme">
          <FieldSelect id="preferences-theme" name="theme" defaultValue={theme}>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </FieldSelect>
        </Field>
        <Field label="Currency" htmlFor="preferences-currency">
          <FieldSelect id="preferences-currency" name="currency" defaultValue={preferences.currency}>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </FieldSelect>
        </Field>
        <label className="inline-flex items-center gap-2 text-sm text-text">
          <input
            type="checkbox"
            name="email"
            defaultChecked={preferences.notifications.email}
            className="form-checkbox"
          />
          Email notifications
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-text">
          <input
            type="checkbox"
            name="inApp"
            defaultChecked={preferences.notifications.inApp}
            className="form-checkbox"
          />
          In-app notifications
        </label>
        <Button className="md:col-span-2" type="submit">
          Save preferences
        </Button>
      </form>
    </Card>
  );
}
