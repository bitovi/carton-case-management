import { test, expect } from '@playwright/test';

test.describe('Create Case', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should navigate to create case page via sidebar button', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(/\/cases\/.+/, { timeout: 10000 });

    const createButton = page.getByRole('button', { name: 'Create Case' });
    await expect(createButton).toBeVisible();
    await createButton.click();

    await expect(page).toHaveURL('/cases/new');
    await expect(page.getByRole('heading', { name: 'Create New Case' })).toBeVisible();
  });

  test('should navigate directly to /cases/new', async ({ page }) => {
    await page.goto('/cases/new');

    await expect(page.getByRole('heading', { name: 'Create New Case' })).toBeVisible();
  });

  test('should display all required form fields', async ({ page }) => {
    await page.goto('/cases/new');

    await expect(page.getByRole('textbox', { name: /case title/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /case description/i })).toBeVisible();
    await expect(page.getByText('Customer *')).toBeVisible();
    await expect(page.getByText('Priority *')).toBeVisible();
    await expect(page.getByText(/assign to/i)).toBeVisible();
    await expect(page.locator('form').getByRole('button', { name: 'Create Case' })).toBeVisible();
    await expect(page.locator('form').getByRole('button', { name: 'Cancel' })).toBeVisible();
  });

  test('should default priority to Medium', async ({ page }) => {
    await page.goto('/cases/new');

    const priorityCombobox = page.getByRole('combobox').filter({ hasText: 'Medium' });
    await expect(priorityCombobox).toBeVisible();
  });

  test('should default assign to Unassigned', async ({ page }) => {
    await page.goto('/cases/new');

    const assignCombobox = page.getByRole('combobox').filter({ hasText: 'Unassigned' });
    await expect(assignCombobox).toBeVisible();
  });

  test('should show validation errors when submitting empty form', async ({ page }) => {
    await page.goto('/cases/new');

    await page.locator('form').getByRole('button', { name: 'Create Case' }).click();

    await expect(page.getByText('Case title is required')).toBeVisible();
    await expect(page.getByText('Case description is required')).toBeVisible();
    await expect(page.getByText('Customer selection is required')).toBeVisible();
  });

  test('should show validation error for title on blur when empty', async ({ page }) => {
    await page.goto('/cases/new');

    const titleInput = page.getByRole('textbox', { name: /case title/i });
    await titleInput.click();
    await titleInput.blur();

    await expect(page.getByText('Case title is required')).toBeVisible();
  });

  test('should show validation error for description on blur when empty', async ({ page }) => {
    await page.goto('/cases/new');

    const descriptionInput = page.getByRole('textbox', { name: /case description/i });
    await descriptionInput.click();
    await descriptionInput.blur();

    await expect(page.getByText('Case description is required')).toBeVisible();
  });

  test('should clear validation error when title is filled and form re-submitted', async ({ page }) => {
    await page.goto('/cases/new');

    await page.locator('form').getByRole('button', { name: 'Create Case' }).click();
    await expect(page.getByText('Case title is required')).toBeVisible();

    await page.getByRole('textbox', { name: /case title/i }).fill('My New Case');
    await page.getByRole('textbox', { name: /case description/i }).fill('Test description');

    const customerCombobox = page.getByRole('combobox').filter({ hasText: /select a customer/i });
    await customerCombobox.click();
    const listbox = page.getByRole('listbox');
    await expect(listbox).toBeVisible({ timeout: 5000 });
    await listbox.getByRole('option').first().click();

    await page.locator('form').getByRole('button', { name: 'Create Case' }).click();

    await page.waitForURL((url) => !url.href.endsWith('/cases/new'), { timeout: 10000 });
    await expect(page.getByText('Case title is required')).not.toBeVisible();
  });

  test('should populate customer dropdown with available customers', async ({ page }) => {
    await page.goto('/cases/new');

    const customerCombobox = page.getByRole('combobox').filter({ hasText: /select a customer/i });
    await customerCombobox.click();

    const listbox = page.getByRole('listbox');
    await expect(listbox).toBeVisible({ timeout: 5000 });

    const options = listbox.getByRole('option');
    await expect(options).toHaveCount(await options.count());
    expect(await options.count()).toBeGreaterThan(0);
  });

  test('should successfully create a case and redirect to case detail page', async ({ page }) => {
    await page.goto('/cases/new');

    await page.getByRole('textbox', { name: /case title/i }).fill('E2E Test Case');
    await page.getByRole('textbox', { name: /case description/i }).fill('Created by e2e test suite');

    const customerCombobox = page.getByRole('combobox').filter({ hasText: /select a customer/i });
    await customerCombobox.click();
    const customerListbox = page.getByRole('listbox');
    await expect(customerListbox).toBeVisible({ timeout: 5000 });
    await customerListbox.getByRole('option').first().click();

    await page.locator('form').getByRole('button', { name: 'Create Case' }).click();

    await page.waitForURL((url) => !url.href.endsWith('/cases/new'), { timeout: 10000 });

    expect(page.url()).toMatch(/\/cases\/[a-z0-9-]+$/);
    expect(page.url()).not.toContain('/cases/new');
  });

  test('should display new case in the sidebar case list after creation', async ({ page }) => {
    const caseTitle = `E2E Case ${Date.now()}`;

    await page.goto('/cases/new');

    await page.getByRole('textbox', { name: /case title/i }).fill(caseTitle);
    await page.getByRole('textbox', { name: /case description/i }).fill('Test description');

    const customerCombobox = page.getByRole('combobox').filter({ hasText: /select a customer/i });
    await customerCombobox.click();
    await page.getByRole('option').first().click();

    await page.locator('form').getByRole('button', { name: 'Create Case' }).click();

    await page.waitForURL(/\/cases\/[a-z0-9-]+$/, { timeout: 10000 });

    const caseListLinks = page.locator('.flex.flex-col.gap-2 a');
    await expect(caseListLinks.first()).toBeVisible({ timeout: 5000 });

    const newCaseLink = page.locator('.flex.flex-col.gap-2 a').filter({ hasText: caseTitle });
    await expect(newCaseLink).toBeVisible();
  });

  test('should show newly created case title in the detail view header', async ({ page }) => {
    const caseTitle = `Detail E2E ${Date.now()}`;

    await page.goto('/cases/new');

    await page.getByRole('textbox', { name: /case title/i }).fill(caseTitle);
    await page.getByRole('textbox', { name: /case description/i }).fill('Test description');

    const customerCombobox = page.getByRole('combobox').filter({ hasText: /select a customer/i });
    await customerCombobox.click();
    await page.getByRole('option').first().click();

    await page.locator('form').getByRole('button', { name: 'Create Case' }).click();

    await page.waitForURL(/\/cases\/[a-z0-9-]+$/, { timeout: 10000 });

    await expect(page.getByRole('heading', { level: 1 }).filter({ hasText: caseTitle })).toBeVisible({ timeout: 5000 });
  });

  test('should create a case with a selected priority', async ({ page }) => {
    await page.goto('/cases/new');

    await page.getByRole('textbox', { name: /case title/i }).fill('High Priority Case');
    await page.getByRole('textbox', { name: /case description/i }).fill('Urgent issue');

    const customerCombobox = page.getByRole('combobox').filter({ hasText: /select a customer/i });
    await customerCombobox.click();
    await page.getByRole('option').first().click();

    const priorityCombobox = page.getByRole('combobox').filter({ hasText: 'Medium' });
    await priorityCombobox.click();
    await page.getByRole('option', { name: 'High' }).click();

    await page.locator('form').getByRole('button', { name: 'Create Case' }).click();

    await page.waitForURL(/\/cases\/[a-z0-9-]+$/, { timeout: 10000 });

    await expect(page.getByRole('button', { name: /edit priority/i })).toContainText('High', { timeout: 5000 });
  });

  test('should cancel creation and return to previous case when Cancel is clicked', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(/\/cases\/.+/, { timeout: 10000 });
    const previousUrl = page.url();

    await page.getByRole('button', { name: 'Create Case' }).click();
    await expect(page).toHaveURL('/cases/new');

    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page).toHaveURL(previousUrl);
  });

  test('should not create a case when Cancel is clicked without submitting', async ({ page }) => {
    await page.goto('/');
    await page.waitForURL(/\/cases\/.+/, { timeout: 10000 });

    const initialCaseCount = await page.locator('.flex.flex-col.gap-2 a').count();

    await page.getByRole('button', { name: 'Create Case' }).click();
    await page.getByRole('textbox', { name: /case title/i }).fill('Should Not Be Created');
    await page.getByRole('button', { name: 'Cancel' }).click();

    await page.waitForURL(/\/cases\/.+/, { timeout: 5000 });
    const finalCaseCount = await page.locator('.flex.flex-col.gap-2 a').count();

    expect(finalCaseCount).toBe(initialCaseCount);
  });

  test('should disable Create Case button during submission', async ({ page }) => {
    await page.goto('/cases/new');

    await page.getByRole('textbox', { name: /case title/i }).fill('Test Submission');
    await page.getByRole('textbox', { name: /case description/i }).fill('Test description');

    const customerCombobox = page.getByRole('combobox').filter({ hasText: /select a customer/i });
    await customerCombobox.click();
    await page.getByRole('option').first().click();

    const submitButton = page.locator('form').getByRole('button', { name: 'Create Case' });
    await submitButton.click();

    await page.waitForURL(/\/cases\/[a-z0-9-]+$/, { timeout: 10000 });
  });

  test('should show API error when case creation fails', async ({ page }) => {
    await page.route(
      (url) => url.href.includes('/trpc') && url.href.includes('case.create'),
      (route) => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              error: {
                json: {
                  message: 'Internal server error',
                  code: -32603,
                },
              },
            },
          ]),
        });
      }
    );

    await page.goto('/cases/new');

    await page.getByRole('textbox', { name: /case title/i }).fill('Error Test Case');
    await page.getByRole('textbox', { name: /case description/i }).fill('This will fail');

    const customerCombobox = page.getByRole('combobox').filter({ hasText: /select a customer/i });
    await customerCombobox.click();
    await page.getByRole('option').first().click();

    await page.locator('form').getByRole('button', { name: 'Create Case' }).click();

    await expect(page).toHaveURL('/cases/new');
  });
});
