# Carton Case Management Constitution

## Core Principles

### I. Framework-First Development

When integrating third-party libraries or frameworks, trust and follow their established patterns:

- **Official Examples as Reference**: Always review and follow official framework examples before implementing custom solutions
- **Minimal Customization**: Only add custom behavior when framework defaults are insufficient
- **Pattern Recognition**: Study how the framework solves common problems (keyboard handling, normalization, etc.)
- **Anti-Pattern Awareness**: Document known anti-patterns and gotchas from framework documentation and community
- **No Reinvention**: Avoid reimplementing functionality that the framework already handles natively

### II. Type Safety First

All code must be strictly typed using TypeScript with no `any` types unless explicitly justified and documented. Type safety extends end-to-end:

- **Prisma Schema as Source of Truth**: All data models defined in `packages/server/prisma/schema.prisma` - this is the single source of truth for database entities
- **Shared Types Package**: API contracts and domain types defined in `packages/shared`, with a separate file for each functionality or feature area
- **tRPC Integration**: Type-safe API layer ensuring compile-time contract verification between client and server
- **Zod Validation**: Runtime validation schemas for all API inputs and critical data structures
- **Prisma Type Generation**: Database schema changes automatically propagate types throughout the application
- **No Type Assertions**: Avoid type assertions (`as`) except when interfacing with untyped third-party libraries

### III. Schema-Code Synchronization (NON-NEGOTIABLE)

When working with validation schemas or type definitions, changes must be synchronized:

- **Update Checklist**: When adding new types or variants, update ALL related artifacts (TypeScript types, validation schemas, renderers, handlers)
- **Schema-First for Validation**: Define Zod schemas before implementing features that require validation
- **Type-Schema Parity**: Ensure TypeScript types and Zod schemas remain synchronized for the same domain concepts
- **Comprehensive Coverage**: Validation schemas must cover all valid variants, not just the initially implemented subset

### IV. API Contract Integrity (NON-NEGOTIABLE)

All API changes must maintain contract integrity across the full stack:

- **tRPC Router as Source of Truth**: All API endpoints defined in `packages/server/src/router.ts`
- **Schema-First Design**: Zod schemas define contracts before implementation
- **Breaking Change Protocol**: MAJOR version bump required for breaking changes; migration path documented
- **Contract Testing**: API contracts validated through integration tests
- **Shared Types Sync**: Changes to API contracts must update the corresponding type files in `packages/shared/src/` simultaneously, with separate files per functionality

### V. Test-Informed Development (NON-NEGOTIABLE)

All features must be properly tested, with testing as a core part of development:

- **Business Logic Testing**: All business logic, utilities, and functions must have unit tests (Vitest)
- **Integration Tests**: tRPC router tests required for all API endpoints
- **E2E Tests for New Pages**: Every new page must have at least one Playwright E2E test
- **E2E Tests for Components**: New components with user interactions require E2E coverage when integrated into pages
- **Test Coverage**: No strict minimum enforced currently, but comprehensive coverage expected; formal gates may be added later
- **Test Quality**: Tests must be meaningful and validate actual behavior, not just achieve coverage metrics
- **Test Tasks Required**: tasks.md MUST include test tasks following TDD workflow (write tests first, ensure they fail before implementation). Tests are mandatory REGARDLESS of whether the feature specification explicitly requests them - this constitutional requirement overrides all other documentation.
- **Edge Case Testing**: Tests must cover edge cases including empty states, boundary conditions, and error scenarios

### VI. Component Development Standards

All UI components must follow the established development workflow:

- **Component Library Usage (STRICTLY ENFORCED)**: All component changes and additions MUST follow this hierarchy: (1) Use existing components from `packages/client/src/ui/` first, (2) If needed component doesn't exist locally, add it from Shadcn UI component registry, (3) Only create custom components when Shadcn UI does not provide that functionality. All new components added to the ui library must adhere to the Figma design system specifications for that component type.
- **Storybook Required**: Every new component must have a corresponding `.stories.tsx` file
- **Story Coverage**: Stories must demonstrate all component variants, states, and props
- **Isolated Development**: Components must be testable in isolation with prop overrides for data dependencies
- **Shadcn UI Integration**: Use Shadcn UI patterns for consistency
- **Accessibility**: Components must meet WCAG 2.1 AA standards

### VII. E2E Testing for User Flows

Critical user flows must have corresponding Playwright E2E tests:

- **Feature Completeness**: New features require at least one E2E test covering the happy path
- **Test Location**: E2E tests in `tests/e2e/` directory
- **User-Centric Scenarios**: Tests written from user perspective using accessible selectors
- **CI Integration**: E2E tests run in CI before deployment
- **Coverage Focus**: Authentication flows, CRUD operations, critical business workflows

### VIII. Design Specification Compliance

Implementation must match approved design specifications:

- **Design Verification**: Compare implementation against design specifications (Figma, wireframes) before marking tasks complete
- **Component Accuracy**: UI components must match specified design patterns (dropdowns vs buttons, layouts, etc.)
- **Visual Testing**: Verify rendering in browser during development, not just after completion
- **Design System Adherence**: Follow established design system patterns for consistency

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

### Research Phase Requirements

Before implementation, research must be comprehensive:

1. **Framework Documentation**: Review official documentation for relevant frameworks/libraries
2. **Official Examples**: Study and reference complete working examples from framework maintainers
3. **Anti-Pattern Documentation**: Research and document known anti-patterns and gotchas
4. **Design Comparison**: Review design specifications and note all requirements
5. **Edge Case Identification**: Identify potential edge cases and boundary conditions
6. **Community Resources**: Review GitHub issues, Stack Overflow discussions for common problems

### Planning Phase Requirements

Planning must be explicit and prescriptive:

1. **Example-Based**: Reference specific examples to follow (with code snippets if possible)
2. **Update Checklists**: Create checklists for multi-step operations (schema updates, type synchronization)
3. **Anti-Pattern Warnings**: Explicitly call out patterns to avoid
4. **File Relationships**: Document which files must be updated together
5. **Design Requirements**: List all design specifications that must be met
6. **Edge Case Coverage**: Plan for handling edge cases identified in research

### Pre-Implementation Checklist

1. **Requirements Clear**: Understand acceptance criteria
2. **Design Reviewed**: Compare implementation plan against design specifications
3. **Framework Patterns Studied**: Review official examples for frameworks being used
4. **Types Defined**: Update shared types if needed
5. **Schemas Synchronized**: Ensure validation schemas match type definitions
6. **Tests Written**: Unit, integration, or E2E tests created
7. **Edge Cases Planned**: Tests cover empty states and boundary conditions
8. **Tests Failing**: Verify tests fail before implementation
9. **Storybook Added**: For new components, create stories

### Implementation Process

1. **Follow Framework Patterns**: Implement using established framework patterns, not custom solutions
2. **Implement Feature**: Make tests pass (green)
3. **Verify Completeness**: Check all related files updated (types, schemas, renderers, etc.)
4. **Refactor**: Clean up code while keeping tests green
5. **Manual Testing**: Verify in local dev environment including edge cases
6. **Design Verification**: Compare implementation against design specifications
7. **E2E Verification**: Run Playwright tests if applicable
8. **Code Review**: Submit PR with test results

### Quality Gates

- **All Tests Pass**: Unit, integration, and E2E tests must pass
- **Edge Cases Tested**: Empty states, boundary conditions validated
- **Type Safety**: No TypeScript errors
- **Schema Synchronization**: Types and validation schemas aligned
- **Design Match**: Implementation matches design specifications
- **Framework Patterns**: Follows official examples, no unnecessary custom code
- **Linting Clean**: ESLint checks pass
- **Formatting**: Prettier formatting applied
- **Storybook Builds**: Component stories render correctly
- **No Console Errors**: Clean browser console in dev mode

## Specification Development Standards

### Research Documentation (research.md)

Research must be thorough and actionable:

- **Working Examples**: Include full code examples from official framework documentation
- **Anti-Patterns Section**: Explicitly document what NOT to do with examples
- **Gotchas Documentation**: Known issues from GitHub/Stack Overflow with solutions
- **Design References**: Link to and analyze design specifications (Figma, wireframes)
- **Edge Case Identification**: List potential edge cases and how frameworks handle them
- **Pattern Analysis**: Explain how official examples solve similar problems

### Planning Documentation (plan.md)

Plans must be prescriptive, not descriptive:

- **Explicit Instructions**: Use "Copy this pattern" not "Implement feature X"
- **Code Examples**: Include code snippets showing the exact approach to follow
- **Update Checklists**: Multi-step checklists for operations like schema synchronization
- **Anti-Pattern Warnings**: Explicitly call out patterns to avoid with reasons
- **File Relationships**: Document inter-file dependencies clearly
- **Framework Guidance**: State when to trust framework vs implement custom
- **Design Requirements**: Enumerate all design specifications to meet

### Contract Documentation (contracts/)

Contracts must cover all scenarios:

- **Happy Path**: Primary success scenarios
- **Edge Cases**: Empty states, boundary conditions, error scenarios
- **Visual Specifications**: How components should render in various states
- **Interaction Specifications**: Keyboard shortcuts, user interactions
- **Validation Requirements**: What inputs are valid/invalid

### Task Documentation (tasks.md)

Tasks must include verification steps:

- **Review Checkpoints**: Each phase must have pre-completion review steps
- **Design Verification**: Task to compare against design specifications
- **Schema Sync Verification**: Task to confirm types and schemas aligned
- **Edge Case Testing**: Explicit tasks for testing edge cases
- **Framework Pattern Review**: Task to verify following official examples

## Governance

This constitution supersedes all other development practices and conventions. All team members must:

- **Compliance Verification**: Review all PRs for constitutional compliance
- **Reject Non-Compliance**: PRs violating core principles must be rejected
- **Amendment Process**: Constitution amendments require team consensus and documentation
- **Migration Planning**: Breaking changes require migration plan before approval
- **Continuous Learning**: Team members expected to learn and apply these principles
- **Specification Review**: Review all generated specifications (research.md, plan.md, contracts/) before implementation
- **Framework Documentation Priority**: Official framework examples take precedence over custom solutions

**Enforcement**: Type safety and contract integrity violations are blockers. Test-first, Storybook, and E2E requirements are mandatory for all new features. Framework-first development and schema synchronization are non-negotiable.

**Version**: 1.1.0 | **Ratified**: 2025-12-24 | **Last Amended**: 2025-12-30
