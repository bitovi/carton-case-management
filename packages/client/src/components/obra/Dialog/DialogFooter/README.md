# DialogFooter

A reusable footer component for dialogs and sheets, providing consistent layout for action buttons. Supports responsive layouts with proper spacing and alignment.

## Figma Source

Derived from Sheet footer area shown in:
https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=301-243831&m=dev

## Design-to-Code Mapping

### Layout

| Property | Value | Notes |
|----------|-------|-------|
| Container | flex flex-col sm:flex-row | Vertical on mobile, horizontal on desktop |
| Alignment | sm:justify-end | Right-aligned on desktop |
| Gap | gap-2 | 8px spacing between buttons |
| Button Order | Reverse on desktop | Cancel left, Primary right |

### Colors

No specific color mappings - buttons determine their own styling.

### Responsive Behavior

| Breakpoint | Layout | Button Width |
|------------|--------|--------------|
| Mobile (<640px) | Vertical stack | Full width |
| Desktop (≥640px) | Horizontal row | Auto width |

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | - | **Required**. Action buttons or custom footer content |
| `className` | `string` | - | Additional classes |

## Usage

### Standard Action Buttons

```tsx
import { DialogFooter } from '@/components/obra';
import { Button } from '@/components/obra';

<DialogFooter>
  <Button variant="outline" onClick={onCancel}>
    Cancel
  </Button>
  <Button variant="primary" onClick={onSave}>
    Save Changes
  </Button>
</DialogFooter>
```

### Single Action

```tsx
<DialogFooter>
  <Button variant="primary" onClick={onConfirm}>
    Got it
  </Button>
</DialogFooter>
```

### Destructive Action

```tsx
<DialogFooter>
  <Button variant="outline" onClick={onCancel}>
    Cancel
  </Button>
  <Button variant="destructive" onClick={onDelete}>
    Delete Item
  </Button>
</DialogFooter>
```

### Custom Content

```tsx
<DialogFooter>
  <div className="flex items-center justify-between w-full">
    <p className="text-sm text-muted-foreground">Last saved: 2 min ago</p>
    <div className="flex gap-2">
      <Button variant="outline">Cancel</Button>
      <Button variant="primary">Save</Button>
    </div>
  </div>
</DialogFooter>
```

### With Sheet

```tsx
import { Sheet, DialogHeader, DialogFooter } from '@/components/obra';

<Sheet 
  open={isOpen} 
  onOpenChange={setIsOpen}
  header={<DialogHeader type="Header" title="Settings" />}
  footer={
    <DialogFooter>
      <Button variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSave}>
        Save
      </Button>
    </DialogFooter>
  }
>
  <div>Content</div>
</Sheet>
```

## Accessibility

- Buttons maintain proper focus order (left to right, top to bottom)
- Touch targets meet minimum size requirements on mobile
- Keyboard navigation works naturally through flex layout
- Screen readers announce buttons in DOM order

## Related Components

- **Sheet** - Uses DialogFooter in its footer slot
- **Button** - Primary component used within DialogFooter
- **DialogHeader** - Companion component for header region
