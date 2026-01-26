# Sheet

A side panel or drawer overlay component with configurable header, scrollable content area, and optional footer. Designed for detailed views, settings panels, or forms that don't require full page navigation.

## Figma Source

https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=301-243831&m=dev

## Accepted Design Differences

| Category | Figma | Implementation | File | Reason |
|----------|-------|----------------|------|--------|
| Header Content | Fixed DialogHeader instance | Flexible `header` prop slot | Sheet.tsx | Support different header configurations (DialogHeader types or custom) |
| Footer Content | Fixed button layout | Flexible `footer` prop slot | Sheet.tsx | Support different action button configurations via DialogFooter |
| Overlay | Not explicitly shown | Implemented with backdrop | Sheet.tsx | Standard pattern for modal/overlay UI |

## Design-to-Code Mapping

### Variant Mappings

| Figma Variant | Figma Value | React Prop | React Value | Notes |
|---------------|-------------|------------|-------------|-------|
| Scrollable | True | `scrollable` | `true` | Content area has overflow-y-auto (default) |
| Scrollable | False | `scrollable` | `false` | Content area height matches content |

### Component Slots

| Figma Element | React Prop | Type | Notes |
|---------------|------------|------|-------|
| DialogHeader Instance | `header` | ReactNode | Typically DialogHeader component, but allows custom |
| Content Area | `children` | ReactNode | Main content area, scrollable based on variant |
| Footer Area (buttons) | `footer` | ReactNode | Typically DialogFooter with action buttons |

### Typography

Content typography determined by child components - Sheet provides container only.

### Colors

| Element | Token | Value |
|---------|-------|-------|
| Overlay | backdrop | rgba(0, 0, 0, 0.5) |
| Panel Background | background | var(--background) |
| Border | border | var(--border) |

### Shadows

| Element | Style | Value |
|---------|-------|-------|
| Panel | shadow-lg | DROP_SHADOW with lg values from design system |

### Layout

| Property | Value | Notes |
|----------|-------|-------|
| Panel Width | 400px (sm+ screens) | Fixed width on larger screens |
| Panel Width | 100vw (mobile) | Full width on mobile |
| Panel Position | Right edge | Slides in from right |
| Content Padding | p-6 | 24px padding |
| Header Padding | p-6 pb-4 | Top/side padding, reduced bottom |
| Footer Padding | p-6 pt-4 | Bottom/side padding, reduced top |

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
