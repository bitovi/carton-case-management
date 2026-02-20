# RichCheckboxGroup

A bordered checkbox with label component supporting normal and flipped layouts.

## Figma Source

https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=19-6351&m=dev

## Accepted Design Differences

| Category | Figma | Implementation | File | Reason |
|----------|-------|----------------|------|--------|
| - | - | - | - | No differences |

## Design-to-Code Mapping

### Variant Mappings

| Figma Variant | Figma Value | React Prop | React Value | Notes |
|---------------|-------------|------------|-------------|-------|
| Checked? | False | `checked` | `false` | Unchecked state |
| Checked? | True | `checked` | `true` | Checked state |
| Flipped | False | `flipped` | `false` | Checkbox on left, label on right |
| Flipped | True | `flipped` | `true` | Label on left, checkbox on right |
| Show Line 2 | False | `showLine2` | `false` | Single line label only |
| Show Line 2 | True | `showLine2` | `true` | Label with secondary text below |

### Property Mappings

| Figma Property | Type | React Prop | Notes |
|----------------|------|------------|-------|
| Checked? | Boolean | `checked` | Checkbox checked state |
| Flipped | Boolean | `flipped` | Swap checkbox and label positions |
| Show Line 2 | Boolean | `showLine2` | Show secondary text line |
| Label | Text | `label` | Primary label text |
| Secondary text | Text | `secondaryText` | Secondary text (shown when showLine2 is true) |

### Excluded Properties (CSS/Internal)

| Figma Property | Handling | Reason |
|----------------|----------|--------|
| Border | Tailwind `border` | CSS styling |
| Padding | Tailwind `p-3` | CSS styling |
