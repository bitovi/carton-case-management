# Checkbox

A checkbox component that supports three checked states (unchecked, checked, indeterminate) and multiple visual states (default, focus, error, error focus, disabled).

## Figma Source

https://www.figma.com/design/MQUbIrlfuM8qnr9XZ7jc82/Obra-shadcn-ui--Carton-?node-id=16-1790&m=dev

## Accepted Design Differences

| Category | Figma      | Implementation            | File         | Reason                              |
| -------- | ---------- | ------------------------- | ------------ | ----------------------------------- |
| Icons    | SVG images | Kendo checkIcon/minusIcon | Checkbox.tsx | Project uses Kendo SVG icon library |
| Base     | Raw div    | Radix Checkbox            | Checkbox.tsx | Accessibility and keyboard support  |

## Design-to-Code Mapping

### Variant Mappings

| Figma Variant | Figma Value         | React Prop | React Value       | Notes                        |
| ------------- | ------------------- | ---------- | ----------------- | ---------------------------- |
| Checked       | False               | `checked`  | `false`           | Unchecked state              |
| Checked       | True                | `checked`  | `true`            | Checked with checkmark       |
| Checked       | Indeterminate       | `checked`  | `'indeterminate'` | Partial selection with minus |
| State         | Error / Error Focus | `error`    | `true`            | Red styling                  |
| State         | Disabled            | `disabled` | `true`            | 50% opacity                  |

### Property Mappings

| Figma Property | Type    | React Prop                            | Notes                             |
| -------------- | ------- | ------------------------------------- | --------------------------------- |
| Checked        | Variant | `checked: boolean \| 'indeterminate'` | Three states                      |
| State          | Variant | `error: boolean`, `disabled: boolean` | Split into separate props         |
| -              | -       | `onCheckedChange`                     | Callback for controlled component |
| -              | -       | `className`                           | Additional styling                |

### Excluded Properties (CSS/Internal)

| Figma Property     | Handling                   | Reason            |
| ------------------ | -------------------------- | ----------------- |
| State: Focus       | CSS `:focus-visible`       | Pseudo-state      |
| State: Error Focus | `error` + `:focus-visible` | Combined handling |

## Visual Specifications

### Dimensions

- Size: 16x16 pixels
- Border radius: 4px (rounded-sm)

### Focus Ring

- Normal: 3px #cbd5e1 (slate-300)
- Error: 3px #fca5a5 (red-300)
