import { test, expect } from '@playwright/test';

test.describe('Toast Messages', () => {
  test('should show success toast when creating a new case', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Navigate to create case page
    await page.goto('/cases/');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    // Click "Create New Case" button or navigate directly
    await page.goto('/cases/new');
    
    // Wait for the form to load
    await expect(page.getByRole('heading', { name: /create new case/i })).toBeVisible();
    
    // Fill out the form
    await page.getByLabel(/case title/i).fill('Test Case for Toast');
    await page.getByLabel(/case description/i).fill('This is a test case to verify toast messages');
    
    // Select a customer
    await page.getByRole('combobox', { name: /customer/i }).click();
    const firstCustomer = page.getByRole('option').first();
    await firstCustomer.click();
    
    // Submit the form
    await page.getByRole('button', { name: /create case/i }).click();
    
    // Wait for the toast to appear
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Success!')).toBeVisible();
    await expect(page.getByText('A new claim has been created.')).toBeVisible();
    
    // Take a screenshot of the success toast
    await page.screenshot({ path: 'toast-success-create-case.png' });
    
    // Verify dismiss button exists
    await expect(page.getByRole('button', { name: /dismiss/i })).toBeVisible();
  });

  test('should show deleted toast when deleting a case', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Navigate to a case
    await page.goto('/');
    await page.waitForURL(/\/cases\/.+/, { timeout: 10000 });
    
    // Wait for case to load
    await expect(page.getByText('Loading case details...')).not.toBeVisible({ timeout: 15000 });
    
    // Get the case title before deletion
    const caseTitle = await page.getByRole('heading', { level: 1 }).first().textContent();
    
    // Click more options menu
    await page.getByRole('button', { name: /more options/i }).click();
    
    // Click delete
    await page.getByRole('menuitem', { name: /delete case/i }).click();
    
    // Confirm deletion in dialog
    await expect(page.getByText(/are you sure/i)).toBeVisible();
    await page.getByRole('button', { name: /^delete$/i }).click();
    
    // Wait for the toast to appear
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Deleted')).toBeVisible();
    await expect(page.getByText(/successfully deleted/i)).toBeVisible();
    
    // Take a screenshot of the deleted toast
    await page.screenshot({ path: 'toast-deleted-case.png' });
    
    // Verify dismiss button exists
    await expect(page.getByRole('button', { name: /dismiss/i })).toBeVisible();
  });

  test('should auto-dismiss toast after 10 seconds', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Navigate to create case page and create a case
    await page.goto('/cases/new');
    await expect(page.getByRole('heading', { name: /create new case/i })).toBeVisible();
    
    await page.getByLabel(/case title/i).fill('Auto-dismiss Test');
    await page.getByLabel(/case description/i).fill('Testing auto-dismiss');
    
    await page.getByRole('combobox', { name: /customer/i }).click();
    await page.getByRole('option').first().click();
    
    await page.getByRole('button', { name: /create case/i }).click();
    
    // Verify toast appears
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Success!')).toBeVisible();
    
    // Wait for auto-dismiss (10 seconds + 1 second buffer)
    await page.waitForTimeout(11000);
    
    // Verify toast is gone
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByText('Success!')).not.toBeVisible();
  });

  test('should dismiss toast when clicking dismiss button', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Navigate to create case page and create a case
    await page.goto('/cases/new');
    await expect(page.getByRole('heading', { name: /create new case/i })).toBeVisible();
    
    await page.getByLabel(/case title/i).fill('Manual Dismiss Test');
    await page.getByLabel(/case description/i).fill('Testing manual dismiss');
    
    await page.getByRole('combobox', { name: /customer/i }).click();
    await page.getByRole('option').first().click();
    
    await page.getByRole('button', { name: /create case/i }).click();
    
    // Verify toast appears
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
    
    // Click dismiss button
    await page.getByRole('button', { name: /dismiss/i }).click();
    
    // Verify toast is gone
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('should dismiss toast when clicking backdrop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Navigate to create case page and create a case
    await page.goto('/cases/new');
    await expect(page.getByRole('heading', { name: /create new case/i })).toBeVisible();
    
    await page.getByLabel(/case title/i).fill('Backdrop Dismiss Test');
    await page.getByLabel(/case description/i).fill('Testing backdrop dismiss');
    
    await page.getByRole('combobox', { name: /customer/i }).click();
    await page.getByRole('option').first().click();
    
    await page.getByRole('button', { name: /create case/i }).click();
    
    // Verify toast appears
    await expect(page.getByRole('dialog')).toBeVisible({ timeout: 5000 });
    
    // Click backdrop (outside the toast)
    await page.locator('.fixed.inset-0.bg-black\\/50').click({ position: { x: 10, y: 10 } });
    
    // Verify toast is gone
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });
});
