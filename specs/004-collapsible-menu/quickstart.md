# Quickstart Guide: Collapsible Navigation Menu

**Feature**: Collapsible Navigation Menu  
**Branch**: `004-collapsible-menu`  
**Audience**: Developers implementing this feature

---

## Overview

This guide walks you through implementing the collapsible navigation menu feature, which allows desktop users to toggle between an expanded menu (icons + text) and a collapsed menu (icons only). The state is transient and resets to collapsed on every page load.

**Estimated Time**: 3-4 hours  
**Complexity**: Medium  
**Prerequisites**: Familiarity with React, TypeScript, Tailwind CSS

---

## Architecture Summary

```
┌─────────────────────────────────────────┐
│         MenuList Component              │
│  ┌───────────────────────────────────┐  │
│  │      useState(true)               │  │
│  │   (transient state)               │  │
│  └───────────────────────────────────┘  │
│                                         │
│  • Collapse/Expand Button               │
│  • Animated Width Transition            │
│  • Conditional Text Label Rendering     │
│  • Desktop Only (lg: breakpoint)        │
└─────────────────────────────────────────┘
```

**Key Components**:

- **MenuList.tsx**: Main component (modify existing)
- **types.ts**: Type definitions (modify existing)

---

## Implementation Steps

### Step 1: Update Type Definitions

**File**: `packages/client/src/components/MenuList/types.ts`

No type changes needed - component props remain the same.

---

### Step 2: Modify the MenuList Component

**File**: `packages/client/src/components/MenuList/MenuList.tsx`

#### 2.1 Import Icons

Add the chevron icons at the top:

```typescript
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MenuListProps } from './types';
import { useState } from 'react';
```

#### 2.2 Add State Management

```typescript
export function MenuList({ items, className, onItemClick }: MenuListProps) {
  const activeItem = items.find((item) => item.isActive) || items[0];
  const [isCollapsed, setIsCollapsed] = useState(true); // Default to collapsed

  const toggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  // ... rest of component
}
```

#### 2.3 Update Desktop Navigation JSX

#### 2.3 Update Desktop Navigation JSX

Replace the existing desktop navigation div with:

```typescript
{/* Desktop: Vertical nav with collapse/expand */}
<div className={cn(
  "hidden lg:flex lg:fixed lg:left-0 lg:top-[72px] lg:bottom-0 lg:flex-col lg:py-8 lg:px-4 lg:bg-[#fbfcfc]",
  "transition-all duration-300 ease-in-out",
  isCollapsed ? "lg:w-[68px]" : "lg:w-[240px]"
)}>
  {/* Menu items */}
  <div className="flex flex-col gap-2 flex-1">
    {items.map((item) => (
      <Link
        key={item.id}
        to={item.path}
        onClick={() => onItemClick?.(item)}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bcecef] focus-visible:ring-offset-2",
          item.isActive ? 'bg-[#bcecef]' : 'hover:bg-gray-100'
        )}
        aria-current={item.isActive ? 'page' : undefined}
        aria-label={isCollapsed ? item.label : undefined}
      >
        {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
        <span className={cn(
          "transition-opacity duration-300 text-sm text-[#334041]",
          isCollapsed ? "opacity-0 hidden" : "opacity-100"
        )}>
          {item.label}
        </span>
      </Link>
    ))}
  </div>

  {/* Collapse/Expand button */}
  <button
    onClick={toggleCollapse}
    aria-label={isCollapsed ? "Expand navigation menu" : "Collapse navigation menu"}
    aria-expanded={!isCollapsed}
    aria-controls="main-navigation"
    className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-md transition-colors mt-4",
      "hover:bg-gray-100",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bcecef] focus-visible:ring-offset-2"
    )}
  >
    {isCollapsed ? (
      <ChevronRight className="h-4 w-4" />
    ) : (
      <>
        <ChevronLeft className="h-4 w-4" />
        <span className="text-sm text-[#334041]">Collapse</span>
      </>
    )}
  </button>
</div>
```

#### 2.4 Add Navigation ID

Update the `<nav>` tag to include the ID referenced by aria-controls:

```typescript
<nav
  id="main-navigation"
  className={`bg-[#fbfcfc] ${className || ''}`}
  aria-label="Main menu"
>
```

**Mobile navigation remains unchanged** - no modifications needed.

---

### Step 3: Create Storybook Stories

**File**: `packages/client/src/components/MenuList/MenuList.stories.tsx`

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { MenuList } from './MenuList';
import { Gauge, Folder, ListTodo, Calendar, Users, FileText, BarChart, Settings } from 'lucide-react';
import { BrowserRouter } from 'react-router-dom';

const meta: Meta<typeof MenuList> = {
  title: 'Components/MenuList',
  component: MenuList,
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof MenuList>;

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', path: '/', icon: <Gauge />, isActive: true },
  { id: 'cases', label: 'Cases', path: '/cases', icon: <Folder /> },
  { id: 'tasks', label: 'Tasks', path: '/tasks', icon: <ListTodo /> },
  { id: 'calendar', label: 'Calendar', path: '/calendar', icon: <Calendar /> },
  { id: 'clients', label: 'Clients', path: '/clients', icon: <Users /> },
  { id: 'documents', label: 'Documents', path: '/documents', icon: <FileText /> },
  { id: 'reports', label: 'Reports', path: '/reports', icon: <BarChart /> },
  { id: 'settings', label: 'Settings', path: '/settings', icon: <Settings /> },
];

export const DesktopExpanded: Story = {
  args: {
    items: menuItems,
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};

export const DesktopCollapsed: Story = {
  args: {
    items: menuItems,
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
  play: async ({ canvasElement }) => {
    // Simulate collapsed state by clicking collapse button
    const button = canvasElement.querySelector('button[aria-label*="Collapse"]');
    button?.click();
  },
};

export const Mobile: Story = {
  args: {
    items: menuItems,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};
```

---

### Step 5: Write Component Tests

**File**: `packages/client/src/components/MenuList/MenuList.test.tsx`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MenuList } from './MenuList';
import { Gauge, Folder } from 'lucide-react';

const mockItems = [
  { id: '1', label: 'Dashboard', path: '/', icon: <Gauge />, isActive: true },
  { id: '2', label: 'Cases', path: '/cases', icon: <Folder /> },
];

const renderMenuList = () => {
  return render(
    <BrowserRouter>
      <MenuList items={mockItems} />
    </BrowserRouter>
  );
};

describe('MenuList', () => {
  beforeEach(() => {
    // Set viewport to desktop size for tests
    window.innerWidth = 1280;
  });

  it('renders in collapsed state by default', () => {
    renderMenuList();
    // Text should be hidden on initial render
    const casesText = screen.queryByText('Cases');
    expect(casesText).toHaveClass('hidden');
  });

  it('shows expand button in collapsed state', () => {
    renderMenuList();
    const expandButton = screen.getByLabelText('Expand navigation menu');
    expect(expandButton).toBeInTheDocument();
    expect(expandButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('expands menu when expand button is clicked', () => {
    renderMenuList();

    const expandButton = screen.getByLabelText('Expand navigation menu');
    fireEvent.click(expandButton);

    // Text labels should now be visible
    const casesText = screen.queryByText('Cases');
    expect(casesText).not.toHaveClass('hidden');
  });

  it('collapses menu when collapse button is clicked', () => {
    renderMenuList();

    // First expand
    fireEvent.click(screen.getByLabelText('Expand navigation menu'));

    // Then collapse
    const collapseButton = screen.getByLabelText('Collapse navigation menu');
    fireEvent.click(collapseButton);

    // Text labels should be hidden again
    const casesText = screen.queryByText('Cases');
    expect(casesText).toHaveClass('hidden');
  });

  it('toggles between collapsed and expanded states', () => {
    renderMenuList();

    const expandButton = screen.getByLabelText('Expand navigation menu');
    fireEvent.click(expandButton);

    expect(screen.getByText('Cases')).not.toHaveClass('hidden');
    expect(screen.getByLabelText('Collapse navigation menu')).toBeInTheDocument();
  });

  it('displays proper aria attributes', () => {
    renderMenuList();

    const expandButton = screen.getByLabelText('Expand navigation menu');
    expect(expandButton).toHaveAttribute('aria-expanded', 'false');
    expect(expandButton).toHaveAttribute('aria-controls', 'main-navigation');
  });
});
```

Run tests:

```bash
npm run test:client
```

---

### Step 5: Write E2E Tests

**File**: `tests/e2e/collapsible-menu.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Collapsible Navigation Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display collapsed menu by default', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    await expect(page.getByText('Cases')).not.toBeVisible();
    await expect(page.getByRole('button', { name: 'Expand navigation menu' })).toBeVisible();
  });

  test('should expand menu when button is clicked', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    await page.getByRole('button', { name: 'Expand navigation menu' }).click();
    await page.waitForTimeout(350);

    await expect(page.getByText('Cases')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Collapse navigation menu' })).toBeVisible();
  });

  test('should reset to collapsed state after refresh', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });

    // Expand the menu
    await page.getByRole('button', { name: 'Expand navigation menu' }).click();
    await page.waitForTimeout(350);

    // Refresh
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Should be back to collapsed
    await expect(page.getByRole('button', { name: 'Expand navigation menu' })).toBeVisible();
    await expect(page.getByText('Cases')).not.toBeVisible();
  });

  test('should not show collapse controls on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    await expect(page.getByRole('button', { name: /navigation menu/ })).not.toBeVisible();
  });
});
```

Run E2E tests:

```bash
npm run test:e2e
```

---

## Testing Checklist

Before submitting PR, verify:

- [ ] Component tests pass (`npm run test:client`)
- [ ] E2E tests pass (`npm run test:e2e`)
- [ ] Storybook builds (`npm run build-storybook`)
- [ ] Desktop: Collapse/expand works smoothly
- [ ] Desktop: State resets to collapsed on every page load
- [ ] Mobile: No collapse controls visible
- [ ] Mobile: Existing navigation unchanged
- [ ] Keyboard: Tab + Enter/Space works
- [ ] Screen reader: ARIA labels correct
- [ ] Animation: Smooth <300ms transition
- [ ] No TypeScript errors
- [ ] ESLint passes

---

## Troubleshooting

### Issue: Text labels not hiding in collapsed state

**Solution**: Ensure both `opacity-0` and `hidden` classes are applied:

```typescript
className={cn(
  "transition-opacity duration-300",
  isCollapsed ? "opacity-0 hidden" : "opacity-100"
)}
```

### Issue: State not resetting on page load

**Check**:

1. useState is initialized with `true` (collapsed)
2. No useEffect or localStorage code interfering
3. Component properly unmounts and remounts on navigation

### Issue: Mobile view showing collapse button

**Solution**: Verify Tailwind breakpoint classes:

```typescript
className = 'hidden lg:flex'; // Desktop only
className = 'lg:hidden'; // Mobile only
```

### Issue: Animation feels janky

**Optimization**:

1. Use `transition-all` instead of specific properties
2. Ensure `duration-300 ease-in-out` is applied
3. Test on slower devices

---

## File Structure After Implementation

```
packages/client/src/components/MenuList/
├── MenuList.tsx              # [MODIFIED] Main component with collapse logic
├── MenuList.stories.tsx      # [NEW] Storybook stories
├── MenuList.test.tsx         # [NEW] Component tests
└── types.ts                  # [UNCHANGED] Existing types

tests/e2e/
└── collapsible-menu.spec.ts  # [NEW] E2E tests
```

---

## Next Steps

1. **Code Review**: Submit PR with test results
2. **QA Testing**: Manual testing on various devices
3. **Accessibility Audit**: Verify WCAG 2.1 AA compliance
4. **Performance Testing**: Check animation on lower-end devices
5. **Documentation**: Update component usage docs if needed

---

## Estimated Timeline

| Task                    | Time        |
| ----------------------- | ----------- |
| Step 1: Types Review    | 5 min       |
| Step 2: Modify MenuList | 1.5 hours   |
| Step 3: Storybook       | 30 min      |
| Step 4: Component Tests | 1 hour      |
| Step 5: E2E Tests       | 45 min      |
| Testing & Refinement    | 30 min      |
| **Total**               | **4 hours** |

---

## References

- **Spec**: [spec.md](./spec.md)
- **Data Model**: [data-model.md](./data-model.md)
- **Contracts**: [contracts/](./contracts/)
- **Research**: [research.md](./research.md)
- **Tailwind Transitions**: https://tailwindcss.com/docs/transition-property
- **ARIA Best Practices**: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
