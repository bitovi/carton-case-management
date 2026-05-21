---
name: figma-from-code-build-component
description: Build a single Figma component from code. Accepts component name, app screenshots, variants, source code, computed styles, icon/image usage, and available built components. Creates the component in Figma, then compares against the original screenshot and iterates up to 3 times to fix visual discrepancies.
---

# Skill: Build a Figma Component from Code

Creates a single Figma component (or component set with variants) from source code and reference material, then validates it visually against an app screenshot — iterating up to 3 fix passes to converge on visual fidelity.

> **All Figma MCP tools (`use_figma`, `get_screenshot`, etc.) work in subagents.** This skill can run its entire workflow — build, screenshot, compare, fix — inside a subagent dispatched by the orchestrator.

## When to Use

- Building an individual component in Figma from its React source code
- Called by `figma-from-code` Phase 3 as a parallel subagent (one per component)
- Rebuilding or updating a single component after code changes
- Any time you need to translate a coded component into a Figma component with visual validation

## Required Inputs

| Input             | Description                                                                                       | Source                                               |
| ----------------- | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `componentName`   | Name of the component (e.g., `Button`, `UserProfile`)                                             | Build order / caller                                 |
| `fileKey`         | Figma file key                                                                                    | State ledger or caller                               |
| `parentFrameId`   | Node ID of the tier/container frame to append the component into                                  | State ledger                                         |
| `sourceCode`      | The component's `.tsx` source code (read the file contents)                                       | Project's component source directory                 |
| `appScreenshot`   | Path to the app screenshot PNG                                                                    | `.temp/figma-from-code/screenshots/{name}/app.png`   |
| `textContent`     | Extracted text JSON from the live app                                                             | `.temp/figma-from-code/screenshots/{name}/text.json` |
| `variants`        | List of variant configurations (props/states) to build                                            | Source code analysis                                 |
| `iconUsage`       | Which Lucide icons and SVG assets the component uses, with sizes                                  | Source code imports + `icons.json`                   |
| `builtComponents` | Map of `{componentName: nodeId}` for all previously built components available for instance reuse | State ledger `builtComponents`                       |
| `preExistingComponents` | Immutable snapshot of components that existed in Figma BEFORE this orchestrator run started | State ledger `preExistingComponents` (Phase 0a snapshot) |
| `screenshotDir`   | Directory for saving Figma screenshots and diff artifacts                                         | `.temp/figma-from-code/screenshots/{name}/`          |

### Optional Inputs

| Input            | Description                                                                                                                                  |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `computedStyles` | Resolved CSS values from `computed-styles.json` (produced by `inspect-styles.js` in step 1g). Authoritative for colors, spacing, typography. Also contains `layoutContext.parent.clientWidth` — used by Step 1a to promote hug→fill when the parent slot is meaningfully wider than the element |
| `stateScreenshots` | Paths to state screenshots (`state-hover.png`, `state-focus.png`, `state-disabled.png`) and style diffs from `states.json`                |
| `cssFile`        | Path to the component's `.css` module file if external styles exist                                                                         |
| `figmaVariant`   | Variant properties that match the app rendering (for comparison targeting)                                                                  |

---

## Variant Strategy

Step 1b extracts variant axes from two sources and computes a representative set of combinations to build in Figma:

### Variant sources (checked in order)

1. **Variant library definitions** (cva, tv, recipe, styleVariants) — the `variants` object is parsed to extract axes, values, defaults, and per-value Tailwind class strings (`classMap`). This is the highest-confidence source. The cva base classes (first argument) provide shared layout properties for all variants.

2. **CSS pseudo-states** (from `inspect-styles.js` / `states.json`) — hover, focus, and disabled states captured as computed style diffs (`stateStyles`). Only states that produce a visual difference from the default are included. Each state becomes a separate Figma variant with the style overrides baked in (e.g., hover fill color, focus ring shadow, disabled opacity).

3. **Responsive breakpoints** — Tailwind responsive prefixes (`lg:hidden`, `hidden lg:flex`, `md:block`, etc.) that show/hide entire JSX blocks at different viewport widths. Each breakpoint tier becomes a Layout variant (e.g., `Layout=Desktop`, `Layout=Mobile`). Unlike style variants, these change which children are present — they are structural variants.

4. **Prop-driven structural states** — React state hooks (`useState`) that control the visibility of modals, menus, dialogs, and other overlay elements. Each distinct visual state becomes a variant (e.g., `State=Default`, `State=Menu Open`, `State=Delete Confirmation`). These change DOM structure, not just styles — the variant includes the overlay/modal content rendered alongside the base component.

### Representative set algorithm

Default strategy: `1 + SUM(values_per_axis - 1)` combinations. Varies one axis at a time from the default combo, showing every distinct visual treatment without combinatorial explosion.

**Example — Button** with Variant(6) × Size(4) × Roundness(2) × State(4):
- Full cross-product: 192 combos
- Representative set: 1 + 5 + 3 + 1 + 3 = **13 combos**

### Budget guardrail

If representative combos exceed 30, truncate by dropping values from lower-priority axes. Priority order: responsive layout > visual-identity axes (variant, type) > prop-driven states > interactive states (hover, focus, disabled) > sizes > shape modifiers (roundness).

### Style resolution in Step 2b

The build step resolves styles differently per axis source:
- **`variant-library`** axes → parse `classMap` Tailwind classes using the §2d mapping table and §2e color resolution chain
- **`css-pseudo-state`** axes → apply `stateStyles` diffs directly as resolved computed values (no Tailwind parsing needed)
- **`responsive-breakpoint`** axes → each variant builds only the JSX blocks visible at that breakpoint. The `visibilityMap` in the axis data says which blocks to include/exclude per variant value.
- **`prop-state`** axes → each variant builds the base component plus any overlay/modal content that is visible in that state. The `stateConfig` in the axis data describes what changes per state.

### Future extension

Additional variant sources can be added to Step 1b when the skill encounters codebases that need them:
- TypeScript union props (`source: "typescript-prop"`)
- Boolean visual props (`source: "typescript-prop"`)
- Conditional class patterns (`source: "conditional-class"`)

---

## Pre-Existing Components Rule

Before doing any work that resolves to a node ID in `preExistingComponents`, **stop**. That node existed in Figma before this run; modifying it (rebuild, resize the master, delete + recreate, swap variants out from under existing instances) requires explicit user authorization per the orchestrator skill's "Pre-Existing Components Rule".

Concretely:

- If `componentName` itself maps to a node in `preExistingComponents` and the caller's intent is to **rebuild** that node: write a result file with `"status": "needs_authorization"` and `"preExistingTouched": ["<name>"]`, then return. Do not call `use_figma` to delete, replace, resize, or restyle the existing node. Building a *fresh* component with the same name into a different `parentFrameId` is also a modification (it creates a duplicate the orchestrator must reconcile) — don't do it without authorization.
- If a *child* you would normally instantiate inside this component (e.g., `Icon/Check`, `Button`) is in `preExistingComponents`: **instancing it is fine** — that's reuse, not modification. Modifying its master is not.
- The fix-loop in Step 5 must never edit a node in `preExistingComponents`. If the comparison says you need to, escalate to the orchestrator instead.

This rule overrides Steps 2–5 of the workflow when in conflict.

---

## Execution Modes

This skill supports two execution modes depending on the caller:

### Mode A: Inline (default)

The orchestrator runs all 7 steps directly in the main conversation. Use when building a single component or when the orchestrator is handling one component at a time.

### Mode B: Parallel subagents (preferred for batch builds)

The orchestrator dispatches one subagent per component. Each subagent acts as a **controller** that coordinates internal subagents (see Subagent Architecture below). The controller writes its result to `.temp/figma-from-code/build-results/{componentName}.json`. The orchestrator collects results after all controllers complete.

**Within a tier**, all components can run in parallel since they only instantiate (not modify) lower-tier components. **Across tiers**, execution is sequential — each tier depends on components built in lower tiers.

---

## Subagent Architecture

Each build-component run uses internal subagents to isolate concerns and shift mechanical work to cheaper models. The build-component agent (opus) acts as a controller.

```
build-component controller (opus)
  ├── [sonnet subagent] Step 1: Analyze → produces code.json
  ├── [opus inline]     Steps 2, 3, 4a: Build → Screenshot → Instance check
  ├── [haiku subagent]  Steps 4b, 4c: Compare → produces verdict
  ├── [opus subagent]   Step 5: Fix loop (only if compare fails) — fresh context
  └── [opus inline]     Steps 6, 7: Track → Return
```

### Why this split

| Phase | Model | Rationale |
|-------|-------|-----------|
| Step 1 (Analyze) | **Sonnet** subagent | Parse imports, map Tailwind classes, check builtComponents, resolve parent-context sizing, evaluate CSS variable chains, enforce pre-existing components rule. Judgment-heavy enough that Haiku misclassifications cascade to expensive Opus fix loops. |
| Steps 2, 3, 4a (Build) | **Opus** inline | Writing `use_figma` code requires the strongest model. Steps 3 and 4a are trivial (1-2 tool calls each) — not worth separate subagents. |
| Steps 4b, 4c (Compare) | **Haiku** subagent | Run sizing check, run `compare.js`, read results, return verdict. Fully deterministic. |
| Step 5 (Fix loop) | **Opus** subagent | Requires writing `use_figma` fix code. **Fresh context eliminates build-phase bias** — the fix agent never saw the build happen, so it diagnoses only from comparison data. |
| Steps 6, 7 (Finalize) | Opus inline | Trivial file verification and result formatting. Not worth subagent overhead. |

### Controller flow

```
1. Dispatch Sonnet analyze subagent → wait for code.json
2. Read code.json, execute Steps 2, 3, 4a inline
3. If 4a fails with missing_instances → dispatch Opus fix subagent
4. If 4a passes → dispatch Haiku compare subagent → wait for verdict
5. If verdict is "match" (matchPct ≥ 90% AND borderMatchPct ≥ 85%) → skip to Step 6
6. If verdict is not "match" → dispatch Opus fix subagent with compare results
7. Execute Steps 6, 7 inline
```

### Subagent prompt templates

**Sonnet Analyze subagent (Step 1)**

```
Analyze a React component's source code and produce a code.json analysis file.

Read the step-1-analyze.md file at:
  .claude/skills/figma-from-code-build-component/step-1-analyze.md

Follow ALL sub-steps (0 through 1g). Write code.json to:
  {sourceDir}/.figma/code.json

Inputs:
- Component name: {componentName}
- Source file: {sourceFile}
- Built components: {JSON.stringify(builtComponents)}
- Pre-existing components: {JSON.stringify(preExistingComponents)}
- Dev server URL: {devServerUrl}
- Screenshot dir: {screenshotDir}

IMPORTANT: If {componentName} appears as a key in preExistingComponents, this component
pre-dates the current pipeline run. Write a result file with "status": "needs_authorization"
and "preExistingTouched": ["{componentName}"] to
.temp/figma-from-code/build-results/{componentName}.json and stop immediately.
Do NOT analyze, do NOT write code.json — just write the rejection and return.

If any child component is missing from builtComponents, write a rejection
result to .temp/figma-from-code/build-results/{componentName}.json and stop.
```

**Haiku Compare subagent (Steps 4b, 4c)**

```
Compare a Figma component against its app screenshot and return a verdict.
Do NOT attempt any fixes — only compare and report.

Read the step-4-compare.md file at:
  .claude/skills/figma-from-code-build-component/step-4-compare.md

Run Step 4b (sizing check), then Step 4c (pixel diff). Return a structured
verdict. The controller will dispatch a separate fix subagent if needed.

Inputs:
- Component name: {componentName}
- Figma file key: {fileKey}
- Component node ID: {componentNodeId}
- Screenshot node ID: {screenshotNodeId}
- Sizing intent: {JSON.stringify(sizingIntent)}
- App screenshot: {appScreenshotPath}
- Figma screenshot: {figmaScreenshotPath}
- Screenshot dir: {screenshotDir}
- Instance check result: {JSON.stringify(instanceCheckResult)}

Return JSON:
{
  "sizingCheck": { "verdict": "pass"|"fail", "issues": [...], "builtSize": {w,h} },
  "matchPct": number,
  "borderMatchPct": number,
  "verdict": "match"|"minor_diff"|"mismatch",
  "borderVerdict": "border_ok"|"border_diff"
}
```

**Opus Fix subagent (Step 5)**

```
Fix visual discrepancies in a Figma component by comparing it against its
app screenshot. You are starting fresh — you have NO context about how this
component was built. Diagnose ONLY from comparison data.

Read the step-5-fix-loop.md file at:
  .claude/skills/figma-from-code-build-component/step-5-fix-loop.md

CRITICAL RULES:
- Your diagnosis MUST start from diff.png and comparison.json
- Read the source .tsx ONLY to resolve specific differences the comparison found
- NEVER apply blanket fixes to all instances of a component type — verify each
  instance individually against the diff before modifying it
- After each fix: re-enumerate instances (Step 2f), re-screenshot, re-compare

Inputs:
- Component name: {componentName}
- Figma file key: {fileKey}
- Component node ID: {componentNodeId}
- Screenshot node ID: {screenshotNodeId}
- Source file: {sourceFile}
- CSS file: {cssFile or "none"}
- App screenshot: {appScreenshotPath}
- Figma screenshot: {figmaScreenshotPath}
- Screenshot dir: {screenshotDir}
- Source dir: {sourceDir}
- Sizing intent: {JSON.stringify(sizingIntent)}
- Compare verdict: {JSON.stringify(compareVerdict)}
- Built components: {JSON.stringify(builtComponents)}
- Pre-existing components: {JSON.stringify(preExistingComponents)}
- code.json path: {codeJsonPath}
- figma.json path: {figmaJsonPath}

Return JSON:
{
  "verdict": "match"|"minor_diff"|"mismatch",
  "matchPct": number,
  "borderMatchPct": number,
  "iterations": number,
  "fixes": ["description of each fix applied"]
}
```

---

## Workflow

Each step has its own detailed file in this directory. Open the linked file before executing the step.

| Step | File | Phase | Model | What it does |
| ---- | ---- | ----- | ----- | ------------ |
| 1    | [step-1-analyze.md](step-1-analyze.md)       | Analyze | Sonnet subagent | Read source + reference material, inspect live component, write `.figma/code.json` |
| 2    | [step-2-build.md](step-2-build.md)           | Build | Opus inline | Create the component in Figma via `use_figma`, enumerate instances, write `.figma/figma.json` |
| 3    | [step-3-screenshot.md](step-3-screenshot.md) | Build | Opus inline | Capture the Figma result via `get_screenshot` |
| 4a   | [step-4-compare.md](step-4-compare.md)       | Build | Opus inline | Instance-usage gate — `check-instances.js` diffs `code.json` vs `figma.json` |
| 4b   | [step-4-compare.md](step-4-compare.md)       | Compare | Haiku subagent | Sizing sanity check |
| 4c   | [step-4-compare.md](step-4-compare.md)       | Compare | Haiku subagent | Pixel diff against the app screenshot → verdict |
| 5    | [step-5-fix-loop.md](step-5-fix-loop.md)     | Fix | Opus subagent | Diagnose from comparison data and fix (up to 3 iterations). **Fresh context — no build impressions.** |
| 6    | [step-6-track.md](step-6-track.md)           | Finalize | Opus inline | Verify tracking files, refresh `updatedAt`, sanity-check invariants |
| 7    | [step-7-return.md](step-7-return.md)         | Finalize | Opus inline | Report result with node ID, match score, and any remaining issues |

---

## fixSizing() — Mandatory After Every Build

**Call `fixSizing()` on every component before appending to the parent frame.** This corrects frames whose height was locked by a `resize()` call.

```javascript
function fixSizing(node, depth = 0) {
  if (depth > 10 || !node) return;
  const hasLayout =
    (node.type === 'COMPONENT' || node.type === 'FRAME' || node.type === 'COMPONENT_SET') &&
    node.layoutMode &&
    node.layoutMode !== 'NONE';
  if (hasLayout) {
    if (node.layoutMode === 'VERTICAL') node.primaryAxisSizingMode = 'AUTO';
    node.counterAxisSizingMode = 'AUTO';
  }
  const children = 'children' in node ? node.children : [];
  for (const child of children) fixSizing(child, depth + 1);
}
```

**During construction**, always set `counterAxisSizingMode = 'AUTO'` before adding children:

```javascript
// WRONG — locks height
comp.counterAxisSizingMode = 'FIXED';
comp.resize(200, 10);

// CORRECT — height grows with content
comp.primaryAxisSizingMode = 'AUTO';
comp.counterAxisSizingMode = 'AUTO';
comp.resize(200, 10); // width hint only
```

---

## Common Pitfalls

| Pitfall                                               | Prevention                                                                                             |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| All components appear as thin strips                  | `fixSizing()` was not called — run it on every component                                               |
| Text node padding error                               | Wrap text in an auto-layout frame, not padding on the text node                                        |
| `strokeAlign: 'INSIDE'` double-border                 | Always use `strokeAlign: 'OUTSIDE'` to match CSS box model                                             |
| Placeholder text instead of real text                 | Always use exact strings from `textContent` / `text.json`                                              |
| Rebuilding a sub-component that already exists        | Check `builtComponents` first, create an instance instead                                              |
| Rebuilding an icon that already exists                | Check `builtComponents` for `Icon/{Name}`, create an instance                                          |
| Rendering `EditableTitle` / `EditableText` / any design-system child as plain text or a hand-built frame because the rest-state visual looks the same | Step 4a (`check-instances.js`) hard-rejects this. Always instance the design-system component. For text overrides, `instance.findOne(n => n.type === 'TEXT')` + `loadFontAsync` + `setCharacters`. |
| Component set has no layout after `combineAsVariants` | Explicitly set `layoutMode`, sizing, padding, spacing on the set                                       |
| Manual x/y positioning inside auto-layout parent      | Never set x/y when the parent frame has `layoutMode` set — auto-layout manages positioning             |
| Colors don't match app                                | Resolve Tailwind CSS variables through the full chain: class → config → CSS variable → HSL/OKLCH → RGB |
| Icon at wrong size                                    | Check Tailwind size class on the icon element: `h-4 w-4` = 16x16, not 24x24                            |
| Instance styling overridden based on source code analysis but doesn't match the live app (e.g. mobile className applied to desktop variant) | During Step 2, only override `characters` on instances — never override `fontSize`, `fontName`, `lineHeight`, or `fills`. Keep the master's defaults. Let Step 4 comparison flag visual mismatches, then fix in Step 5 using the diff image as evidence. Source code className interpretation is error-prone. |

---

## Error Handling

| Scenario                               | Action                                                                                       |
| -------------------------------------- | -------------------------------------------------------------------------------------------- |
| `use_figma` fails                      | Diagnose error, fix script, retry once. If it fails again, return component as `failed`      |
| `use_figma` incremental limit          | Split the build across multiple `use_figma` calls. Build sub-structures first, then assemble |
| No app screenshot available            | Build the component, skip comparison, return `no_app_reference`                              |
| `compare.js` fails                     | Report comparison error, return the component with `nodeId` but no match score               |
| `get_screenshot` fails                 | Retry once. If still failing, return component as built but unvalidated                      |
| Font not available                     | Fall back to `{ family: 'Inter', style: 'Regular' }` — Inter is always available in Figma    |
| Sub-component not in `builtComponents` | Reject the build — return `status: "rejected"` with the missing children list (step 1e)      |
| Icon not in `builtComponents`          | Reject the build — return `status: "rejected"` with the missing icon in `missingChildren`    |
| `check-instances.js` fails (step 4a)   | Hard reject. Enter Step 5 fix-loop with `missing_instances` — replace each local stand-in with `createInstance()` of the design-system component. Re-enumerate and re-run 4a before re-screenshotting. |

Never fail silently. Every error or skip must appear in the returned result.
