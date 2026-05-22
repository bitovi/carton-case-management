# Discover All React Components

Scan the project source tree to find every React component — project-defined, UI library (shadcn, Radix, etc.), and npm-imported. Produce a checklist of components to analyze and a barrel/re-export resolution map.

## Inputs

- **Source root**: The root directory containing React source files (passed by parent)
- **Output directory**: `.temp/react-to-figma/` (passed by parent)

## Procedure

### 1. Find all candidate files

Search the source root for files matching `**/*.tsx` and `**/*.jsx`.

**Exclude** files matching any of these patterns:
- `**/*.test.tsx`, `**/*.test.jsx`
- `**/*.spec.tsx`, `**/*.spec.jsx`
- `**/*.stories.tsx`, `**/*.stories.jsx`
- `**/*.d.ts`
- `**/node_modules/**`
- `**/__tests__/**`
- `**/__mocks__/**`

### 2. Identify React components in each file

Read each candidate file and determine if it exports one or more React components.

A **React component** is:
- A function or const with a **PascalCase name** that returns JSX (contains `<` in the return)
- A `React.forwardRef(...)` wrapping a function that returns JSX
- A `React.memo(...)` wrapping a component
- A default export of any of the above

**Skip** files that only export:
- Types / interfaces / enums (no runtime code)
- Utility functions (non-PascalCase, no JSX return)
- Constants / configuration objects
- Hooks only (functions starting with `use` — unless they also export a component)

For each component found, record:
- **Component name** (PascalCase)
- **File path** (relative to project root)
- **Export type**: `default` or `named`
- **Source type**: `project` (app-specific), `ui-library` (shadcn/ui components, typically in a `ui/` directory), or `npm` (will be resolved in step 4)

### 3. Build barrel/re-export map

Find all `index.ts`, `index.tsx`, and `index.js` files in the source tree. For each one, read it and record every re-export mapping:

```
index.ts path → { ExportedName → actual file path }
```

For example, if `components/ui/index.ts` contains:
```typescript
export { Button } from './button'
export { Input } from './input'
```

Record:
```
components/ui/index.ts:
  Button → components/ui/button.tsx
  Input → components/ui/input.tsx
```

Also check for wildcard re-exports (`export * from './button'`) and path alias re-exports.

### 4. Identify npm-imported components

Scan all discovered component files for imports from `node_modules` packages that are React components (PascalCase imports used in JSX).

**Include** imports from:
- `@radix-ui/*` (Radix primitives)
- `lucide-react` (icons — treat each icon as a component)
- Any package whose imports are used as JSX elements (`<ImportedName .../>`)

**Exclude** imports of:
- React itself (`react`, `react-dom`)
- Hooks or utilities from libraries (non-PascalCase)
- Type-only imports (`import type { ... }`)

For each npm component, record:
- **Component name**
- **Package name** (e.g., `lucide-react`)
- **Source type**: `npm`
- **Type definition path**: Resolve the `.d.ts` file from `node_modules` if available

### 5. Write outputs

#### `.temp/react-to-figma/component-hierarchy/components-todo.md`

Write the full component list as a checklist. Format:

```markdown
# Components To Analyze

Total: {count}

## Project Components
- [ ] AppLayout | src/components/AppLayout/AppLayout.tsx | project | named
- [ ] CaseDetails | src/components/CaseDetails/CaseDetails.tsx | project | default
...

## UI Library Components
- [ ] Button | src/components/ui/button.tsx | ui-library | named
- [ ] Input | src/components/ui/input.tsx | ui-library | named
...

## npm Components
- [ ] ChevronDown | lucide-react | npm | named
- [ ] DialogRoot | @radix-ui/react-dialog | npm | named
...
```

Each line: `- [ ] {Name} | {path or package} | {source type} | {export type}`

#### `.temp/react-to-figma/component-hierarchy/barrel-map.md`

Write the barrel re-export map:

```markdown
# Barrel Re-export Map

## src/components/ui/index.ts
- Button → src/components/ui/button.tsx
- Input → src/components/ui/input.tsx
- Select → src/components/ui/select.tsx

## src/components/common/index.ts
- ConfirmationDialog → src/components/common/ConfirmationDialog/ConfirmationDialog.tsx

## src/components/index.ts
- * → src/components/ui/index.ts
- * → src/components/common/index.ts
```

### 6. Return summary

Return a brief summary to the parent orchestrator:

```
Discovery complete.
- Project components: {count}
- UI library components: {count}
- npm components: {count}
- Barrel files mapped: {count}
- Output: .temp/react-to-figma/component-hierarchy/components-todo.md
```
