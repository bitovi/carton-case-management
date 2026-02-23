---
name: validate-implementation
description: Validate implementations for runtime errors and proper functionality. Use when reviewing implementations, syncing designs, or auditing before committing code.
---

# Skill: Validate Implementation

This skill validates code implementations before marking features complete to catch runtime errors, test failures, and browser console issues.

## When to Use

Use before committing feature implementations, especially:
- UI components using Dialog, Modal, Select, or Form components
- Features from Figma designs or Jira tickets
- After completing any feature implementation
- Before creating pull requests

## What This Skill Does

1. Runs static analysis (TypeScript and ESLint)
2. Runs automated test suite
3. Uses Playwright MCP to validate implementation in the browser
4. Checks browser console for runtime errors and warnings

## Step 0: Create Validation Todo List

Use `manage_todo_list` to create a checklist before starting validation.

```javascript
manage_todo_list({
  todoList: [
    {
      id: 1,
      title: 'Run TypeScript type checking',
      status: 'not-started'
    },
    {
      id: 2,
      title: 'Run ESLint checks',
      status: 'not-started'
    },
    {
      id: 3,
      title: 'Run unit tests',
      status: 'not-started'
    },
    {
      id: 4,
      title: 'Activate Playwright MCP tools',
      status: 'not-started'
    },
    {
      id: 5,
      title: 'Navigate to feature page',
      status: 'not-started'
    },
    {
      id: 6,
      title: 'Take accessibility snapshot',
      status: 'not-started'
    },
    {
      id: 7,
      title: 'Test user interactions',
      status: 'not-started'
    },
    {
      id: 8,
      title: 'Verify expected behavior',
      status: 'not-started'
    },
    {
      id: 9,
      title: 'Check browser console messages',
      status: 'not-started'
    },
    {
      id: 10,
      title: 'Document validation results',
      status: 'not-started'
    }
  ]
})
```

Mark each task as `in-progress` before starting it, complete the work, then mark it `completed` immediately. Do not batch completion updates.

## Validation Steps

### 1. Static Analysis

Run TypeScript and linting checks:
```bash
npm run typecheck
npm run lint
```

Fix any errors before proceeding.

### 2. Automated Tests

Run unit tests:
```bash
npm test
```

Fix any test failures before proceeding.

### 3. Playwright MCP Browser Validation

Activate Playwright MCP tools and validate the feature in the browser:

1. Activate web interaction tools if not already available
2. Navigate to the feature page
3. Interact with the implementation (click, type, select, etc.)
4. Verify expected behavior occurs
5. Document any issues found

Example workflow:
```
1. Navigate to feature page
2. Take accessibility snapshot to understand page structure
3. Perform user interactions (click buttons, fill forms, etc.)
4. Verify state changes and UI updates
5. Take screenshot if needed for documentation
```

### 4. Browser Console Check

Check console for errors and warnings:

1. Use Playwright MCP `mcp_playwright_browser_console_messages` with level "info"
2. Review output for:
   - Errors (red): Critical issues that must be fixed
   - Warnings (yellow): Issues that should be addressed
   - Unexpected logs: Debug statements that should be removed
3. Fix any errors found before proceeding

## Quick Checklist

Complete steps in order. Cannot proceed to next step until previous step is documented:

```markdown
- [ ] npm run typecheck passes
- [ ] npm run lint passes
- [ ] npm test passes
- [ ] Playwright MCP browser validation completed:
      Feature page: ___
      User interactions tested: ___
      Expected behavior verified: ___
- [ ] Browser console checked via Playwright MCP
- [ ] Browser console output documented:
      Errors (red): ___
      Warnings (yellow): ___
- [ ] Zero browser console errors
```

Validation is complete only when all items above are checked in sequence.

## Example Usage

### Validating a Dialog Component

```markdown
Validation for FilterDialog component:

- [x] npm run typecheck passes
- [x] npm run lint passes
- [x] npm test passes
- [x] Playwright MCP browser validation completed
- [x] Browser console checked via Playwright MCP
- [x] Browser console output documented:
      Errors (red): 0
      Warnings (yellow): 0
- [x] Zero browser console errors
```
