# Research: Inline Editable Components

**Feature**: 004-inline-edit-components  
**Date**: 2026-01-14  
**Purpose**: Resolve technical unknowns and establish best practices before design

---

## Research Tasks

### 1. React State Machine Patterns for Multi-State Components

**Context**: BaseEditable needs to manage three states (rest, interest, edit) with transitions triggered by mouse, keyboard, and programmatic control.

**Decision**: Use `useState` with explicit state type union (`'rest' | 'interest' | 'edit'`)

**Rationale**: 
- Simple state machine with only 3 states doesn't warrant a full state machine library (XState)
- React's `useState` is sufficient for the transition logic
- Type-safe union ensures invalid states are caught at compile time
- Controlled mode (`isEditing` prop) can override internal state

**Alternatives Considered**:
- XState: Overkill for 3 simple states; adds bundle size and complexity
- useReducer: Possible but unnecessary for this use case since transitions are straightforward

---

### 2. Ref Forwarding Pattern for Auto-Focus

**Context**: BaseEditable needs to auto-focus the input element when entering edit mode, but the input is rendered by the child component via `renderEditMode`.

**Decision**: BaseEditable creates a ref (`inputRef`) and passes it to `renderEditMode`; the edit component attaches it to its focusable element

**Rationale**:
- Keeps focus management centralized in BaseEditable
- Edit components remain simple - just attach the ref
- Works with any focusable element (Input, Select trigger, Textarea, etc.)
- `useEffect` in BaseEditable triggers focus when state becomes 'edit'

**Implementation Pattern**:
```typescript
// BaseEditable
const inputRef = useRef<HTMLElement>(null);

useEffect(() => {
  if (state === 'edit' && inputRef.current) {
    inputRef.current.focus();
  }
}, [state]);

// Pass to renderEditMode
renderEditMode({ value, onSave, onCancel, inputRef })

// Edit component
<Input ref={inputRef} ... />
```

**Alternatives Considered**:
- Callback ref pattern: More flexible but unnecessary complexity
- Auto-focus attribute on input: Doesn't work reliably for dynamic mounting

---

### 3. Zod Validation Integration Pattern

**Context**: Components need to accept consumer-provided validation (preferably Zod schemas) and display errors.

**Decision**: Accept `validate` prop as either a Zod schema or a function `(value: T) => string | null`

**Rationale**:
- Zod is already in the project (used for API validation)
- Function alternative allows non-Zod validation without adding another dependency
- Unified error handling regardless of validation approach
- Validation runs before `onSave` is called

**Implementation Pattern**:
```typescript
type ValidateProp<T> = 
  | ZodSchema<T> 
  | ((value: T) => string | null);

function runValidation<T>(value: T, validate?: ValidateProp<T>): string | null {
  if (!validate) return null;
  
  if ('safeParse' in validate) {
    // It's a Zod schema
    const result = validate.safeParse(value);
    return result.success ? null : result.error.errors[0]?.message ?? 'Invalid';
  }
  
  // It's a function
  return validate(value);
}
```

**Alternatives Considered**:
- Zod-only: Less flexible for simple validation needs
- Separate `zodSchema` and `validate` props: More confusing API

---

### 4. Async Save Error Handling Pattern

**Context**: `onSave` returns `Promise<void>`; errors need to be caught and displayed in the component.

**Decision**: Component catches rejected promises, extracts `Error.message`, re-enters edit mode with attempted value, and displays error inline.

**Rationale**:
- Keep components generic - they don't know about API implementation
- Error.message is the standard way to communicate error details
- Re-entering edit mode allows immediate retry
- Inline error (below input) is consistent with validation errors

**Implementation Pattern**:
```typescript
const [error, setError] = useState<string | null>(null);
const [pendingValue, setPendingValue] = useState<T | null>(null);

const handleSave = async (newValue: T) => {
  setError(null);
  setPendingValue(newValue);
  setState('saving'); // Shows spinner
  
  try {
    await onSave(newValue);
    setPendingValue(null);
    setState('rest');
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Save failed');
    setState('edit'); // Re-enter edit mode with pendingValue
  }
};
```

**Alternatives Considered**:
- Toast notifications: User requested no toasts
- Stay in saving state with error indicator: User preferred re-entering edit mode

---

### 5. Click-Outside Detection Pattern

**Context**: When user clicks outside an editing field, it should cancel and return to rest state.

**Decision**: Use native `onBlur` with `relatedTarget` check, plus optional click-outside handler for edge cases.

**Rationale**:
- `onBlur` handles most cases when focus moves away
- `relatedTarget` check prevents closing when clicking save/cancel buttons
- Simpler than adding a click-outside library
- Works with keyboard navigation (Tab away)

**Implementation Pattern**:
```typescript
const handleBlur = (e: React.FocusEvent) => {
  // Check if focus moved to a child element (like save button)
  if (containerRef.current?.contains(e.relatedTarget as Node)) {
    return;
  }
  handleCancel();
};
```

**Alternatives Considered**:
- Click-outside hook/library: Adds dependency; native approach is sufficient
- No auto-cancel: User explicitly requested click-outside should cancel

---

### 6. Existing Component Analysis

**Context**: Understand current `EditableSelect` and `EditableTitle` implementations to ensure migration compatibility.

**Findings**:

| Feature | EditableSelect | EditableTitle | New Components |
|---------|----------------|---------------|----------------|
| States | editing/display | editing/display | rest/interest/edit |
| Hover feedback | Tooltip only | Tooltip only | Background highlight |
| Keyboard entry | None | None | Enter to edit |
| Loading indicator | None | isLoading prop | Spinner beside value |
| Validation | None | None | Zod/function prop |
| Error handling | None | Implicit | Inline error message |
| Controlled mode | alwaysEditing | None | isEditing prop |

**Migration Notes**:
- `EditableSelect.alwaysEditing` maps to `BaseEditable.isEditing={true}`
- `EditableTitle.isLoading` behavior preserved
- New hover/keyboard states are additive (non-breaking UX enhancement)
- Props are similar enough for straightforward migration

---

### 7. Shadcn UI Component Usage

**Context**: Identify which existing Shadcn components will be used.

**Decision**: Use existing components from `packages/client/src/components/ui/`:

| Edit Component | Shadcn Dependencies |
|----------------|---------------------|
| EditableText | Input |
| EditableTextarea | Textarea |
| EditableSelect | Select, SelectTrigger, SelectContent, SelectItem |
| EditableDate | DatePicker (uses Popover + Calendar) |
| EditableNumber | Input (type="number" or custom) |
| EditableCurrency | Input with $ prefix decoration |
| EditablePercent | Input with % suffix decoration |
| EditableTitle | Input (styled as heading) |
| All | Button (icon buttons for save/cancel) |

**Rationale**: Constitution requires using existing Shadcn components first. All needed primitives are already available.

---

## Summary

All technical unknowns have been resolved:

1. ✅ State management: `useState` with union type
2. ✅ Auto-focus: Ref forwarding via `inputRef` prop
3. ✅ Validation: Zod schema or function via `validate` prop  
4. ✅ Error handling: Catch promise rejection, re-enter edit mode, inline error
5. ✅ Click-outside: `onBlur` with `relatedTarget` check
6. ✅ Migration: Straightforward prop mapping; new features are additive
7. ✅ Dependencies: All Shadcn components already available

**Ready for Phase 1: Design & Contracts**
