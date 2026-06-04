# Find Component Hierarchy

Orchestrate the full component hierarchy discovery pipeline: discover all components, analyze each one individually, then generate the build order and Mermaid diagram.

Supports two discovery strategies that can run independently or together:
- **from-files**: Static source code analysis (finds all components including unused/conditional ones)
- **from-app**: Browser crawl via Playwright (finds components as they actually render, with CSS selectors and routes)

When both strategies run, their results are reconciled into a unified component list before analysis.

## Subagent Enforcement

**CRITICAL**: Every sub-step in this orchestrator MUST be executed via `runSubagent`. Do NOT read a child prompt and execute its steps inline in this context. Each sub-step runs in its own subagent to keep context windows manageable.

This applies to:
- Discovery (from-files and from-app) — MUST be separate subagents (enables parallel execution)
- Reconciliation — MUST be a subagent
- Each component analysis — MUST be a subagent
- Build order generation — MUST be a subagent
- Pages manifest generation — MUST be a subagent

## Inputs

- **Source root**: The project source root path (e.g., `src/` or `packages/client/src/`)
- **Output directory**: `.temp/react-to-figma-dom/`
- **Strategy**: `"files"`, `"app"`, or `"both"` (default: `"both"`)
- **Dev server URL** (required when strategy includes `"app"`): e.g., `http://localhost:5173`

## Procedure

### Phase 1: Discover Components

The discovery phase runs one or both strategies based on the `strategy` input.

**When strategy is `"both"`**: Launch the from-files and from-app subagents in parallel (they have no dependencies on each other). Both `runSubagent` calls can be made simultaneously.

#### Strategy: `"files"` or `"both"` — Static file analysis

Read the full contents of `.claude/skills/react-to-figma-dom/1-find-hierarchy/1-from-files/1-prompt.discover-components.md`.

Launch via `runSubagent` (do NOT execute inline):

```typescript
const discoverPrompt = readFile('.claude/skills/react-to-figma-dom/1-find-hierarchy/1-from-files/1-prompt.discover-components.md')

runSubagent({
  description: "Discover components via static file analysis",
  prompt: `
    ${discoverPrompt}

    ## Context
    - Source root: ${sourceRoot}
    - Output directory: .temp/react-to-figma-dom/

    ## Important
    Write outputs to strategy-specific paths:
    - Components: .temp/react-to-figma-dom/component-hierarchy/from-files/components.json
    - Barrel map: .temp/react-to-figma-dom/component-hierarchy/from-files/barrel-map.md
  `
})
```

**If strategy is `"files"` only**: After the subagent completes, copy the outputs to the main location:
- Run the merge script with `--from-files` and a synthetic empty `--from-app` JSON, or run:
  ```bash
  node .claude/skills/react-to-figma-dom/1-find-hierarchy/merge-discoveries.js \
    --from-files .temp/react-to-figma-dom/component-hierarchy/from-files/components.json \
    --from-app /dev/null \
    --output-dir .temp/react-to-figma-dom/component-hierarchy
  ```
  Note: If only files strategy was used, create a minimal from-app JSON first:
  ```bash
  echo '{"schemaVersion":"react-to-figma-components@1","discoveryMethod":"app-crawl","componentCount":0,"components":[]}' > .temp/react-to-figma-dom/component-hierarchy/from-app/components.json
  ```
  Then run the merge script. This produces the final `components-todo.md`.
- Copy `from-files/barrel-map.md` → `.temp/react-to-figma-dom/component-hierarchy/barrel-map.md`

Then skip to Phase 2.

#### Strategy: `"app"` or `"both"` — Browser crawl

Read the full contents of `.claude/skills/react-to-figma-dom/1-find-hierarchy/2-from-app/1-prompt.discover-components.md`.

Launch via `runSubagent` (do NOT execute inline):

```typescript
const discoverPrompt = readFile('.claude/skills/react-to-figma-dom/1-find-hierarchy/2-from-app/1-prompt.discover-components.md')

runSubagent({
  description: "Discover components via app crawl",
  prompt: `
    ${discoverPrompt}

    ## Context
    - Dev server URL: ${devServerUrl}
    - Source root: ${sourceRoot}
    - Output directory: .temp/react-to-figma-dom/

    ## Important
    Write outputs to strategy-specific paths:
    - Components: .temp/react-to-figma-dom/component-hierarchy/from-app/components.json
    - Barrel map: .temp/react-to-figma-dom/component-hierarchy/from-app/barrel-map.md
    - Component map JSON: .temp/react-to-figma-dom/component-hierarchy/component-map.json
    ## Captures
    Pass --captures-dir .temp/react-to-figma to enable live app context captures.
    The script will capture viewport screenshots per route and element screenshots + HTML + computed CSS per component.
  `
})
```

**If strategy is `"app"` only**: After the subagent completes, copy the outputs to the main location:
- Create an empty from-files JSON:
  ```bash
  mkdir -p .temp/react-to-figma-dom/component-hierarchy/from-files
  echo '{"schemaVersion":"react-to-figma-components@1","discoveryMethod":"static-analysis","componentCount":0,"components":[]}' > .temp/react-to-figma-dom/component-hierarchy/from-files/components.json
  ```
- Run the merge script to produce `components-todo.md`.
- Copy `from-app/barrel-map.md` → `.temp/react-to-figma-dom/component-hierarchy/barrel-map.md`

Then skip to Phase 2.

#### Strategy: `"both"` — Reconcile

After both discovery subagents complete, read the full contents of `.claude/skills/react-to-figma-dom/1-find-hierarchy/3-prompt.merge-file-and-app-discoveries.md`.

Launch via `runSubagent` (do NOT execute inline):

```typescript
const reconcilePrompt = readFile('.claude/skills/react-to-figma-dom/1-find-hierarchy/3-prompt.merge-file-and-app-discoveries.md')

runSubagent({
  description: "Reconcile file and app discovery results",
  prompt: `
    ${reconcilePrompt}

    ## Context
    - Source root: ${sourceRoot}
    - From-files output: .temp/react-to-figma-dom/component-hierarchy/from-files/components.json
    - From-app output: .temp/react-to-figma-dom/component-hierarchy/from-app/components.json
    - Component map JSON: .temp/react-to-figma-dom/component-hierarchy/component-map.json
    - Output directory: .temp/react-to-figma-dom/component-hierarchy/
  `
})
```

After reconciliation, verify that `.temp/react-to-figma-dom/component-hierarchy/components-todo.md` exists and contains at least one component.

### Phase 2: Extract Children Graph (fast static analysis)

Run the `extract-children.js` script to build the parent-child dependency graph. This replaces the previous per-component subagent loop.

```bash
node .claude/skills/react-to-figma-dom/1-find-hierarchy/extract-children.js \
  --components-todo .temp/react-to-figma-dom/component-hierarchy/components-todo.md \
  --output-dir .temp/react-to-figma \
  --source-root {sourceRoot}
```

Verify:
1. `.temp/react-to-figma-dom/component-hierarchy/children-graph.json` exists
2. Per-component `analysis.md` files were written to `.temp/react-to-figma-dom/components/*/`

Note: Props extraction (`props.md`) is deferred to Phase C step 6.1 (identify-variants). That prompt generates `props.md` on-the-fly when it reads the source file for variant classification.

### Phase 3: Generate Build Order

After the children graph is extracted, read the full contents of `.claude/skills/react-to-figma-dom/1-find-hierarchy/5-prompt.generate-build-order.md`.

Launch via `runSubagent` (do NOT execute inline):

```typescript
const buildOrderPrompt = readFile('.claude/skills/react-to-figma-dom/1-find-hierarchy/5-prompt.generate-build-order.md')

runSubagent({
  description: "Generate build order and hierarchy diagram",
  prompt: `
    ${buildOrderPrompt}

    ## Context
    - Component analyses: .temp/react-to-figma-dom/components/*/analysis.md
    - Barrel map: .temp/react-to-figma-dom/component-hierarchy/barrel-map.md
    - Output directory: .temp/react-to-figma-dom/component-hierarchy/
  `
})
```

### Phase 4: Verify and Report

After Phase 3 completes, read and verify the outputs:

1. **`.temp/react-to-figma-dom/component-hierarchy/build-order.md`** — Confirm it exists and has at least Level 0
2. **`.temp/react-to-figma-dom/component-hierarchy/hierarchy.md`** — Confirm the Mermaid diagram is present

### Phase 5: Final Report

Return a summary to the parent:

```
Component hierarchy analysis complete.

Strategy: {strategy}
Phases:
- Phase 1 (Discovery): {project_count} project + {ui_count} UI library + {npm_count} npm = {total} components
  - From-files: {files_count} | From-app: {app_count} | Both: {both_count}
- Phase 2 (Analysis): {analyzed_count}/{total} analyzed successfully
- Phase 3 (Build Order): {level_count} levels, {leaf_count} leaf components

Warnings:
- Circular dependencies: {count or "none"}
- Orphan components: {count or "none"}
- Unresolved references: {count or "none"}

Output files:
- .temp/react-to-figma-dom/component-hierarchy/components-todo.md (discovery checklist)
- .temp/react-to-figma-dom/component-hierarchy/barrel-map.md (re-export map)
- .temp/react-to-figma-dom/component-hierarchy/children-graph.json (parent-child dependency graph)
- .temp/react-to-figma-dom/component-hierarchy/build-order.md (build order — leaves first)
- .temp/react-to-figma-dom/component-hierarchy/hierarchy.md (Mermaid diagram)
- .temp/react-to-figma-dom/components/{Name}/analysis.md (per-component children — from extract-children.js)
- .temp/react-to-figma-dom/components/{Name}/app-variants/ (live app variant captures — from-app only)
- .temp/react-to-figma-dom/pages/{RouteName}/screenshot-app.png (page screenshots — from-app only)
```
