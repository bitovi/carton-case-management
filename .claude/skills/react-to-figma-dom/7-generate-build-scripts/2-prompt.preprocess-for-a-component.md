# Preprocess IR and Build Scripts for a Component

Run the deterministic DOM-to-Figma pipeline for each variant of a single component: generate Figma IR from the captured DOM, then generate executable build scripts from the IR. No AI is needed — this is pure script execution.

## Inputs

| Variable | Source | Description |
|----------|--------|-------------|
| `componentName` | orchestrator | PascalCase name |
| `componentDir` | `{pipelineDir}/components/{componentName}/` | Component output directory |
| `pipelineDir` | `.temp/react-to-figma/` | Root output directory |

Required files:
- `{componentDir}/figma-variants.json` — from step 1 (diff-and-classify)
- `{componentDir}/variants/` — per-variant folders with `dom.json`
- `{pipelineDir}/figma-variables-map.json` — from Phase 5
- `{pipelineDir}/design-tokens.json` — from Phase 2
- `{pipelineDir}/figma-icons-map.json` — from Phase 5
- `{pipelineDir}/built-components.json` — may not exist yet (deferred refs)

## Procedure

### 1. Identify variants to process

Read `{componentDir}/figma-variants.json`. Use the `variantFolderMap` to get the list of variant folders that need build scripts. Only process variants with `type: "VARIANT"` axes — behavioral variants are excluded.

### 2. Generate Figma IR for each variant

For each variant folder:

```bash
node .claude/skills/react-to-figma-dom/scripts/dom-to-figma-ir.js \
  --dom-file "{componentDir}/variants/{variantFolder}/dom.json" \
  --fiber-map "{componentDir}/variants/{variantFolder}/fiber-dom-map.json" \
  --variables-map "{pipelineDir}/figma-variables-map.json" \
  --design-tokens "{pipelineDir}/design-tokens.json" \
  --icons-map "{pipelineDir}/figma-icons-map.json" \
  --built-components "{pipelineDir}/built-components.json" \
  --component-name {componentName} \
  --output "{componentDir}/variants/{variantFolder}/figma-ir.json"
```

If `built-components.json` does not exist yet, the script emits deferred INSTANCE references:
```json
{ "type": "INSTANCE", "componentRef": "Badge", "masterNodeId": null }
```
These are resolved at build time (Phase 8) when `built-components.json` is populated.

### 3. Generate build scripts from IR

For each variant folder that has a `figma-ir.json`:

```bash
node .claude/skills/react-to-figma-dom/scripts/ir-to-figma-code.js \
  --ir-file "{componentDir}/variants/{variantFolder}/figma-ir.json" \
  --output "{componentDir}/variants/{variantFolder}/build-script.js"
```

### 4. Verify outputs

For each processed variant, confirm both files exist:
- `{componentDir}/variants/{variantFolder}/figma-ir.json`
- `{componentDir}/variants/{variantFolder}/build-script.js`

Write a status summary to `{componentDir}/preprocess-status.json`:

```json
{
  "componentName": "Badge",
  "variantsProcessed": 4,
  "variantsSkipped": 2,
  "status": "complete",
  "variants": {
    "VariantDefault": { "ir": true, "buildScript": true },
    "VariantDestructive": { "ir": true, "buildScript": true }
  }
}
```

## Output

- `{componentDir}/variants/{variantFolder}/figma-ir.json` — per variant
- `{componentDir}/variants/{variantFolder}/build-script.js` — per variant
- `{componentDir}/preprocess-status.json` — summary
