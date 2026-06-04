# Build Remaining Variants (Phase H)

Build all variants NOT yet built in Phase D. Process components in build order. After each component, run verification.

## Inputs

| Variable | Source | Description |
|----------|--------|-------------|
| `pipelineDir` | `.temp/react-to-figma-dom/` | Root output directory |
| `skillDir` | `.claude/skills/react-to-figma-dom/8-batch-build/` | This phase's directory |
| `fileKey` | env/config | Figma file key |

Required files:
- `{pipelineDir}/page-priority-manifest.json` — to know which variants were already built
- `{pipelineDir}/component-hierarchy/build-order.md`
- `{pipelineDir}/built-components.json`

## Procedure

### 1. Identify remaining variants

For each component in build order:
1. Read `{componentDir}/figma-variants.json` to get ALL variants
2. Read `{pipelineDir}/page-priority-manifest.json` to get already-built page variants
3. Compute remaining = all variants - page variants

Skip components where all variants are already built.

### 2. Build remaining variants per component

For each component with remaining variants:

Launch a **subagent** with:
- **Prompt**: `{skillDir}/prompts/build-a-component.md`
- **Context**: componentName, componentDir, pipelineDir, fileKey, parentFrameId, builtComponents, variantFilter (only remaining variants)

Tell the subagent: "Read your prompt at `{skillDir}/prompts/build-a-component.md`. Build ONLY these remaining variants: `{remainingVariants}`. componentName=`{componentName}`, componentDir=`{componentDir}`, fileKey=`{fileKey}`."

The build scripts are **idempotent** — each variant's `build-script.js` will find the existing ComponentSet (created in Phase F) and append the new variant to it. No special merge logic is needed.

After each build, verify:
```bash
node {skillDir}/batch-verify.js \
  --component-dir {componentDir} \
  --file-key {fileKey}
```

### 3. Log summary

```
Phase H Complete: Build Remaining Variants
  Components with remaining variants: {count}
  Variants built: {total}
  PASS: {count}  PARTIAL: {count}  FAIL: {count}
```
