---
name: figma-from-code-precapture
description: Capture app screenshots and text content for all UI components from the running dev server. Each subagent receives a group manifest and runs screenshot.js and extract-text.js in batch mode. This is Phase 2.5 of figma-from-code.
---

# Skill: Pre-capture Reference Material

Captures app screenshots and structured text content for every UI component before any Figma building begins. Decoupling capture from building means build agents never launch Chromium. Grouping by URL (not tier) minimizes page navigations within each agent.

## When to Use

- Before `figma-from-code` Phase 3 (component builds need app screenshots as reference)
- To refresh app screenshots after UI changes without re-running the full pipeline
- Standalone capture of component screenshots for design review

## Prerequisites

- Dev server running at `http://localhost:5173`
- Playwright installed (`node_modules/playwright-core`)
- Shared Playwright server running (started by orchestrator before dispatching):
  ```bash
  node .claude/skills/figma-from-code-validator/browser-server.js &
  ```
  Endpoint is written to `.temp/figma-from-code/pw-endpoint.txt` and auto-detected by scripts. If not running, scripts fall back to launching their own browser.

## Agent Groups

Each subagent captures a group of components that share the same route(s), minimizing navigation.

| Agent                  | URL(s)        | Components                                                                                                                                                                                                                                                                                                                                                                 |
| ---------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `precapture-forms`     | `/cases/new`  | Button (primary + secondary), Input, Textarea, Label, Select                                                                                                                                                                                                                                                                                                               |
| `precapture-cases`     | `/cases/`     | Header, MenuList, CaseList, CaseDetails, CaseInformation, CaseEssentialDetails, CaseComments, EditableTitle, EditableSelect, EditableTextarea, EditControls, MoreOptionsMenu, ConfirmationDialog, FiltersTrigger, FiltersDialog, FiltersList, MultiSelect, VoteButton, ReactionStatistics, VoterTooltip, RelationshipManagerDialog, RelationshipManagerList, CheckboxGroup |
| `precapture-customers` | `/customers/` | CustomerList, CustomerDetails, CustomerInformation, RelationshipManagerAccordion, RelatedCasesAccordion, EditableText                                                                                                                                                                                                                                                      |
| `precapture-users`     | `/users/`     | UserList, UserDetails, UserInformation                                                                                                                                                                                                                                                                                                                                     |
| `precapture-screens`   | all 6 routes  | Full-page screenshots at 1440x900 for Phase 4                                                                                                                                                                                                                                                                                                                              |

### Components with no app selector (skip entirely)

Skeleton, Alert, HoverCard, Tooltip, Calendar, Checkbox, Badge, Card, Dialog, Sheet, AlertDialog, Popover, RichCheckboxGroup, BaseEditable, EditableDate, EditableCurrency, EditableNumber, EditablePercent.

## Manifest Format

The orchestrator constructs a manifest of components for each agent. The manifest is a JSON array where each entry has: `name`, `url`, `selector`, `click` (optional), `hover` (optional), `nth` (optional).

Build the manifest by reading the **Component App Map** in the `figma-from-code-validator` skill.

Write two manifest files per agent group before dispatching:

- `.temp/figma-from-code/manifests/{group}-screenshots.json` — screenshot entries
- `.temp/figma-from-code/manifests/{group}-text.json` — text extraction entries

### Screenshot manifest entry format

```json
{"url": "http://localhost:5173{url}", "output": ".temp/figma-from-code/screenshots/{name}/app.png", "selector": "{selector}", "click": "{click}", "hover": "{hover}", "nth": 0}
```

### Text manifest entry format

```json
{"url": "http://localhost:5173{url}", "output": ".temp/figma-from-code/screenshots/{name}/text.json", "selector": "{selector}", "click": "{click}", "nth": 0}
```

### Screen manifest entries (no selector — full page)

```json
[
  {"url": "http://localhost:5173/cases/", "output": ".temp/figma-from-code/screenshots/screens/CasesPage/app.png"},
  {"url": "http://localhost:5173/customers/", "output": ".temp/figma-from-code/screenshots/screens/CustomersPage/app.png"},
  {"url": "http://localhost:5173/users/", "output": ".temp/figma-from-code/screenshots/screens/UsersPage/app.png"},
  {"url": "http://localhost:5173/cases/new", "output": ".temp/figma-from-code/screenshots/screens/CreateCasePage/app.png"},
  {"url": "http://localhost:5173/customers/new", "output": ".temp/figma-from-code/screenshots/screens/CreateCustomerPage/app.png"},
  {"url": "http://localhost:5173/users/new", "output": ".temp/figma-from-code/screenshots/screens/CreateUserPage/app.png"}
]
```

## Subagent Prompt Template

**Model: `haiku`** — dispatch all 5 pre-capture agents with `model: "haiku"`.

```
Capture app screenshots and text content for UI components from a running dev server.

Scripts (already exist, do not modify):
  Screenshot: node .claude/skills/figma-from-code-validator/screenshot.js
  Text:       node .claude/skills/figma-from-code-validator/extract-text.js

Both scripts support batch mode for faster execution (one browser, many captures):

1. Capture all screenshots in one batch:
   node .claude/skills/figma-from-code-validator/screenshot.js \
     --batch .temp/figma-from-code/manifests/{group}-screenshots.json

2. Extract all text content in one batch:
   node .claude/skills/figma-from-code-validator/extract-text.js \
     --batch .temp/figma-from-code/manifests/{group}-text.json

After both batches complete, write results to:
.temp/figma-from-code/precapture-{group}.json

Use this format:
{"group": "{group}", "captured": [{"name": "...", "app": "...", "text": "..."}], "skipped": [...], "failed": [{"name": "...", "error": "..."}]}
```

## Output Files

Written to `.temp/figma-from-code/`:

| File | Contents |
|------|----------|
| `precapture-forms.json` | Results for form components |
| `precapture-cases.json` | Results for case page components |
| `precapture-customers.json` | Results for customer page components |
| `precapture-users.json` | Results for user page components |
| `precapture-screens.json` | Results for full-page screenshots |

### Output format

```json
{
  "group": "forms",
  "captured": [
    {"name": "Button", "app": ".temp/.../Button/app.png", "text": ".temp/.../Button/text.json"}
  ],
  "skipped": ["Skeleton"],
  "failed": [{"name": "Calendar", "error": "selector not found"}]
}
```

## Scripts Reference

| Script | Location | Purpose |
|--------|----------|---------|
| `screenshot.js` | `.claude/skills/figma-from-code-validator/screenshot.js` | Playwright element/page screenshots, supports `--batch` |
| `extract-text.js` | `.claude/skills/figma-from-code-validator/extract-text.js` | Structured text extraction by role, supports `--batch` |
| `browser-server.js` | `.claude/skills/figma-from-code-validator/browser-server.js` | Shared Playwright WebSocket server |

Do NOT modify these scripts.

## Skip / Resume

If called with `resume: true`, check whether all 5 `precapture-{group}.json` files exist. If all present, skip. If some are missing, re-run only the missing groups.

## Error Handling

| Scenario | Action |
|----------|--------|
| Dev server not running | Halt, tell user to run `npm run dev` |
| Screenshot script fails for one component | Log in `failed` array, continue with remaining components |
| Entire batch fails | Report error, offer retry for that group |
| Missing selectors | Component goes in `skipped` array, non-fatal |
