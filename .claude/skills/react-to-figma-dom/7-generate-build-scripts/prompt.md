# Generate Build Scripts — Batch Orchestrator

Iterate over ALL components and run the offline processing pipeline: diff DOM trees, classify variant axes, generate Figma IR, generate build scripts, then prioritize which variants appear in page views. No Storybook or browser needed — this phase works entirely from files produced by Phase 6.

## Your Role

You are a **pure orchestrator**. You do NOT read sub-prompt files or gather context yourself. Your only job is:

1. Read `build-order.md` to get the component list
2. For each component, launch 1 subagent for diff-and-classify
3. After all components are classified, run the batch build-script generator
4. After build scripts are generated, launch 1 subagent for page-variant prioritization
5. Track progress and report completion

Do NOT read sub-prompt files, variant data, or JSON maps yourself.

## DO NOT

- Do NOT read the sub-prompt files. Pass the file path to the subagent.
- Do NOT read component input files. Pass paths to the subagent.
- Do NOT combine multiple steps into a single subagent call.
- Do NOT skip steps based on assumptions. Check for output file existence.

## Inputs

| Variable | Source | Description |
|----------|--------|-------------|
| `pipelineDir` | `.temp/react-to-figma-dom/` | Root output directory |
| `skillDir` | `.claude/skills/react-to-figma-dom/7-generate-build-scripts/` | This phase's directory |

Auto-discovered:
- `buildOrder` — from `{pipelineDir}/component-hierarchy/build-order.md`
- Per-component: `componentDir` = `{pipelineDir}/components/{componentName}/`

## Prerequisites

Phase 6 (Capture DOM from Stories) must be complete:
- Every component in build-order.md has `{componentDir}/variants/` with `dom.json` files
- `{pipelineDir}/figma-variables-map.json` (from Phase 5)
- `{pipelineDir}/design-tokens.json` (from Phase 2)
- `{pipelineDir}/figma-icons-map.json` (from Phase 5)
- `{pipelineDir}/component-hierarchy/pages.json` (from Phase 1, for step 3)

## Procedure

### 0. Read build order

Read `{pipelineDir}/component-hierarchy/build-order.md`. Extract the component list in build order.

### 1. Per-component: Diff and classify

For each component in the build order:

#### Check for existing outputs (idempotent)

Check if this component already has `figma-variants.json`:
```
{componentDir}/figma-variants.json       ← from diff-and-classify
```

If it exists, skip this component.

#### Diff and classify

Launch a **subagent** with:
- **Prompt**: `{skillDir}/1-prompt.diff-and-classify-for-a-component.md`
- **Context**: component name, `{componentDir}`, `{pipelineDir}`, `{skillDir}`
- **Output**: `{componentDir}/figma-variants.json`

Tell the subagent: "Read your prompt at `{skillDir}/1-prompt.diff-and-classify-for-a-component.md`. Component name is `{componentName}`, componentDir is `{componentDir}`, pipelineDir is `{pipelineDir}`, skillDir is `{skillDir}`."

Verify `figma-variants.json` was created.

#### Log per-component completion

```
{componentName} ({index}/{total}): Build scripts generated
  Variant axes: {count}
  Build scripts: {count}
```

### 2. Generate build scripts (batch — all components at once)

After ALL components have been diff-classified, run the batch build-script generator:

```bash
node {skillDir}/../scripts/generate-variant-build-scripts.js \
  --all \
  --pipeline-dir {pipelineDir} \
  --skill-dir {skillDir}/..
```

Add `--force` to regenerate existing IR and build scripts.

This script processes every component in `{pipelineDir}/components/`, generates Figma IR and build scripts for each variant, and writes `preprocess-status.json` per component.

Verify that every component in build-order has a `preprocess-status.json`.

### 3. Prioritize page variants (whole-set)

After ALL components have been processed, launch a **subagent** with:
- **Prompt**: `{skillDir}/3-prompt.prioritize-page-variants.md`
- **Context**: `{pipelineDir}`
- **Output**: `{pipelineDir}/page-priority-manifest.json`

Tell the subagent: "Read your prompt at `{skillDir}/3-prompt.prioritize-page-variants.md`. pipelineDir is `{pipelineDir}`."

Verify `page-priority-manifest.json` was created.

### 4. Phase summary

```
Phase 7 Complete: Generate Build Scripts
  Components processed: {processed}/{total}
  Components skipped (already complete): {skipped}
  Total build scripts generated: {sum}
  Page-priority variants identified: {count from manifest}

All preprocessing complete. Ready for Phase 5 (Figma Setup) then Phase 8 (Batch Build).
```

Update `{pipelineDir}/state.json` to mark phase 7 as complete.
