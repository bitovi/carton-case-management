# Contract: Component Variants API

**Feature**: 004-inline-edit-components  
**Date**: 2026-01-14  
**Components**: EditableText, EditableTextarea, EditableSelect, EditableDate, EditableNumber, EditableCurrency, EditablePercent, EditableTitle

---

## EditableText

### Props

```typescript
interface EditableTextProps {
  label: string;
  value: string;
  onSave: (newValue: string) => Promise<void>;
  readonly?: boolean;
  placeholder?: string;
  validate?: ZodSchema<string> | ((value: string) => string | null);
  className?: string;
}
```

### Behavior

- **Edit UI**: Single-line Input with check/x icon buttons
- **Save Trigger**: Explicit (click check or press Enter)
- **Keyboard**: Enter = save, Escape = cancel

### Usage

```tsx
<EditableText
  label="Email"
  value={email}
  placeholder="Enter email..."
  validate={z.string().email("Invalid email format")}
  onSave={async (value) => await updateEmail(value)}
/>
```

---

## EditableTextarea

### Props

```typescript
interface EditableTextareaProps {
  label: string;
  value: string;
  onSave: (newValue: string) => Promise<void>;
  readonly?: boolean;
  placeholder?: string;
  validate?: ZodSchema<string> | ((value: string) => string | null);
  rows?: number;
  className?: string;
}
```

### Behavior

- **Edit UI**: Multi-line Textarea with Save/Cancel text buttons
- **Save Trigger**: Explicit (click Save button)
- **Keyboard**: Escape = cancel (Enter adds newline)
- **Note**: No interest state hover effect (direct to edit on click)

### Usage

```tsx
<EditableTextarea
  label="Description"
  value={description}
  placeholder="Enter description..."
  rows={4}
  onSave={async (value) => await updateDescription(value)}
/>
```

---

## EditableSelect

### Props

```typescript
interface EditableSelectOption {
  value: string;
  label: string;
}

interface EditableSelectProps {
  label: string;
  value: string;
  options: EditableSelectOption[];
  onSave: (newValue: string) => Promise<void>;
  readonly?: boolean;
  placeholder?: string;
  allowEmpty?: boolean;
  emptyLabel?: string;
  className?: string;
}
```

### Behavior

- **Edit UI**: Select dropdown (Shadcn Select component)
- **Save Trigger**: Auto-save on selection
- **Keyboard**: Arrow keys to navigate, Enter to select
- **Close Behavior**: Closing dropdown without selection = cancel

### Usage

```tsx
<EditableSelect
  label="Status"
  value={status}
  options={[
    { value: 'open', label: 'Open' },
    { value: 'closed', label: 'Closed' },
  ]}
  allowEmpty
  emptyLabel="No status"
  onSave={async (value) => await updateStatus(value)}
/>
```

---

## EditableDate

### Props

```typescript
interface EditableDateProps {
  label: string;
  value: Date | null;
  onSave: (newValue: Date | null) => Promise<void>;
  readonly?: boolean;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}
```

### Behavior

- **Edit UI**: DatePicker (Shadcn Popover + Calendar)
- **Save Trigger**: Auto-save on date selection
- **Display Format**: Localized date string (e.g., "Jan 14, 2026")
- **Close Behavior**: Closing without selection = cancel

### Usage

```tsx
<EditableDate
  label="Due Date"
  value={dueDate}
  placeholder="Select date..."
  minDate={new Date()}
  onSave={async (value) => await updateDueDate(value)}
/>
```

---

## EditableNumber

### Props

```typescript
interface EditableNumberProps {
  label: string;
  value: number | null;
  onSave: (newValue: number | null) => Promise<void>;
  readonly?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  validate?: ZodSchema<number | null> | ((value: number | null) => string | null);
  className?: string;
}
```

### Behavior

- **Edit UI**: Numeric input with check/x icon buttons
- **Save Trigger**: Explicit (click check or press Enter)
- **Input Type**: `inputMode="numeric"` with manual validation
- **Empty Handling**: Empty input = `null` value

### Usage

```tsx
<EditableNumber
  label="Quantity"
  value={quantity}
  placeholder="0"
  min={0}
  max={100}
  validate={z.number().int("Must be a whole number")}
  onSave={async (value) => await updateQuantity(value)}
/>
```

---

## EditableCurrency

### Props

```typescript
interface EditableCurrencyProps {
  label: string;
  value: number | null;
  onSave: (newValue: number | null) => Promise<void>;
  readonly?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  currencySymbol?: string; // Default: '$'
  validate?: ZodSchema<number | null> | ((value: number | null) => string | null);
  className?: string;
}
```

### Behavior

- **Edit UI**: Input with $ prefix + check/x icon buttons
- **Save Trigger**: Explicit
- **Display Format**: Currency formatted (e.g., "$1,234.56")
- **Input**: Accepts numeric input, formats on blur/save

### Usage

```tsx
<EditableCurrency
  label="Amount"
  value={amount}
  placeholder="0.00"
  min={0}
  onSave={async (value) => await updateAmount(value)}
/>
```

---

## EditablePercent

### Props

```typescript
interface EditablePercentProps {
  label: string;
  value: number | null; // Stored as decimal (0.5 = 50%)
  onSave: (newValue: number | null) => Promise<void>;
  readonly?: boolean;
  placeholder?: string;
  min?: number; // As decimal (0 = 0%)
  max?: number; // As decimal (1 = 100%)
  validate?: ZodSchema<number | null> | ((value: number | null) => string | null);
  className?: string;
}
```

### Behavior

- **Edit UI**: Input with % suffix + check/x icon buttons
- **Save Trigger**: Explicit
- **Display Format**: Percentage (e.g., "50%")
- **Value Conversion**: Display shows `value * 100`, stores as decimal

### Usage

```tsx
<EditablePercent
  label="Completion"
  value={completion} // 0.75
  placeholder="0"
  min={0}
  max={1}
  onSave={async (value) => await updateCompletion(value)}
/>
// Displays: "75%"
```

---

## EditableTitle

### Props

```typescript
interface EditableTitleProps {
  label?: string; // Optional - titles often don't need labels
  value: string;
  onSave: (newValue: string) => Promise<void>;
  readonly?: boolean;
  placeholder?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  validate?: ZodSchema<string> | ((value: string) => string | null);
  className?: string;
}
```

### Behavior

- **Edit UI**: Large text input (styled as heading) with check/x icons
- **Save Trigger**: Explicit
- **Display**: Renders as semantic heading element (h1-h6)
- **Visual Size**: Matches heading level typography

### Usage

```tsx
<EditableTitle
  value={caseTitle}
  headingLevel={1}
  placeholder="Untitled Case"
  validate={z.string().min(1, "Title required")}
  onSave={async (value) => await updateTitle(value)}
/>
```

---

## Common Patterns

### All Components Support

| Feature | Prop | Default |
|---------|------|---------|
| Read-only mode | `readonly` | `false` |
| Custom styling | `className` | `''` |
| Async save | `onSave` returns Promise | Required |
| Validation | `validate` | `undefined` |

### Save Behavior Summary

| Component | Save Trigger |
|-----------|--------------|
| EditableText | Explicit (Enter/Check) |
| EditableTextarea | Explicit (Save button) |
| EditableSelect | Auto (on selection) |
| EditableDate | Auto (on selection) |
| EditableNumber | Explicit (Enter/Check) |
| EditableCurrency | Explicit (Enter/Check) |
| EditablePercent | Explicit (Enter/Check) |
| EditableTitle | Explicit (Enter/Check) |
