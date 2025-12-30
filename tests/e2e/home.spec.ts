import { test, expect } from '@playwright/test';

test.describe('HomePage', () => {
  test('should display case list and details', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('.flex.flex-col.gap-2 a').first()).toBeVisible({ timeout: 10000 });
  });

  test.skip('should navigate to case page', async () => {});
});
