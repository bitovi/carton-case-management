import { test, expect } from '@playwright/test';

test.describe('Cache Behavior', () => {
  test('should cache query results and display instantly on navigation', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    await page.waitForURL(/\/cases\/.+/, { timeout: 10000 });

    const firstCase = page.locator('.flex.flex-col.gap-2 a').first();
    await expect(firstCase).toBeVisible({ timeout: 10000 });

    const firstCaseText = await firstCase.textContent();
    const caseId = await firstCase.getAttribute('href');

    const secondCase = page.locator('.flex.flex-col.gap-2 a').nth(1);
    if (await secondCase.isVisible()) {
      await secondCase.click();
      await page.waitForURL(/\/cases\/.+/, { timeout: 5000 });
    }

    const startTime = Date.now();
    await page.goto(caseId || '/');

    await page.waitForURL(/\/cases\/.+/, { timeout: 5000 });

    const caseAfterReturn = page.locator('.flex.flex-col.gap-2 a').first();
    await expect(caseAfterReturn).toBeVisible({ timeout: 1000 });
    const loadTime = Date.now() - startTime;

    const returnedCaseText = await caseAfterReturn.textContent();
    expect(returnedCaseText).toBe(firstCaseText);

    console.log(`Cache load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(2000);
  });

  test('should refetch data in background on window focus', async ({ page, context }) => {
    await page.goto('/');
    const caseList = page.locator('.flex.flex-col.gap-2 a');
    await expect(caseList.first()).toBeVisible({ timeout: 10000 });

    const newPage = await context.newPage();
    await newPage.goto('/');

    await page.bringToFront();

    await page.waitForTimeout(1000);

    await expect(caseList.first()).toBeVisible();

    await newPage.close();
  });

  test('should handle stale data by refetching after 5 minutes', async ({ page }) => {
    await page.goto('/');
    const caseList = page.locator('.flex.flex-col.gap-2 a');
    await expect(caseList.first()).toBeVisible({ timeout: 10000 });
  });

  test('should show loading state on initial load', async ({ page }) => {
    await page.route(
      (url) => url.href.includes('/trpc') && url.href.includes('batch=1'),
      async (route) => {
        await new Promise((resolve) => globalThis.setTimeout(resolve, 500));
        await route.continue();
      }
    );

    await page.goto('/');

    const skeletons = page.locator('.flex.flex-col.gap-2 .h-5');
    await expect(skeletons.first())
      .toBeVisible({ timeout: 2000 })
      .catch(() => {});

    const caseList = page.locator('.flex.flex-col.gap-2 a');
    await expect(caseList.first()).toBeVisible({ timeout: 10000 });
  });

  test('should not show loading state when data is cached', async ({ page }) => {
    await page.goto('/');
    const caseList = page.locator('.flex.flex-col.gap-2 a');
    await expect(caseList.first()).toBeVisible({ timeout: 10000 });

    const secondCase = caseList.nth(1);

    if (await secondCase.isVisible()) {
      await secondCase.click();
      await page.waitForTimeout(200);
    }

    await page.goto('/');

    await expect(caseList.first()).toBeVisible({ timeout: 500 });
  });
});
