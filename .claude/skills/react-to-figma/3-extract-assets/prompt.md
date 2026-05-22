# Extract Assets

Extract icons, SVGs, and static images from the codebase for Figma import. This runs once before any component building starts.

Uses `extract-icons.js` to scan for lucide-react imports, extract SVG data from node_modules, and build per-component icon mappings. Uses `extract-static-assets.js` to inventory static images.

Adopted from figma-from-code patterns:
- SVG string extraction ready for `figma.createNodeFromSvg()`
- Per-component icon mapping (`iconsByComponent`)
- Figma-convention naming: `Icon/{PascalName}`

## Inputs

- **Source root**: The project source root path (passed by parent), e.g. `packages/client/src`
- **Client directory**: The client package root, e.g. `packages/client`
- **Output directory**: `.temp/react-to-figma/`
- **Component analyses**: `.temp/react-to-figma/components/*/analysis.md` (to cross-reference icon usage)

## Procedure

### 1. Run the icon extraction script

```bash
node .claude/skills/react-to-figma/3-extract-assets/extract-icons.js <sourceRoot> --output .temp/react-to-figma
```

The script:
- Scans all `.tsx`/`.ts` files for `import { ... } from 'lucide-react'`
- Builds per-component icon mapping: which components use which icons
- Extracts SVG from `node_modules/lucide-react/dist/esm/icons/` (follows re-export chains)
- Normalizes SVGs: `viewBox="0 0 24 24"`, standard SVG attrs, strips React attrs
- Assigns Figma-convention names: `Icon/{PascalName}` (e.g., `Icon/Check`, `Icon/MoreVertical`)

It outputs:
| File | Format | Purpose |
|------|--------|---------|
| `icons.json` | JSON | Machine-readable: icon list with SVG strings, per-component mapping, usage counts |
| `assets/icons.md` | Markdown | Human-readable icon inventory table |
| `assets/icons/{Name}.svg` | SVG files | Individual normalized SVG files ready for Figma import |

### 2. Run the static assets extraction script

```bash
node .claude/skills/react-to-figma/3-extract-assets/extract-static-assets.js <clientDir> --output .temp/react-to-figma
```

The script:
- Scans `public/` and `src/assets/` for image files (png, jpg, svg, webp, ico, gif, avif)
- Records file metadata (name, path, type, size)
- Searches source files for references to determine which components use each asset
- Assigns Figma-convention names: `Asset/{PascalName}` (e.g., `Asset/CartonLogo`)

It outputs:
| File | Format | Purpose |
|------|--------|---------|
| `assets/static-assets.json` | JSON | Machine-readable asset inventory with usage mapping |
| `assets/static-assets.md` | Markdown | Human-readable asset table |

### 3. Validate script output

Check:
- `icons.json` exists and `icons` array contains entries
- Every icon has a non-null `svgString` (if null, the SVG couldn't be extracted from node_modules)
- `iconsByComponent` maps at least some components to icons
- Individual `.svg` files in `assets/icons/` are valid XML
- `static-assets.json` exists (may have 0 assets if the project has none)

### 4. Return summary

```
Asset extraction complete.
- Icon library: lucide-react
- Icons extracted: {count} ({svgCount} with SVGs)
- Components with icons: {count}
- Static assets found: {count}
- SVG files written: {count}
- Output: .temp/react-to-figma/icons.json
- Output: .temp/react-to-figma/assets/icons/
- Output: .temp/react-to-figma/assets/static-assets.json
```

## JSON Schema

### icons.json

```json
{
  "schemaVersion": "react-to-figma-icons@1",
  "iconLibrary": "lucide-react",
  "summary": { "totalIcons": 34, "svgsExtracted": 34, "componentsCovered": 29 },
  "icons": [
    {
      "name": "Check",
      "figmaName": "Icon/Check",
      "kebabName": "check",
      "svgString": "<svg xmlns=\"http://www.w3.org/2000/svg\" ...>...</svg>",
      "usedIn": ["Badge", "EditControls", "Checkbox"],
      "usageCount": 5
    }
  ],
  "iconsByComponent": {
    "Badge": ["AlertCircle", "Check", "X"],
    "Sidebar": ["FolderClosed", "Users", "Bot", "CheckSquare"]
  }
}
```

### static-assets.json

```json
{
  "schemaVersion": "react-to-figma-assets@1",
  "summary": { "totalAssets": 1, "byType": { "svg": 1 } },
  "assets": [
    {
      "fileName": "carton-logo.svg",
      "relativePath": "src/assets/carton-logo.svg",
      "type": "svg",
      "sizeBytes": 2048,
      "usedIn": ["Header"],
      "figmaName": "Asset/CartonLogo",
      "svgContent": "<svg>...</svg>"
    }
  ]
}
```

## Figma Icon Naming Convention

Icons follow the pattern `Icon/{PascalName}`:
- `Icon/Check` — not `Icons/Check` or `check` or `icon-check`
- `Icon/MoreVertical` — preserves the PascalCase name from lucide-react
- `Icon/FolderClosed` — compound names stay PascalCase

Static assets follow `Asset/{PascalName}`:
- `Asset/CartonLogo` — derived from filename, kebab/snake converted to PascalCase

These names become Figma component names when Phase 6 builds icon components.

## Fallback: Manual Extraction

If the scripts cannot be run, follow these steps:

### Icons

1. Search all component files for `import { ... } from 'lucide-react'`
2. For each icon, find its SVG in `node_modules/lucide-react/dist/esm/icons/{kebab-name}.js`
3. Extract the SVG elements from the `createLucideIcon()` call
4. Wrap in `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">` container
5. Write individual `.svg` files to `assets/icons/`

### Static Assets

1. Search `public/` and `src/assets/` for image files
2. Record filename, path, type, and size
3. Search source files for references to determine usage
