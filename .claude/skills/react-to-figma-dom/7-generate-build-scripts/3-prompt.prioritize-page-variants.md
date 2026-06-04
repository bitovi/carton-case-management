# Prioritize Page Variants

Cross-reference `pages.json` (route → component tree with props) against each component's `figma-variants.json` (prop combos → variant folder names) to determine which variants appear in page views. Output `page-priority-manifest.json` so the build phase can build page-needed variants first.

## Inputs

| Variable | Source | Description |
|----------|--------|-------------|
| `pipelineDir` | `.temp/react-to-figma-dom/` | Root output directory |
| `skillDir` | `.claude/skills/react-to-figma-dom` | Skill root directory |

Required files (checked by the script):
- `{pipelineDir}/component-hierarchy/pages.json` — from Phase 1 browser crawl
- `{pipelineDir}/components/{Name}/figma-variants.json` — per component, from step 1

## Procedure

Run the prebuilt script:

```bash
node {skillDir}/scripts/prioritize-page-variants.js \
  --pipeline-dir {pipelineDir}
```

The script:
1. Loads `pages.json` and recursively extracts component usages (name + props) per route
2. Loads all `figma-variants.json` files from `{pipelineDir}/components/`
3. Cross-references props to variant folder names via `variantAxes` and `variantFolderMap`
4. Writes `page-priority-manifest.json` with per-component `pageVariants` and `usedOnRoutes`
5. Logs a summary of routes analyzed, components with/without page variants

Components without `figma-variants.json` are logged as warnings. Components with `figma-variants.json` but not in `pages.json` get `pageVariants: []`.

Exit code is 0 on success, 1 on failure.

## Output

`{pipelineDir}/page-priority-manifest.json`
