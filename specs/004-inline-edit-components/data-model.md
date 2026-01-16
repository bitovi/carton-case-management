# Data Model: Inline Editable Components

**Feature**: 004-inline-edit-components  
**Date**: 2026-01-14  
**Purpose**: Define component interfaces, state types, and prop contracts

---

## Core Types

### EditableState

The three possible states for an editable component:

```typescript
type EditableState = 'rest' | 'interest' | 'edit' | 'saving';
```

| State | Description | Visual |
|-------|-------------|--------|
| `rest` | Default display state | Label + value (plain text) |
| `interest` | User hovering or focused | Label + value with gray-200 background |
| `edit` | Actively editing | Input/control with save/cancel UI |
| `saving` | Save in progress | Value with spinner beside it |

### State Transitions

```text
rest ──hover/focus──► interest ──click/enter──► edit ──save──► saving ──success──► rest
  ▲                      │                        │               │
  │                      │                        │               │
  └──────mouseout────────┘                        │               │
  └───────────────────cancel/escape───────────────┘               │
  └───────────────────────────────────error────────────────────────┘ (re-enter edit)
```

---

## BaseEditable Interface

### Props

```typescript
interface RenderEditModeProps<T> {
  /** Current value to edit */
  value: T;
  /** Call to save the new value */
  onSave: (newValue: T) => void;
  /** Call to cancel editing (revert to rest) */
  onCancel: () => void;
  /** Ref to attach to the focusable input element */
  inputRef: React.RefObject<HTMLElement>;
  /** Current validation/save error message, if any */
  error: string | null;
  /** Clear the current error */
  clearError: () => void;
}

interface BaseEditableProps<T> {
  // === Core Data ===
  /** Field label text */
  label: string;
  /** Current field value */
  value: T;
  
  // === Display ===
  /** How to render value in rest/interest states. Defaults to String(value) */
  displayValue?: React.ReactNode;
  /** Additional CSS classes for the container */
  className?: string;
  
  // === State Control ===
  /** If true, locks component in rest state (not interactive) */
  readonly?: boolean;
  
  // === Controlled Mode ===
  /** Force the component into edit mode (controlled) */
  isEditing?: boolean;
  /** Called when edit state changes (controlled) */
  onEditingChange?: (editing: boolean) => void;
  
  // === Edit Mode ===
  /** Render function for the edit mode UI */
  renderEditMode: (props: RenderEditModeProps<T>) => React.ReactNode;
  
  // === Callbacks ===
  /** Called when user saves. Must return Promise for async save handling */
  onSave: (newValue: T) => Promise<void>;
  
  // === Validation ===
  /** Zod schema or function for validating before save */
  validate?: ZodSchema<T> | ((value: T) => string | null);
}
```

### Internal State

```typescript
interface BaseEditableState<T> {
  /** Current UI state */
  state: EditableState;
  /** Value being saved (for optimistic display during save) */
  pendingValue: T | null;
  /** Current error message (validation or save error) */
  error: string | null;
}
```

---

## Component Variant Interfaces

### EditableText

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

### EditableTextarea

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

### EditableSelect

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

### EditableDate

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

### EditableNumber

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

### EditableCurrency

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

### EditablePercent

```typescript
interface EditablePercentProps {
  label: string;
  value: number | null; // Stored as decimal (0.5 = 50%)
  onSave: (newValue: number | null) => Promise<void>;
  readonly?: boolean;
  placeholder?: string;
  min?: number; // As decimal
  max?: number; // As decimal
  validate?: ZodSchema<number | null> | ((value: number | null) => string | null);
  className?: string;
}
```

### EditableTitle

```typescript
interface EditableTitleProps {
  label?: string; // Optional for titles
  value: string;
  onSave: (newValue: string) => Promise<void>;
  readonly?: boolean;
  placeholder?: string;
  headingLevel?: 1 | 2 | 3 | 4 | 5 | 6;
  validate?: ZodSchema<string> | ((value: string) => string | null);
  className?: string;
}
```

---

## Validation Types

```typescript
import { ZodSchema } from 'zod';

/** Validation can be a Zod schema or a simple function */
type ValidateProp<T> = ZodSchema<T> | ((value: T) => string | null);

/** Run validation and return error message or null */
function runValidation<T>(value: T, validate?: ValidateProp<T>): string | null {
  if (!validate) return null;
  
  // Zod schema
  if ('safeParse' in validate) {
    const result = validate.safeParse(value);
    return result.success ? null : result.error.errors[0]?.message ?? 'Invalid value';
  }
  
  // Function
  return validate(value);
}
```

---

## Visual Design Tokens (from Figma)

```typescript
const DESIGN_TOKENS = {
  // Typography
  label: {
    fontSize: '12px',      // 0.75rem
    color: '#192627',      // gray-950
  },
  content: {
    fontSize: '14px',      // 0.875rem
    color: '#020617',      // foreground
  },
  
  // Spacing
  gap: '4px',              // Between label and content
  padding: {
    horizontal: '4px',
    vertical: '2px',
  },
  borderRadius: '4px',
  
  // States
  interestBackground: '#dfe2e2', // gray-200
  errorBorder: '#ef4444',        // red-500
  
  // Title variant
  title: {
    h1: '2rem',
    h2: '1.5rem',
    h3: '1.25rem',
    h4: '1.125rem',
    h5: '1rem',
    h6: '0.875rem',
  },
} as const;
```

---

## Relationships

```text
┌─────────────────────────────────────────────────────────────┐
│                      BaseEditable<T>                         │
│  - Manages state machine (rest/interest/edit/saving)        │
│  - Handles hover/focus/keyboard transitions                 │
│  - Renders label + displayValue (rest/interest/saving)      │
│  - Renders renderEditMode output (edit)                     │
│  - Handles validation before save                           │
│  - Catches save errors and re-enters edit mode              │
└──────────────────────────┬──────────────────────────────────┘
                           │ composes
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│EditableText │   │EditableSelect│  │EditableDate │  ...
│             │   │             │   │             │
│ Uses:       │   │ Uses:       │   │ Uses:       │
│ - Input     │   │ - Select    │   │ - DatePicker│
│ - Check/X   │   │ (auto-save) │   │ (auto-save) │
└─────────────┘   └─────────────┘   └─────────────┘
```

---

## Migration Mapping

| Old Component | Old Prop | New Component | New Prop |
|---------------|----------|---------------|----------|
| EditableSelect | value | EditableSelect | value |
| EditableSelect | options | EditableSelect | options |
| EditableSelect | onChange | EditableSelect | onSave (Promise) |
| EditableSelect | disabled | EditableSelect | readonly |
| EditableSelect | alwaysEditing | BaseEditable | isEditing={true} |
| EditableTitle | value | EditableTitle | value |
| EditableTitle | onSave | EditableTitle | onSave |
| EditableTitle | isLoading | N/A | (handled internally via Promise) |
| EditableTitle | headingLevel | EditableTitle | headingLevel |
