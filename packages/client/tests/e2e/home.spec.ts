import { test, expect } from '@playwright/test';

test.describe('HomePage', () => {
  test('should display welcome message', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /Carton Case Management/i })).toBeVisible();
  });

  test('should navigate to cases page', async ({ page }) => {
    await page.goto('/');
    await page.click('text=View Cases');
    await expect(page).toHaveURL('/cases');
  });
});
