import { test, expect } from '@playwright/test';

test.describe('Case List Status Badge', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.waitForURL(/\/cases\/.+/, { timeout: 10000 });
    await page.waitForLoadState('networkidle');
  });

  test('should display a status badge on each case in the sidebar', async ({ page }) => {
    const badges = page.locator('[data-testid="case-status-badge"]');
    await expect(badges.first()).toBeVisible({ timeout: 5000 });
    const count = await badges.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should show a valid status label on each badge', async ({ page }) => {
    const validLabels = ['To Do', 'In Progress', 'Completed', 'Closed'];
    const badges = page.locator('[data-testid="case-status-badge"]');
    await expect(badges.first()).toBeVisible({ timeout: 5000 });

    const count = await badges.count();
    for (let i = 0; i < count; i++) {
      const label = (await badges.nth(i).textContent())?.trim() ?? '';
      expect(validLabels).toContain(label);
    }
  });

  test('should update the sidebar badge when the case status is changed', async ({ page }) => {
    const firstBadge = page.locator('[data-testid="case-status-badge"]').first();
    await expect(firstBadge).toBeVisible({ timeout: 5000 });

    const originalStatus = await firstBadge.getAttribute('data-status');

    const targetStatus = originalStatus === 'IN_PROGRESS' ? 'TO_DO' : 'IN_PROGRESS';
    const targetLabel = targetStatus === 'IN_PROGRESS' ? 'In Progress' : 'To Do';

    const statusCombobox = page
      .getByRole('combobox')
      .filter({ hasText: /To Do|In Progress|Completed|Closed/i })
      .first();
    await expect(statusCombobox).toBeVisible({ timeout: 5000 });
    await statusCombobox.click();

    const option = page.getByRole('option', { name: targetLabel });
    await expect(option).toBeVisible({ timeout: 3000 });
    await option.click();

    await page.waitForLoadState('networkidle');

    await expect(firstBadge).toHaveAttribute('data-status', targetStatus, { timeout: 5000 });
    await expect(firstBadge).toHaveText(targetLabel);
  });
});
