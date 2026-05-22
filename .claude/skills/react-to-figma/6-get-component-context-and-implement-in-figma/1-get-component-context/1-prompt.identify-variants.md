# Identify Variants

Analyze a single React component to identify ALL visual states that Figma needs as variants. Goes beyond the props interface to find CSS-driven and hook-driven states.

## Inputs

- **Component name**: PascalCase name (e.g., `Button`)
- **Source file path**: Path to the component source (e.g., `src/components/ui/button.tsx`)
- **analysis.md**: Contents of `.temp/react-to-figma/components/{Name}/analysis.md`
- **props.md**: Contents of `.temp/react-to-figma/components/{Name}/props.md`
- **Output directory**: `.temp/react-to-figma/components/{Name}/`
- **pages.md** (optional): Contents of `.temp/react-to-figma/component-hierarchy/pages.md` — shows which routes render this component and with what resolved props
- **app-context/** (optional): `.temp/react-to-figma/components/{Name}/app-context/` — live app element screenshots, HTML structure, and computed CSS from Phase 1's app crawl

## Procedure

### 1. Read the component source code

Read the full source file. Also read any related files:
- CSS/SCSS modules imported by the component
- CVA (class-variance-authority) variant definitions
- Tailwind `cn()` / `clsx()` conditional class expressions
- Custom hook files imported by the component

If `pages.md` is provided, find all routes where this component appears and note the distinct prop values it receives across routes. This reveals which variant axes are actually exercised in production (e.g., `status="open"` on one route, `status="closed"` on another).

If `app-context/` captures exist, review the element screenshots and HTML structure to understand how the component actually renders with real data. The `.html.md` files show the DOM structure stopping at child component boundaries. The `.styles.md` files show computed CSS for all owned elements.

### 2. Extract prop-driven variants

From `props.md` and the source code, find props that control visual appearance:

| What to look for | Example | Variant axis |
|-----------------|---------|-------------|
| Union type props | `variant: "primary" \| "secondary" \| "ghost"` | Variant |
| Size props | `size: "sm" \| "md" \| "lg"` | Size |
| Boolean appearance props | `disabled: boolean`, `loading: boolean` | State |
| Enum-like props | `status: "success" \| "warning" \| "error"` | Status |
| Roundness/shape props | `roundness: "default" \| "round"` | Shape |

**CVA variants**: If the component uses `cva()`, the variant definition object directly maps to Figma variant axes:
```typescript
const buttonVariants = cva("base-classes", {
  variants: {
    variant: { primary: "...", secondary: "...", ghost: "..." },
    size: { sm: "...", md: "...", lg: "..." },
  }
})
```
Extract each key in `variants` as an axis, each value as an option.

### 3. Extract interaction states

Search the component and its CSS for interaction-driven visual changes:

| Source | What to look for | Variant value |
|--------|-----------------|---------------|
| CSS pseudo-classes | `:hover`, `:focus`, `:focus-visible`, `:active`, `:focus-within` | hover, focus, active |
| CSS attribute selectors | `[disabled]`, `[data-state="open"]` | disabled, open |
| Tailwind hover/focus | `hover:bg-...`, `focus:ring-...`, `active:scale-...` | hover, focus, active |
| JS state | `useState` for `isOpen`, `isHovered`, `isFocused` | open, hovered, focused |
| Disabled prop | `disabled` attribute on root element | disabled |
| ARIA states | `aria-selected`, `aria-expanded`, `aria-checked` | selected, expanded, checked |

Group these into a **State** axis with values like: `default`, `hover`, `focus`, `active`, `disabled`.

### 4. Extract content states

For components that display data, identify content-dependent states:

| State | How to detect |
|-------|--------------|
| **empty** | Conditional rendering on empty data (`items.length === 0`, `!data`) |
| **loading** | Loading spinner/skeleton shown (`isLoading`, `isPending`, `<Skeleton>`) |
| **error** | Error UI shown (`isError`, `error`, `<ErrorMessage>`) |
| **loaded** | Normal data display (default path) |
| **overflow** | Truncation, scroll, or "show more" logic |

### 5. Identify slots and children

For non-leaf components, determine which children are visually significant:

| Slot type | Detection | Figma equivalent |
|-----------|-----------|-----------------|
| `children` (text) | `children` prop rendered as text content | Text content |
| `children` (ReactNode) | `children` prop rendered as nested components | INSTANCE_SWAP |
| Named slots | Props like `icon`, `leftIcon`, `rightIcon`, `header`, `footer` | INSTANCE_SWAP |
| Render props | `renderItem`, `render` function props | INSTANCE_SWAP |

For each slot, determine if it creates visual variants:
- Icon present vs absent
- Different icon positions (left, right, both)
- With/without header, footer, etc.

### 6. Build variant matrix

Combine all axes into a variant matrix. Determine which combinations are:
- **Meaningful**: Produce visually distinct results (include)
- **Redundant**: Produce identical visuals to another combination (exclude)
- **Impossible**: Logically invalid (e.g., `loading` + `disabled` might be meaningless) (exclude)

**Pruning rules**:
- If `disabled` overrides all other states (hover, focus, active have no effect when disabled), don't generate disabled+hover, disabled+focus, etc.
- If a size prop doesn't affect interaction states, one interaction state per size is sufficient as a spot-check — generate all sizes at `default` state, then all states at one representative size
- For slots, generate: without slot, with slot populated (one representative example)

**Representative set algorithm** (for screenshots/validation — Figma should still build all combinations):

When the full combination count exceeds 30, use the representative set to select which variants to screenshot: `1 + SUM(values_per_axis - 1)`. Start with one "default" combination (all axes at their default values), then for each axis, add one variant per non-default value while keeping all other axes at default.

Example: `size: sm|md|lg` × `variant: primary|secondary|outline` × `state: default|hover|disabled` = 27 full combos → representative set = `1 + (3-1) + (3-1) + (3-1) = 7`:
1. size=md, variant=primary, state=default (baseline)
2. size=sm, variant=primary, state=default (size axis)
3. size=lg, variant=primary, state=default (size axis)
4. size=md, variant=secondary, state=default (variant axis)
5. size=md, variant=outline, state=default (variant axis)
6. size=md, variant=primary, state=hover (state axis)
7. size=md, variant=primary, state=disabled (state axis)

This ensures every distinct visual treatment is captured at least once. Mark representative variants with `[REP]` in `variants.md` so downstream prompts know which to prioritize for screenshots.

**Budget cap**: If representative set still exceeds 30, prioritize prop-driven variants over interaction states.

### 7. Write `variants.md`

Write to `.temp/react-to-figma/components/{Name}/variants.md`:

```markdown
# {ComponentName} Variants

## Variant Axes
| Axis | Values | Source |
|------|--------|--------|
| Variant | primary, secondary, outline, ghost, destructive | prop: variant (CVA) |
| Size | sm, md, lg | prop: size (CVA) |
| State | default, hover, focus, active, disabled | CSS pseudo + prop |
| Roundness | default, round | prop: roundness |

## Slots
| Slot | Type | Required | Default | Creates Variants |
|------|------|----------|---------|-----------------|
| children | text | no | — | no (use placeholder text) |
| leftIcon | ReactNode | no | — | yes (with/without) |
| rightIcon | ReactNode | no | — | yes (with/without) |

## Variant Combinations ({count} total)

### Core variants (all axis combinations)
- [ ] variant=primary, size=md, state=default
- [ ] variant=primary, size=md, state=hover
- [ ] variant=primary, size=md, state=focus
- [ ] variant=primary, size=md, state=active
- [ ] variant=primary, size=md, state=disabled
- [ ] variant=secondary, size=md, state=default
...

### Size variants (one state per size, to show size differences)
- [ ] variant=primary, size=sm, state=default
- [ ] variant=primary, size=md, state=default
- [ ] variant=primary, size=lg, state=default

### Slot variants
- [ ] variant=primary, size=md, state=default, leftIcon=true
- [ ] variant=primary, size=md, state=default, rightIcon=true
- [ ] variant=primary, size=md, state=default, leftIcon=true, rightIcon=true

### Content state variants (if applicable)
- [ ] state=loading
- [ ] state=error
- [ ] state=empty

## Pruned Combinations
{List combinations excluded and why}
- disabled+hover: disabled overrides hover styles
- disabled+focus: disabled overrides focus styles
```

### 8. Return summary

```
Variant identification complete: {ComponentName}
- Variant axes: {count}
- Slots: {count}
- Total combinations: {count} ({pruned_count} pruned)
- Content states: {count}
- Output: .temp/react-to-figma/components/{Name}/variants.md
```
