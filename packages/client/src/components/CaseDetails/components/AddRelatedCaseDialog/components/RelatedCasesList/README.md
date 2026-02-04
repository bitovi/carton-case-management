# RelatedCasesList

A list component for displaying related cases with checkboxes for selection.

## Figma Source

https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=1043-2055&t=zyzhjKzF6UhJmOTN-4

## Accepted Design Differences

| Category | Figma | Implementation | File | Reason |
|----------|-------|----------------|------|--------|
| - | - | - | - | - |

## Design-to-Code Mapping

### Property Mappings

| Figma Property | Type | React Prop | Notes |
|----------------|------|------------|-------|
| Title | Text | `title` | Header text |
| Cases | Array | `cases` | List of case items |
| Selected | Boolean Array | `selectedCases` | Checked state per case |

### Excluded Properties (CSS/Internal)

| Figma Property | Handling | Reason |
|----------------|----------|--------|
| Hover | Tailwind `hover:` | Pseudo-state |