# Research: Collapsible Navigation Menu

**Date**: December 30, 2025  
**Feature**: [spec.md](./spec.md) | [plan.md](./plan.md)

# Research: Collapsible Navigation Menu

**Date**: December 30, 2025  
**Feature**: [spec.md](./spec.md) | [plan.md](./plan.md)

## Research Questions

Based on the Technical Context, the following areas require research to inform implementation decisions:

1. **React state management** - Best practices for managing transient collapse/expand state
2. **Tailwind CSS responsive utilities** - Proper usage of lg: breakpoint for desktop-only features
3. **Animation patterns** - Smooth transitions for width/layout changes in Tailwind
4. **Accessibility considerations** - ARIA attributes and keyboard navigation for collapsible menus
5. **Shadcn UI component usage** - Which existing UI components to use for collapse/expand button
6. **Default collapsed state** - Implementation approach for consistent collapsed default

---

## 1. React State Management

### Decision

Use simple local component state with `useState`, defaulting to `true` (collapsed). No persistence mechanism needed.

### Rationale

- **Principle of least power**: The simplest solution that works
- **Component encapsulation**: MenuList owns its own state
- **No prop drilling**: State lives where it's used
- **Performance**: No unnecessary re-renders, state updates are localized
- **Transient by design**: State resets on every page load (as required)

### Implementation Approach

```typescript
// In MenuList.tsx
const [isCollapsed, setIsCollapsed] = useState(true); // Always start collapsed

const toggleCollapse = () => {
  setIsCollapsed((prev) => !prev);
};
```

### Alternatives Considered

- **localStorage persistence**: Rejected - explicitly not wanted by requirements
- **Context API**: Rejected - overkill for single boolean state
- **URL query parameters**: Rejected - pollutes URLs, not appropriate for UI state
- **Redux/Zustand**: Rejected - excessive for single component state

---

## 2. Tailwind CSS Responsive Utilities

### Decision

Use Tailwind's `lg:` prefix (1024px breakpoint) for desktop-specific styles, matching the existing MenuList implementation.

### Rationale

- **Consistency**: Existing MenuList already uses `lg:hidden` and `lg:flex` for mobile/desktop split
- **Framework standard**: Tailwind's lg breakpoint (1024px) is industry-standard for desktop
- **Maintainability**: Using framework utilities instead of custom media queries
- **Single source of truth**: No need to duplicate breakpoint values

### Implementation Pattern

```tsx
{/* Desktop only: Show collapse/expand control */}
<div className="hidden lg:block">
  <button onClick={toggleCollapse}>
    {isCollapsed ? <Expand /> : <Collapse />}
  </button>
</div>

{/* Conditional width based on state */}
<div className={`lg:w-${isCollapsed ? '[68px]' : '[240px]'}`}>
```

### Breakpoint Reference

- `lg:` = 1024px and above (desktop)
- Below 1024px = mobile (horizontal bar, no collapse control)

### Alternatives Considered

- **Custom media queries**: Rejected - duplication of Tailwind breakpoints, harder to maintain
- **Different breakpoint (md: 768px)**: Rejected - existing code uses lg:, consistency is key
- **JavaScript matchMedia**: Rejected - Tailwind handles this declaratively, no JS needed

---

## 4. Animation Patterns

### Decision

Use Tailwind's `transition-all duration-300 ease-in-out` for smooth width and layout changes.

### Rationale

- **Built-in utilities**: Tailwind provides robust transition classes
- **Performance**: CSS transitions are GPU-accelerated
- **Timing**: 300ms matches success criteria (SC-003) and feels natural
- **Ease function**: `ease-in-out` provides smooth acceleration/deceleration
- **Simplicity**: No need for external animation libraries

### Implementation Pattern

```tsx
<div
  className={cn(
    'transition-all duration-300 ease-in-out',
    isCollapsed ? 'lg:w-[68px]' : 'lg:w-[240px]'
  )}
>
  {/* Menu content */}
</div>;

{
  /* Text labels with fade transition */
}
<span
  className={cn('transition-opacity duration-300', isCollapsed ? 'opacity-0 w-0' : 'opacity-100')}
>
  Cases
</span>;
```

### Performance Considerations

- Animate `width` and `opacity` only (not `height` or `transform` which can cause reflows)
- Use `will-change: width` sparingly and only during transition
- Test on lower-end devices to ensure 60fps

### Alternatives Considered

- **Framer Motion**: Rejected - adds 50KB bundle size for simple transitions
- **React Spring**: Rejected - physics-based animations unnecessary for this use case
- **CSS animations (@keyframes)**: Rejected - transitions are simpler for bidirectional state changes
- **Instant toggle (no animation)**: Rejected - violates success criteria, poor UX

---

## 5. Accessibility Considerations

### Decision

Implement full keyboard navigation and ARIA attributes for screen reader support.

### Rationale

- **Constitutional requirement**: WCAG 2.1 AA compliance mandatory
- **Keyboard users**: Must be able to toggle collapse/expand without mouse
- **Screen readers**: Must announce current state and available actions
- **Focus management**: Clear focus indicators for all interactive elements

### Implementation Pattern

```tsx
<button
  onClick={toggleCollapse}
  aria-label={isCollapsed ? "Expand navigation menu" : "Collapse navigation menu"}
  aria-expanded={!isCollapsed}
  aria-controls="main-navigation"
  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#bcecef] focus-visible:ring-offset-2"
>
  {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
  {!isCollapsed && <span>Collapse</span>}
</button>

<nav id="main-navigation" aria-label="Main navigation">
  {/* Menu items */}
</nav>
```

### WCAG 2.1 AA Requirements Met

- **1.4.3 Contrast**: Ensure button has 4.5:1 contrast ratio
- **2.1.1 Keyboard**: All functionality available via keyboard
- **2.4.7 Focus Visible**: Clear focus indicators
- **4.1.2 Name, Role, Value**: Proper ARIA attributes

### Testing Checklist

- Tab navigation works correctly
- Enter/Space triggers collapse/expand
- Screen reader announces state changes
- Focus indicator clearly visible
- Color contrast meets minimum ratios

### Alternatives Considered

- **Auto-collapse on blur**: Rejected - unexpected behavior, reduces user control
- **Hover to expand**: Rejected - not accessible to keyboard/touch users
- **No ARIA attributes**: Rejected - violates constitutional accessibility requirements

---

## 6. Shadcn UI Component Usage

### Decision

Use Lucide React icons directly for collapse/expand icons. Use existing button patterns from the component library for consistency.

### Rationale

- **Existing dependency**: Lucide React already used in MenuList for other icons
- **Consistency**: Match icon style with existing menu items (Dashboard, Cases, etc.)
- **Lightweight**: Tree-shakeable, only imports used icons
- **Design system**: Lucide is the project's chosen icon library (seen in package.json)

### Icon Selection

```tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Collapsed state: Show expand icon
<ChevronRight className="h-4 w-4" />

// Expanded state: Show collapse icon with text
<>
  <ChevronLeft className="h-4 w-4" />
  <span>Collapse</span>
</>
```

### Button Styling

- Use existing focus states from MenuList: `focus-visible:ring-2 focus-visible:ring-[#bcecef]`
- Match background color with active item: `bg-[#bcecef]` on hover
- Maintain consistent padding and border-radius: `rounded-md`

### Component Library Assessment

**Available Shadcn components** (from `/packages/client/src/ui/`):

- `button.tsx` - Can be used for collapse/expand control
- `dropdown-menu.tsx` - Not needed
- `card.tsx` - Not needed
- `sheet.tsx` - Not needed
- Other components - Not applicable

**Decision**: Create collapse/expand button using inline JSX with Tailwind classes matching existing MenuList patterns, rather than importing the generic Button component. This maintains consistency with the current MenuList implementation which doesn't use the Button component.

### Alternatives Considered

- **Custom SVG icons**: Rejected - Lucide provides professional, accessible icons
- **Font icons (Font Awesome)**: Rejected - adds new dependency, Lucide already available
- **Shadcn Button component**: Considered but not used - MenuList has its own button patterns inline, maintain consistency
- **Unicode arrows (← →)**: Rejected - inconsistent with design system, poor cross-browser rendering

---

## Summary of Technology Choices

| Aspect                | Technology Choice                        | Why                                      |
| --------------------- | ---------------------------------------- | ---------------------------------------- |
| **State Management**  | Local useState (default: true/collapsed) | Simplest solution, transient by design   |
| **Responsive Design** | Tailwind lg: breakpoint (1024px)         | Matches existing MenuList implementation |
| **Animations**        | Tailwind transition utilities            | Built-in, performant, simple             |
| **Icons**             | Lucide React (ChevronLeft/Right)         | Existing dependency, consistent design   |
| **Accessibility**     | ARIA + keyboard navigation               | WCAG 2.1 AA compliance required          |
| **Testing**           | Vitest (component) + Playwright (E2E)    | Existing test infrastructure             |
| **Default State**     | Collapsed on every load                  | Simple useState(true) initialization     |

All technology choices leverage existing dependencies and patterns, introducing zero new libraries or frameworks. This approach minimizes bundle size, maintains consistency with the codebase, and reduces cognitive load for developers. No persistence mechanism needed - state is transient and resets on page load.
