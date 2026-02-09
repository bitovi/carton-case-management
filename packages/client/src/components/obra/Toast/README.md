# Toast

A toast notification component for displaying temporary feedback messages to users.

## Features

- Success and error variants
- Auto-dismiss with configurable duration
- Manual dismiss with close button
- Swipe to dismiss on mobile
- Support for emoji and description text
- Positioned at bottom center of viewport
- Responsive design for mobile and desktop
- Toast queue management via ToastProvider

## Usage

### Basic Usage

Wrap your app with `ToastProvider`:

```tsx
import { ToastProvider } from '@/components/obra/Toast';

function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  );
}
```

### Showing Toasts

Use the `useToast` hook to show toasts:

```tsx
import { useToast } from '@/components/obra/Toast';

function MyComponent() {
  const { showToast } = useToast();

  const handleSuccess = () => {
    showToast({
      type: 'success',
      title: 'Success!',
      description: 'A new claim has been created.',
      emoji: '🎉',
      duration: 5000, // optional, defaults to 5000ms
    });
  };

  const handleDelete = () => {
    showToast({
      type: 'error',
      title: 'Deleted',
      description: `'${caseName}' case has been successfully deleted.`,
    });
  };

  return (
    <div>
      <button onClick={handleSuccess}>Create Case</button>
      <button onClick={handleDelete}>Delete Case</button>
    </div>
  );
}
```

## Props

### ToastProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'success' \| 'error'` | `'success'` | Toast variant |
| `title` | `string` | - | Toast heading (required) |
| `description` | `string` | - | Optional secondary text |
| `emoji` | `string` | - | Optional emoji to display |
| `duration` | `number` | `5000` | Auto-dismiss duration in ms |
| `className` | `string` | - | Additional CSS classes |

### showToast Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `type` | `'success' \| 'error'` | Toast variant |
| `title` | `string` | Toast heading |
| `description` | `string` | Optional description |
| `emoji` | `string` | Optional emoji |
| `duration` | `number` | Auto-dismiss duration (ms) |

## Examples

### Success Toast (Case Creation)

```tsx
showToast({
  type: 'success',
  title: 'Success!',
  description: 'A new claim has been created.',
  emoji: '🎉',
});
```

### Error Toast (Case Deletion)

```tsx
showToast({
  type: 'error',
  title: 'Deleted',
  description: `'${caseName}' case has been successfully deleted.`,
});
```

### Custom Duration

```tsx
showToast({
  type: 'success',
  title: 'Saved',
  description: 'Your changes have been saved.',
  duration: 3000, // 3 seconds
});
```

## Behavior

- Toasts appear at the bottom center of the viewport
- Multiple toasts stack vertically (newest at bottom)
- Auto-dismiss after specified duration (default 5 seconds)
- Can be manually dismissed by clicking the X button
- Swipeable down on mobile devices
- Dismisses when user navigates away
- No stacking limit (but single toast recommended per action)

## Accessibility

- Toast container has `role="region"` for screen readers
- Close button has proper `aria-label="Dismiss"`
- Focus management for keyboard navigation
- Proper color contrast for readability
