# AlertDialog

A modal alert dialog component that displays a title, description, and action buttons with optimized layouts for desktop and mobile.

## Figma Source

https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=139-11941

## Accepted Design Differences

| Category | Figma | Implementation | File | Reason |
|----------|-------|----------------|------|--------|
| Button Configuration | Fixed "Label" text | Custom Button components via props | AlertDialog.tsx | Support different dialog scenarios with full Button customization |

## Design-to-Code Mapping

### Variant Mappings

| Figma Variant | Figma Value | React Prop | React Value | Notes |
|---------------|-------------|------------|-------------|-------|
| Type | Desktop | `type` | `'desktop'` | Horizontal buttons, left-aligned text |
| Type | Mobile | `type` | `'mobile'` | Vertical buttons, centered text (default) |

### Boolean Properties

N/A - Component has no boolean toggle properties in Figma

### Text Content

| Figma Layer | React Prop | Notes |
|-------------|------------|-------|
| Title | `title` | Required string, heading 4 style |
| Text | `description` | Required string, paragraph small style |

### Button Mappings

| Figma Element | React Prop | Type | Notes |
|---------------|------------|------|-------|
| Primary Button | `actionButton` | ReactNode | Pass a Button component with desired variant/props |
| Secondary Button | `cancelButton` | ReactNode | Pass a Button component with desired variant/props |

### Typography

| Element | Style | Figma Token | Values |
|---------|-------|-------------|--------|
| Title | Heading 4 | heading 4 | Font: Inter, Size: 20px, Weight: 600, Line Height: 24px |
| Description | Paragraph Small | paragraph small/regular | Font: Inter, Size: 14px, Weight: 400, Line Height: 21px |

### Colors

| Element | Color Token | Hex Value | Usage |
|---------|-------------|-----------|-------|
| Primary Button BG | general/primary | #0f172a | Action button background |
| Primary Button Text | general/primary foreground | #f8fafc | Action button text |
| Border | general/border | #e2e8f0 | Dialog and button borders |
| Text | general/foreground | #020617 | Title text |
| Muted Text | general/muted foreground | #64748b | Description text |
| Background | general/background | #ffffff | Dialog background |

### Spacing & Layout

| Property | Desktop | Mobile | Notes |
|----------|---------|--------|-------|
| Text Alignment | Left | Center | Controlled by `type` prop |
| Button Layout | Horizontal (flex-row) | Vertical (flex-col) | Footer direction |
| Button Alignment | Right (justify-end) | Full width | Button positioning |
| Button Order | Cancel, Primary | Primary, Cancel | Visual order differs |

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

## Code Connect Mapping

This component maps to two Figma variant nodes:
- Desktop: node-id `139:11940`
- Mobile: node-id `139:11939`

Mapping translates Figma's `Type` variant to component's `type` prop with lowercase values.

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
