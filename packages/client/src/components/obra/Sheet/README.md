# Sheet

A sliding panel component that displays supplementary content from the edge of the screen.

## Figma Source

https://www.figma.com/design/GDd2lvaGmc11rUwCJMB6Wd/Obra-shadcn-ui--Community-?node-id=301-243233

## Usage

```tsx
import { Sheet } from '@/components/obra/Sheet';

// Scrollable variant (with close button and footer)
<Sheet
  open={isOpen}
  onOpenChange={setIsOpen}
  scrollable={true}
  cancelLabel="Cancel"
  actionLabel="Save Changes"
  onCancel={() => setIsOpen(false)}
  onAction={handleSave}
>
  <form>
    {/* Form fields go here */}
  </form>
</Sheet>

// Non-scrollable variant (just content slot)
<Sheet
  open={isOpen}
  onOpenChange={setIsOpen}
  scrollable={false}
>
  <nav>
    {/* Navigation menu */}
  </nav>
</Sheet>
```

## Design-to-Code Mapping

### Variant Mappings

| Figma Variant | Figma Value | React Prop | React Value | Notes |
|---------------|-------------|------------|-------------|-------|
| Scrollable | True | `scrollable` | `true` (default) | Shows close button + footer |
| Scrollable | False | `scrollable` | `false` | Just content slot |

### Property Mappings

| Figma Property | Type | React Prop | Notes |
|----------------|------|------------|-------|
| Slot | Content | `children` | Main content area |
| Footer cancel button | Button | `cancelLabel` | Default: "Cancel" |
| Footer action button | Button | `actionLabel` | Default: "Submit" |

### Excluded Properties (CSS/Internal)

| Figma Property | Handling | Reason |
|----------------|----------|--------|
| Background overlay | CSS | Fixed at 60% black opacity |
| Shadow | CSS | Fixed shadow-lg |
| Width | CSS | Fixed at 342px for side sheets |

## Accepted Design Differences

| Category | Figma | Implementation | Reason |
|----------|-------|----------------|--------|
| Width | 342px fixed | 342px for side, auto for top/bottom | Responsive flexibility |
| Footer width | 320px | Full width with self-end | Better alignment |

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | required | Whether the sheet is open |
| `onOpenChange` | `(open: boolean) => void` | required | Callback when open state changes |
| `children` | `ReactNode` | required | Content to render in the sheet |
| `scrollable` | `boolean` | `true` | Figma variant - toggles close button & footer |
| `side` | `'left' \| 'right' \| 'top' \| 'bottom'` | `'right'` | Side from which sheet slides |
| `cancelLabel` | `string` | `'Cancel'` | Label for cancel button |
| `actionLabel` | `string` | `'Submit'` | Label for action button |
| `onCancel` | `() => void` | - | Called when cancel clicked |
| `onAction` | `() => void` | - | Called when action clicked |
| `className` | `string` | - | Additional CSS classes |

## Accessibility

- Uses `role="dialog"` with `aria-modal="true"`
- Close button has accessible `aria-label="Close"`
- Closes on Escape key press
- Body scroll is locked when open
- Focus trap not implemented (consider adding for better accessibility)

## Related Components

- **AlertDialog**: For confirmation dialogs
- **Button**: Used in footer for actions
