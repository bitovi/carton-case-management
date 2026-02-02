# Toast Component

A modal toast notification component that displays centered on the screen with a backdrop overlay.

## Features

- **Multiple Types**: Success, Neutral, and Error toast variants
- **Auto-dismiss**: Automatically dismisses after 10 seconds (configurable)
- **Manual Dismiss**: Users can dismiss via button or backdrop click
- **Icon Support**: Display custom icons alongside the message
- **Accessible**: Includes proper ARIA attributes for screen readers

## Usage

```tsx
import { Toast } from '@/components/obra/Toast';
import { PartyPopper } from 'lucide-react';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Toast
      type="Success"
      title="Success!"
      message="A new claim has been created."
      icon={<PartyPopper className="h-6 w-6" />}
      open={isOpen}
      onDismiss={() => setIsOpen(false)}
    />
  );
}
```

## Props

- `type` - Toast variant: 'Success', 'Neutral', or 'Error' (default: 'Neutral')
- `title` - Primary toast text (required)
- `message` - Secondary message text (optional)
- `icon` - Icon element to display (optional)
- `open` - Whether the toast is visible (default: false)
- `onDismiss` - Callback when dismissed (optional)
- `duration` - Auto-dismiss duration in milliseconds (default: 10000, set to 0 to disable)
- `className` - Additional CSS classes (optional)

## Examples

### Success Toast (Case Created)

```tsx
<Toast
  type="Success"
  title="Success!"
  message="A new claim has been created."
  icon={<PartyPopper className="h-6 w-6" />}
  open={isOpen}
  onDismiss={() => setIsOpen(false)}
/>
```

### Neutral Toast (Case Deleted)

```tsx
<Toast
  type="Neutral"
  title="Deleted"
  message='"Fraud Investigation" case has been successfully deleted.'
  icon={<FolderX className="h-6 w-6" />}
  open={isOpen}
  onDismiss={() => setIsOpen(false)}
/>
```

### Error Toast

```tsx
<Toast
  type="Error"
  title="Error"
  message="Failed to complete the operation. Please try again."
  icon={<Info className="h-6 w-6" />}
  open={isOpen}
  onDismiss={() => setIsOpen(false)}
/>
```

## Behavior

- Toast appears as a modal overlay in the center of the screen
- Semi-transparent backdrop appears behind the toast
- Auto-dismisses after 10 seconds by default
- Can be manually dismissed by clicking the "Dismiss" button or backdrop
- Only one toast can be displayed at a time (new toasts replace old ones)
