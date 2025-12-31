# carton-case-management Development Guidelines

Auto-generated from all feature plans. Last updated: 2025-12-24

## Active Technologies
- TypeScript 5.7.2 (003-rich-text-description)
- SQLite via Prisma ORM (Case.description field will store JSON stringified rich text) (003-rich-text-description)

- TypeScript 5.x (via Node.js runtime in devcontainer) + React 18, Vite, tRPC, React Query, Shadcn UI, Tailwind CSS (002-header-menu-components)
- N/A (UI components only, no data persistence required) (002-header-menu-components)

- TypeScript 5.x / Node.js 22+ + React 18, tRPC 11, @tanstack/react-query 5, Vite 6, Prisma (ORM) (001-trpc-react-query)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.x / Node.js 22+: Follow standard conventions

## Coding Standards

- When creating new React files ensure to follow the details specified in .github/prompts/modlet.prompt.md.
- No tsx or ts files should have inline comments.
- All styling should be done using Tailwind CSS classes in an external CSS file.
- Responsive designing should be implemented using Tailwind CSS utilities.

## Recent Changes
- 003-rich-text-description: Added TypeScript 5.7.2

- 002-header-menu-components: Added TypeScript 5.x (via Node.js runtime in devcontainer) + React 18, Vite, tRPC, React Query, Shadcn UI, Tailwind CSS

- 001-trpc-react-query: Added TypeScript 5.x / Node.js 22+ + React 18, tRPC 11, @tanstack/react-query 5, Vite 6, Prisma (ORM)

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
