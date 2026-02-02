# Toast Component

A modal toast notification component for displaying success/error messages with auto-dismiss functionality.

## Overview

The Toast component displays notifications as a centered modal overlay with a semi-transparent backdrop. It includes auto-dismiss after 10 seconds (configurable) and manual dismiss options.

## Features

- **Modal overlay**: Fixed positioning, centered on screen with semi-transparent backdrop
- **Auto-dismiss**: Automatically closes after 10 seconds (default) or custom duration
- **Manual dismiss**: Dismissible via "Dismiss" button, close button (×), backdrop click, or Escape key
- **Three variants**: Success (🎉), Error (Folder with X icon), Neutral
- **Custom icons**: Support for custom icon override
- **Accessible**: Proper ARIA attributes, keyboard navigation, focus management
- **Smooth animations**: Fade in/out with scale transitions

## Installation

The Toast component is part of the common components library and requires the ToastProvider for context-based usage.

```tsx
import { Toast } from '@/components/common/Toast';
import { ToastProvider, useToast } from '@/lib/toast';
```

## Usage

### Basic Usage (Component)

```tsx
import { Toast } from '@/components/common/Toast';
import { useState } from 'react';

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(true)}>Show Toast</button>
      <Toast
        variant="success"
        title="Success!"
        message="Your changes have been saved."
        open={open}
        onDismiss={() => setOpen(false)}
      />
    </>
  );
}
```

### Context-Based Usage (Recommended)

```tsx
import { ToastProvider, useToast } from '@/lib/toast';

// Wrap your app with ToastProvider
function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  );
}

// Use the hook in any component
function MyComponent() {
  const { showToast } = useToast();

  const handleSuccess = () => {
    showToast({
      variant: 'success',
      title: 'Success!',
      message: 'Your changes have been saved.',
    });
  };

  const handleDelete = () => {
    showToast({
      variant: 'error',
      title: 'Deleted',
      message: 'Case #2024-001 has been permanently deleted.',
    });
  };

  return (
    <>
      <button onClick={handleSuccess}>Save</button>
      <button onClick={handleDelete}>Delete</button>
    </>
  );
}
```

## Variants

### Success
- Icon: 🎉 celebration emoji
- Title: "Success!" (customizable)
- Styling: Green border and background

```tsx
showToast({
  variant: 'success',
  title: 'Success!',
  message: 'Your changes have been saved successfully.',
});
```

### Error (Delete)
- Icon: Folder with X icon
- Title: "Deleted" (customizable)
- Styling: Red border and background

```tsx
showToast({
  variant: 'error',
  title: 'Deleted',
  message: 'John Doe vs. Acme Corp case has been permanently deleted.',
});
```

### Neutral
- Icon: None (default) or custom
- Title: Customizable
- Styling: Default border and background

```tsx
showToast({
  variant: 'neutral',
  title: 'Information',
  message: 'Your session will expire in 5 minutes.',
});
```

## API

### Toast Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'success' \| 'error' \| 'neutral'` | `'neutral'` | Visual variant of the toast |
| `title` | `string` | Required | Toast title text |
| `message` | `string` | Required | Toast message content |
| `open` | `boolean` | Required | Whether the toast is visible |
| `onDismiss` | `() => void` | Required | Callback when toast should be dismissed |
| `autoDismiss` | `boolean` | `true` | Whether to auto-dismiss after duration |
| `duration` | `number` | `10000` | Duration in milliseconds before auto-dismiss |
| `icon` | `ReactNode` | Variant default | Custom icon to override variant icon |

### useToast Hook

Returns an object with the following methods:

#### showToast(options)

Display a toast notification.

**Options:**
- `variant?: 'success' | 'error' | 'neutral'` - Visual variant (default: `'neutral'`)
- `title: string` - Toast title (required)
- `message: string` - Toast message (required)
- `duration?: number` - Auto-dismiss duration in ms (default: `10000`)
- `autoDismiss?: boolean` - Whether to auto-dismiss (default: `true`)
- `icon?: ReactNode` - Custom icon

#### hideToast()

Manually hide the currently visible toast.

```tsx
const { showToast, hideToast } = useToast();

// Show toast
showToast({ variant: 'success', title: 'Done!', message: 'Complete' });

// Hide toast manually
hideToast();
```

## Customization

### Custom Duration

```tsx
showToast({
  variant: 'success',
  title: 'Quick Message',
  message: 'This will dismiss after 3 seconds.',
  duration: 3000,
});
```

### Disable Auto-Dismiss

```tsx
showToast({
  variant: 'neutral',
  title: 'Important',
  message: 'This requires manual dismissal.',
  autoDismiss: false,
});
```

### Custom Icon

```tsx
import { FileQuestion } from 'lucide-react';

showToast({
  variant: 'neutral',
  title: 'Help',
  message: 'Please review the documentation.',
  icon: <FileQuestion className="h-6 w-6 text-blue-600" />,
});
```

## Accessibility

- **ARIA attributes**: `role="alert"`, `aria-live="assertive"`, `aria-atomic="true"`
- **Keyboard navigation**: Escape key to dismiss
- **Focus management**: Proper focus handling for dismiss buttons
- **Screen reader support**: Accessible labels and descriptions

## Design System

Follows patterns from the AlertDialog component:
- Radix UI-style positioning and animations
- Consistent backdrop overlay (semi-transparent black)
- Fixed positioning with proper z-index layering (z-50)
- Smooth fade and scale animations
- Responsive design with max-width constraints

## Testing

The component includes comprehensive test coverage:
- Rendering in different states
- All variant styles and icons
- Dismissal via button, backdrop, and keyboard
- Auto-dismiss timing
- Accessibility attributes
- Edge cases and error handling

## Examples

### Success After Save

```tsx
const { showToast } = useToast();

const handleSave = async () => {
  try {
    await saveData();
    showToast({
      variant: 'success',
      title: 'Success!',
      message: 'Your changes have been saved successfully.',
    });
  } catch (error) {
    // Handle error
  }
};
```

### Delete Confirmation

```tsx
const { showToast } = useToast();

const handleDelete = async (caseName: string) => {
  try {
    await deleteCase();
    showToast({
      variant: 'error',
      title: 'Deleted',
      message: `${caseName} has been permanently deleted.`,
    });
  } catch (error) {
    // Handle error
  }
};
```

### Session Warning

```tsx
const { showToast } = useToast();

useEffect(() => {
  const timer = setTimeout(() => {
    showToast({
      variant: 'neutral',
      title: 'Session Expiring',
      message: 'Your session will expire in 5 minutes.',
      duration: 15000, // Show for 15 seconds
    });
  }, SESSION_WARNING_TIME);

  return () => clearTimeout(timer);
}, [showToast]);
```

## Jira Ticket Reference

Implementation for Jira ticket **CAR-2**: Toast notification system

**Requirements:**
1. ✅ Modal overlay centered on screen with semi-transparent backdrop
2. ✅ Auto-dismiss after 10 seconds OR dismissible with "Dismiss" button
3. ✅ Success variant: 🎉 celebration emoji, "Success!" title, custom message
4. ✅ Delete variant: Folder with X icon, "Deleted" title, custom message with case name

## Notes

- Only one toast is displayed at a time when using the context system
- New toasts replace existing ones automatically
- The component uses Tailwind CSS for styling
- Compatible with dark mode via Tailwind's dark mode utilities
- Follows the modlet pattern for organization

## Related Components

- **AlertDialog**: Modal dialog for confirmations
- **ConfirmationDialog**: Pre-configured confirmation dialog
- **Button**: Used for dismiss actions
