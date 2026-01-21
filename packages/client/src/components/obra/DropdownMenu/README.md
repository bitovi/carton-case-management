# DropdownMenu

Displays a menu to the user — such as a set of actions or functions — triggered by a button.

## Note

This component is adapted from shadcn/ui as the Obra design system does not include a specific DropdownMenu component. It uses Obra styling conventions (rounded-lg borders, consistent spacing) while maintaining full Radix UI functionality.

## Installation

The DropdownMenu component requires `@radix-ui/react-dropdown-menu`:

```bash
npm install @radix-ui/react-dropdown-menu
```

## Usage

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/obra/DropdownMenu';
import { Button } from '@/components/obra/Button';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Components

### DropdownMenu

The root component that manages the dropdown state.

### DropdownMenuTrigger

The button that toggles the dropdown menu. Use `asChild` to compose with your own button.

### DropdownMenuContent

The container for the dropdown menu items.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `sideOffset` | `number` | `4` | Distance from the trigger |
| `align` | `'start' \| 'center' \| 'end'` | `'center'` | Alignment relative to trigger |
| `side` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'bottom'` | Preferred side |

### DropdownMenuItem

An individual menu item.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inset` | `boolean` | `false` | Adds left padding for alignment with icons |
| `disabled` | `boolean` | `false` | Disables the item |

### DropdownMenuCheckboxItem

A menu item that can be checked/unchecked.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean` | `false` | Whether the item is checked |
| `onCheckedChange` | `(checked: boolean) => void` | - | Callback when checked state changes |

### DropdownMenuRadioGroup & DropdownMenuRadioItem

For single-selection from a group of items.

```tsx
<DropdownMenuRadioGroup value={value} onValueChange={setValue}>
  <DropdownMenuRadioItem value="option1">Option 1</DropdownMenuRadioItem>
  <DropdownMenuRadioItem value="option2">Option 2</DropdownMenuRadioItem>
</DropdownMenuRadioGroup>
```

### DropdownMenuLabel

A label for a group of items.

### DropdownMenuSeparator

A visual separator between groups of items.

### DropdownMenuShortcut

Displays a keyboard shortcut hint.

```tsx
<DropdownMenuItem>
  Save
  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
</DropdownMenuItem>
```

### Submenus

For nested menus, use `DropdownMenuSub`, `DropdownMenuSubTrigger`, and `DropdownMenuSubContent`:

```tsx
<DropdownMenuSub>
  <DropdownMenuSubTrigger>More Options</DropdownMenuSubTrigger>
  <DropdownMenuSubContent>
    <DropdownMenuItem>Option A</DropdownMenuItem>
    <DropdownMenuItem>Option B</DropdownMenuItem>
  </DropdownMenuSubContent>
</DropdownMenuSub>
```

## Examples

### With Icons

```tsx
import { User, Settings, LogOut } from 'lucide-react';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <User className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem>
      <User className="mr-2 h-4 w-4" />
      Profile
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Settings className="mr-2 h-4 w-4" />
      Settings
    </DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### With Checkbox Items

```tsx
const [showStatus, setShowStatus] = useState(true);
const [showActivity, setShowActivity] = useState(false);

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">View</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuCheckboxItem
      checked={showStatus}
      onCheckedChange={setShowStatus}
    >
      Status
    </DropdownMenuCheckboxItem>
    <DropdownMenuCheckboxItem
      checked={showActivity}
      onCheckedChange={setShowActivity}
    >
      Activity
    </DropdownMenuCheckboxItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Accessibility

- Full keyboard navigation support
- Arrow keys navigate between items
- Enter/Space selects an item
- Escape closes the menu
- Type-ahead search is supported
- Focus is trapped within the menu when open
