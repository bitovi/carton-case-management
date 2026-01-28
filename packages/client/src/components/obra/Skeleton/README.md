# Skeleton

A loading placeholder component that displays animated shapes to indicate content is loading. Provides three preset variants for common use cases.

## Figma Source

https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=303-246698&m=dev

## Accepted Design Differences

| Category | Figma | Implementation | File | Reason |
|----------|-------|----------------|------|--------|
| Variants | No explicit variants | Three variants (avatar, line, object) | Skeleton.tsx | Added common presets for better DX while maintaining design flexibility |
| Dimensions | Fixed 320x160 | Flexible sizing | Skeleton.tsx | Allows reuse across different contexts |

## Design-to-Code Mapping

### Variant Mappings

| React Prop | React Value | Visual Appearance | Default Size | Notes |
|------------|-------------|-------------------|--------------|-------|
| `variant` | `'avatar'` | Circular | 40x40px (h-10 w-10) | For user profile pictures |
| `variant` | `'line'` | Thin rectangle | h-4, w-full | For text line placeholders |
| `variant` | `'object'` | Rectangle | Flexible | Default - for cards, images, etc. |

### Property Mappings

| Figma Property | Type | React Prop | Notes |
|----------------|------|------------|-------|
| Fill Color | rgba(248, 250, 252, 1) | CSS class `bg-slate-50` | Light gray background |
| - | - | `className` | Allows size and style overrides |

### Excluded Properties (CSS/Internal)

| Figma Property | Handling | Reason |
|----------------|----------|--------|
| Animation | Tailwind `animate-pulse` | Loading state indicator |
| Border Radius | Variant-specific classes | Automatically applied per variant |
