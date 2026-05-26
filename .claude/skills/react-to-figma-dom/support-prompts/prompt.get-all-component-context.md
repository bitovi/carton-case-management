# Get All Component Context (Batch Orchestrator)

Iterate through every component in `build-order.md` and run the four context-gathering sub-steps for each one: identify variants, generate stories, capture DOM + screenshots, and analyze Figma variants.

This prompt does NOT build anything in Figma. It only gathers the context needed for a later Figma build step. Use this when you want to front-load all context capture before starting any Figma work.

## Your Role

You are a **pure orchestrator**. You do NOT read sub-prompt files or gather context yourself. Your only job is:

1. Read `build-order.md` to get the full component list
2. Create a todo list with all components × 4 sub-steps
3. For each component, launch subagents for sub-steps 1–4 in order
4. Check output file existence between steps
5. Track progress via the todo list

Do NOT read sub-prompt files, component analysis files, screenshots, or JSON maps yourself. Pass file paths to each subagent and let it read its own inputs.

## DO NOT

- Do NOT read the sub-prompt files (e.g., `1-prompt.identify-variants.md`). Pass the file path to the subagent.
- Do NOT read component input files (analysis.md, props.md, screenshots, etc.). Pass paths to the subagent.
- Do NOT combine multiple sub-steps into a single subagent call. Each sub-step is a separate subagent.
- Do NOT skip sub-steps based on assumptions. Check for output file existence to determine completeness.
- Do NOT attempt to build in Figma. This prompt covers context gathering only (sub-steps 1–4).

## Inputs

| Variable | Default | Description |
|----------|---------|-------------|
| `pipelineDir` | `.temp/react-to-figma/` | Root of all pipeline outputs |
| `skillDir` | `.claude/skills/react-to-figma-dom/6-get-component-context-and-implement-in-figma/` | Location of sub-prompt files |

Derived per component:
- `componentDir` = `{pipelineDir}/components/{componentName}/`

## Prerequisites

These must exist before this prompt runs:
- `{pipelineDir}/component-hierarchy/build-order.md` (from Phase 1)
- `{componentDir}/analysis.md` for each component (from Phase 1)
- `{componentDir}/props.md` for each component (from Phase 1)
- `{pipelineDir}/story-patterns.md` (from Phase 4)
- Storybook running and accessible

Optional:
- `{componentDir}/app-context/` — live app element captures (from Phase 1 `from-app` strategy)
- `{pipelineDir}/component-hierarchy/pages.md` — pages manifest with resolved props

## Procedure

### 0. Parse build-order.md

Read `{pipelineDir}/component-hierarchy/build-order.md`.

Extract every component row from the markdown tables. Each row has the format:

```
| ComponentName | type | source/path |
```

or with a checkmark:

```
| ✅ ComponentName | type | source/path |
```

Build a flat list of all components in build order (Level 0 first, then Level 1, etc.). For each component, extract:
- **componentName**: The PascalCase name (strip any leading `✅ ` prefix)
- **sourcePath**: The Source column value

### 1. Build todo list

Create a todo list with entries for **every** component. Always run all 4 sub-steps — do not skip based on existing outputs. Group all 4 sub-steps per component:

```
1.  {ComponentA}: Identify variants         — not-started
2.  {ComponentA}: Generate variant stories  — not-started
3.  {ComponentA}: Capture DOM + screenshots — not-started
4.  {ComponentA}: Analyze Figma variants    — not-started
5.  {ComponentB}: Identify variants         — not-started
6.  {ComponentB}: Generate variant stories  — not-started
...
```

### 2. Process each component

For each component in the todo list, execute sub-steps 1–4 sequentially. Mark each todo in-progress before launching and completed after verifying its output.

#### Sub-step 1: Identify variants

Launch a **subagent** with:

> "Read your prompt at `{skillDir}/1-get-component-context/1-prompt.identify-variants.md` and follow its instructions. Your component dir is `{componentDir}`. Component name is `{componentName}`, source path is `{sourcePath}`."

**Verify**: `{componentDir}/variants.md` was created.

If the subagent fails or the file is not created, log the error and **skip to the next component** — do not block the entire batch.

#### Sub-step 2: Generate variant stories

**Requires**: `{componentDir}/variants.md` from sub-step 1.

Launch a **subagent** with:

> "Read your prompt at `{skillDir}/1-get-component-context/2-prompt.generate-variant-stories.md` and follow its instructions. Your component dir is `{componentDir}`. Component name is `{componentName}`, source path is `{sourcePath}`."

**Verify**: `{componentDir}/stories-manifest.md` was created.

If the subagent fails, log the error and skip to the next component.

#### Sub-step 3: Capture DOM + screenshots

**Requires**: `{componentDir}/stories-manifest.md` from sub-step 2.

Launch a **subagent** with:

> "Read your prompt at `{skillDir}/1-get-component-context/3-prompt.capture-variant-screenshots.md` and follow its instructions. Your component dir is `{componentDir}`. Component name is `{componentName}`."

**Verify**: `{componentDir}/variants/` contains per-variant subfolders with capture outputs.

If the subagent fails, log the error and skip to the next component.

#### Sub-step 4: Analyze Figma variants

**Requires**: `{componentDir}/variants.md` and captured screenshots from sub-step 3.

Launch a **subagent** with:

> "Read your prompt at `{skillDir}/1-get-component-context/4-prompt.analyze-figma-variants.md` and follow its instructions. Your component dir is `{componentDir}`. Component name is `{componentName}`."

**Verify**: `{componentDir}/figma-variants.md` was created and contains at least one Figma variant axis.

If the subagent fails, log the error and continue to the next component.

### 3. Summary report

After processing all components, output a summary:

```
## Context Capture Summary

| Component | Variants | Stories | Captures | Figma Variants | Status |
|-----------|----------|---------|----------|----------------|--------|
| Badge     | ✅       | ✅      | ✅       | ✅             | DONE   |
| Button    | ✅       | ✅      | ❌       | —              | PARTIAL |
| Input     | ✅       | ✅      | ✅       | ✅             | DONE   |
...

Total: X/Y components fully captured.
Failed: [list of components that failed and at which step]
```

Components marked DONE have all four context files and are ready for the Figma build phase. Components marked PARTIAL need re-processing — re-run this prompt or invoke the per-component orchestrator (`prompt.md`) for individual components.
