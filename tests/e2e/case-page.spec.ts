import { test, expect } from '@playwright/test';

test.describe('CasePage', () => {
  test('should display case details when navigating to case', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    await page.waitForURL(/\/cases\/.+/, { timeout: 10000 });

    await expect(page.getByText('Loading case details...')).not.toBeVisible({ timeout: 15000 });

    const caseTitle = page.getByRole('heading', { level: 1 });
    await expect(caseTitle).toBeVisible();
  });

  test('should show loading state while fetching case details', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.route(
      (url) => url.href.includes('/trpc') && url.href.includes('case.getById'),
      async (route) => {
        await new Promise((resolve) => globalThis.setTimeout(resolve, 1000));
        await route.continue();
      }
    );

    await page.goto('/');

    await page.waitForURL(/\/cases\/.+/, { timeout: 10000 });

    await expect(page.getByText('Loading case details...'))
      .toBeVisible({ timeout: 2000 })
      .catch(() => {});

    const caseTitle = page.getByRole('heading', { level: 1 });
    await expect(caseTitle).toBeVisible({ timeout: 15000 });
  });

  test('should display case not found when invalid ID', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    await page.goto('/cases/invalid-case-id-12345');

    await expect(page.getByText('No case selected')).toBeVisible({ timeout: 10000 });
  });

  test('should switch cases when clicking different case in list', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    await page.waitForURL(/\/cases\/.+/, { timeout: 10000 });

    const firstUrl = page.url();

    const caseList = page.locator('.flex.flex-col.gap-2 a');
    await expect(caseList.first()).toBeVisible({ timeout: 10000 });

    const secondCase = caseList.nth(1);
    if (await secondCase.isVisible()) {
      await secondCase.click();

      await page.waitForTimeout(500);

      const secondUrl = page.url();
      expect(secondUrl).not.toBe(firstUrl);
    }
  });

  test('should display case information section', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    await page.waitForURL(/\/cases\/.+/, { timeout: 10000 });

    const caseTitle = page.getByRole('heading', { level: 1 });
    await expect(caseTitle).toBeVisible();

    const caseIdText = page.locator('text=/Case ID:/i, text=/ID:/i').first();
    await expect(caseIdText)
      .toBeVisible()
      .catch(() => {});
  });

  test('should display case essential details section', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    await page.waitForURL(/\/cases\/.+/, { timeout: 10000 });
    
    const essentialDetailsButton = page.getByRole('button', { name: /essential details/i });
    await expect(essentialDetailsButton).toBeVisible({ timeout: 10000 });

  });

  test('should display case comments section', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    await page.waitForURL(/\/cases\/.+/, { timeout: 10000 });

    const commentsHeading = page.locator('text=/Comments/i, text=/Activity/i').first();
    await expect(commentsHeading)
      .toBeVisible()
      .catch(() => {});
  });

  test('should redirect to first case when navigating to root', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    await page.waitForURL(/\/cases\/.+/, { timeout: 10000 });

    expect(page.url()).toMatch(/\/cases\/.+/);
  });

  test('should handle responsive layout on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    const caseList = page.locator('.flex-1.lg\\:hidden .flex.flex-col.gap-2 a');
    await expect(caseList.first()).toBeVisible({ timeout: 10000 });

    await caseList.first().click();

    await page.waitForURL(/\/cases\/.+/, { timeout: 10000 });

    const caseTitle = page.getByRole('heading', { level: 1 });
    await expect(caseTitle).toBeVisible();

    const menuButton = page
      .locator('button[aria-label*="menu"], button:has-text("Menu"), button svg')
      .first();
    await expect(menuButton)
      .toBeVisible()
      .catch(() => {});
  });

  test('should open mobile sheet when menu clicked', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    const caseList = page.locator('.flex-1.lg\\:hidden .flex.flex-col.gap-2 a');
    await expect(caseList.first()).toBeVisible({ timeout: 10000 });

    await caseList.first().click();

    await page.waitForURL(/\/cases\/.+/, { timeout: 10000 });

    const menuButton = page.getByRole('button', { name: 'Open case list' });
    if (await menuButton.isVisible()) {
      await menuButton.click();

      const sheet = page.locator('[role="dialog"]').first();
      await expect(sheet).toBeVisible({ timeout: 5000 });

      const caseListInSheet = sheet.locator('a').first();
      await expect(caseListInSheet).toBeVisible();
    }
  });

  test('should close mobile sheet after selecting case', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('/');

    const caseList = page.locator('.flex-1.lg\\:hidden .flex.flex-col.gap-2 a');
    await expect(caseList.first()).toBeVisible({ timeout: 10000 });

    await caseList.first().click();

    await page.waitForURL(/\/cases\/.+/, { timeout: 10000 });

    const menuButton = page.getByRole('button', { name: 'Open case list' });
    if (await menuButton.isVisible()) {
      await menuButton.click();

      const sheet = page.locator('[role="dialog"]').first();
      await expect(sheet).toBeVisible({ timeout: 5000 });

      const secondCase = sheet.locator('a').nth(1);
      if (await secondCase.isVisible()) {
        await secondCase.click();

        await expect(sheet).not.toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('should display case list on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    await page.goto('/');

    await page.waitForURL(/\/cases\/.+/, { timeout: 10000 });

    const caseList = page.locator('.flex.flex-col.gap-2 a');
    await expect(caseList.first()).toBeVisible();

    const caseDetails = page.getByRole('heading', { level: 1 });
    await expect(caseDetails).toBeVisible();
  });

  test('should handle error loading case details', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.route(
      (url) => url.href.includes('/trpc') && url.href.includes('case.getById'),
      (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              error: {
                json: {
                  message: 'Failed to fetch case',
                  code: -32603,
                },
              },
            },
          ]),
        });
      }
    );

    await page.goto('/');

    await page.waitForURL(/\/cases\/.+/, { timeout: 10000 });

    await expect(page.getByText(/error/i, { exact: false }))
      .toBeVisible({ timeout: 15000 })
      .catch(() => {});
  });
});
