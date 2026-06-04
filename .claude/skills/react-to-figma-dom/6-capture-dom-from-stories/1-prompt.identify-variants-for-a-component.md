# 6 Get Component Context and Implement in Figma
## 6.1 Get Component Context
### 6.1.1 Identify Variants

**Begin your response by outputting the heading lines above verbatim.**

Analyze a single React component to identify ALL visual states that Figma needs as variants. Goes beyond the props interface to find CSS-driven and hook-driven states.

## Inputs

- **Component name**: PascalCase name (e.g., `Button`)
- **Source file path**: Path to the component source (e.g., `src/components/ui/button.tsx`)
- **analysis.md**: Contents of `.temp/react-to-figma-dom/components/{Name}/analysis.md`
- **props.md** (optional): Contents of `.temp/react-to-figma-dom/components/{Name}/props.md` — if not present, this prompt generates it in step 1b
- **Output directory**: `.temp/react-to-figma-dom/components/{Name}/`
- **pages.json** (optional): `.temp/react-to-figma-dom/component-hierarchy/pages.json` — query with `query-pages.js --component {Name}` to find routes and resolved props
- **app-variants/** (optional): `.temp/react-to-figma-dom/components/{Name}/app-variants/` — live app DOM captures (dom.json, fiber-dom-map.json, screenshot.png) from Phase 1's app crawl

## Procedure

### 1. Read the component source code

Read the full source file. Also read any related files:
- CSS/SCSS modules imported by the component
- CVA (class-variance-authority) variant definitions
- Tailwind `cn()` / `clsx()` conditional class expressions
- Custom hook files imported by the component

If `pages.json` exists, run `node {skillDir}/scripts/query-pages.js --pages-json {pipelineDir}/component-hierarchy/pages.json --component {componentName}` to find all routes where this component appears and note the distinct prop values it receives across routes. This reveals which variant axes are actually exercised in production (e.g., `status="open"` on one route, `status="closed"` on another).

If `app-variants/` captures exist, review the screenshots and `dom.json` files to understand how the component actually renders with real data and different prop combinations in the live app.

### 1b. Generate `props.md` (if not already present)

If `props.md` does not already exist at `.temp/react-to-figma-dom/components/{Name}/props.md`, generate it now from the source code read in step 1.

Find the component's props type definition. This is typically:
- An explicit `interface {Name}Props` or `type {Name}Props`
- Inline props in the function signature
- Extended from another type
- For `forwardRef` components: the second type parameter

Write `.temp/react-to-figma-dom/components/{Name}/props.md`:

```markdown
# {ComponentName} Props

**Source**: `{file path}`
**Source type**: {project|ui-library|npm}
**Extends**: {base type if any}

| Prop | Type | Required | Default | Slot |
|------|------|----------|---------|------|
| variant | "default" \| "ghost" \| "outline" | no | "default" | no |
| children | ReactNode | no | — | yes |
```

Mark `Slot = yes` if the type is `ReactNode`, `ReactElement`, `ComponentType`, or a function returning JSX.

If `props.md` already exists, skip this step and use its contents.

### 2. Extract prop-driven variants

From `props.md` (either provided as input or generated in step 1b) and the source code, find props that control visual appearance:

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

#### Independence classification

For each slot or toggle identified above, determine whether it is **independent** of the appearance axes (variant, size, state, etc.) or **dependent** on them.

**Independence test** — check whether the slot/toggle's CSS classes or styling change based on other variant axes:

| Evidence of dependency | Example |
|----------------------|--------|
| Conditional classes combining axes | `variant === 'destructive' && icon ? 'special-class' : ''` |
| CVA compound variants crossing axes | `compoundVariants: [{ variant: 'outline', icon: true, class: '...' }]` |
| CSS selectors targeting both axes | `.button--primary .button__icon { color: red }` |
| Variant-specific slot styling | Icon color set explicitly per variant instead of inheriting |

| Evidence of independence | Example |
|-------------------------|--------|
| Inherits appearance from parent | Slot children use `currentColor`, `text-*` inheritance, or `fill: currentColor` |
| No conditional branches on other axes | Slot rendering logic is identical regardless of variant/size/state |
| Same structural delta across axes | Adding the slot shifts padding the same amount in every variant |

**Classification**:
- **Independent** → Becomes a **Component Property** (BOOLEAN for show/hide, INSTANCE_SWAP for content). Does NOT multiply the variant matrix.
- **Dependent** → Remains a variant axis. Multiplied in the variant matrix.

### 6. Build variant matrix

Separate axes into two groups based on the independence classification from §5:

1. **Dependent axes** — axes whose visual effect changes based on other axes. These multiply in the variant matrix.
2. **Independent axes** — axes whose visual effect is the same regardless of other axis values. These become Component Properties and do NOT multiply.

#### Dependent axis matrix

Combine only dependent axes into the variant matrix. Determine which combinations are:
- **Meaningful**: Produce visually distinct results (include)
- **Redundant**: Produce identical visuals to another combination (exclude)
- **Impossible**: Logically invalid (e.g., `loading` + `disabled` might be meaningless) (exclude)

**Pruning rules**:
- If `disabled` overrides all other states (hover, focus, active have no effect when disabled), don't generate disabled+hover, disabled+focus, etc.
- If a size prop doesn't affect interaction states, one interaction state per size is sufficient as a spot-check — generate all sizes at `default` state, then all states at one representative size

**Variant count check**: If the dependent axis cross-product exceeds 30 combinations, verify each axis is truly dependent (changes appearance based on other axes). Complex components like Button legitimately have 100+ variants (e.g., 6 variants × 4 sizes × 2 roundness × 4 states = 192). This is normal when all axes are visual. Only convert an axis to a Component Property if it is genuinely independent — never force-convert a visual axis just to hit a count target.

#### Independent axes → Component Properties

For each independent axis, define a Component Property:

| Axis type | Figma property type | Example |
|-----------|--------------------|---------|
| Show/hide toggle (icon present vs absent) | BOOLEAN | "Show left icon" default=false |
| Content swap (which icon, which child) | INSTANCE_SWAP | "Left icon" default=placeholder |
| Text content (editable label) | TEXT | "Label" default="Button" |

For screenshot coverage, generate ONE variant per non-default value of each independent axis, rendered at the default dependent-axis values. These are listed separately from the dependent matrix.

#### Representative set algorithm

Total screenshot count = (dependent matrix combinations) + (independent axis non-default values).

When the dependent matrix exceeds 30, use the representative set to select which to screenshot: `1 + SUM(values_per_axis - 1)`. Start with one "default" combination (all dependent axes at default), then for each dependent axis, add one variant per non-default value while keeping all other axes at default.

Example: `size: sm|md|lg` × `variant: primary|secondary|outline` × `state: default|hover|disabled` = 27 dependent combos → representative set = `1 + (3-1) + (3-1) + (3-1) = 7`:
1. size=md, variant=primary, state=default (baseline)
2. size=sm, variant=primary, state=default (size axis)
3. size=lg, variant=primary, state=default (size axis)
4. size=md, variant=secondary, state=default (variant axis)
5. size=md, variant=outline, state=default (variant axis)
6. size=md, variant=primary, state=hover (state axis)
7. size=md, variant=primary, state=disabled (state axis)

Plus independent axis screenshots (e.g., `WithLeftIcon`, `WithRightIcon`, `WithBothIcons`) at the baseline dependent values.

Mark representative variants with `[REP]` in `variants.md` so downstream prompts know which to prioritize for screenshots.

**Budget cap**: If representative set still exceeds 30, prioritize prop-driven variants over interaction states.

### 7. Write `variants.md`

Write to `.temp/react-to-figma-dom/components/{Name}/variants.md`:

```markdown
# {ComponentName} Variants

## Variant Axes (Dependent)
| Axis | Values | Source | Independence |
|------|--------|--------|-------------|
| Variant | primary, secondary, outline, ghost, destructive | prop: variant (CVA) | dependent |
| Size | sm, md, lg | prop: size (CVA) | dependent |
| State | default, hover, focus, active, disabled | CSS pseudo + prop | dependent |
| Roundness | default, round | prop: roundness | dependent |

## Component Properties (Independent)
| Property | Figma Type | Default | Controlled Node | Independence Evidence |
|----------|-----------|---------|----------------|----------------------|
| Show left icon | BOOLEAN | false | leftIcon slot | No conditional classes combining variant/size with icon; icon inherits color via currentColor |
| Left icon | INSTANCE_SWAP | placeholder | leftIcon slot | Icon component unchanged across variants |
| Show right icon | BOOLEAN | false | rightIcon slot | Same as left icon |
| Right icon | INSTANCE_SWAP | placeholder | rightIcon slot | Same as left icon |

## Slots
| Slot | Type | Required | Default | Classification |
|------|------|----------|---------|---------------|
| children | text | no | — | n/a (use placeholder text) |
| leftIcon | ReactNode | no | — | independent → BOOLEAN + INSTANCE_SWAP |
| rightIcon | ReactNode | no | — | independent → BOOLEAN + INSTANCE_SWAP |

## Variant Combinations ({count} total, dependent axes only)

### Core variants (dependent axis cross-product)
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

### Independent axis screenshots (at default dependent values)
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
- Dependent variant axes: {count}
- Component properties: {count}
- Slots: {count}
- Total dependent combinations: {count} ({pruned_count} pruned)
- Independent axis screenshots: {count}
- Content states: {count}
- Output: .temp/react-to-figma-dom/components/{Name}/variants.md
```
