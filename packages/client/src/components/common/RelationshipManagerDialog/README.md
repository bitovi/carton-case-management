# RelationshipManagerDialog

A dialog component for adding related cases with checkbox selection.

## Figma Source

https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=1043-1742&t=zyzhjKzF6UhJmOTN-4

## Accepted Design Differences

| Category | Figma | Implementation | File | Reason |
|----------|-------|----------------|------|--------|
| - | - | - | - | - |

## Design-to-Code Mapping

### Property Mappings

| Figma Property | Type | React Prop | Notes |
|----------------|------|------------|-------|
| Open | Boolean | `open` | Dialog visibility |
| Cases | Array | `cases` | List of available cases |
| Selected Cases | Array | `selectedCases` | IDs of selected cases |

### Excluded Properties (CSS/Internal)

| Figma Property | Handling | Reason |
|----------------|----------|--------|
| Shadow | Tailwind `shadow-lg` | CSS styling |