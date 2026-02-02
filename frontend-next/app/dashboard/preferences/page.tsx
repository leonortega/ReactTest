import { updatePreferences } from '../../_actions/preferences';
import { readStore } from '../../_lib/storage';
import type { Preferences } from '../../_lib/types';

export default async function PreferencesPage() {
  const preferences = await readStore<Preferences>('preferences.json', {
    theme: 'system',
    currency: 'USD',
    notifications: { email: true, inApp: true },
  });

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Preferences</h2>
      <form action={updatePreferences} className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="control-label">
          Theme
          <select name="theme" defaultValue={preferences.theme} className="input-base">
            <option value="system">System</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
        <label className="control-label">
          Currency
          <select name="currency" defaultValue={preferences.currency} className="input-base">
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </label>
        <label className="control-label">
          <input
            type="checkbox"
            name="email"
            defaultChecked={preferences.notifications.email}
            className="form-checkbox"
          />
          Email notifications
        </label>
        <label className="control-label">
          <input
            type="checkbox"
            name="inApp"
            defaultChecked={preferences.notifications.inApp}
            className="form-checkbox"
          />
          In-app notifications
        </label>
        <button className="btn-primary md:col-span-2" type="submit">
          Save preferences
        </button>
      </form>
    </section>
  );
}
