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

Include representative variants in the `"representative"` array of `code-variants.json` so downstream prompts know which to prioritize for screenshots.

**Budget cap**: If representative set still exceeds 30, prioritize prop-driven variants over interaction states.

### 7. Write `code-variants.json`

Write to `.temp/react-to-figma-dom/components/{Name}/code-variants.json`:

```json
{
  "componentName": "{ComponentName}",
  "sourceFile": "{relative path to component source}",
  "axes": [
    {
      "name": "Variant",
      "values": ["primary", "secondary", "outline", "ghost", "destructive"],
      "source": "prop: variant (CVA)",
      "default": "primary",
      "independent": false
    },
    {
      "name": "Size",
      "values": ["sm", "md", "lg"],
      "source": "prop: size (CVA)",
      "default": "md",
      "independent": false
    },
    {
      "name": "State",
      "values": ["default", "hover", "focus", "active", "disabled"],
      "source": "CSS pseudo + prop",
      "default": "default",
      "independent": false
    }
  ],
  "slots": [
    {
      "name": "leftIcon",
      "type": "ReactNode",
      "required": false,
      "independent": true,
      "independenceEvidence": "No conditional classes combining variant/size with icon; icon inherits color via currentColor",
      "figmaType": "BOOLEAN",
      "referenceCapture": "With Left Icon",
      "controlledNode": "leftIcon slot wrapper span"
    },
    {
      "name": "rightIcon",
      "type": "ReactNode",
      "required": false,
      "independent": true,
      "independenceEvidence": "Same as left icon",
      "figmaType": "BOOLEAN",
      "referenceCapture": "With Right Icon",
      "controlledNode": "rightIcon slot wrapper span"
    }
  ],
  "combinations": {
    "dependent": [
      "Variant Primary Size Md State Default",
      "Variant Primary Size Md State Hover",
      "Variant Primary Size Md State Focus",
      "..."
    ],
    "independent": [
      "With Left Icon",
      "With Right Icon",
      "With Both Icons"
    ]
  },
  "pruned": [
    { "combo": "State Disabled + State Hover", "reason": "disabled overrides hover styles" },
    { "combo": "State Disabled + State Focus", "reason": "disabled overrides focus styles" }
  ],
  "representative": ["Variant Primary Size Md State Default", "..."]
}
```

**Schema rules**:
- `axes[].independent`: `false` = dependent axis (multiplied in variant grid), `true` = independent (becomes Component Property)
- `axes[].name`: PascalCase axis name, used in variant folder names as `{Name} {Value}`
- `axes[].default`: The default value for this axis
- `slots[].figmaType`: One of `"BOOLEAN"` (show/hide), `"INSTANCE_SWAP"` (swap content), `"TEXT"` (editable text)
- `slots[].referenceCapture`: Folder name under `variants/` that demonstrates this slot in its "on" state
- `slots[].controlledNode`: Description of the DOM node that appears/disappears when this slot is toggled
- `combinations.dependent`: Full list of variant folder names to capture (dependent axes cross-product minus pruned)
- `combinations.independent`: List of folder names for reference captures (one per slot non-default value)

**Folder naming convention**: Folder names use the pattern `{Axis} {Value} {Axis} {Value} ...` with spaces. For independent captures, use descriptive names like `With Left Icon`.

### 8. Return summary

```
Variant identification complete: {ComponentName}
- Dependent variant axes: {count}
- Component properties (independent slots): {count}
- Total dependent combinations: {count} ({pruned_count} pruned)
- Independent axis screenshots: {count}
- Output: .temp/react-to-figma-dom/components/{Name}/code-variants.json
```
