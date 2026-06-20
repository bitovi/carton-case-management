# Diff and Classify Variants for a Component

Compare captured DOM trees across all variants of a single component to determine which code-level variants produce visually distinct results. Output a machine-readable `figma-variants.json` that maps React props to Figma variant axes and component properties.

## Inputs

| Variable | Source | Description |
|----------|--------|-------------|
| `componentName` | orchestrator | PascalCase name (e.g., `Badge`) |
| `componentDir` | `{pipelineDir}/components/{componentName}/` | Component output directory |
| `pipelineDir` | `.temp/react-to-figma-dom/` | Root output directory |
| `skillDir` | `.claude/skills/react-to-figma-dom/7-generate-build-scripts/` | This phase's directory |

Required files in `{componentDir}`:
- `code-variants.json` — from Phase 6 sub-step 1 (preferred, JSON schema)
- `variants.md` — from Phase 6 sub-step 1 (legacy fallback)
- `variants/` — directory with per-variant folders containing `dom.json`, `screenshot.png`
- `variants/capture-manifest.json` — capture results

## Procedure

### 1. Run diff-variants.js (skip if code-variants.json exists)

If `{componentDir}/code-variants.json` exists, skip this step entirely — the JSON path does not need diffs.

Otherwise, run the diff script:

```bash
node .claude/skills/react-to-figma-dom/scripts/diff-variants.js \
  --variants-dir {componentDir}/variants
```

This produces `{componentDir}/variant-diffs.md` with:
- Verdict matrix (IDENTICAL, TEXT_ONLY, STYLE_ONLY, STRUCTURE_DIFFERENT)
- Visual equivalence groups
- Pair details for non-identical pairs

### 2. Run classify-variants.js

If `{componentDir}/code-variants.json` exists (preferred path — deterministic JSON→JSON transform):

```bash
node {skillDir}/scripts/classify-variants.js \
  --code-variants {componentDir}/code-variants.json \
  --output {componentDir}/figma-variants.json
```

Otherwise fall back to legacy mode (requires diff step above):

```bash
node {skillDir}/scripts/classify-variants.js \
  --variants-md {componentDir}/variants.md \
  --variant-diffs {componentDir}/variant-diffs.md \
  --capture-manifest {componentDir}/variants/capture-manifest.json \
  --output {componentDir}/figma-variants.json
```

This deterministically classifies each variant axis:
- All pairs IDENTICAL/TEXT_ONLY across an axis → **Behavioral** (excluded from Figma variants)
- Any pair STYLE_ONLY/STRUCTURE_DIFFERENT → **Visual** (VARIANT type in Figma)
- Independent boolean axes → **Component Property** (BOOLEAN type)

Any ambiguous axes are flagged as `"classification": "NEEDS_REVIEW"` in the output JSON.

### 3. Resolve NEEDS_REVIEW (conditional)

Read `{componentDir}/figma-variants.json`. Check for any entries with `"classification": "NEEDS_REVIEW"`.

If **none found**: this step is complete. Log:
```
{componentName}: All axes classified deterministically. No AI review needed.
```

If **NEEDS_REVIEW entries exist**: resolve them by examining the variant screenshots.

For each NEEDS_REVIEW axis:
1. Read the `visualGroups` in `figma-variants.json` to understand which variants are grouped
2. View the `screenshot.png` files for variants that differ along this axis
3. Determine if the difference is:
   - **Visual**: Different appearance → classify as VARIANT type
   - **Behavioral**: Same appearance, different interaction → classify as Behavioral (exclude)
   - **State Enabler**: Same base appearance but enables a visual state (e.g., `disabled` adds opacity) → classify as BOOLEAN Component Property

4. Update `figma-variants.json` in place, replacing `"NEEDS_REVIEW"` with the resolved classification

Log:
```
{componentName}: Resolved {count} NEEDS_REVIEW axes via screenshot analysis.
```

## Output

`{componentDir}/figma-variants.json` — machine-readable classification:

```json
{
  "componentName": "Badge",
  "variantAxes": [
    {
      "axis": "Variant",
      "type": "VARIANT",
      "values": ["default", "secondary", "destructive", "outline"],
      "default": "default",
      "reactSource": "prop: variant"
    }
  ],
  "componentProperties": [
    {
      "property": "Show icon",
      "figmaType": "BOOLEAN",
      "default": false,
      "controlledNode": "icon frame"
    }
  ],
  "variantFolderMap": {
    "Variant=default": "variants/VariantDefault",
    "Variant=destructive": "variants/VariantDestructive"
  },
  "behavioralProps": [
    { "prop": "asChild", "reason": "No CSS/DOM change; affects wrapper only" }
  ],
  "visualGroups": [
    {
      "group": "A",
      "variants": ["VariantDefault", "VariantDefaultAsChild"],
      "verdict": "IDENTICAL"
    }
  ]
}
```
