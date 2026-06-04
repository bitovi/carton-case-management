# Generate Build Scripts for All Components

Run the deterministic DOM-to-Figma pipeline for every component in the pipeline: generate Figma IR from the captured DOM, then generate executable build scripts from the IR. No AI is needed — this is pure script execution.

## Inputs

| Variable | Source | Description |
|----------|--------|-------------|
| `pipelineDir` | `.temp/react-to-figma-dom/` | Root output directory |
| `skillDir` | `.claude/skills/react-to-figma-dom` | Skill root directory |

Required files (checked by the script):
- `{pipelineDir}/components/*/variants/` — per-variant folders with `dom.json`
- `{pipelineDir}/figma-variables-map.json` — from Phase 5
- `{pipelineDir}/design-tokens.json` — from Phase 2
- `{pipelineDir}/figma-icons-map.json` — from Phase 5
- `{pipelineDir}/built-components.json` — may not exist yet (deferred refs handled gracefully)

## Procedure

Run the prebuilt script in **batch mode**:

```bash
node .claude/skills/react-to-figma-dom/scripts/generate-variant-build-scripts.js \
  --all \
  --pipeline-dir {pipelineDir} \
  --skill-dir {skillDir}
```

Add `--force` to regenerate existing IR and build scripts.

The script:
1. Discovers all component directories in `{pipelineDir}/components/`
2. For each component, discovers variant folders via `variantFolderMap` in `figma-variants.json` (or scans `variants/` for subdirs with `dom.json`)
3. Runs `dom-to-figma-ir.js` per variant (DOM → Figma IR)
4. Runs `ir-to-figma-code.js` per variant (Figma IR → build script), passing `--variant-props` automatically from `variantFolderMap`
5. Skips variants that already have both `figma-ir.json` and `build-script.js` (unless `--force`)
6. Writes `preprocess-status.json` per component with per-variant results

If `built-components.json` does not exist yet, the IR script emits deferred INSTANCE references that are resolved at build time (Phase 8).

Exit code is 1 if any variant failed; 0 otherwise.

### Single-component mode

For Phase H (build-remaining), the script also supports single-component mode:

```bash
node .claude/skills/react-to-figma-dom/scripts/generate-variant-build-scripts.js \
  --component {componentName} \
  --pipeline-dir {pipelineDir} \
  --skill-dir {skillDir}
```

## Output

Per component:
- `{pipelineDir}/components/{componentName}/variants/{folder}/figma-ir.json`
- `{pipelineDir}/components/{componentName}/variants/{folder}/build-script.js`
- `{pipelineDir}/components/{componentName}/preprocess-status.json`
