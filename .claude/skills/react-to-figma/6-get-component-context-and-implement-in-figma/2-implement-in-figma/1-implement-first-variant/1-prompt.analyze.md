# 6 Get Component Context and Implement in Figma
## 6.2 Implement in Figma
### 6.2.1 Implement First Variant
#### 6.2.1.1 Analyze Default Variant

**Begin your response by outputting the heading lines above verbatim.**

Parse all raw inputs and produce a structured build plan for the default variant. The build agent reads ONLY this plan — it never touches the raw input files.

## Inputs

| Input | Description |
|-------|-------------|
| `analysis.md` | Child relationships, source type, leaf status |
| `props.md` | Component props with types and defaults |
| `figma-variants.md` | Figma variant axes with defaults, React↔Figma mappings, representative screenshots, component properties |
| `variants.md` | Full code-level variant enumeration (Tailwind classes, computed styles) |
| `app-context/*.html.md` | Live app HTML structure (optional) |
| `app-context/*.styles.md` | Computed CSS from live app (optional) |
| `screenshots/*.html.md` | Storybook HTML structure per variant (always present, fallback for text when `app-context/` absent) |
| `screenshots/*.styles.md` | Storybook computed CSS per variant (always present, fallback for layout when `app-context/` absent) |
| `screenshots/*.png` | React variant PNGs — view to understand visual target |
| `figma-variables-map.json` | Tailwind class / CSS var → Figma variable ID |
| `figma-icons-map.json` | Icon name → Figma component ID |
| `figma-assets-map.json` | Asset name → Figma component ID |
| `builtComponents` | Map of `{componentName: nodeId}` for previously built components |

## Output

Write `build-plan.md` to the component directory.

## Procedure

### 1. Identify the default combo

Read `figma-variants.md` → "Figma Variant Axes" table. Only axes with type=VARIANT contribute to physical variants. **BOOLEAN axes are NEVER physical variants** — they are Component Properties wired after combining. Do NOT include BOOLEAN axes in `allCombos`.

The default combo is where every VARIANT-type axis is at its default value.

If there are no VARIANT-type axes, the default is the only combo — record `singleComponent: true`.

Record:
- `defaultCombo`: e.g., `{ Variant: 'primary', Size: 'regular' }` (VARIANT axes only)
- `allCombos`: cross-product of VARIANT-type axes only (excludes BOOLEAN/INSTANCE_SWAP/TEXT properties)
- `singleComponent`: true/false

### 2. Build instance manifest

Read `analysis.md` "Rendered Children" table. For each child:

1. Look up in `builtComponents` → record `{ name, nodeId }`
2. If not found, check `figma-icons-map.json` for `Icon/{name}` → record with icon componentId
3. If not found, check `figma-assets-map.json` → record with asset componentId
4. If not found anywhere → **STOP** and report missing dependency

From `app-context/*.html.md` (or `screenshots/{defaultScreenshot}.html.md` if `app-context/` is absent), count how many times each child appears → set `usageCount`.

From text content in the HTML, determine what text overrides each instance needs → set `textOverrides` (list of `{ findBy, characters }` per usage).

### 3. Determine layout structure

From `app-context/*.styles.md` (or `screenshots/{defaultScreenshot}.styles.md` if `app-context/` is absent) root element, extract:
- `display` / `flexDirection` → `layoutMode` (VERTICAL or HORIZONTAL)
- `gap` → `itemSpacing`
- `padding*` → padding values
- `width` / `height` → sizing intent
- `borderRadius` → `cornerRadius`
- `overflow` → `clipsContent`

From `app-context/*.html.md`, determine the frame nesting:
- Which elements are direct children of the root?
- Which are wrapper frames (divs with flex layout)?
- Which are text nodes vs component instances?

### 4. Build the frame tree

Create a hierarchical description of every node to create:

```
{componentName} (COMPONENT, {layoutMode}, gap={itemSpacing})
├── {childName} (FRAME, HORIZONTAL, gap=8, counterAlign=CENTER)
│   ├── Icon/{iconName} INSTANCE → master {nodeId}, resize({w},{h})
│   └── {text} TEXT → characters="{text}", fontSize={size}, fontStyle="{style}"
├── Divider (RECTANGLE, h=1, FILL horizontal, fills={color})
└── {childName} INSTANCE → master {nodeId}
    └── TEXT override: "{text}" (findOne characters="{placeholder}")
```

Rules for the frame tree:
- Every child from the instance manifest appears as INSTANCE, never as plain text/frame
- Text nodes are ONLY for text not owned by a child component
- Wrapper frames are created for HTML divs that group children with their own flex layout
- Order matches the HTML source order
- For each Component Property of type BOOLEAN (from `figma-variants.md`), include the controlled child node in the tree with `visible=false`. This hidden placeholder enables the BOOLEAN toggle to show/hide it after `combineAsVariants`.

### 5. Resolve variable bindings

For each visual property (fills, strokes, text fills, cornerRadius, itemSpacing):

1. Identify the Tailwind class from `variants.md` or computed style from `app-context/*.styles.md`
2. Look up in `figma-variables-map.json`:
   - Try class-based keys: `bg-primary`, `text-muted-foreground`, `border-input`
   - Try CSS var keys: `var(--primary)`, `--primary`
3. Record: `{ property, tailwindClass, variableId, fallbackRgb }`

The fallback RGB comes from `app-context/*.styles.md` computed values (parse `rgb(R,G,B)` → `{r: R/255, g: G/255, b: B/255}`).

### 6. List required fonts

Scan the frame tree for all text nodes and instance text overrides. Collect unique `{ family, style }` pairs. Always include `Inter Regular` as baseline.

### 7. Write build-plan.md

```markdown
# Build Plan: {componentName}

## Component
- **singleComponent**: {true|false}
- **defaultCombo**: {JSON}
- **allCombos**: {JSON array — full list for Phase 2}

## Instance Manifest

| Child | Master Node ID | Count | Usages |
|-------|---------------|-------|--------|
| {name} | {nodeId} | {count} | {usage descriptions} |

## Frame Tree

```
{the hierarchical tree from step 4}
```

## Style Properties

| Node | Property | Value | Variable ID | Fallback RGB |
|------|----------|-------|-------------|-------------|
| root | layoutMode | VERTICAL | — | — |
| root | itemSpacing | 16 | — | — |
| root | fills[0] | bg-card | VariableID:5:30 | — |
| root | strokes[0] | border-border | VariableID:5:14 | — |
| root | strokeWeight | 1 | — | — |
| root | strokeAlign | OUTSIDE | — | — |
| root | cornerRadius | 8 | VariableID:5:40 | — |
| root | paddingTop | 24 | — | — |
| ... | ... | ... | ... | ... |

## Text Nodes

| Parent Frame | Characters | Font | Size | Line Height | Color Variable | Fallback RGB |
|-------------|-----------|------|------|-------------|---------------|-------------|
| header-row | "Status" | Inter Medium | 14 | 20 | text-muted-foreground / VariableID:5:8 | — |

## Instance Text Overrides

| Instance | Usage | Find By | Characters |
|----------|-------|---------|-----------|
| EditableTitle #1 | first name | characters="Title" | "Lisa" |
| EditableTitle #2 | last name | characters="Title" | "Anderson" |
| EditableText #1 | email | position[0]="Email", position[1]="value" | ["Email Address", "lisa@example.com"] |

## Fonts Required

- Inter Regular
- Inter Medium
- Inter Semi Bold

## Component Properties

| Property | Figma Type | Default | Controlled Node | Wiring |
|----------|-----------|---------|----------------|--------|
| Show left icon | BOOLEAN | false | leftIcon frame (visible=false) | `componentPropertyReferences = { visible: key }` |
| Left icon | INSTANCE_SWAP | {placeholderId} | leftIcon instance | `componentPropertyReferences = { mainComponent: key }` |

{Include this section only if `figma-variants.md` has a Component Properties section. Copy each property with its type, default, controlled node name, and wiring pattern.}

## Default Variant Screenshot

Reference: `screenshots/{defaultScreenshotFilename}`
```

## Error Handling

| Scenario | Action |
|----------|--------|
| Child not in `builtComponents` or icon/asset maps | Stop. Write `build-plan.md` with `error: missing_dependency` and list the missing children. |
| No `app-context/` available | Use `screenshots/*.styles.md` and `screenshots/*.html.md` from Storybook captures instead. If neither exists, infer layout from the React screenshot (view it) and `props.md`. |
| `figma-variants.md` missing | Fall back to `variants.md`. Treat all variant axes as Figma axes. |
| Ambiguous layout direction | Default to VERTICAL. The verify step will catch if it's wrong. |
