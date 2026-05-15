---
name: site-component-map
description: Visit a running web application, detect its UI framework, discover all component instances across routes, build a hierarchy tree, and compute a bottom-up build order for Figma reconstruction. Use when you need to understand what components a site uses, how they nest, or what order to build them in Figma.
---

# Skill: Site Component Map

Discover every UI component on a running web application — regardless of framework — and produce a human-readable markdown report showing the component hierarchy and a bottom-up build order suitable for Figma component construction.

## When to Use

- Before a `figma-from-code` run, to know which components exist and their nesting
- When you need a build order so parent Figma components can reference child components
- When auditing a site to understand its component architecture from the runtime (not source code)
- When comparing what the code declares vs. what actually renders

## Supported Frameworks

Detection is automatic. The scripts handle:

| Framework | Version          | Detection Method                                     |
| --------- | ---------------- | ---------------------------------------------------- |
| React     | 18+ (concurrent) | `__reactFiber$` keys on DOM elements                 |
| React     | <18 (legacy)     | `__reactInternalInstance$` keys                      |
| Vue       | 3 (composition)  | `__vueParentComponent` property                      |
| Vue       | 2 (options)      | `__vue__` property                                   |
| Angular   | Ivy              | `__ngContext__`, `ng-version` attribute, `window.ng` |
| Svelte    | dev mode         | `__svelte_meta` property                             |

## Prerequisites

- The target application must be running (e.g., `npm run dev` on `localhost:5173`)
- Playwright must be installed (`npx playwright install chromium` if needed)

## Workflow

Follow these steps in order. The primary deliverable is a markdown file at `.temp/component-map.md`.

### Step 1: Verify Detection (Single Page)

Run a quick single-page check to confirm the framework is detected and components are found:

```bash
node .claude/skills/figma-from-code-validator/discover-components.js <url> --list
```

If this returns `Framework: unknown` or 0 components, troubleshoot before proceeding. Common issues:

- App not fully loaded — add `--wait 2000`
- Components behind auth or interaction — use `--click <selector>` to trigger state
- Dev mode not enabled (Svelte requires dev mode for `__svelte_meta`)

### Step 2: Scan All Routes and Generate the Report

Run the multi-route mapper. Always pass `--markdown` to produce the review document:

```bash
node .claude/skills/figma-from-code-validator/map-components.js <base-url> \
  --routes <comma-separated-routes> \
  --markdown .temp/component-map.md
```

If routes are unknown, use `--crawl` to auto-discover them:

```bash
node .claude/skills/figma-from-code-validator/map-components.js <base-url> \
  --crawl --max-crawl 30 \
  --markdown .temp/component-map.md
```

Optionally add `--output .temp/component-map.json` for a machine-readable companion file.

### Step 3: Read and Present the Report

Read `.temp/component-map.md` and present the key findings to the user:

1. **Framework and version** detected
2. **Total component count** and routes scanned
3. **Build tiers summary** — how many tiers, what's at the bottom (leaves) and top (layouts)
4. Any notable observations (components appearing on every route, unusually deep nesting, etc.)

The user should review the full markdown file before proceeding with any Figma build work.

### Step 4 (Optional): Deep-Dive a Specific Component

If the user wants details on a particular component, use the single-page tool:

```bash
# Show where a component appears and its children
node .claude/skills/figma-from-code-validator/discover-components.js <url> --tree --name <ComponentName>

# Screenshot a component instance
node .claude/skills/figma-from-code-validator/discover-components.js <url> --screenshot <ComponentName>
```

## Report Format

The generated markdown file (`.temp/component-map.md`) contains three sections:

### Component Tree

An indented tree showing how components nest inside each other, merged across all scanned routes:

```
App
  Header
    Link
      AppLogo
    Button
  ListPage
    ItemList
      Button
      Link
    ItemDetails
      ItemInformation
        EditableTitle
```

### Build Order (bottom-up for Figma)

Components grouped into tiers using topological sort — leaves first:

| Tier      | Meaning                       | Figma Action                                     |
| --------- | ----------------------------- | ------------------------------------------------ |
| Tier 1    | Leaf components — no children | Build these first as standalone Figma components |
| Tier 2    | Depend only on Tier 1         | Build using Tier 1 component instances           |
| Tier 3+   | Depend on lower tiers         | Build using component instances from tiers below |
| Last tier | Top-level layouts             | Build last — these compose everything            |

Each component lists its children and the routes where it appears.

### Component Details Table

A summary table with every component's tier, routes, best CSS selector, and instance count.

## Script Reference

### discover-components.js (single page)

```bash
node .claude/skills/figma-from-code-validator/discover-components.js <url> [options]
```

| Flag                     | Description                                                    |
| ------------------------ | -------------------------------------------------------------- |
| `--list`                 | Print component names with instance counts                     |
| `--tree`                 | Print the component hierarchy as an indented tree              |
| `--name <name>`          | Filter to a specific component                                 |
| `--output <file.json>`   | Write full JSON results                                        |
| `--click <selector>`     | Click an element before discovery (open dialogs, menus)        |
| `--wait <ms>`            | Extra wait after page load                                     |
| `--include-lib`          | Include library/internal components (filtered by default)      |
| `--screenshot <name>`    | Screenshot a component's first visible instance                |
| `--screenshot-dir <dir>` | Directory for screenshots (default: `./component-screenshots`) |

### map-components.js (multi-route + build order)

```bash
node .claude/skills/figma-from-code-validator/map-components.js <base-url> [options]
```

| Flag                   | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| `--routes <paths>`     | Comma-separated route paths (default: `/`)            |
| `--crawl`              | Auto-discover routes by following internal links      |
| `--max-crawl <n>`      | Max pages to crawl (default: 20)                      |
| `--markdown <file.md>` | Write the human-readable report (**always use this**) |
| `--output <file.json>` | Write structured JSON (optional companion)            |
| `--include-lib`        | Include library/internal components                   |
| `--click <selector>`   | Click an element on every page before discovery       |
| `--wait <ms>`          | Extra wait after each page load                       |

## Library Component Filtering

By default, internal/library components are filtered out. This includes:

- React internals: `Suspense`, `Fragment`, `Provider`, `StrictMode`, `ForwardRef`, `Memo`
- Router components: `Route`, `Router`, `Routes`, `BrowserRouter`, `Outlet`
- Radix primitives: `Primitive.*`, `Slot`, `Portal`, `DismissableLayer`, `FocusScope`
- Animation wrappers: `Presence`, `AnimatePresence`, `MotionComponent`
- Dev tools: `ReactQueryDevtools`
- Lowercase names (HTML elements mistakenly exposed as components)
- Names starting with `_` or `$`

Use `--include-lib` to see everything.

## Architecture

The scripts share common modules:

```
figma-from-code-validator/
├── browser-connect.js      # Shared Playwright browser management
├── detect-components.js    # Framework detection + component extraction (runs in browser)
├── library-filter.js       # Library component filter patterns
├── discover-components.js  # Single-page CLI tool
└── map-components.js       # Multi-route CLI tool + build order
```

- `detect-components.js` runs entirely inside `page.evaluate()` — all framework detection and DOM walking happens in the browser context
- `library-filter.js` runs in Node.js to filter results after extraction
- `browser-connect.js` supports both standalone and shared Playwright server modes
