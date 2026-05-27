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
- **Output directory**: `.temp/react-to-figma/`
- **Strategy**: `"files"`, `"app"`, or `"both"` (default: `"both"`)
- **Dev server URL** (required when strategy includes `"app"`): e.g., `http://localhost:5173`

## Procedure

### Phase 1: Discover Components

The discovery phase runs one or both strategies based on the `strategy` input.

**When strategy is `"both"`**: Launch the from-files and from-app subagents in parallel (they have no dependencies on each other). Both `runSubagent` calls can be made simultaneously.

#### Strategy: `"files"` or `"both"` — Static file analysis

Read the full contents of `.claude/skills/react-to-figma/1-find-hierarchy/from-files/1-prompt.discover-components.md`.

Launch via `runSubagent` (do NOT execute inline):

```typescript
const discoverPrompt = readFile('.claude/skills/react-to-figma/1-find-hierarchy/from-files/1-prompt.discover-components.md')

runSubagent({
  description: "Discover components via static file analysis",
  prompt: `
    ${discoverPrompt}

    ## Context
    - Source root: ${sourceRoot}
    - Output directory: .temp/react-to-figma/

    ## Important
    Write outputs to strategy-specific paths:
    - Components: .temp/react-to-figma/component-hierarchy/from-files/components-todo.md
    - Barrel map: .temp/react-to-figma/component-hierarchy/from-files/barrel-map.md
  `
})
```

**If strategy is `"files"` only**: After the subagent completes, copy the outputs to the main location:
- Copy `from-files/components-todo.md` → `.temp/react-to-figma/component-hierarchy/components-todo.md`
- Copy `from-files/barrel-map.md` → `.temp/react-to-figma/component-hierarchy/barrel-map.md`

Then skip to Phase 2.

#### Strategy: `"app"` or `"both"` — Browser crawl

Read the full contents of `.claude/skills/react-to-figma/1-find-hierarchy/from-app/1-prompt.discover-components.md`.

Launch via `runSubagent` (do NOT execute inline):

```typescript
const discoverPrompt = readFile('.claude/skills/react-to-figma/1-find-hierarchy/from-app/1-prompt.discover-components.md')

runSubagent({
  description: "Discover components via app crawl",
  prompt: `
    ${discoverPrompt}

    ## Context
    - Dev server URL: ${devServerUrl}
    - Source root: ${sourceRoot}
    - Output directory: .temp/react-to-figma/

    ## Important
    Write outputs to strategy-specific paths:
    - Components: .temp/react-to-figma/component-hierarchy/from-app/components-todo.md
    - Barrel map: .temp/react-to-figma/component-hierarchy/from-app/barrel-map.md
    - Component map JSON: .temp/react-to-figma/component-hierarchy/component-map.json
    - Per-component selectors/routes: .temp/react-to-figma/components/{Name}/selector.md, routes.md

    ## Captures
    Pass --captures-dir .temp/react-to-figma to enable live app context captures.
    The script will capture viewport screenshots per route and element screenshots + HTML + computed CSS per component.
  `
})
```

**If strategy is `"app"` only**: After the subagent completes, copy the outputs to the main location:
- Copy `from-app/components-todo.md` → `.temp/react-to-figma/component-hierarchy/components-todo.md`
- Copy `from-app/barrel-map.md` → `.temp/react-to-figma/component-hierarchy/barrel-map.md`

Then skip to Phase 2.

#### Strategy: `"both"` — Reconcile

After both discovery subagents complete, read the full contents of `.claude/skills/react-to-figma/1-find-hierarchy/prompt.reconcile.md`.

Launch via `runSubagent` (do NOT execute inline):

```typescript
const reconcilePrompt = readFile('.claude/skills/react-to-figma/1-find-hierarchy/prompt.reconcile.md')

runSubagent({
  description: "Reconcile file and app discovery results",
  prompt: `
    ${reconcilePrompt}

    ## Context
    - Source root: ${sourceRoot}
    - From-files output: .temp/react-to-figma/component-hierarchy/from-files/components-todo.md
    - From-app output: .temp/react-to-figma/component-hierarchy/from-app/components-todo.md
    - Component map JSON: .temp/react-to-figma/component-hierarchy/component-map.json
    - Output directory: .temp/react-to-figma/component-hierarchy/
  `
})
```

After reconciliation, verify that `.temp/react-to-figma/component-hierarchy/components-todo.md` exists and contains at least one component.

### Phase 2: Analyze Each Component

Read the full contents of `.claude/skills/react-to-figma/1-find-hierarchy/2-prompt.analyze-component.md`. Store this — you will reuse it for every component.

Read `.temp/react-to-figma/component-hierarchy/barrel-map.md` and store it.

Read `.temp/react-to-figma/component-hierarchy/components-todo.md` and parse the component list.

**For each unchecked component** (`- [ ]` lines), launch via `runSubagent` (do NOT execute inline):

```typescript
const analyzePrompt = readFile('.claude/skills/react-to-figma/1-find-hierarchy/2-prompt.analyze-component.md')
const barrelMap = readFile('.temp/react-to-figma/component-hierarchy/barrel-map.md')

for (const component of uncheckedComponents) {
  runSubagent({
    description: `Analyze ${component.name}`,
    prompt: `
      ${analyzePrompt}

      ## Component To Analyze
      - **Component name**: ${component.name}
      - **File path**: ${component.filePath}
      - **Source type**: ${component.sourceType}
      - **Output directory**: .temp/react-to-figma/components/${component.name}/

      ## Barrel Map
      ${barrelMap}
    `
  })

  // After the subagent completes, mark the component as done in components-todo.md
  // Replace "- [ ] {component.name}" with "- [x] {component.name}" in the file
}
```

**Important**: Process components one at a time. After each subagent completes:
1. Update `components-todo.md` — change `- [ ] {Name}` to `- [x] {Name}` for the completed component
2. Verify that `analysis.md` and `props.md` were written to `.temp/react-to-figma/components/{Name}/`
3. Proceed to the next unchecked component

**Progress tracking**: After every 10 components, log progress: `"Analyzed {done}/{total} components..."`

### Phase 3: Generate Build Order

After ALL components are checked off in `components-todo.md`, read the full contents of `.claude/skills/react-to-figma/1-find-hierarchy/3-prompt.generate-build-order.md`.

Launch via `runSubagent` (do NOT execute inline):

```typescript
const buildOrderPrompt = readFile('.claude/skills/react-to-figma/1-find-hierarchy/3-prompt.generate-build-order.md')

runSubagent({
  description: "Generate build order and hierarchy diagram",
  prompt: `
    ${buildOrderPrompt}

    ## Context
    - Component analyses: .temp/react-to-figma/components/*/analysis.md
    - Barrel map: .temp/react-to-figma/component-hierarchy/barrel-map.md
    - Output directory: .temp/react-to-figma/component-hierarchy/
  `
})
```

### Phase 4: Verify and Report

After Phase 3 completes, read and verify the outputs:

1. **`.temp/react-to-figma/component-hierarchy/build-order.md`** — Confirm it exists and has at least Level 0
2. **`.temp/react-to-figma/component-hierarchy/hierarchy.md`** — Confirm the Mermaid diagram is present

### Phase 5: Generate Pages Manifest

**Only when strategy includes `"app"`** (requires `pages.json` from the browser crawl).

Check if `.temp/react-to-figma/component-hierarchy/pages.md` already exists — if so, skip this phase.

Check if `.temp/react-to-figma/component-hierarchy/pages.json` exists — if not, skip this phase (means `from-app` was not used or produced no page trees).

Read the full contents of `.claude/skills/react-to-figma/1-find-hierarchy/4-prompt.generate-pages-manifest.md`.

Launch via `runSubagent` (do NOT execute inline):

```typescript
const pagesPrompt = readFile('.claude/skills/react-to-figma/1-find-hierarchy/4-prompt.generate-pages-manifest.md')

runSubagent({
  description: "Generate pages manifest from runtime page trees",
  prompt: `
    ${pagesPrompt}

    ## Context
    - Pages JSON: .temp/react-to-figma/component-hierarchy/pages.json
    - Component analyses: .temp/react-to-figma/components/*/analysis.md
    - Output: .temp/react-to-figma/component-hierarchy/pages.md
  `
})
```

**Verify**: `pages.md` exists and contains at least one route heading (`## /`).

### Phase 6: Final Report

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
- .temp/react-to-figma/component-hierarchy/components-todo.md (discovery checklist)
- .temp/react-to-figma/component-hierarchy/barrel-map.md (re-export map)
- .temp/react-to-figma/component-hierarchy/build-order.md (build order — leaves first)
- .temp/react-to-figma/component-hierarchy/hierarchy.md (Mermaid diagram)
- .temp/react-to-figma/components/{Name}/analysis.md (per-component analysis)
- .temp/react-to-figma/components/{Name}/props.md (per-component props)
- .temp/react-to-figma/components/{Name}/selector.md (CSS selector — from-app only)
- .temp/react-to-figma/components/{Name}/routes.md (routes — from-app only)
- .temp/react-to-figma/components/{Name}/app-context/ (live app captures — from-app only)
- .temp/react-to-figma/pages/{RouteName}/screenshot-app.png (page screenshots — from-app only)
```
