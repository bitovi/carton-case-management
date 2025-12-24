# App Architecture

## Repository Structure

- Npm workspaces
  - `packages/` - Contains all the individual packages/modules of the application.
    - `server/`
    - `client/`
    - `shared/` - shared utilities and types

## Frontend

- React (SPA) with TypeScript
- Vite as the build tool
- tRPC (JSON-RPC 2.0) for API communication
- **React Query (@tanstack/react-query)** - Integrated with tRPC for:
  - Automatic request caching (5 min stale time, 10 min garbage collection)
  - Loading/error state management
  - Background data refetching on window focus
  - Optimistic updates and cache invalidation
  - React Query DevTools for debugging (dev-only)
- Shadcn UI for design system
- Storybook - components provide props override for data-fetching to simplify testing and storybook integration
- vitest with MSW (Mock Service Worker) for API mocking in tests
- Custom test utilities in `src/test/utils.ts` for tRPC + React Query testing

## Backend

- Node.js with TypeScript
- tRPC (JSON-RPC 2.0) for API endpoints
- Prisma as ORM for database interactions
- SQLite as the database
- vitest

## Other Tools

- Devcontainer for consistent development environment
- ESLint and Prettier for code quality and formatting
- e2e tests with Playwright
