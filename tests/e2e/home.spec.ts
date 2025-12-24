import { test, expect } from '@playwright/test';

test.describe('HomePage', () => {
  test('should display welcome message', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Cases/i })).toBeVisible();
  });

  test.skip('should navigate to case page', async () => {});
});
