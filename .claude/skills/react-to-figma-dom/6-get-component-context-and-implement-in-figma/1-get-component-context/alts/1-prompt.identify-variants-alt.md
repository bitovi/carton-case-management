# 6 Get Component Context and Implement in Figma
## 6.1 Get Component Context
### ALT 6.1.1 Identify Variants (Non-Tailwind Support)

**Begin your response by outputting the heading lines above verbatim.**

> **Status**: Planning notes only — not called by any orchestrator.
>
> This documents what would need to change in `1-prompt.identify-variants.md`
> to support non-Tailwind React apps (CSS modules, styled-components, vanilla CSS, etc.).

## Current Tailwind-Specific Sections

### Step 1: Read the component source code

Currently looks for:
- CVA (class-variance-authority) variant definitions
- Tailwind `cn()` / `clsx()` conditional class expressions

**What to change**: Add detection for other styling patterns:
- CSS modules: `styles.primary`, `styles[variant]`, `styles.container`
- styled-components: `const StyledButton = styled.button<{ variant: string }>` with conditional logic in template literals
- Emotion: `css` prop or `styled` calls with interpolations
- Vanilla CSS: className concatenation with string literals (`className={"btn btn-" + variant}`)
- CSS custom properties set via `style` prop: `style={{ '--bg': tokens[variant] }}`

### Step 2: Extract prop-driven variants

Currently relies on CVA `variants` object for axis extraction.

**What to change**: Add a fallback chain:
1. **CVA** — extract directly from `variants` object (current behavior)
2. **Switch/if on prop** — detect `switch(variant)` or `if(variant === 'x')` blocks that change className or style
3. **Object lookup** — detect `const variantStyles = { primary: '...', secondary: '...' }` patterns
4. **Computed styles fallback** — if no code-level variant detection works, rely on `.styles.json` diffs from screenshots to infer variant axes post-capture

### Step 3: Extract interaction states

Currently looks for:
- `hover:bg-...`, `focus:ring-...`, `active:scale-...` (Tailwind hover/focus prefixes)

**What to change**: Add detection for:
- CSS pseudo-classes in imported stylesheets (`.button:hover { ... }`)
- styled-components `&:hover { ... }` blocks
- CSS module pseudo-classes
- This step already checks JS state (`useState`) and ARIA states — those parts are framework-agnostic

### Step 7: Write `variants.md`

Currently outputs Tailwind classes per combo.

**What to change**: The output format needs a framework-agnostic column. Instead of (or in addition to) Tailwind classes, record:
- **Style key**: A stable identifier for the style change (e.g., `bg:primary`, `text:white`, `radius:full`)
- **Expected computed values**: The CSS property + expected resolved value (e.g., `background-color: rgb(15, 23, 42)`)

This would let the downstream analyze prompts diff on computed values rather than class names.

## Cascade Impact

If `variants.md` stops outputting Tailwind classes, these downstream consumers also need updates:
- `2-implement-in-figma/1-implement-first-variant/1-prompt.analyze.md` (step 5: variable binding resolution)
- `2-implement-in-figma/2-implement-remaining-variants/1-prompt.analyze.md` (entire diffing approach)
- `figma-variables-map.json` would need computed-value keys alongside Tailwind keys

## JSON Computed Styles Consideration

If `.styles.md` were output as `.styles.json` instead, a script could programmatically diff
two variants and produce a structured property override list. This would:
- Remove the need for LLM-based CSS parsing in the analyze prompts
- Enable exact property-level diffing (no missed changes)
- Make `figma-variables-map.json` lookups work on computed RGB values

See `3-prompt.capture-variant-screenshots-alt.md` for the JSON format proposal.
