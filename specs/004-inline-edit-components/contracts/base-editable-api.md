# Contract: BaseEditable Component API

**Feature**: 004-inline-edit-components  
**Date**: 2026-01-14  
**Component**: BaseEditable<T>

---

## Purpose

Foundation component that manages the state machine, interactions, and composition pattern for all inline editable components.

---

## Props Contract

```typescript
interface BaseEditableProps<T> {
  // Required
  label: string;
  value: T;
  onSave: (newValue: T) => Promise<void>;
  renderEditMode: (props: RenderEditModeProps<T>) => React.ReactNode;
  
  // Optional
  displayValue?: React.ReactNode;
  className?: string;
  readonly?: boolean;
  isEditing?: boolean;
  onEditingChange?: (editing: boolean) => void;
  validate?: ZodSchema<T> | ((value: T) => string | null);
}
```

---

## Behavior Contract

### State Transitions

| From | Trigger | To | Condition |
|------|---------|-----|-----------|
| rest | mouseenter (content) | interest | !readonly |
| rest | focus | interest | !readonly |
| interest | mouseleave | rest | - |
| interest | blur (no focus in container) | rest | - |
| interest | click | edit | - |
| interest | Enter key | edit | - |
| edit | onSave called | saving | validation passes |
| edit | onCancel called | rest | - |
| edit | Escape key | rest | - |
| edit | blur (outside container) | rest | (cancel) |
| saving | promise resolves | rest | - |
| saving | promise rejects | edit | (with error, pendingValue) |

### Keyboard Interactions

| Key | State | Action |
|-----|-------|--------|
| Tab | rest | Move to next element (if readonly, skip) |
| Tab | interest | Move to next element, trigger blur → rest |
| Enter | interest | Transition to edit |
| Enter | edit | Handled by edit component (typically save) |
| Escape | edit | Cancel, return to rest |

### Focus Management

1. When entering edit state, auto-focus element via `inputRef`
2. Focus trap: Tab within edit mode stays in container (save/cancel buttons)
3. Blur detection: If focus leaves container entirely, cancel edit

---

## Accessibility Contract

| Requirement | Implementation |
|-------------|----------------|
| Keyboard operable | Tab to focus, Enter to edit, Escape to cancel |
| Focus visible | Interest state shows background highlight |
| Screen reader | Label associated with interactive area |
| Readonly state | `tabIndex={-1}` when readonly |

---

## Render Contract

### Rest/Interest State

```tsx
<div className={containerClasses}>
  <span className="label">{label}</span>
  <div 
    className={contentClasses} // interest adds bg-gray-200
    tabIndex={readonly ? -1 : 0}
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    onFocus={handleFocus}
    onBlur={handleBlur}
    onClick={handleClick}
    onKeyDown={handleKeyDown}
  >
    {displayValue ?? String(value)}
  </div>
</div>
```

### Edit State

```tsx
<div className={containerClasses}>
  <span className="label">{label}</span>
  <div className={editContainerClasses} onBlur={handleContainerBlur}>
    {renderEditMode({
      value: pendingValue ?? value,
      onSave: handleSave,
      onCancel: handleCancel,
      inputRef,
      error,
      clearError,
    })}
    {error && <span className="error">{error}</span>}
  </div>
</div>
```

### Saving State

```tsx
<div className={containerClasses}>
  <span className="label">{label}</span>
  <div className={contentClasses}>
    {displayValue ?? String(pendingValue ?? value)}
    <Spinner className="ml-2" size="sm" />
  </div>
</div>
```

---

## Error Handling Contract

### Validation Errors

1. Run `validate(newValue)` before calling `onSave`
2. If validation returns error string:
   - Set `error` state
   - Remain in edit mode
   - Display error below input
3. Clear error when user modifies value

### Save Errors

1. `onSave(newValue)` returns rejected Promise
2. Catch error and extract message:
   ```typescript
   error instanceof Error ? error.message : 'Save failed'
   ```
3. Set `error` state with message
4. Return to edit mode with `pendingValue` preserved
5. Display error below input

---

## Usage Example

```tsx
<BaseEditable
  label="Name"
  value={name}
  displayValue={name || <span className="text-muted">Not set</span>}
  readonly={!canEdit}
  validate={z.string().min(1, "Name is required")}
  onSave={async (newValue) => {
    await api.updateName(newValue);
  }}
  renderEditMode={({ value, onSave, onCancel, inputRef, error }) => (
    <div className="flex flex-col gap-1">
      <Input
        ref={inputRef}
        defaultValue={value}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSave(e.currentTarget.value);
          if (e.key === 'Escape') onCancel();
        }}
      />
      <div className="flex gap-1 justify-end">
        <IconButton icon={Check} onClick={() => onSave(inputRef.current?.value)} />
        <IconButton icon={X} onClick={onCancel} />
      </div>
    </div>
  )}
/>
```
