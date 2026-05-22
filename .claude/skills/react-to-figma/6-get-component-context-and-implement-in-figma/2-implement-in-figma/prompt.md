# Implement in Figma (Sub-Orchestrator)

Coordinate building a component in Figma: analyze inputs, build the default variant first, verify it works, then build remaining variants and combine into a component set.

## Inputs

| Input | Source |
|-------|--------|
| `componentName` | Parent orchestrator |
| `componentDir` | `.temp/react-to-figma/components/{Name}/` |
| `fileKey` | Pipeline config |
| `parentFrameId` | `figma-file-setup.md` or orchestrator |
| `analysis.md` | Phase 1 |
| `props.md` | Phase 1 |
| `figma-variants.md` | Sub-step 4 (analyze-figma-variants) |
| `variants.md` | Sub-step 1 |
| `stories-manifest.md` | Sub-step 3 |
| `screenshots/` | Sub-step 3 |
| `app-context/` | Phase 1 (optional) |
| `design-tokens.json` | Phase 2 |
| `css-figma-map.json` | Phase 2 |
| `figma-variables-map.json` | Phase 5 |
| `figma-icons-map.json` | Phase 5 |
| `figma-assets-map.json` | Phase 5 |
| `builtComponents` | Parent orchestrator |

## Output

- `figma-result.md` — final component/set node ID, all variant IDs, instance manifest
- `verification.md` — final verification verdict

## Procedure

### Step 1: Analyze default variant

Read `1-implement-first-variant/1-prompt.analyze.md` and launch as a **subagent** (Sonnet) with:
- `analysis.md`, `props.md`, `figma-variants.md`, `variants.md`
- `app-context/` contents (if available)
- `screenshots/` (default variant screenshot)
- `figma-variables-map.json`, `figma-icons-map.json`, `figma-assets-map.json`
- `builtComponents`

**Expected output**: `build-plan.md` written to `{componentDir}/`.

If `build-plan.md` reports a missing dependency, stop and return the error to the parent orchestrator.

### Step 2: Build default variant

Read `1-implement-first-variant/2-prompt.build.md` and launch as a **subagent** (Opus) with:
- `build-plan.md`
- `fileKey`, `parentFrameId`
- Reference files from `reference/`

**Expected output**: `default-variant/figma-result.md` written to `{componentDir}/`.

### Step 3: Verify default variant

Read `1-implement-first-variant/3-prompt.verify.md` and launch as a **subagent** (Sonnet) with:
- `default-variant/figma-result.md`
- Default variant's React screenshot
- `analysis.md`, `builtComponents`, `fileKey`

**Expected output**: `default-variant/verification.md`.

If verdict is **PARTIAL** or **FAIL**, enter fix loop:

```
for iteration in 1..3:
  1. Read 1-implement-first-variant/4-prompt.fix.md
     Launch as subagent (Opus) with:
     - default-variant/verification.md
     - default-variant/figma-result.md
     - fileKey, reference files
  2. Re-run Step 3 (verify)
  3. If PASS → break
```

### Step 4: Check for additional variants

Read `build-plan.md` → `allCombos`. If there is only one combo (the default), this is a single component — skip to Step 8.

### Step 5: Analyze remaining variants

Read `2-implement-remaining-variants/1-prompt.analyze.md` and launch as a **subagent** (Sonnet) with:
- `build-plan.md`
- `default-variant/figma-result.md` (proven structure + node IDs)
- `figma-variants.md`
- `variants.md`
- `screenshots/` (all non-default variant screenshots)
- `figma-variables-map.json`

**Expected output**: `variant-plans.md` written to `{componentDir}/`.

### Step 6: Build remaining variants and combine

Read `2-implement-remaining-variants/2-prompt.build-and-combine.md` and launch as a **subagent** (Opus) with:
- `build-plan.md` (shared frame tree)
- `variant-plans.md` (per-variant overrides)
- `default-variant/figma-result.md` (default node ID to include in set)
- `fileKey`, `parentFrameId`
- Reference files from `reference/`

**Expected output**: `figma-result.md` written to `{componentDir}/` with the component set ID and all variant IDs.

### Step 7: Verify and fix all variants

Read `2-implement-remaining-variants/3-prompt.verify-and-fix.md` and launch as a **subagent** (Opus) with:
- `figma-result.md` (set ID + all variant IDs)
- All React screenshots from `screenshots/`
- `analysis.md`, `builtComponents`, `fileKey`

**Expected output**: `verification.md` written to `{componentDir}/`.

If verdict is **PARTIAL** or **FAIL**, re-run this step up to 2 more times (the subagent fixes broken variants internally before re-verifying).

### Step 8: Finalize

Ensure final `figma-result.md` and `verification.md` are written to `{componentDir}/`.

Return to parent orchestrator with:
- Component name
- Final verdict (PASS / PARTIAL / FAIL)
- Node ID (component or component set)

## Single Component Shortcut

If `figma-variants.md` has no variant axes (or only one combo):

```
Step 1 (analyze) → Step 2 (build) → Step 3 (verify) → [Step fix loop] → Step 8 (finalize)
```

Skip Steps 4–7 entirely. The default variant IS the final component — no combining needed. Write `figma-result.md` directly from `default-variant/figma-result.md`.
