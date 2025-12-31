# Carton Case Management Constitution

## Core Principles

### I. Type Safety First

All code must be strictly typed using TypeScript with no `any` types unless explicitly justified and documented. Type safety extends end-to-end:

- **Prisma Schema as Source of Truth**: All data models defined in `packages/server/prisma/schema.prisma` - this is the single source of truth for database entities
- **Shared Types Package**: API contracts and domain types defined in `packages/shared`, with a separate file for each functionality or feature area
- **tRPC Integration**: Type-safe API layer ensuring compile-time contract verification between client and server
- **Zod Validation**: Runtime validation schemas for all API inputs and critical data structures
- **Prisma Type Generation**: Database schema changes automatically propagate types throughout the application
- **No Type Assertions**: Avoid type assertions (`as`) except when interfacing with untyped third-party libraries

### II. API Contract Integrity (NON-NEGOTIABLE)

All API changes must maintain contract integrity across the full stack:

- **tRPC Router as Source of Truth**: All API endpoints defined in `packages/server/src/router.ts`
- **Schema-First Design**: Zod schemas define contracts before implementation
- **Breaking Change Protocol**: MAJOR version bump required for breaking changes; migration path documented
- **Contract Testing**: API contracts validated through integration tests
- **Shared Types Sync**: Changes to API contracts must update the corresponding type files in `packages/shared/src/` simultaneously, with separate files per functionality

### III. Test-Informed Development (NON-NEGOTIABLE)

All features must be properly tested, with testing as a core part of development:

- **Business Logic Testing**: All business logic, utilities, and functions must have unit tests (Vitest)
- **Integration Tests**: tRPC router tests required for all API endpoints
- **E2E Tests for New Pages**: Every new page must have at least one Playwright E2E test
- **E2E Tests for Components**: New components with user interactions require E2E coverage when integrated into pages
- **Test Coverage**: No strict minimum enforced currently, but comprehensive coverage expected; formal gates may be added later
- **Test Quality**: Tests must be meaningful and validate actual behavior, not just achieve coverage metrics

### IV. Component Development Standards

All UI components must follow the established development workflow:

- **Component Library Usage (STRICTLY ENFORCED)**: All component changes and additions MUST follow this hierarchy: (1) Use existing components from `packages/client/src/ui/` first, (2) If needed component doesn't exist locally, add it from Shadcn UI component registry, (3) Only create custom components when Shadcn UI does not provide that functionality. All new components added to the ui library must adhere to the Figma design system specifications for that component type.
- **Storybook Required**: Every new component must have a corresponding `.stories.tsx` file
- **Story Coverage**: Stories must demonstrate all component variants, states, and props
- **Story Verification**: All existing and new stories must be checked for errors by verifying the output for each story in a simple browser
- **Isolated Development**: Components must be testable in isolation with prop overrides for data dependencies
- **Shadcn UI Integration**: Use Shadcn UI patterns for consistency
- **Accessibility**: Components must meet WCAG 2.1 AA standards

### V. E2E Testing for User Flows

Critical user flows must have corresponding Playwright E2E tests:

- **Feature Completeness**: New features require at least one E2E test covering the happy path
- **Test Location**: E2E tests in `tests/e2e/` directory
- **User-Centric Scenarios**: Tests written from user perspective using accessible selectors
- **CI Integration**: E2E tests run in CI before deployment
- **Coverage Focus**: Authentication flows, CRUD operations, critical business workflows

## Technical Standards

### Architecture Compliance

- **Monorepo Structure**: Maintain clean separation between `client`, `server`, and `shared` packages
- **No Cross-Contamination**: Client code cannot import from server, only from shared
- **Workspace Dependencies**: Use npm workspaces for inter-package dependencies
- **Data Model Authority**: All data models must be defined in Prisma schema (`packages/server/prisma/schema.prisma`)
- **Database Migrations**: Prisma migrations required for all schema changes - never modify database directly
- **Shared Types Organization (STRICTLY ENFORCED)**: Any types shared between client and server MUST be placed in `packages/shared/src/` with separate files per functionality - never duplicate types across packages or combine unrelated types in a single file

### Code Quality

- **ESLint Compliance**: All code must pass ESLint checks with project configuration
- **Prettier Formatting**: Consistent formatting enforced via Prettier
- **TypeScript Strict Mode**: `strict: true` in all `tsconfig.json` files
- **Import Organization**: Absolute imports preferred over relative for better refactoring

### Performance & Security

- **Validated Inputs**: All user inputs validated with Zod schemas
- **SQL Injection Protection**: Prisma ORM required for all database operations
- **Password Security**: Passwords hashed, never stored in plain text
- **Environment Variables**: Sensitive configuration in `.env`, never committed

## Development Workflow

### Pre-Implementation Checklist

1. **Requirements Clear**: Understand acceptance criteria
2. **Types Defined**: Update shared types if needed
3. **Tests Written**: Unit, integration, or E2E tests created
4. **Tests Failing**: Verify tests fail before implementation
5. **Storybook Added**: For new components, create stories

### Implementation Process

1. **Implement Feature**: Make tests pass (green)
2. **Refactor**: Clean up code while keeping tests green
3. **Manual Testing**: Verify in local dev environment
4. **E2E Verification**: Run Playwright tests if applicable
5. **Code Review**: Submit PR with test results

### Quality Gates

- **All Tests Pass**: Every unit, integration, and E2E test must pass - including both newly added tests and the complete existing test suite
- **Type Safety**: No TypeScript errors
- **Linting Clean**: ESLint checks pass
- **Formatting**: Prettier formatting applied
- **Storybook Quality**: All component stories must build and render without errors - both new and existing stories
- **No Console Errors**: Clean browser console in dev mode

## Governance

This constitution supersedes all other development practices and conventions. All team members must:

- **Compliance Verification**: Review all PRs for constitutional compliance
- **Reject Non-Compliance**: PRs violating core principles must be rejected
- **Amendment Process**: Constitution amendments require team consensus and documentation
- **Migration Planning**: Breaking changes require migration plan before approval
- **Continuous Learning**: Team members expected to learn and apply these principles

**Enforcement**: Type safety and contract integrity violations are blockers. Test-first, Storybook, and E2E requirements are mandatory for all new features.

**Version**: 1.0.0 | **Ratified**: 2025-12-24 | **Last Amended**: 2025-12-24
