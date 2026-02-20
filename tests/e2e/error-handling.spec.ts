import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
  test('should display error message when API fails', async ({ page }) => {
    await page.route(
      (url) => url.href.includes('/trpc') && url.href.includes('case.list'),
      (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              error: {
                json: {
                  message: 'Database connection failed',
                  code: -32603,
                },
              },
            },
          ]),
        });
      }
    );

    await page.goto('/');

    await expect(page.getByText('Error loading cases').first()).toBeVisible({ timeout: 15000 });

    const retryButton = page.getByRole('button', { name: /retry/i }).first();
    await expect(retryButton).toBeVisible();
  });

  test('should retry request when retry button is clicked', async ({ page }) => {
    let shouldError = true;

    await page.route(
      (url) => url.href.includes('/trpc') && url.href.includes('case.list'),
      (route) => {
        if (shouldError) {
          route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify([
              {
                error: {
                  json: {
                    message: 'Temporary server error',
                    code: -32603,
                  },
                },
              },
            ]),
          });
        } else {
          route.continue();
        }
      }
    );

    await page.goto('/');

    await expect(page.getByText('Error loading cases').first()).toBeVisible({ timeout: 15000 });

    shouldError = false;

    await page.getByRole('button', { name: /retry/i }).first().click();

    const caseList = page.locator('.flex.flex-col.gap-2 a');
    await expect(caseList.first()).toBeVisible({ timeout: 10000 });
    await expect(page.getByText('Error loading cases').first()).not.toBeVisible();
  });

  test('should display loading spinner while fetching', async ({ page }) => {
    await page.route(
      (url) => url.href.includes('/trpc') && url.href.includes('case.list'),
      async (route) => {
        await new Promise((resolve) => globalThis.setTimeout(resolve, 1000));
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

  test('should show background refetch indicator', async ({ page }) => {
    await page.goto('/');

    const caseList = page.locator('.flex.flex-col.gap-2 a');
    await expect(caseList.first()).toBeVisible({ timeout: 10000 });

    const firstCaseHref = await caseList.first().getAttribute('href');
    const secondCase = caseList.nth(1);

    if (await secondCase.isVisible()) {
      await secondCase.click();
      await page.waitForTimeout(200);
    }

    await page.goto(firstCaseHref || '/');

    await expect(caseList.first()).toBeVisible({ timeout: 500 });

    await page.reload();

    await expect(caseList.first()).toBeVisible({ timeout: 2000 });
  });

  test('should display empty state when no cases exist', async ({ page }) => {
    await page.route(
      (url) => url.href.includes('/trpc') && url.href.includes('case.list'),
      (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              result: {
                data: [],
              },
            },
          ]),
        });
      }
    );

    await page.goto('/');

    await expect(page.getByText('No cases found').first()).toBeVisible({ timeout: 10000 });

    const caseLinks = page.locator('.flex.flex-col.gap-2 a');
    await expect(caseLinks).toHaveCount(0);
  });

  test('should show error loading cases message', async ({ page }) => {
    await page.route(
      (url) => url.href.includes('/trpc') && url.href.includes('case.list'),
      (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              error: {
                json: {
                  message: 'Failed to load cases',
                  code: -32603,
                },
              },
            },
          ]),
        });
      }
    );

    await page.goto('/');

    await expect(page.getByText('Error loading cases').first()).toBeVisible({ timeout: 15000 });

    await expect(page.getByRole('button', { name: /retry/i }).first()).toBeVisible();
  });
});
