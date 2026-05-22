# Analyze Single Component

Analyze one React component to extract its props interface and all child components it renders. Write the results to the component's staging directory.

## Inputs

- **Component name**: PascalCase name (e.g., `Sidebar`)
- **File path**: Path to the component source file (e.g., `src/components/Sidebar/Sidebar.tsx`)
- **Source type**: `project`, `ui-library`, or `npm`
- **Output directory**: `.temp/react-to-figma/components/{ComponentName}/`
- **Barrel map**: Contents of `.temp/react-to-figma/component-hierarchy/barrel-map.md` (for resolving import aliases)

## Procedure

### 1. Read the component source

- For `project` and `ui-library` components: Read the source file directly.
- For `npm` components: Locate the `.d.ts` type definition file in `node_modules`. If the type definition is not found, note this in the output and extract what you can from usage patterns in the project.

### 2. Extract props interface → `props.md`

Find the component's props type definition. This is typically:
- An explicit `interface {Name}Props` or `type {Name}Props`
- Inline props in the function signature: `function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void })`
- Extended from another type: `interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>`
- For `forwardRef` components: the second type parameter

For each prop, record:

| Field | Description |
|-------|-------------|
| **name** | Prop name |
| **type** | TypeScript type (preserve the original type expression) |
| **required** | `yes` or `no` (based on `?` modifier) |
| **default** | Default value if destructured with `= defaultVal` |
| **slot** | `yes` if type is `ReactNode`, `ReactElement`, `ComponentType`, or a function returning JSX |

Write to `.temp/react-to-figma/components/{ComponentName}/props.md`:

```markdown
# {ComponentName} Props

**Source**: `{file path}`
**Source type**: {project|ui-library|npm}
**Extends**: {base type if any, e.g., `React.ButtonHTMLAttributes<HTMLButtonElement>`}

| Prop | Type | Required | Default | Slot |
|------|------|----------|---------|------|
| variant | "default" \| "ghost" \| "outline" | no | "default" | no |
| size | "sm" \| "md" \| "lg" | no | "md" | no |
| children | ReactNode | no | — | yes |
| onClick | () => void | no | — | no |
| asChild | boolean | no | false | no |
```

If props cannot be determined (e.g., npm component with no `.d.ts`), write:
```markdown
# {ComponentName} Props

**Source**: `{package name}`
**Source type**: npm
**Props**: Could not be resolved — no type definition found.
```

### 3. Find all rendered children → `analysis.md`

Read the component's JSX return statement(s) and identify every child component rendered. A child component is any JSX element with a **PascalCase tag name** — this includes project components, UI library components, and npm components.

**Skip** lowercase tags — these are HTML primitives (`div`, `span`, `button`, etc.).

For each child component found, determine:

| Field | How to detect | Example |
|-------|--------------|---------|
| **Child** | The PascalCase JSX tag name | `Button`, `NavItem`, `ChevronDown` |
| **Relationship** | See relationship detection rules below | `renders`, `routes`, `conditional`, `list`, `wraps`, `prop-injection` |
| **Props Passed** | The prop expressions on the JSX element | `variant="ghost"`, `onClick={onToggle}`, `icon={item.icon}` |
| **Condition** | The boolean guard, if any | `always`, `{isOpen}`, `{items.length > 0}`, `{isAdmin ? ... : ...}` |
| **List** | Whether rendered inside a `.map()`, `.flatMap()`, or similar | `—`, `.map()`, `.flatMap()` |
| **Slot** | Where in the parent's JSX tree this child appears | `children`, `{sidebar}` (named prop), `render prop` |

#### Relationship detection rules

| Relationship | Detection pattern |
|-------------|-------------------|
| **renders** | Direct `<Child />` or `<Child>...</Child>` in JSX return — the default |
| **routes** | Child is inside a `<Route element={<Child />}>` or `<Route component={Child}>` |
| **conditional** | Child is inside `{condition && <Child />}` or `{condition ? <Child /> : ...}` — use this INSTEAD of `renders` when a condition is present |
| **list** | Child is inside `.map(() => <Child />)` or similar iteration — use this INSTEAD of `renders` when iteration is present |
| **wraps** | This component accepts `children` prop and renders `{children}` — the child is whatever the CONSUMER passes. Mark the `children` slot as `wraps` |
| **prop-injection** | Child component is passed as a prop value to another component: `<Layout sidebar={<Child />}>` |

**Priority**: If a child has both a condition AND is in a list, use `list` as the relationship and note the condition in the Condition column.

#### Handling special patterns

- **React.lazy()**: If a component uses `const LazyChild = React.lazy(() => import('./Child'))`, treat `<LazyChild />` as a normal child with a note `(lazy)` appended to the relationship.
- **HOCs**: If the file exports `export default withAuth(MyComponent)`, note `withAuth` as a wrapper in the analysis but focus on `MyComponent`'s JSX children.
- **React.Fragment / <>**: Ignore fragments — look through them to the actual children.
- **Suspense / ErrorBoundary**: Treat as `wraps` — they wrap children.
- **Spread props**: If `<Child {...props} />` is used, note `{...props}` in the Props Passed column.
- **Ref forwarding**: If `React.forwardRef((props, ref) => ...)`, analyze the inner function's JSX.

### 4. Write `analysis.md`

Write to `.temp/react-to-figma/components/{ComponentName}/analysis.md`:

```markdown
# {ComponentName} Analysis

**Source**: `{file path}`
**Source type**: {project|ui-library|npm}
**Leaf**: {true|false}

## Rendered Children

| Child | Relationship | Props Passed | Condition | List | Slot |
|-------|-------------|-------------|-----------|------|------|
| ThemeProvider | wraps | theme={theme} | always | — | children |
| Button | renders | variant="ghost", onClick={onToggle} | always | — | children |
| NavItem | list | icon={item.icon}, label={item.label}, to={item.path} | always | .map() | children |
| AdminPanel | conditional | — | {isAdmin} | — | children |

## Wraps Children

{yes|no} — This component accepts `children` and renders `{children}`.

## Notes

{Any special patterns observed: HOCs, lazy loading, render props, spread props, etc.}
```

**Leaf determination**: A component is a **leaf** (`Leaf: true`) if its "Rendered Children" table is empty — it renders NO other PascalCase components (only HTML primitives or nothing).

If the component has no rendered children at all (pure leaf), write:

```markdown
## Rendered Children

None — this is a leaf component.
```

### 5. Return summary

Return a brief summary to the parent orchestrator:

```
Analyzed: {ComponentName}
- Props: {count} props ({count} required, {count} slots)
- Children: {count} rendered ({count} conditional, {count} lists)
- Leaf: {true|false}
- Output: .temp/react-to-figma/components/{ComponentName}/
```
