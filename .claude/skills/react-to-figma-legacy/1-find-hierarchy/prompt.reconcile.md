# Reconcile Component Discovery Results

Merge discovery results from the `from-files` (static analysis) and `from-app` (browser crawl) strategies into a single unified component list. The unified output preserves the best data from each source.

## Inputs

- **From-files output**: `.temp/react-to-figma/component-hierarchy/from-files/components-todo.md`
- **From-app output**: `.temp/react-to-figma/component-hierarchy/from-app/components-todo.md`
- **Component map JSON** (optional): `.temp/react-to-figma/component-hierarchy/component-map.json`
- **Source root**: The project source root path (for resolving unresolved file paths)

## Procedure

### 1. Parse both component lists

Read both `components-todo.md` files. For each, parse every `- [ ] Name | path | source-type | export-type` line into a structured list:

```typescript
interface DiscoveredComponent {
  name: string;
  path: string;
  sourceType: "project" | "ui-library" | "npm";
  exportType: "default" | "named";
  origin: "files" | "app" | "both";
}
```

### 2. Match components by name

Build a merged map keyed by PascalCase component name.

**Matching rules (in priority order):**

1. **Exact name match**: If both strategies found a component with the same PascalCase name, merge them:
   - **File path**: Prefer `from-files` path (more reliable — static analysis resolves actual source files)
   - **Source type**: Prefer `from-files` source type (it has better visibility into `ui/` directories and barrel re-exports)
   - **Export type**: Prefer `from-files` export type
   - **Origin**: Set to `both`

2. **From-files only**: Components found only by static analysis (e.g., conditionally rendered components never triggered during crawl, unused components, components behind feature flags)
   - Keep as-is with `origin: files`

3. **From-app only**: Components found only by browser crawl (e.g., runtime-generated components, components from lazy-loaded chunks that static analysis missed)
   - Keep as-is with `origin: app`
   - If `path` is `(runtime-only — no file found)`, attempt to resolve: search the source root for files containing `function {Name}` or `const {Name}` that return JSX. If found, update the path.

### 3. Merge barrel maps

Read `.temp/react-to-figma/component-hierarchy/from-files/barrel-map.md`. The from-app strategy does not produce a barrel map, so the from-files barrel map is used directly.

Write the merged barrel map to `.temp/react-to-figma/component-hierarchy/barrel-map.md` (copy from-files version).

If only from-app was run (no from-files barrel map exists), write the empty placeholder:

```markdown
# Barrel Re-export Map

Discovery method: app-crawl only (barrel map not available — re-run with strategy "both" or "files" for barrel resolution)
```

### 4. Merge runtime metadata

Read `.temp/react-to-figma/component-hierarchy/component-map.json` (if it exists, from the from-app strategy).

For every component that has runtime data in the JSON:
- Ensure `.temp/react-to-figma/components/{Name}/selector.md` exists (written by from-app discovery)
- Ensure `.temp/react-to-figma/components/{Name}/routes.md` exists (written by from-app discovery)

These files are additive — they don't conflict with `props.md` and `analysis.md` that will be written later by the analyze step.

### 5. Write unified components-todo.md

Write the merged result to `.temp/react-to-figma/component-hierarchy/components-todo.md`:

```markdown
# Components To Analyze

Total: {count}
Discovery method: reconciled (files + app)
From-files found: {filesCount}
From-app found: {appCount}
Both strategies: {bothCount}
Files-only: {filesOnlyCount}
App-only: {appOnlyCount}

## Project Components
- [ ] AppLayout | src/components/AppLayout/AppLayout.tsx | project | named | both
- [ ] CaseDetails | src/components/CaseDetails/CaseDetails.tsx | project | default | files
- [ ] LazyModal | src/components/LazyModal/LazyModal.tsx | project | named | app
...

## UI Library Components
- [ ] Button | src/components/ui/button.tsx | ui-library | named | both
...

## npm Components
- [ ] ChevronDown | lucide-react | npm | named | both
...

## Runtime-Only Components
- [ ] DynamicWidget | (runtime-only — no file found) | project | named | app
...
```

Each line: `- [ ] {Name} | {path or package} | {source type} | {export type} | {origin}`

The `origin` field is added as a 5th column to track provenance. Downstream steps can ignore it — it's informational.

Components whose file paths still could not be resolved after the search in step 2 go in the **Runtime-Only Components** section.

### 6. Return summary

Return to the parent orchestrator:

```
Reconciliation complete.
- Total unified components: {count}
- Found by both strategies: {bothCount}
- Found by files only: {filesOnlyCount}
- Found by app only: {appOnlyCount}
- Unresolved file paths: {unresolvedCount}
- Output: .temp/react-to-figma/component-hierarchy/components-todo.md
- Barrel map: .temp/react-to-figma/component-hierarchy/barrel-map.md
- Runtime metadata: .temp/react-to-figma/components/{Name}/selector.md, routes.md
```
