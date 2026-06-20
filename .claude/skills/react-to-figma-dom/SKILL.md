---
name: react-to-figma-dom
description: "Convert a React app's components into Figma using a deterministic DOM-to-Figma pipeline. Discovers the full component hierarchy, extracts design tokens and assets, captures DOM trees via Storybook, generates Figma IR and build scripts, then builds and verifies components in Figma. Page-first build order gets to composed pages quickly for human review."
---

# React to Figma (DOM Pipeline)

End-to-end pipeline that converts a React application's components into Figma. Uses a deterministic DOM capture → IR → codegen pipeline instead of AI-driven Figma code generation. AI is only used for variant identification, story generation, and fix loops.

## When to Use

- Converting a React codebase's components into a Figma design system
- Building Figma component sets that match live React components 1:1
- Creating composed page frames in Figma from live app routes

## Context Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `sourceRoot` | `packages/client/src` | React source root |
| `storybookUrl` | `http://localhost:6006` | Storybook URL (must be running for Phase 6) |
| `devServerUrl` | `http://localhost:5173` | Dev server URL (for page screenshots in Phase F) |
| `figmaFileKey` | from `.env` or config | Target Figma file key |
| `pipelineDir` | `.temp/react-to-figma-dom/` | Root output directory |
| `skillDir` | `.claude/skills/react-to-figma-dom/` | This skill's directory |

## Pipeline Overview

```
Phase A: Discovery (folders 1-4)
  1-find-hierarchy        → build-order.json, pages.json
  2-extract-design-tokens → design-tokens.json
  3-extract-assets        → icons, static assets
  4-discover-story-patterns → story-patterns.md

Phase B: Capture & Preprocess (folders 6-7) — Storybook required for 6 only
  6-capture-dom-from-stories → per-component: code-variants.json, stories, dom.json, screenshots
  7-generate-build-scripts   → per-component: figma-variants.json, figma-ir.json, build-script.js
                               whole-set: page-priority-manifest.json

Phase C: Figma Setup (folder 5) — after B so tokens/icons are known
  5-setup-figma-file → figma-variables-map.json, figma-icons-map.json, container frames

Phase D→I: Build & Fix (folder 8) — 6 passes
  D: Build page-needed variants (build-order, leaves first)
  E: Fix sweep (FAIL+PARTIAL page variants, max 2 iterations)
  F: Compose pages from built components ★ HUMAN CHECKPOINT
  G: Fix sweep (page-level issues)
  H: Build remaining variants
  I: Fix sweep (final) → scoreboard
```

## Orchestration Rules

1. **Subagent enforcement**: Every phase/step runs as a subagent. Pass the prompt file path and input paths. Never read sub-prompt content inline.
2. **Checkpoint/resume**: `{pipelineDir}/state.json` tracks phase completion. On restart, resume from the first incomplete phase.
3. **Idempotency**: Each phase checks for existing outputs before running. Completed steps are skipped.
4. **Build order**: Components process in topological order (leaves first) so parent components can reference child INSTANCE IDs.

## Procedure

### Phase A: Discovery

Launch each phase as a subagent in sequence:

1. **Find Hierarchy**: `{skillDir}/1-find-hierarchy/prompt.md`
   - Output: `{pipelineDir}/component-hierarchy/build-order.json`, `pages.json`
   - Per-component: `{pipelineDir}/components/{Name}/analysis.md`, `props.md`

2. **Extract Design Tokens**: `{skillDir}/2-extract-design-tokens/prompt.md`
   - Output: `{pipelineDir}/design-tokens.json`, `design-tokens.md`

3. **Extract Assets**: `{skillDir}/3-extract-assets/prompt.md`
   - Output: `{pipelineDir}/icons.json`, static asset files

4. **Discover Story Patterns**: `{skillDir}/4-discover-story-patterns/prompt.md`
   - Output: `{pipelineDir}/story-patterns.md`

### Phase B: Capture & Preprocess

5. **Capture DOM from Stories**: `{skillDir}/6-capture-dom-from-stories/prompt.md`
   - Requires: Storybook running
   - Iterates all components from build-order.md
   - Per-component: identifies variants, generates stories, captures DOM
   - Output: per-component `variants.md`, stories, `variants/*/dom.json` + `screenshot.png`
   - Gate: Storybook no longer needed after this phase

6. **Generate Build Scripts**: `{skillDir}/7-generate-build-scripts/prompt.md`
   - Offline processing — no Storybook or browser needed
   - Per-component: diffs DOM trees, classifies variant axes, generates Figma IR + build scripts
   - Whole-set: cross-refs pages.json to prioritize page-needed variants
   - Output: per-component `figma-variants.json`, `figma-ir.json`, `build-script.js`; `page-priority-manifest.json`

### Phase C: Figma Setup

7. **Setup Figma File**: `{skillDir}/5-setup-figma-file/prompt.md`
   - Requires: Figma MCP connection
   - Creates Figma variables from design tokens, uploads icons, creates container frames
   - Output: `figma-variables-map.json`, `figma-icons-map.json`, `figma-file-setup.json`

### Phases D→I: Build & Fix

8. **Batch Build**: `{skillDir}/8-batch-build/prompt.md`
   - Requires: Figma MCP connection, dev server (for page screenshots)
   - Runs 6 passes: D→E→F→G→H→I
   - Human checkpoint after Phase F (compose pages)
   - Output: complete Figma components, page frames, scoreboard

## Directory Structure

```
.claude/skills/react-to-figma-dom/
├── SKILL.md
├── changelog/
│
├── 1-find-hierarchy/
│   ├── prompt.md                                          orchestrator
│   ├── 1-from-files/
│   │   └── 1-prompt.discover-components.md
│   ├── 2-from-app/
│   │   ├── 1-prompt.discover-components.md
│   │   └── map-components.js
│   ├── 3-prompt.merge-file-and-app-discoveries.md
│   ├── 4-prompt.extract-props-and-children-for-a-component.md
│   ├── 5-prompt.generate-build-order.md
│   └── (pages.json queried on demand via scripts/query-pages.js)
│
├── 2-extract-design-tokens/
│   ├── prompt.md
│   └── resolve-colors.js
│
├── 3-extract-assets/
│   ├── prompt.md
│   ├── extract-icons.js
│   └── extract-static-assets.js
│
├── 4-discover-story-patterns/
│   └── prompt.md
│
├── 5-setup-figma-file/
│   └── prompt.md
│
├── 6-capture-dom-from-stories/
│   ├── prompt.md                                          orchestrator (1 subagent/component)
│   ├── 1-prompt.identify-variants-for-a-component.md
│   ├── 2-prompt.generate-stories-for-a-component.md
│   └── 3-prompt.capture-dom-for-a-component.md
│
├── 7-generate-build-scripts/
│   ├── prompt.md                                          orchestrator
│   ├── 1-prompt.diff-and-classify-for-a-component.md      calls script + resolves NEEDS_REVIEW
│   ├── 2-prompt.generate-build-scripts-for-all-components.md  batch: IR + build-script.js for all components
│   ├── 3-prompt.prioritize-page-variants.md               cross-ref pages.json (whole-set)
│   └── scripts/
│       └── classify-variants.js
│
├── 8-batch-build/
│   ├── prompt.md                                          orchestrator (D→E→F→G→H→I)
│   ├── 1-prompt.build-page-variants.md                    D: sub-orchestrator
│   ├── 2-prompt.fix-sweep.md                              E: sub-orchestrator
│   ├── 3-prompt.compose-pages.md                          F: sub-orchestrator ★ HUMAN CHECKPOINT
│   ├── 4-prompt.fix-sweep-pages.md                        G: sub-orchestrator
│   ├── 5-prompt.build-remaining.md                        H: sub-orchestrator
│   ├── 6-prompt.fix-sweep-remaining.md                    I: sub-orchestrator
│   ├── batch-verify.js
│   ├── aggregate-scores.js
│   └── prompts/                                           shared per-item subagent prompts
│       ├── build-a-component.md                           used by D, H
│       ├── verify-a-component.md                          used by D, E, G, H, I
│       ├── fix-a-component.md                             used by E, G, I
│       ├── build-a-page-frame.md                          used by F
│       └── verify-a-page-frame.md                         used by F, G
│
├── scripts/                                               shared scripts
│   ├── capture-dom-core.js
│   ├── capture-dom.js
│   ├── diff-variants.js
│   ├── dom-to-figma-ir.js
│   ├── ir-to-figma-code.js
│   ├── css-to-figma.js
│   ├── compare.js
│   ├── verify-variants.js
│   ├── batch-screenshot-and-verify.js
│   ├── cleanup-component.template.js
│   └── combine-variants.template.js
│
└── reference/                                             Figma docs
    ├── figma-use-rules.md
    ├── figma-gotchas.md
    ├── figma-component-patterns.md
    ├── figma-variable-binding.md
    ├── fix-sizing.md
    └── tailwind-figma-map.md
```

## Scripts

| Script | Purpose | Inputs | Outputs |
|--------|---------|--------|---------|
| `capture-dom.js` | Capture DOM tree, CSS, fiber data, screenshot from Storybook | Storybook URL, story ID | `dom.json`, `fiber-dom-map.json`, `screenshot.png` |
| `capture-dom-core.js` | Core DOM extraction logic (imported by capture-dom.js) | DOM node | JSON tree |
| `diff-variants.js` | Compare DOM trees across variants | variants directory | `variant-diffs.md` |
| `classify-variants.js` | Deterministic axis classification from diffs | variants.md, variant-diffs.md | `figma-variants.json` |
| `dom-to-figma-ir.js` | Walk DOM tree → Figma IR with variable bindings | `dom.json`, variable maps | `figma-ir.json` |
| `ir-to-figma-code.js` | Generate executable `use_figma` JavaScript from IR | `figma-ir.json` | `build-script.js` |
| `css-to-figma.js` | CSS properties → Figma properties (pure function library) | CSS object | Figma props |
| `compare.js` | Pixel diff two PNGs (pixelmatch + pngjs) | imageA, imageB | `composite.png`, `comparison.json` |
| `verify-variants.js` | Multi-variant verification runner | `verify-manifest.json` | `verification-results.json` |
| `batch-screenshot-and-verify.js` | Batch screenshot from Figma + pixel diff | component-dir, file-key | per-variant screenshots + comparisons |

## Dependencies

- **Storybook** at `storybookUrl` (required for Phase 6 only)
- **Dev server** at `devServerUrl` (required for Phase F page screenshots)
- **Playwright** (browser automation for DOM capture)
- **pixelmatch + pngjs** (pixel comparison — pure JS)
- **Figma MCP** (`use_figma` tool — required for Phases C, D-I)

## Output Directory

```
.temp/react-to-figma-dom/
├── state.json                          # Phase completion tracking
├── component-hierarchy/
│   ├── build-order.md
│   ├── pages.json
│   └── pages.md
├── design-tokens.json
├── story-patterns.md
├── figma-variables-map.json
├── figma-icons-map.json
├── figma-file-setup.json
├── built-components.json               # Component name → Figma node ID
├── page-priority-manifest.json
├── scoreboard.md
├── components/{Name}/
│   ├── analysis.md
│   ├── props.md
│   ├── variants.md
│   ├── figma-variants.json
│   ├── preprocess-status.json
│   ├── figma-result.json
│   └── variants/{VariantName}/
│       ├── dom.json
│       ├── fiber-dom-map.json
│       ├── screenshot.png
│       ├── figma-ir.json
│       └── build-script.js
└── pages/{routeSlug}/
    ├── page-figma-result.json
    └── page-verification.json
```
