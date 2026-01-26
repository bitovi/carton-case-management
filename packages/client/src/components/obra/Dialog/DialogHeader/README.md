# DialogHeader

A reusable header component for dialogs and sheets, supporting three layout variants: full header with title and close button, close button only, or icon button style close.

## Figma Source

https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=176-22345 (Type=Header)
https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=176-22529 (Type=Close Only)

## Accepted Design Differences

| Category | Figma | Implementation | File | Reason |
|----------|-------|----------------|------|--------|
| Close Icon | SVG assets | lucide-react X icon | DialogHeader.tsx | Project convention, consistent with other components |

## Design-to-Code Mapping

### Variant Mappings

| Figma Variant | Figma Value | React Prop | React Value | Notes |
|---------------|-------------|------------|-------------|-------|
| Type | Header | `type` | `'Header'` | Title + close button layout (default) |
| Type | Close Only | `type` | `'Close Only'` | Close button only, no title |
| Type | Icon Button Close | `type` | `'Icon Button Close'` | Alias to 'Close Only' (no visual difference found) |

### Text Content

| Figma Layer | React Prop | Notes |
|-------------|------------|-------|
| Title | `title` | Optional string, only shown when type='Header' |

### Typography

| Element | Style | Figma Token | Values |
|---------|-------|-------------|--------|
| Title | Heading 4 | heading 4 | Font: Inter Semibold, Size: 20px, Weight: 600, Line Height: 24px |

### Colors

| Element | Token | Value |
|---------|-------|-------|
| Title Text | foreground | var(--general/foreground, #020617) |
| Close Icon | muted-foreground | rgba(71, 85, 105, 1) / slate-600 |

### Layout

| Property | Value | Notes |
|----------|-------|-------|
| Container | flex items-center justify-between | Horizontal layout with space-between |
| Title Position | Left-aligned | Flex start |
| Close Position | Right-aligned | Flex end |
| Close Icon Size | 16x16px | From Figma "Icon / x" |
| Gap | Auto (space-between) | Dynamic spacing |

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
