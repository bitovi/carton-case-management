# AI Rules for this App

## Tech stack (quick overview)

- **React + TypeScript** single-page application.
- **React Router** for routing; routes are defined in `src/App.tsx`.
- **Tailwind CSS** for all styling and layout (utility-first).
- **shadcn/ui** as the default component library (Radix UI under the hood).
- **Radix UI primitives** are available (used via shadcn/ui components when possible).
- **lucide-react** for icons.
- Source code lives in **`src/`** with a simple feature layout:
  - Pages in **`src/pages/`**
  - Reusable UI in **`src/components/`**
  - Main/default page: **`src/pages/Index.tsx`**

## Library usage rules (what to use for what)

### 1) UI components
- **Use shadcn/ui first** for buttons, inputs, dialogs, dropdowns, tabs, tables, toasts, etc.
- **Do not edit shadcn/ui files** directly. If you need different behavior or styling:
  - wrap the component in `src/components/`, or
  - compose primitives to build a new component.
- Use **Radix UI primitives directly only when** shadcn/ui doesn’t provide the needed component or you need a lower-level primitive.

### 2) Styling
- **Always use Tailwind CSS** for styling.
- Prefer Tailwind utility classes over custom CSS.
- If you need shared styling, create a small wrapper component or use class composition (e.g., via `cn(...)` utility if present).

### 3) Icons
- **Use `lucide-react`** for icons.
- Keep icons as React components; size and color should be controlled via Tailwind classes.

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
