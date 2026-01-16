# Quickstart: Inline Editable Components

**Feature**: 004-inline-edit-components  
**Date**: 2026-01-14

---

## Overview

This guide helps you quickly start implementing the inline editable components feature.

---

## Prerequisites

- Node.js 18+ and npm
- Repository cloned and dependencies installed
- Understanding of React, TypeScript, and Shadcn UI patterns

---

## Quick Setup

```bash
# Ensure you're on the feature branch
git checkout 004-inline-edit-components

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev --workspace=@carton/client

# Start Storybook (separate terminal)
npm run storybook --workspace=@carton/client
```

---

## File Structure to Create

```text
packages/client/src/components/inline-edit/
├── BaseEditable/
│   ├── BaseEditable.tsx        # Core component
│   ├── BaseEditable.test.tsx   # Unit tests
│   ├── BaseEditable.stories.tsx # Storybook stories
│   ├── types.ts                # Type definitions
│   └── index.ts                # Barrel export
├── EditableText/
│   ├── EditableText.tsx
│   ├── EditableText.test.tsx
│   ├── EditableText.stories.tsx
│   └── index.ts
├── EditableSelect/
│   └── ... (same pattern)
├── ... (other variants)
└── index.ts                    # Main barrel export
```

---

## Implementation Order

### Phase 1: Foundation

1. **Create types.ts** - Define all interfaces and types
2. **Create BaseEditable** - Core state machine and composition
3. **Add BaseEditable tests** - Verify state transitions
4. **Add BaseEditable stories** - Visual development

### Phase 2: Core Variants

5. **EditableText** - Simplest explicit-save variant
6. **EditableSelect** - Auto-save variant (validates pattern)
7. **EditableTitle** - Ensures migration path works

### Phase 3: Additional Variants

8. **EditableTextarea** - Multi-line variant
9. **EditableDate** - Date picker integration
10. **EditableNumber** - Numeric input handling
11. **EditableCurrency** - Number with formatting
12. **EditablePercent** - Number with conversion

### Phase 4: Migration

13. **Update imports** in CaseEssentialDetails
14. **Update imports** in CaseInformation
15. **Remove old components** from common/

---

## Key Implementation Notes

### BaseEditable State Machine

```typescript
// States
type EditableState = 'rest' | 'interest' | 'edit' | 'saving';

// Key transitions
const handleMouseEnter = () => !readonly && setState('interest');
const handleClick = () => setState('edit');
const handleSave = async (value) => {
  setState('saving');
  try {
    await onSave(value);
    setState('rest');
  } catch (err) {
    setError(err.message);
    setState('edit');
  }
};
```

### Validation Pattern

```typescript
import { ZodSchema } from 'zod';

type ValidateProp<T> = ZodSchema<T> | ((value: T) => string | null);

function runValidation<T>(value: T, validate?: ValidateProp<T>): string | null {
  if (!validate) return null;
  if ('safeParse' in validate) {
    const result = validate.safeParse(value);
    return result.success ? null : result.error.errors[0]?.message ?? 'Invalid';
  }
  return validate(value);
}
```

### Auto-Focus Pattern

```typescript
const inputRef = useRef<HTMLElement>(null);

useEffect(() => {
  if (state === 'edit' && inputRef.current) {
    inputRef.current.focus();
  }
}, [state]);
```

---

## Testing Checklist

For each component:

- [ ] Unit tests for state transitions
- [ ] Unit tests for keyboard interactions
- [ ] Unit tests for validation (sync + async errors)
- [ ] Storybook story for rest state
- [ ] Storybook story for interest state
- [ ] Storybook story for edit state
- [ ] Storybook story for saving state
- [ ] Storybook story for error state
- [ ] Storybook story for readonly state

---

## Common Commands

```bash
# Run unit tests
npm run test --workspace=@carton/client

# Run tests in watch mode
npm run test:watch --workspace=@carton/client

# Type check
npm run typecheck --workspace=@carton/client

# Lint
npm run lint --workspace=@carton/client

# Run Storybook
npm run storybook --workspace=@carton/client

# Run E2E tests (after migration)
npm run test:e2e
```

---

## Resources

- **Spec**: [spec.md](./spec.md)
- **Data Model**: [data-model.md](./data-model.md)
- **BaseEditable API**: [contracts/base-editable-api.md](./contracts/base-editable-api.md)
- **Variant APIs**: [contracts/component-variants-api.md](./contracts/component-variants-api.md)
- **Figma Designs**: [Inline Edit Components](https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/branch/mPCNrycLkhncmjlVoYTBzT/Carton-Case-Management?node-id=1109-12982&m=dev)
- **Constitution**: [constitution.md](/.specify/memory/constitution.md)
