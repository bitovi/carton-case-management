# Get Component Context & Implement in Figma — DOM Pipeline (Per-Component Orchestrator)

Coordinate the full pipeline for a single component: identify variants, generate stories, capture DOM + screenshots, analyze which variants are visually distinct, build in Figma using deterministic DOM-to-Figma scripts, and verify the build.

This is the DOM-based variant of the Phase 6 orchestrator. It shares steps 1-4 (get component context) with the original `react-to-figma` skill, but replaces step 5 (build & verify in Figma) with the deterministic DOM pipeline.

This prompt can be invoked directly for a single component (e.g., after a failure or to build one component in isolation) or launched in a loop by the top-level orchestrator. All inputs beyond the component name are auto-discovered from existing pipeline outputs.

## Your Role

You are a **pure orchestrator**. You do NOT read sub-prompt files or gather context yourself. Your only job is:

1. Launch a subagent with a **prompt file path** and **input file paths**
2. Check the subagent's output file exists
3. Pass output paths forward to the next step

Do NOT read sub-prompt files, input files, screenshots, or JSON maps yourself. Tell each subagent: "Read your prompt at `{path}` and follow its instructions. Your inputs are at `{paths}`." The subagent reads everything it needs.

**Exception**: You DO read `build-order.md` (step 0) and check for file existence (step 1) to manage orchestration flow.

## DO NOT

- Do NOT read the sub-prompt files (e.g., `1-prompt.identify-variants.md`). Pass the file path to the subagent and let it read its own instructions.
- Do NOT read component input files (analysis.md, props.md, screenshots, etc.). Pass paths to the subagent.
- Do NOT combine multiple steps into a single subagent call. Each step is a separate subagent with its own focused prompt.
- Do NOT skip steps based on assumptions. Check for output file existence to determine completeness.

## Direct Invocation

To run this for a specific component, say:

> "Implement the Button component" — or point at this folder and say "implement Button"

Only the component name is required. Everything else is resolved from `build-order.md` and the `.temp/react-to-figma/` output directory.

## Inputs

| Variable | Example | Description |
|----------|---------|-------------|
| `componentName` | `Button` | PascalCase name. Must match an entry in `build-order.md` |
| `fileKey` | `K185dncc0RbBmFGFxA1iyY` | Figma file key |
| `parentFrameId` | `3:4` | Figma parent frame to create components in (optional — auto-discovered if omitted) |
| `builtComponents` | `{ "Badge": "18:5" }` | Map of already-built component name → node ID pairs |

If `parentFrameId` is not provided:
1. Try reading `.temp/react-to-figma/figma-file-setup.json` and using `containerFrames.componentsFrameId`.
2. If that file does not exist or has no `componentsFrameId`, resolve it via `use_figma` at the start of sub-step 5 — see **Resolve parentFrameId** in `2-implement-in-figma/1-prompt.build-all.md`.

Never pass an empty or null `parentFrameId` to the build subagent. The build subagent is responsible for resolving it if omitted.

Auto-discovered from `build-order.md`:
- **Component path**: Source file path (e.g., `src/components/ui/button.tsx`)
- **Build order index**: Position within its level block

Derived paths:
- `componentDir` = `.temp/react-to-figma/components/{componentName}/`
- `pipelineDir` = `.temp/react-to-figma/`
- `skillDir` = `.claude/skills/react-to-figma-dom/6-get-component-context-and-implement-in-figma/`

## Output Organization

All generated artifacts for a component — including any helper scripts, capture scripts, intermediate files, and final outputs — MUST be placed inside `{componentDir}`. Never create component-specific files at the `.temp/react-to-figma/` root level.

## Prerequisites

These must exist before this prompt runs:
- `{componentDir}/analysis.md` (from Phase 1)
- `{componentDir}/props.md` (from Phase 1)
- `{pipelineDir}/story-patterns.md` (from Phase 4)
- `{pipelineDir}/design-tokens.md` (from Phase 2)
- `{pipelineDir}/design-tokens.json` (from Phase 2)
- `{pipelineDir}/css-figma-map.json` (from Phase 2)
- `{pipelineDir}/icons.json` (from Phase 3)
- `{pipelineDir}/figma-variables-map.json` (from Phase 5)
- `{pipelineDir}/figma-icons-map.json` (from Phase 5)
- `{pipelineDir}/figma-assets-map.json` (from Phase 5)
- Storybook running and accessible
- Figma MCP connection available (Phase 5 must be complete)

Optional (from Phase 1 `from-app` strategy):
- `{componentDir}/app-context/` — live app element screenshots, HTML, and computed CSS
- `{pipelineDir}/component-hierarchy/pages.md` — pages manifest with resolved props
- `{pipelineDir}/component-hierarchy/pages.json` — machine-readable page trees

## Procedure

### 0. Resolve component details

Read `{pipelineDir}/component-hierarchy/build-order.md`.

Search for a table row containing `| {componentName} |`. Extract:
- **Source path** — from the Source column (e.g., `obra/Badge`)
- **Build order index** — the component's position (count its row within its level block)

If the component name is not found in `build-order.md`, stop and report:

```
ERROR: Component "{componentName}" not found in build-order.md.
Run Phase 1 (find-hierarchy) first, or check the spelling of the component name.
```

### 1. Check for existing outputs (idempotent)

Check if this component has already been fully processed:

```
{componentDir}/
  variants.md            ← from sub-step 1
  stories-manifest.md    ← from sub-step 2
  variants/              ← from sub-step 3 (must contain dom.json files per variant)
  figma-variants.md      ← from sub-step 4
  figma-result.md        ← from sub-step 5
  verification-results.json ← from sub-step 5
```

If all outputs exist and `verification-results.json` shows `"overallVerdict": "PASS"`, skip this component entirely:

```
Component {componentName} already processed and verified. Skipping.
```

If partially complete, resume from the first incomplete step.

### 2. Create todo list and execute sub-steps

Create a todo list with all 5 sub-steps for this component:

```
1. {componentName}: Identify variants          — not-started
2. {componentName}: Generate variant stories   — not-started
3. {componentName}: Capture DOM + screenshots  — not-started
4. {componentName}: Analyze Figma variants     — not-started
5. {componentName}: Build & verify in Figma    — not-started
```

Mark any already-completed steps as completed based on the idempotency check in step 1.

Then execute each sub-step in order, marking it in-progress before launching and completed after verifying its output:

#### Sub-step 1: Identify variants

Launch a **subagent** with:
- **Prompt**: `{skillDir}/1-get-component-context/1-prompt.identify-variants.md`
- **Inputs**: `{componentDir}/analysis.md`, `{componentDir}/props.md`, `{pipelineDir}/component-hierarchy/pages.md` (if exists), `{componentDir}/app-context/` (if exists)
- **Additional context**: component name, source file path
- **Output**: `{componentDir}/variants.md`

Tell the subagent: "Read your prompt at `{skillDir}/1-get-component-context/1-prompt.identify-variants.md`. Your component dir is `{componentDir}`. Component name is `{componentName}`, source path is `{sourcePath}`."

Verify `variants.md` was created. If variant count is 0, log a warning and continue with a single "default" variant.

#### Sub-step 2: Generate variant stories

Launch a **subagent** with:
- **Prompt**: `{skillDir}/1-get-component-context/2-prompt.generate-variant-stories.md`
- **Inputs**: `{componentDir}/variants.md`, `{componentDir}/props.md`, `{pipelineDir}/story-patterns.md`
- **Additional context**: component name, source file path
- **Output**: Story file in the component's source directory + `{componentDir}/stories-manifest.md`

Tell the subagent: "Read your prompt at `{skillDir}/1-get-component-context/2-prompt.generate-variant-stories.md`. Your component dir is `{componentDir}`. Component name is `{componentName}`, source path is `{sourcePath}`."

Verify both files were created.

#### Sub-step 3: Capture DOM + screenshots

Launch a **subagent** with:
- **Prompt**: `{skillDir}/1-get-component-context/3-prompt.capture-variant-screenshots.md`
- **Inputs**: `{componentDir}/stories-manifest.md`
- **Additional context**: component name, Storybook base URL
- **Output**: DOM captures in `{componentDir}/variants/` — per-variant folders containing `dom.json`, `fiber-dom-map.json`, `screenshot.png`, `html.md`, `styles.md`, plus `{componentDir}/variants/capture-manifest.json`

Tell the subagent: "Read your prompt at `{skillDir}/1-get-component-context/3-prompt.capture-variant-screenshots.md`. Your component dir is `{componentDir}`. Component name is `{componentName}`."

**Key difference from original**: This step uses `capture-dom.js` instead of `capture-storybook-variants.js`. It produces structured `dom.json` files in per-variant folders needed by the DOM pipeline in sub-step 5.

#### Sub-step 4: Analyze Figma variants

Launch a **subagent** with:
- **Prompt**: `{skillDir}/1-get-component-context/4-prompt.analyze-figma-variants.md`
- **Inputs**: `{componentDir}/variants.md`, `{componentDir}/variants/` (all `screenshot.png`, `html.md`, `styles.md` per variant folder), `{componentDir}/variants/capture-manifest.json`
- **Additional context**: component name
- **Output**: `{componentDir}/figma-variants.md`

Tell the subagent: "Read your prompt at `{skillDir}/1-get-component-context/4-prompt.analyze-figma-variants.md`. Your component dir is `{componentDir}`. Component name is `{componentName}`."

Verify the file was created and contains at least one Figma variant axis.

#### Sub-step 5: Build & verify in Figma (DOM pipeline)

Launch a **subagent** with:
- **Prompt**: `{skillDir}/2-implement-in-figma/prompt.md`
- **Inputs**: `{componentDir}/analysis.md`, `props.md`, `figma-variants.md`, `variants.md`, `variants/` (per-variant folders with `dom.json` files), `{pipelineDir}/figma-variables-map.json`, `figma-icons-map.json`, `figma-assets-map.json`, `design-tokens.json`
- **Additional context**: `componentName`, `fileKey`, `parentFrameId`, `builtComponents`
- **Output**: `{componentDir}/figma-result.md`, `{componentDir}/verification-results.json`

Tell the subagent: "Read your prompt at `{skillDir}/2-implement-in-figma/prompt.md`. componentName=`{componentName}`, componentDir=`{componentDir}`, pipelineDir=`{pipelineDir}`, skillDir=`{skillDir}/2-implement-in-figma`, fileKey=`{fileKey}`, parentFrameId=`{parentFrameId}`, builtComponents=`{builtComponents}`."

**Key difference from original**: This sub-orchestrator runs deterministic scripts (dom-to-figma-ir.js → ir-to-figma-code.js) instead of prompting an AI to write `use_figma` code from scratch. AI is only invoked if verification fails.

### 3. Update build-order.md checklist

After all sub-steps complete (or after confirming all outputs already existed), update the checklist in `build-order.md`:

- If `verification-results.json` has `"overallVerdict": "PASS"`: change `- [ ] {componentName} |` → `- [x] {componentName} |`
- If verdict is **FAIL** or outputs are **PARTIAL**: leave the checkbox as `- [ ]` so the component remains in the queue for re-processing

Do a direct string replacement on the matching line — do not rewrite the whole file.

### 4. Log completion

After updating the checklist, log the component summary:

```
Component {componentName} ({index} of {total}): COMPLETE
  Code variants: {variant_count}
  Figma variants: {figma_variant_count} ({behavioral_count} behavioral pruned)
  Screenshots: {captured}/{total} captured
  DOM captures: {dom_json_count} .dom.json files
  Figma: {component_id}
  Verification: {PASS/FAIL}
  Method: DOM pipeline (deterministic)
```
