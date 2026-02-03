# DialogHeader

A reusable header component for dialogs and sheets, supporting three layout variants: full header with title and close button, close button only, or icon button style close.

## Figma Source

https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=176-22344&m=dev

## Accepted Design Differences

| Category | Figma | Implementation | File | Reason |
|----------|-------|----------------|------|--------|
| Close Icon | SVG assets | lucide-react X icon | DialogHeader.tsx | Project convention, consistent with other components |
| Icon Sizes | 24x24px base | 24x24px (Header/Close Only), 16x16px (Icon Button) | DialogHeader.tsx | Match Figma design specs per variant |

## Design-to-Code Mapping

### Variant Mappings

| Figma Variant | Figma Value | React Prop | React Value | Notes |
|---------------|-------------|------------|-------------|-------|
| Type | Header | `type` | `'Header'` | Title + close button (default) - 52px height |
| Type | Close Only | `type` | `'Close Only'` | Close button only, right-aligned - 52px height |
| Type | Icon Button Close | `type` | `'Icon Button Close'` | Close button in icon button style with hover - 52px height |

### Property Mappings

| Figma Property | Type | React Prop | Notes |
|----------------|------|------------|-------|
| Title | Text | `title?: string` | Only shown when type='Header' |
| Icon / x | Instance | Always rendered | Close button in all variants |

### Typography

| Element | Style | Figma Token | Values |
|---------|-------|-------------|--------|
| Title | Heading 4 | heading 4 | Font: Inter Semibold, Size: 20px, Weight: 600, Line Height: 24px |

### Layout Details

#### Header Variant
- Container: 52px height, padding 16px, items-start, justify-between
- Inner wrapper: full width, flex items-center justify-between
- Title: left-aligned
- Close button: right-aligned, 24x24px icon

#### Close Only Variant
- Container: 52px height, padding 16px, items-end
- Close button: right-aligned, 24x24px icon

#### Icon Button Close Variant
- Container: 52px height, padding-left 16px, padding-y 16px, items-end justify-center
- Icon button: 36x36px container, 16x16px icon, 8px padding, rounded-lg
- Has hover state with background color change

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `'Header' \| 'Close Only' \| 'Icon Button Close'` | `'Header'` | Layout variant |
| `title` | `string` | - | Title text (only shown for type='Header') |
| `onClose` | `() => void` | - | Close button click handler |
| `className` | `string` | - | Additional classes |

## Usage

### Full Header (Type='Header')

```tsx
import { DialogHeader } from '@/components/obra';

<DialogHeader 
  type="Header" 
  title="Settings"
  onClose={() => setIsOpen(false)}
/>
```

### Close Button Only

```tsx
<DialogHeader 
  type="Close Only"
  onClose={() => setIsOpen(false)}
/>
```

### With Custom Styling

```tsx
<DialogHeader 
  type="Header" 
  title="Edit Profile"
  onClose={handleClose}
  className="border-b pb-4"
/>
```

## Accessibility

- Close button has `aria-label="Close"` for screen readers
- Clickable area matches visual button size
- Hover/focus states on close button
- Title uses semantic heading level (h2 or configurable)

## Related Components

- **Sheet** - Uses DialogHeader in its header slot
- **AlertDialog** - Could use DialogHeader but currently has custom header
- **DialogFooter** - Companion component for footer actions
