# RelationshipManagerAccordion

An accordion component for displaying related cases with expand/collapse functionality.

## Figma Source

https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=1040-1662&t=zyzhjKzF6UhJmOTN-4

## Accepted Design Differences

| Category | Figma | Implementation | File | Reason |
|----------|-------|----------------|------|--------|
| - | - | - | - | - |

## Design-to-Code Mapping

### Variant Mappings

| Figma Variant | Figma Value | React Prop | React Value | Notes |
|---------------|-------------|------------|-------------|-------|
| State | Closed | `defaultOpen` | `false` | Accordion collapsed |
| State | Open | `defaultOpen` | `true` | Accordion expanded |

### Property Mappings

| Figma Property | Type | React Prop | Notes |
|----------------|------|------------|-------|
| - | Children | `children` | Case list content |

### Excluded Properties (CSS/Internal)

| Figma Property | Handling | Reason |
|----------------|----------|--------|
| Hover | Tailwind `hover:` | Pseudo-state |
| Focus | Tailwind `focus-visible:` | Pseudo-state |