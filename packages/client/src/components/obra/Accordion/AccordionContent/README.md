# AccordionContent

The collapsible content area that appears when an accordion item is expanded.

## Figma Source

https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=66-5041&m=dev

## Accepted Design Differences

| Category | Figma | Implementation | File | Reason |
|----------|-------|----------------|------|--------|
| Animation | Not specified | CSS animation | AccordionContent.tsx | Smooth expand/collapse |
| Height | Fixed | Auto | AccordionContent.tsx | Flexible content support |

## Design-to-Code Mapping

### Property Mappings

| Figma Property | Type | React Prop | Notes |
|----------------|------|------------|-------|
| Content Text | Text | `children` | Content body |

### Excluded Properties (CSS/Internal)

| Figma Property | Handling | Reason |
|----------------|----------|--------|
| State: Open/Closed | Radix `data-state` | Animation triggered by state |
| Overflow | `overflow-hidden` | Required for animation |
