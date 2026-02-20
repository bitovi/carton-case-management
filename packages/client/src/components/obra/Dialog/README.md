# Dialog

A flexible dialog/modal component with multiple layout variants for different screen sizes and scrolling behaviors.

## Figma Source

https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=151-12298&m=dev

## Accepted Design Differences

| Category | Figma | Implementation | File | Reason |
|----------|-------|----------------|------|--------|
| Slot Content | Static placeholder | Flexible `children` prop | Dialog.tsx | Allow any content to be rendered |
| Close Button | Inline X icon | Lucide React X component | Dialog.tsx | Consistent icon usage |
| Header/Footer | Fixed instances | Flexible ReactNode props | Dialog.tsx | Reusable with DialogHeader/DialogFooter |

## Design-to-Code Mapping

### Variant Mappings

| Figma Variant | Figma Value | React Prop | React Value | Notes |
|---------------|-------------|------------|-------------|-------|
| Type | Desktop | `type` | `'Desktop'` | 640x480px, rounded-[10px] |
| Type | Desktop Scrollable | `type` | `'Desktop Scrollable'` | 640x480px, rounded-xl, has header/footer |
| Type | Mobile | `type` | `'Mobile'` | 320x240px, rounded-[10px] |
| Type | Mobile Full Screen Scrollable | `type` | `'Mobile Full Screen Scrollable'` | 320x640px, has header/footer |

### Property Mappings

| Figma Property | Type | React Prop | Notes |
|----------------|------|------------|-------|
| Slot | Content | `children` | Main content area |
| Dialog Header | Instance | `header?: ReactNode` | Optional header for scrollable variants |
| Dialog Footer | Instance | `footer?: ReactNode` | Optional footer for scrollable variants |
| Icon / x | Instance | `onClose?: () => void` | Close button handler |

### Excluded Properties (CSS/Internal)

| Figma Property | Handling | Reason |
|----------------|----------|--------|
| Shadow | Tailwind `shadow-lg` | Visual styling |
| Border | Tailwind `border border-border` | Visual styling |

## Usage

### Desktop Dialog

```tsx
import { Dialog } from '@/components/obra';

<Dialog type="Desktop" onClose={() => console.log('closed')}>
  <div>Dialog content here</div>
</Dialog>
```

### Desktop Scrollable Dialog with Header and Footer

```tsx
import { Dialog, DialogHeader, DialogFooter } from '@/components/obra';
import { Button } from '@/components/ui';

<Dialog 
  type="Desktop Scrollable"
  header={<DialogHeader title="Dialog Title" onClose={() => {}} />}
  footer={
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Confirm</Button>
    </DialogFooter>
  }
>
  <div>Scrollable content here</div>
</Dialog>
```

### Mobile Dialog

```tsx
import { Dialog } from '@/components/obra';

<Dialog type="Mobile" onClose={() => console.log('closed')}>
  <div>Mobile dialog content</div>
</Dialog>
```

### Mobile Full Screen Scrollable

```tsx
import { Dialog, DialogHeader, DialogFooter } from '@/components/obra';
import { Button } from '@/components/ui';

<Dialog 
  type="Mobile Full Screen Scrollable"
  header={<DialogHeader title="Full Screen" onClose={() => {}} />}
  footer={
    <DialogFooter>
      <Button>Action</Button>
    </DialogFooter>
  }
>
  <div>Full screen scrollable content</div>
</Dialog>
```

## Related Components

- **DialogHeader** - Header region with title and close button
- **DialogFooter** - Footer region for action buttons
