# Setup Figma File

Create the Figma file structure, variable collections, and icon/asset components from the locally-extracted Phase 2 and Phase 3 outputs. This is the first phase that requires a Figma MCP connection.

## Inputs

- **`design-tokens.json`**: `.temp/react-to-figma/design-tokens.json` (from Phase 2)
- **`css-figma-map.json`**: `.temp/react-to-figma/css-figma-map.json` (from Phase 2)
- **`icons.json`**: `.temp/react-to-figma/icons.json` (from Phase 3)
- **`assets/icons/*.svg`**: `.temp/react-to-figma/assets/icons/` (from Phase 3)
- **`static-assets.json`**: `.temp/react-to-figma/assets/static-assets.json` (from Phase 3)
- **Figma file key**: The target Figma file (from user or parent orchestrator)

## Output

| File | Purpose |
|------|---------|
| `.temp/react-to-figma/figma-variables-map.json` | CSS var/class → Figma variable ID lookup |
| `.temp/react-to-figma/figma-icons-map.json` | Icon name → Figma component node ID lookup |
| `.temp/react-to-figma/figma-assets-map.json` | Asset name → Figma component node ID lookup |
| `.temp/react-to-figma/figma-file-setup.md` | Human-readable summary of what was created |

## Prerequisites

- Phases 2 and 3 must be complete (`design-tokens.json` and `icons.json` must exist)
- The `use_figma` MCP tool must be available
- A target Figma file must be specified

## Procedure

### Step 1: Create file structure

Using the `use_figma` MCP tool, create the following pages in the Figma file (skip any that already exist):

| Page Name | Purpose |
|-----------|---------|
| **Foundations** | Design token documentation, color swatches, typography samples |
| **Icons** | All icon components (one per extracted icon) |
| **Components** | Where Phase 6 builds each component |
| **Screens** | Where Phase 7 composes full page frames |

Check existing pages first. If pages already exist with these names, reuse them. Do not create duplicates.

### Step 2: Create variable collections

Read `design-tokens.json` and create three Figma variable collections using `use_figma`:

#### 2a. Palette collection

For each token where `figmaCollection === "Palette"`:
1. Create a color variable at the token's `figmaPath` (e.g., `Palette/teal/500`)
2. Set the value using `resolved.hex` and `resolved.opacity`
3. Apply scoping from `figmaScoping` (e.g., `["ALL_FILLS", "STROKE_COLOR"]`)

#### 2b. Semantic collection

For each token where `figmaCollection === "Semantic"`:
1. Create a color variable at the token's `figmaPath` (e.g., `Semantic/primary`)
2. Set the value using `resolved.hex` and `resolved.opacity`
3. Apply scoping from `figmaScoping` (e.g., `["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL", "STROKE_COLOR"]`)

Where possible, **alias** semantic variables to palette variables instead of hardcoding hex values. To determine aliases:
- Read the raw CSS: if `--primary` references `var(--teal-500)`, alias `Semantic/primary` → `Palette/teal/500`
- If the resolved hex of a semantic token exactly matches a palette token, create an alias

#### 2c. Numbers collection

For each token where `figmaCollection === "Numbers"`:
1. Create a float variable at the token's `figmaPath` (e.g., `Numbers/border-radius/lg`)
2. Set the value using `resolvedPx`
3. Apply scoping from `figmaScoping` (e.g., `["CORNER_RADIUS"]`)

#### 2d. Build the variables map

After creating all variables, build `figma-variables-map.json`:

```json
{
  "var(--primary)": { "figmaPath": "Semantic/primary", "variableId": "VariableID:123:456" },
  "--primary": { "figmaPath": "Semantic/primary", "variableId": "VariableID:123:456" },
  "bg-primary": { "figmaPath": "Semantic/primary", "variableId": "VariableID:123:456" },
  "text-primary-foreground": { "figmaPath": "Semantic/primary-foreground", "variableId": "VariableID:123:789" },
  "rounded-lg": { "figmaPath": "Numbers/border-radius/lg", "variableId": "VariableID:200:10" }
}
```

Each key from `css-figma-map.json` maps to its Figma path plus the actual variable ID returned by the MCP tool.

### Step 3: Create icon components

Navigate to the **Icons** page. Read `icons.json`.

For each icon in the `icons` array that has a non-null `svgString`:

1. Create a Figma component from the SVG using `figma.createNodeFromSvg(svgString)`
2. Name the component using `figmaName` (e.g., `Icon/Check`, `Icon/MoreVertical`)
3. Set the component's frame to 24×24 (matching the standard icon viewBox)
4. Flatten the SVG paths into a single vector if possible (cleaner Figma component)
5. Set stroke color to bind to `Semantic/foreground` variable (if it exists) so icons inherit text color

Record the created component's node ID.

After all icons are created, write `figma-icons-map.json`:

```json
{
  "Check": { "figmaName": "Icon/Check", "componentId": "12:34" },
  "MoreVertical": { "figmaName": "Icon/MoreVertical", "componentId": "12:56" }
}
```

### Step 4: Create static asset components

If `static-assets.json` has assets with `type: "svg"` and a `svgContent` field:

1. Navigate to the **Icons** page (assets go alongside icons)
2. For each SVG asset, create a Figma component from `svgContent`
3. Name using `figmaName` (e.g., `Asset/CartonLogo`)
4. Size to match the original asset dimensions

For non-SVG assets (PNG, JPG, etc.):
- These cannot be created programmatically via the Figma API
- Log them as pending manual imports in the summary

Write `figma-assets-map.json`:

```json
{
  "CartonLogo": { "figmaName": "Asset/CartonLogo", "componentId": "12:78", "type": "svg" }
}
```

### Step 5: Create Foundations page content (optional)

On the **Foundations** page, create documentation frames showing:

1. **Color Palette**: A grid of color swatches for each Palette variable, labeled with name and hex value
2. **Semantic Colors**: A grid showing semantic token swatches with their names
3. **Border Radius**: Visual examples of each radius value
4. **Typography**: Text samples showing each font size and weight

This step is nice-to-have. If context is getting large, skip it and note it in the summary.

### Step 6: Write summary

Write `.temp/react-to-figma/figma-file-setup.md`:

```markdown
# Figma File Setup

**File key**: {fileKey}
**Created at**: {timestamp}

## Pages
- Foundations: {created | already existed}
- Icons: {created | already existed}
- Components: {created | already existed}
- Screens: {created | already existed}

## Variable Collections
- Palette: {count} variables created
- Semantic: {count} variables created ({aliasCount} aliased to Palette)
- Numbers: {count} variables created

## Icon Components
- Created: {count} icon components
- Skipped (null SVG): {count}

## Asset Components
- SVG assets created: {count}
- Non-SVG assets (manual import needed): {list}

## Output Files
- figma-variables-map.json: {entryCount} entries
- figma-icons-map.json: {entryCount} entries
- figma-assets-map.json: {entryCount} entries
```

## Idempotency

Before creating any item, check if it already exists:
- **Pages**: Check page names before creating
- **Variables**: Check if a variable at the same path already exists in the collection
- **Icon components**: Check if a component with the same name exists on the Icons page

If items already exist, reuse their IDs for the output maps. Do not create duplicates.

If all output files already exist (`figma-variables-map.json`, `figma-icons-map.json`, `figma-assets-map.json`), report that setup is already complete and skip.

## Error Handling

- If `use_figma` MCP tool is not available, stop immediately with a clear message explaining that this phase requires a Figma MCP connection
- If a variable creation fails, log the error and continue with remaining variables
- If an SVG fails to import (malformed SVG), log the icon name and continue
- At the end, report any failures in the summary
