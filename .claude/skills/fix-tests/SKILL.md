---
name: fix-tests
description: "Systematically find and fix failing unit tests for carton-case-management. Use when tests are failing and you need to identify root causes and fix them one at a time. Activates automatically when tests fail, or invoke with slash command."
argument-hint: "Which tests to fix? (e.g. all failing tests, client unit tests, server tests, shared tests)"
---

YOU MUST RE-RUN TESTS AFTER EVERY FIX TO CHECK IF THE ISSUE IS RESOLVED. DO NOT ATTEMPT TO FIX MULTIPLE FAILING TESTS AT ONCE — FOCUS ON ONE TEST, FIX IT, THEN MOVE TO THE NEXT.

# Fix Failing Tests

Follow this systematic loop for every failing test. Fix **one test at a time** — never batch fixes.

## Step 1: Run the Tests

Run all unit tests and capture the output:

```
npm test
```

Read the output carefully. Identify every failing test by:
- File path
- Test name (the `describe` + `it` label)
- Error message (actual vs. expected)

If there are no failures, report that all tests are passing and stop.

## Step 2: Pick the First Failing Test

Take the first failing test from the list. Do not jump ahead.

## Step 3: Diagnose Before Touching Any Code

Read both the **test file** and the **source file under test**.

Then output a formatted diagnosis block exactly like this before making any changes:

---
### 🔍 Test Analysis: `<describe block> > <it block>`

| Field | Detail |
|---|---|
| **Test file** | `path/to/file.test.ts` |
| **Source file** | `path/to/file.ts` |
| **Failing assertion** | Brief quote of the assertion |

**Expected behavior:** Describe what the test intends in plain English.

**Actual behavior:** Describe what is currently happening instead.

**Root cause:** Pinpoint the specific line(s) of code that are wrong and explain why.

---

Do not make any code changes until this diagnosis block is written.

## Step 4: Propose a Fix

Before editing any file, output a fix proposal block exactly like this:

---
### 🛠 Proposed Fix

- **File to change:** `path/to/file.ts`
- **Change:** Describe what will be changed and why it corrects the logic.

---

## Step 5: Implement the Fix

Make the minimal change to the **source code** needed to fix the bug.

Rules:
- Never change test assertions to make a test pass — fix the source code
- Do not refactor, rename, or improve anything beyond the minimal fix

## Step 6: Re-run the Tests

```
npm test
```

After re-running, output a result block:

---
### ✅ / ❌ Fix Result: `<describe block> > <it block>`

- **Status:** Passed / Still failing
- **Next action:** Moving to next failing test / Revising diagnosis

---

- **If it passes**: Return to Step 2 and pick the next failing test.
- **If it still fails**: Re-read the error, revise the diagnosis, and repeat Steps 4–6 with the updated understanding. Try a different approach — do not repeat the same fix.

## Step 7: Final Verification

Once all previously failing tests pass, run the full test suite one more time to confirm no regressions were introduced:

```
npm test
```

Output a final summary block:

---
### 📋 Final Test Summary

| Test | Status |
|---|---|
| `<describe> > <it>` | ✅ Fixed |
| `<describe> > <it>` | ✅ Fixed |

**Overall result:** All tests passing / N regressions found.

---

Report the final result.
