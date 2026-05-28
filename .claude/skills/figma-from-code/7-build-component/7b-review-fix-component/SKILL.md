# Skill: Review and Fix a Figma Component (Steps 4–7)

> **Review/fix phase only.** Receives the `-built.json` handoff from `7-build-component`, runs instance/sizing/pixel comparison, executes the fix loop, finalizes tracking files, and returns the complete result. All Figma MCP tools are available (`use_figma`, `get_screenshot`).

## Required Inputs

| Input              | Description                                                | Source                                                           |
| ------------------ | ---------------------------------------------------------- | ---------------------------------------------------------------- |
| `componentName`    | Name of the component (e.g., `Button`, `UserProfile`)      | Handoff file or caller                                           |
| `fileKey`          | Figma file key                                             | State ledger or caller                                           |
| `builtHandoffPath` | Path to the `-built.json` handoff from `7-build-component` | `.temp/figma-from-code/build-results/{componentName}-built.json` |

All other inputs (`nodeId`, `screenshotNodeId`, `figmaScreenshot`, `figmaVariant`, `sourceDir`, `variants`) are read from the handoff file — they are not passed separately.

### Also reads from disk

- `.temp/figma-from-code/builtComponents.json` — for instance resolution during fix loop
- `state.json → preExistingComponents` — for the pre-existing guard
- `.temp/figma-from-code/screenshots/{componentName}/app.png` — app reference screenshot
- `{sourceDir}/.figma/code.json` — written by Step 1; consumed by Step 4a
- `{sourceDir}/.figma/figma.json` — written by Step 2f; consumed by Step 4a

---

## Acceptance Thresholds

| Metric           | Pass threshold |
| ---------------- | -------------- |
| `matchPct`       | ≥ 90%          |
| `borderMatchPct` | ≥ 85%          |

Both must pass for `verdict: "match"`. `matchPct` alone passing yields `"minor_diff"`. Below `matchPct` threshold is `"mismatch"`.

---

## Result File Schema

Written to `.temp/figma-from-code/build-results/{componentName}.json` on every execution path.

```json
{
  "componentName": "Button",
  "status": "success | partial_match | no_app_reference | needs_authorization | rejected | failed",
  "nodeId": "123:45",
  "type": "COMPONENT_SET | COMPONENT",
  "variants": [{ "name": "Variant=primary, Size=regular", "nodeId": "123:46" }],
  "comparison": {
    "verdict": "match | minor_diff | mismatch | no_app_reference",
    "matchPct": 94.2,
    "borderMatchPct": 91.0,
    "iterations": 1,
    "fixes": ["border-radius 4px -> 8px"]
  },
  "preExistingTouched": [],
  "missingChildren": [],
  "trackingFile": { "written": true }
}
```

`status` values:

- `success` — built and passed acceptance thresholds
- `partial_match` — built, fix loop ran 3 iterations without reaching thresholds
- `no_app_reference` — built, no `app.png` found; comparison skipped
- `needs_authorization` — propagated from handoff; no comparison performed
- `rejected` — propagated from handoff; no comparison performed
- `failed` — propagated from handoff or Figma API error during fix loop

---

## Pre-Existing Components Rule

The fix loop (Step 5) must **never** edit a node whose ID appears in `preExistingComponents`. If a comparison finding requires modifying such a node, surface it in the result and let the orchestrator/user decide. Full detail is in [../step-1-analyze.md §Pre-Existing Components Rule](../step-1-analyze.md).

---

## Early-Exit Gate

After reading the handoff file, check `status`:

| Handoff status        | Action                                                                                        |
| --------------------- | --------------------------------------------------------------------------------------------- |
| `built`               | Continue to Inline Workflow below                                                             |
| `needs_authorization` | Write final result with `status: "needs_authorization"`, propagate `preExistingTouched`, stop |
| `rejected`            | Write final result with `status: "rejected"`, propagate `missingChildren`, stop               |
| `failed`              | Write final result with `status: "failed"`, propagate error message, stop                     |

---

## Inline Workflow

All steps run inline within a single agent. There is no subagent dispatching.

```
Steps 4–7 (all inline):
  4a. Instance check → run check-instances.js (hard gate)
  4b. Sizing check   → verify dimensions match intent
  4c. Pixel diff     → compare against app screenshot → verdict
  5.  Fix loop       → if verdict is not "match", diagnose and fix (up to 3 iterations)
  6.  Track          → verify/refresh figma-component.json tracking files
  7.  Return         → write final result file with node ID, match score, issues
```

### Flow

```
1.  Read {componentName}-built.json
1a. If status ≠ "built" → propagate status to final result, stop (see Early-Exit Gate)
2.  Execute Step 4a (instance check)
    If 4a reports missing_instances → enter Step 5 fix loop with missing_instances
                                      (skip 4b/4c for this first pass)
3.  If 4a passes → execute Steps 4b, 4c → get verdict
4.  If app.png is missing → skip comparison, set verdict "no_app_reference", proceed to Step 6
5.  If verdict is "match" → skip to Step 6
6.  If verdict is not "match" → execute Step 5 fix loop (up to 3 iterations)
7.  Execute Step 6 (track), Step 7 (return)
```

**Fix iteration model:** Step 5 runs up to 3 iterations inline. Each iteration: diagnose from `diff.png`/`comparison.json`, apply fix via `use_figma`, re-enumerate instances (Step 2f re-run), re-screenshot, re-compare. If all 3 iterations complete without match, return `status: "partial_match"` and proceed to Step 6. Do not retry Step 5.

---

## Workflow

Step files live in `../7-build-component/`. Open the linked file before executing each step.

| Step | File                                           | Phase    | What it does                                                                 |
| ---- | ---------------------------------------------- | -------- | ---------------------------------------------------------------------------- |
| 4a   | [../step-4-compare.md](../step-4-compare.md)   | Compare  | Instance-usage gate — `check-instances.js` diffs `code.json` vs `figma.json` |
| 4b   | [../step-4-compare.md](../step-4-compare.md)   | Compare  | Sizing sanity check                                                          |
| 4c   | [../step-4-compare.md](../step-4-compare.md)   | Compare  | Pixel diff against the app screenshot → verdict                              |
| 5    | [../step-5-fix-loop.md](../step-5-fix-loop.md) | Fix      | Diagnose from comparison data and fix (up to 3 iterations)                   |
| 6    | [../step-6-track.md](../step-6-track.md)       | Finalize | Verify tracking files, refresh `updatedAt`, sanity-check invariants          |
| 7    | [../step-7-return.md](../step-7-return.md)     | Finalize | Report result with node ID, match score, and any remaining issues            |

### Script references

- `check-instances.js` — lives at `.claude/skills/figma-from-code/7-build-component/check-instances.js` (parent directory)
- `compare.js` — lives at `.claude/skills/screenshot-comparison/compare.js`
- `inspect-styles.js` — used by Step 5 re-enumeration if needed

---

## Error Handling

| Scenario                                           | Action                                                                    |
| -------------------------------------------------- | ------------------------------------------------------------------------- |
| Handoff status is not `built`                      | Propagate to final result, stop (see Early-Exit Gate)                     |
| No app screenshot (`app.png` missing)              | Skip comparison, write `status: "no_app_reference"`, proceed to Step 6    |
| Fix loop reaches 3 iterations without match        | Return `status: "partial_match"`, proceed to Step 6 — do not retry Step 5 |
| `use_figma` API error during fix loop              | Record error in result, return current best `status`, proceed to Step 6   |
| Fix loop would edit a `preExistingComponents` node | Stop fix loop, surface in result, let orchestrator/user decide            |

Never fail silently. Every error or skip must appear in the final result file.
