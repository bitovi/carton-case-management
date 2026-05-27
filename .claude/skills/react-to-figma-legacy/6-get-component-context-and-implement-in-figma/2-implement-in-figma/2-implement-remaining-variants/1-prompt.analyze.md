# 6 Get Component Context and Implement in Figma
## 6.2 Implement in Figma
### 6.2.2 Implement Remaining Variants
#### 6.2.2.1 Analyze Remaining Variants

**Begin your response by outputting the heading lines above verbatim.**

Produce override plans for every non-default variant combo. Each plan describes ONLY what differs from the proven default variant.

## Inputs

| Input | Description |
|-------|-------------|
| `build-plan.md` | Complete build plan with `allCombos`, frame tree, style properties |
| `default-variant/figma-result.md` | Proven default's node ID and structure |
| `figma-variants.md` | Figma variant axes, React↔Figma mappings, representative screenshots |
| `variants.md` | Full code-level variant enumeration (Tailwind classes per combo) |
| `screenshots/*.png` | React PNGs for every variant combo |
| `screenshots/*.html.md` | Storybook HTML structure per variant (exact text content for each variant) |
| `figma-variables-map.json` | Tailwind class → Figma variable ID |

## Output

Write `variant-plans.md` to the component directory.

## Procedure

### 1. Enumerate remaining combos

From `build-plan.md` → `allCombos`, remove `defaultCombo`. These are the combos to plan.

### 2. For each remaining combo

Compare the combo against the default:

**a) Identify property differences from `variants.md`**

`variants.md` lists Tailwind classes per combo. Diff each combo's classes against the default combo's classes. Each changed class = a property override.

Example:
- Default: `bg-primary text-primary-foreground rounded-md px-4 py-2`
- Combo `{ Variant: 'destructive', Size: 'lg' }`: `bg-destructive text-destructive-foreground rounded-md px-6 py-3`
- Diff: `bg-primary → bg-destructive`, `text-primary-foreground → text-destructive-foreground`, `px-4 → px-6`, `py-2 → py-3`

**b) Translate diffs to Figma properties**

For each changed Tailwind class:
1. Look up in `figma-variables-map.json` → get new variable ID
2. Map to Figma property using `tailwind-figma-map.md` (from reference/)
3. Record: `{ node, property, newVariableId, newFallbackRgb }`

**c) Extract text content**

Read `screenshots/{comboScreenshot}.html.md` (the `.html.md` file matching the screenshot name, without `.png`). Extract all text content from the HTML structure. Compare against the default variant's text. Record any differences as text overrides: `{ findBy: "{defaultText}", characters: "{variantText}" }`.

**d) View the screenshot**

View `screenshots/{comboScreenshot}` and compare against the default screenshot. Note any structural differences:
- Children appearing/disappearing (conditional rendering)
- Icon changes
- Visibility changes

**e) Record override plan**

For each combo, produce:
- Combo identity: `{ axisName: value, ... }`
- Property overrides table
- Structural overrides (if any)
- Screenshot filename for verification

### 3. Write variant-plans.md

```markdown
# Variant Plans: {componentName}

## Default Reference
- **Node ID**: {from default-variant/figma-result.md}
- **Combo**: {defaultCombo JSON}

## Variant Axes
{from figma-variants.md}

| Axis | Values |
|------|--------|
| Variant | primary, secondary, destructive, outline, ghost |
| Size | sm, default, lg, icon |

---

## Combo: {comboName}

**Figma Properties**: `{ Variant: 'destructive', Size: 'default' }`

### Property Overrides

| Node | Property | Default Value | New Value | Variable ID |
|------|----------|--------------|-----------|-------------|
| root | fills[0] | bg-primary / VariableID:5:10 | bg-destructive / VariableID:5:20 | VariableID:5:20 |
| label | fills[0] | text-primary-foreground / VariableID:5:11 | text-destructive-foreground / VariableID:5:21 | VariableID:5:21 |

### Structural Overrides

{NONE if no structural changes}

| Change | Description |
|--------|-------------|
| Icon hidden | Set `iconInstance.visible = false` |
| Text changed | label.characters = "Delete" |

### Verification Screenshot
`screenshots/{filename}`

---

## Combo: {next combo}
...
```

## Rules

- **Override plan = DIFF only** — do not repeat properties that stay the same as default
- If a combo has NO property differences (only structural), still record it
- If `figma-variants.md` specifies a Figma axis value mapping (React `"sm"` → Figma `"Small"`), use the Figma axis value
- Group combos by primary axis if it aids readability
- When a variable ID is not found for a changed class, record `variableId: null` with the fallback RGB value
