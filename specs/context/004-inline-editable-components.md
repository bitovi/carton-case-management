I want to build all the components in https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/branch/mPCNrycLkhncmjlVoYTBzT/Carton-Case-Management?node-id=1109-12982&m=dev

I want to build them in a packages/client/src/components/inline-edit 
folder. 


Once we are done building these components, these will replace both

packages/client/src/components/common/EditableSelect

and

packages/client/src/components/common/EditableTitle
. Other pages should use these new components.


To build these components, I think we should create a BaseEditable component, it should support the 3 states -> rest, hover, edit.

Our states should be rest, interest, and edit. 

But it will be passed a child component that manages the behavior of the editable area.

This base component will manage the mouseover that activates the `interest`.  It should also manage allowing people to keyboard navigate to the component and put it in the `interest` state.

Clicking or hitting enter will then move the component into the edit state.


All components look like https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/branch/mPCNrycLkhncmjlVoYTBzT/Carton-Case-Management?node-id=1252-9022&m=dev

While it's not defined in figma, all of these components should take some readonly flag that will keep them in the rest state.  





https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/branch/mPCNrycLkhncmjlVoYTBzT/Carton-Case-Management?node-id=1252-9022&m=dev




---

## BaseEditable Props (Draft)

```typescript
interface RenderEditModeProps<T> {
  value: T;
  onSave: (newValue: T) => void;
  onCancel: () => void;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | HTMLButtonElement>;
}

interface BaseEditableProps<T> {
  // Core data
  label: string;
  value: T;
  
  // Display customization
  displayValue?: string | React.ReactNode;  // How to render value in rest/interest states
  className?: string;
  
  // State control
  readonly?: boolean;                        // Locks component in rest state
  
  // Controlled state mode
  isEditing?: boolean;                       // Controlled: force edit mode
  onEditingChange?: (editing: boolean) => void;  // Controlled: notify parent of state changes
  
  // Edit mode content
  renderEditMode: (props: RenderEditModeProps<T>) => React.ReactNode;
  
  // Callbacks  
  onSave?: (newValue: T) => void | Promise<void>;
  
  // Loading state
  isLoading?: boolean;
}
```

---

## Example: EditableText Implementation

```typescript
// EditableText.tsx - A component built on BaseEditable

interface EditableTextProps {
  label: string;
  value: string;
  onSave: (newValue: string) => void | Promise<void>;
  readonly?: boolean;
  isLoading?: boolean;
  placeholder?: string;
}

export function EditableText({ 
  label, 
  value, 
  onSave, 
  readonly, 
  isLoading,
  placeholder 
}: EditableTextProps) {
  
  return (
    <BaseEditable
      label={label}
      value={value}
      displayValue={value || <span className="text-gray-400">{placeholder}</span>}
      readonly={readonly}
      isLoading={isLoading}
      onSave={onSave}
      renderEditMode={({ value, onSave, onCancel, inputRef }) => (
        <TextFieldEditor
          initialValue={value}
          onSave={onSave}
          onCancel={onCancel}
          inputRef={inputRef}
        />
      )}
    />
  );
}

// Internal component for the edit mode UI
function TextFieldEditor({ 
  initialValue, 
  onSave, 
  onCancel, 
  inputRef 
}: {
  initialValue: string;
  onSave: (value: string) => void;
  onCancel: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}) {
  const [draft, setDraft] = useState(initialValue);
  
  const handleSave = () => {
    if (draft.trim() !== initialValue) {
      onSave(draft.trim());
    } else {
      onCancel();
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };
  
  return (
    <div className="flex flex-col gap-1">
      <Input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <div className="flex gap-1 justify-end">
        <IconButton icon={Check} onClick={handleSave} />
        <IconButton icon={X} onClick={onCancel} />
      </div>
    </div>
  );
}
```

---

## Example: EditableSelect Implementation (Auto-save)

```typescript
// EditableSelect.tsx - Dropdown that auto-saves on selection

interface EditableSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onSave: (newValue: string) => void | Promise<void>;
  readonly?: boolean;
  isLoading?: boolean;
}

export function EditableSelect({ 
  label, 
  value, 
  options,
  onSave, 
  readonly, 
  isLoading 
}: EditableSelectProps) {
  
  const displayLabel = options.find(o => o.value === value)?.label || value;
  
  return (
    <BaseEditable
      label={label}
      value={value}
      displayValue={displayLabel}
      readonly={readonly}
      isLoading={isLoading}
      onSave={onSave}
      renderEditMode={({ value, onSave, onCancel, inputRef }) => (
        <Select
          value={value}
          onValueChange={(newValue) => {
            onSave(newValue);  // Auto-save on selection
          }}
          onOpenChange={(open) => {
            if (!open) onCancel();  // Close edit mode when dropdown closes
          }}
        >
          <SelectTrigger ref={inputRef}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map(opt => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}
```

---

## What BaseEditable Handles vs What Edit Components Handle

| Responsibility | BaseEditable | Edit Component |
|----------------|--------------|----------------|
| Label rendering | ✅ | |
| Rest/Interest state display | ✅ | |
| Mouse hover → interest state | ✅ | |
| Keyboard focus → interest state | ✅ | |
| Click/Enter → edit state | ✅ | |
| Readonly blocking | ✅ | |
| Loading indicator | ✅ | |
| Auto-focus on edit | ✅ (provides inputRef) | ✅ (uses inputRef) |
| Draft value management | | ✅ |
| Input/Select rendering | | ✅ |
| Save/Cancel buttons/icons | | ✅ |
| Keyboard shortcuts (Enter/Escape) | | ✅ |
| Calling onSave/onCancel | | ✅ |

---

## Design Discussion Log

### 2026-01-14: Width prop

**Decision:** ❌ Removed `width` prop

**Rationale:** Components should inherit their container's dimensions rather than managing their own width. This makes them more flexible and reusable in different layouts (sidebar panels, forms, tables, etc.). The parent container is responsible for layout constraints.

---

### 2026-01-14: showControls prop

**Decision:** ❌ Removed `showControls` prop from BaseEditable

**Rationale:** The edit mode component (passed via `children` or `renderEditMode`) should own its save/cancel UI. Different variants need different controls:
- **Text fields**: Check/X icon buttons
- **Textarea**: Save/Cancel text buttons  
- **Dropdowns/Dates**: No controls (auto-save on selection)

BaseEditable shouldn't know or care about these differences - it just renders whatever the child provides.

---

### 2026-01-14: children vs renderEditMode

**Decision:** ✅ Use `renderEditMode` only (remove `children` option)

**Rationale:** The edit component needs access to `onSave`, `onCancel`, and `inputRef` to function properly. A render prop makes this contract explicit and ensures all edit components receive what they need.

---

### 2026-01-14: Controlled state mode

**Decision:** ✅ Support controlled state via `isEditing` + `onEditingChange`

**Rationale:** Needed for:
- Form validation (force edit open to show errors)
- "Always editing" mode for create forms
- Testing
- Parent components that need to coordinate multiple editable fields

---

### 2026-01-14: inputRef in renderEditMode

**Decision:** ✅ BaseEditable provides `inputRef` to renderEditMode

**Rationale:** BaseEditable needs to auto-focus the input when entering edit mode. The edit component attaches this ref to its focusable element.