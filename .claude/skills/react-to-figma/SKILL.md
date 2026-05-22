---
name: react-to-figma
description: "Convert a React app's components into Figma. Discovers the full component hierarchy, extracts design tokens and assets, captures variant screenshots via Storybook, then builds each component in Figma using MCP tools. Works with any React app — discovers patterns rather than assuming a specific stack."
---

# React to Figma

Convert a React application's components into Figma. The pipeline discovers the component hierarchy, extracts design tokens and assets, generates Storybook stories for every visual variant, captures screenshots, then builds the components in Figma bottom-up (leaves first).

## When to Use

- Converting a React codebase into Figma component structures
- Mapping an existing app's component tree for design system work
- Building a Figma design system from an existing React app

Typical triggers:
- "Convert this React app to Figma"
- "Build the component tree in Figma"
- "Analyze this React app's component hierarchy"

## Output Location

All outputs go to `.temp/react-to-figma/`:

```
.temp/react-to-figma/
├── component-hierarchy/
│   ├── components-todo.md        # Discovery checklist
│   ├── barrel-map.md             # Re-export resolution map
│   ├── build-order.md            # Topological sort — leaves first
│   └── hierarchy.md              # Mermaid diagram
├── component-map.json            # Runtime component map from app crawl (from-app only)
├── pages.json                    # Per-route resolved component trees with props (from-app only)
├── from-files/                   # Strategy-specific discovery output
│   ├── components-todo.md
│   └── barrel-map.md
├── from-app/                     # Strategy-specific discovery output
│   ├── components-todo.md
│   └── barrel-map.md
├── design-tokens.json            # Machine-readable tokens with resolved values
├── design-tokens.md              # Human-readable token tables
├── css-figma-map.json            # CSS variable/class → Figma variable path lookup
├── icons.json                    # Machine-readable icon data + per-component mapping
├── story-patterns.md             # Discovered Storybook conventions
├── assets/
│   ├── icons/                    # Extracted SVG icon files (one per icon)
│   ├── icons.md                  # Human-readable icon inventory
│   ├── static-assets.json        # Static asset inventory
│   └── static-assets.md          # Human-readable asset table
├── components/
│   ├── Button/
│   │   ├── analysis.md           # Component relationships (Phase 1)
│   │   ├── props.md              # Props interface (Phase 1)
│   │   ├── selector.md           # CSS selector for Playwright (Phase 1 — from-app only)
│   │   ├── routes.md             # Routes where component renders (Phase 1 — from-app only)
│   │   ├── app-context/          # Live app captures (Phase 1 — from-app only)
│   │   │   ├── {route}.element.png   # Element screenshot with real data
│   │   │   ├── {route}.html.md       # DOM structure (stops at child boundaries)
│   │   │   └── {route}.styles.md     # Computed CSS (Figma-relevant props)
│   │   ├── variants.md           # All visual variants (Phase 6)
│   │   ├── stories-manifest.md   # Story → URL mapping (Phase 6)
│   │   ├── screenshots/          # Per-variant PNGs + HTML + CSS (Phase 6)
│   │   ├── figma-result.md       # Figma component ID (Phase 6)
│   │   └── verification.md       # Build verification (Phase 6)
│   └── ...
├── figma-variables-map.json      # CSS var/class → Figma variable ID (Phase 5)
├── figma-icons-map.json          # Icon name → Figma component node ID (Phase 5)
├── figma-assets-map.json         # Asset name → Figma component node ID (Phase 5)
├── figma-file-setup.md           # Setup summary (Phase 5)
└── pages/
    ├── root/                     # Page for "/" route
    │   ├── page-figma-result.md  # Figma frame ID (Phase 7)
    │   ├── verification.md       # Page verification (Phase 7)
    │   ├── screenshot-app.png    # Live app viewport screenshot (Phase 1 + Phase 7)
    │   └── screenshot-figma.png  # Figma export screenshot (Phase 7)
    ├── cases-1/                  # Page for "/cases/1" route
    │   └── ...
    └── ...
```

## Prompt Structure

```
.claude/skills/react-to-figma/
├── SKILL.md                                          # This file
├── 1-find-hierarchy/
│   ├── prompt.md                                     # Phase 1 orchestrator (strategy selection + reconciliation)
│   ├── from-files/
│   │   └── 1-prompt.discover-components.md           # Static file analysis discovery
│   ├── from-app/
│   │   ├── 1-prompt.discover-components.md           # Browser crawl discovery via Playwright
│   │   └── map-components.js                         # Playwright script — walks React fiber tree
│   ├── prompt.reconcile.md                           # Merge from-files + from-app results
│   ├── 2-prompt.analyze-component.md                 # Analyze props & children
│   ├── 3-prompt.generate-build-order.md              # Topological sort
│   └── 4-prompt.generate-pages-manifest.md           # Convert pages.json → pages.md
├── 2-extract-design-tokens/
│   ├── prompt.md                                     # Phase 2 orchestrator
│   └── resolve-colors.js                              # Token extraction script
├── 3-extract-assets/
│   ├── prompt.md                                     # Phase 3 orchestrator
│   ├── extract-icons.js                               # Icon extraction script
│   └── extract-static-assets.js                       # Static asset inventory script
├── 4-discover-story-patterns/
│   └── prompt.md                                     # Discover Storybook conventions
├── 5-setup-figma-file/
│   └── prompt.md                                     # Create Figma pages, variables, icon components
├── 6-get-component-context-and-implement-in-figma/
│   ├── prompt.md                                     # Per-component orchestrator (5 subagent steps)
│   ├── 1-get-component-context/
│   │   ├── 1-prompt.identify-variants.md             # Find all visual variants
│   │   ├── 2-prompt.generate-variant-stories.md      # Write Storybook stories
│   │   └── 3-prompt.capture-variant-screenshots.md   # Playwright MCP screenshots
│   └── 2-implement-in-figma/
│       ├── 1-prompt.build-figma-component.md          # Build in Figma via MCP
│       └── 2-prompt.verify-figma-component.md         # Verify against screenshots
└── 7-compose-pages/
    ├── prompt.md                                     # Page composition orchestrator
    ├── 1-prompt.build-page-frame.md                   # Build page frame in Figma via MCP
    └── 2-prompt.verify-page-frame.md                  # Verify page against live app
```

## Subagent Enforcement

**CRITICAL**: Every phase in this pipeline MUST be executed via `runSubagent`. Do NOT read a phase's `prompt.md` and execute its steps inline. Each phase runs in its own subagent to manage context window size — inlining will cause context overflow on real codebases.

The pattern for every phase is:
1. Read the phase's `prompt.md` file content
2. Pass that content as the prompt to `runSubagent`, along with context variables
3. Wait for the subagent to complete
4. Verify outputs before proceeding to the next phase

Similarly, within each phase's `prompt.md`, sub-steps that say "launch a subagent" MUST use `runSubagent` — not inline execution.

## Procedure

### Phase 1: Build Component Hierarchy

Read `.claude/skills/react-to-figma/1-find-hierarchy/prompt.md` and launch it via `runSubagent`. Do NOT execute its steps inline.

```typescript
const hierarchyPrompt = readFile('.claude/skills/react-to-figma/1-find-hierarchy/prompt.md')

runSubagent({
  description: "Build component hierarchy",
  prompt: `
    ${hierarchyPrompt}

    ## Context
    - Source root: ${sourceRoot}
    - Strategy: ${strategy}
    - Dev server URL: ${devServerUrl}
    - Output directory: .temp/react-to-figma/
  `
})
```

Pass the project source root path as context (e.g., `src/` or `packages/client/src/`). If the user hasn't specified a source root, search the workspace to identify where React components live.

**Strategy parameter**: Pass `strategy` as `"files"`, `"app"`, or `"both"` (default: `"both"`).
- `"files"` — Static source code analysis only. No dev server required.
- `"app"` — Browser crawl via Playwright only. Requires a running dev server URL.
- `"both"` — Run both strategies in parallel, then reconcile into a unified list. Gives the best coverage: from-files catches unused/conditional code, from-app catches runtime-only components and provides CSS selectors + route data.

When strategy includes `"app"`, also pass the `devServerUrl` (e.g., `http://localhost:5173`).

This subagent orchestrates internally (using its own subagents for each sub-step):
1. **Discover** components via selected strategy (from-files, from-app, or both → reconcile)
2. **Analyze** each component's props, children, and relationships
3. **Generate** the topological build order and Mermaid diagram

**Verify**: `build-order.md` exists and Level 0 contains only true leaf components.

### Phase 2: Extract Design Tokens

Read `.claude/skills/react-to-figma/2-extract-design-tokens/prompt.md` and launch it as a **subagent**.

Runs `resolve-colors.js` to pre-compute all CSS variable values to hex/sRGB and produce machine-readable JSON + human-readable markdown. Outputs three Figma variable collections (Palette, Semantic, Numbers) with scoping metadata and a CSS-to-Figma lookup map.

**Verify**: `design-tokens.json` exists, contains `tokens` array, and `css-figma-map.json` has mapping entries.

### Phase 3: Extract Assets

Read `.claude/skills/react-to-figma/3-extract-assets/prompt.md` and launch it as a **subagent**.

Runs `extract-icons.js` to scan for lucide-react imports, extract SVGs from node_modules (following re-export chains), and build per-component icon mappings. Runs `extract-static-assets.js` to inventory static images. All SVGs are normalized for `figma.createNodeFromSvg()` consumption and named with Figma conventions (`Icon/{PascalName}`).

**Verify**: `icons.json` exists with icon entries, `assets/icons/` has `.svg` files, `assets/static-assets.json` exists.

### Phase 4: Discover Story Patterns

Read `.claude/skills/react-to-figma/4-discover-story-patterns/prompt.md` and launch it as a **subagent**.

Scans existing `*.stories.tsx` files to discover the app's Storybook conventions: decorators, mocking patterns, providers, state simulation.

**Verify**: `story-patterns.md` exists.

### Phase 5: Setup Figma File

**This is the first phase that requires a Figma MCP connection.**

Read `.claude/skills/react-to-figma/5-setup-figma-file/prompt.md` and launch it as a **subagent**.

Pass the Figma file key as context.

```typescript
const setupPrompt = readFile('.claude/skills/react-to-figma/5-setup-figma-file/prompt.md')

runSubagent({
  description: "Setup Figma file structure, variables, and icons",
  prompt: `
    ${setupPrompt}

    ## Context
    - Figma file key: ${figmaFileKey}
    - Output directory: .temp/react-to-figma/
  `
})
```

This subagent:
1. Creates Figma pages (Foundations, Icons, Components, Screens)
2. Creates variable collections (Palette, Semantic, Numbers) from `design-tokens.json`
3. Creates icon components from `icons.json` SVGs on the Icons page
4. Creates static asset components from `static-assets.json`
5. Outputs lookup maps: `figma-variables-map.json`, `figma-icons-map.json`, `figma-assets-map.json`

These maps provide CSS-var → Figma-variable-ID and icon-name → Figma-component-ID lookups that Phase 6 uses when building components.

**Verify**: `figma-variables-map.json`, `figma-icons-map.json`, and `figma-assets-map.json` all exist and have entries.

### Phase 6: Get Component Context & Implement in Figma (per component)

Read `build-order.md` and parse the full component list (bottom-up, leaves first).

Create a **todo list** with one entry per component. Then, for each component in order:

1. Mark the todo as in-progress
2. Read `.claude/skills/react-to-figma/6-get-component-context-and-implement-in-figma/prompt.md` and launch it as a **subagent** with the component name, path, and build order index
3. Verify the component's outputs exist (`variants.md`, `stories-manifest.md`, `screenshots/`, `figma-result.md`, `verification.md`)
4. Mark the todo as completed

Each per-component subagent creates its own internal todo list with 5 sub-steps and launches a subagent for each:
1. **Identify variants** — find all visual states
2. **Generate variant stories** — create Storybook stories
3. **Capture variant screenshots** — Playwright MCP screenshots with self-healing retry
4. **Build Figma component** — create the component in Figma via MCP tools (using `figma-variables-map.json` and `figma-icons-map.json` from Phase 5)
5. **Verify Figma component** — compare against React screenshots, retry once on failure

**Prerequisites**: Storybook must be running. Phase 5 must be complete (Figma file setup).

**Verify**: Each component directory has `variants.md`, `stories-manifest.md`, `screenshots/`, `figma-result.md`, and `verification.md`.

**Note**: The Figma implementation sub-steps (4 and 5) are stubs — not yet fully implemented.

### Phase 7: Compose Pages in Figma

**Prerequisites**: Phase 6 must be complete (all components built). Dev server must be running. `pages.json` must exist (from Phase 1 `from-app` strategy).

Read `.claude/skills/react-to-figma/7-compose-pages/prompt.md` and launch it as a **subagent**.

Pass the dev server URL as context.

This subagent:
1. Verifies all components have `figma-result.md` files (built in Phase 6)
2. Creates a "Screens" page in the Figma file (or reuses the one from Phase 5)
3. For each route in `pages.json`, builds a viewport-sized frame (1440×900) using **instances** of built components
4. Uses resolved props from the runtime page tree to set variant properties and text overrides on instances
5. Verifies each page frame against a live app screenshot

**Verify**: Each route has a `page-figma-result.md` in `.temp/react-to-figma/pages/{RouteName}/`.
