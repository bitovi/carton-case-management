# Analyze Figma Variants

Compare captured variant screenshots to determine which code-level variants produce visually distinct results. Output a reduced set of Figma variant axes with bidirectional mappings between Figma variants and React props.

The upstream `variants.md` enumerates every possible code state (generous). This prompt distills that into only the variants that matter visually for Figma, based on evidence from actual rendered screenshots.

## Inputs

- **Component name**: PascalCase name (e.g., `Accordion`)
- **variants.md**: Contents of `.temp/react-to-figma/components/{Name}/variants.md`
- **screenshots/**: All PNGs in `.temp/react-to-figma/components/{Name}/screenshots/`
- **screenshots/*.html.md**: Rendered HTML per variant
- **screenshots/*.styles.md**: Computed CSS per variant
- **screenshots-manifest.json**: Capture results with success/failure status
- **Output directory**: `.temp/react-to-figma/components/{Name}/`

## Procedure

### 1. Load all screenshots and metadata

Read every PNG in `screenshots/`. Also read the corresponding `.html.md` and `.styles.md` files for each variant.

Build a lookup table:

```
VariantExportName → { png, html, styles, variantAxes }
```

Where `variantAxes` is extracted from the export name or cross-referenced with `variants.md` to determine which axis values that screenshot represents.

Skip any variants marked as failed in `screenshots-manifest.json`.

### 2. Group visually identical screenshots

Compare screenshots systematically. Two screenshots are **visually identical** if:

1. **Visual inspection**: The PNG images show the same layout, colors, spacing, borders, shadows, and content structure (ignoring placeholder text differences)
2. **CSS confirmation**: The `.styles.md` files show the same computed values for layout-affecting properties (dimensions, padding, margin, background, border, color, opacity, font properties, transform)
3. **Structure confirmation**: The `.html.md` files show the same DOM element count, nesting depth, and element types

When comparing, focus on **structural and styling differences**, not text content differences. Two accordions with different trigger labels but the same layout/styling are visually identical.

Group the screenshots into visual equivalence classes:

```
Group A: [SingleNonCollapsibleFirstOpen, SingleCollapsibleFirstOpen] — identical layout, first item expanded
Group B: [SingleCollapsibleAllClosed] — unique, all items collapsed
Group C: [MultipleAllOpen] — unique, all items expanded
...
```

### 3. Classify each variant axis

For each variant axis defined in `variants.md`, determine its visual impact:

**Method**: Find screenshot pairs that differ on ONLY that axis (all other axes held constant). If no such pair exists, find the closest pairs and note the confounding axes.

#### Classification categories

| Classification | Criteria | Figma treatment |
|---------------|----------|-----------------|
| **Visual** | Changing this axis produces a visible difference in at least one screenshot pair | Becomes a Figma variant property |
| **Behavioral** | Changing this axis produces NO visible difference in ANY screenshot pair | Documented in component description only, not a Figma variant |
| **State Enabler** | Changing this axis doesn't look different itself, but enables visual states that would otherwise be impossible | NOT a Figma variant axis. Instead, the unique visual states it enables are added as values to an existing Visual axis |

#### Evidence format

For each axis, document the evidence:

```
Axis: Collapsible (true/false)
Comparison: SingleNonCollapsibleFirstOpen vs SingleCollapsibleFirstOpen
Result: IDENTICAL — same layout, same styles, same DOM structure
Classification: Behavioral
Reason: Collapsible only affects click behavior (whether an open item can be closed). 
        The only unique visual state it enables (all items closed) is already covered 
        by the Item State axis.
```

```
Axis: Size (sm/md/lg)
Comparison: SizeSm vs SizeMd vs SizeLg
Result: DIFFERENT — padding changes from 4px/8px/12px, font-size changes from 12px/14px/16px
Classification: Visual
Reason: Each size value produces measurably different dimensions and typography.
```

### 4. Handle State Enablers

When an axis is classified as a State Enabler:

1. Identify the unique visual states it enables (e.g., `type=multiple` enables "multiple items open simultaneously")
2. Find which existing Visual axis those states belong to (e.g., Item State)
3. Add those states as new values on the existing axis
4. Document the mapping so the Figma→React table knows that producing the "Multiple Open" visual state requires setting `type="multiple"` in code

### 5. Build Figma variant axes

From the Visual-classified axes, define the Figma variant properties:

For each Visual axis:
- **Figma property name**: Use a clean, designer-friendly name (e.g., "Size" not "size prop")
- **Figma property type**: VARIANT (for enums) or BOOLEAN (for true/false visual toggles)
- **Values**: Only the values that produce visually distinct results
- **Default value**: The most common or "resting" value
- **React source**: Which prop(s) and value(s) produce each Figma variant value

Prune values within a Visual axis if two values look identical (e.g., if `variant=outline` and `variant=ghost` render identically, merge them or pick one as the canonical value and note the alias).

### 6. Build bidirectional mapping

#### React → Figma mapping

For every prop and state from `variants.md`, document where it lands:

| React Prop/State | Values | Figma Mapping | Notes |
|-----------------|--------|---------------|-------|
| `type` | single, multiple | — (State Enabler) | Enables "Multiple Open" in Item State axis |
| `collapsible` | true, false | — (Behavioral) | No visual impact |
| `disabled` | true, false | State = "Disabled" | Visual: changes opacity and cursor |
| `size` | sm, md, lg | Size = sm/md/lg | Visual: 1:1 mapping |
| CSS `:hover` | — | State = "Hover" | Visual: background color change |

#### Figma → React mapping

For every Figma variant combination, document the React props needed to produce it:

| Figma Variant | React Props | Additional Setup |
|--------------|-------------|------------------|
| State=Default, Size=md | `size="md"` | — |
| State=Hover, Size=md | `size="md"` | Trigger mouseenter event |
| Item State=Multiple Open | `type="multiple"`, `defaultValue={["item-1","item-2"]}` | — |
| Item State=All Closed | `type="single"`, `collapsible={true}`, `defaultValue=""` | — |

### 7. Determine representative screenshots

From the visual groups identified in step 2, pick one representative screenshot per group. These are the screenshots that the Figma build step should reference when implementing each variant.

| Figma Variant Combination | Representative Screenshot | Variant Export Name |
|--------------------------|--------------------------|-------------------|
| Item State=First Open, Trigger=Default | SingleNonCollapsibleFirstOpen.png | SingleNonCollapsibleFirstOpen |
| Item State=All Closed | SingleCollapsibleAllClosed.png | SingleCollapsibleAllClosed |
| Trigger=Hover | SingleNonCollapsibleAllClosedFirstHover.png | SingleNonCollapsibleAllClosedFirstHover |

### 8. Write figma-variants.md

Write to `.temp/react-to-figma/components/{Name}/figma-variants.md`:

```markdown
# {ComponentName} Figma Variants

## Summary

- **Code variants analyzed**: {count from variants.md}
- **Screenshots compared**: {count of successful captures}
- **Visual groups found**: {count of equivalence classes}
- **Figma variant axes**: {count}
- **Total Figma variant combinations**: {count}

## Figma Variant Axes

| Axis | Type | Values | Default | React Source |
|------|------|--------|---------|-------------|
| Size | VARIANT | sm, md, lg | md | prop: size |
| State | VARIANT | default, hover, focus, disabled | default | CSS pseudo-classes + disabled prop |
| Item State | VARIANT | first-open, all-closed, multiple-open, all-open | first-open | Composite: type + collapsible + defaultValue |

## Visual Groups

Screenshots that are visually identical:

| Group | Screenshots | Distinguishing Feature |
|-------|-----------|----------------------|
| A | SingleNonCollapsibleFirstOpen, SingleCollapsibleFirstOpen | First item open, default trigger |
| B | SingleCollapsibleAllClosed | All items closed |
| C | MultipleAllOpen | All items expanded |
| ... | ... | ... |

## Axis Classification Evidence

### {AxisName}: {Classification}

**Compared**: {Screenshot1} vs {Screenshot2}
**Result**: {IDENTICAL or DIFFERENT}
**Evidence**: {What was the same or different — layout, colors, dimensions, etc.}
**Conclusion**: {Why this classification}

{Repeat for each axis from variants.md}

## React → Figma Mapping

| React Prop/State | Values | Figma Axis | Figma Values | Classification |
|-----------------|--------|-----------|-------------|----------------|
| size | sm, md, lg | Size | sm, md, lg | Visual |
| type | single, multiple | — | — | State Enabler |
| collapsible | true, false | — | — | Behavioral |
| CSS :hover | — | State | hover | Visual |
| CSS :focus | — | State | focus | Visual |
| disabled | true, false | State | disabled | Visual |

## Figma → React Mapping

| Figma Variant Combination | React Props | Screenshot Reference |
|--------------------------|-------------|---------------------|
| Size=md, State=default | `size="md"` | SizeMdStateDefault.png |
| Size=md, State=hover | `size="md"` + mouseenter | SizeMdStateHover.png |
| Size=sm, State=default | `size="sm"` | SizeSmStateDefault.png |
| Item State=All Closed | `type="single"`, `collapsible={true}`, `defaultValue=""` | SingleCollapsibleAllClosed.png |
| Item State=Multiple Open | `type="multiple"`, `defaultValue={["item-1","item-2"]}` | MultipleFirstAndThirdOpen.png |

## Figma Component Structure

{ComponentName} (component set)
├── {Axis1} (variant property)
│   ├── value1
│   └── value2
├── {Axis2} (variant property)
│   ├── value1
│   └── value2
└── {Axis3} (boolean property)
    ├── true
    └── false

## Behavioral Props (not in Figma)

These React props have no visual impact and are not represented as Figma variants:

| Prop | Purpose | Why Not Visual |
|------|---------|---------------|
| collapsible | Controls if single-type can collapse all items | No CSS/DOM change; only affects click handler behavior |
| onValueChange | Callback when value changes | Event handler, no visual impact |
```

### 9. Return summary

```
Figma variant analysis complete: {ComponentName}
- Code variants: {count from variants.md}
- Visual groups: {count} (from {screenshot_count} screenshots)
- Axes: {visual_count} visual, {behavioral_count} behavioral, {enabler_count} state enablers
- Figma variant axes: {list}
- Figma combinations: {count}
- Output: .temp/react-to-figma/components/{Name}/figma-variants.md
```
