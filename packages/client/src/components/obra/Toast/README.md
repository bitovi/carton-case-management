# Toast

A modal toast notification component that displays feedback messages with auto-dismiss functionality.

## Features

- Modal overlay with backdrop
- Auto-dismiss after configurable duration (default 10 seconds)
- Manual dismiss with button or backdrop click
- Three variants: success, error, neutral
- Optional icon and title
- Center-screen positioning
- Accessible with proper ARIA attributes

## Usage

### Basic Toast

```tsx
import { Toast } from '@/components/obra/Toast';

function MyComponent() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Toast
      message="Operation completed successfully"
      open={isOpen}
      onDismiss={() => setIsOpen(false)}
    />
  );
}
```

### Success Toast with Icon

```tsx
<Toast
  type="success"
  icon="🎉"
  title="Success!"
  message="A new claim has been created."
  open={isOpen}
  onDismiss={() => setIsOpen(false)}
/>
```

### Using Toast Provider

The recommended way to use toasts is through the `ToastProvider` context:

```tsx
import { ToastProvider, useToast } from '@/components/obra/Toast';

// Wrap your app
function App() {
  return (
    <ToastProvider>
      <YourApp />
    </ToastProvider>
  );
}

// Use in components
function MyComponent() {
  const { showToast } = useToast();

  const handleSuccess = () => {
    showToast({
      type: 'success',
      icon: '🎉',
      title: 'Success!',
      message: 'Operation completed.',
    });
  };

  return <button onClick={handleSuccess}>Do Something</button>;
}
```

## Props

See `types.ts` for complete prop documentation.

## Accessibility

- Uses `role="dialog"` and `aria-modal="true"`
- Proper labeling with `aria-labelledby` and `aria-describedby`
- Keyboard accessible (ESC to dismiss via backdrop)
- Focus management
