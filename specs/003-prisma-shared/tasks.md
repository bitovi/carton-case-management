# Tasks: Prisma Shared Package Migration

**Input**: Design documents from `/specs/003-prisma-shared/`
**Prerequisites**: spec.md (required)

**Tests**: No additional tests required - existing test suites will validate the migration.

**Organization**: Tasks are organized by user story to enable independent verification of each migration phase.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo**: `packages/shared/`, `packages/server/`, `packages/client/`
- Prisma schema moves from `packages/server/prisma/` → `packages/shared/prisma/`
- Database operations (seed, db file) move from `packages/server/prisma/` → `packages/server/db/`
- Generated Zod schemas go to `packages/shared/src/generated/`

---

## Phase 1: Setup

**Purpose**: Prepare the shared package for Prisma and install dependencies

- [x] T001 Add Prisma dependencies to `packages/shared/package.json` (prisma, @prisma/client, zod-prisma-types)
- [x] T002 [P] Create `packages/shared/prisma/` directory structure
- [x] T003 [P] Add database scripts to `packages/shared/package.json` (db:generate, db:push, db:studio, db:seed, db:setup)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Move Prisma schema to shared, reorganize db operations in server - MUST complete before user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Move `packages/server/prisma/schema.prisma` → `packages/shared/prisma/schema.prisma`
- [x] T005 [P] Create `packages/server/db/` directory
- [x] T006 [P] Move `packages/server/prisma/constants.ts` → `packages/server/db/constants.ts`
- [x] T007 [P] Move `packages/server/prisma/seed.ts` → `packages/server/db/seed.ts`
- [x] T008 Move `packages/server/prisma/prisma/dev.db` → `packages/server/db/dev.db` (or delete - will be recreated)
- [x] T009 Add zod-prisma-types generator to `packages/shared/prisma/schema.prisma` with output to `../src/generated`
- [x] T010 Update DATABASE_URL in schema.prisma to point to `../../server/db/dev.db`
- [x] T011 Run `prisma generate` from shared package to verify setup and generate Zod schemas

**Checkpoint**: Prisma schema is in shared, db operations organized in server/db, Zod schemas are generated

---

## Phase 3: User Story 1 - Developer Modifies Data Model (Priority: P1) 🎯 MVP

**Goal**: Single source of truth for data model with auto-generated types

**Independent Test**: Run `npm run db:generate --workspace=packages/shared` and verify types are generated

### Implementation for User Story 1

- [x] T012 [US1] Create Prisma client export in `packages/shared/src/prisma.ts`
- [x] T013 [US1] Create generated types export in `packages/shared/src/generated/index.ts`
- [x] T014 [US1] Update `packages/shared/src/index.ts` to export Prisma client and generated types
- [x] T015 [US1] Update root `package.json` scripts to point db:generate to shared, db:seed to server
- [x] T016 [US1] Verify `npm run db:generate --workspace=packages/shared` generates Zod schemas correctly

**Checkpoint**: Data model changes in shared auto-generate types for all packages

---

## Phase 4: User Story 3 - Server Accesses Database (Priority: P1)

**Goal**: Server imports Prisma client from shared and all database operations work

**Independent Test**: Run existing server tests - all should pass

### Implementation for User Story 3

- [x] T017 [US3] Update `packages/server/src/context.ts` to import PrismaClient from `@carton/shared`
- [x] T018 [US3] Update `packages/server/src/middleware/autoLogin.ts` to import PrismaClient from `@carton/shared`
- [x] T019 [P] [US3] Update `packages/server/src/context.test.ts` to mock `@carton/shared` instead of `@prisma/client`
- [x] T020 [P] [US3] Update `packages/server/src/middleware/autoLogin.test.ts` to mock `@carton/shared` instead of `@prisma/client`
- [x] T021 [US3] Update `packages/server/db/seed.ts` import paths (constants.ts is now local, PrismaClient from @carton/shared)
- [x] T022 [US3] Update `packages/server/package.json` db scripts to use new paths (db:seed points to db/seed.ts)
- [x] T023 [US3] Delete old `packages/server/prisma/` directory (after verifying migration)
- [x] T024 [US3] Run server tests to verify all database operations work

**Checkpoint**: Server fully migrated to use Prisma from shared

---

## Phase 5: User Story 2 - Developer Uses Zod Validation (Priority: P2)

**Goal**: Replace manual Zod schemas with generated ones from Prisma

**Independent Test**: Verify client and server can import Zod schemas from `@carton/shared`

### Implementation for User Story 2

- [x] T025 [US2] Update `packages/shared/src/types.ts` to re-export generated enum schemas (CaseStatus, CasePriority) from generated files
- [x] T026 [US2] Remove duplicate manual Zod enum definitions from `packages/shared/src/types.ts` (keep CASE_STATUS_OPTIONS and CASE_PRIORITY_OPTIONS helper constants)
- [x] T027 [US2] Verify `packages/server/src/router.ts` imports still work with re-exported schemas
- [x] T028 [US2] Verify client components still work with re-exported types (CaseStatus, CasePriority)
- [x] T029 [US2] Run full test suite to verify no regressions

**Checkpoint**: All Zod schemas derived from Prisma, no manual duplication

---

## Phase 6: Polish & Validation

**Purpose**: Final cleanup and validation

- [x] T030 [P] Update any remaining documentation references to old Prisma location
- [x] T031 Run `npm run typecheck` to verify no TypeScript errors (note: 2 pre-existing issues in client and server test files)
- [x] T032 Run `npm test` to verify all unit tests pass
- [x] T033 Run `npm run test:e2e` to verify all E2E tests pass
- [x] T034 Run `npm run db:setup` to verify full database setup works (generate in shared, seed in server)
- [x] T035 Verify `npm run db:studio --workspace=packages/shared` opens Prisma Studio

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational - establishes export structure
- **User Story 3 (Phase 4)**: Depends on User Story 1 - server needs exports ready
- **User Story 2 (Phase 5)**: Depends on User Story 1 - needs generated schemas
- **Polish (Phase 6)**: Depends on all user stories complete

### User Story Dependencies

- **User Story 1 (P1)**: After Foundational - No dependencies on other stories
- **User Story 3 (P1)**: After User Story 1 - needs Prisma client exported
- **User Story 2 (P2)**: After User Story 1 - needs generated Zod schemas exported

### Within Each Phase

- Tasks marked [P] can run in parallel
- Non-[P] tasks should run sequentially

### Parallel Opportunities

```bash
# Phase 1: Setup tasks T002 and T003 can run in parallel
Task: T002 [P] Create packages/shared/prisma/ directory structure
Task: T003 [P] Add database scripts to packages/shared/package.json

# Phase 2: Directory and file moves can run in parallel
Task: T005 [P] Create packages/server/db/ directory
Task: T006 [P] Move constants.ts to server/db
Task: T007 [P] Move seed.ts to server/db

# Phase 4: Test updates can run in parallel
Task: T019 [P] [US3] Update context.test.ts mocks
Task: T020 [P] [US3] Update autoLogin.test.ts mocks
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 3)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (data model exports)
4. Complete Phase 4: User Story 3 (server migration)
5. **STOP and VALIDATE**: Run tests, verify server works
6. Application should be fully functional at this point

### Incremental Delivery

1. Phases 1-4 → Server migrated, tests passing (MVP!)
2. Phase 5 → Clean up Zod duplication (polish)
3. Phase 6 → Final validation and cleanup

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- The migration is mostly moving files and updating imports
- Critical path: Setup → Foundational → US1 → US3 → US2 → Polish
- Commit after each phase or logical group
- Run tests frequently to catch issues early
