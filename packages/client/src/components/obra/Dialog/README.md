# Dialog

A flexible dialog/modal component with multiple layout variants for different screen sizes and scrolling behaviors.

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
