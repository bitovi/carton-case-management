---
name: figma-rebuild-from-code
description: Orchestrates the full code-to-Figma rebuild workflow for Carton. Runs all four phases in order (tokens → file structure → components → screens), tracks state so it can resume after interruption, and delegates each phase to the right skill.
---

# Skill: Rebuild Figma from Code (Orchestrator)

Conducts the full code→Figma pipeline for Carton. This skill does no direct work itself — it loads the correct skill for each phase, passes context between them, and maintains a state ledger so work can resume if interrupted.

## When to Use

- Starting a fresh Figma rebuild from the Carton codebase
- Resuming a partially completed build after a session break
- After significant code changes that require the Figma file to be re-synced

## Required Inputs

- `fileKey`: The Figma file key (e.g. `4YHC1sRdi2MxDgwcxn2O69`)
- `resume` (optional): `true` to resume from last completed phase instead of starting over

## State Ledger

Write state to `.temp/figma-from-code/state.json` after every phase so the build can resume:

```json
{
  "fileKey": "4YHC1sRdi2MxDgwcxn2O69",
  "startedAt": "2026-05-04T00:00:00Z",
  "phases": {
    "phase0": "complete",
    "phase1": "complete",
    "phase2": "complete",
    "phase3": "in_progress",
    "phase4": "pending"
  },
  "phase3Progress": {
    "completed": ["Button", "Badge", "Input", "Skeleton"],
    "remaining": ["Checkbox", "Select", "..."]
  },
  "figmaNodes": {
    "foundationsPageId": "0:1",
    "componentsPageId": "2:2",
    "screensPageId": "2:3"
  }
}
```

Read this file at the start of every turn. If it exists and `resume: true`, skip completed phases.

## Workflow

```
Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4
  ↓           ↓          ↓         ↓          ↓
Discover   Tokens    File      Components  Screens
& plan    (vars)   Structure  (per tier)  (pages)
```

---

### Phase 0: Discovery

**Goal:** Understand the current state of the Figma file and codebase before writing anything.

Steps:
1. Read `figma-component-dependency-map` skill — the build order is pre-computed, no need to re-derive it
2. Run a read-only `use_figma` to inspect the file:
   - List all pages (names + IDs)
   - Check if variable collections already exist (`Palette`, `Semantic`, `Spacing`)
   - Check if any components already exist on the Components page
3. Report what exists vs what needs to be created
4. Write initial state to `.temp/figma-from-code/state.json`

**Skip if:** `resume: true` and `phase0: complete` in state file.

---

### Phase 1: Tokens

**Goal:** Create all variable collections.

**Delegate to:** `figma-setup-variables` skill

Key context to pass:
- File key
- Which collections already exist (skip those)

**Skip if:** `phase1: complete` in state file AND all three collections verified to exist in Figma.

After completion:
- Verify collections exist via `use_figma`
- Update state: `"phase1": "complete"`
- **Checkpoint:** report variable counts (Palette: 89, Semantic: 50, Spacing: 19)

---

### Phase 2: File Structure

**Goal:** Create page skeleton and foundations documentation.

**Delegate to:** `figma-setup-file-structure` skill

Key context to pass:
- File key
- Which pages already exist (skip those)

**Skip if:** `phase2: complete` in state file AND all three pages verified to exist.

After completion:
- Screenshot the Foundations page
- Update state: `"phase2": "complete"`, save page IDs to `figmaNodes`
- **Checkpoint:** show screenshot of foundations page

---

### Phase 3: Components

**Goal:** Build all Figma components in dependency order.

**Delegate to:** `figma:figma-generate-library` (load both `figma:figma-generate-library` AND `figma:figma-use`)

**Build order** (from `figma-component-dependency-map`):

#### Tier 1a — obra primitives (no custom deps)
Button, Input, Badge, Textarea, Label, Skeleton, Checkbox, Select, AlertDialog, HoverCard, Calendar, Card, Alert, Sheet, Dialog, AccordionContent, AccordionTrigger, PopoverHeader, TooltipContent, TooltipProvider, TooltipTrigger

#### Tier 1b — obra composites (depend only on other obra)
Accordion, Popover, DialogHeader, CheckboxGroup, RichCheckboxGroup, Tooltip

#### Tier 2 — common + inline-edit
BaseEditable, EditControls, EditableSelect, EditableText, EditableCurrency, EditableNumber, EditablePercent, EditableTextarea, EditableTitle, EditableDate, FiltersTrigger, VoterTooltip, RelationshipManagerList, MoreOptionsMenu, MultiSelect, ConfirmationDialog, RelationshipManagerAccordion, FiltersList, VoteButton, RelationshipManagerDialog, FiltersDialog, ReactionStatistics, RelatedCasesAccordion

#### Tier 3 — feature components
Header, MenuList, CaseList, CustomerList, UserList, CaseComments, CaseEssentialDetails, CaseInformation, CaseDetails, CustomerInformation, CustomerDetails, UserInformation, UserDetails

**Per-component process** (for each component, in order):
1. Read the component's `.tsx` source file
2. Read its `.stories.tsx` to understand variants
3. Tell `figma:figma-generate-library` to build this one component
4. Validate: `get_screenshot` of the resulting component set
5. Update state: add component name to `phase3Progress.completed`
6. Move to next component

**Resuming Phase 3:** Read `phase3Progress.completed` from state, skip those, start from the first remaining.

After all Tier 3 components complete:
- Update state: `"phase3": "complete"`
- **Checkpoint:** screenshot of the Components page overview

---

### Phase 4: Screens

**Goal:** Assemble full-page screens from components.

**Delegate to:** `figma:figma-generate-design` (load both `figma:figma-generate-design` AND `figma:figma-use`)

**Screens to build** (in order):

| Screen | Route | Key Components |
|--------|-------|---------------|
| Cases Page | `/cases/:id` | Header + MenuList + CaseList + CaseDetails |
| Customers Page | `/customers/:id` | Header + MenuList + CustomerList + CustomerDetails |
| Users Page | `/users/:id` | Header + MenuList + UserList + UserDetails |
| Create Case Page | `/cases/new` | Header + MenuList + CreateCasePage form |
| Create Customer Page | `/customers/new` | Header + MenuList + CreateCustomerPage form |
| Create User Page | `/users/new` | Header + MenuList + CreateUserPage form |

**Per-screen process:**
1. Read the page's `.tsx` source to understand layout
2. Tell `figma:figma-generate-design` to assemble this screen at 1440×900
3. Screenshot the result
4. Save screenshot to `.temp/figma-from-code/screenshots/screens/{ScreenName}.png`

After all screens complete:
- Update state: `"phase4": "complete"`
- **Final checkpoint:** screenshot each screen, present summary

---

## Checkpoint Protocol

At the end of each phase, stop and report:
- What was created (counts, node IDs)
- A screenshot
- What comes next

Wait for user confirmation before starting the next phase. Do not auto-proceed across phase boundaries.

Example checkpoint message:
```
✅ Phase 1 complete — 158 variables created across 3 collections
   Palette: 89 color variables
   Semantic: 50 color variables  
   Spacing: 19 number variables

Ready for Phase 2 (file structure). Proceed?
```

## Resuming After Interruption

1. Check if `.temp/figma-from-code/state.json` exists
2. If yes, read it and report current progress
3. Ask user to confirm resume point
4. Skip all completed phases
5. For Phase 3 in-progress: start from the first component not in `phase3Progress.completed`

## Error Handling

If any `use_figma` call fails:
- Do NOT retry immediately
- Read the error, diagnose the cause
- Fix the script
- Then retry once
- If it fails again, pause and report to the user before continuing

Never skip a failed component — log it to `.temp/figma-from-code/errors.md` and ask the user whether to skip or retry.
