---
name: figma-from-code-discovery-assets
description: Discover all Lucide icons and SVG assets used in the codebase, extract their SVG data, and map which components use which icons. Produces icons.json. This is Phase 0b of figma-from-code.
---

# Skill: Icon & Asset Discovery

Discovers all Lucide icons and SVG file assets imported across the codebase, extracts their SVG markup, and maps which components use which icons. This is pure static analysis — no dev server or Figma access needed.

## When to Use

- Before `figma-from-code` Phase 3 (icon preamble builds Figma icon components from this data)
- Standalone audit of icon and asset usage across the codebase
- When resuming a build and `icons.json` is missing

## Prerequisites

- `packages/client/src/` exists (source tree to scan)
- `node_modules/lucide-react` installed (for resolving icon SVG data)

## Required Inputs

None — paths are hardcoded to the Carton project structure.

## Output Files

Written to `.temp/figma-from-code/`:

| File | Contents |
|------|----------|
| `icons.json` | Icon/asset manifest with SVG strings and per-component mapping |

### `icons.json` structure

```json
{
  "icons": [
    {
      "name": "Check",
      "elements": [["path", {"d": "M20 6 9 17l-5-5"}]],
      "svgString": "<svg ...>...</svg>",
      "usedBy": ["Button", "Checkbox"]
    }
  ],
  "assets": [
    {
      "name": "CartonLogoSvg",
      "importPath": "@/assets/logo.svg",
      "sourcePath": "packages/client/src/assets/logo.svg",
      "svgString": "...",
      "usedBy": ["Header"]
    }
  ],
  "iconsByComponent": {
    "Button": ["Check", "X"],
    "Header": ["CartonLogoSvg"]
  },
  "summary": {
    "totalIcons": 21,
    "totalAssets": 1,
    "componentsWithIcons": 22
  }
}
```

## Workflow

### 1. Ensure output directory exists

```bash
mkdir -p .temp/figma-from-code/
```

### 2. Run the icon extraction script

```bash
node .claude/skills/figma-from-code-validator/extract-icons.js \
  --scan packages/client/src/ \
  --output .temp/figma-from-code/icons.json
```

The script:
- Recursively finds all `.tsx?` files (excludes `node_modules`, test files)
- Parses static imports from `lucide-react`
- Resolves each icon's SVG from `node_modules/lucide-react/dist/esm/icons/`
- Finds and extracts SVG file imports (e.g., `import Logo from '@/assets/logo.svg'`)
- Maps which components use which icons/assets

### 3. Read and summarize the output

Read `.temp/figma-from-code/icons.json` and extract:

- `summary.totalIcons` — number of Lucide icons found
- `summary.totalAssets` — number of SVG file assets found
- `summary.componentsWithIcons` — how many components use icons
- `icons[].name` — list of icon names
- `assets[].name` — list of asset names

### 4. Report

```
Icon & Asset Discovery complete:
- {totalIcons} Lucide icons discovered
- {totalAssets} SVG assets found
- Icons used across {componentsWithIcons} components
```

## Scripts Reference

| Script | Location | Purpose |
|--------|----------|---------|
| `extract-icons.js` | `.claude/skills/figma-from-code-validator/extract-icons.js` | Static analysis of imports to find icons/assets and extract SVG data |

Do NOT modify this script.

## Skip / Resume

If called with `resume: true`, check whether `.temp/figma-from-code/icons.json` exists on disk. If it does, skip and read the existing file. If it's missing, re-run.

## Error Handling

| Scenario | Action |
|----------|--------|
| `extract-icons.js` fails | Verify `packages/client/src/` exists and `node_modules/lucide-react` is installed |
| Icon SVG resolution fails | Script logs warnings per-icon; other icons still extracted |
| SVG file asset not found on disk | Script logs warning; asset entry created without `svgString` |
