# Discover Components via Running App

Crawl a running React application using Playwright to discover components as they actually render. This captures runtime component trees, CSS selectors, and route information that static file analysis cannot provide.

## Inputs

- **Dev server URL**: The URL of the running dev server (e.g., `http://localhost:5173`)
- **Source root**: The project source root path (for resolving component file paths)
- **Output directory**: `.temp/react-to-figma-dom/` (passed by parent)

## Prerequisites

- The dev server must be running (development build — React DevTools hook required)
- Playwright must be available (`npx playwright` or installed globally)

## Procedure

### 1. Run the component map script

Execute the `map-components.js` script from this skill directory:

```bash
node .claude/skills/react-to-figma-dom/1-find-hierarchy/2-from-app/map-components.js \
  --url "{devServerUrl}" \
  --output ".temp/react-to-figma-dom/component-hierarchy/component-map.json" \
  --pages-output ".temp/react-to-figma-dom/component-hierarchy/pages.json" \
  --captures-dir ".temp/react-to-figma" \
  --prop-classification ".temp/react-to-figma-dom/component-hierarchy/from-files/prop-classification.json" \
  --max-routes 50
```

The `--prop-classification` flag points to the prop classification JSON from Step 1.1 (from-files). When provided, the script uses curated prop classifications instead of heuristics to determine which props are variant axes vs text content. If the file doesn't exist, the script falls back to heuristic classification.

The script produces all output files — do NOT write additional scripts or files manually.

#### What the script does

1. Launches a headless Chromium browser via Playwright
2. Navigates to the dev server URL
3. Discovers routes by collecting all `<a>` href attributes on each visited page
4. On each route, walks the React fiber tree via `__REACT_DEVTOOLS_GLOBAL_HOOK__` to discover components
5. For each component found, records name, CSS selector, routes, parent/child relationships, source file, and source type
6. For each route visited, builds a per-route page tree with resolved props from `fiber.memoizedProps`
7. Captures live app variants:
   - **Per route**: Viewport screenshot (1440×900) → `pages/{route-slug}/screenshot-app.png`
   - **Per component** (deduped by unique prop combinations across routes):
     - `components/{Name}/app-variants/{Variant Name}/screenshot.png`
     - `components/{Name}/app-variants/{Variant Name}/dom.json`
     - `components/{Name}/app-variants/{Variant Name}/fiber-dom-map.json`
     - `components/{Name}/app-variants/capture-manifest.json`

#### Output files

| File | Description |
|------|-------------|
| `component-hierarchy/component-map.json` | Merged flat component list across all routes |
| `component-hierarchy/pages.json` | Per-route page trees with resolved props |
| `component-hierarchy/from-app/components.json` | JSON component list in standard schema |
| `component-hierarchy/from-app/barrel-map.md` | Placeholder (app-crawl cannot produce barrel maps) |
| `pages/{route-slug}/screenshot-app.png` | Per-route viewport screenshots |
| `components/{Name}/app-variants/` | Per-component variant captures |

### 2. Verify script output

Check that the script succeeded by verifying these files exist and are non-empty:

1. `.temp/react-to-figma-dom/component-hierarchy/component-map.json` — has a `components` array with at least one entry
2. `.temp/react-to-figma-dom/component-hierarchy/pages.json` — has a `pages` object with at least one route key
3. `.temp/react-to-figma-dom/component-hierarchy/from-app/components.json` — has a `components` array with at least one entry
4. At least one `pages/{route-slug}/screenshot-app.png` exists
5. At least one `components/{Name}/app-variants/` directory exists with `dom.json` and `screenshot.png`

If the script failed or produced empty output, report the error to the parent orchestrator and stop.

### 3. Return summary

Report the summary printed by the script to the parent orchestrator. The script prints all relevant counts (routes crawled, components by type, capture stats).
