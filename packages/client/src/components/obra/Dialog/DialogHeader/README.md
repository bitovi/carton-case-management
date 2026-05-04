# DialogHeader

A reusable header component for dialogs and sheets, supporting three layout variants: full header with title and close button, close button only, or icon button style close.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'Header' \| 'Close Only' \| 'Icon Button Close'` | `'Header'` | Layout variant |
| `title` | `string` | - | Title text (only shown for type='Header') |
| `description` | `string` | - | Description text (only shown for type='Header' when provided) |
| `onClose` | `() => void` | - | Close button click handler |
| `className` | `string` | - | Additional classes |

## Usage

### Full Header (Type='Header')

```tsx
import { DialogHeader } from '@/components/obra';

<DialogHeader
  type="Header"
  title="Settings"
  onClose={() => setIsOpen(false)}
/>
```

### With Description

```tsx
<DialogHeader
  type="Header"
  title="Filters"
  description="Filter cases by customer, status, priority, and last updated date."
  onClose={() => setIsOpen(false)}
/>
```

### Close Button Only

```tsx
<DialogHeader
  type="Close Only"
  onClose={() => setIsOpen(false)}
/>
```

### With Custom Styling

```tsx
<DialogHeader
  type="Header"
  title="Edit Profile"
  onClose={handleClose}
  className="border-b pb-4"
/>
```

## Accessibility

- Close button has `aria-label="Close"` for screen readers
- Clickable area matches visual button size
- Hover/focus states on close button
- Title uses semantic heading level (h2 or configurable)

## Related Components

- **Sheet** - Uses DialogHeader in its header slot
- **AlertDialog** - Could use DialogHeader but currently has custom header
- **DialogFooter** - Companion component for footer actions
