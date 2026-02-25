# AI Rules for this App

## Tech stack (quick overview)

- **React + TypeScript** single-page application.
- **React Router** for routing; routes are defined in `src/App.tsx`.
- **Tailwind CSS** for all styling and layout (utility-first).
- **KendoReact** as the default component library
- **Kendo** for icons.
- Source code lives in **`src/`** with a simple feature layout:
  - Pages in **`src/pages/`**
  - Reusable UI in **`src/components/`**
  - Main/default page: **`src/pages/Index.tsx`**

## Library usage rules (what to use for what)

### 1) UI components
- **Use KendoReact first** for buttons, inputs, dialogs, dropdowns, tabs, tables, toasts, etc. 
- Kendo React MCP server should be used for docs, examples, and best practices

### 2) Styling
- **Always use Tailwind CSS** for styling.
- Prefer Tailwind utility classes over custom CSS.
- If you need shared styling, create a small wrapper component or use class composition (e.g., via `cn(...)` utility if present).

### 3) Icons
- **Use Kendo** for icons.
- Keep icons as React components; size and color should be controlled via Tailwind classes.
- Kendo React MCP should be used for docs, examples, and best practices

### 4) Routing
- Use **React Router**.
- **Keep route definitions in `src/App.tsx`**.
- New routes should map to a page component in `src/pages/`.

### 5) File organization
- **Pages**: `src/pages/*` (route-level screens).
- **Components**: `src/components/*` (reusable building blocks).
- Avoid putting page-specific components in `src/components/` unless they are likely to be reused.

### 6) TypeScript rules
- Prefer **strict typing** and type inference.
- Avoid `any`; if unavoidable, isolate it and document why.
- Define reusable types near the code that uses them, or in a small `types.ts` next to the feature.

### 7) Data fetching / state
- Keep state **local** to components when possible.
- Lift state only when multiple components must share it.
- Do not add new heavy state/data libraries unless explicitly requested.

### 8) General implementation guidelines
- Keep changes **small, focused, and maintainable**.
- Don’t introduce new dependencies unless necessary.
- Update `src/pages/Index.tsx` whenever you add a new visible component so it’s discoverable in the UI.
