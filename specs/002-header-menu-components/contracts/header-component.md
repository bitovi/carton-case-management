# Component Contract: Header

**Component**: `Header`  
**Location**: `packages/client/src/components/layout/Header.tsx`  
**Type**: Presentational React Component  
**Purpose**: Application-wide header with logo, branding, and user avatar dropdown

## Component Interface

```typescript
interface HeaderProps {
  /**
   * Optional className for custom styling
   * @example "border-b border-gray-200"
   */
  className?: string;

  /**
   * User initials to display in avatar circle
   * @default "AM"
   * @example "JD" for John Doe
   */
  userInitials?: string;

  /**
   * Optional callback when user avatar is clicked
   * Future: Can be used for auth menu actions
   */
  onAvatarClick?: () => void;
}
```

## Usage Examples

### Basic Usage

```tsx
import { Header } from '@/components/layout';

function App() {
  return (
    <>
      <Header />
      <main>{/* page content */}</main>
    </>
  );
}
```

### With Custom Props

```tsx
import { Header } from '@/components/layout';

function App() {
  const handleAvatarClick = () => {
    console.log('Avatar clicked - future auth menu');
  };

  return <Header userInitials="JD" onAvatarClick={handleAvatarClick} className="shadow-md" />;
}
```

### In Storybook

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Header } from './Header';

const meta: Meta<typeof Header> = {
  component: Header,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Header>;

export const Desktop: Story = {
  parameters: {
    viewport: { defaultViewport: 'desktop' },
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
};

export const WithCustomInitials: Story = {
  args: {
    userInitials: 'AB',
  },
};
```

## Component Behavior

### Visual States

1. **Default State**
   - Full-width header bar
   - Logo on left (34x34px SVG)
   - Application name: "Carton Case Management" (desktop) / "Carton" (mobile)
   - User avatar on right with initials

2. **Dropdown Closed**
   - Avatar shows initials only
   - No dropdown menu visible

3. **Dropdown Open**
   - Avatar visually indicated as active
   - Empty dropdown menu appears below avatar
   - Backdrop/overlay for mobile (optional)

4. **Hover States**
   - Logo: Subtle hover effect (cursor pointer, slight opacity change)
   - Avatar: Hover effect indicating clickability

5. **Focus States**
   - Logo: Visible focus ring for keyboard navigation
   - Avatar: Visible focus ring
   - Focus trapped in dropdown when open

### Responsive Breakpoints

| Viewport          | Text Display             | Layout           |
| ----------------- | ------------------------ | ---------------- |
| < 768px (mobile)  | "Carton"                 | Compact spacing  |
| ≥ 768px (desktop) | "Carton Case Management" | Standard spacing |

### Interactions

| Action                 | Behavior                                     |
| ---------------------- | -------------------------------------------- |
| Click logo             | Navigate to home page ("/") via React Router |
| Click avatar           | Toggle dropdown menu open/closed             |
| Click outside dropdown | Close dropdown                               |
| Press Escape key       | Close dropdown                               |
| Tab key                | Navigate between logo → avatar               |
| Enter on logo          | Navigate to home                             |
| Enter on avatar        | Toggle dropdown                              |

### Accessibility

- **Semantic HTML**: `<header>` element wrapping component
- **ARIA Attributes**:
  - `aria-label="Main navigation"` on header
  - `aria-label="Navigate to home"` on logo link
  - `aria-label="User menu"` on avatar button
  - `aria-expanded="true|false"` on avatar when dropdown exists
  - `aria-haspopup="true"` on avatar
- **Keyboard Navigation**: Full keyboard support (Tab, Enter, Escape)
- **Focus Management**: Focus indicators visible, focus trapped in dropdown
- **Screen Reader**: Announces all interactive elements and state changes

## Testing Contract

### Unit Tests (Vitest)

```typescript
describe('Header', () => {
  it('renders logo and application name', () => {
    render(<Header />);
    expect(screen.getByLabelText(/navigate to home/i)).toBeInTheDocument();
    expect(screen.getByText(/carton case management/i)).toBeInTheDocument();
  });

  it('renders user initials in avatar', () => {
    render(<Header userInitials="JD" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('toggles dropdown on avatar click', async () => {
    render(<Header />);
    const avatar = screen.getByLabelText(/user menu/i);

    await userEvent.click(avatar);
    expect(avatar).toHaveAttribute('aria-expanded', 'true');

    await userEvent.click(avatar);
    expect(avatar).toHaveAttribute('aria-expanded', 'false');
  });

  it('displays full text on desktop, abbreviated on mobile', () => {
    // Test with viewport mocking
  });
});
```

### Storybook Stories

- Desktop view
- Mobile view
- Dropdown open state
- Dropdown closed state
- Custom initials
- Interactive states (hover, focus)

### E2E Tests (Playwright)

```typescript
test('clicking logo navigates to home page', async ({ page }) => {
  await page.goto('/some-other-page');
  await page.click('a[aria-label*="Navigate to home"]');
  await expect(page).toHaveURL('/');
});

test('avatar dropdown opens and closes', async ({ page }) => {
  await page.goto('/');
  const avatar = page.locator('[aria-label*="User menu"]');

  await avatar.click();
  await expect(avatar).toHaveAttribute('aria-expanded', 'true');

  await page.click('body'); // Click outside
  await expect(avatar).toHaveAttribute('aria-expanded', 'false');
});
```

## Style Contract

### Tailwind Classes

```typescript
// Header container
className = 'w-full bg-[hsl(var(--header-bg))] flex items-center justify-between px-6 py-4';

// Logo container
className = 'flex items-center gap-3 cursor-pointer';

// Application name (responsive)
className = 'text-white text-xl font-semibold hidden md:inline';

// User avatar
className = 'w-10 h-10 rounded-full bg-white flex items-center justify-center text-sm font-medium';
```

### CSS Variables Required

```css
:root {
  --header-bg: 180 32% 18%; /* Dark teal #1a3a3a */
}
```

## Dependencies

- `react-router-dom`: For `Link` component
- `@radix-ui/react-dropdown-menu` or Shadcn UI dropdown: For accessible dropdown
- `lucide-react` (optional): For any additional icons

## Breaking Change Policy

Changes that would require consumer updates:

- Removing or renaming props
- Changing prop types
- Changing default behavior
- Removing exported types

Non-breaking changes:

- Adding optional props
- Adding CSS variables
- Internal refactoring
- Performance improvements

## Future Enhancements

- User profile data integration (name, email, avatar image)
- Authentication menu items in dropdown
- Notification badges
- Theme switcher
- Multi-language support (i18n)
