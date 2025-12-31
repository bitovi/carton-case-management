# Component Contract: MenuList (Enhanced)

**Component**: `MenuList`  
**File**: `packages/client/src/components/MenuList/MenuList.tsx`  
**Type**: React Functional Component

---

## Component Signature

```typescript
export function MenuList({ items, className, onItemClick }: MenuListProps): JSX.Element;
```

---

## Props Interface

```typescript
export interface MenuListProps {
  /** Array of menu items to display */
  items: MenuItem[];

  /** Optional CSS class name for the nav container */
  className?: string;

  /** Optional callback when a menu item is clicked */
  onItemClick?: (item: MenuItem) => void;
}

export interface MenuItem {
  /** Unique identifier for the menu item */
  id: string;

  /** Display text for the menu item */
  label: string;

  /** Router path to navigate to */
  path: string;

  /** Optional icon element to display */
  icon?: ReactNode;

  /** Whether this item is currently active */
  isActive?: boolean;
}
```

**Changes from existing**: None. Props interface remains backward compatible.

---

## Component Behavior

### Desktop View (≥1024px viewport)

**Expanded State** (default):

```tsx
<nav className="lg:w-[240px]">
  {/* Collapse button at bottom */}
  <button aria-label="Collapse navigation menu">
    <ChevronLeft />
    <span>Collapse</span>
  </button>

  {/* Menu items with icons and text */}
  <Link to="/cases">
    <FolderIcon />
    <span>Cases</span>
  </Link>
</nav>
```

**Collapsed State**:

```tsx
<nav className="lg:w-[68px]">
  {/* Expand button at bottom */}
  <button aria-label="Expand navigation menu">
    <ChevronRight />
  </button>

  {/* Menu items with icons only */}
  <Link to="/cases" aria-label="Cases">
    <FolderIcon />
  </Link>
</nav>
```

### Mobile View (<1024px viewport)

**Unchanged** - Horizontal bar showing active item only:

```tsx
<nav className="lg:hidden">
  <div className="flex items-center">
    <ActiveItemIcon />
    <span>Active Item Label</span>
  </div>
</nav>
```

---

## State Management

### Internal State

```typescript
const [isCollapsed, setIsCollapsed] = useState(true); // Always start collapsed
```

- **Initial value**: `true` (collapsed) on every page load
- **Updates**: On user click of collapse/expand button
- **Persistence**: None - state resets on page navigation/refresh

### State Effects

1. **On mount**:
   - Initialize `isCollapsed` to `true`
   - Apply collapsed state CSS classes

2. **On toggle**:
   - Update `isCollapsed` state
   - Trigger width transition animation (300ms)
   - No persistence needed

3. **On unmount / page navigation**:
   - State is discarded
   - Next mount will start collapsed again

---

## Accessibility

### ARIA Attributes

```typescript
// Collapse/Expand Button
<button
  aria-label={isCollapsed ? "Expand navigation menu" : "Collapse navigation menu"}
  aria-expanded={!isCollapsed}
  aria-controls="main-navigation"
>
  {/* Button content */}
</button>

// Navigation Container
<nav
  id="main-navigation"
  aria-label="Main navigation"
>
  {/* Menu items */}
</nav>

// Menu Items (collapsed state)
<Link
  to={item.path}
  aria-label={item.label}  // Ensures screen readers announce label even when hidden
>
  {item.icon}
</Link>
```

### Keyboard Navigation

- **Tab**: Focus collapse/expand button and menu items
- **Enter/Space**: Activate collapse/expand button
- **Enter/Space**: Navigate to selected menu item
- **Focus indicators**: Visible ring on focused elements

### Screen Reader Behavior

- **Expanded state**: "Collapse navigation menu button, expanded"
- **Collapsed state**: "Expand navigation menu button, collapsed"
- **Menu items**: Always announce label, even when text is hidden

---

## CSS Classes

### Responsive Classes

```typescript
// Mobile (default)
className="lg:hidden px-4 py-2 flex items-center gap-2"

// Desktop
className="hidden lg:flex lg:fixed lg:left-0 lg:top-[72px]"

// Desktop with collapse state
className={cn(
  "transition-all duration-300 ease-in-out",
  isCollapsed ? "lg:w-[68px]" : "lg:w-[240px]"
)}
```

### Animation Classes

```typescript
// Menu container
"transition-all duration-300 ease-in-out"

// Text labels
className={cn(
  "transition-opacity duration-300",
  isCollapsed ? "opacity-0 hidden" : "opacity-100"
)}

// Collapse/expand button
"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bcecef]"
```

---

## Events

### User Events

```typescript
// Collapse/Expand Button Click
const handleToggleCollapse = () => {
  setIsCollapsed((prev) => !prev);
};

// Menu Item Click (existing)
const handleItemClick = (item: MenuItem) => {
  onItemClick?.(item);
};
```

### Side Effects

- **DOM update**: Width transition animation via CSS
- **No network requests**: Purely client-side feature
- **No persistence**: State is transient and resets on page load

---

## Testing Contract

### Component Tests (Vitest)

```typescript
describe('MenuList', () => {
  it('renders in expanded state by default', () => {
    render(<MenuList items={mockItems} />);
    expect(screen.getByText('Cases')).toBeInTheDocument();
  });

  it('collapses menu when collapse button is clicked', () => {
    render(<MenuList items={mockItems} />);

    const collapseButton = screen.getByLabelText('Collapse navigation menu');
    fireEvent.click(collapseButton);

    expect(screen.queryByText('Cases')).not.toBeVisible();
  });

  it('persists collapsed state to localStorage', () => {
    render(<MenuList items={mockItems} />);

    fireEvent.click(screen.getByLabelText('Collapse navigation menu'));

    expect(localStorage.getItem('carton-menu-collapsed')).toBe('true');
  });

  it('restores state from localStorage on mount', () => {
    localStorage.setItem('carton-menu-collapsed', 'true');

    render(<MenuList items={mockItems} />);

    expect(screen.getByLabelText('Expand navigation menu')).toBeInTheDocument();
  });

  it('does not show collapse button on mobile', () => {
    // Mock viewport < 1024px
    global.innerWidth = 768;

    render(<MenuList items={mockItems} />);

    expect(screen.queryByLabelText(/navigation menu/)).not.toBeInTheDocument();
  });
});
```

### E2E Tests (Playwright)

See [e2e-test-contract.md](./e2e-test-contract.md)

---

## Performance Characteristics

- **Initial render**: +negligible overhead (one useState initialization)
- **Toggle animation**: 300ms transition, GPU-accelerated
- **Re-renders**: Only on state change (collapse/expand toggle)
- **Bundle size impact**: +~1KB (icons only, no custom hook)
- **Memory footprint**: 1 boolean state variable

---

## Breaking Changes

**None**. This is a non-breaking enhancement:

- Existing MenuList props unchanged
- Mobile behavior unchanged
- Component API fully backward compatible
- Can be adopted gradually (defaults to collapsed state)

---

## Dependencies

### React Hooks

- `useState` - Component state management (simple boolean)

### Icons (Lucide React)

- `ChevronLeft` - Collapse icon
- `ChevronRight` - Expand icon

### Utilities

- `cn` (clsx + tailwind-merge) - Conditional class names

---

## Usage Example

```tsx
import { MenuList } from '@/components/MenuList';
import {
  Gauge,
  Folder,
  ListTodo,
  Calendar,
  Users,
  FileText,
  BarChart,
  Settings,
} from 'lucide-react';

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

export function App() {
  return <MenuList items={menuItems} />;
}
```

**Result**:

- Desktop: Collapsible menu (collapsed by default)
- Mobile: Horizontal bar with active item (unchanged)
- State resets to collapsed on every page load
