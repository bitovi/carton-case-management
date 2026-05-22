# Get Component Context & Implement in Figma (Per-Component Orchestrator)

Coordinate the full pipeline for a single component: identify variants, generate stories, capture screenshots, analyze which variants are visually distinct, build in Figma, and verify the build.

This prompt can be invoked directly for a single component (e.g., after a failure or to build one component in isolation) or launched in a loop by the top-level orchestrator. All inputs beyond the component name are auto-discovered from existing pipeline outputs.

## Direct Invocation

To run this for a specific component, say:

> "Implement the Button component" — or point at this folder and say "implement Button"

Only the component name is required. Everything else is resolved from `build-order.md` and the `.temp/react-to-figma/` output directory.

## Inputs

- **Component name** *(required)*: PascalCase name (e.g., `Button`). Must match an entry in `build-order.md`.
- **Component path** *(auto-discovered)*: Resolved from `build-order.md` in step 0.
- **Build order index** *(auto-discovered)*: Resolved from `build-order.md` in step 0.
- **Output directory**: `.temp/react-to-figma/components/{Name}/`

## Output Organization

All generated artifacts for a component — including any helper scripts, capture scripts, intermediate files, and final outputs — MUST be placed inside `.temp/react-to-figma/components/{Name}/`. Never create component-specific files at the `.temp/react-to-figma/` root level.

For example, if you need to create a capture script for the Accordion component, place it at `.temp/react-to-figma/components/Accordion/capture-variants.js`, not `.temp/react-to-figma/capture-accordion-variants.js`.

## Prerequisites

These must exist before this prompt runs:
- `.temp/react-to-figma/components/{Name}/analysis.md` (from Phase 1)
- `.temp/react-to-figma/components/{Name}/props.md` (from Phase 1)
- `.temp/react-to-figma/story-patterns.md` (from Phase 4)
- `.temp/react-to-figma/design-tokens.md` (from Phase 2)
- `.temp/react-to-figma/design-tokens.json` (from Phase 2)
- `.temp/react-to-figma/css-figma-map.json` (from Phase 2)
- `.temp/react-to-figma/icons.json` (from Phase 3)
- `.temp/react-to-figma/figma-variables-map.json` (from Phase 5)
- `.temp/react-to-figma/figma-icons-map.json` (from Phase 5)
- `.temp/react-to-figma/figma-assets-map.json` (from Phase 5)
- Storybook running and accessible
- Figma MCP connection available (Phase 5 must be complete)

Optional (from Phase 1 `from-app` strategy):
- `.temp/react-to-figma/components/{Name}/app-context/` — live app element screenshots, HTML, and computed CSS
- `.temp/react-to-figma/component-hierarchy/pages.md` — pages manifest with resolved props
- `.temp/react-to-figma/component-hierarchy/pages.json` — machine-readable page trees

## Procedure

### 0. Resolve component details

Read `.temp/react-to-figma/component-hierarchy/build-order.md`.

Search for a line matching `- [ ] {Name} |` or `- [x] {Name} |`. Extract:
- **Source path** — the second `|`-delimited field (e.g., `src/components/ui/button.tsx`)
- **Build order index** — the component's position (count its line number within its level block, then combine with the level header to produce `{index} of {total}`)

If the component name is not found in `build-order.md`, stop and report:

```
ERROR: Component "{Name}" not found in build-order.md.
Run Phase 1 (find-hierarchy) first, or check the spelling of the component name.
```

If the component is already marked `- [x]` and all outputs exist with a passing `verification.md`, report:

```
Component {Name} already built and verified (marked complete in build-order.md). Skipping.
```

and stop.

### 1. Check for existing outputs (idempotent)

Check if this component has already been fully processed:

```
.temp/react-to-figma/components/{Name}/
  variants.md            ← from step 2
  stories-manifest.md    ← from step 3
  screenshots/           ← from step 4
  figma-variants.md      ← from step 5
  figma-result.md        ← from step 6
  verification.md        ← from step 7
```

If all outputs exist and `verification.md` shows a passing result, skip this component entirely:

```
Component {Name} already processed and verified. Skipping.
```

If partially complete, resume from the first incomplete step.

### 2. Create todo list and execute sub-steps

Create a todo list with all 6 sub-steps for this component:

```
1. {Name}: Identify variants          — not-started
2. {Name}: Generate variant stories   — not-started
3. {Name}: Capture screenshots        — not-started
4. {Name}: Analyze Figma variants     — not-started
5. {Name}: Build & verify in Figma    — not-started
```

Mark any already-completed steps as completed based on the idempotency check in step 1.

Then execute each sub-step in order, marking it in-progress before launching and completed after verifying its output:

#### Sub-step 1: Identify variants

Read `1-get-component-context/1-prompt.identify-variants.md` and launch it as a **subagent** with:
- Component name
- Source file path
- Contents of `analysis.md` and `props.md`
- Output directory
- Contents of `pages.md` (if it exists — for real-world prop context)
- List of files in `app-context/` directory (if it exists — for live app visual reference)

**Expected output**: `variants.md` written to the component directory.

Verify the file was created. If variant count is 0, log a warning and continue with a single "default" variant.

#### Sub-step 2: Generate variant stories

Read `1-get-component-context/2-prompt.generate-variant-stories.md` and launch it as a **subagent** with:
- Component name
- Source file path
- Contents of `variants.md`
- Contents of `props.md`
- Contents of `story-patterns.md`
- Output directory

**Expected output**:
- Story file created in the component's source directory
- `stories-manifest.md` written to the component directory

Verify both files were created.

#### Sub-step 3: Capture variant screenshots

Read `1-get-component-context/3-prompt.capture-variant-screenshots.md` and launch it as a **subagent** with:
- Component name
- Contents of `stories-manifest.md`
- Storybook base URL
- Output directory

**Expected output**:
- Screenshots in `screenshots/` subdirectory
- Updated `stories-manifest.md` with capture results

If the capture step triggers a self-healing retry, it will call back to the story generator internally. This orchestrator does not need to manage retries.

#### Sub-step 4: Analyze Figma variants

Read `1-get-component-context/4-prompt.analyze-figma-variants.md` and launch it as a **subagent** with:
- Component name
- Contents of `variants.md`
- All screenshots from `screenshots/` (PNGs)
- All `screenshots/*.html.md` and `screenshots/*.styles.md` files
- Contents of `screenshots-manifest.json`
- Output directory

**Expected output**: `figma-variants.md` written to the component directory.

This step compares the captured screenshots visually to determine which code-level variants produce distinct visual results. It classifies each variant axis as Visual (becomes a Figma variant), Behavioral (documentation only), or State Enabler (not a variant axis, but its unique states are added to an existing axis). The output `figma-variants.md` contains bidirectional React↔Figma mappings used by the build step.

Verify the file was created and contains at least one Figma variant axis.

#### Sub-step 5: Build & verify in Figma

Read `2-implement-in-figma/prompt.md` and launch it as a **subagent** with:
- Component name
- Component directory path
- Contents of `analysis.md`, `props.md`, `figma-variants.md`, `variants.md`
- Contents of `stories-manifest.md`
- Screenshot paths from `screenshots/`
- Live app context captures (from `app-context/`, if available)
- Design tokens mapping (`design-tokens.json`, `css-figma-map.json`)
- Figma mapping files (`figma-variables-map.json`, `figma-icons-map.json`, `figma-assets-map.json`)
- `builtComponents` map (previously built component name → node ID pairs)
- `fileKey` and `parentFrameId`

The sub-orchestrator handles the full flow internally:
1. Analyzes inputs → produces `build-plan.md`
2. Builds default variant → verifies → fix loop (up to 3 iterations)
3. If multiple variants: analyzes remaining → builds all + combines → verifies and fixes
4. Writes final `figma-result.md` and `verification.md`

**Expected output**: `figma-result.md` and `verification.md` written to the component directory.

If the sub-orchestrator returns a missing dependency error (from `build-plan.md`), stop processing this component and log the error. The dependency must be built first.

### 3. Update build-order.md checklist

After all sub-steps complete (or after confirming all outputs already existed), update the checklist in `build-order.md`:

- If verification result is **PASS**: change `- [ ] {Name} |` → `- [x] {Name} |`
- If verification result is **FAIL** or outputs are **PARTIAL**: leave the checkbox as `- [ ]` so the component remains in the queue for re-processing

Do a direct string replacement on the matching line — do not rewrite the whole file.

### 4. Log completion

After updating the checklist, log the component summary:

```
Component {Name} ({index} of {total}): COMPLETE
  Code variants: {variant_count}
  Figma variants: {figma_variant_count} ({behavioral_count} behavioral pruned)
  Screenshots: {captured}/{total} captured
  Figma: {component_id}
  Verification: {PASS/FAIL}
```

Or if something went wrong:

```
Component {Name} ({index} of {total}): PARTIAL
  Code variants: {variant_count}
  Figma variants: {figma_variant_count}
  Screenshots: {captured}/{total} captured
  Figma: {built/not built}
  Verification: {PASS/FAIL/SKIPPED}
  Missing: {list of missing outputs}
```
