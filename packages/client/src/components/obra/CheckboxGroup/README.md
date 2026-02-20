# CheckboxGroup

A checkbox with label text component supporting inline and block layouts.

## Figma Source

https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=19-6040&m=dev

## Accepted Design Differences

| Category | Figma | Implementation | File | Reason |
|----------|-------|----------------|------|--------|
| - | - | - | - | No differences |

## Design-to-Code Mapping

### Variant Mappings

| Figma Variant | Figma Value | React Prop | React Value | Notes |
|---------------|-------------|------------|-------------|-------|
| Layout | Inline | `layout` | `'inline'` | Inline-flex display (flows with text) |
| Layout | Block | `layout` | `'block'` | Block-level flex display (takes full width) |
| Checked? | False | `checked` | `false` | Unchecked state |
| Checked? | True | `checked` | `true` | Checked state |

### Property Mappings

| Figma Property | Type | React Prop | Notes |
|----------------|------|------------|-------|
| Layout | Enum | `layout` | 'inline' or 'block' |
| Checked? | Boolean | `checked` | Checkbox checked state |
| Label | Text | `label` | Label text content |

### Excluded Properties (CSS/Internal)

| Figma Property | Handling | Reason |
|----------------|----------|--------|
| - | - | No CSS-only properties |
