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
- Shadcn UI for design system
- Storybook - components provide props override for data-fetching to simplify testing and storybook integration
- vitest

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
