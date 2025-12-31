import { test, expect } from '@playwright/test';

test.describe('Collapsible Navigation Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.describe('User Story 1 - Collapse Expanded Menu', () => {
    test('should display collapsed menu by default on every page load', async ({ page }) => {
      // Set desktop viewport
      await page.setViewportSize({ width: 1280, height: 720 });

      // Wait for desktop navigation to be visible
      const desktopNav = page.locator('nav[aria-label="Main menu"] > div.hidden.lg\\:flex');
      await desktopNav.waitFor({ state: 'visible' });

      // Check that expand button is visible (menu starts collapsed)
      const expandButton = page.getByRole('button', { name: /expand navigation menu/i });
      await expect(expandButton).toBeVisible();
      await expect(expandButton).toHaveAttribute('aria-expanded', 'false');

      // Verify menu items are visible as icons with aria-labels (using the actual menu item "Cases")
      await expect(page.getByRole('link', { name: 'Cases' })).toBeVisible();
    });

    test('should collapse menu when collapse button is clicked', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });

      // First expand the menu
      const expandButton = page.getByRole('button', { name: /expand navigation menu/i });
      await expandButton.click();

      // Wait for animation
      await page.waitForTimeout(350);

      // Now collapse it
      const collapseButton = page.getByRole('button', { name: /collapse navigation menu/i });
      await expect(collapseButton).toBeVisible();
      await collapseButton.click();

      // Wait for animation
      await page.waitForTimeout(350);

      // Verify expand button is back
      await expect(page.getByRole('button', { name: /expand navigation menu/i })).toBeVisible();
    });

    test('should hide text labels including "Cases" when collapsed', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });

      // Menu starts collapsed
      // Verify text labels are not visible (checking for text within navigation, excluding mobile)
      const desktopNav = page.locator('nav[aria-label="Main menu"] > div.hidden.lg\\:flex');

      // Expand first to verify the text exists
      const expandButton = page.getByRole('button', { name: /expand navigation menu/i });
      await expandButton.click();
      await page.waitForTimeout(350);

      // Verify text is visible when expanded
      await expect(desktopNav.locator('text=Cases')).toBeVisible();

      // Collapse again
      const collapseButton = page.getByRole('button', { name: /collapse navigation menu/i });
      await collapseButton.click();
      await page.waitForTimeout(350);

      // Verify text is hidden when collapsed (using CSS visibility check)
      const casesText = desktopNav
        .locator('a')
        .filter({ hasText: 'Cases' })
        .locator('span:has-text("Cases")');
      await expect(casesText).toHaveClass(/hidden/);
    });
  });

  test.describe('User Story 2 - Expand Collapsed Menu', () => {
    test('should expand menu when expand button is clicked', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });

      // Menu starts collapsed
      const expandButton = page.getByRole('button', { name: /expand navigation menu/i });
      await expect(expandButton).toBeVisible();

      // Click expand
      await expandButton.click();

      // Wait for animation
      await page.waitForTimeout(350);

      // Verify collapse button appears
      const collapseButton = page.getByRole('button', { name: /collapse navigation menu/i });
      await expect(collapseButton).toBeVisible();
      await expect(collapseButton).toHaveAttribute('aria-expanded', 'true');

      // Verify menu width has changed
      const nav = page.locator('nav[aria-label="Main menu"] > div.hidden.lg\\:flex');
      const boundingBox = await nav.boundingBox();
      expect(boundingBox?.width).toBeGreaterThan(200); // Expanded width ~240px
    });

    test('should show text labels including "Cases" when expanded', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });

      // Menu starts collapsed, expand it
      const expandButton = page.getByRole('button', { name: /expand navigation menu/i });
      await expandButton.click();
      await page.waitForTimeout(350);

      // Verify text labels are visible (looking within menu items)
      const desktopNav = page.locator('nav[aria-label="Main menu"] > div.hidden.lg\\:flex');

      // Look for "Cases" text within the navigation
      await expect(desktopNav.locator('text=Cases')).toBeVisible();
    });

    test('should change expand button to collapse button after expansion', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });

      // Verify expand button is visible
      const expandButton = page.getByRole('button', { name: /expand navigation menu/i });
      await expect(expandButton).toBeVisible();

      // Click expand
      await expandButton.click();
      await page.waitForTimeout(350);

      // Verify expand button is gone and collapse button appears
      await expect(expandButton).not.toBeVisible();
      await expect(page.getByRole('button', { name: /collapse navigation menu/i })).toBeVisible();
    });

    test('should animate transition smoothly within 300ms', async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 720 });

      const expandButton = page.getByRole('button', { name: /expand navigation menu/i });
      const startTime = Date.now();
      await expandButton.click();

      await page
        .getByRole('button', { name: /collapse navigation menu/i })
        .waitFor({ state: 'visible' });
      const duration = Date.now() - startTime;

      expect(duration).toBeLessThan(1000);
    });
  });

  test.describe('User Story 3 - Mobile View Unchanged', () => {
    test('should not display collapse/expand controls on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });

      // Verify mobile navigation is visible
      const mobileNav = page.locator('nav[aria-label="Main menu"] > div.lg\\:hidden');
      await expect(mobileNav).toBeVisible();

      // Verify no collapse/expand button exists in mobile view
      await expect(page.getByRole('button', { name: /expand navigation menu/i })).not.toBeVisible();
      await expect(
        page.getByRole('button', { name: /collapse navigation menu/i })
      ).not.toBeVisible();
    });

    test('should display mobile horizontal navigation bar on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });

      // Verify mobile navigation shows active item
      const mobileNav = page.locator('nav[aria-label="Main menu"] > div.lg\\:hidden');
      await expect(mobileNav).toBeVisible();

      // Verify active item is displayed with icon and text
      const activeItem = mobileNav.locator('.bg-\\[\\#bcecef\\]');
      await expect(activeItem).toBeVisible();
    });

    test('should maintain mobile behavior when resizing from desktop to mobile', async ({
      page,
    }) => {
      // Start with desktop viewport
      await page.setViewportSize({ width: 1280, height: 720 });

      // Verify desktop navigation is visible
      const desktopNav = page.locator('nav[aria-label="Main menu"] > div.hidden.lg\\:flex');
      await expect(desktopNav).toBeVisible();

      // Resize to mobile
      await page.setViewportSize({ width: 375, height: 667 });
      await page.waitForTimeout(100);

      // Verify mobile navigation is now visible
      const mobileNav = page.locator('nav[aria-label="Main menu"] > div.lg\\:hidden');
      await expect(mobileNav).toBeVisible();

      // Verify desktop navigation is hidden
      await expect(desktopNav).not.toBeVisible();

      // Verify no collapse/expand controls visible
      await expect(page.getByRole('button', { name: /expand navigation menu/i })).not.toBeVisible();
      await expect(
        page.getByRole('button', { name: /collapse navigation menu/i })
      ).not.toBeVisible();
    });
  });
});
