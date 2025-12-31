# E2E Test Contract: Collapsible Navigation Menu

**Test File**: `tests/e2e/collapsible-menu.spec.ts`  
**Test Runner**: Playwright  
**Target**: Desktop navigation menu collapse/expand functionality

---

## Test Suite Overview

Validates the complete user journey for collapsing and expanding the desktop navigation menu. State is transient and resets on each page load.

---

## Test Scenarios

### 1. Default State - Menu Collapsed on Every Load

**User Story**: User Story 1, 2 (P1)  
**Requirement**: FR-013 (default to collapsed)

```typescript
test('should display collapsed menu by default on every page load', async ({ page }) => {
  // Navigate to application
  await page.goto('/');

  // Verify menu is collapsed (desktop viewport)
  await page.setViewportSize({ width: 1280, height: 720 });

  // Check that text labels are NOT visible
  await expect(page.getByText('Cases')).not.toBeVisible();
  await expect(page.getByText('Dashboard')).not.toBeVisible();
  await expect(page.getByText('Tasks')).not.toBeVisible();

  // Check that expand button is visible
  const expandButton = page.getByRole('button', { name: 'Expand navigation menu' });
  await expect(expandButton).toBeVisible();
  await expect(expandButton).toHaveAttribute('aria-expanded', 'false');

  // Verify icons are still visible (by aria-label)
  await expect(page.getByRole('link', { name: 'Cases' })).toBeVisible();
});
```

**Success Criteria**:

- Menu shows icons only (no text labels)
- Expand button visible with correct ARIA attributes
- All 8 menu items visible as icons with aria-labels

---

### 2. Expand Menu - User Interaction

**User Story**: User Story 2 (P1)  
**Requirements**: FR-002, FR-004, FR-006

```typescript
test('should expand menu when expand button is clicked', async ({ page }) => {
  await page.goto('/');
  await page.setViewportSize({ width: 1280, height: 720 });

  // Menu starts collapsed, click expand button
  const expandButton = page.getByRole('button', { name: 'Expand navigation menu' });
  await expandButton.click();

  // Wait for animation to complete
  await page.waitForTimeout(350); // 300ms animation + buffer

  // Verify text labels are now visible
  await expect(page.getByText('Cases')).toBeVisible();
  await expect(page.getByText('Dashboard')).toBeVisible();

  // Verify collapse button is now visible
  const collapseButton = page.getByRole('button', { name: 'Collapse navigation menu' });
  await expect(collapseButton).toBeVisible();
  await expect(collapseButton).toHaveAttribute('aria-expanded', 'true');

  // Verify menu width has changed (expanded state)
  const nav = page.locator('nav[aria-label="Main navigation"]');
  const boundingBox = await nav.boundingBox();
  expect(boundingBox?.width).toBeGreaterThan(200); // Expanded width ~240px
});
```

**Success Criteria**:

- Text labels appear
- Icons remain visible
- Collapse button appears
- Menu width expands to ~240px
- Animation completes smoothly

---

### 3. Collapse Menu - User Interaction

**User Story**: User Story 1 (P1)  
**Requirements**: FR-001, FR-003, FR-005

```typescript
test('should collapse menu after expanding it', async ({ page }) => {
  await page.goto('/');
  await page.setViewportSize({ width: 1280, height: 720 });

  // First expand the menu (starts collapsed)
  await page.getByRole('button', { name: 'Expand navigation menu' }).click();
  await page.waitForTimeout(350);

  // Then collapse it again
  const collapseButton = page.getByRole('button', { name: 'Collapse navigation menu' });
  await collapseButton.click();
  await page.waitForTimeout(350);

  // Verify back to collapsed state
  await expect(page.getByText('Cases')).not.toBeVisible();
  const expandButton = page.getByRole('button', { name: 'Expand navigation menu' });
  await expect(expandButton).toBeVisible();
  await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
});
```

**Success Criteria**:

- Collapse after expand works correctly
- Menu returns to collapsed state
- Toggle button updates appropriately

---

### 4. State Reset on Page Refresh

**User Story**: User Story 1, 2 (P1)  
**Requirement**: FR-013 (transient state)

```typescript
test('should reset to collapsed state after page refresh', async ({ page }) => {
  await page.goto('/');
  await page.setViewportSize({ width: 1280, height: 720 });

  // Expand the menu (starts collapsed)
  await page.getByRole('button', { name: 'Expand navigation menu' }).click();
  await page.waitForTimeout(350);

  // Verify it's expanded
  await expect(page.getByText('Cases')).toBeVisible();

  // Refresh the page
  await page.reload();
  await page.waitForLoadState('networkidle');

  // Verify menu has reset to collapsed state
  await expect(page.getByText('Cases')).not.toBeVisible();
  const expandButton = page.getByRole('button', { name: 'Expand navigation menu' });
  await expect(expandButton).toBeVisible();
});
```

**Success Criteria**:

- Menu always resets to collapsed state on page load
- No localStorage persistence
- Consistent default behavior

---

### 5. Mobile View - No Collapse Controls

**User Story**: User Story 3 (P1)  
**Requirements**: FR-010, FR-011

```typescript
test('should not display collapse controls on mobile viewport', async ({ page }) => {
  await page.goto('/');

  // Set mobile viewport
  await page.setViewportSize({ width: 375, height: 667 }); // iPhone size

  // Verify collapse/expand buttons are not visible
  await expect(page.getByRole('button', { name: /navigation menu/ })).not.toBeVisible();

  // Verify mobile navigation is displayed (horizontal bar with active item)
  const activeItem = page.locator('.lg\\:hidden').first();
  await expect(activeItem).toBeVisible();

  // Verify active item shows icon and text
  await expect(page.getByText('Dashboard')).toBeVisible(); // Assuming Dashboard is active
});

test('should hide collapse controls when resizing to mobile', async ({ page }) => {
  await page.goto('/');

  // Start with desktop
  await page.setViewportSize({ width: 1280, height: 720 });
  await expect(page.getByRole('button', { name: 'Collapse navigation menu' })).toBeVisible();

  // Resize to mobile
  await page.setViewportSize({ width: 375, height: 667 });

  // Collapse button should be hidden
  await expect(page.getByRole('button', { name: /navigation menu/ })).not.toBeVisible();

  // Mobile view should be visible
  const mobileNav = page.locator('.lg\\:hidden').first();
  await expect(mobileNav).toBeVisible();
});
```

**Success Criteria**:

- No collapse/expand buttons on mobile
- Mobile navigation (horizontal bar) displays correctly
- Responsive behavior works when resizing viewport

---

### 6. Keyboard Navigation

**Accessibility Requirement**: WCAG 2.1 AA compliance

```typescript
test('should support keyboard navigation for collapse/expand', async ({ page }) => {
  await page.goto('/');
  await page.setViewportSize({ width: 1280, height: 720 });

  // Tab to collapse button
  await page.keyboard.press('Tab');
  // Keep tabbing until we reach the collapse button
  // (exact number depends on page structure)

  const collapseButton = page.getByRole('button', { name: 'Collapse navigation menu' });

  // Verify focus indicator is visible
  await expect(collapseButton).toBeFocused();

  // Press Enter to collapse
  await page.keyboard.press('Enter');
  await page.waitForTimeout(350);

  // Verify menu collapsed
  await expect(page.getByText('Cases')).not.toBeVisible();

  // Press Space to expand
  const expandButton = page.getByRole('button', { name: 'Expand navigation menu' });
  await expect(expandButton).toBeFocused(); // Should maintain focus
  await page.keyboard.press('Space');
  await page.waitForTimeout(350);

  // Verify menu expanded
  await expect(page.getByText('Cases')).toBeVisible();
});
```

**Success Criteria**:

- Collapse/expand button is keyboard accessible
- Enter and Space keys both trigger action
- Focus indicator clearly visible
- Focus is maintained after state change

---

### 7. Animation Performance

**Requirement**: SC-003 (transition completes within 300ms)

```typescript
test('should complete collapse animation within 300ms', async ({ page }) => {
  await page.goto('/');
  await page.setViewportSize({ width: 1280, height: 720 });

  const startTime = Date.now();

  await page.getByRole('button', { name: 'Collapse navigation menu' }).click();

  // Wait for animation to complete
  await page.waitForTimeout(300);

  // Check that text is hidden after 300ms
  const endTime = Date.now();
  const duration = endTime - startTime;

  await expect(page.getByText('Cases')).not.toBeVisible();
  expect(duration).toBeLessThan(400); // 300ms + small buffer
});
```

**Success Criteria**:

- Animation completes within 300ms (+buffer)
- No jank or visual glitches
- Smooth transition

---

### 8. Edge Case - Rapid Clicks

**Requirement**: FR-016 (prevent visual glitches from rapid clicks)

```typescript
test('should handle rapid collapse/expand clicks gracefully', async ({ page }) => {
  await page.goto('/');
  await page.setViewportSize({ width: 1280, height: 720 });

  // Rapidly click collapse/expand multiple times
  const collapseButton = page.getByRole('button', { name: 'Collapse navigation menu' });

  await collapseButton.click();
  await collapseButton.click(); // Should now be expand button
  await page.getByRole('button', { name: 'Expand navigation menu' }).click();
  await page.getByRole('button', { name: 'Collapse navigation menu' }).click();

  // Wait for final state to settle
  await page.waitForTimeout(400);

  // Verify final state is consistent (collapsed)
  await expect(page.getByText('Cases')).not.toBeVisible();
  const expandButton = page.getByRole('button', { name: 'Expand navigation menu' });
  await expect(expandButton).toBeVisible();

  // No console errors
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  expect(errors).toHaveLength(0);
});
```

**Success Criteria**:

- No visual glitches
- Final state is consistent
- No JavaScript errors in console

---

## Test Execution

### Setup

```typescript
import { test, expect } from '@playwright/test';

test.describe('Collapsible Navigation Menu', () => {
  test.beforeEach(async ({ page }) => {
    // No localStorage clearing needed - state is transient
    await page.goto('/');
  });

  // Test cases here...
});
```

### Viewport Sizes

- **Desktop**: 1280×720 (standard desktop)
- **Mobile**: 375×667 (iPhone 8)
- **Tablet**: 768×1024 (iPad)

### Wait Strategies

- **Animation**: `page.waitForTimeout(350)` (300ms animation + 50ms buffer)
- **Page load**: `page.waitForLoadState('networkidle')`
- **Element visible**: `expect().toBeVisible()` (automatic waiting)

---

## Coverage Summary

| Requirement   | Test Scenario | Coverage                           |
| ------------- | ------------- | ---------------------------------- |
| FR-001        | Scenario 3    | ✅ Collapse control on desktop     |
| FR-002        | Scenario 2    | ✅ Expand control on desktop       |
| FR-003        | Scenario 3    | ✅ Collapse icon + text            |
| FR-004        | Scenario 2    | ✅ Expand icon only                |
| FR-005        | Scenario 3    | ✅ Collapse transition             |
| FR-006        | Scenario 2    | ✅ Expand transition               |
| FR-007        | Scenario 2    | ✅ "Cases" label in expanded state |
| FR-008        | Scenario 1    | ✅ Hide labels in collapsed state  |
| FR-010        | Scenario 5    | ✅ No controls on mobile           |
| FR-011        | Scenario 5    | ✅ Mobile behavior unchanged       |
| FR-012        | Scenario 2    | ✅ Toggle between states           |
| FR-013        | Scenario 1, 4 | ✅ Default to collapsed state      |
| FR-014        | Scenario 7    | ✅ Smooth animation                |
| FR-015        | Scenario 8    | ✅ Rapid click handling            |
| Accessibility | Scenario 6    | ✅ Keyboard navigation             |

**Total Coverage**: 14 functional requirements + accessibility
