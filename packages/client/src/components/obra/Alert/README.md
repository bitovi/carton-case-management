# Alert

Informational alert component that displays important messages to users with optional icon, description, and action button.

## Figma Source

https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=58-5416&t=I5A0QLIu4RNqO53t-4

## Accepted Design Differences

| Category | Figma | Implementation | File | Reason |
|----------|-------|----------------|------|--------|
| Width | Fixed 400px | Auto (100%) | Alert.tsx | Flexible responsive layout |
| Icon Component | Complex nested SVG | React Icon prop | Alert.tsx | Flexible icon system |

## Design-to-Code Mapping

### Variant Mappings

| Figma Variant | Figma Value | React Prop | React Value | Notes |
|---------------|-------------|------------|-------------|-------|
| Type | Neutral | `type` | `'Neutral'` | Gray/neutral styling |
| Type | Error | `type` | `'Error'` | Red/error styling |

### Property Mappings

| Figma Property | Type | React Prop | Notes |
|----------------|------|------------|-------|
| Line 1 | Text | `children` | Primary alert text |
| Line 2 | Text | `description` | Optional secondary text |
| Show Line 2 | Boolean | `showLine2` | Controls description visibility |
| Show Icon | Boolean | `showIcon` | Controls icon visibility |
| Icon | Instance | `icon` | React icon component/element |
| Flip Icon | Boolean | `flipIcon` | Controls icon placement (false=start, true=end) |
| Show Button | Boolean | `showButton` | Controls action button visibility |
| Button | Instance | `action` | React button component/element |

### Excluded Properties (CSS/Internal)

| Figma Property | Handling | Reason |
|----------------|----------|--------|
| Border Color | Tailwind utility classes | Controlled by type variant |
| Background Color | Tailwind utility classes | Controlled by type variant |
| Padding/Spacing | Tailwind spacing tokens | Layout styling |

## Component API

See `types.ts` for the full component API.
