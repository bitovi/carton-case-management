# DialogFooter

A reusable footer component for dialogs and sheets, providing consistent layout for action buttons with three variant options: right-aligned buttons, full-width button rows, or single full-width button.

## Figma Source

https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=593-62172&m=dev

## Accepted Design Differences

| Category | Figma | Implementation | File | Reason |
|----------|-------|----------------|------|--------|
| Button Content | Placeholder "Label" | Flexible children | DialogFooter.tsx | Support any button content/configuration |

## Design-to-Code Mapping

### Variant Mappings

| Figma Variant | Figma Value | React Prop | React Value | Notes |
|---------------|-------------|------------|-------------|-------|
| Type | 2 Buttons Right | `type` | `'2 Buttons Right'` | Two buttons, right-aligned (default) |
| Type | 2 Full-width Buttons | `type` | `'2 Full-width Buttons'` | Two buttons, full-width layout |
| Type | Single Full-width Button | `type` | `'Single Full-width Button'` | Single button, full-width |

### Layout Details

#### 2 Buttons Right Variant
- Container: padding 16px, flex flex-col gap-0
- Inner wrapper: flex items-center justify-end gap-2
- Buttons: Auto width, right-aligned
- Typical use: Cancel + Primary action

#### 2 Full-width Buttons Variant
- Container: padding 16px, flex flex-col gap-0
- Inner wrapper: flex items-start justify-end gap-2 rounded-[10px]
- Buttons: Should use `flex-1` class for equal width
- Typical use: Equal-weight actions (e.g., "Save Draft" + "Publish")

#### Single Full-width Button Variant
- Container: padding 16px, flex flex-col gap-0
- Inner wrapper: flex items-start justify-end gap-0 rounded-[10px]
- Button: Should use `w-full` class
- Typical use: Single call-to-action (e.g., "Got it", "Continue")

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
