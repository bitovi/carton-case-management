---
name: run-tests
description: "Run tests and quality checks for carton-case-management. Use when asked to: run tests, run unit tests, run e2e tests, run end-to-end tests, run coverage, check types, typecheck, lint, lint the code, format code, or verify the code is working. Covers all test and quality check workflows."
argument-hint: "What do you want to run? (e.g. all tests, e2e, unit tests, lint, typecheck, coverage)"
---

# Running Tests

All commands run from the project root.

## Unit Tests

### All packages (client + server + shared)
```
npm test
```
Read the output carefully. If failures exist, identify the failing test file and error before making fixes, then rerun to confirm.

### By package
```
npm run test:client
npm run test:server
npm run test:shared
```

### Coverage report
```
npm run test:coverage
```

## End-to-End Tests (Playwright)

```
npm run test:e2e
```

Playwright automatically starts the dev server and client before running — no manual server startup needed. Tests run in headless Chromium.

### Interactive UI mode (for debugging)
```
npm run test:e2e:watch
```

Opens the Playwright UI for stepping through tests visually.

## Type Checking

```
npm run typecheck
```

Runs `tsc` across all packages. Fix all type errors before committing.

## Linting

```
npm run lint
```

Runs ESLint across all packages.

## Formatting

```
npm run format
```

Auto-formats all TypeScript, TSX, JS, JSON, CSS, and Markdown files using Prettier.

To check formatting without writing:
```
npm run format:check
```

## Full Pre-Commit Quality Check

Run this sequence before committing. Stop and fix on any failure:

```
npm test && npm run typecheck && npm run lint
```
