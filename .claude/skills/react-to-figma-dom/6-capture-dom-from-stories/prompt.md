# Capture DOM from Stories — Parallel Wave Orchestrator

Run sub-steps 1→2→3 for ALL components from `build-order.json` using three parallel waves. After this phase completes, every component has `code-variants.json`, a stories file, and per-variant `dom.json` + `screenshot.png`. Storybook is no longer needed after this phase.

## Your Role

You are a **pure orchestrator**. You do NOT read sub-prompt files or gather context yourself. Your only job is:

1. Read `build-order.json` to get the component list
2. Launch 3 waves of parallel subagents across ALL components
3. Check that each wave's output files exist before starting the next wave
4. Track progress and report completion

Do NOT read sub-prompt files, component source files, screenshots, or JSON maps yourself. Tell each subagent: "Read your prompt at `{path}` and follow its instructions."

## DO NOT

- Do NOT read the sub-prompt files. Pass the file path to the subagent and let it read its own instructions.
- Do NOT read component input files. Pass paths to the subagent.
- Do NOT combine multiple steps into a single subagent call.
- Do NOT skip steps based on assumptions. Check for output file existence.

## Inputs

| Variable | Source | Description |
|----------|--------|-------------|
| `pipelineDir` | `.temp/react-to-figma-dom/` | Root output directory |
| `skillDir` | `.claude/skills/react-to-figma-dom/6-capture-dom-from-stories/` | This phase's directory |
| `storybookUrl` | `http://localhost:6006` | Storybook base URL (must be running) |

Auto-discovered:
- `buildOrder` — from `{pipelineDir}/component-hierarchy/build-order.json`
- Per-component: `componentDir` = `{pipelineDir}/components/{componentName}/`

## Prerequisites

These must exist before this phase runs:
- `{pipelineDir}/component-hierarchy/build-order.json` (from Phase 1)
- `{pipelineDir}/story-patterns.md` (from Phase 4)
- Per-component: `{componentDir}/analysis.md` (from Phase 1)
- Storybook running and accessible at `{storybookUrl}`

Note: `props.md` is generated on-the-fly by step 6.1 (identify-variants) if not already present.

Optional (from Phase 1 `from-app` strategy):
- `{pipelineDir}/component-hierarchy/pages.json` (queried on demand via `query-pages.js`)
- `{componentDir}/app-variants/`

## Procedure

### 0. Read build order

Read `{pipelineDir}/component-hierarchy/build-order.json`. Extract the component list from the `levels` array. Build a list of `{ name, sourcePath }` objects in build order (level 0 first).

### 1. Wave 1 — Identify Variants (all components in parallel)

For each component, check if `{componentDir}/code-variants.json` already exists. Collect all components that still need variant identification.

Launch **parallel subagents** — one per component that needs it:

Tell each subagent: "Read your prompt at `{skillDir}/1-prompt.identify-variants-for-a-component.md`. Your component dir is `{componentDir}`. Component name is `{componentName}`, source path is `{sourcePath}`."

- **Prompt**: `{skillDir}/1-prompt.identify-variants-for-a-component.md`
- **Context**: component name, source path, `{componentDir}`, `{pipelineDir}`
- **Output**: `{componentDir}/code-variants.json`

Wait for ALL subagents to complete. Verify each produced `code-variants.json`. Log:
```
Wave 1 complete: Identify Variants
  Passed: {pass_count}/{total}
  Skipped (already had code-variants.json): {skip_count}
  Failed: {fail_list or "none"}
```

If any failed, report failures but continue with the components that passed.

### 2. Wave 2 — Generate Stories (all components in parallel)

For each component that has `code-variants.json` (from Wave 1 or pre-existing), check if a stories file already exists. Collect all components that still need story generation.

Launch **parallel subagents** — one per component that needs it:

Tell each subagent: "Read your prompt at `{skillDir}/2-prompt.generate-stories-for-a-component.md`. Your component dir is `{componentDir}`. Component name is `{componentName}`, source path is `{sourcePath}`."

- **Prompt**: `{skillDir}/2-prompt.generate-stories-for-a-component.md`
- **Context**: component name, source path, `{componentDir}`, `{pipelineDir}`
- **Output**: Story file + `{componentDir}/stories-manifest.md`

Wait for ALL subagents to complete. Verify each produced a story file. Log:
```
Wave 2 complete: Generate Stories
  Passed: {pass_count}/{total}
  Skipped (already had stories): {skip_count}
  Failed: {fail_list or "none"}
```

**Storybook settle pause**: After all story files are written, wait 5 seconds for Storybook's hot-reload to finish processing the new files before proceeding to Wave 3.

### 3. Wave 3 — Capture DOM (all components in parallel)

For each component that has a stories file (from Wave 2 or pre-existing), check if `{componentDir}/variants/capture-manifest.json` already exists. Collect all components that still need DOM capture.

Launch **parallel subagents** — one per component that needs it:

Tell each subagent: "Read your prompt at `{skillDir}/3-prompt.capture-dom-for-a-component.md`. Your component dir is `{componentDir}`. Component name is `{componentName}`."

- **Prompt**: `{skillDir}/3-prompt.capture-dom-for-a-component.md`
- **Context**: component name, `{componentDir}`, Storybook URL
- **Output**: `{componentDir}/variants/` with per-variant folders containing `dom.json`, `screenshot.png`

Wait for ALL subagents to complete. Verify at least one `dom.json` file exists per component. Log:
```
Wave 3 complete: Capture DOM
  Passed: {pass_count}/{total}
  Skipped (already had captures): {skip_count}
  Failed: {fail_list or "none"}
```

**Note on resources**: Each subagent launches its own Playwright browser. If the machine has limited resources, the system will naturally throttle concurrent browser instances. No explicit concurrency limit is needed — the subagent runtime handles scheduling.

### 4. Phase summary

After all waves complete:

```
Phase 6 Complete: Capture DOM from Stories (3 parallel waves)
  Components processed: {processed}/{total}
  Components skipped (already complete): {skipped}
  Wave 1 (variants): {pass}/{total} passed
  Wave 2 (stories): {pass}/{total} passed
  Wave 3 (captures): {pass}/{total} passed
  Total DOM captures: {sum of all dom.json files}

Storybook is no longer required. Proceeding to Phase 7 (Generate Build Scripts).
```

Update `{pipelineDir}/state.json` to mark phase 6 as complete.
