# Discover Components via Running App

Crawl a running React application using Playwright to discover components as they actually render. This captures runtime component trees, CSS selectors, and route information that static file analysis cannot provide.

## Inputs

- **Dev server URL**: The URL of the running dev server (e.g., `http://localhost:5173`)
- **Source root**: The project source root path (for resolving component file paths)
- **Output directory**: `.temp/react-to-figma/` (passed by parent)

## Prerequisites

- The dev server must be running (development build — React DevTools hook required)
- Playwright must be available (`npx playwright` or installed globally)

## Procedure

### 1. Run the component map script

Execute the `map-components.js` script from this skill directory:

```bash
node .claude/skills/react-to-figma/1-find-hierarchy/from-app/map-components.js \
  --url "{devServerUrl}" \
  --output ".temp/react-to-figma/component-hierarchy/component-map.json" \
  --pages-output ".temp/react-to-figma/component-hierarchy/pages.json" \
  --captures-dir ".temp/react-to-figma" \
  --max-captures-per-component 3 \
  --max-routes 50
```

To skip visual captures and only do discovery:

```bash
node .claude/skills/react-to-figma/1-find-hierarchy/from-app/map-components.js \
  --url "{devServerUrl}" \
  --output ".temp/react-to-figma/component-hierarchy/component-map.json" \
  --pages-output ".temp/react-to-figma/component-hierarchy/pages.json" \
  --skip-captures \
  --max-routes 50
```

The script will:
1. Launch a headless Chromium browser via Playwright
2. Navigate to the dev server URL
3. Discover routes by collecting all `<a>` href attributes on each visited page
4. On each route, walk the React fiber tree via `__REACT_DEVTOOLS_GLOBAL_HOOK__` to discover components
5. For each component found, record:
   - **name**: PascalCase component name (from fiber `type.name` or `type.displayName`)
   - **selector**: A CSS selector that targets the component's rendered DOM node
   - **routes**: Array of routes where this component was found
   - **parentComponent**: The nearest React component ancestor in the fiber tree
   - **children**: Array of child component names rendered by this component
   - **sourceFile**: The component's source file path (from fiber `_debugSource`, if available)
   - **sourceType**: Inferred as `project`, `ui-library`, or `npm` based on the source path
6. For each route visited, build a **per-route page tree** with resolved props from `fiber.memoizedProps`:
   - Each tree node: `{ name, props, selector, sourceFile, children }` — a real tree capturing what was rendered at that route
   - Props are serialized as JSON-safe values (functions → `[Function]`, React elements → `[ReactElement]`, refs → `[Ref]`)
   - Computes **layout components** — those appearing at the top level of every route's tree
7. **Capture live app context** (unless `--skip-captures` is set):
   - **Per route**: Viewport screenshot (1440×900) → `pages/{route-slug}/screenshot-app.png`
   - **Per component per route** (capped at `--max-captures-per-component`, default 3):
     - **Element screenshot**: Component isolated via CSS selector → `components/{Name}/app-context/{route-slug}.element.png`
     - **HTML structure**: Serialized DOM tree stopping at child component boundaries, with repeated siblings capped at 3 → `components/{Name}/app-context/{route-slug}.html.md`
     - **Computed CSS**: Figma-relevant style properties (layout, color, typography, border, shadow) for all owned elements → `components/{Name}/app-context/{route-slug}.styles.md`
   - HTML/CSS extraction rules:
     - Walks the full DOM subtree from the component's root element
     - Stops at child React component boundaries (elements matching child component selectors from the page tree)
     - When consecutive siblings share the same tag + class + role, captures at most 3 and emits `<!-- N more {tag} elements omitted -->`
8. Output `component-map.json` (merged flat list) and `pages.json` (per-route trees with resolved props)

### 2. Verify script output

Read `.temp/react-to-figma/component-hierarchy/component-map.json` and verify:
- It contains a `components` array with at least one entry
- Each entry has at minimum `name` and `routes` fields

Read `.temp/react-to-figma/component-hierarchy/pages.json` and verify:
- It contains a `pages` object with at least one route key
- Each page entry has a `tree` object with `name` and `children`
- `layoutComponents` array is present (may be empty)

If `--captures-dir` was provided and `--skip-captures` was not set, verify captures:
- At least one `pages/{route-slug}/screenshot-app.png` exists
- At least one `components/{Name}/app-context/{route-slug}.element.png` exists
- Corresponding `.html.md` and `.styles.md` files exist alongside element PNGs

If the script failed or produced empty output, report the error to the parent orchestrator and stop.

### 3. Convert to components-todo.md format

Read the `component-map.json` and produce a `components-todo.md` in the same format as the static file analysis approach.

For each component in `component-map.json`:

1. **Resolve file path**: Use `sourceFile` from the fiber debug info if available. If not, search the source root for a file containing `function {Name}` or `const {Name}` that returns JSX. If still unresolved, use `(runtime-only — no file found)` as the path.

2. **Determine source type**:
   - If `sourceFile` contains `/ui/` or `/components/ui/` → `ui-library`
   - If `sourceFile` is inside `node_modules/` → `npm`
   - If `sourceFile` starts with the source root → `project`
   - If no `sourceFile` → infer from package name patterns (e.g., Radix, Lucide → `npm`)

3. **Determine export type**: Default to `named`. If the component was the default export of its file, use `default`.

Write to `.temp/react-to-figma/component-hierarchy/components-todo.md`:

```markdown
# Components To Analyze

Total: {count}
Discovery method: app-crawl
Dev server: {devServerUrl}
Routes crawled: {routeCount}

## Project Components
- [ ] AppLayout | src/components/AppLayout/AppLayout.tsx | project | named
- [ ] CaseDetails | src/components/CaseDetails/CaseDetails.tsx | project | default
...

## UI Library Components
- [ ] Button | src/components/ui/button.tsx | ui-library | named
...

## npm Components
- [ ] ChevronDown | lucide-react | npm | named
...

## Runtime-Only Components
- [ ] LazyModal | (runtime-only — no file found) | project | named
...
```

Each line: `- [ ] {Name} | {path or package} | {source type} | {export type}`

Components whose file paths could not be resolved go in the **Runtime-Only Components** section.

### 4. Write per-component runtime metadata

For each component in `component-map.json`, write additional metadata files to the component's staging directory:

#### `.temp/react-to-figma/components/{Name}/selector.md`

```markdown
# {Name} — CSS Selector

**Selector**: `{cssSelector}`

Use this selector with Playwright to capture screenshots of this component in the live app:
```javascript
const element = await page.locator('{cssSelector}').first();
await element.screenshot({ path: 'screenshot.png' });
```
```

#### `.temp/react-to-figma/components/{Name}/routes.md`

```markdown
# {Name} — Routes

This component was found rendering on the following routes:

| Route | Parent Component |
|-------|-----------------|
| / | AppLayout |
| /cases | CaseList |
| /cases/:id | CaseDetails |
```

### 5. Write barrel-map.md (empty placeholder)

The app-crawl approach does not produce a barrel/re-export map (that requires static file analysis). Write a placeholder so downstream steps don't fail:

```markdown
# Barrel Re-export Map

Discovery method: app-crawl (barrel map not available — use from-files strategy for barrel resolution)
```

Write to `.temp/react-to-figma/component-hierarchy/barrel-map.md`.

### 6. Return summary

Return a brief summary to the parent orchestrator:

```
App-crawl discovery complete.
- Dev server: {devServerUrl}
- Routes crawled: {routeCount}
- Project components: {count}
- UI library components: {count}
- npm components: {count}
- Runtime-only (no file path): {count}
- Layout components: {layoutComponents}
- Page trees captured: {pageCount}
- Captures: {pageScreenshots} page screenshots, {componentCaptures} component captures, {failedCaptures} failed
- Output: .temp/react-to-figma/component-hierarchy/components-todo.md
- Pages: .temp/react-to-figma/component-hierarchy/pages.json
- Runtime metadata: .temp/react-to-figma/components/{Name}/selector.md, routes.md
- Context captures: .temp/react-to-figma/components/{Name}/app-context/
```
