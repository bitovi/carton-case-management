# carton-case-management Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-12-24

## Active Technologies

- TypeScript 5.x (via Node.js runtime in devcontainer) + React 18, Vite, tRPC, React Query, Shadcn UI, Tailwind CSS (002-header-menu-components)
- N/A (UI components only, no data persistence required) (002-header-menu-components)

- TypeScript 5.x / Node.js 22+ + React 18, tRPC 11, @tanstack/react-query 5, Vite 6, Prisma (ORM) (001-trpc-react-query)

## Project Structure

```text
src/
tests/
```

## Commands

### Running Tests
- **Unit Tests**: `npm test` - Runs all unit tests across workspaces (client, server, shared)
- **E2E Tests**: `npm run test:e2e` - Runs Playwright end-to-end tests
- **E2E Tests (UI mode)**: `npm run test:e2e:watch` - Opens Playwright UI for interactive test debugging
- **Linting**: `npm run lint` - Runs ESLint across all packages
- **Type Checking**: `npm run typecheck` - Runs TypeScript type checking

### Before Submitting Code
Always ensure all tests pass before committing:
```bash
npm test && npm run test:e2e && npm run lint
```

## Code Style

TypeScript 5.x / Node.js 22+: Follow standard conventions

## Coding Standards

- When creating new React files ensure to follow the details specified in .github/prompts/modlet.prompt.md.
- No tsx or ts files should have inline comments.
- All styling should be done using Tailwind CSS classes in an external CSS file.
- Responsive designing should be implemented using Tailwind CSS utilities.

### Component Architecture

- **Component Structure**: Follow the recursive modlet pattern (as demonstrated by CaseDetails component)
- **Component Testing & Documentation**:
  - Every component must have accompanying tests (`.test.tsx` files)
  - Every component should have Storybook stories (`.stories.tsx` files) for documentation and visual testing
  - Tests should cover main functionality, edge cases, and user interactions
- **Shadcn UI Components**:
  - Always prioritize using Shadcn UI components over native HTML elements (e.g., use Shadcn Select instead of `<select>`, Shadcn Input instead of `<input>`, etc.)
  - If a needed component is not available, install the Shadcn equivalent using `npx shadcn@latest add [component-name]`
  - Shadcn components should be installed to `packages/client/src/components/ui/` directory and exported via `packages/client/src/components/ui/index.ts`
- **Custom Components**: If a custom component must be built on top of underlying Shadcn components (e.g., EditableSelect, ConfirmationDialog), it should go in `packages/client/src/components/common/`

### UX Patterns

- **Creating**: Use dedicated create pages (not modals) for creating new entities
- **Editing**: Implement "click to edit" functionality on view pages with inline editing
- **Deleting**: Always use a confirmation modal (ConfirmationDialog) before deleting entities

### Data Layer

- **Prisma/tRPC**: Always configure cascading deletes (`onDelete: Cascade`) in Prisma schema when an entity has related data that should be removed when the parent is deleted

## Recent Changes

- 002-header-menu-components: Added TypeScript 5.x (via Node.js runtime in devcontainer) + React 18, Vite, tRPC, React Query, Shadcn UI, Tailwind CSS

- 001-trpc-react-query: Added TypeScript 5.x / Node.js 22+ + React 18, tRPC 11, @tanstack/react-query 5, Vite 6, Prisma (ORM)

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
