# Prioritize Page Variants

Cross-reference `pages.json` (route → component tree with props) against each component's `figma-variants.json` (prop combos → variant folder names) to determine which variants appear in page views. Output `page-priority-manifest.json` so the build phase can build page-needed variants first.

## Inputs

| Variable | Source | Description |
|----------|--------|-------------|
| `pipelineDir` | `.temp/react-to-figma/` | Root output directory |

Required files:
- `{pipelineDir}/component-hierarchy/pages.json` — from Phase 1 browser crawl
- `{pipelineDir}/components/{Name}/figma-variants.json` — per component, from step 1

## Procedure

### 1. Load pages.json

Read `{pipelineDir}/component-hierarchy/pages.json`. Each entry describes a route with its component tree and the props each component receives:

```json
{
  "routes": [
    {
      "path": "/cases",
      "components": [
        { "name": "Badge", "props": { "variant": "default" } },
        { "name": "Badge", "props": { "variant": "destructive" } },
        { "name": "Button", "props": { "variant": "outline", "size": "sm" } }
      ]
    }
  ]
}
```

### 2. Load all figma-variants.json files

For each component directory in `{pipelineDir}/components/`, read `figma-variants.json` if it exists. Build a lookup from component name → variant axes + variantFolderMap.

### 3. Cross-reference props to variant folders

For each route in pages.json, for each component usage:
1. Look up the component's `variantAxes` from its `figma-variants.json`
2. Map the props from pages.json to axis values (e.g., `{ variant: "default" }` → `Variant=default`)
3. Find the matching entry in `variantFolderMap` (e.g., `Variant=default` → `variants/VariantDefault`)
4. Extract the variant folder name (e.g., `VariantDefault`)

If a prop combination doesn't match any entry in variantFolderMap (e.g., a behavioral prop was excluded), use the default variant for that axis.

### 4. Write page-priority-manifest.json

Aggregate results per component:

```json
{
  "Badge": {
    "pageVariants": ["VariantDefault", "VariantDestructive"],
    "usedOnRoutes": ["/cases", "/cases/:id"]
  },
  "Button": {
    "pageVariants": ["VariantPrimarySizeMd", "VariantOutlineSizeSm"],
    "usedOnRoutes": ["/cases/:id", "/cases/new"]
  }
}
```

Write to `{pipelineDir}/page-priority-manifest.json`.

Components that appear in pages.json but have no `figma-variants.json` should be logged as warnings but not block the output.

Components with `figma-variants.json` but NOT in pages.json have `pageVariants: []` — all their variants are built in Phase H (remaining).

### 5. Log summary

```
Page Priority Manifest:
  Routes analyzed: {count}
  Components with page variants: {count}
  Components with no page variants (build in Phase H): {count}
  Total page-needed variant builds: {sum of all pageVariants arrays}
```

## Output

`{pipelineDir}/page-priority-manifest.json`
