---
name: figma-from-code-discovery-components
description: Discover runtime component hierarchy and tiered build order by crawling the live dev server with Playwright. Produces component-map.json and component-map.md. Also inspects the Figma file to report what exists vs what needs to be created. This is Phase 0a of figma-from-code.
---

# Skill: Component Discovery

Discovers the runtime component architecture of a running web application and produces a topologically-sorted build order (leaves first, layouts last). Also inspects the target Figma file to report existing pages, variable collections, and components.

## When to Use

- Before running `figma-from-code` on a fresh Figma file
- When the component hierarchy may have changed and you need an updated build order
- Standalone audit of what components a site uses and how they nest
- When resuming a build and `component-map.json` is missing

## Prerequisites

- Dev server running at `http://localhost:5173` (or custom URL)
- Playwright installed (`node_modules/playwright-core`)

## Required Inputs

- `fileKey`: The Figma file key (for the Figma inspection step)
- `devServerUrl` (optional, default `http://localhost:5173`): The running dev server URL

## Output Files

Written to `.temp/figma-from-code/`:

| File | Contents |
|------|----------|
| `component-map.json` | Authoritative tiered build order (machine-readable) |
| `component-map.md` | Human-readable report with Mermaid diagram |

## Workflow

### 1. Ensure output directory exists

```bash
mkdir -p .temp/figma-from-code/
```

### 2. Verify dev server is running

```bash
curl -s --max-time 3 http://localhost:5173 > /dev/null || echo "Dev server not running"
```

If not running, halt and tell the user to run `npm run dev`.

### 3. Run the component discovery script

```bash
node .claude/skills/figma-from-code-validator/map-components.js \
  "http://localhost:5173" --crawl --max-crawl 30 \
  --markdown .temp/figma-from-code/component-map.md \
  --output .temp/figma-from-code/component-map.json
```

This produces the **authoritative build order** — a topologically-sorted list of tiers where leaves come first and layouts come last. All subsequent phases of `figma-from-code` use this output, not the static `figma-component-dependency-map`.

### 4. Read and summarize the output

Read `.temp/figma-from-code/component-map.json` and extract:

- `tiers[]` — the tiered build order (number of tiers varies per project)
- `tree` — the merged component hierarchy
- `componentCount` — total components to build

### 5. Inspect the Figma file (read-only)

Run a read-only `use_figma` to inspect the Figma file:

- List all pages (names + IDs)
- Check if variable collections already exist (`Palette`, `Semantic`, `Spacing`)
- Check if any components already exist on the Components page

### 6. Report

Report what exists in Figma vs what needs to be created, including the discovered build order:

```
Component Discovery complete:
- {componentCount} components across {tierCount} tiers
- Tier 1 (leaves): {component list}
- Tier 2: {component list}
- ...
- Tier {N} (top-level): {component list}

Figma file state:
- Pages: {existing page names}
- Variable collections: {existing or "none"}
- Existing components: {count or "none"}
```

## Scripts Reference

| Script | Location | Purpose |
|--------|----------|---------|
| `map-components.js` | `.claude/skills/figma-from-code-validator/map-components.js` | Crawls routes, detects framework, discovers components, computes build order |

Do NOT modify this script.

## Skip / Resume

If called with `resume: true`, check whether `.temp/figma-from-code/component-map.json` exists on disk. If it does, skip the discovery run and read the existing file. If it's missing, re-run.

## Error Handling

| Scenario | Action |
|----------|--------|
| Dev server not running | Halt, tell user to run `npm run dev` |
| `map-components.js` fails | Check Playwright installation, verify URL is accessible |
| Figma `use_figma` read-only call fails | Report error but do not block — component discovery output is still valid |
| Empty `component-map.json` | Check that dev server is serving the app (not an error page) |
