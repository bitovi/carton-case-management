---
name: figma-setup-variables
description: Extract Carton's design tokens from index.css and tailwind.config.js and create Figma variable collections. Run this before figma:figma-generate-library so Phase 1 (tokens) is already done.
---

# Skill: Set Up Figma Variables from Carton Code

Extracts design tokens from this codebase and creates Figma variable collections. This is a project-specific accelerator for Phase 1 of `figma:figma-generate-library` — run it first so the library build can skip straight to components.

## When to Use

Before running `figma:figma-generate-library` on a fresh Figma file, or when tokens in `index.css` have changed and Figma variables need syncing.

## Token Sources (project-specific)

| File | What it contains |
|------|-----------------|
| `packages/client/src/index.css` | All CSS custom properties with hex values — palette colors and semantic aliases |
| `packages/client/tailwind.config.js` | Color names mapped to CSS variables, border radius extensions |

## Collections to Create

### 1. `Palette` (mode: `Value`)
Raw color scales — scopes set to `[]` (hidden from property pickers, used only for aliasing).

Groups: `gray/50`→`gray/950`, `teal/50`→`teal/950`, `orange`, `green`, `yellow`, `violet`, `blue`, `pink`, `white`

### 2. `Semantic` (mode: `Light`)
Alias tokens that components bind to — scopes set appropriately.

| Token group | Scope |
|------------|-------|
| `background`, `card/*`, `popover/*`, `sidebar/*` fills | `FRAME_FILL, SHAPE_FILL` |
| `foreground`, `*-foreground`, `muted/foreground` | `TEXT_FILL` |
| `border/*`, `ring/*`, `outline/*` | `STROKE_COLOR` |
| `backdrop` | `FRAME_FILL, SHAPE_FILL` |

Key aliases (value references `Palette` variable where possible):
- `background` → `Palette/white`
- `primary/DEFAULT` → `Palette/gray/950`
- `destructive/DEFAULT` → direct hex `#dc2626` (no palette match)

### 3. `Spacing` (mode: `Value`)
Float variables. Radius scope: `CORNER_RADIUS`. Spacing scope: `GAP, WIDTH_HEIGHT`.

```
radius/none=0, radius/xs=2, radius/sm=4, radius/md=6, radius/DEFAULT=8,
radius/xl=12, radius/2xl=16, radius/3xl=24, radius/full=9999
spacing/1=4, spacing/2=8, spacing/3=12, spacing/4=16, spacing/5=20,
spacing/6=24, spacing/8=32, spacing/10=40, spacing/12=48, spacing/16=64
```

## How to Execute

Load `figma:figma-use` (mandatory), then write a `use_figma` script that:
1. Creates each collection with the correct mode name
2. Creates variables in the correct order (Palette first, then Semantic aliases)
3. Sets `scopes` explicitly on every variable — never leave as `ALL_SCOPES`
4. Sets WEB code syntax: `var(--variable-name)` matching the CSS variable name

Work in batches of ~50 variables per call to stay under the incremental limit.

## Feeds Into

`figma:figma-generate-library` Phase 1. Once this runs, tell the library skill that token collections already exist so it can proceed directly to Phase 2 (file structure) and Phase 3 (components).
