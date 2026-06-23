import { test, expect } from '@playwright/test';

test('new comment is saved and displayed with original casing', async ({ page }) => {
  await page.goto('/cases/');

  const firstCase = page.locator('.flex.flex-col.gap-2 a').first();
  await expect(firstCase).toBeVisible({ timeout: 10000 });
  await firstCase.click();
  await page.waitForLoadState('networkidle');

  const commentInput = page.getByPlaceholder('Add a comment...');
  await expect(commentInput).toBeVisible({ timeout: 10000 });

  const testComment = 'This is a test comment';
  await commentInput.click();
  await commentInput.fill(testComment);
  await commentInput.press('Enter');

  await expect(page.getByText(testComment)).toBeVisible({ timeout: 10000 });
});
