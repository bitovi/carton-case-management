# Sheet

A side panel or drawer overlay component with configurable header, scrollable content area, and optional footer. Designed for detailed views, settings panels, or forms that don't require full page navigation.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls sheet visibility |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `scrollable` | `boolean` | `true` | Whether content area is scrollable |
| `header` | `ReactNode` | - | Header slot, typically DialogHeader |
| `children` | `ReactNode` | - | **Required**. Main content area |
| `footer` | `ReactNode` | - | Footer slot, typically DialogFooter with buttons |
| `className` | `string` | - | Additional classes for panel |

## Usage

### Basic with DialogHeader

```tsx
import { Sheet, DialogHeader } from '@/components/obra';

<Sheet
  open={isOpen}
  onOpenChange={setIsOpen}
  header={
    <DialogHeader
      type="Header"
      title="Settings"
      onClose={() => setIsOpen(false)}
    />
  }
>
  <div>Sheet content here</div>
</Sheet>
```

### With Header and Footer

```tsx
import { Sheet, DialogHeader, DialogFooter } from '@/components/obra';
import { Button } from '@/components/obra';

<Sheet
  open={isOpen}
  onOpenChange={setIsOpen}
  header={
    <DialogHeader
      type="Header"
      title="Edit Item"
      onClose={() => setIsOpen(false)}
    />
  }
  footer={
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSave}>
        Save Changes
      </Button>
    </DialogFooter>
  }
>
  <form>
    {/* Form fields */}
  </form>
</Sheet>
```

### Non-Scrollable

```tsx
<Sheet
  open={isOpen}
  onOpenChange={setIsOpen}
  scrollable={false}
  header={<DialogHeader type="Close Only" onClose={() => setIsOpen(false)} />}
>
  <div className="h-full flex items-center justify-center">
    Fixed height content
  </div>
</Sheet>
```

## Accessibility

- Focus trap active when sheet is open
- Escape key closes the sheet
- Focus returns to trigger element on close
- `role="dialog"`, `aria-modal="true"`
- `aria-labelledby` references header title if present
- Body scroll locked when open
- Overlay click closes sheet (optional behavior)

## Related Components

- **DialogHeader** - Header region with title and close button variants
- **DialogFooter** - Footer region for action buttons
- **Button** - Action buttons used in footer
- **AlertDialog** - Similar modal pattern for confirmation dialogs
