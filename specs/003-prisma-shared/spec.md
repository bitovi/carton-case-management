# Feature Specification: Prisma Shared Package Migration

**Feature Branch**: `003-prisma-shared`  
**Created**: January 14, 2026  
**Status**: Draft  
**Input**: User description: "Move Prisma to shared package and add Zod type generation"

## Overview

Move the Prisma schema and configuration from `packages/server` to `packages/shared` to establish the data model as a shared concern. Additionally, integrate automatic Zod schema generation from the Prisma schema to eliminate manual type duplication and ensure type consistency across the client and server packages.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Modifies Data Model (Priority: P1)

As a developer, when I need to add or modify a data model field, I want to update a single source (the Prisma schema in shared) and have all types automatically synchronized across the entire application, so that I don't have to manually update types in multiple places.

**Why this priority**: This is the core value proposition - establishing a single source of truth for the data model eliminates duplication and reduces the risk of type inconsistencies between client and server.

**Independent Test**: Can be fully tested by adding a new field to the Prisma schema, running the generation command, and verifying the Zod schema and TypeScript types are automatically available in both client and server packages.

**Acceptance Scenarios**:

1. **Given** the Prisma schema in `packages/shared/prisma`, **When** a developer adds a new enum value, **Then** the corresponding Zod schema is automatically updated after running the generate command
2. **Given** the Prisma schema has been modified, **When** the developer runs the database migration and generation, **Then** all dependent packages have access to the updated types without manual intervention
3. **Given** the shared package exports Prisma types, **When** the server imports the Prisma client, **Then** it can perform all database operations as before

---

### User Story 2 - Developer Uses Zod Validation (Priority: P2)

As a developer, when I need to validate user input on the client or server, I want to use Zod schemas that are automatically derived from the Prisma data model, so that validation rules stay consistent with the database schema.

**Why this priority**: Automatic Zod generation prevents validation logic from drifting out of sync with the actual data model, reducing bugs and maintenance overhead.

**Independent Test**: Can be tested by importing a generated Zod schema in the client, using it to validate form input, and confirming it enforces the same constraints as the Prisma model.

**Acceptance Scenarios**:

1. **Given** the Prisma schema defines `CaseStatus` and `CasePriority` enums, **When** Zod schemas are generated, **Then** they validate only the allowed enum values
2. **Given** a generated Zod schema for a model, **When** used for form validation on the client, **Then** it correctly accepts valid data and rejects invalid data
3. **Given** the existing manual Zod schemas in `types.ts`, **When** migration is complete, **Then** they are replaced with or re-export the generated schemas

---

### User Story 3 - Server Accesses Database (Priority: P1)

As the server application, I need to continue accessing the database using Prisma Client, even though Prisma has moved to the shared package, so that all existing functionality continues to work.

**Why this priority**: This is critical for the application to function - the server must maintain database access during and after the migration.

**Independent Test**: Can be tested by running the existing test suite and verifying all database operations (queries, mutations, seed) work correctly.

**Acceptance Scenarios**:

1. **Given** Prisma is in the shared package, **When** the server imports Prisma Client from `@carton/shared`, **Then** it can query and mutate data as before
2. **Given** the database seed script, **When** executed from its new location, **Then** it populates the database correctly
3. **Given** existing server tests, **When** run after migration, **Then** all tests pass without modification to test logic

---

### Edge Cases

- What happens when a developer forgets to run the generate command after schema changes?
- How does the build process handle missing generated files?
- What happens if the Zod generator encounters an unsupported Prisma feature?
- How are database migrations handled from the new package location?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Prisma schema MUST be located in `packages/shared/prisma/schema.prisma`
- **FR-002**: Prisma Client MUST be exportable from `@carton/shared` for use by the server
- **FR-003**: Zod schemas MUST be automatically generated from the Prisma schema for all enums and models
- **FR-004**: Generated Zod schemas MUST be exported from `@carton/shared` for use by both client and server
- **FR-005**: Database commands (db:push, db:generate) MUST work with schema in shared and database in server
- **FR-006**: Database seed script MUST be relocated to `packages/server/db/` and remain functional
- **FR-007**: All existing imports in the server package MUST be updated to reference `@carton/shared`
- **FR-008**: The manually-defined Zod schemas in `types.ts` MUST be replaced with or re-export the generated schemas
- **FR-009**: NPM scripts for database operations MUST be available from the root package or shared package
- **FR-010**: The existing test suite MUST pass after migration without changes to test logic

### Key Entities

- **Prisma Schema**: The single source of truth for the data model, defining all database tables, relationships, and enums
- **Prisma Client**: The auto-generated database client used by the server for all database operations
- **Generated Zod Schemas**: Validation schemas derived from the Prisma schema, used for runtime type validation on client and server
- **Shared Package (`@carton/shared`)**: The package that will own the data model and export types, Prisma Client, and Zod schemas

## Assumptions

- The `zod-prisma-types` generator (or similar) is compatible with the current Prisma schema
- SQLite database location configuration will continue to work from the shared package
- No circular dependency issues will arise from server depending on shared for Prisma Client
- The client package will only import types and Zod schemas, not the Prisma Client runtime

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can modify the data model in a single location and have types available across all packages after one command
- **SC-002**: All existing unit tests pass without modification to test logic
- **SC-003**: All existing E2E tests pass without modification
- **SC-004**: The manual Zod enum schemas in `types.ts` are eliminated or reduced to re-exports
- **SC-005**: Database operations (migrate, seed, studio) work correctly from the new location
- **SC-006**: Build process completes successfully for all packages
