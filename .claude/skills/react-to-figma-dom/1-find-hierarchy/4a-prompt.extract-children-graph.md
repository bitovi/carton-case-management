# Extract Children Graph

Run the `extract-children.js` script to build a fast parent-child dependency graph from static analysis. This replaces the slow per-component subagent loop with a single script execution (~1 second for 100+ components).

## Inputs

- **componentsTodo**: Path to `components-todo.json` (from step 1.3)
- **outputDirectory**: Pipeline output directory (e.g., `.temp/react-to-figma`)
- **sourceRoot**: Source root (e.g., `packages/client/src`) — used for context only; paths in components-todo.json are relative to project root

## Procedure

### 1. Verify prerequisites

Confirm these files exist:
- `{outputDirectory}/component-hierarchy/components-todo.json`

If missing, return `FAIL: components-todo.json not found`.

### 2. Run the extraction script

```bash
node {skillDir}/1-find-hierarchy/extract-children.js \
  --components-todo {outputDirectory}/component-hierarchy/components-todo.json \
  --output-dir {outputDirectory} \
  --source-root {sourceRoot}
```

### 3. Verify outputs

Confirm these were created:
- `{outputDirectory}/component-hierarchy/children-graph.json` — must exist and contain valid JSON with `componentCount > 0`
- At least one `{outputDirectory}/components/*/analysis.md` file

### 4. Report results

Read the script's stdout. It reports:
```
Components analyzed: N
Leaves: N
Errors: N
```

If `Errors > 0`, list the warnings from stdout. If error count is >20% of total, return `FAIL: too many unreadable files`.

Otherwise return `PASS`.

## Output

- `{outputDirectory}/component-hierarchy/children-graph.json` — Dependency graph with schema `react-to-figma-children-graph@1`
- `{outputDirectory}/components/{Name}/analysis.md` — Minimal per-component analysis (children only, no props)

## Notes

- This script uses static regex analysis, not AST parsing. It achieves ~92% accuracy vs LLM analysis for project-to-project edges.
- Missing edges are typically in render prop patterns (children rendered inside callbacks). These are always to leaf-level components and don't affect build ordering.
- Props extraction is deferred to Phase 6.1 (identify-variants) which already reads the source file.
