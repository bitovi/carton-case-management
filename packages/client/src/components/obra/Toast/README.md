# Toast

Toast notification component for displaying temporary success and destructive messages with auto-dismiss functionality.

## Figma Source

- [New Case Created (Desktop)](https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj?node-id=1109-11333)
- [Case Deleted (Desktop)](https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj?node-id=1190-64772)
- [New Case Created (Mobile)](https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj?node-id=1199-81150)

## Features

- Success and destructive variants
- Auto-dismiss after 4 seconds (configurable)
- Manual dismiss via button
- Toast stacking support
- Desktop: bottom-center positioning
- Mobile: full-width bottom overlay
- Clears on navigation
- Icons support
- Accessible with ARIA attributes

## Usage

### Setup

First, wrap your app with the toast providers in `main.tsx`:

```tsx
import { ToastProvider, ToastContextProvider, Toaster } from './components/obra/Toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ToastContextProvider>
      <ToastProvider duration={4000}>
        <App />
        <Toaster />
      </ToastProvider>
    </ToastContextProvider>
  </React.StrictMode>
);
```

### Trigger Toasts

Use the `useToast` hook to trigger toasts:

```tsx
import { useToast } from '@/components/obra/Toast';
import { PartyPopper, TriangleAlert } from 'lucide-react';

function MyComponent() {
  const { toast } = useToast();

  const handleSuccess = () => {
    toast({
      variant: 'success',
      title: 'Success!',
      description: 'A new claim has been created.',
      icon: <PartyPopper className="h-5 w-5" />,
    });
  };

  const handleDelete = () => {
    toast({
      variant: 'destructive',
      title: 'Deleted',
      description: 'Case has been successfully deleted.',
      icon: <TriangleAlert className="h-5 w-5 text-destructive-foreground" />,
    });
  };

  return (
    <>
      <button onClick={handleSuccess}>Create Case</button>
      <button onClick={handleDelete}>Delete Case</button>
    </>
  );
}
```

### Clear Toasts on Navigation

To clear toasts when navigating between pages, add a navigation listener:

```tsx
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useToast } from '@/components/obra/Toast';

function App() {
  const location = useLocation();
  const { toasts, dismiss } = useToast();

  useEffect(() => {
    toasts.forEach((toast) => {
      dismiss(toast.id);
    });
  }, [location.pathname]);

  return <Routes>{/* ... */}</Routes>;
}
```

## Props

### ToastProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'success' \| 'destructive'` | `'success'` | Toast type/style |
| title | `string` | required | Toast title |
| description | `string` | required | Toast message |
| icon | `ReactNode` | `undefined` | Optional icon element |
| open | `boolean` | `undefined` | Whether toast is visible |
| onOpenChange | `(open: boolean) => void` | `undefined` | Callback when visibility changes |
| duration | `number` | `4000` | Auto-dismiss duration in ms |
| className | `string` | `undefined` | Additional CSS classes |

### UseToastOptions

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | `'success' \| 'destructive'` | `'success'` | Toast type/style |
| title | `string` | required | Toast title |
| description | `string` | required | Toast message |
| icon | `ReactNode` | `undefined` | Optional icon element |
| duration | `number` | `4000` | Auto-dismiss duration in ms |

## Examples

### Success Toast

```tsx
toast({
  variant: 'success',
  title: 'Success!',
  description: 'A new claim has been created.',
  icon: <PartyPopper className="h-5 w-5" />,
});
```

### Destructive Toast

```tsx
toast({
  variant: 'destructive',
  title: 'Deleted',
  description: 'Case has been successfully deleted.',
  icon: <TriangleAlert className="h-5 w-5 text-destructive-foreground" />,
});
```

### Custom Duration

```tsx
toast({
  variant: 'success',
  title: 'Saved',
  description: 'Changes saved successfully.',
  duration: 2000, // 2 seconds
});
```

## Accessibility

- Uses ARIA roles and attributes from Radix UI Toast
- Toast title and description are announced to screen readers
- Dismiss button is keyboard accessible
- Swipe gesture support on mobile

## Related Components

- **Alert**: For static, persistent alert messages
- **AlertDialog**: For confirmation dialogs requiring user action
