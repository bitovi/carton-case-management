---
name: validate-implementation
description: Validate implementations for runtime errors, accessibility, and API compliance. Use when reviewing implementations, syncing designs, or auditing visual accuracy before committing code.
---

# Skill: Validate Implementation

This skill validates code implementations before marking features complete to catch runtime errors, accessibility issues, and API violations.

## When to Use

Use before committing feature implementations, especially:
- UI components using Dialog, Modal, Select, or Form components
- Features from Figma designs or Jira tickets
- After completing any feature implementation
- Before creating pull requests

## What This Skill Does

1. Runs static analysis (TypeScript and ESLint)
2. Checks browser console for runtime errors and warnings
3. Identifies common runtime errors automatically
4. Checks accessibility compliance for dialogs, selects, and forms
5. Runs automated test suite (unit and E2E)
6. Validates API usage patterns

## Validation Steps

### 1. Static Analysis

Run TypeScript and linting checks:
```bash
npm run typecheck
npm run lint
```

Fix any errors before proceeding.

### 2. Browser Console Check

Start dev server and check console:
```bash
npm run dev
```

1. Open browser DevTools Console
2. Navigate to the feature
3. Check for errors (red), warnings (yellow), or unexpected logs

### 3. Accessibility Checks

#### Dialog/Modal Components
Verify:
- DialogTitle is present (or wrapped with VisuallyHidden)
- DialogDescription is present (or aria-describedby attribute)
- Proper ARIA labels for screen readers

#### Select Components
Verify:
- No empty string values in options
- Use placeholder for "no selection" state
- All selects have proper labels

#### Form Inputs
Verify:
- All inputs have labels (visible or aria-label)
- Error states use aria-invalid and aria-describedby

### 4. Automated Tests

Run tests and fix failures:
```bash
npm test
npm run test:e2e
```

## Common Runtime Errors

| Error | Cause | Fix |
|-------|-------|-----|
| DialogContent requires a DialogTitle | Missing accessibility | Add `<DialogTitle>` or wrap with VisuallyHidden |
| Missing Description or aria-describedby | Missing accessibility | Add `<DialogDescription>` or aria-describedby |
| Select.Item must have a value prop that is not an empty string | Invalid Radix UI usage | Remove `value=""`, use placeholder instead |
| Cannot read properties of undefined | Missing null checks | Add conditional rendering or optional chaining |
| Hook called conditionally | React rules violation | Call hooks unconditionally at top level |

## Quick Checklist

```markdown
- [ ] npm run typecheck - no errors
- [ ] npm run lint - no errors
- [ ] Browser console - no errors/warnings
- [ ] Dialogs have title and description
- [ ] No empty string in Select values
- [ ] All inputs have labels
- [ ] npm test passes
- [ ] npm run test:e2e passes
```

## Examples

### Missing DialogTitle

Before:
```tsx
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogHeader type="Close Only" onClose={() => onOpenChange(false)} />
  <FiltersList filters={filters} title={title} className="w-full" />
</Dialog>
```

After:
```tsx
<Dialog open={open} onOpenChange={onOpenChange}>
  <DialogHeader type="Close Only" onClose={() => onOpenChange(false)} />
  <DialogTitle className="sr-only">{title}</DialogTitle>
  <DialogDescription>
    Filter the list by selecting options below and clicking Apply.
  </DialogDescription>
  <FiltersList filters={filters} title={title} className="w-full" />
</Dialog>
```

### Empty String in Select

Before:
```tsx
options: [{ value: '', label: 'None selected' }, { value: 'a', label: 'Option A' }]
```

After:
```tsx
options: [{ value: 'a', label: 'Option A' }]
<SelectValue placeholder="None selected" />
```
