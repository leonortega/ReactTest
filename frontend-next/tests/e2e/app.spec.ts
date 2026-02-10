import { expect, test, type Page, type Route } from '@playwright/test';

test('loads stocks data and shows table', async ({ page }: { page: Page }) => {
  await page.route('**/api/stocks**', async (route: Route) => {
    await route.fulfill({
      json: [
        { companyId: 'ABC', dateTime: '2024-01-01T10:00:00Z', price: 100.5 },
        { companyId: 'ABC', dateTime: '2024-01-01T11:00:00Z', price: 101.2 },
      ],
    });
  });

  await page.context().addCookies([
    {
      name: 'session',
      value: 'test-session',
      url: 'http://localhost:3000',
    },
  ]);

  await page.goto('/dashboard/stocks/ABC');

  await expect(page.getByRole('table')).toBeVisible();
  await expect(page.getByText('Show points')).toBeVisible();
  await expect(page.getByText(/last api call/i)).toBeVisible();
});
