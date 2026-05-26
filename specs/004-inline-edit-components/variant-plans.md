# Badge Component Variant Override Plan

**Component**: Badge  
**Total Variants**: 80 (1 default + 79 remaining)  
**Figma Default Node ID**: 16:2  
**Last Updated**: May 22, 2026

---

## SECTION 1: VARIANT AXIS DEFINITIONS

### Axis 1: Variant (5 options)
Primary axis controlling background and text colors. Maps to React `variant` prop.

| React Value | Figma Name | Background | Text Color | CSS Classes | Variables |
|-------------|-----------|------------|-----------|------------|-----------|
| `primary` | Primary | rgb(15, 23, 42) | rgb(248, 250, 252) | `bg-slate-950` `text-slate-50` | bg:VariableID:5:26, text:VariableID:5:27 |
| `secondary` | Secondary | rgb(241, 245, 249) | rgb(15, 23, 42) | `bg-slate-100` `text-slate-950` | bg:VariableID:5:28, text:VariableID:5:29 |
| `outline` | Outline | transparent | rgb(2, 6, 23) | `bg-transparent` `text-slate-900` `border border-slate-200` | border:VariableID:5:14, text:VariableID:5:30 |
| `ghost` | Ghost | transparent | rgb(2, 6, 23) | `bg-transparent` `text-slate-900` | text:VariableID:5:30 |
| `destructive` | Destructive | rgb(220, 38, 38) | rgb(255, 255, 255) | `bg-red-600` `text-white` | bg:VariableID:5:31, text:#FFFFFF |

**Default**: `primary` (already built, node 16:2)

---

### Axis 2: Roundness (2 options)
Controls border-radius. Maps to React `roundness` prop.

| React Value | Figma Name | Border Radius | CSS Class | Tailwind |
|-------------|-----------|---------------|-----------|----------|
| `default` | Default | 8px | `rounded-lg` | `rounded-lg` |
| `round` | Round | 9999px | `rounded-full` | `rounded-full` |

**Default**: `default` (8px, already built)

---

### Axis 3: State (2 options)
Controls focus ring styling. Maps to React CSS pseudo-class (`:focus-visible`). Note: In Figma, this is a static variant showing the focused appearance; in React it's dynamic via CSS.

| React State | Figma Name | Visual Style | Ring Sizing | Ring Color | Shadow |
|------------|-----------|--------------|-------------|-----------|--------|
| `:focus-visible` not active | Default | No focus ring, clean appearance | — | — | — |
| `:focus-visible` active | Focus | Focus ring + shadow overlay | 2px (non-destructive), 3px (destructive) | --focus-ring or --focus-ring-error | Offset shadow |

**Default**: `default` (no focus ring, already built)

**Focus Ring Details**:
- **Non-destructive variants** (Primary, Secondary, Outline, Ghost):
  - Ring: 2px solid
  - Color: VariableID:5:15 (--focus-ring, fallback #CBD5E1)
  - Offset: 2px from component edge
  - Shadow: `0 0 0 3px rgba(203, 213, 225, 0.3)` (soft shadow)

- **Destructive variant** (Destructive):
  - Ring: 3px solid (slightly thicker for error prominence)
  - Color: VariableID:5:32 (--focus-ring-error, fallback #FCA5A5)
  - Offset: 2px from component edge
  - Shadow: `0 0 0 3px rgba(252, 165, 165, 0.3)` (soft red shadow)

---

### Axis 4: Icons (4 options)
Controls visibility of left and right icon slots. Maps to React `icons` prop or direct slot rendering.

| React Value | Figma Name | iconLeft | iconRight | Layout | Notes |
|------------|-----------|----------|-----------|--------|-------|
| `none` | None | hidden | hidden | Text only, centered | Default minimal badge |
| `left` | Left | visible | hidden | Icon + Text | Icon left of label |
| `right` | Right | hidden | visible | Text + Icon | Icon right of label |
| `both` | Both | visible | visible | Icon + Text + Icon | Badges with emphasis icons |

**Default**: `none` (both hidden, already built)

**Icon Slots**:
- `iconLeft`: 16×16px frame, positioned left of Label
- `iconRight`: 16×16px frame, positioned right of Label
- Both frames use auto-layout with horizontal orientation
- Gap between icon and label: 6px (component-level gap)

---

## SECTION 2: OVERRIDE PLANS BY AXIS

### VARIANT AXIS: Color & Text Changes

**When to apply**: For each combination of Roundness, State, and Icons, create variants for Secondary, Outline, Ghost, and Destructive.

#### Secondary Variant Overrides
**Base**: Duplicate Primary variant  
**Target Node**: Badge root (node 16:2 equivalent in new variant)  
**Changes**:

```
Primary → Secondary:
  1. Badge.fills[0] (background):
     From: rgb(15, 23, 42) bound to VariableID:5:26
     To:   rgb(241, 245, 249) bound to VariableID:5:28
  
  2. Label.fills[0] (text color):
     From: rgb(248, 250, 252) bound to VariableID:5:27
     To:   rgb(15, 23, 42) bound to VariableID:5:29
```

**Verification**: Text should have high contrast on light background (WCAG AA minimum)

---

#### Outline Variant Overrides
**Base**: Duplicate Primary variant  
**Target Node**: Badge root  
**Changes**:

```
Primary → Outline:
  1. Badge.fills[0] (background):
     From: rgb(15, 23, 42) solid
     To:   Remove fill (transparent)
  
  2. Badge.strokes[0] (border):
     From: None
     To:   Add 1px stroke, color bound to VariableID:5:14 (--border)
  
  3. Label.fills[0] (text color):
     From: rgb(248, 250, 252) bound to VariableID:5:27
     To:   rgb(2, 6, 23) bound to VariableID:5:30 (--foreground)
```

**Note**: Outline variant has no fill, so it's visually minimal until focus state or icon content adds emphasis.

---

#### Ghost Variant Overrides
**Base**: Duplicate Primary variant  
**Target Node**: Badge root  
**Changes**:

```
Primary → Ghost:
  1. Badge.fills[0] (background):
     From: rgb(15, 23, 42) solid
     To:   Remove fill (transparent)
  
  2. Badge.strokes[0] (border):
     From: None (keep as is)
     To:   None (no border for ghost)
  
  3. Label.fills[0] (text color):
     From: rgb(248, 250, 252) bound to VariableID:5:27
     To:   rgb(2, 6, 23) bound to VariableID:5:30 (--foreground)
```

**Note**: Ghost is the most minimal variant—text-only, no background or border. Useful for de-emphasized content.

---

#### Destructive Variant Overrides
**Base**: Duplicate Primary variant  
**Target Node**: Badge root  
**Changes**:

```
Primary → Destructive:
  1. Badge.fills[0] (background):
     From: rgb(15, 23, 42) bound to VariableID:5:26
     To:   rgb(220, 38, 38) bound to VariableID:5:31 (--bg-destructive)
  
  2. Label.fills[0] (text color):
     From: rgb(248, 250, 252) bound to VariableID:5:27
     To:   rgb(255, 255, 255) (#FFFFFF, white, hardcoded)
```

**Note**: Focus state for destructive uses error ring color (VariableID:5:32) instead of standard focus ring.

---

### ROUNDNESS AXIS: Border-Radius Changes

**When to apply**: For each variant combination (Variant × State × Icons), duplicate and modify corner radius.

#### Round Roundness Overrides
**Base**: Any variant at Default roundness  
**Target Node**: Badge root  
**Change**:

```
Default → Round:
  Badge.cornerRadius:
    From: 8 (rounded-lg)
    To:   9999 (rounded-full, pill shape)
```

**Effect**: All corners become fully rounded (pill-shaped badge). Applies to the Badge frame only; icon slots inherit.

**Verification**: Visual check that all corners are equally rounded.

---

### STATE AXIS: Focus Ring Styling

**When to apply**: For each variant/roundness/icon combination, create a Focus variant showing the focused appearance.

#### Default State (No Focus Ring)
**Already built** — node 16:2 is the baseline (no overlay, no shadows beyond default).

---

#### Focus State Overrides

**For Non-Destructive Variants** (Primary, Secondary, Outline, Ghost):  
**Base**: Any variant at Default state  
**Target Node**: Badge root  
**Changes**:

```
Default → Focus (Primary/Secondary/Outline/Ghost):
  
  Option A: Shadow-only approach (RECOMMENDED)
    1. Badge.shadows:
       Add: {
         type: 'drop',
         color: rgba(203, 213, 225, 0.5),  // --focus-ring with alpha
         offset: { x: 0, y: 0 },
         blur: 0,
         spread: 4px  // Total ring width: 2px ring + 2px offset
       }
  
  Option B: Explicit ring frame (visual clarity)
    1. Insert new Frame "FocusRing" (node 16:X):
       - Size: Badge.width + 4px, Badge.height + 4px
       - Position: offset -2px, -2px from Badge
       - Fill: None
       - Stroke: 2px, color VariableID:5:15 (--focus-ring)
       - Corner radius: Badge.cornerRadius + 2px (maintain shape)
       - Shadow: Optional soft shadow as above
    2. Reorder: FocusRing behind Badge (z-order)
  
  Option C: Combined (ring + shadow)
    1. Use both Option A (shadow) and Option B (ring frame)
       - Provides clear visual ring + soft shadow for emphasis
```

**Recommendation**: Use **Option B (Explicit ring frame)** for clarity in Figma design view, with shadow for depth.

---

**For Destructive Variant**:  
**Base**: Destructive variant at Default state  
**Target Node**: Badge root  
**Changes**:

```
Default → Focus (Destructive):
  
  1. FocusRing frame (if using Option B):
       - Stroke: 3px (thicker for error prominence)
       - Color: VariableID:5:32 (--focus-ring-error, fallback #FCA5A5)
       - Spread: 3px total
  
  2. Shadow (Option A/C):
       Add: {
         type: 'drop',
         color: rgba(252, 165, 165, 0.5),  // --focus-ring-error with alpha
         offset: { x: 0, y: 0 },
         blur: 0,
         spread: 4px
       }
```

**Verification**: 
- Focus ring visually distinct from Badge background
- Ring color matches design system focus colors
- Shadow provides depth cue

---

### ICONS AXIS: Visibility & Slot Management

**When to apply**: For each variant/roundness/state combination, toggle icon visibility.

#### None Icons (Default)
**Already built** — both `iconLeft` (node 16:3) and `iconRight` (node 16:5) are hidden.

```
Badge (COMPONENT, auto-layout, gap=6):
  ├── iconLeft (FRAME, 16×16, HIDDEN)
  ├── Label (TEXT, "Label")
  └── iconRight (FRAME, 16×16, HIDDEN)
```

---

#### Left Icons Override
**Base**: Any variant at None icons  
**Target Nodes**: iconLeft, iconRight  
**Changes**:

```
None → Left:
  1. iconLeft.hidden = false (show)
  2. iconRight.hidden = true (hide, keep as is)

Result layout:
  [Icon] Label
```

**Verification**: Icon appears left of label with 6px gap; text is readable.

---

#### Right Icons Override
**Base**: Any variant at None icons  
**Target Nodes**: iconLeft, iconRight  
**Changes**:

```
None → Right:
  1. iconLeft.hidden = true (hide, keep as is)
  2. iconRight.hidden = false (show)

Result layout:
  Label [Icon]
```

**Verification**: Icon appears right of label with 6px gap; text is readable.

---

#### Both Icons Override
**Base**: Any variant at None icons  
**Target Nodes**: iconLeft, iconRight  
**Changes**:

```
None → Both:
  1. iconLeft.hidden = false (show)
  2. iconRight.hidden = false (show)

Result layout:
  [Icon] Label [Icon]
```

**Verification**: Both icons visible with equal spacing; label remains centered.

---

## SECTION 3: VARIANT COMBINATIONS MATRIX

Total: 80 variants across 4 axes (5 Variant × 2 Roundness × 2 State × 4 Icons)

### Organized by Variant (Primary Axis)

#### Group 1: Primary Variants (16 combos)
- Variant: Primary (rgb(15, 23, 42) bg, rgb(248, 250, 252) text)
- Roundness: Default (8px), Round (9999px)
- State: Default (no ring), Focus (2px ring)
- Icons: None, Left, Right, Both

**Combo List**:
1. Primary + Default + Default + None ✓ **DEFAULT BUILT** (node 16:2)
2. Primary + Default + Default + Left
3. Primary + Default + Default + Right
4. Primary + Default + Default + Both
5. Primary + Default + Focus + None
6. Primary + Default + Focus + Left
7. Primary + Default + Focus + Right
8. Primary + Default + Focus + Both
9. Primary + Round + Default + None
10. Primary + Round + Default + Left
11. Primary + Round + Default + Right
12. Primary + Round + Default + Both
13. Primary + Round + Focus + None
14. Primary + Round + Focus + Left
15. Primary + Round + Focus + Right
16. Primary + Round + Focus + Both

---

#### Group 2: Secondary Variants (16 combos)
- Variant: Secondary (rgb(241, 245, 249) bg, rgb(15, 23, 42) text)
- Roundness: Default (8px), Round (9999px)
- State: Default (no ring), Focus (2px ring)
- Icons: None, Left, Right, Both

**Combo List**:
1. Secondary + Default + Default + None
2. Secondary + Default + Default + Left
3. Secondary + Default + Default + Right
4. Secondary + Default + Default + Both
5. Secondary + Default + Focus + None
6. Secondary + Default + Focus + Left
7. Secondary + Default + Focus + Right
8. Secondary + Default + Focus + Both
9. Secondary + Round + Default + None
10. Secondary + Round + Default + Left
11. Secondary + Round + Default + Right
12. Secondary + Round + Default + Both
13. Secondary + Round + Focus + None
14. Secondary + Round + Focus + Left
15. Secondary + Round + Focus + Right
16. Secondary + Round + Focus + Both

**Overrides from Primary**:
- Background: VariableID:5:26 → VariableID:5:28
- Text: VariableID:5:27 → VariableID:5:29

---

#### Group 3: Outline Variants (16 combos)
- Variant: Outline (transparent bg, border, rgb(2, 6, 23) text)
- Roundness: Default (8px), Round (9999px)
- State: Default (no ring), Focus (2px ring)
- Icons: None, Left, Right, Both

**Combo List**:
1. Outline + Default + Default + None
2. Outline + Default + Default + Left
3. Outline + Default + Default + Right
4. Outline + Default + Default + Both
5. Outline + Default + Focus + None
6. Outline + Default + Focus + Left
7. Outline + Default + Focus + Right
8. Outline + Default + Focus + Both
9. Outline + Round + Default + None
10. Outline + Round + Default + Left
11. Outline + Round + Default + Right
12. Outline + Round + Default + Both
13. Outline + Round + Focus + None
14. Outline + Round + Focus + Left
15. Outline + Round + Focus + Right
16. Outline + Round + Focus + Both

**Overrides from Primary**:
- Background: Remove fill (transparent)
- Border: Add 1px stroke, VariableID:5:14
- Text: VariableID:5:27 → VariableID:5:30

---

#### Group 4: Ghost Variants (16 combos)
- Variant: Ghost (transparent bg, no border, rgb(2, 6, 23) text)
- Roundness: Default (8px), Round (9999px)
- State: Default (no ring), Focus (2px ring)
- Icons: None, Left, Right, Both

**Combo List**:
1. Ghost + Default + Default + None
2. Ghost + Default + Default + Left
3. Ghost + Default + Default + Right
4. Ghost + Default + Default + Both
5. Ghost + Default + Focus + None
6. Ghost + Default + Focus + Left
7. Ghost + Default + Focus + Right
8. Ghost + Default + Focus + Both
9. Ghost + Round + Default + None
10. Ghost + Round + Default + Left
11. Ghost + Round + Default + Right
12. Ghost + Round + Default + Both
13. Ghost + Round + Focus + None
14. Ghost + Round + Focus + Left
15. Ghost + Round + Focus + Right
16. Ghost + Round + Focus + Both

**Overrides from Primary**:
- Background: Remove fill (transparent)
- Border: Keep as is (none)
- Text: VariableID:5:27 → VariableID:5:30

---

#### Group 5: Destructive Variants (16 combos)
- Variant: Destructive (rgb(220, 38, 38) bg, rgb(255, 255, 255) text)
- Roundness: Default (8px), Round (9999px)
- State: Default (no ring), Focus (3px error ring)
- Icons: None, Left, Right, Both

**Combo List**:
1. Destructive + Default + Default + None
2. Destructive + Default + Default + Left
3. Destructive + Default + Default + Right
4. Destructive + Default + Default + Both
5. Destructive + Default + Focus + None (with 3px error ring)
6. Destructive + Default + Focus + Left (with 3px error ring)
7. Destructive + Default + Focus + Right (with 3px error ring)
8. Destructive + Default + Focus + Both (with 3px error ring)
9. Destructive + Round + Default + None
10. Destructive + Round + Default + Left
11. Destructive + Round + Default + Right
12. Destructive + Round + Default + Both
13. Destructive + Round + Focus + None (with 3px error ring)
14. Destructive + Round + Focus + Left (with 3px error ring)
15. Destructive + Round + Focus + Right (with 3px error ring)
16. Destructive + Round + Focus + Both (with 3px error ring)

**Overrides from Primary**:
- Background: VariableID:5:26 → VariableID:5:31
- Text: VariableID:5:27 → #FFFFFF (white, hardcoded)
- Focus ring: VariableID:5:32 (error ring) instead of VariableID:5:15

---

## SECTION 4: REPRESENTATIVE VARIANTS FOR SCREENSHOTS [REP]

To validate the override plan, capture these 10 representative variants visually in Figma. These cover all axes and major combinations:

| # | Variant | Roundness | State | Icons | Figma Name | Purpose |
|----|---------|-----------|-------|-------|-----------|---------|
| 1 | Primary | Default | Default | None | Primary/Default/Default/None | [REP] Default baseline (already built) |
| 2 | Secondary | Default | Default | None | Secondary/Default/Default/None | [REP] Validate color override (light bg) |
| 3 | Outline | Default | Default | None | Outline/Default/Default/None | [REP] Validate transparent + border |
| 4 | Ghost | Default | Default | None | Ghost/Default/Default/None | [REP] Validate minimal text-only variant |
| 5 | Destructive | Default | Default | None | Destructive/Default/Default/None | [REP] Validate error colors + contrast |
| 6 | Primary | Round | Default | None | Primary/Round/Default/None | [REP] Validate roundness (pill shape) |
| 7 | Primary | Default | Focus | None | Primary/Default/Focus/None | [REP] Validate focus ring (2px) |
| 8 | Destructive | Default | Focus | None | Destructive/Default/Focus/None | [REP] Validate error focus ring (3px) |
| 9 | Primary | Default | Default | Both | Primary/Default/Default/Both | [REP] Validate icon layout (both sides) |
| 10 | Secondary | Round | Focus | Left | Secondary/Round/Focus/Left | [REP] Complex combo validation |

**Acceptance Criteria for Screenshots**:
- ✅ All colors match design tokens (use variable inspector)
- ✅ Border radius correct (measure or toggle roundness)
- ✅ Focus rings visible and colored correctly
- ✅ Icon slots positioned with 6px gap
- ✅ Text readable with sufficient contrast
- ✅ Padding and spacing matches 3px (vertical) × 8px (horizontal)

---

## SECTION 5: BUILD INSTRUCTION SUMMARY

### Prerequisites
- ✅ Default variant built (node 16:2): Primary + Default + Default + None
- ✅ Icon slots created but hidden (iconLeft: 16:3, iconRight: 16:5)
- ✅ Design variables linked (VariableID:5:26–5:32 and VariableID:5:14–5:15)
- ✅ Component set structure defined (Badge → sub-variants)

### Build Steps (Sequential)

#### Phase 1: Create Variant Groups (1-2 days)
1. **Create Primary variant folder** (variants under Badge component):
   - Roundness: [Default, Round] (2 subfolders)
   - State: [Default, Focus] (4 combos per roundness)
   - Icons: [None, Left, Right, Both] (16 combos per state)
   - **Total: 16 Primary variants** (1 already built, 15 new)

2. **Create Secondary variant folder** (duplicate Primary group):
   - Start from Primary variants
   - Override colors: bg VariableID:5:28, text VariableID:5:29
   - Keep all roundness, state, icons structure
   - **Total: 16 Secondary variants** (all new)

3. **Create Outline variant folder** (duplicate Primary group):
   - Remove background fill
   - Add 1px border stroke: VariableID:5:14
   - Update text: VariableID:5:30
   - Keep roundness, state, icons structure
   - **Total: 16 Outline variants** (all new)

4. **Create Ghost variant folder** (duplicate Primary group):
   - Remove background fill
   - Remove border
   - Update text: VariableID:5:30
   - Keep roundness, state, icons structure
   - **Total: 16 Ghost variants** (all new)

5. **Create Destructive variant folder** (duplicate Primary group):
   - Override colors: bg VariableID:5:31, text #FFFFFF
   - Update focus ring: VariableID:5:32 (error color)
   - Keep roundness, state, icons structure
   - **Total: 16 Destructive variants** (all new)

#### Phase 2: Apply Roundness & State Overrides (1-2 days)
6. **For each variant group** (Secondary, Outline, Ghost, Destructive only; Primary is template):
   - **Round roundness variants**: Duplicate Default roundness variants, change cornerRadius 8px → 9999px
   - **Focus state variants**: Duplicate Default state variants, add focus ring (2px for non-destructive, 3px for destructive)

#### Phase 3: Apply Icon Overrides (1 day)
7. **For each variant/roundness/state combo** (all groups):
   - **Left icons**: Show iconLeft, hide iconRight
   - **Right icons**: Hide iconLeft, show iconRight
   - **Both icons**: Show both

#### Phase 4: Validation & Documentation (1 day)
8. **Validate representative variants** (10 marked [REP] above)
   - Check colors, spacing, contrast, focus rings
   - Take screenshots and compare against design specs
9. **Document variant naming** in Figma (use consistent Figma names for reference)
10. **Create component set** with all 80 variants organized by axes

### Estimated Effort
- **Phase 1**: 8–10 hours (variant groups + color overrides)
- **Phase 2**: 6–8 hours (roundness + focus rings)
- **Phase 3**: 4–6 hours (icon visibility toggles)
- **Phase 4**: 2–3 hours (validation + documentation)
- **Total**: ~20–27 hours (3–4 days with breaks)

### Figma File Organization
```
Figma Design File: carton-case-management-ui.fig

Components Page:
  Badge (COMPONENT SET)
    ├── Badge/Variant=Primary
    │   ├── Badge/Variant=Primary/Roundness=Default
    │   │   ├── Badge/Variant=Primary/Roundness=Default/State=Default/Icons=None ✓ (node 16:2)
    │   │   ├── Badge/Variant=Primary/Roundness=Default/State=Default/Icons=Left
    │   │   ├── Badge/Variant=Primary/Roundness=Default/State=Default/Icons=Right
    │   │   ├── Badge/Variant=Primary/Roundness=Default/State=Default/Icons=Both
    │   │   ├── Badge/Variant=Primary/Roundness=Default/State=Focus/Icons=None
    │   │   ├── ... (8 more)
    │   └── Badge/Variant=Primary/Roundness=Round
    │       └── (8 variants: Default + Focus, × 4 Icons)
    ├── Badge/Variant=Secondary
    │   └── (16 variants: same structure)
    ├── Badge/Variant=Outline
    │   └── (16 variants: same structure)
    ├── Badge/Variant=Ghost
    │   └── (16 variants: same structure)
    └── Badge/Variant=Destructive
        └── (16 variants: same structure)

Total: 80 variants
```

---

## SECTION 6: OVERRIDE CHECKLIST

Use this checklist to verify each variant during build:

### Variant Overrides
- [ ] Primary (default, verify reference)
- [ ] Secondary (bg:28, text:29)
- [ ] Outline (transparent fill, border:14, text:30)
- [ ] Ghost (transparent, no border, text:30)
- [ ] Destructive (bg:31, text:#FFFFFF)

### Roundness Overrides
- [ ] Default (8px, reference)
- [ ] Round (9999px)

### State Overrides
- [ ] Default (no ring, reference)
- [ ] Focus + Primary/Secondary/Outline/Ghost (2px ring, VariableID:5:15)
- [ ] Focus + Destructive (3px ring, VariableID:5:32)

### Icons Overrides
- [ ] None (both hidden, reference)
- [ ] Left (iconLeft visible, iconRight hidden)
- [ ] Right (iconLeft hidden, iconRight visible)
- [ ] Both (both visible)

### Color & Contrast Verification
- [ ] Primary: white text on dark bg (WCAG AAA ✓)
- [ ] Secondary: dark text on light bg (WCAG AAA ✓)
- [ ] Outline: dark text, visible 1px border (WCAG AA ✓)
- [ ] Ghost: dark text, minimal design (WCAG AA ✓)
- [ ] Destructive: white text on red bg (WCAG AA ✓)

### Focus Ring Verification
- [ ] Primary/Secondary/Outline/Ghost focus: 2px ring with VariableID:5:15
- [ ] Destructive focus: 3px ring with VariableID:5:32
- [ ] Ring visible and offset 2px from component edge

### Icon Layout Verification
- [ ] Left icons: Icon left of label, 6px gap
- [ ] Right icons: Icon right of label, 6px gap
- [ ] Both icons: Icons on both sides, label centered, 6px gaps

---

## APPENDIX: Variable Mappings Reference

| Variable ID | CSS Variable | Fallback Color | Usage |
|-------------|-------------|----------------|--------|
| VariableID:5:26 | --bg-primary | rgb(15, 23, 42) | Primary variant background |
| VariableID:5:27 | --text-primary-foreground | rgb(248, 250, 252) | Primary variant text |
| VariableID:5:28 | --bg-secondary | rgb(241, 245, 249) | Secondary variant background |
| VariableID:5:29 | --text-secondary-foreground | rgb(15, 23, 42) | Secondary variant text |
| VariableID:5:30 | --foreground | rgb(2, 6, 23) | Outline/Ghost text |
| VariableID:5:31 | --bg-destructive | rgb(220, 38, 38) | Destructive variant background |
| VariableID:5:32 | --focus-ring-error | #FCA5A5 | Destructive focus ring |
| VariableID:5:14 | --border | (calc from design) | Outline variant border |
| VariableID:5:15 | --focus-ring | #CBD5E1 | Standard focus ring |

---

## NEXT STEPS FOR IMPLEMENTATION

1. **Review this plan** with the design team for approval
2. **Prepare Figma file** (ensure all design variables are linked)
3. **Build variants iteratively** (Phase 1-4 above)
4. **Capture representative screenshots** (10 marked [REP])
5. **Validate against acceptance criteria**
6. **Generate component set documentation** for developers
7. **Sync Code Connect mappings** to React Badge component
