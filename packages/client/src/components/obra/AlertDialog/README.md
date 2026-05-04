# AlertDialog

A modal alert dialog component that displays a title, description, and action buttons with optimized layouts for desktop and mobile.

## Type Variant Behavior

### Type: 'mobile'
- Vertical button stack
- Centered title and description
- Primary button on top
- Full-width buttons

### Type: 'desktop'
- Horizontal button row (right-aligned)
- Left-aligned title and description
- Cancel button on left, Primary on right
- Auto-width buttons with spacing

## Usage

```tsx
import { AlertDialog } from '@/components/obra/AlertDialog';
import { Button } from '@/components/obra/Button';

// Mobile variant (default)
<AlertDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Delete Item"
  description="This action cannot be undone. Are you sure you want to continue?"
  actionButton={<Button onClick={handleDelete}>Delete</Button>}
  cancelButton={<Button variant="outline" onClick={handleCancel}>Cancel</Button>}
/>

// Desktop variant
<AlertDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  type="desktop"
  title="Confirm Action"
  description="Please confirm that you want to proceed with this action."
  actionButton={<Button onClick={handleConfirm}>Confirm</Button>}
  cancelButton={<Button variant="outline">Cancel</Button>}
/>

// Custom button styles
<AlertDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Destructive Action"
  description="This will permanently delete your data."
  actionButton={
    <Button
      variant="destructive"
      size="large"
      onClick={handleDelete}
    >
      Delete Forever
    </Button>
  }
  cancelButton={<Button variant="ghost">Nevermind</Button>}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Controls dialog visibility |
| `onOpenChange` | `(open: boolean) => void` | - | Callback when open state changes |
| `title` | `string` | - | **Required**. Dialog title text |
| `description` | `string` | - | **Required**. Dialog description text |
| `actionButton` | `ReactNode` | - | **Required**. Primary action button (pass Button component) |
| `cancelButton` | `ReactNode` | - | **Required**. Cancel button (pass Button component) |
| `type` | `'mobile' \| 'desktop'` | `'mobile'` | Layout variant |
