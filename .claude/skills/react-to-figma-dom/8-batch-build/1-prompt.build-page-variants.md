# Build Page Variants (Phase D)

Build only the variants that appear in page views, processing components in build order (leaves first). After each component, run verification.

## Inputs

| Variable | Source | Description |
|----------|--------|-------------|
| `pipelineDir` | `.temp/react-to-figma-dom/` | Root output directory |
| `skillDir` | `.claude/skills/react-to-figma-dom/8-batch-build/` | This phase's directory |
| `fileKey` | env/config | Figma file key |
| `parentFrameId` | Phase 5 output | Figma container frame ID |

Required files:
- `{pipelineDir}/page-priority-manifest.json` — from Phase 7
- `{pipelineDir}/component-hierarchy/build-order.md` — from Phase 1
- `{pipelineDir}/built-components.json` — starts empty, grows as components are built

## Procedure

### 0. Pre-flight: Validate Phase 5 outputs

Before building anything, validate that Phase 5 map files contain real Figma IDs:

```bash
node .claude/skills/react-to-figma-dom/scripts/validate-phase5-outputs.js \
  --pipeline-dir {pipelineDir}
```

If the script exits with code 1 (invalid), **STOP**. Report: "Phase 5 outputs contain invalid Figma IDs (e.g., placeholder strings instead of real node IDs). Re-run Phase 5 before attempting Phase D." Do NOT proceed to step 1.

### 1. Load manifest and build order

Read `{pipelineDir}/page-priority-manifest.json`. Read `build-order.md`. Filter to only components that have non-empty `pageVariants` arrays. Process in build order (leaves first so parent components can reference child INSTANCE IDs).

### 2. For each component with page variants

#### Build

Launch a **subagent** with:
- **Prompt**: `{skillDir}/prompts/build-a-component.md`
- **Context**: componentName, componentDir, pipelineDir, fileKey, parentFrameId, builtComponents, variantFilter (only build variants in `pageVariants`)
- **Output**: `{componentDir}/figma-result.json`, updated `{pipelineDir}/built-components.json`

Tell the subagent: "Read your prompt at `{skillDir}/prompts/build-a-component.md`. Build ONLY these variants: `{pageVariants}`. componentName=`{componentName}`, componentDir=`{componentDir}`, fileKey=`{fileKey}`, parentFrameId=`{parentFrameId}`."

#### Verify

After each build, run the batch-verify script:
```bash
node {skillDir}/batch-verify.js \
  --component-dir {componentDir} \
  --file-key {fileKey}
```

#### Update built-components.json

Read `{componentDir}/figma-result.json` for the component's Figma node ID. Add it to `{pipelineDir}/built-components.json`.

### 3. Log summary

```
Phase D Complete: Build Page Variants
  Components built: {count}
  Variants built: {total variant count}
  PASS: {count}  PARTIAL: {count}  FAIL: {count}
```
