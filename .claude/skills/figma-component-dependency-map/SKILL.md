---
name: figma-component-dependency-map
description: Analyze the React codebase to produce a component dependency graph and ordered build list. Identifies atomic components (no other custom component deps) vs composed components. This is step 2 of the code-to-Figma workflow.
---

# Skill: Component Dependency Map

This skill scans the React codebase and produces a dependency graph showing which components depend on which. The output is an ordered list suitable for building Figma components bottom-up (atoms first, composed components after).

## When to Use

- Before building components in Figma to understand build order
- When you need to identify the "atomic" base components
- When onboarding to a new codebase to understand component architecture

## What This Skill Produces

1. **Dependency map** — which components import which custom components
2. **Build order** — topologically sorted list (atoms first)
3. **Component catalog** — one-line description of each component's purpose
4. **Output file** — `.temp/figma-from-code/component-map.md`

## Prerequisites

- Access to `packages/client/src/components/` directory
- Access to `packages/client/src/pages/` directory

## Workflow

```
┌──────────────────────────────────────────────────────────────┐
│ 1. SCAN — Find all .tsx component files (not tests/stories)  │
├──────────────────────────────────────────────────────────────┤
│ 2. PARSE — Extract imports that reference @/components       │
├──────────────────────────────────────────────────────────────┤
│ 3. MAP — Build adjacency list (component → deps)             │
├──────────────────────────────────────────────────────────────┤
│ 4. SORT — Topological sort to get build order                │
├──────────────────────────────────────────────────────────────┤
│ 5. CATALOG — Read each component to write one-line summary   │
├──────────────────────────────────────────────────────────────┤
│ 6. WRITE — Save component-map.md                             │
└──────────────────────────────────────────────────────────────┘
```

## Step-by-Step Instructions

### Step 1: Scan Component Files

Find all `.tsx` files that are NOT tests or stories:
```bash
find packages/client/src/components -name "*.tsx" | grep -v ".test.\|.stories."
find packages/client/src/pages -name "*.tsx" | grep -v ".test.\|.stories."
```

### Step 2: Parse Imports

For each file, read the imports and identify which import from:
- `@/components/...` — custom components
- `../` or `./` — relative component imports within the components directory
- `packages/client/src/components/ui/` — shadcn UI components
- `packages/client/src/components/obra/` — obra design system components

Ignore imports from:
- `react`, `react-router-dom` — framework
- `lucide-react` — icons (note which icons are used)
- `@tanstack/react-query`, `trpc` — data fetching
- `zod` — validation

### Step 3: Build the Dependency Map

Create a map:
```
ComponentName:
  file: relative/path/to/Component.tsx
  imports: [ComponentA, ComponentB, ...]  // only custom components
  imported_by: [ComponentX, ComponentY, ...]
  tier: atomic | composed | page
  icons: [IconName, ...]  // from lucide-react
```

**Tier classification:**
- `atomic` — imports no other custom components (or only UI primitives from obra/ui/)
- `composed` — imports other composed or atomic custom components
- `page` — lives in `/pages/` directory

### Step 4: Topological Sort

Build order:
1. All atomic components (no custom deps)
2. Composed components, sorted by depth (shallowest deps first)
3. Pages last

### Step 5: Write Component Catalog

For each component, read the first 30 lines to understand its purpose. Write a one-line summary.

### Step 6: Save Output

Create `.temp/figma-from-code/component-map.md`:

```markdown
# Carton Component Map

Generated: {date}

## Build Order for Figma

### Tier 1: Atomic Components (Build First)

| Component | Path | Description | Icons Used |
|-----------|------|-------------|-----------|
| Button | obra/Button | Primary action button with variants | - |
| Input | obra/Input | Text input with label and error states | - |
| Badge | obra/Badge | Status badge with color variants | - |
| ... | | | |

### Tier 2: Composed Components

| Component | Path | Description | Dependencies |
|-----------|------|-------------|-------------|
| FiltersTrigger | common/FiltersTrigger | Button that opens filters dialog | Button, Badge |
| VoteButton | common/VoteButton | Upvote/downvote with count | Button, Tooltip |
| ... | | | |

### Tier 3: Feature Components

| Component | Path | Description | Dependencies |
|-----------|------|-------------|-------------|
| CaseList | CaseList | Scrollable list of case cards | ... |
| CaseDetails | CaseDetails | Full case detail view | ... |
| ... | | | |

### Tier 4: Pages

| Page | Path | Description | Key Components |
|------|------|-------------|---------------|
| CasePage | pages/CasePage | Cases list + detail split view | CaseList, CaseDetails |
| ... | | | |

## Full Dependency Graph

{component}: depends on {deps}
...
```

## Output

Report the summary counts:
```
✅ Component map complete:
  - Atomic components: X
  - Composed components: Y  
  - Pages: Z
  - Full map saved to: .temp/figma-from-code/component-map.md
```
