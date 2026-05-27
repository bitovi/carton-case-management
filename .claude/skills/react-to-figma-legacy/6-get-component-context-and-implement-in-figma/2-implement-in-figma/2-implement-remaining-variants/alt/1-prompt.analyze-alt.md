# 6 Get Component Context and Implement in Figma
## 6.2 Implement in Figma
### 6.2.2 Implement Remaining Variants
#### ALT 6.2.2.1 Analyze Remaining Variants (Non-Tailwind Support)

**Begin your response by outputting the heading lines above verbatim.**

> **Status**: Planning notes only — not called by any orchestrator.
>
> This documents what would need to change in `1-prompt.analyze.md`
> to support non-Tailwind React apps.

## Current Approach: Entirely Tailwind-Based

The entire diffing procedure is Tailwind-specific:

```
Step 2a: `variants.md` lists Tailwind classes per combo. Diff each combo's classes
         against the default combo's classes. Each changed class = a property override.

Step 2b: For each changed Tailwind class → look up in figma-variables-map.json
```

Example from the current prompt:
```
Default:     bg-primary text-primary-foreground rounded-md px-4 py-2
Destructive: bg-destructive text-destructive-foreground rounded-md px-6 py-3
Diff:        bg-primary → bg-destructive, px-4 → px-6, py-2 → py-3
```

**For non-Tailwind apps, there are no class names to diff.**

## Proposed Alternative: Computed CSS Diffing

### If `.styles.json` is available (preferred)

Use a script to produce the diff programmatically:

```bash
node diff-variant-styles.js \
  --default screenshots/VariantPrimary.styles.json \
  --variant screenshots/VariantDestructive.styles.json \
  --output variant-diff-destructive.json
```

Output:
```json
{
  "combo": { "Variant": "Destructive" },
  "diffs": [
    {
      "selector": "span.inline-flex",
      "property": "background-color",
      "default": "rgb(15, 23, 42)",
      "variant": "rgb(220, 38, 38)"
    },
    {
      "selector": "span.inline-flex",
      "property": "color",
      "default": "rgb(248, 250, 252)",
      "variant": "rgb(255, 255, 255)"
    }
  ]
}
```

Then the analyze prompt maps each diff entry to a Figma variable using `figma-variables-map.json`
reverse lookup (by computed RGB → variable ID).

### If `.styles.md` only (current format)

The LLM reads both `.styles.md` files and manually diffs them line-by-line.
This works but is error-prone — the LLM might miss subtle differences in long CSS lists.

**This is why JSON output matters**: programmatic diffing catches every property change
without relying on LLM attention span over hundreds of CSS lines.

## Proposed Procedure (replacing steps 2a and 2b)

```
### 2. For each remaining combo

a) Diff computed styles against the default

   If `.styles.json` files exist:
     Run `diff-variant-styles.js` to get a structured diff.

   If only `.styles.md` files exist:
     Compare the computed CSS for each node between the default and this combo.
     Focus on: background-color, color, border-*, border-radius, padding-*, gap,
     width, height, opacity, box-shadow, font-*.

b) Map diffs to Figma variables

   For each changed property:
   1. Look up the NEW computed value in `figma-variables-map.json` (by computed RGB)
   2. If no match, record the raw computed value as a fallback
   3. Record: { node, property, newVariableId OR newFallbackRgb }

c) View the screenshot (unchanged from current)

d) Record override plan (unchanged from current)
```

## Script Needed: `diff-variant-styles.js`

Would live alongside `capture-storybook-variants.js`. Takes two `.styles.json` files,
diffs every property per node, and outputs only the differences.

Key design decisions:
- Match nodes by **DOM path position** (depth + child index), not by class name
  (class names may differ between variants)
- Ignore properties that are Storybook wrapper artifacts (margin on the root div)
- Normalize RGB values for comparison (strip spaces: `rgb(15, 23, 42)` → `rgb(15,23,42)`)

## Cascade Impact

- `capture-storybook-variants.js` needs to output `.styles.json` alongside `.styles.md`
- `figma-variables-map.json` needs computed RGB reverse lookup keys
- A new `diff-variant-styles.js` script is needed
- `variants.md` format may need a `computedStyles` section per combo (or the analyze
  prompt reads `.styles.json` directly, which is cleaner)
