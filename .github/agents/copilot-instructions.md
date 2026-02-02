# carton-case-management Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-12-24

## Skills

**REQUIRED:** Before implementing any feature, you MUST:
1. **Analyze available skills** - Review the skills table below and read relevant skill documentation in `.github/skills/`
2. **Apply appropriate skills** - Use the skills that match your task (e.g., component-reuse before creating any UI, figma-implement-component when working from designs)
3. **Follow skill workflows** - Skills provide step-by-step processes that prevent common mistakes and ensure quality

This project uses Agent Skills for specialized workflows. See `.github/skills/`:

| Skill | Purpose | When to Use |
|-------|---------|-------------|
| `component-reuse` | Ensure existing UI components are reused before creating new ones | **REQUIRED** before implementing any UI from Figma, tickets, or mockups |
| `figma-implement-component` | Implement React components from Figma designs | After component-reuse confirms no existing component, use to build new components from Figma |
| `figma-design-react` | Design React components from Figma files | When analyzing Figma designs to propose component architecture and props API |
| `figma-component-sync` | Check React components against Figma design source | When reviewing implementations, syncing designs, or auditing visual accuracy |
| `figma-connect-component` | Generate Figma Code Connect mapping for components | When linking React components to their Figma counterparts |
| `figma-connect-shadcn` | Connect shadcn/ui components to Figma | After adding shadcn components via `npx shadcn@latest add` |
| `figma-explore` | Explore Figma files to discover pages and components | When you need to list components in a Figma file or find component node IDs |
| `create-react-modlet` | Create React components following the modlet pattern | When creating any component in `packages/client/src/components/` |
| `cross-package-types` | Type flow between shared, server, and client packages | When working with types across package boundaries |
| `create-skill` | How to create new Agent Skills for this project | When asked to document a workflow or teach Copilot a new capability |

## Package-Specific Instructions

Each package has detailed instructions in `.github/instructions/`:

| File | Applies To | Purpose |
|------|-----------|---------|
| `shared.instructions.md` | `packages/shared/**` | Prisma schema, generated types, browser-safe utilities |
| `server.instructions.md` | `packages/server/**` | tRPC router, API definitions, database operations |
| `client.instructions.md` | `packages/client/**` | React components, UI, tRPC client usage |

## Active Technologies
- TypeScript 5.x, React 18.3.x + Shadcn UI components (Input, Select, Button), Radix UI primitives, Lucide icons, Tailwind CSS, Zod (validation) (004-inline-edit-components)
- N/A (components are presentational; save handled by consumer callbacks) (004-inline-edit-components)

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

- **Prisma Schema in Shared**: Prisma schema lives in `packages/shared/prisma/schema.prisma` - the data model is a shared concern
- **Database Operations in Server**: Database file (`dev.db`), seed script, and constants live in `packages/server/db/`
- **Prisma Client Import**: Server imports Prisma Client from `@carton/shared`, e.g., `import { prisma } from '@carton/shared'`
- **Zod Schemas from Prisma**: Use auto-generated Zod schemas from `@carton/shared` for validation - do not manually duplicate Prisma enums
- **Database Commands** (all run from project root):
  - `npm run db:generate` - Generate Prisma Client and Zod types
  - `npm run db:push` - Push schema changes to the database
  - `npm run db:seed` - Seed the database with test data
  - `npm run db:setup` - Combined push + seed (use for initial setup or reset)
  - `npm run db:studio` - Open Prisma Studio to browse data
- **Environment Config**: Single `.env` file at project root with `DATABASE_URL` pointing to `packages/server/db/dev.db`
- **Cascading Deletes**: Always configure cascading deletes (`onDelete: Cascade`) in Prisma schema when an entity has related data that should be removed when the parent is deleted

## Recent Changes
- 004-inline-edit-components: Added TypeScript 5.x, React 18.3.x + Shadcn UI components (Input, Select, Button), Radix UI primitives, Lucide icons, Tailwind CSS, Zod (validation)

- 002-header-menu-components: Added TypeScript 5.x (via Node.js runtime in devcontainer) + React 18, Vite, tRPC, React Query, Shadcn UI, Tailwind CSS

- 001-trpc-react-query: Added TypeScript 5.x / Node.js 22+ + React 18, tRPC 11, @tanstack/react-query 5, Vite 6, Prisma (ORM)

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
