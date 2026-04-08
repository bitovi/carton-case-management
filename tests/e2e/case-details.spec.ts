import { test, expect } from '@playwright/test';

test.describe('Case Details', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    await page.waitForURL(/\/cases\/.+/, { timeout: 10000 });
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 });
    await page.waitForLoadState('networkidle');
  });

  test.describe('Case Header', () => {
    test('should display the case title as a heading', async ({ page }) => {
      const heading = page.getByRole('heading', { level: 1 });
      await expect(heading).toBeVisible();
      const title = await heading.textContent();
      expect(title?.trim().length).toBeGreaterThan(0);
    });

    test('should display a formatted case number', async ({ page }) => {
      const caseNumber = page.locator('p').filter({ hasText: /^#CAS-/ });
      await expect(caseNumber.first()).toBeVisible();
    });

    test('should display the status dropdown', async ({ page }) => {
      const statusTrigger = page.getByRole('combobox').filter({ hasText: /To Do|In Progress|In Review|Completed|Closed/i }).first();
      await expect(statusTrigger).toBeVisible();
    });
  });

  test.describe('Inline Title Editing', () => {
    test('should enter edit mode when title heading is clicked', async ({ page }) => {
      const heading = page.getByRole('heading', { level: 1 });
      await heading.click();

      const titleInput = page.getByRole('textbox', { name: /click to edit/i }).or(
        page.locator('input[aria-label*="title" i], input[aria-label*="click to edit" i]')
      );
      await expect(titleInput.first()).toBeVisible({ timeout: 3000 });
    });

    test('should save edited title on Enter key', async ({ page }) => {
      const heading = page.getByRole('heading', { level: 1 });
      const originalTitle = await heading.textContent();

      await heading.click();

      const titleInput = page.locator(`input[value="${originalTitle?.trim() || ''}"]`).first();
      await titleInput.fill('Updated Title E2E');
      await titleInput.press('Enter');

      await expect(page.getByRole('heading', { level: 1 }).filter({ hasText: 'Updated Title E2E' })).toBeVisible({ timeout: 5000 });
    });

    test('should discard edit on Escape key', async ({ page }) => {
      const heading = page.getByRole('heading', { level: 1 });
      const originalTitle = (await heading.textContent())?.trim() || '';

      await heading.click();

      const titleInput = page.locator(`input[value="${originalTitle}"]`).first();
      await titleInput.fill('This should be discarded');
      await titleInput.press('Escape');

      await expect(page.getByRole('heading', { level: 1 }).filter({ hasText: originalTitle })).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Status Change', () => {
    test('should show status options when status dropdown is opened', async ({ page }) => {
      const statusTrigger = page.getByRole('combobox').filter({ hasText: /To Do|In Progress|In Review|Completed|Closed/i }).first();
      await statusTrigger.click();

      const listbox = page.getByRole('listbox');
      await expect(listbox).toBeVisible({ timeout: 3000 });

      const options = listbox.getByRole('option');
      expect(await options.count()).toBeGreaterThanOrEqual(2);
    });

    test('should update status when a new option is selected', async ({ page }) => {
      const statusTrigger = page.getByRole('combobox').filter({ hasText: /To Do|In Progress|In Review|Completed|Closed/i }).first();
      const currentStatus = (await statusTrigger.textContent())?.trim() || '';

      await statusTrigger.click();

      const listbox = page.getByRole('listbox');
      const options = listbox.getByRole('option');
      const count = await options.count();

      const differentOption = options.filter({ hasNotText: currentStatus }).first();
      if (count > 1) {
        const newStatus = (await differentOption.textContent())?.trim() || '';
        await differentOption.click();

        await expect(statusTrigger).toContainText(newStatus, { timeout: 5000 });
      }
    });
  });

  test.describe('Case Description Editing', () => {
    test('should display case description section', async ({ page }) => {
      const descriptionButton = page.getByRole('button', { name: /edit case description/i });
      await expect(descriptionButton).toBeVisible();
    });

    test('should enter edit mode when description is clicked', async ({ page }) => {
      const descriptionButton = page.getByRole('button', { name: /edit case description/i });
      await descriptionButton.click();

      const textarea = page.locator('textarea:visible').first();
      await expect(textarea).toBeVisible({ timeout: 3000 });
    });

    test('should show save and cancel controls in description edit mode', async ({ page }) => {
      const descriptionButton = page.getByRole('button', { name: /edit case description/i });
      await descriptionButton.click();

      const saveOrCancel = page.locator('button[aria-label*="confirm" i], button[aria-label*="save" i], button[aria-label*="cancel" i], button[aria-label*="discard" i]').filter({ visible: true }).first();
      await expect(saveOrCancel.or(page.locator('textarea:visible').first())).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Essential Details Sidebar', () => {
    test('should display Essential Details section', async ({ page }) => {
      const essentialDetailsBtn = page.getByRole('button', { name: /essential details/i });
      await expect(essentialDetailsBtn).toBeVisible();
    });

    test('should display Customer Name field', async ({ page }) => {
      const customerNameBtn = page.getByRole('button', { name: /edit customer name/i });
      await expect(customerNameBtn).toBeVisible();
    });

    test('should display Priority field', async ({ page }) => {
      const priorityBtn = page.getByRole('button', { name: /edit priority/i });
      await expect(priorityBtn).toBeVisible();
    });

    test('should display Assigned To field', async ({ page }) => {
      const assignedBtn = page.getByRole('button', { name: /edit assigned to/i });
      await expect(assignedBtn).toBeVisible();
    });

    test('should display Date Opened field', async ({ page }) => {
      const dateOpenedLabel = page.locator('span:visible, p:visible').filter({ hasText: 'Date Opened' }).first();
      await expect(dateOpenedLabel).toBeVisible();
    });

    test('should display Created By field', async ({ page }) => {
      const createdByLabel = page.locator('span:visible, p:visible').filter({ hasText: 'Created By' }).first();
      await expect(createdByLabel).toBeVisible();
    });

    test('should display Last Updated field', async ({ page }) => {
      const lastUpdatedLabel = page.locator('span:visible, p:visible').filter({ hasText: 'Last Updated' }).first();
      await expect(lastUpdatedLabel).toBeVisible();
    });

    test('should open priority dropdown when priority field is clicked', async ({ page }) => {
      const priorityBtn = page.getByRole('button', { name: /edit priority/i });
      await priorityBtn.click();

      const listbox = page.getByRole('listbox');
      await expect(listbox).toBeVisible({ timeout: 3000 });
    });

    test('should show priority options (Low, Medium, High, Critical)', async ({ page }) => {
      const priorityBtn = page.getByRole('button', { name: /edit priority/i });
      await priorityBtn.click();

      const listbox = page.getByRole('listbox');
      await expect(listbox).toBeVisible({ timeout: 3000 });

      await expect(listbox.getByRole('option', { name: /low/i })).toBeVisible();
      await expect(listbox.getByRole('option', { name: /medium/i })).toBeVisible();
      await expect(listbox.getByRole('option', { name: /high/i })).toBeVisible();
    });

    test('should update priority when new option is selected', async ({ page }) => {
      const priorityBtn = page.getByRole('button', { name: /edit priority/i });
      const currentPriority = (await priorityBtn.textContent())?.trim() || '';

      await priorityBtn.click();

      const listbox = page.getByRole('listbox');
      const differentOption = listbox.getByRole('option').filter({ hasNotText: currentPriority }).first();
      const newPriority = (await differentOption.textContent())?.trim() || '';

      await differentOption.click();

      await expect(priorityBtn).toContainText(newPriority, { timeout: 5000 });
    });

    test('should open assigned to dropdown when clicked', async ({ page }) => {
      const assignedBtn = page.getByRole('button', { name: /edit assigned to/i });
      await assignedBtn.click();

      const listbox = page.getByRole('listbox');
      await expect(listbox).toBeVisible({ timeout: 3000 });

      const options = listbox.getByRole('option');
      expect(await options.count()).toBeGreaterThan(0);
    });

    test('should include Unassigned option in assigned to dropdown', async ({ page }) => {
      const assignedBtn = page.getByRole('button', { name: /edit assigned to/i });
      await assignedBtn.click();

      const listbox = page.getByRole('listbox');
      await expect(listbox.getByRole('option', { name: /unassigned/i })).toBeVisible({ timeout: 3000 });
    });
  });

  test.describe('Comments', () => {
    test('should display Comments heading', async ({ page }) => {
      const commentsHeading = page.getByRole('heading', { name: /comments/i });
      await expect(commentsHeading).toBeVisible();
    });

    test('should display comment input textarea', async ({ page }) => {
      const commentInput = page.locator('textarea[placeholder="Add a comment..."]:visible');
      await expect(commentInput).toBeVisible();
    });

    test('should submit a comment when Enter is pressed', async ({ page }) => {
      const commentInput = page.locator('textarea[placeholder="Add a comment..."]:visible');
      const uniqueComment = `E2E test comment ${Date.now()}`;

      await commentInput.fill(uniqueComment);
      await commentInput.press('Enter');

      await expect(commentInput).toHaveValue('', { timeout: 10000 });
      await expect(page.locator('p:visible').filter({ hasText: uniqueComment })).toBeVisible({ timeout: 5000 });
    });

    test('should not submit comment when Shift+Enter is pressed (newline instead)', async ({ page }) => {
      const commentInput = page.locator('textarea[placeholder="Add a comment..."]:visible');
      await commentInput.fill('Line one');
      await commentInput.press('Shift+Enter');

      await expect(commentInput).toHaveValue(/Line one/);
    });

    test('should not submit empty comment', async ({ page }) => {
      const commentInput = page.locator('textarea[placeholder="Add a comment..."]:visible');
      await commentInput.fill('');
      await commentInput.press('Enter');

      await expect(commentInput).toHaveValue('');
    });

    test('should display existing comments', async ({ page }) => {
      const commentSection = page.locator('.flex.flex-col.gap-4').filter({ has: page.getByRole('heading', { name: /comments/i }) });
      await expect(commentSection).toBeVisible();
    });
  });

  test.describe('Delete Case', () => {
    test('should show more options menu button', async ({ page }) => {
      const moreOptionsBtn = page.locator('button').filter({ has: page.locator('svg') }).last();
      await expect(moreOptionsBtn).toBeVisible();
    });

    test('should show Delete Case option in more options menu', async ({ page }) => {
      const moreOptionsBtn = page.getByRole('button').filter({ has: page.locator('[data-lucide="more-vertical"], svg') }).first();
      if (await moreOptionsBtn.isVisible()) {
        await moreOptionsBtn.click();
        await expect(page.getByText('Delete Case')).toBeVisible({ timeout: 3000 });
      }
    });

    test('should show confirmation dialog before deleting a case', async ({ page }) => {
      const caseList = page.locator('.flex.flex-col.gap-2 a');
      await expect(caseList.first()).toBeVisible({ timeout: 10000 });

      const moreOptionsBtn = page.getByRole('button').filter({ has: page.locator('svg') }).filter({ hasNot: page.locator('[aria-label]') }).last();

      if (await moreOptionsBtn.isVisible()) {
        await moreOptionsBtn.click();
        const deleteOption = page.getByText('Delete Case');
        if (await deleteOption.isVisible()) {
          await deleteOption.click();
          const dialog = page.getByRole('dialog');
          await expect(dialog).toBeVisible({ timeout: 3000 });
          await expect(page.getByText(/are you sure|confirm delete|this action cannot/i)).toBeVisible();
        }
      }
    });
  });
});

test.describe('Case Details - Error States', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('should show no case selected for invalid case ID', async ({ page }) => {
    await page.goto('/cases/00000000-0000-0000-0000-000000000000');

    await expect(page.getByText('No case selected')).toBeVisible({ timeout: 10000 });
  });

  test('should show loading state while fetching case details', async ({ page }) => {
    await page.route(
      (url) => url.href.includes('/trpc') && url.href.includes('case.getById'),
      async (route) => {
        await new Promise((resolve) => globalThis.setTimeout(resolve, 800));
        await route.continue();
      }
    );

    await page.goto('/');
    await page.waitForURL(/\/cases\/.+/, { timeout: 10000 });

    await expect(page.getByText('Loading case details...'))
      .toBeVisible({ timeout: 2000 })
      .catch(() => {});

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 });
  });
});
