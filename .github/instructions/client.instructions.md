---
applyTo: packages/client/**
---

# Client Package Instructions

## Stack
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS — no CSS files, no inline styles; use `clsx`/`tailwind-merge` for conditional classes
- **UI primitives:** Shadcn UI (Radix) wrapped in the `obra/` design system
- **API:** tRPC client via `src/lib/trpc.tsx`; use `trpc.<procedure>.useQuery/useMutation` hooks
- **Routing:** React Router v6 (`BrowserRouter` in `main.tsx`, `Routes`/`Route` in `App.tsx`)
- **Language:** TypeScript; use the `@/` alias for `src/` imports

## Structure
```
packages/client/src/
├── main.tsx                    # Entry point — mounts TrpcProvider + BrowserRouter
├── App.tsx                     # Route definitions and top-level layout
├── lib/
│   ├── trpc.tsx                # tRPC client setup and TrpcProvider
│   └── utils.ts                # Shared utility helpers (cn, etc.)
├── components/
│   ├── obra/                   # Design-system primitives (Button, Input, Dialog, …)
│   ├── common/                 # App-level shared components (dialogs, filters, etc.)
│   ├── inline-edit/            # Inline-editable field components
│   ├── CaseDetails/            # Case detail view and sub-components
│   ├── CustomerDetails/        # Customer detail view and sub-components
│   ├── UserDetails/            # User detail view and sub-components
│   ├── UserList/               # User list component
│   └── MenuList/               # Navigation menu component
└── pages/                      # Route-level page components
    ├── HomePage/
    ├── CasePage/
    ├── CreateCasePage/
    ├── CustomerPage/
    ├── CreateCustomerPage/
    ├── UserPage/
    └── CreateUserPage/
```

## Components
- **`obra/`** — low-level design-system primitives; wrap Radix/Shadcn; each has its own `README.md` and Storybook story
- **`common/`** — app-level shared components built from `obra/` primitives; each has its own `README.md`
- **`inline-edit/`** — editable field wrappers (`EditableText`, `EditableSelect`, `EditableDate`, etc.)
- Each component folder should include: `ComponentName.tsx`, `index.ts`, `README.md`, and a `.stories.tsx` file

## Adding a New Page
1. Create a folder under `src/pages/PageName/` with `PageName.tsx` and `index.ts`
2. Add the route to `App.tsx` using `<Route path="..." element={<PageName />} />`
3. Add a nav entry in `App.tsx` `menuItems` array if it should appear in the sidebar

## Data Fetching
- Use `trpc.<router>.<procedure>.useQuery(input)` for reads
- Use `trpc.<router>.<procedure>.useMutation()` for writes; call `utils.invalidate()` after mutations to refetch
- Import `trpc` from `@/lib/trpc`
- Reuse Zod schemas from `@carton/shared` for form validation; do not duplicate them

## Conventions
- Use the `@/` alias for all `src/` imports (e.g., `import { Button } from '@/components/obra/Button'`)
- Compose UI from `obra/` primitives before reaching for raw HTML elements
- Maintain `README.md` and a Storybook story for every new component
- Do not add CSS files or inline styles; use Tailwind utility classes only
- Do not call the tRPC server directly (no `fetch`/`axios`); always use the tRPC hooks
