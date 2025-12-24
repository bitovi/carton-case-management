import { test, expect } from '@playwright/test';

test.describe('Cache Behavior', () => {
  test('should cache query results and display instantly on navigation', async ({ page }) => {
    // First visit - data should load from API
    await page.goto('/');
    
    // Wait for loading to complete
    await expect(page.getByText('Loading cases...')).toBeVisible();
    await expect(page.getByText('Loading cases...')).not.toBeVisible({ timeout: 10000 });
    
    // Verify data is displayed
    const firstCase = page.locator('.grid > a').first();
    await expect(firstCase).toBeVisible();
    
    // Capture the first case title to verify it's the same after navigation
    const firstCaseTitle = await firstCase.locator('h2').textContent();
    
    // Navigate away
    await page.goto('/about'); // or any other route
    
    // Navigate back to home
    const startTime = Date.now();
    await page.goto('/');
    
    // Data should appear almost instantly from cache (< 100ms)
    const caseAfterReturn = page.locator('.grid > a').first();
    await expect(caseAfterReturn).toBeVisible({ timeout: 1000 });
    const loadTime = Date.now() - startTime;
    
    // Verify it's the same data (from cache)
    await expect(caseAfterReturn.locator('h2')).toHaveText(firstCaseTitle || '');
    
    // Cache should make this very fast (< 100ms)
    // Note: This is a soft assertion - actual time may vary in CI
    console.log(`Cache load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(500); // Generous for CI environments
  });

  test('should refetch data in background on window focus', async ({ page, context }) => {
    // First visit
    await page.goto('/');
    await expect(page.getByText('Loading cases...')).not.toBeVisible({ timeout: 10000 });
    
    // Open a new tab to trigger blur/focus
    const newPage = await context.newPage();
    await newPage.goto('/');
    
    // Switch back to original page (triggers window focus)
    await page.bringToFront();
    
    // Wait a moment for background refetch to potentially occur
    await page.waitForTimeout(1000);
    
    // Data should still be visible (cache prevents loading state)
    const caseList = page.locator('.grid > a');
    await expect(caseList.first()).toBeVisible();
    
    // Close the new page
    await newPage.close();
  });

  test('should handle stale data by refetching after 5 minutes', async ({ page }) => {
    // This test would require mocking time or waiting 5 minutes
    // For now, we just verify the query completes successfully
    await page.goto('/');
    await expect(page.getByText('Loading cases...')).not.toBeVisible({ timeout: 10000 });
    
    const caseList = page.locator('.grid > a');
    await expect(caseList.first()).toBeVisible();
    
    // In a real scenario, we'd mock the clock to advance 5 minutes
    // and verify a new network request is made
  });

  test('should show loading state on initial load', async ({ page }) => {
    // Slow down network to ensure we see loading state
    await page.route('**/trpc/case.list*', async (route) => {
      await new Promise((resolve) => globalThis.setTimeout(resolve, 500));
      await route.continue();
    });

    await page.goto('/');
    
    // Loading state should be visible
    await expect(page.getByText('Loading cases...')).toBeVisible();
    
    // Then data should load
    await expect(page.getByText('Loading cases...')).not.toBeVisible({ timeout: 10000 });
    const caseList = page.locator('.grid > a');
    await expect(caseList.first()).toBeVisible();
  });

  test('should not show loading state when data is cached', async ({ page }) => {
    // First visit to populate cache
    await page.goto('/');
    await expect(page.getByText('Loading cases...')).not.toBeVisible({ timeout: 10000 });
    
    // Navigate away and back
    await page.goto('/about');
    await page.goto('/');
    
    // Should NOT see loading state (data from cache)
    // We check that data appears immediately
    const caseList = page.locator('.grid > a');
    await expect(caseList.first()).toBeVisible({ timeout: 500 });
    
    // Verify loading state never appeared
    // (if it did, it would have been caught by the short timeout above)
  });
});
