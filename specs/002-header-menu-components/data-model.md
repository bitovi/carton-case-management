# Data Model: Responsive Header and Menu Components

**Feature**: 002-header-menu-components  
**Date**: December 29, 2025

## Overview

This feature is **UI-only** with no database entities or server-side data models required. All data is either:

- **Static**: Logo SVG, application name text
- **Configuration**: Menu items (hardcoded for now, will be data-driven in future iterations)
- **Client state**: Dropdown open/closed status (ephemeral, not persisted)

## Component Props (TypeScript Interfaces)

Since there are no database entities, this section documents the component interfaces that define the "data shape" for UI components.

### Header Component

```typescript
interface HeaderProps {
  /** Optional className for custom styling */
  className?: string;

  /** User display name or initials for avatar */
  userInitials?: string;

  /** Callback when user avatar is clicked (future: for auth menu) */
  onAvatarClick?: () => void;
}
```

**Properties**:

- `className`: Allows consumers to add additional Tailwind classes
- `userInitials`: User's initials to display in avatar circle (default: "AM" for now, will be dynamic with auth)
- `onAvatarClick`: Optional callback for future auth menu functionality

**Validation**: None required (all props optional with sensible defaults)

**Relationships**: None (standalone component)

### MenuList Component

```typescript
interface MenuItem {
  /** Unique identifier for the menu item */
  id: string;

  /** Display label for the menu item */
  label: string;

  /** React Router path to navigate to */
  path: string;

  /** Icon component or icon name */
  icon?: React.ReactNode | string;

  /** Whether this item is currently active */
  isActive?: boolean;
}

interface MenuListProps {
  /** Array of menu items to display */
  items: MenuItem[];

  /** Optional className for custom styling */
  className?: string;

  /** Callback when a menu item is clicked */
  onItemClick?: (item: MenuItem) => void;
}
```

**Properties**:

- `MenuItem.id`: Unique key for React list rendering
- `MenuItem.label`: Text shown next to icon
- `MenuItem.path`: Route path for React Router Link
- `MenuItem.icon`: Optional icon (can be React component or string identifier)
- `MenuItem.isActive`: Highlights current page (future enhancement)
- `MenuListProps.items`: Array of navigation items
- `MenuListProps.className`: Custom styling support
- `MenuListProps.onItemClick`: Optional callback for analytics/tracking

**Validation**:

- `id` must be unique within items array
- `path` must be valid React Router path string
- `label` must be non-empty string

**Relationships**: None (items are simple value objects, not related to database entities)

### Logo Component (Helper)

```typescript
interface LogoProps {
  /** Size in pixels (default: 34) */
  size?: number;

  /** Optional className for wrapper */
  className?: string;
}
```

**Properties**:

- `size`: Controls SVG width/height
- `className`: Additional styling

## Hardcoded Data (Initial Implementation)

For the initial implementation, menu items are hardcoded:

```typescript
const menuItems: MenuItem[] = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    icon: <HomeIcon />, // Or use Lucide React icon
  },
];
```

**Future Evolution**:

- Menu items will eventually come from:
  - User permissions/roles (auth-based)
  - CMS or configuration file
  - Feature flags (to show/hide navigation based on enabled features)

## State Management

### Local Component State

```typescript
// Header component state
interface HeaderState {
  isDropdownOpen: boolean;
}

// Initial state
const initialState: HeaderState = {
  isDropdownOpen: false,
};
```

**State Transitions**:

1. User clicks avatar → `isDropdownOpen: true`
2. User clicks avatar again → `isDropdownOpen: false`
3. User clicks outside dropdown → `isDropdownOpen: false`
4. User presses Escape key → `isDropdownOpen: false`

**Persistence**: None (ephemeral UI state only)

## No Server State

This feature requires **no server state management**:

- ❌ No database tables
- ❌ No Prisma models
- ❌ No tRPC procedures
- ❌ No API endpoints
- ❌ No data fetching

All component data is:

- Static (logo, text)
- Hardcoded configuration (menu items)
- Local UI state (dropdown)

## Future Data Requirements

When authentication and dynamic navigation are added, the following data models may be needed:

### User Profile (Future)

```typescript
interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  initials: string; // Computed from first/last name
  avatarUrl?: string; // Optional profile picture
}
```

### Navigation Item (Future)

```typescript
interface NavigationItem {
  id: string;
  label: string;
  path: string;
  iconName: string;
  order: number;
  requiredPermission?: string;
  enabled: boolean;
}
```

These would be fetched via tRPC queries and cached with React Query, but are **out of scope** for the current implementation.

## Type Safety Notes

- All component props are strictly typed with TypeScript interfaces
- No `any` types used
- Zod validation not required (no user input or API data)
- React Router types ensure path strings are valid
- Icon types constrained to React.ReactNode for type safety

## Design Decisions

1. **Props over Context**: Components accept props directly rather than using React Context, keeping them simple and testable

2. **Hardcoded Menu Items**: Initial implementation uses hardcoded array rather than fetching from server, allowing us to build UI patterns first

3. **Optional Callbacks**: `onAvatarClick` and `onItemClick` props are optional to support testing and Storybook without mocking

4. **Icon Flexibility**: Icon prop accepts both React components and strings to support different icon libraries or future dynamic icon loading

5. **No Form State**: No form data or complex state machines needed for these navigation components
