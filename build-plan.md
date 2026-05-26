# Build Plan: Badge

## Component
- **singleComponent**: false (has multiple variants)
- **defaultCombo**: { Variant: "Primary", Roundness: "Default", State: "Default", Icons: "None" }
- **allCombos**: 80 total combinations (5 Variant × 2 Roundness × 2 State × 4 Icons)

## Instance Manifest
N/A — Badge has no child components to instance. It is a leaf component with only text and optional ReactNode icon placeholders.

## Frame Tree

```
Badge (COMPONENT SET)
├── [Primary/Default/Default/None] variant ← DEFAULT VARIANT
│   └── Badge (COMPONENT, HORIZONTAL, gap=6)
│       ├── Label TEXT
│       └── [focus ring overlay if State=Focus]
├── [Primary/Default/Focus/None] variant
├── [Primary/Round/Default/None] variant
├── [Secondary/Default/Default/None] variant
└── ... (77 more variants)
```

**Badge Component Structure (per variant)**:
```
Badge (COMPONENT, HORIZONTAL, gap=6)
├── iconLeft SLOT (INSTANCE_SWAP placeholder) — visible when Icons ∈ {Left, Both}
├── Label TEXT (characters="Label", fontSize=12, fontWeight=600, fontFamily=Inter)
└── iconRight SLOT (INSTANCE_SWAP placeholder) — visible when Icons ∈ {Right, Both}
```

**Notes**:
- Root element is an inline-flex span container
- Dimensions: ~49px width (content only), 24px height (min-height: 24px with padding: 3px 8px)
- Text content uses placeholder "Label"
- Icons are INSTANCE_SWAP slots—show/hide based on Icons axis value
- No wrapper frames needed; flat structure with conditional visibility
- Focus state adds a ring overlay (not a separate layer, but a visual effect in the frame)

## Style Properties

| Node | Property | Default Value | Tailwind Class | Figma Variable ID | RGB Fallback |
|------|----------|----------------|----------------|-------------------|--------------|
| Badge (root) | layoutMode | HORIZONTAL | — | — | — |
| Badge (root) | itemSpacing | 6 | gap-[6px] | — | — |
| Badge (root) | paddingTop | 3 | py-[3px] | — | — |
| Badge (root) | paddingRight | 8 | px-2 | — | — |
| Badge (root) | paddingBottom | 3 | py-[3px] | — | — |
| Badge (root) | paddingLeft | 8 | px-2 | — | — |
| Badge (root) | minHeight | 24 | min-h-[24px] | — | — |
| Badge (root) | cornerRadius | 8 (default), 9999 (round) | rounded-lg / rounded-full | — | — |
| Badge (root) | fills[0] | rgb(15, 23, 42) | bg-primary | VariableID:5:26 | {r:0.059, g:0.09, b:0.165} |
| Badge (root) | textFill | rgb(248, 250, 252) | text-primary-foreground | VariableID:5:27 | {r:0.973, g:0.98, b:0.988} |
| Label | fontSize | 12 | text-xs | — | — |
| Label | fontWeight | 600 | font-semibold | — | — |
| Label | fontFamily | Inter | — | — | — |
| Label | lineHeight | 16 | leading-4 | — | — |
| Label | letterSpacing | 0.18 | tracking-[0.18px] | — | — |

## Variant-Specific Overrides

### Variant Axis (Background & Text Color)

| Variant Name | Background Fill | Background Variable | Text Color | Text Variable | Border |
|--------------|-----------------|-------------------|------------|---------------|--------|
| Primary | rgb(15, 23, 42) | VariableID:5:26 | rgb(248, 250, 252) | VariableID:5:27 | None |
| Secondary | rgb(100, 116, 139) | VariableID:5:28 | rgb(248, 250, 252) | VariableID:5:29 | None |
| Outline | transparent | — | rgb(30, 41, 59) | VariableID:5:30 | 1px solid, border-border (VariableID:5:14) |
| Ghost | transparent | — | rgb(30, 41, 59) | VariableID:5:30 | None |
| Destructive | rgb(239, 68, 68) | VariableID:5:31 | #FFFFFF (hardcoded) | — | None |

### Roundness Axis

| Roundness Value | Corner Radius | Tailwind Class |
|-----------------|---------------|----------------|
| Default | 8px | rounded-lg |
| Round | 9999px | rounded-full |

### State Axis (Focus & Default)

| State | Focus Ring | Ring Offset | Shadow | Color Reference |
|-------|-----------|-------------|--------|-----------------|
| Default | None | — | None | — |
| Focus (non-destructive) | 2px ring | 2px offset | 0_0_0_3px shadow | --focus-ring (rgb(203, 213, 225)) |
| Focus (destructive) | 3px ring | — | 0_0_0_3px shadow | --focus-ring-error (red variant) |

**Focus Ring Implementation**:
- Non-destructive variants (Primary, Secondary, Outline, Ghost): 2px ring with 2px offset and 3px shadow using --focus-ring variable
- Destructive variant: 3px error shadow using --focus-ring-error variable
- In Figma: Add a ring frame overlay with conditional visibility when State=Focus

### Icons Axis (Visibility & Slots)

| Icons Value | Left Slot Visible | Right Slot Visible | Use Case |
|-------------|-------------------|-------------------|----------|
| None | ✘ | ✘ | Text only (default) |
| Left | ✓ | ✘ | Icon + label |
| Right | ✘ | ✓ | Label + icon |
| Both | ✓ | ✓ | Icon + label + icon |

**Icon Slot Assumptions**:
- Icon size: 12px × 12px (adjust per design reference)
- Use INSTANCE_SWAP component property for each slot
- Slot names: `iconLeft`, `iconRight`

## Text Nodes

| Parent | Characters | Font Family | Font Size | Font Weight | Line Height | Letter Spacing | Color Variable |
|--------|-----------|------------|-----------|------------|-------------|-----------------|-----------------|
| Badge | "Label" | Inter | 12px | 600 (semibold) | 16px | 0.18px | text-primary-foreground (varies by Variant) |

**Text Behavior**:
- Static placeholder text "Label" in Figma design
- React component overrides with actual content at runtime
- Keep text as a separate layer for easy updates

## Instance Slots (INSTANCE_SWAP)

| Slot Name | Purpose | Show When | Icon Size | Component ID |
|-----------|---------|-----------|-----------|--------------|
| iconLeft | Left icon placeholder | Icons = Left OR Icons = Both | 12px | (from icon map) |
| iconRight | Right icon placeholder | Icons = Right OR Icons = Both | 12px | (from icon map) |

**Icon Options** (from icon map):
- AlertCircle → Figma: Icon/AlertCircle (componentId: 10:6)
- Check → Figma: Icon/Check (componentId: 10:23)
- X → Figma: Icon/X (componentId: [to be determined])

## Fonts Required

| Font Family | Font Weight | Usage | Fallback |
|------------|------------|-------|----------|
| Inter | 400 (Regular) | Fallback | System sans-serif |
| Inter | 600 (Semi Bold) | Badge label | System sans-serif |

**Notes**:
- Both weights must be available in the Figma workspace
- No custom fonts needed; use Inter from system or Figma library

## Default Variant Screenshot
**Reference**: `screenshots/VariantPrimarySizeMdRoundDefault.png`

Visual spec:
- Variant: Primary
- Roundness: Default (8px)
- State: Default (no focus ring)
- Icons: None (text only)
- Text: "Label"
- Dimensions: 49px width (content), 24px height (min-height)
- Appearance: Solid dark background, light text, no borders

## Variant Matrix Summary

| # | Variant | Roundness | State | Icons | Screenshot |
|----|---------|-----------|-------|-------|-----------|
| 1 | Primary | Default | Default | None | VariantPrimarySizeMdRoundDefault.png ← **DEFAULT** |
| 2 | Secondary | Default | Default | None | VariantSecondary.png |
| 3 | Outline | Default | Default | None | VariantOutline.png |
| 4 | Ghost | Default | Default | None | VariantGhost.png |
| 5 | Destructive | Default | Default | None | VariantDestructive.png |
| 6 | Primary | Round | Default | None | VariantPrimaryRoundShape.png |
| 7 | Primary | Default | Focus | None | StateFocus.png |
| 8 | Primary | Default | Default | Left | WithLeftIcon.png |
| 9 | Primary | Default | Default | Right | WithRightIcon.png |
| 10 | Primary | Default | Default | Both | WithBothIcons.png |
| ... | (70 more) | ... | ... | ... | ... |

**Total Combinations**: 5 Variant × 2 Roundness × 2 State × 4 Icons = **80 variants**

## Build Checklist

- [ ] Create Badge COMPONENT SET in Figma
- [ ] Add default variant (Primary/Default/Default/None)
- [ ] Set up 4 variant axes: Variant, Roundness, State, Icons
- [ ] Create root Badge COMPONENT with:
  - [ ] Horizontal flex layout, gap=6px
  - [ ] Padding: 3px 8px (top/bottom × left/right)
  - [ ] Min-height: 24px
  - [ ] Corner radius: 8px (default), 9999px (round)
  - [ ] Fills: Use Figma variables (primary, secondary, destructive, transparent, border)
  - [ ] Text fill: Use Figma variables (primary-foreground, secondary-foreground, foreground)
- [ ] Create Label TEXT node:
  - [ ] Characters: "Label"
  - [ ] Font: Inter 600 (semi bold)
  - [ ] Size: 12px
  - [ ] Line height: 16px
  - [ ] Letter spacing: 0.18px
- [ ] Create iconLeft INSTANCE_SWAP slot:
  - [ ] Visibility: Show when Icons ∈ {Left, Both}
  - [ ] Size: 12px × 12px
  - [ ] Component: Icon placeholder
- [ ] Create iconRight INSTANCE_SWAP slot:
  - [ ] Visibility: Show when Icons ∈ {Right, Both}
  - [ ] Size: 12px × 12px
  - [ ] Component: Icon placeholder
- [ ] Create variant overrides:
  - [ ] Variant axis: Primary, Secondary, Outline, Ghost, Destructive (fill/text color)
  - [ ] Roundness axis: Default (8px), Round (9999px) corner radius
  - [ ] State axis: Default, Focus (add ring overlay or shadow)
  - [ ] Icons axis: None, Left, Right, Both (show/hide slots)
- [ ] Add focus ring styling (State=Focus):
  - [ ] Non-destructive: 2px ring, 2px offset, 3px shadow (--focus-ring color)
  - [ ] Destructive: 3px red shadow (--focus-ring-error color)
- [ ] Test all 80 variant combinations for visual accuracy
- [ ] Validate against screenshots in `screenshots/` directory
- [ ] Generate Code Connect mapping (React component → Badge Figma component)

## Notes for Build Phase

1. **Single vs Multi-Component**: This is a COMPONENT SET, not a single component. All 80 variants nest under one set with 4 variant groups.

2. **Variant Axes Order**: In Figma, create axes in this order for clarity:
   - Variant (Primary, Secondary, Outline, Ghost, Destructive)
   - Roundness (Default, Round)
   - State (Default, Focus)
   - Icons (None, Left, Right, Both)

3. **Icon Slots**: Use INSTANCE_SWAP properties for `iconLeft` and `iconRight`. Visibility is controlled by the Icons axis:
   - Icons=None: both slots hidden
   - Icons=Left: iconLeft visible, iconRight hidden
   - Icons=Right: iconLeft hidden, iconRight visible
   - Icons=Both: both slots visible

4. **Text Placeholder**: Use "Label" as the static text content in Figma. React will override with actual content at runtime. Keep the text layer editable for future design updates.

5. **Figma Variables**: Use variables for ALL fills and text colors:
   - Primary colors: VariableID:5:26 (fill), VariableID:5:27 (text)
   - Secondary colors: VariableID:5:28 (fill), VariableID:5:29 (text)
   - Foreground colors: VariableID:5:30 (text-only, no fill)
   - Border colors: VariableID:5:14 (outline variant only)
   - Destructive colors: VariableID:5:31 (fill), hardcoded #FFFFFF (text)
   - Avoid hardcoding colors; always link to variables for consistency and theming support.

6. **Focus State Styling**:
   - In live Figma, focus is a static variant (State=Focus).
   - For non-destructive variants: Add a blue ring overlay with 2px offset and 3px shadow using the --focus-ring variable (rgb(203, 213, 225)).
   - For destructive variant: Use a red ring/shadow (--focus-ring-error).
   - Consider using a separate frame or effect layer for the ring to keep the base design clean.

7. **Width & Height**: Keep Badge flexible and content-based. Set:
   - Width: auto (content-based)
   - Height: min-height=24px (enforced by padding + min-height constraint)
   - Figma will auto-fit content width based on text + icons.

8. **Spacing & Padding**:
   - Item spacing (gap): 6px between text and icons
   - Padding: 3px 8px (vertical × horizontal) — use symmetric padding for clean alignment
   - Ensure consistent padding across all 80 variants

9. **Border for Outline Variant**:
   - Outline variant uses transparent fill + 1px border
   - Border color: border-border variable (VariableID:5:14)
   - Stroke weight: 1px
   - Use Figma stroke properties, not additional frames

10. **Responsive Behavior**: Badge is a fixed-height component (24px min-height) with flexible width. No responsive breakpoints needed for this component.

11. **Testing Against React Component**: After Figma build, use `figma-component-sync` skill to compare Figma design against actual React component in `packages/client/src/components/obra/Badge/Badge.tsx`. Ensure:
    - All 80 variant combinations render correctly
    - Color values match (use RGB inspections)
    - Spacing/padding is pixel-perfect
    - Icons render at correct sizes (12px)
    - Focus states appear correctly

12. **Code Connect Mapping**: After Figma build is complete, generate Code Connect metadata linking Badge Figma component to React component:
    ```
    Badge (Figma) → packages/client/src/components/obra/Badge/Badge.tsx (React)
    ```
    This allows Dev Mode to show live React code snippets.

13. **Icon Placeholder Strategy**: Since ReactNode icons are injected at runtime, use generic Icon placeholder components in Figma. Document that these are replaced by actual icon components (AlertCircle, Check, X, etc.) in the React implementation.
