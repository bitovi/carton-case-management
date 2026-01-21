# AlertDialog

A modal dialog that interrupts the user with important content and expects a response. Supports Mobile and Desktop layout variants based on the Obra shadcn-ui design system.

## Figma Source

https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=295-239548&m=dev

## Design-to-Code Mapping

### Variant Mappings

| Figma Type | Content Prop | Layout Description |
|------------|--------------|-------------------|
| Mobile | `variant="mobile"` | Centered text, stacked full-width buttons |
| Desktop | `variant="desktop"` | Left-aligned text, inline right-aligned buttons |

### Layout Differences by Variant

| Aspect | `mobile` | `desktop` |
|--------|----------|-----------|
| Content width | 320px | 480px |
| Text alignment | Centered | Left-aligned |
| Footer layout | Stacked (column) | Inline (row) |
| Button width | Full width | Auto |
| Button alignment | N/A | Right-aligned |

### Property Mappings

| Figma Property | Type | React Prop | Component |
|----------------|------|------------|-----------|
| Title | Text | `children` | AlertDialogTitle |
| Text (description) | Text | `children` | AlertDialogDescription |
| Primary Button | Instance | AlertDialogAction | AlertDialogAction |
| Cancel Button | Instance | AlertDialogCancel | AlertDialogCancel |

### Excluded Properties (CSS/Internal)

| Figma Property | Handling | Reason |
|----------------|----------|--------|
| Shadow | Tailwind `shadow-lg` | Fixed styling |
| Border radius | Tailwind `rounded-xl` | Fixed styling |
| Padding | Tailwind `p-8` | Fixed styling |
| Backdrop opacity | CSS `bg-black/60` | Fixed styling |

## Usage

```tsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/obra/AlertDialog';
import { Button } from '@/components/obra/Button';

// Desktop (default)
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete Item</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Delete this?</AlertDialogTitle>
      <AlertDialogDescription>
        Are you sure you want to delete this item?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

// Mobile variant
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button>Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent variant="mobile">
    <AlertDialogHeader>
      <AlertDialogTitle>Delete this?</AlertDialogTitle>
      <AlertDialogDescription>
        Are you sure you want to delete this item?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

## Components

| Component | Description |
|-----------|-------------|
| `AlertDialog` | Root component managing open/close state |
| `AlertDialogTrigger` | Element that opens the dialog |
| `AlertDialogContent` | Main content container with variant support |
| `AlertDialogHeader` | Groups title and description |
| `AlertDialogTitle` | Dialog heading |
| `AlertDialogDescription` | Explanatory text |
| `AlertDialogFooter` | Button container |
| `AlertDialogAction` | Primary action button |
| `AlertDialogCancel` | Secondary/cancel button |

## Accessibility

Built on Radix UI AlertDialog primitives which provide:
- Focus trapping within the dialog
- Escape key closes the dialog
- Screen reader announcements
- Proper ARIA attributes
