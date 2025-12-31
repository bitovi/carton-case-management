# Quickstart: Responsive Header and Menu Components

**Feature**: 002-header-menu-components  
**Estimated Time**: 4-6 hours  
**Prerequisites**: Node.js 18+, npm, devcontainer running

## Overview

This guide walks through implementing responsive Header and MenuList navigation components for the Carton Case Management application, following TDD principles and the project's constitution.

## Step-by-Step Implementation

### Phase 1: Setup and Assets (15 minutes)

1. **Create component directory structure**

```bash
mkdir -p packages/client/src/components/layout
mkdir -p packages/client/src/assets
```

2. **Create logo SVG file**

```bash
# Create packages/client/src/assets/logo.svg or inline in component
# SVG code provided in spec (34x34px Carton logo)
```

3. **Add CSS variables for colors**

Edit `packages/client/src/index.css`:

```css
:root {
  /* Existing variables... */

  /* Header and menu colors */
  --header-bg: 180 32% 18%; /* Dark teal #1a3a3a */
  --menu-bg: 240 20% 96%; /* Light gray sidebar */
  --menu-item-bg: 185 45% 80%; /* Light blue/teal #B8DFE6 */
  --menu-item-hover: 185 45% 70%; /* Darker on hover */
}
```

### Phase 2: Install Dependencies (5 minutes)

```bash
# Navigate to client package
cd packages/client

# Install Shadcn UI dropdown menu component
npx shadcn@latest add dropdown-menu

# Install Lucide React icons (if not already installed)
npm install lucide-react
```

### Phase 3: Create Component Files (Storybook-First) (30 minutes)

1. **Create Header component and story**

```bash
touch packages/client/src/components/layout/Header.tsx
touch packages/client/src/components/layout/Header.stories.tsx
touch packages/client/src/components/layout/Header.test.tsx
```

2. **Create MenuList component and story**

```bash
touch packages/client/src/components/layout/MenuList.tsx
touch packages/client/src/components/layout/MenuList.stories.tsx
touch packages/client/src/components/layout/MenuList.test.tsx
```

3. **Create barrel export**

```bash
touch packages/client/src/components/layout/index.ts
```

### Phase 4: Implement Header Component (1-1.5 hours)

#### 4.1 Create Storybook story first

Edit `Header.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';

const meta: Meta<typeof Header> = {
  component: Header,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <Story />
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Desktop: Story = {
  parameters: {
    viewport: { defaultViewport: 'responsive' },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

export const DropdownOpen: Story = {
  // You can add play function to open dropdown automatically
};
```

#### 4.2 Implement Header component

Edit `Header.tsx`:

```tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  className?: string;
  userInitials?: string;
  onAvatarClick?: () => void;
}

export const Header = ({ className = '', userInitials = 'AM', onAvatarClick }: HeaderProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAvatarClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
    onAvatarClick?.();
  };

  return (
    <header
      className={`w-full bg-[hsl(var(--header-bg))] flex items-center justify-between px-6 py-4 ${className}`}
      aria-label="Main navigation"
    >
      <Link
        to="/"
        className="flex items-center gap-3 hover:opacity-90 transition-opacity"
        aria-label="Navigate to home"
      >
        {/* Inline SVG logo */}
        <svg
          width="34"
          height="34"
          viewBox="0 0 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* SVG paths from spec */}
        </svg>

        <span className="text-white text-xl font-semibold">
          <span className="hidden md:inline">Carton Case Management</span>
          <span className="md:hidden">Carton</span>
        </span>
      </Link>

      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-sm font-medium text-gray-800 hover:bg-gray-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--header-bg))]"
            aria-label="User menu"
            aria-haspopup="true"
            aria-expanded={isDropdownOpen}
            onClick={handleAvatarClick}
          >
            {userInitials}
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <div className="p-4 text-sm text-gray-500 text-center">No items yet</div>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
```

#### 4.3 Verify in Storybook

```bash
npm run storybook
```

Navigate to Header stories and verify:

- Desktop shows full text
- Mobile shows abbreviated text
- Dropdown opens/closes
- Logo is visible and styled correctly

#### 4.4 Write unit tests

Edit `Header.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Header } from './Header';

const renderHeader = (props = {}) => {
  return render(
    <BrowserRouter>
      <Header {...props} />
    </BrowserRouter>
  );
};

describe('Header', () => {
  it('renders logo and application name', () => {
    renderHeader();
    expect(screen.getByLabelText(/navigate to home/i)).toBeInTheDocument();
    expect(screen.getByText(/carton/i)).toBeInTheDocument();
  });

  it('renders user initials in avatar', () => {
    renderHeader({ userInitials: 'JD' });
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('toggles dropdown on avatar click', async () => {
    const user = userEvent.setup();
    renderHeader();

    const avatar = screen.getByLabelText(/user menu/i);
    expect(avatar).toHaveAttribute('aria-expanded', 'false');

    await user.click(avatar);
    expect(avatar).toHaveAttribute('aria-expanded', 'true');

    await user.click(avatar);
    expect(avatar).toHaveAttribute('aria-expanded', 'false');
  });

  it('calls onAvatarClick when avatar is clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    renderHeader({ onAvatarClick: handleClick });

    await user.click(screen.getByLabelText(/user menu/i));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### 4.5 Run tests

```bash
npm run test -- Header.test.tsx
```

### Phase 5: Implement MenuList Component (1-1.5 hours)

#### 5.1 Create Storybook story first

Edit `MenuList.stories.tsx`:

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { Home, Settings, Users } from 'lucide-react';
import { MenuList } from './MenuList';

const meta: Meta<typeof MenuList> = {
  component: MenuList,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <BrowserRouter>
        <div className="min-h-screen">
          <Story />
        </div>
      </BrowserRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MenuList>;

const mockItems = [{ id: 'home', label: 'Home', path: '/', icon: <Home size={20} /> }];

export const Desktop: Story = {
  args: { items: mockItems },
  parameters: { viewport: { defaultViewport: 'responsive' } },
};

export const Mobile: Story = {
  args: { items: mockItems },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
};
```

#### 5.2 Implement MenuList component

Edit `MenuList.tsx`:

```tsx
import { Link, useLocation } from 'react-router-dom';

export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  isActive?: boolean;
}

interface MenuListProps {
  items: MenuItem[];
  className?: string;
  onItemClick?: (item: MenuItem) => void;
}

export const MenuList = ({ items, className = '', onItemClick }: MenuListProps) => {
  const location = useLocation();

  return (
    <nav className={`bg-[hsl(var(--menu-bg))] ${className}`} aria-label="Main menu">
      <ul className="flex flex-row md:flex-col md:w-64 overflow-x-auto md:overflow-x-visible">
        {items.map((item) => {
          const isActive = item.isActive ?? location.pathname === item.path;

          return (
            <li key={item.id}>
              <Link
                to={item.path}
                onClick={() => onItemClick?.(item)}
                className={`
                  flex items-center gap-3 px-6 py-4 md:px-4 md:py-3
                  bg-[hsl(var(--menu-item-bg))]
                  hover:bg-[hsl(var(--menu-item-hover))]
                  transition-colors
                  whitespace-nowrap
                  ${isActive ? 'border-l-4 border-[#04646A]' : ''}
                `}
                aria-current={isActive ? 'page' : undefined}
              >
                {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
                <span className="text-sm font-medium text-gray-800">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
```

#### 5.3 Verify in Storybook & write tests

Similar to Header, verify in Storybook and write unit tests.

### Phase 6: Integration (30 minutes)

#### 6.1 Create barrel export

Edit `packages/client/src/components/layout/index.ts`:

```tsx
export { Header } from './Header';
export { MenuList, type MenuItem } from './MenuList';
```

#### 6.2 Integrate into App.tsx

Edit `packages/client/src/App.tsx`:

```tsx
import { Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout';
import HomePage from './pages/HomePage';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
```

#### 6.3 Add MenuList to layout

You can add MenuList either in App.tsx or in a Layout component:

```tsx
import { Header, MenuList } from '@/components/layout';
import { Home } from 'lucide-react';

const menuItems = [{ id: 'home', label: 'Home', path: '/', icon: <Home size={20} /> }];

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <MenuList items={menuItems} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
```

### Phase 7: E2E Testing (45 minutes)

Create `tests/e2e/navigation.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('header appears on all pages', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header[aria-label*="Main navigation"]')).toBeVisible();
  });

  test('clicking logo navigates to home page', async ({ page }) => {
    await page.goto('/');
    await page.click('a[aria-label*="Navigate to home"]');
    await expect(page).toHaveURL('/');
  });

  test('user avatar dropdown opens and closes', async ({ page }) => {
    await page.goto('/');

    const avatar = page.locator('[aria-label*="User menu"]');
    await avatar.click();
    await expect(avatar).toHaveAttribute('aria-expanded', 'true');

    // Click outside to close
    await page.click('body');
    await expect(avatar).toHaveAttribute('aria-expanded', 'false');
  });

  test('menu list home item navigates correctly', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Home');
    await expect(page).toHaveURL('/');
  });

  test('header adapts to mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Verify abbreviated text is shown
    await expect(page.locator('text=Carton Case Management')).not.toBeVisible();
    await expect(page.locator('header').locator('text=Carton')).toBeVisible();
  });
});
```

Run E2E tests:

```bash
npm run test:e2e
```

### Phase 8: Validation (15 minutes)

1. **Run all tests**

```bash
npm run test
npm run test:e2e
```

2. **Check TypeScript**

```bash
npm run type-check
```

3. **Run linter**

```bash
npm run lint
```

4. **Verify Storybook**

```bash
npm run storybook
```

Check all stories render correctly.

5. **Manual testing**
   - Open dev server: `npm run dev`
   - Test navigation flows
   - Test responsive behavior (resize browser)
   - Test keyboard navigation (Tab, Enter, Escape)
   - Test with screen reader if possible

## Troubleshooting

### Issue: Dropdown doesn't close on outside click

**Solution**: Ensure Shadcn UI dropdown-menu is properly installed and DropdownMenu component is managing state correctly.

### Issue: Tailwind classes not applying

**Solution**: Check that CSS variables are defined in `index.css` and Tailwind config includes all content paths.

### Issue: Router Link navigation doesn't work

**Solution**: Verify BrowserRouter wraps App component in `main.tsx`.

### Issue: Tests fail with router errors

**Solution**: Wrap test components with `<BrowserRouter>` in test utils or individual tests.

## Success Criteria Checklist

- [ ] Header appears on all pages
- [ ] Logo navigates to home page
- [ ] User avatar shows initials
- [ ] Dropdown opens/closes correctly
- [ ] Header displays full text on desktop, abbreviated on mobile
- [ ] MenuList shows vertical sidebar on desktop
- [ ] MenuList shows horizontal items on mobile
- [ ] All interactive elements keyboard accessible
- [ ] All tests passing (unit + E2E)
- [ ] Storybook stories for all states
- [ ] TypeScript strict mode with no errors
- [ ] ESLint passing
- [ ] Visual design matches Figma specs

## Next Steps

After completing this implementation:

1. Add more menu items as features are built
2. Integrate with authentication system (user profile data)
3. Add dropdown menu items (logout, settings, profile)
4. Implement active page highlighting
5. Add notification badges
6. Consider accessibility audit with automated tools
