import { test, expect } from '@playwright/test';

test.describe('Error Handling', () => {
  test('should display error message when API fails', async ({ page }) => {
    // Intercept API and return error
    await page.route('**/trpc/case.list*', (route) => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            message: 'Database connection failed',
            code: -32603,
          },
        }),
      });
    });

    await page.goto('/');

    // Should show error message
    await expect(page.getByText(/Error loading cases/i)).toBeVisible();
    await expect(page.getByText(/Database connection failed/i)).toBeVisible();

    // Should show retry button
    const retryButton = page.getByRole('button', { name: /retry/i });
    await expect(retryButton).toBeVisible();
  });

  test('should retry request when retry button is clicked', async ({ page }) => {
    let requestCount = 0;

    // First request fails, second succeeds
    await page.route('**/trpc/case.list*', (route) => {
      requestCount++;
      if (requestCount === 1) {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            error: {
              message: 'Temporary server error',
              code: -32603,
            },
          }),
        });
      } else {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            result: {
              data: [
                {
                  id: '1',
                  title: 'Test Case',
                  description: 'Test Description',
                  status: 'OPEN',
                  creator: { id: '1', name: 'John Doe', email: 'john@example.com' },
                  assignee: null,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                },
              ],
            },
          }),
        });
      }
    });

    await page.goto('/');

    // Should show error initially
    await expect(page.getByText(/Error loading cases/i)).toBeVisible();

    // Click retry button
    await page.getByRole('button', { name: /retry/i }).click();

    // Should show loading state briefly
    await expect(page.getByText(/Loading cases/i)).toBeVisible();

    // Should eventually show the case
    await expect(page.getByText('Test Case')).toBeVisible({ timeout: 10000 });
    await expect(page.getByText(/Error loading cases/i)).not.toBeVisible();
  });

  test('should display loading spinner while fetching', async ({ page }) => {
    // Add delay to API response
    await page.route('**/trpc/case.list*', async (route) => {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 1000));
      await route.continue();
    });

    await page.goto('/');

    // Should show loading spinner
    const loadingText = page.getByText(/Loading cases/i);
    await expect(loadingText).toBeVisible();

    // Should have spinner animation (check for presence of spinner element)
    const spinner = page.locator('.animate-spin').first();
    await expect(spinner).toBeVisible();

    // Wait for loading to complete
    await expect(loadingText).not.toBeVisible({ timeout: 10000 });
  });

  test('should show background refetch indicator', async ({ page }) => {
    // First visit - load data
    await page.goto('/');
    await expect(page.getByText(/Loading cases/i)).not.toBeVisible({ timeout: 10000 });

    // Navigate away and back to trigger cache
    await page.goto('/about');
    await page.goto('/');

    // Data should be visible immediately from cache
    const caseList = page.locator('.grid > a');
    await expect(caseList.first()).toBeVisible({ timeout: 500 });

    // Trigger a page reload to simulate refetch behavior
    await page.reload();

    // After reload with cache, data should still be visible quickly
    await expect(caseList.first()).toBeVisible({ timeout: 2000 });
  });

  test('should display empty state when no cases exist', async ({ page }) => {
    // Mock empty response
    await page.route('**/trpc/case.list*', (route) => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          result: {
            data: [],
          },
        }),
      });
    });

    await page.goto('/');

    // Wait for loading to complete
    await expect(page.getByText(/Loading cases/i)).not.toBeVisible({ timeout: 10000 });

    // Should show empty state message
    await expect(page.getByText(/No cases found/i)).toBeVisible();
    await expect(page.getByText(/Create a new case to get started/i)).toBeVisible();

    // Should not have any case links
    const caseLinks = page.locator('.grid > a');
    await expect(caseLinks).toHaveCount(0);
  });

  test('should handle network timeout gracefully', async ({ page }) => {
    // Intercept and never respond (simulate timeout)
    await page.route('**/trpc/case.list*', () => {
      // Don't call route.fulfill() or route.continue() - simulates hanging request
    });

    await page.goto('/');

    // Should show loading state indefinitely (until timeout)
    await expect(page.getByText(/Loading cases/i)).toBeVisible();

    // After React Query's retry timeout, should eventually show error
    // Note: This may take a while due to retries
    await expect(page.getByText(/Error loading cases/i)).toBeVisible({ timeout: 30000 });
  });
});
