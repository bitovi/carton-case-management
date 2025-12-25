import { test, expect } from '@playwright/test';

test.describe('Case Details Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display case header with correct information', async ({ page }) => {
    // Wait for the page to load
    await page.waitForSelector('h1');

    // Check that case header displays
    const caseTitle = page.locator('h1');
    await expect(caseTitle).toBeVisible();
    await expect(caseTitle).toContainText('#CAS-');

    // Check that status badge is visible
    const statusBadge = page.locator('text=/OPEN|IN_PROGRESS|PENDING|RESOLVED|CLOSED/i');
    await expect(statusBadge).toBeVisible();

    // Check that customer name is visible
    const customerLabel = page.locator('text=Customer:');
    await expect(customerLabel).toBeVisible();
  });

  test('should display case description', async ({ page }) => {
    // Wait for description section to load
    const descriptionHeading = page.locator('text=Description');
    await expect(descriptionHeading).toBeVisible();

    // Check that description content is present
    const descriptionCard = page.locator('text=Description').locator('..');
    await expect(descriptionCard).toBeVisible();
  });

  test('should display comments section', async ({ page }) => {
    // Wait for comments section to load
    const commentsHeading = page.locator('text=/Comments/i');
    await expect(commentsHeading).toBeVisible();
  });

  test('should display essential details panel', async ({ page }) => {
    // Wait for essential details panel to load
    const essentialDetailsHeading = page.locator('text=Essential Details');
    await expect(essentialDetailsHeading).toBeVisible();

    // Check that key fields are present
    await expect(page.locator('text=Status')).toBeVisible();
    await expect(page.locator('text=Created By')).toBeVisible();
    await expect(page.locator('text=Created')).toBeVisible();
    await expect(page.locator('text=Last Updated')).toBeVisible();
  });

  test('should handle loading state', async ({ page }) => {
    // Navigate to the page
    await page.goto('/');

    // Check for loading indicator or content
    // Either loading spinner or content should be visible
    const loadingOrContent = page.locator('text=/Loading|#CAS-/i');
    await expect(loadingOrContent).toBeVisible({ timeout: 10000 });
  });

  test('should display case details in correct layout', async ({ page }) => {
    // Wait for page to load
    await page.waitForSelector('h1');

    // Check that main content area exists
    const mainContent = page.locator('.lg\\:col-span-2');
    await expect(mainContent).toBeVisible();

    // Check that sidebar exists
    const sidebar = page.locator('.lg\\:col-span-1');
    await expect(sidebar).toBeVisible();
  });

  test('should format dates correctly', async ({ page }) => {
    // Wait for page to load
    await page.waitForSelector('h1');

    // Check that dates are displayed (look for common date patterns)
    const datePattern = /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},\s+\d{4}/;
    const dates = page.locator(`text=${datePattern}`);
    await expect(dates.first()).toBeVisible();
  });

  test('should display comment author initials', async ({ page }) => {
    // Wait for comments section
    await page.waitForSelector('text=/Comments/i');

    // Check if there are any comments with author initials
    const authorAvatar = page.locator('.rounded-full.bg-blue-600');
    const commentCount = await authorAvatar.count();

    // If there are comments, check that avatars are visible
    if (commentCount > 0) {
      await expect(authorAvatar.first()).toBeVisible();
    }
  });
});
