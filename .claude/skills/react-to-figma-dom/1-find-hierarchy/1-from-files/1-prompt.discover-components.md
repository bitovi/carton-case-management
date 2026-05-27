# Discover All React Components

Scan a React source tree to find every component — project-defined, UI library, and npm-imported. Produces a checklist, barrel/re-export map, and prop classification.

## Inputs

- **Source root**: The root directory containing React source files (passed by parent)
- **Output directory**: `.temp/react-to-figma/component-hierarchy/from-files/` (passed by parent)

## Run

```bash
node .claude/skills/react-to-figma-dom/1-find-hierarchy/1-from-files/discover-components.js \
  --source-root {sourceRoot} \
  --output-dir .temp/react-to-figma/component-hierarchy/from-files
```

## Outputs

The script writes three files to `--output-dir`:

| File | Format | Content |
|------|--------|---------|
| `components.json` | JSON | `{ schemaVersion, discoveryMethod, componentCount, components: [{ name, path, sourceType, exportType }] }` |
| `barrel-map.md` | Markdown | Per-index-file section with `Name → resolved-path` lines |
| `prop-classification.json` | JSON | `{ generatedAt, components: { Name: { variantProps, textProps, dataProps, confidence } } }` |

## Return

Return the summary printed to stdout by the script.
