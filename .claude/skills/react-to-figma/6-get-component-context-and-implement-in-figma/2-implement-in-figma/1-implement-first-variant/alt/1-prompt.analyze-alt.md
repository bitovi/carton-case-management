# 6 Get Component Context and Implement in Figma
## 6.2 Implement in Figma
### 6.2.1 Implement First Variant
#### ALT 6.2.1.1 Analyze Default Variant (Non-Tailwind Support)

**Begin your response by outputting the heading lines above verbatim.**

> **Status**: Planning notes only — not called by any orchestrator.
>
> This documents what would need to change in `1-prompt.analyze.md`
> to support non-Tailwind React apps.

## Current Tailwind-Specific Sections

### Step 5: Resolve variable bindings

This is the only Tailwind-dependent step. Currently:

```
1. Identify the Tailwind class from `variants.md` or computed style from `app-context/*.styles.md`
2. Look up in `figma-variables-map.json`:
   - Try class-based keys: `bg-primary`, `text-muted-foreground`, `border-input`
   - Try CSS var keys: `var(--primary)`, `--primary`
3. Record: `{ property, tailwindClass, variableId, fallbackRgb }`
```

**What to change**: Replace the Tailwind-first lookup with a computed-value-first approach:

```
1. Get the computed CSS value from `.styles.md` (or `.styles.json` if available)
   e.g., background-color: rgb(15, 23, 42)
2. Look up in `figma-variables-map.json` using multiple key strategies:
   a. Tailwind class key (if available in variants.md): `bg-primary`
   b. CSS custom property key: `var(--primary)`, `--primary`
   c. Computed RGB key: `rgb(15, 23, 42)` → match against variable fallback values
   d. Semantic name key: `primary`, `destructive` (inferred from prop values)
3. Record: `{ property, computedValue, variableId, fallbackRgb }`
```

The key insight: `figma-variables-map.json` would need **reverse lookup by computed RGB value**
in addition to its current class-name-based keys.

### Step 7: Write build-plan.md

The Style Properties table currently has a "Tailwind Class" column:

```
| Node | Property | Value | Tailwind Class | Variable ID | Fallback RGB |
```

**What to change**: Replace "Tailwind Class" with "Style Source" — a generic identifier:

```
| Node | Property | Value | Style Source | Variable ID | Fallback RGB |
```

Where "Style Source" could be:
- A Tailwind class: `bg-primary`
- A CSS custom property: `var(--primary)`
- A computed value: `rgb(15, 23, 42)`
- A semantic name: `variant:primary`

The build prompts downstream only use the Variable ID and Fallback RGB columns, so
this column is informational. The change is non-breaking.

## `figma-variables-map.json` Changes Needed

Current format (Tailwind-keyed):
```json
{
  "bg-primary": { "variableId": "VariableID:5:26", "fallbackRgb": { "r": 0.059, "g": 0.09, "b": 0.165 } },
  "text-primary-foreground": { "variableId": "VariableID:5:27", "fallbackRgb": { "r": 0.973, "g": 0.98, "b": 0.988 } }
}
```

Proposed format (multi-keyed):
```json
{
  "bg-primary": { "variableId": "VariableID:5:26", "fallbackRgb": { "r": 0.059, "g": 0.09, "b": 0.165 } },
  "var(--primary)": { "variableId": "VariableID:5:26", "fallbackRgb": { "r": 0.059, "g": 0.09, "b": 0.165 } },
  "rgb(15, 23, 42)": { "variableId": "VariableID:5:26", "fallbackRgb": { "r": 0.059, "g": 0.09, "b": 0.165 } }
}
```

Or structured with a lookup index:
```json
{
  "variables": {
    "VariableID:5:26": { "name": "primary", "fallbackRgb": { "r": 0.059, "g": 0.09, "b": 0.165 } }
  },
  "byTailwindClass": { "bg-primary": "VariableID:5:26" },
  "byCssVar": { "var(--primary)": "VariableID:5:26" },
  "byComputedRgb": { "rgb(15,23,42)": "VariableID:5:26" }
}
```

The generation of `figma-variables-map.json` happens in Phase 5 (`5-map-figma-resources`).
That prompt would also need a `-alt.md` to add computed RGB reverse lookup generation.
