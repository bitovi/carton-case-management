# Alternative Approach Analysis: `react-to-figma` vs `figma-from-code` Skills

This document compares our local `react-to-figma` skill against the skills on the `figma-from-code` branch of [bitovi/carton-case-management](https://github.com/bitovi/carton-case-management/tree/figma-from-code/.claude/skills). The goal is to identify overlap, unique capabilities, and ideas worth adopting.

---

## Summary

The `figma-from-code` branch contains a mature, battle-tested pipeline with **14 skills** covering the same goal as `react-to-figma`: converting a React codebase into Figma components. The two approaches share the same high-level phases but differ significantly in architecture, tooling, and level of detail.

| Dimension | `react-to-figma` (ours) | `figma-from-code` (branch) |
|-----------|------------------------|---------------------------|
| **Discovery** | Static file analysis (AST-like grep) | Hybrid: browser crawling (Playwright) + static code scanning |
| **Screenshot capture** | Storybook stories per variant | Live app screenshots via Playwright element selectors |
| **Build order** | Topological sort from import analysis | Topological sort from runtime + import analysis, merged |
| **Figma building** | Stub (Phase 6 not implemented) | Fully implemented with `use_figma` MCP, variant strategies, fix loops |
| **Validation** | Stub (Phase 6 verification not implemented) | Pixel-diff comparison (`compare.js`) + structural QA + 3-iteration fix loops |
| **State management** | File-per-component in `.temp/` | Centralized `state.json` ledger with phase tracking, resume support |
| **Parallelism** | Sequential subagents per phase | Parallel subagents per tier (opus for build, haiku for capture) |
| **Framework support** | React only (by design) | React, Vue 2/3, Angular, Svelte (auto-detected) |
| **Skill count** | 1 skill, 6 phases | 14 skills (1 orchestrator + 13 specialized) |

---

## Phase-by-Phase Comparison

### Phase 1: Component Discovery

| | `react-to-figma` | `figma-from-code` |
|---|---|---|
| **Skill** | `1-find-hierarchy/` (3 sub-prompts) | `figma-from-code-discovery-components` + `site-component-map` |
| **Method** | Static: find files, parse imports, build dependency graph | Hybrid: (1) crawl live app with Playwright to find runtime components, (2) scan source code for components not rendered at crawl time |
| **Output** | `build-order.md`, `hierarchy.md` (Mermaid), `components-todo.md` | `component-map.json` (machine-readable), `component-map.md` (human-readable with Mermaid) |
| **Figma awareness** | None | Inspects Figma file via MCP, matches existing components by name, reports what exists vs needs building |
| **Icon handling** | Deferred to Phase 3 | Separate `figma-from-code-discovery-assets` skill with Lucide SVG extraction |

**Key differences:**
- The branch's browser-crawling approach finds components as they actually render (with real selectors, routes, and nesting), not just as they're imported. This gives it CSS selectors for screenshotting and real parent-child relationships.
- The branch's code scanner (`discover-code-components.js`) catches components not visible during the crawl (modals, conditional renders, inline-edit states). Our static-only approach would catch these but might miss runtime-only components.
- The branch normalizes icon names to Figma conventions (`Icon/Check`, `Asset/CartonLogoSvg`) — we don't have this.
- The branch's Figma inspection step seeds `preExistingComponents` to protect user work from being overwritten.

**Ideas worth adopting:**
- Hybrid discovery (browser + static) gives better coverage than either alone
- Figma-aware discovery avoids rebuilding what already exists
- Icon name normalization for Figma conventions
- Machine-readable JSON output alongside human-readable markdown

---

### Phase 2: Design Tokens

| | `react-to-figma` | `figma-from-code` |
|---|---|---|
| **Skill** | `2-extract-design-tokens/prompt.md` | `figma-setup-variables` |
| **Method** | Read CSS/Tailwind config, map to Figma variable names | Read CSS/Tailwind config, create actual Figma variable collections via `use_figma` |
| **Output** | `design-tokens.md`, `design-tokens-css-map.md` | Live Figma variables (Palette, Semantic, Spacing collections) + `variables.json` lookup map |

**Key differences:**
- The branch actually creates Figma variables via MCP. We only document the mapping.
- The branch creates three collections with proper scoping (FRAME_FILL, TEXT_FILL, STROKE_COLOR, etc.).
- The branch generates a CSS-variable-name → Figma-variable-ID lookup map (`variables.json`) that build agents use to bind variables instead of hardcoding colors.
- The branch also runs `resolve-colors.js` to pre-compute all CSS variable colors as sRGB values, eliminating LLM color-space math during builds.

**Ideas worth adopting:**
- Pre-computed color resolution eliminates a major source of build errors
- Variable ID lookup maps enable proper Figma variable binding
- Scope-aware variable creation (not all variables should appear in all pickers)

---

### Phase 3: Asset Extraction

| | `react-to-figma` | `figma-from-code` |
|---|---|---|
| **Skill** | `3-extract-assets/prompt.md` | `figma-from-code-discovery-assets` |
| **Method** | Scan for icon library usage, extract SVGs, find static images | Static analysis of imports: find Lucide icons, resolve SVG from node_modules, find SVG file imports |
| **Output** | `assets/icons/`, `assets/images/` | `icons.json` with SVG strings, per-component icon mapping, usage counts |

**Key differences:**
- The branch extracts SVG strings directly (ready for `figma.createNodeFromSvg()`), not just file paths.
- The branch maps which components use which icons (`iconsByComponent`), enabling the build phase to know what icons each component needs.
- The branch has a dedicated script (`extract-icons.js`) rather than relying on LLM analysis.

**Ideas worth adopting:**
- SVG string extraction (ready for Figma consumption)
- Per-component icon mapping

---

### Phase 4: Story Pattern Discovery

| | `react-to-figma` | `figma-from-code` |
|---|---|---|
| **Skill** | `4-discover-story-patterns/prompt.md` | No equivalent |

**Key difference:** Our approach uses Storybook as the variant rendering mechanism. The branch skips Storybook entirely — it captures screenshots directly from the live app using Playwright element selectors, and discovers variants from source code analysis (cva, tv, CSS pseudo-states, responsive breakpoints, prop-driven states).

**Trade-offs:**
- Our Storybook approach: more variants visible (each story = one variant), but requires Storybook to be running and stories to exist
- The branch's approach: works without Storybook, captures real app context, but may miss variants not rendered in the default app state

---

### Phase 5: Component Context (Variants + Screenshots)

| | `react-to-figma` | `figma-from-code` |
|---|---|---|
| **Skill** | `5-get-component-context/` (3 sub-prompts) | `figma-from-code-precapture` + variant analysis in `figma-from-code-build-component` Step 1b |
| **Screenshot method** | Generate Storybook stories → run Storybook → Playwright screenshots of stories | Playwright element screenshots from live app using CSS selectors |
| **Variant discovery** | From props interface analysis | From variant libraries (cva/tv), CSS pseudo-states, responsive breakpoints, prop-driven states |
| **Parallelism** | Sequential per component | Parallel haiku subagents grouped by route (minimizes page navigations) |

**Key differences:**
- The branch separates screenshot capture (Phase 2.5) from building (Phase 3). All screenshots are captured upfront in parallel before any Figma work begins.
- The branch groups captures by URL, not by component — this minimizes Playwright page navigations.
- The branch uses element selectors (`--selector`) to isolate components on real pages, giving screenshots with real context (real data, real styling).
- The branch also extracts structured text content (`text.json`) from each component to seed Figma text nodes with real content.
- The branch's variant strategy is more sophisticated: it uses a "representative set algorithm" (`1 + SUM(values_per_axis - 1)`) to avoid combinatorial explosion while showing every distinct visual treatment.

**Ideas worth adopting:**
- Parallel batch capture grouped by route (minimizes page navigations; our Phase 5 already decouples capture from build, but runs sequentially per component)
- Route-grouped capture for efficiency
- Text content extraction for real data in Figma
- Representative set algorithm for variant management
- Budget guardrails (cap at 30 variants)

---

### Phase 6: Implement in Figma

| | `react-to-figma` | `figma-from-code` |
|---|---|---|
| **Skill** | `6-implement-in-figma/` (stubs) | `figma-from-code-build-component` + `figma-from-code-build-tier` + `figma-from-code-build-screens` |
| **Status** | Not implemented | Fully implemented with extensive detail |

The branch's build pipeline is by far the most sophisticated part:

1. **`figma-from-code-build-tier`** — Orchestrates per-tier building:
   - Icon/asset preamble: batch-creates all icon components via `figma.createNodeFromSvg()`
   - Filters out already-built components
   - Dispatches parallel opus subagents (one per component)
   - Collects results between tiers, checkpoints with user

2. **`figma-from-code-build-component`** — 7-step workflow per component:
   - Step 1 (Sonnet): Analyze source, write `code.json` with layout, children, variants, icons, computed styles
   - Step 2 (Opus): Build in Figma via `use_figma` — creates components/component sets with auto-layout, variable bindings, icon instances
   - Step 3 (Opus): Screenshot via `get_screenshot`
   - Step 4a (Opus): Instance-usage gate — verifies all child components are properly instanced (not inlined)
   - Step 4b-c (Haiku): Compare — sizing sanity check + pixel diff
   - Step 5 (Opus): Fix loop — up to 3 iterations of diagnose-from-diff → fix → re-screenshot → re-compare
   - Steps 6-7: Track (`figma.json`) + return result

3. **`figma-from-code-build-screens`** — Composes full 1440x900 page screens from built component instances

**Key architectural patterns:**
- **Subagent model split**: Sonnet for analysis, Opus for building/fixing, Haiku for mechanical comparison
- **Instance enforcement**: `check-instances.js` hard-rejects components that inline children instead of using instances
- **Pre-existing components rule**: immutable snapshot of what existed before the run, requires explicit user authorization to modify
- **`fixSizing()` mandatory**: called after every build to correct frames locked by `resize()` calls
- **Tailwind-to-Figma mapping table**: comprehensive mapping of Tailwind classes to Figma properties
- **Computed styles**: `inspect-styles.js` captures ground-truth CSS values from the live app
- **Self-healing fix loop**: fresh Opus context for fixes (no build-phase bias)

---

## Supporting Skills (no direct equivalent in `react-to-figma`)

| Skill | Purpose | Relevance |
|-------|---------|-----------|
| `figma-setup-file-structure` | Creates Figma page structure (Foundations, Components, Screens) with documentation frames | High — needed for our Phase 6 |
| `screenshot-comparison` | Pixel-diff comparison tool with border-ring analysis | High — reusable validation tool |
| `figma-from-code-validator` | Post-build validation with component app map, variant resolution, structural QA | High — needed for verification |
| `figma-component-dependency-map` | Static dependency analysis (superseded by discovery-components) | Low — our Phase 1 covers this |
| `site-component-map` | Runtime component discovery via Playwright | Medium — the scripts are used by discovery-components |
| `figma-explore` | Explore Figma file structure via REST API | Medium — useful for Figma-aware discovery |
| `figma-connect-component` | Code Connect mapping generation | Low — separate concern (Figma → code, not code → Figma) |
| `skill-workflow-diagrammer` | Diagram generation utility | Low — meta-tool, not part of pipeline |

---

## Key Architectural Differences

### 1. State Management
- **Ours**: Flat files per component in `.temp/react-to-figma/components/{Name}/`
- **Branch**: Centralized `state.json` ledger with phase tracking, tier progress, built components map, Figma node IDs, resume support

The branch's approach enables resume-after-interruption and skip-already-built patterns. Worth adopting.

### 2. Screenshot Strategy
- **Ours**: Storybook-based (generate stories → screenshot stories)
- **Branch**: Live app element screenshots (CSS selector → Playwright `elementHandle.screenshot()`)

Trade-off: Storybook gives isolated component variants but requires story authoring. Live app gives real-context screenshots but requires selectors and may miss variant states.

### 3. Build Verification
- **Ours**: Stub
- **Branch**: Multi-layered: instance enforcement (`check-instances.js`) + sizing sanity check + pixel diff (`compare.js`) + border-ring analysis + 3-iteration fix loop with fresh context

### 4. Parallelism Model
- **Ours**: Sequential subagents
- **Branch**: Tier-sequential, component-parallel. Within a tier, all components build simultaneously. Across tiers, sequential (dependencies).

### 5. Model Optimization
- **Ours**: Not specified
- **Branch**: Explicit model selection per task: Haiku for mechanical capture/compare, Sonnet for analysis, Opus for building/fixing

---

## Recommendations

### Adopt from `figma-from-code`
1. **Centralized state ledger** with phase tracking and resume support
2. **Pre-existing components protection** (immutable snapshot, authorization gates)
3. **Hybrid discovery** (browser crawl + static code scan)
4. **Pre-computed color resolution** (`resolve-colors.js`)
5. **Representative set algorithm** for variant management
6. **`fixSizing()` pattern** — mandatory after every Figma build
7. **Instance enforcement** — hard-reject components that inline children
8. **Pixel-diff validation** with border-ring analysis and fix loops
9. **Model tier optimization** — cheaper models for mechanical tasks
10. **Text content extraction** for real data in Figma components

### Keep from `react-to-figma`
1. **Storybook-based variants** — better variant isolation when stories exist
2. **Simpler skill structure** — 1 skill vs 14 is easier to maintain and understand
3. **Framework-agnostic design** — our prompt-based approach adapts more easily

### Consider Hybrid
1. Use Storybook for variant screenshots when stories exist, fall back to live app screenshots otherwise
2. Keep our single-skill structure but adopt the branch's sub-step file organization (`step-1-analyze.md`, etc.)
3. Use the branch's scripts (`compare.js`, `screenshot.js`, `extract-text.js`, `map-components.js`) as tools rather than reimplementing

---

## Scripts Worth Reusing

The `figma-from-code` branch has battle-tested Node.js scripts that could be used directly:

| Script | Location | Purpose |
|--------|----------|---------|
| `map-components.js` | `figma-from-code-validator/` | Crawl live app, detect framework, discover components, compute build order |
| `discover-components.js` | `figma-from-code-validator/` | Single-page component discovery |
| `screenshot.js` | `figma-from-code-validator/` | Element/page screenshots with `--selector`, `--click`, `--hover`, `--batch` |
| `extract-text.js` | `figma-from-code-validator/` | Structured text extraction by role |
| `extract-icons.js` | `figma-from-code-validator/` | Static analysis of icon/asset imports |
| `compare.js` | `screenshot-comparison/` | Pixel-diff comparison with border-ring analysis |
| `inspect-styles.js` | `figma-from-code-validator/` | Capture computed CSS values from live page |
| `resolve-colors.js` | `figma-from-code-validator/` | Pre-compute CSS variable colors as sRGB |
| `check-instances.js` | `figma-from-code-build-component/` | Verify all children are proper Figma instances |
| `browser-server.js` | `figma-from-code-validator/` | Shared Playwright WebSocket server |
| `normalize-component-map.js` | `figma-from-code-discovery-components/` | Align scanner names with Figma conventions |
| `discover-code-components.js` | `figma-from-code-discovery-components/` | Static code scanner for components not found at runtime |
