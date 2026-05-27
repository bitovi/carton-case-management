# Generate Pages Manifest

Convert the machine-readable `pages.json` (per-route resolved component trees with props) into a human-readable `pages.md` manifest that documents every page in the application.

## Inputs

- **`pages.json`**: `.temp/react-to-figma/component-hierarchy/pages.json` — per-route component trees with resolved props from the fiber walk
- **Component analyses** (optional): `.temp/react-to-figma/components/*/analysis.md` — used to identify which conditional branches were *not* taken at each route

## Output

- **`pages.md`**: `.temp/react-to-figma/component-hierarchy/pages.md`

## Procedure

1. **Read `pages.json`** and parse its contents.

2. **For each page entry** in `pages.pages` (keyed by route):

   a. Write a `## {route}` heading.

   b. Walk the `tree` recursively, writing each component as an indented bullet:
      - Format: `- {ComponentName}` followed by key props inline
      - Only show props that carry meaningful values — skip `[Function]`, `[ReactElement]`, `[Ref]`, `[Symbol]`, empty objects `{}`
      - For string/number/boolean props: show inline as `— propName="value"` or `— propName={123}`
      - For object props with 1-3 keys: show inline as `— propName={key1: "v1", key2: "v2"}`
      - For larger objects: show as `— propName={...}` (truncated)
      - Indent children by 2 spaces per level

   c. Mark **layout components** (from `pages.json.layoutComponents`) with `(layout)` after the name.

   d. Mark the **first non-layout component** at the top level as `(page)` — this is the route-specific wrapper.

3. **Write a summary section** at the top of the file:
   ```markdown
   # Pages Manifest

   Generated from runtime fiber tree analysis of {routeCount} routes.

   **Layout components** (present on every route): {layoutComponents list}

   **Routes:**
   - {route1} — {top-level page component name}
   - {route2} — {top-level page component name}
   ...

   ---
   ```

4. **If component analyses exist**, add a `### Conditional branches not taken` note under each route listing which children from `analysis.md` did NOT appear in the runtime tree (indicating a conditional branch that was inactive at this route). This helps identify what the page *could* show vs what it *does* show.

## Example Output

```markdown
# Pages Manifest

Generated from runtime fiber tree analysis of 12 routes.

**Layout components** (present on every route): Header, MenuList

**Routes:**
- / — CasePage
- /cases/ — CasePage
- /cases/1 — CasePage
- /cases/new — CasePage
- /tasks/ — TaskPage
...

---

## /

- Header (layout)
- MenuList (layout) — activeItem="cases"
- CasePage (page)
  - CaseList — selectedId=null

## /cases/1

- Header (layout)
- MenuList (layout) — activeItem="cases"
- CasePage (page)
  - CaseList — selectedId="1"
  - CaseDetails — caseId="1"
    - CaseStatusBadge — status="open"
    - EditableField — field="title", value="Smith v. Jones"
    - EditableField — field="description", value="Contract dispute..."

### Conditional branches not taken
- CreateCasePage (from CasePage analysis — renders when id === "new")

## /cases/new

- Header (layout)
- MenuList (layout) — activeItem="cases"
- CasePage (page)
  - CreateCasePage
    - CaseForm — mode="create"

### Conditional branches not taken
- CaseList (from CasePage analysis — renders when no id or desktop layout)
- CaseDetails (from CasePage analysis — renders when id is present and not "new")
```

## Idempotency

If `pages.md` already exists at the output path, skip this step entirely.
