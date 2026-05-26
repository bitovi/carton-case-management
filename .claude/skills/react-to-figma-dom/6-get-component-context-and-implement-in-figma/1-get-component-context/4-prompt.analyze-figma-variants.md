# 6 Get Component Context and Implement in Figma
## 6.1 Get Component Context
### 6.1.4 Analyze Figma Variants

**Begin your response by outputting the heading lines above verbatim.**

Compare captured variant screenshots to determine which code-level variants produce visually distinct results. Output a reduced set of Figma variant axes with bidirectional mappings between Figma variants and React props.

The upstream `variants.md` enumerates every possible code state (generous). This prompt distills that into only the variants that matter visually for Figma, based on evidence from actual rendered screenshots.

## Inputs

- **Component name**: PascalCase name (e.g., `Accordion`)
- **variants.md**: Contents of `.temp/react-to-figma/components/{Name}/variants.md`
- **variants/**: Directory at `.temp/react-to-figma/components/{Name}/variants/` containing one subdirectory per captured variant. Each subdirectory contains:
  - `screenshot.png` — rendered screenshot of that variant
  - `dom.json` — captured DOM tree (see schema in Step 1)
  - `fiber-dom-map.json` — React fiber to DOM node mapping
- **capture-manifest.json**: At `.temp/react-to-figma/components/{Name}/variants/capture-manifest.json` with `captured[]` (successful) and `failed[]` arrays
- **Output directory**: `.temp/react-to-figma/components/{Name}/`

## Procedure

### 1. Run diff-variants.js and load results

Run the diff helper script to get a pre-computed comparison of all variant pairs:

```bash
node .claude/skills/react-to-figma-dom/scripts/diff-variants.js \
  --variants-dir .temp/react-to-figma/components/{Name}/variants
```

This produces `.temp/react-to-figma/components/{Name}/variant-diffs.md` containing:
- **Verdict matrix** — every pair classified as `IDENTICAL`, `TEXT_ONLY`, `STYLE_ONLY`, `STRUCTURE_DIFFERENT`, or `DIFFERENT`
- **Visual equivalence groups** — variants grouped by identical DOM structure and styles (ignoring text content)
- **Pair details** — for non-identical pairs, the specific style/bounds/text differences with node paths

Read the output file. This is your primary data source for steps 2–3.

Also read `variants.md` and build a lookup table mapping each variant subdirectory name to its axis values:

```
VariantName → { variantAxes }
```

Skip any variants listed in the `failed[]` array of `capture-manifest.json`.

### 2. Review groups and verify with screenshots

The diff script groups variants by structural and style identity. Review these groups and verify them:

1. **Read the "Visual Equivalence Groups" section** from `variant-diffs.md`. Variants in the same group have `IDENTICAL` or `TEXT_ONLY` verdicts between them.
2. **View `screenshot.png`** for any ambiguous pairs — especially `STYLE_ONLY` pairs, where the diff is small enough that the visual impact may be negligible (e.g., a 1px rounding difference) or significant (e.g., a background color change indicating hover state).
3. **Check TEXT_ONLY pairs** — these have the same structure and styles but different text. Confirm these are independent content changes, not variant-axis differences.

The diff script's verdict categories:

| Verdict | Meaning | Typical interpretation |
|---------|---------|----------------------|
| `IDENTICAL` | Same structure, styles, bounds, and text | Same visual group |
| `TEXT_ONLY` | Same structure and styles, different text | Independent TEXT property |
| `STYLE_ONLY` | Same structure, different computed styles | Visual variant (e.g., hover state, color change) |
| `STRUCTURE_DIFFERENT` | Different tag tree or child counts | Visual variant (e.g., edit mode adds input) |
| `DIFFERENT` | Different styles/bounds AND text | Usually an independent property variant with different text + layout reflow |

### 3. Classify each variant axis

For each variant axis defined in `variants.md`, determine its visual impact:

**Method**: Find screenshot pairs that differ on ONLY that axis (all other axes held constant). If no such pair exists, find the closest pairs and note the confounding axes.

#### Independence verification

If `variants.md` classified any axes as independent (in the "Component Properties" section), verify from `variant-diffs.md`:

1. Find the independent-axis variants (e.g., `With Left Icon`, `With Right Icon`)
2. Check their pair verdicts against the default variant in the verdict matrix — they should show `TEXT_ONLY` or `DIFFERENT` (bounds change from content reflow), NOT `STYLE_ONLY` or `STRUCTURE_DIFFERENT`
3. Confirm the delta is consistent — it does not depend on which dependent-axis variant is active
4. If the delta IS consistent → confirmed independent → keep as Component Property
5. If the delta differs across dependent variants → reclassify as dependent → add to variant matrix

#### Classification categories

| Classification | Criteria | Figma treatment |
|---------------|----------|-----------------|
| **Visual** | Changing this axis produces a visible difference in at least one screenshot pair | Becomes a Figma variant property |
| **Behavioral** | Changing this axis produces NO visible difference in ANY screenshot pair | Documented in component description only, not a Figma variant |
| **State Enabler** | Changing this axis doesn't look different itself, but enables visual states that would otherwise be impossible | NOT a Figma variant axis. Instead, the unique visual states it enables are added as values to an existing Visual axis |

#### Evidence format

For each axis, document the evidence using the pair verdict and diff details from `variant-diffs.md`:

```
Axis: Collapsible (true/false)
Pair: "Single Non Collapsible First Open" vs "Single Collapsible First Open"
Verdict: IDENTICAL (from variant-diffs.md)
Classification: Behavioral
Reason: Collapsible only affects click behavior (whether an open item can be closed). 
        The only unique visual state it enables (all items closed) is already covered 
        by the Item State axis.
```

```
Axis: Size (sm/md/lg)
Pair: "Size Sm" vs "Size Md" vs "Size Lg"
Verdict: STYLE_ONLY — padding changes (4px→8px→12px), fontSize changes (12px→14px→16px)
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

**Variant count check**: Count the total dependent combinations (cross-product of all Visual VARIANT axes). If >30, verify each axis is truly a Visual axis (not a State Enabler or Behavioral axis that could be removed). Complex components legitimately have 100+ variants when all axes are visual — do not force-convert visual axes to Component Properties just to reduce the count. Only convert axes that are genuinely independent.

**CRITICAL RULE: BOOLEAN axes are NEVER variant axes.** They are ALWAYS Component Properties. BOOLEAN axes do NOT appear in the "Figma Variant Axes" table, do NOT contribute to the variant count, and do NOT multiply the cross-product. In Figma, BOOLEAN component properties can only toggle `visible` on a child node — auto-layout handles the reflow. If a React prop causes changes beyond show/hide (padding, colors, etc.), the classification system above will classify it as VARIANT type, not BOOLEAN.

#### Component Properties

For each axis confirmed as independent (from §3 independence verification), define a Component Property:

| Axis type | Figma property type | Behavior |
|-----------|--------------------|---------|
| Show/hide toggle | BOOLEAN | Controls `visible` on a child node. Child exists in all variants (hidden by default). Auto-layout adjusts when toggled. |
| Content swap | INSTANCE_SWAP | Controls which component instance fills a slot. |
| Text content | TEXT | Controls editable text in a child node. |

The base variant must include hidden placeholder nodes for all BOOLEAN-controlled children so that toggling works correctly.

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

| Figma Variant Combination | Representative Screenshot | Variant Directory |
|--------------------------|--------------------------|-------------------|
| Item State=First Open, Trigger=Default | variants/Single Non Collapsible First Open/screenshot.png | Single Non Collapsible First Open |
| Item State=All Closed | variants/Single Collapsible All Closed/screenshot.png | Single Collapsible All Closed |
| Trigger=Hover | variants/Single Non Collapsible All Closed First Hover/screenshot.png | Single Non Collapsible All Closed First Hover |

### 8. Write figma-variants.md

Write to `.temp/react-to-figma/components/{Name}/figma-variants.md`:

```markdown
# {ComponentName} Figma Variants

## Summary

- **Code variants analyzed**: {count from variants.md}
- **Screenshots compared**: {count of successful captures}
- **Visual groups found**: {count of equivalence classes}
- **Figma variant axes**: {count of VARIANT-type axes only — excludes Component Properties}
- **Total Figma variant combinations**: {cross-product of VARIANT-type axes only — BOOLEAN/INSTANCE_SWAP/TEXT properties do NOT multiply}

## Figma Variant Axes

Only VARIANT-type axes appear here. BOOLEAN axes are listed in Component Properties below.

| Axis | Type | Values | Default | React Source |
|------|------|--------|---------|-------------|
| Size | VARIANT | sm, md, lg | md | prop: size |
| State | VARIANT | default, hover, focus, disabled | default | CSS pseudo-classes + disabled prop |
| Item State | VARIANT | first-open, all-closed, multiple-open, all-open | first-open | Composite: type + collapsible + defaultValue |

## Component Properties

| Property | Figma Type | Default | Controlled Node | Wiring |
|----------|-----------|---------|----------------|--------|
| Show left icon | BOOLEAN | false | leftIcon frame | `componentPropertyReferences = { visible: key }` |
| Left icon | INSTANCE_SWAP | placeholder | leftIcon slot | `componentPropertyReferences = { mainComponent: key }` |

## Axis Independence Evidence

### {AxisName}: Independent (confirmed)
**Code evidence**: No conditional classes combining {axis} with dependent axes.
**Screenshot evidence**: Structural delta from adding {axis} is {N}px padding shift, consistent across all dependent variants.

### {AxisName}: Dependent (confirmed)
**Code evidence**: CVA compound variant `{ variant: 'outline', {axis}: true, class: '...' }`.
**Screenshot evidence**: Layout change differs between variant=primary ({N}px) and variant=outline ({M}px).

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
| Size=md, State=default | `size="md"` | variants/Size Md State Default/screenshot.png |
| Size=md, State=hover | `size="md"` + mouseenter | variants/Size Md State Hover/screenshot.png |
| Size=sm, State=default | `size="sm"` | variants/Size Sm State Default/screenshot.png |
| Item State=All Closed | `type="single"`, `collapsible={true}`, `defaultValue=""` | variants/Single Collapsible All Closed/screenshot.png |
| Item State=Multiple Open | `type="multiple"`, `defaultValue={["item-1","item-2"]}` | variants/Multiple First And Third Open/screenshot.png |

## Figma Component Structure

{ComponentName} (component set)
├── {Axis1} (variant property)
│   ├── value1
│   └── value2
├── {Axis2} (variant property)
│   ├── value1
│   └── value2
├── {Axis3} (boolean property)
│   ├── true
│   └── false
├── Show {slot} (BOOLEAN component property, default=false)
└── {slot} (INSTANCE_SWAP component property)

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
- Component properties: {count} (BOOLEAN/INSTANCE_SWAP/TEXT — never multiply)
- Figma variant axes: {list} (VARIANT-type only)
- Figma combinations: {count} (VARIANT axes cross-product only — BOOLEANs excluded)
- Output: .temp/react-to-figma/components/{Name}/figma-variants.md
```
