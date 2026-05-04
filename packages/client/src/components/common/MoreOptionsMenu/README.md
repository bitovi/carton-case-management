# MoreOptionsMenu

A flexible dropdown menu component that displays a trigger element (icon button, avatar, or custom element) and opens a popover with menu items when clicked. Uses Popover pattern for accessibility and flexible content support.

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
