import { expect, test } from '@playwright/test';

test('loads stocks data and shows table', async ({ page }) => {
  await page.route('**/api/stocks/**', async (route) => {
    await route.fulfill({
      json: [
        { companyId: 'ABC', dateTime: '2024-01-01T10:00:00Z', price: 100.5 },
        { companyId: 'ABC', dateTime: '2024-01-01T11:00:00Z', price: 101.2 },
      ],
    });
  });

  await page.goto('/');

  await expect(page.getByRole('table')).toBeVisible();
  await expect(page.getByText('Show points')).toBeVisible();
  await expect(page.getByText(/last api call/i)).toBeVisible();
});
