# MoreOptionsMenu

A flexible dropdown menu component that displays a trigger element (icon button, avatar, or custom element) and opens a popover with menu items when clicked. Uses Popover pattern for accessibility and flexible content support.

## Figma Source

https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=1179-62911

## Accepted Design Differences

| Figma                    | Implementation        | Justification                                           |
| ------------------------ | --------------------- | ------------------------------------------------------- |
| Fixed IconButton trigger | Flexible trigger prop | User requested support for avatar/custom triggers       |
| HoverCard component      | Popover component     | Obra design system provides Popover as standard overlay |
| 200x50px fixed size      | Dynamic sizing        | Content-driven sizing for flexibility                   |

## Figma-to-Code Mapping

| Figma Element         | React Implementation                                           |
| --------------------- | -------------------------------------------------------------- |
| MoreOptions component | `MoreOptionsMenu`                                              |
| IconButton (trigger)  | `Button` with `size="small"` and `roundness="round"` (default) |
| State: Rest/Active    | Controlled by Popover `open` state                             |
| HoverCard             | `PopoverContent`                                               |
| Slot                  | `children` prop                                                |
| Three dots icon       | `moreVerticalIcon` from @progress/kendo-svg-icons              |

## Usage

```tsx
import { MoreOptionsMenu } from '@/components/common/MoreOptionsMenu';
import { MenuItem } from '@/components/common/MenuItem';

// Default icon button trigger
<MoreOptionsMenu>
  <MenuItem>Edit</MenuItem>
  <MenuItem>Delete</MenuItem>
</MoreOptionsMenu>

// Custom avatar trigger
<MoreOptionsMenu trigger={<Avatar src="/user.jpg" />}>
  <MenuItem>Profile</MenuItem>
  <MenuItem>Settings</MenuItem>
</MoreOptionsMenu>
```
