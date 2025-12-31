# Data Model: Collapsible Navigation Menu

**Date**: December 30, 2025  
**Feature**: [spec.md](./spec.md) | [plan.md](./plan.md)

## Overview

This feature requires minimal data modeling as it's purely a UI state management feature. The menu state is transient component state that resets to collapsed on every page load. No persistence required.

---

## Entities

### MenuState

**Description**: Represents the current state of the navigation menu (expanded or collapsed). This is transient UI-level state that exists only during the current session.

**Attributes**:

- `isCollapsed`: boolean - Whether the menu is currently in collapsed state
  - `true` = Menu shows icons only (collapsed) - **DEFAULT**
  - `false` = Menu shows icons with text labels (expanded)
  - Default: `true` (collapsed)

**Storage**: Component state (React useState)
**Persistence**: None - resets on every page load

**Lifecycle**:

- **Created**: On component mount, initialized to `true` (collapsed)
- **Updated**: On user toggle action
- **Deleted**: On component unmount
- **Reset**: On every page load (always starts collapsed)

**Validation Rules**:

- Must be a boolean value
- No user input validation needed (internally controlled)

---

### MenuItem (Existing)

**Description**: Represents a single navigation item in the menu. This entity already exists; no modifications required.

**Attributes** (for reference):

- `id`: string - Unique identifier for the menu item
- `label`: string - Display text (e.g., "Dashboard", "Cases")
- `path`: string - Router path for navigation
- `icon`: ReactNode - Icon component to display
- `isActive`: boolean - Whether this item is currently active

**Changes for this feature**: None. MenuItem structure remains unchanged.

**Display Logic** (new):

- In **expanded state**: Show icon + label
- In **collapsed state**: Show icon only, hide label

---

## Type Definitions

### TypeScript Types

```typescript
// No special types needed - using standard boolean state
// In MenuList.tsx:
const [isCollapsed, setIsCollapsed] = useState(true); // Default to collapsed

// Existing MenuItem interface (no changes)
export interface MenuItem {
  id: string;
  label: string;
  path: string;
  icon?: ReactNode;
  isActive?: boolean;
}

// Existing MenuListProps interface (no changes)
export interface MenuListProps {
  items: MenuItem[];
  className?: string;
  onItemClick?: (item: MenuItem) => void;
}
```

---

## State Transitions

### Menu State Diagram

```
┌─────────────────┐
│  Initial Load   │
└────────┬────────┘
         │
         └─ Always defaults to [COLLAPSED]


[COLLAPSED (default)]         [EXPANDED]
    │                             │
    │  User clicks expand          │  User clicks collapse
    │  button                      │  button
    │                             │
    └──────────►──────────────────┘
                    ◄

On page refresh/navigation: Reset to [COLLAPSED]
```

### Transition Actions

1. **Load State**
   - Trigger: Component mount
   - Action: Initialize isCollapsed to `true`
   - Result: Menu starts in collapsed state

2. **Expand Menu**
   - Trigger: User clicks expand button (collapsed state)
   - Action: Set `isCollapsed = false`
   - UI Change: Menu width grows, text labels fade in

3. **Collapse Menu**
   - Trigger: User clicks collapse button (expanded state)
   - Action: Set `isCollapsed = true`
   - UI Change: Menu width shrinks, text labels fade out

4. **Page Navigation/Refresh**
   - Trigger: Any page navigation or browser refresh
   - Action: Component remounts, state resets to `true`
   - Result: Menu always returns to collapsed state

---

## Relationships

No complex relationships. This is isolated UI state.

**Related Components**:

- `MenuList` component - Owner of the state
- React useState hook - State management mechanism

**No database entities**: This feature does not interact with the backend or database.
**No browser storage**: State is transient and not persisted.

---

## Migration Path

**From**: Current implementation (icon-only desktop menu)
**To**: Collapsible menu with default collapsed state

**Migration Strategy**:

1. No data migration needed (no persistence)
2. All users: Always start with collapsed menu
3. Existing users: Will see collapsed menu on first load (may be different from current icon-only width)
4. Backward compatibility: N/A (no breaking changes to component API)

**Rollback Plan**:
If feature needs to be rolled back:

1. Remove collapse/expand button
2. Fix menu width to collapsed state (current behavior)
3. No cleanup needed (no stored data)

---

## Performance Considerations

- **State updates**: Single boolean toggle, negligible re-render cost
- **Memory footprint**: 1 boolean in component state
- **No storage operations**: No I/O overhead
- **Initialization**: Instant (no async reads)
- **Scalability**: Not applicable (client-side UI state only)

---

## Summary

This feature requires minimal data modeling:

1. **Single boolean state** (`isCollapsed`) in component state
2. **No persistence** - state is transient
3. **Defaults to collapsed** (`true`) on every page load
4. **No API contracts** - no server communication
5. **Existing MenuItem** structure unchanged
6. **No storage mechanism** - pure React state

The simplicity of the data model aligns with the feature's scope: enhancing an existing UI component with user-controlled transient state that resets on each page load.
