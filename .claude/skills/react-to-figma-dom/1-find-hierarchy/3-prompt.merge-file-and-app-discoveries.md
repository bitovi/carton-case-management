# Reconcile and Filter Component Discovery Results

Merge discovery results from the `from-files` (static analysis) and `from-app` (browser crawl) strategies into a single unified component list, then filter out components that should not be built in Figma.

## Step 1: Run the merge script

```bash
node {skillDir}/1-find-hierarchy/merge-discoveries.js \
  --from-files {outputDirectory}/from-files/components.json \
  --from-app   {outputDirectory}/from-app/components.json \
  --output-dir {outputDirectory} \
  --source-root {sourceRoot}
```

This produces `components-todo-raw.md` — the unfiltered, reconciled component list.

## Step 2: Classify every component

⚠️ **THIS IS A REASONING TASK, NOT A CODING TASK.**
Do NOT write a script (Python, Node, bash, etc.) to perform the classification or filtering.
Read the file, think about each component, and write the output files directly using file-writing tools.

Read `{outputDirectory}/components-todo-raw.md`.

For each component line (`- [ ] Name | path | sourceType | exportType | origin`), assign exactly ONE classification tag. Think: "what IS this component?"

### Classification tags

#### KEEP tags — components that should be built in Figma

| Tag | What it means | How to recognize |
|-----|---------------|------------------|
| `app-component` | The app's own visual component | `sourceType = project` AND the component renders visual UI (not a provider, portal, router, or icon re-export) |
| `ui-wrapper` | Project's styled wrapper around a primitive (e.g., Shadcn components in `components/ui/`) | `sourceType = ui-library` |
| `visual-widget` | An npm component that renders its own complete, meaningful UI — not a primitive or wrapper | Self-contained visual output, content-oriented props (layout, data display). Examples: date pickers, rich text editors, data grids, calendar widgets |

#### FILTER tags — components that should NOT be built in Figma

| Tag | What it means | How to recognize |
|-----|---------------|------------------|
| `dotted-primitive` | Namespace-imported sub-component from a headless library | Name contains `.` (e.g., `AccordionPrimitive.Root`, `Primitive.div`, `SelectPrimitive.Content`) |
| `icon` | Icon from an icon library | The component is a single SVG icon. Recognize by: the path references an icon package (lucide-react, react-icons, heroicons, etc.), OR the name matches a well-known icon name (e.g., `ChevronDown`, `EllipsisVertical`, `Trash`, `Star`). **Apply even when `sourceType = project`** — discovery sometimes attributes icons to the file that imports them. Icons are handled separately by the extract-assets step. |
| `provider-context` | React context plumbing — manages state, no visual output | Name ends with `Provider`, `Context`, or `Consumer`. **Apply even when `sourceType = project`** — e.g., `TrpcProvider`, `TooltipProvider`, `CollapsibleProvider` are wrappers with no visual output. |
| `portal` | Renders children into a DOM portal — no visual structure of its own | Name contains `Portal` (e.g., `AlertDialogPortal`, `PopoverPortal`, `SelectPortal`, `DialogPortal`). **Apply even when `sourceType = project`.** |
| `collection-slot` | Internal composition utility from a component library | Name contains `Collection`, `Slot`, or `SlotClone` |
| `positioning` | Internal positioning/portal utility | Name starts with `Popper` |
| `router` | Framework routing plumbing | The component is a router primitive: `Router`, `BrowserRouter`, `Route`, `Routes`, `RenderedRoute`, `Outlet`, `Navigate`, or `Link` (from react-router). **Apply even when `sourceType = project`** — discovery sometimes attributes these to the file that imports them. Exception: if the project has its OWN component named `Link` that wraps the router's `Link` with custom styling, keep it as `app-component`. |
| `devtool` | Development tool, not part of production UI | Clearly a dev tool (e.g., devtools, debug panels) |
| `wrapped-duplicate` | npm primitive already wrapped by a project or ui-library component | An npm component whose base concept name matches a kept component (e.g., npm `AccordionPrimitive.*` is wrapped by ui-library `Accordion`) |
| `unresolved` | No source file found by either discovery strategy | Path is `(runtime-only — no file found)` AND no other FILTER tag applies |

### How to classify

**Important:** `sourceType` is not always reliable. The discovery step attributes components to the file that *imports* them, so npm icons, router components, and providers can appear as `sourceType = project`. Always check the component's **name** and **purpose** — don't blindly trust `sourceType`.

1. First, check if a FILTER tag applies based on the component's name — regardless of `sourceType`:
   - Name contains `.` → `dotted-primitive`
   - Name matches a known icon → `icon`
   - Name ends with `Provider`, `Context`, or `Consumer` → `provider-context`
   - Name contains `Portal` → `portal`
   - Name contains `Collection`, `Slot`, or `SlotClone` → `collection-slot`
   - Name starts with `Popper` → `positioning`
   - Name matches router primitives → `router`
2. If no FILTER tag matched:
   - `sourceType = project` → `app-component`
   - `sourceType = ui-library` → `ui-wrapper`
   - `sourceType = npm` → check if it's a `visual-widget` (KEEP) or `wrapped-duplicate` / `devtool` (FILTER)
4. If an npm component doesn't match any FILTER tag, ask: "Does this render its own complete UI?" If yes → `visual-widget` (KEEP). If no or unsure → pick the closest FILTER tag or use `wrapped-duplicate`

When in doubt about an npm component, **filter it out** — it's better to miss one that can be added back than to waste pipeline time on framework internals.

### Write the classified list

Write to `{outputDirectory}/components-classified.md`:

```markdown
# Component Classification

Total: {count}

| Name | Path | sourceType | Tag | Keep? |
|------|------|------------|-----|-------|
| Badge | src/components/ui/Badge.tsx | ui-library | ui-wrapper | ✅ |
| AccordionPrimitive.Root | @radix-ui/react-accordion | npm | dotted-primitive | ❌ |
| ... | ... | ... | ... | ... |
```

## Step 2b: Split into kept and filtered lists

Read `{outputDirectory}/components-classified.md`. Every component tagged with a KEEP tag (`app-component`, `ui-wrapper`, `visual-widget`) goes into the kept list. Everything else goes into the filtered list.

## Step 3: Write output files

⚠️ **Use file-writing tools (create_file / write) to produce these files directly.**
Do NOT generate scripts to write them. You have all the information from Step 2 — just write the markdown.

### `components-todo.md` — the kept list

Write to `{outputDirectory}/components-todo.md` using the same format as the raw file but containing only components with KEEP tags (`app-component`, `ui-wrapper`, `visual-widget`). Update the `Total:` count in the header. Keep the same section grouping (Project Components, UI Library Components, npm Components).

### `components-filtered-out.md` — the audit trail

Write to `{outputDirectory}/components-filtered-out.md` listing every filtered component grouped by tag:

```markdown
# Filtered Components

Filtered {N} of {raw_total} components ({kept} kept).

## icon ({count})
- ComponentName | package-name | tag: icon

## dotted-primitive ({count})
- AccordionPrimitive.Root | @radix-ui/react-accordion | tag: dotted-primitive

## unresolved ({count})
- SomeProvider | (runtime-only — no file found) | tag: unresolved

## provider-context ({count})
...

## Other ({count})
...
```

### Copy barrel-map.md

Copy `barrel-map.md` from the from-files directory to the output directory (the merge script already does this).

## Verify

Confirm:
1. `components-todo.md` exists and has fewer components than `components-todo-raw.md`
2. `components-filtered-out.md` exists and accounts for the difference
3. No project or ui-library components were filtered out
4. The sum of kept + filtered equals the raw total

## Return

Report:
```
Merge and filter complete.
- Raw total: {raw_total}
- Kept: {kept} (project: {p}, ui-library: {u}, npm: {n})
- Filtered out: {filtered} (see components-filtered-out.md)
```
