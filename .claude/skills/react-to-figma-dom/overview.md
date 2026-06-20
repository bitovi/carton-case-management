# React-to-Figma DOM Pipeline — Full Workflow Summary

End-to-end pipeline that converts React components into Figma. Uses deterministic DOM capture → IR → codegen. AI is only used for variant identification, story generation, and fix loops.

**Pipeline directory**: `.temp/react-to-figma-dom/`
**Skill directory**: `.claude/skills/react-to-figma-dom/`

---

## Phase A: Discovery (Steps 1–4, sequential)

### 1. Find Hierarchy (orchestrator)

**Prompt**: `1-find-hierarchy/prompt.md`

Orchestrates 5 sub-steps to discover all components, analyze them, and produce a build order.

---

#### 1.1a — Discover Components (from files)

**Role**: Subagent — static source code analysis

**What it does**: Scans the React source tree for all component definitions — project-defined, UI library (shadcn), and npm-imported. Classifies each component's export type and source type.

**Prompt file**: `1-find-hierarchy/1-from-files/1-prompt.discover-components.md`

**Args**: sourceRoot, output directory

**Files read**: All `.tsx`/`.ts` files under sourceRoot

**Scripts run**:
- `node 1-find-hierarchy/1-from-files/discover-components.js --source-root {sourceRoot} --output-dir ...`

**Files written**:
- `component-hierarchy/from-files/components.json` — structured component list
- `component-hierarchy/from-files/barrel-map.md` — index re-export resolution map
- `component-hierarchy/from-files/prop-classification.json` — per-component prop categorization

---

#### 1.1b — Discover Components (from app)

**Role**: Subagent — browser crawl via Playwright (parallel with 1.1a)

**What it does**: Crawls the running dev server, walks React fiber trees on each route to discover components as they actually render. Captures viewport screenshots per route and element-level captures per component instance.

**Prompt file**: `1-find-hierarchy/2-from-app/1-prompt.discover-components.md`

**Args**: devServerUrl, sourceRoot, output directory

**Scripts run**:
- `node 1-find-hierarchy/2-from-app/map-components.js --url {devServerUrl} --output ... --pages-output ... --captures-dir ... --prop-classification ... --max-routes 50`

**Files written**:
- `component-hierarchy/from-app/components.json` — component list from runtime
- `component-hierarchy/component-map.json` — flat component list across all routes
- `component-hierarchy/pages.json` — per-route page trees with resolved props
- `pages/{route-slug}/screenshot-app.png` — viewport screenshots
- `components/{Name}/app-variants/` — per-component DOM captures, fiber maps, screenshots

---

#### 1.2 — Reconcile Discoveries

**Role**: Subagent — merge + classify + filter

**What it does**: Merges the two discovery results into a unified component list. Classifies every component (app-component, ui-wrapper, icon, provider-context, portal, etc.) to determine what should be built in Figma vs filtered out.

**Prompt file**: `1-find-hierarchy/3-prompt.merge-file-and-app-discoveries.md`

**Args**: sourceRoot, from-files JSON, from-app JSON, component-map JSON, output directory

**Scripts run**:
- `node 1-find-hierarchy/merge-discoveries.js --from-files ... --from-app ... --output-dir ... --source-root ...`

**Files written**:
- `component-hierarchy/components-todo-raw.md` — unfiltered merged list
- `component-hierarchy/components-classified.md` — classified with KEEP/FILTER tags
- `component-hierarchy/components-todo.json` — final filtered list (KEEP only)

---

#### 1.3 — Extract Children Graph

**Role**: Script execution (not a subagent)

**What it does**: Builds parent-child dependency graph by scanning component source files for JSX usage.

**Scripts run**:
- `node 1-find-hierarchy/extract-children.js ...`

**Files written**:
- `component-hierarchy/children-graph.json`
- Per-component: `components/{Name}/analysis.md`

---

#### 1.4 — Generate Build Order

**Role**: Subagent — topological sort

**What it does**: Reads the children graph, performs topological sort (leaves first), groups by dependency level.

**Prompt file**: `1-find-hierarchy/5-prompt.generate-build-order.md`

**Files read**:
- `component-hierarchy/children-graph.json`
- `component-hierarchy/barrel-map.md`

**Files written**:
- `component-hierarchy/build-order.json` — level-grouped JSON with components per level

---

### 2. Extract Design Tokens

**Role**: Single subagent

**What it does**: Extracts all CSS custom properties, Tailwind scales, shadow definitions. Resolves every color to hex. Maps each token to a Figma variable path and collection (Palette, Semantic, Numbers).

**Prompt file**: `2-extract-design-tokens/prompt.md`

**Args**: sourceRoot, output directory

**Files read**: `{sourceRoot}/index.css`, Tailwind config

**Scripts run**:
- `node 2-extract-design-tokens/resolve-colors.js {sourceRoot} --output .temp/react-to-figma`

**Files written**:
- `design-tokens.json` — all tokens with resolved hex, Figma paths, scoping
- `css-figma-map.json` — reverse lookup: CSS variable/class → Figma variable path
- `design-tokens.md` — human-readable tables

---

### 3. Extract Assets

**Role**: Single subagent

**What it does**: Scans for lucide-react imports, extracts normalized SVGs from node_modules, builds per-component icon mappings. Also inventories static images.

**Prompt file**: `3-extract-assets/prompt.md`

**Args**: sourceRoot, client directory, output directory

**Scripts run**:
- `node 3-extract-assets/extract-icons.js {sourceRoot} --output .temp/react-to-figma`
- `node 3-extract-assets/extract-static-assets.js {clientDir} --output .temp/react-to-figma`

**Files written**:
- `icons.json` — icon list with SVG strings and per-component mapping
- `assets/icons/{Name}.svg` — individual normalized SVGs
- `assets/static-assets.json` — static image inventory

---

### 4. Discover Story Patterns

**Role**: Single subagent

**What it does**: Scans existing Storybook stories to discover conventions (decorators, mocking, providers, state simulation). Tells downstream story-generation how to write stories that render.

**Prompt file**: `4-discover-story-patterns/prompt.md`

**Args**: sourceRoot, output directory

**Files read**: `.storybook/main.ts`, `.storybook/preview.tsx`, up to 15 sample `*.stories.tsx`

**Files written**:
- `story-patterns.md` — decorators, mocking patterns, provider wrappers, URL structure

---

## Phase B: Capture & Preprocess (Steps 6–7)

### 6. Capture DOM from Stories (orchestrator — 3 parallel waves)

**Prompt**: `6-capture-dom-from-stories/prompt.md`

Iterates ALL components from `build-order.json` in three waves. After this phase, Storybook is no longer needed.

---

#### 6.1 — Wave 1: Identify Variants (per component, parallel)

**Role**: Per-component subagent (all launched in parallel)

**What it does**: Reads the React source, finds all prop-driven variants (CVA axes, union types, booleans), interaction states (hover/focus/disabled), and content states (empty/loading/error).

**Prompt file**: `6-capture-dom-from-stories/1-prompt.identify-variants-for-a-component.md`

**Args**: componentName, sourcePath, componentDir, pipelineDir

**Files read**:
- Component source `.tsx` (+ CSS modules, hooks, CVA definitions)
- `{componentDir}/analysis.md` (from Phase 1)
- `{componentDir}/props.md` (optional — generates it if missing)
- `pages.json` via `query-pages.js` (optional — finds real prop combos)
- `{componentDir}/app-variants/*.png` (optional — live captures)

**Scripts run**:
- `node scripts/query-pages.js --pages-json ... --component {Name}`

**Files written**:
- `components/{Name}/code-variants.json` — the full variant matrix
- `components/{Name}/props.md` — generated if missing

**Gate**: All `code-variants.json` must exist before Wave 2.

---

#### 6.2 — Wave 2: Generate Stories (per component, parallel)

**Role**: Per-component subagent (all launched in parallel)

**What it does**: Generates a `*.figma-variants.stories.tsx` file with one named export per visual variant. Uses story-patterns.md conventions for decorators/mocking/providers. Handles data-fetching via escalation (existing mocks → override props → wrapper).

**Prompt file**: `6-capture-dom-from-stories/2-prompt.generate-stories-for-a-component.md`

**Args**: componentName, sourcePath, componentDir, pipelineDir

**Files read**:
- `story-patterns.md` (from Phase 4)
- `{componentDir}/code-variants.json` (from Wave 1)
- `{componentDir}/props.md`
- Component source + existing `*.stories.tsx` (for import paths)

**Files written**:
- `{sourceDir}/{Name}.figma-variants.stories.tsx` — Storybook story file
- `{componentDir}/stories-manifest.md` — export names → variant combinations

**Gate**: 5-second pause after all stories written (Storybook hot-reload settle).

---

#### 6.3 — Wave 3: Capture DOM (batch, parallel)

**Role**: Per-component subagent (all launched in parallel)

**What it does**: Runs Playwright, navigates to each story's iframe URL, captures full DOM tree with computed styles, bounding boxes, fiber correlation, and screenshot.

**Prompt file**: `6-capture-dom-from-stories/3-prompt.capture-dom-for-a-component.md`

**Args**: componentName, componentDir, Storybook URL

**Scripts run**:
- `node scripts/capture-dom.js --storybook-url http://localhost:6006 --output-dir .temp/react-to-figma-dom/components [--components Name1,Name2]`

**Files written** (per variant):
- `components/{Name}/variants/{Export}/dom.json` — DOM tree with computed styles
- `components/{Name}/variants/{Export}/fiber-dom-map.json` — React fiber → DOM correlation
- `components/{Name}/variants/{Export}/screenshot.png`
- `components/{Name}/variants/capture-manifest.json`

**Self-healing**: Up to 2 retries for failed components.

---

### 7. Generate Build Scripts (orchestrator)

**Prompt**: `7-generate-build-scripts/prompt.md`

Offline processing — no Storybook or browser. Three sub-steps.

---

#### 7.1 — Diff and Classify (per component, sequential)

**Role**: Per-component subagent

**What it does**: Compares DOM trees across variants to determine which are visually distinct. Classifies axes as VARIANT, BOOLEAN, or behavioral (excluded).

**Prompt file**: `7-generate-build-scripts/1-prompt.diff-and-classify-for-a-component.md`

**Args**: componentName, componentDir, pipelineDir, skillDir

**Files read**:
- `{componentDir}/code-variants.json`
- All `dom.json` files in `{componentDir}/variants/`
- `capture-manifest.json`

**Scripts run**:
- `node scripts/diff-variants.js --variants-dir {componentDir}/variants`
- `node 7-generate-build-scripts/scripts/classify-variants.js --code-variants ... --output ...`

**Files written**:
- `{componentDir}/variant-diffs.md` — pair-wise verdicts
- `{componentDir}/figma-variants.json` — axis classification (VARIANT/BOOLEAN/behavioral)

---

#### 7.2 — Generate Build Scripts (batch — all components)

**Role**: Script execution by orchestrator

**What it does**: For every component with `figma-variants.json`, generates Figma IR from each DOM tree, computes structural fingerprints, groups variants, generates `build-script.js` for base variants and `clone-batch-*.js` for dependent variants.

**Scripts run** (per component):
- `node scripts/generate-build-and-clone-scripts.js --component-dir {componentDir} --figma-variants ... --pipeline-dir ...`

**Internally calls**: `dom-to-figma-ir.js` → `ir-to-figma-code.js`

**Files written** (per component):
- `variants/{Variant}/figma-ir.json` — intermediate representation
- `variants/{Variant}/build-script.js` — executable Figma plugin code (base variants)
- `clone-batch-{group}-{batch}.js` — clone + property-delta scripts (dependent variants)
- `build-manifest.json` — execution order

---

#### 7.3 — Prioritize Page Variants

**Role**: Subagent

**What it does**: Cross-references `pages.json` against `figma-variants.json` to prioritize which variants build first (page-visible) vs later.

**Prompt file**: `7-generate-build-scripts/3-prompt.prioritize-page-variants.md`

**Files read**: `pages.json`, all `figma-variants.json`

**Scripts run**: `node scripts/prioritize-page-variants.js ...`

**Files written**: `page-priority-manifest.json`

---

## Phase C: Figma Setup (Step 5)

### 5. Setup Figma File

**Role**: Single subagent — first phase requiring Figma MCP

**What it does**: Creates Figma file structure (pages, container frames), variable collections from tokens, icon components from SVGs. Produces ID mapping files all build phases consume.

**Prompt file**: `5-setup-figma-file/prompt.md`

**Args**: figma file key

**Files read**: `design-tokens.json`, `css-figma-map.json`, `icons.json`, `assets/icons/*.svg`, `static-assets.json`

**Scripts run**:
- `node scripts/generate-phase5-figma-code.js --pipeline-dir .temp/react-to-figma-dom` — pre-generates JS files with inlined data
- Executes each generated `.js` via `use_figma` MCP in manifest order
- `node phase5-figma-calls/07-build-maps.js` — assembles output maps

**MCP calls**: Multiple `use_figma` calls (pages, frames, variable collections, variables, icon components)

**Files written**:
- `figma-variables-map.json` — CSS var/class → real Figma variable ID
- `figma-icons-map.json` — icon name → real Figma component node ID
- `figma-assets-map.json` — asset name → real Figma component node ID
- `figma-file-setup.json` — page and container frame node IDs

**Critical constraint**: No `require('fs')` inside `use_figma`. All IDs must be real (from actual returns, format `digits:digits`).

---

## Phases D–I: Build & Fix (Step 8)

**Prompt**: `8-batch-build/prompt.md` — six sequential passes.

---

### Phase D — Build Page Variants (Pass 1)

**Role**: Sub-orchestrator with per-component subagents

**What it does**: Builds only variants that appear on pages, in build order (leaves first). Each component's pre-generated `build-script.js` is passed verbatim to `use_figma`. After each build, runs pixel-diff verification.

**Prompt file**: `8-batch-build/1-prompt.build-page-variants.md`
**Per-component prompt**: `8-batch-build/prompts/build-a-component.md`

**Args**: componentName, componentDir, pipelineDir, fileKey, parentFrameId, builtComponents, variantFilter

**Files read**: `build-manifest.json`, `build-script.js`, `clone-batch-*.js`, `figma-variables-map.json`, `figma-icons-map.json`

**Scripts run**:
- Pre-flight: `node scripts/validate-phase5-outputs.js --pipeline-dir ...`
- Per component: `node 8-batch-build/batch-verify.js --component-dir ... --file-key ...`

**MCP calls**: Passes `build-script.js` content verbatim to `use_figma`, then clone batches.

**Files written**: `figma-result.json`, updated `built-components.json`, `verification-results.json`

**Gate**: ≥1 real component before Phase E.

---

### Phase E — Fix Sweep (Pass 2)

**Role**: Sub-orchestrator — fixes FAIL/PARTIAL components from Phase D

**Prompt file**: `8-batch-build/2-prompt.fix-sweep.md`
**Per-component prompt**: `8-batch-build/prompts/fix-a-component.md`

**What it does**: Max 2 iterations per failing component: diagnose → fix → re-verify.

**Scripts run**: `node aggregate-scores.js`, `node batch-verify.js`

---

### Phase F — Compose Pages (Pass 3) ★ HUMAN CHECKPOINT

**Role**: Sub-orchestrator with per-route subagents

**What it does**: Builds full page frames by instancing already-built components with resolved props. Verifies against live dev-server screenshots. Then STOPS for human review.

**Prompt file**: `8-batch-build/3-prompt.compose-pages.md`
**Per-route prompts**: `prompts/build-a-page-frame.md`, `prompts/verify-a-page-frame.md`

**Files read**: `pages.json`, `built-components.json`, `figma-variables-map.json`

**Files written**: `pages/{routeSlug}/page-figma-result.json`, `page-verification.json`

**Gate**: Human must say "continue".

---

### Phase G — Fix Sweep Pages (Pass 4)

**Prompt file**: `8-batch-build/4-prompt.fix-sweep-pages.md`

Same pattern as Phase E but for page frames.

---

### Phase H — Build Remaining Variants (Pass 5)

**Prompt file**: `8-batch-build/5-prompt.build-remaining.md`

Builds all variants NOT in the page-priority manifest. Same flow as Phase D.

---

### Phase I — Fix Sweep Remaining (Pass 6)

**Prompt file**: `8-batch-build/6-prompt.fix-sweep-remaining.md`

Final fix pass. Produces the scoreboard.

**Files written**: `scoreboard.md` — final pass/partial/fail across all components.

---

## Key Shared Scripts (`scripts/`)

| Script | Purpose |
|--------|---------|
| `capture-dom.js` | Playwright → DOM tree, fiber map, screenshot from Storybook |
| `diff-variants.js` | Compare DOM trees → verdict matrix |
| `classify-variants.js` | Deterministic axis classification |
| `dom-to-figma-ir.js` | DOM tree → Figma IR with variable bindings |
| `ir-to-figma-code.js` | Figma IR → executable `use_figma` JavaScript |
| `generate-build-and-clone-scripts.js` | IR + fingerprint + base builds + clone batches |
| `css-to-figma.js` | CSS properties → Figma properties (pure library) |
| `compare.js` | Pixel diff two PNGs (pixelmatch) |
| `batch-screenshot-and-verify.js` | Screenshot from Figma + pixel diff |
| `validate-phase5-outputs.js` | Check Phase 5 maps contain real Figma IDs |
| `generate-phase5-figma-code.js` | Pre-generate `use_figma` code with inlined data |

---

## External Dependencies

| Dependency | Required for | When no longer needed |
|------------|-------------|------|
| Storybook (`localhost:6006`) | Phase 6 (DOM capture) | After Phase 6 completes |
| Dev server (`localhost:5173`) | Phase 1 app-crawl, Phase F page screenshots | |
| Playwright | Phases 1, 6, F | |
| Figma MCP (`use_figma`) | Phases 5, D–I | |
| pixelmatch + pngjs | Verification | Pure JS, always available |
