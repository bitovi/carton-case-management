# Toast Component

Toast notification system for displaying temporary success and error messages.

## Figma Design

- [New Case Created (Desktop)](https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj?node-id=1109-11333)
- [Case Deleted (Desktop)](https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj?node-id=1190-64772)
- [New Case Created (Mobile)](https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj?node-id=1199-81150)

## Usage

### Basic Setup

Wrap your app with the `ToastProvider`:

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

### Using the Hook

Use the `useToast` hook to show notifications:

```tsx
import { useToast } from '@/components/obra/Toast';

function MyComponent() {
  const { success, deleted } = useToast();

  const handleCreate = () => {
    // ... create logic
    success('Success!', 'A new claim has been created.');
  };

  const handleDelete = (caseName: string) => {
    // ... delete logic
    deleted('Deleted', `${caseName} has been successfully deleted.`);
  };

  return (
    <>
      <button onClick={handleCreate}>Create Case</button>
      <button onClick={handleDelete}>Delete Case</button>
    </>
  );
}
```

### Custom Toast

For more control, use the `toast` function:

```tsx
const { toast } = useToast();

toast({
  type: 'success',
  title: 'Custom Title',
  message: 'Custom message',
  duration: 6000, // 6 seconds (default is 4000)
});
```

## Features

- **Auto-dismiss**: Toasts automatically dismiss after 4 seconds (configurable)
- **Manual dismiss**: Users can click "Dismiss" button to close immediately
- **Stacking**: Multiple toasts stack vertically with newest on top
- **Navigation clearing**: Toasts clear when navigating to a different page
- **Responsive**: Full-width on mobile, fixed-width on desktop
- **Accessible**: ARIA labels and live regions for screen readers

## Props

### Toast Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `id` | `string` | required | Unique identifier |
| `type` | `'success' \| 'deleted'` | `'success'` | Toast type |
| `title` | `string` | required | Toast title |
| `message` | `string` | required | Toast message |
| `icon` | `ReactNode` | auto | Custom icon (defaults to type-based icon) |
| `onDismiss` | `() => void` | - | Callback when dismissed |
| `className` | `string` | - | Additional CSS classes |

### useToast Hook

Returns an object with:

| Method | Signature | Description |
|--------|-----------|-------------|
| `success` | `(title, message) => void` | Show success toast |
| `deleted` | `(title, message) => void` | Show deleted toast |
| `toast` | `(config) => void` | Show custom toast |
| `dismiss` | `(id) => void` | Dismiss specific toast |
| `dismissAll` | `() => void` | Dismiss all toasts |

## Design Mapping

- **Success Toast**: Party popper icon (🎉), "Success!" title
- **Deleted Toast**: Warning triangle icon (⚠️), "Deleted" title
- **Position**: Bottom-center on desktop, full-width bottom on mobile
- **Auto-dismiss**: 4 seconds
- **Button**: "Dismiss" outline button

## Related Tickets

- CAR-2: Toast Messages
