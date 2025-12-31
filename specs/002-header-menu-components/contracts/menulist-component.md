# Component Contract: MenuList

**Component**: `MenuList`  
**Location**: `packages/client/src/components/layout/MenuList.tsx`  
**Type**: Presentational React Component  
**Purpose**: Responsive navigation menu list (vertical sidebar on desktop, horizontal on mobile)

## Component Interface

```typescript
interface MenuItem {
  /** Unique identifier for the menu item */
  id: string;

  /** Display label for the menu item */
  label: string;

  /** React Router path to navigate to */
  path: string;

  /** Icon component or icon name */
  icon?: React.ReactNode;

  /** Whether this item is currently active */
  isActive?: boolean;
}

interface MenuListProps {
  /**
   * Array of menu items to display
   * @example [{ id: 'home', label: 'Home', path: '/', icon: <HomeIcon /> }]
   */
  items: MenuItem[];

  /**
   * Optional className for custom styling
   */
  className?: string;

  /**
   * Optional callback when a menu item is clicked
   * Useful for analytics or side effects
   */
  onItemClick?: (item: MenuItem) => void;
}
```

## Usage Examples

### Basic Usage

```tsx
import { MenuList } from '@/components/layout';
import { Home } from 'lucide-react';

const menuItems = [{ id: 'home', label: 'Home', path: '/', icon: <Home size={20} /> }];

function AppLayout() {
  return (
    <div className="flex">
      <MenuList items={menuItems} />
      <main>{/* page content */}</main>
    </div>
  );
}
```

### With Click Handler

```tsx
import { MenuList } from '@/components/layout';

function AppLayout() {
  const handleItemClick = (item: MenuItem) => {
    // Analytics tracking
    console.log('Navigation clicked:', item.label);
  };

  return <MenuList items={menuItems} onItemClick={handleItemClick} />;
}
```

### In Storybook

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MenuList } from './MenuList';
import { Home, Settings, Users } from 'lucide-react';

const meta: Meta<typeof MenuList> = {
  component: MenuList,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MenuList>;

const mockItems = [
  { id: 'home', label: 'Home', path: '/', icon: <Home /> },
  { id: 'settings', label: 'Settings', path: '/settings', icon: <Settings /> },
  { id: 'users', label: 'Users', path: '/users', icon: <Users /> },
];

export const Desktop: Story = {
  args: {
    items: mockItems,
  },
  parameters: {
    viewport: { defaultViewport: 'desktop' },
  },
};

export const Mobile: Story = {
  args: {
    items: mockItems,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ id: 'home', label: 'Home', path: '/', icon: <Home /> }],
  },
};

export const WithActiveItem: Story = {
  args: {
    items: mockItems.map((item, idx) => ({
      ...item,
      isActive: idx === 0, // First item active
    })),
  },
};
```

## Component Behavior

### Visual States

1. **Desktop Layout (≥768px)**
   - Vertical sidebar on left side
   - Light gray/off-white background
   - Menu items stacked vertically
   - Icon on left, text on right
   - Adequate spacing between items

2. **Mobile Layout (<768px)**
   - Horizontal layout below header
   - Full-width menu items
   - Icon and text horizontally aligned
   - Touch-friendly tap targets (min 44x44px)

3. **Menu Item States**
   - **Default**: Light blue/teal background, visible icon and text
   - **Hover** (desktop): Slightly darker background, cursor pointer
   - **Active**: Visual indicator (border or background change) for current page
   - **Focus**: Visible focus ring for keyboard navigation

### Responsive Breakpoints

| Viewport          | Layout                       | Item Display                   |
| ----------------- | ---------------------------- | ------------------------------ |
| < 768px (mobile)  | Horizontal, full-width items | Icon left, text right, stacked |
| ≥ 768px (desktop) | Vertical sidebar             | Icon left, text right, inline  |

### Interactions

| Action                    | Behavior                                      |
| ------------------------- | --------------------------------------------- |
| Click menu item           | Navigate to item's path via React Router Link |
| Hover menu item (desktop) | Show hover state (background change)          |
| Tab key                   | Navigate through menu items                   |
| Enter key on focused item | Navigate to item's path                       |
| Touch/tap (mobile)        | Navigate to item's path                       |

### Accessibility

- **Semantic HTML**: `<nav>` element wrapping menu list
- **ARIA Attributes**:
  - `aria-label="Main menu"` on nav element
  - `aria-current="page"` on active menu item
  - Each Link has accessible name from label text
- **Keyboard Navigation**: Full keyboard support (Tab, Enter)
- **Touch Targets**: Minimum 44x44px tap areas on mobile
- **Screen Reader**: Announces navigation role and current page

## Testing Contract

### Unit Tests (Vitest)

```typescript
describe('MenuList', () => {
  const mockItems: MenuItem[] = [
    { id: 'home', label: 'Home', path: '/', icon: <span>🏠</span> },
    { id: 'about', label: 'About', path: '/about', icon: <span>ℹ️</span> },
  ];

  it('renders all menu items', () => {
    render(<MenuList items={mockItems} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('renders icons for each item', () => {
    render(<MenuList items={mockItems} />);
    expect(screen.getByText('🏠')).toBeInTheDocument();
    expect(screen.getByText('ℹ️')).toBeInTheDocument();
  });

  it('calls onItemClick when item is clicked', async () => {
    const handleClick = vi.fn();
    render(<MenuList items={mockItems} onItemClick={handleClick} />);

    await userEvent.click(screen.getByText('Home'));
    expect(handleClick).toHaveBeenCalledWith(mockItems[0]);
  });

  it('marks active item with aria-current', () => {
    const itemsWithActive = mockItems.map((item, idx) => ({
      ...item,
      isActive: idx === 0,
    }));

    render(<MenuList items={itemsWithActive} />);
    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toHaveAttribute('aria-current', 'page');
  });

  it('displays vertical layout on desktop', () => {
    // Test with viewport mocking
  });

  it('displays horizontal layout on mobile', () => {
    // Test with viewport mocking
  });
});
```

### Storybook Stories

- Desktop vertical sidebar
- Mobile horizontal items
- Single item
- Multiple items
- With active item highlighted
- Without icons
- Interactive states (hover, focus)

### E2E Tests (Playwright)

```typescript
test('clicking menu item navigates to correct page', async ({ page }) => {
  await page.goto('/');
  await page.click('text=Home');
  await expect(page).toHaveURL('/');
});

test('menu adapts to mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 }); // Mobile
  await page.goto('/');

  // Verify horizontal layout (check computed styles)
  const menu = page.locator('nav[aria-label*="Main menu"]');
  // Add assertions for layout direction
});

test('keyboard navigation works', async ({ page }) => {
  await page.goto('/');

  // Tab to first menu item
  await page.keyboard.press('Tab');
  await expect(page.locator('text=Home')).toBeFocused();

  // Press Enter to navigate
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/');
});
```

## Style Contract

### Tailwind Classes

```typescript
// Desktop sidebar container
className = 'hidden md:flex md:flex-col md:w-64 bg-gray-100 min-h-screen';

// Mobile horizontal container
className = 'flex md:hidden flex-row w-full overflow-x-auto bg-gray-100';

// Menu item (desktop)
className = 'flex items-center gap-3 px-4 py-3 bg-[#B8DFE6] hover:bg-[#9DC9D1] cursor-pointer';

// Menu item (mobile)
className = 'flex items-center gap-2 px-6 py-4 bg-[#B8DFE6] whitespace-nowrap';

// Active item indicator
className = 'border-l-4 border-[#04646A]'; // or background change
```

### CSS Variables Required

```css
:root {
  --menu-bg: 240 20% 96%; /* Light gray sidebar background */
  --menu-item-bg: 185 45% 80%; /* Light blue/teal #B8DFE6 */
  --menu-item-hover: 185 45% 70%; /* Slightly darker on hover */
}
```

## Dependencies

- `react-router-dom`: For `Link` component
- `lucide-react` (recommended): For icon components
- Optional: `react-router-dom`'s `useLocation` hook to determine active item

## Validation Rules

```typescript
// MenuItem validation (runtime checks in dev mode)
const validateMenuItem = (item: MenuItem): void => {
  if (!item.id || item.id.trim() === '') {
    throw new Error('MenuItem.id is required and must be non-empty');
  }
  if (!item.label || item.label.trim() === '') {
    throw new Error('MenuItem.label is required and must be non-empty');
  }
  if (!item.path || !item.path.startsWith('/')) {
    throw new Error('MenuItem.path must start with "/"');
  }
};

// Check for duplicate IDs
const validateMenuItems = (items: MenuItem[]): void => {
  const ids = items.map((item) => item.id);
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicates.length > 0) {
    throw new Error(`Duplicate MenuItem IDs found: ${duplicates.join(', ')}`);
  }
};
```

## Breaking Change Policy

Changes that would require consumer updates:

- Removing or renaming required props
- Changing MenuItem interface structure
- Removing `id`, `label`, or `path` from MenuItem
- Changing navigation behavior

Non-breaking changes:

- Adding optional props to MenuItem
- Adding optional props to MenuListProps
- Adding CSS classes or styling
- Internal refactoring

## Future Enhancements

- Nested menu items (sub-menus)
- Collapsible sidebar on desktop
- Badge counts (notifications, unread items)
- Icon-only mode with tooltips
- Drag-and-drop reordering (admin feature)
- Dynamic loading of menu items from server/config
- Permission-based filtering
