# AccordionTrigger

The trigger button that toggles the accordion panel. Shows chevron icon that rotates based on open/closed state.

## Figma Source

- **Open State**: https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=288-122455&m=dev
- **Closed State**: https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=288-122455&m=dev
- **Focus State**: https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=288-122455&m=dev

## Accepted Design Differences

| Category         | Figma         | Implementation          | File                 | Reason                            |
| ---------------- | ------------- | ----------------------- | -------------------- | --------------------------------- |
| Icon             | Static SVG    | Kendo caretAltDownIcon  | AccordionTrigger.tsx | Using consistent icon library     |
| State Management | Variant prop  | Radix data-state        | AccordionTrigger.tsx | Radix handles state automatically |
| Focus Ring       | Shadow effect | Tailwind ring utilities | AccordionTrigger.tsx | Standard focus-visible pattern    |

## Design-to-Code Mapping

### Variant Mappings

| Figma Variant | Figma Value | React Prop       | React Value | Notes               |
| ------------- | ----------- | ---------------- | ----------- | ------------------- |
| State         | Open        | `data-state`     | `'open'`    | Controlled by Radix |
| State         | Closed      | `data-state`     | `'closed'`  | Controlled by Radix |
| State         | Focus       | `:focus-visible` | n/a         | CSS pseudo-state    |

### Property Mappings

| Figma Property | Type | React Prop | Notes               |
| -------------- | ---- | ---------- | ------------------- |
| Label          | Text | `children` | Trigger button text |

### Excluded Properties (CSS/Internal)

| Figma Property | Handling                              | Reason                  |
| -------------- | ------------------------------------- | ----------------------- |
| State: Hover   | Tailwind `hover:`                     | Pseudo-state            |
| State: Focus   | Tailwind `focus-visible:ring`         | Pseudo-state            |
| Icon Rotation  | `[&[data-state=open]>svg]:rotate-180` | Data attribute selector |
