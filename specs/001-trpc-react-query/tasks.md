# Tasks: tRPC React Query Integration

**Feature**: Improved API State Management  
**Branch**: `001-trpc-react-query`  
**Input**: Design documents from `/specs/001-trpc-react-query/`

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install missing packages and verify existing setup

- [X] T001 Install React Query DevTools package in packages/client/package.json
- [X] T002 [P] Verify all tRPC + React Query packages are at correct versions

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Create shared test infrastructure that all user stories will use

**⚠️ CRITICAL**: No user story implementation can begin until this phase is complete

- [X] T003 Create test utilities file at packages/client/src/test/utils.ts with createTestQueryClient function
- [X] T004 [P] Add createTrpcWrapper function to packages/client/src/test/utils.ts
- [X] T005 [P] Add renderWithTrpc helper function to packages/client/src/test/utils.ts
- [X] T006 [P] Create vitest setup file if not exists to configure MSW

**Checkpoint**: Test infrastructure ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Automatic Request Caching (Priority: P1) 🎯 MVP

**Goal**: Ensure the existing tRPC + React Query setup properly caches data and prevents redundant network requests

**Independent Test**: Navigate to home page, leave, and return - data should appear instantly from cache without loading spinner

### Implementation for User Story 1

- [X] T007 [P] [US1] Verify QueryClient cache configuration in packages/client/src/lib/trpc.tsx uses appropriate defaults
- [X] T008 [P] [US1] Add React Query DevTools to packages/client/src/lib/trpc.tsx with dev-only rendering
- [X] T009 [US1] Update HomePage component in packages/client/src/pages/HomePage.tsx to demonstrate proper cache behavior
- [X] T010 [US1] Add cache verification E2E test in tests/e2e/cache-behavior.spec.ts
- [X] T011 [US1] Document cache configuration patterns in README.md section "Data Caching with tRPC + React Query"

**Checkpoint**: At this point, caching should be verified working and documented

---

## Phase 4: User Story 2 - Clear Loading and Error Feedback (Priority: P1)

**Goal**: Ensure all components properly display loading states and error messages using React Query state

**Independent Test**: Trigger a query and verify loading indicator appears; simulate error and verify error message displays

### Tests for User Story 2

- [X] T012 [P] [US2] Update HomePage.test.tsx to use new test utilities instead of direct mocking
- [X] T013 [P] [US2] Add test case for loading state in packages/client/src/pages/HomePage.test.tsx
- [X] T014 [P] [US2] Add test case for error state in packages/client/src/pages/HomePage.test.tsx
- [X] T015 [P] [US2] Add test case for empty state in packages/client/src/pages/HomePage.test.tsx

### Implementation for User Story 2

- [X] T016 [US2] Review and enhance loading state handling in packages/client/src/pages/HomePage.tsx
- [X] T017 [US2] Review and enhance error state handling in packages/client/src/pages/HomePage.tsx
- [X] T018 [US2] Add retry functionality to error states in packages/client/src/pages/HomePage.tsx
- [X] T019 [US2] Verify HomePage.stories.tsx demonstrates all loading and error states
- [X] T020 [US2] Add E2E test for error handling in tests/e2e/error-handling.spec.ts

**Checkpoint**: At this point, all loading and error states should be properly handled and tested

---

## Phase 5: User Story 3 - Developer Productivity and Maintainability (Priority: P2)

**Goal**: Provide comprehensive documentation and examples so developers can quickly implement data fetching patterns

**Independent Test**: New developer can read documentation and add a new tRPC query with tests in under 30 minutes

### Implementation for User Story 3

- [X] T021 [P] [US3] Add "Data Fetching with tRPC + React Query" section to README.md with query example
- [X] T022 [P] [US3] Add mutation example with cache invalidation to README.md
- [X] T023 [P] [US3] Add testing patterns documentation to README.md
- [X] T024 [P] [US3] Link to quickstart guide from README.md
- [X] T025 [P] [US3] Link to contract examples in README.md
- [ ] T026 [US3] Create example mutation component (optional) to demonstrate patterns in codebase
- [X] T027 [US3] Update ARCHITECTURE.md to document tRPC + React Query integration

**Checkpoint**: All documentation should be complete and developer-ready

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and validation

- [X] T028 [P] Run all existing tests to verify no regressions
- [X] T029 [P] Run build to verify no TypeScript errors
- [X] T030 [P] Verify DevTools appear in development mode but not in production build
- [X] T031 [P] Test cache behavior manually using DevTools
- [X] T032 [P] Validate quickstart guide by following all steps
- [X] T033 Remove TODO comment from packages/client/src/pages/HomePage.test.tsx
- [X] T034 [P] Update package.json scripts if any test commands changed
- [X] T035 Final code review and cleanup

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (US1, US2, US3 are mostly independent)
  - Or sequentially in priority order (US1 → US2 → US3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Independent but benefits from US1 DevTools
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Benefits from US1 and US2 being complete for better examples

### Within Each User Story

**User Story 1 (Caching)**:

1. Verify cache config (T007, T008 parallel)
2. Update components (T009)
3. Add tests and docs (T010, T011 parallel)

**User Story 2 (Loading/Error)**:

1. Update tests first (T012-T015 parallel)
2. Enhance implementation (T016-T018 sequential)
3. Add stories and E2E (T019, T020 parallel)

**User Story 3 (Documentation)**:

1. All documentation tasks can run in parallel (T021-T025)
2. Optional example component (T026)
3. Architecture docs (T027)

### Parallel Opportunities

**Phase 1**: Both tasks can run in parallel (T001, T002)

**Phase 2**: Tasks T004, T005, T006 can run in parallel after T003

**User Story 1**: Tasks T007 and T008 can run in parallel

**User Story 2**:

- Tests T012-T015 can all run in parallel (MSW mocking)
- Stories and E2E T019, T020 can run in parallel

**User Story 3**: All documentation tasks T021-T027 can run in parallel

**Phase 6**: Most polish tasks can run in parallel (T028-T032, T034)

---

## Parallel Example: User Story 2

```bash
# After Foundation phase completes, start User Story 2

# Terminal 1: Update all test files (can work in parallel)
git checkout -b us2-tests
# Work on T012, T013, T014, T015 together

# Terminal 2: Update implementation (sequential within this)
git checkout -b us2-implementation
# Work on T016, then T017, then T018

# Terminal 3: Add stories and E2E (parallel with impl)
git checkout -b us2-validation
# Work on T019 and T020 together
```

---

## Implementation Strategy

### MVP Scope (First Release)

**Minimum Viable Product = User Story 1 ONLY**

Just implementing US1 gives you:

- ✅ Verified caching working correctly
- ✅ DevTools for debugging
- ✅ Basic documentation of cache behavior

This is a **complete, deployable increment** that improves developer experience.

### Incremental Delivery

1. **Sprint 1**: Phase 1-2 (Setup + Foundation) + User Story 1
   - Deploy: Developers can use DevTools and verify caching
2. **Sprint 2**: User Story 2
   - Deploy: Better test coverage and validated error handling
3. **Sprint 3**: User Story 3
   - Deploy: Comprehensive documentation for team onboarding

### Recommended Order

For a solo developer or small team:

1. Complete Phase 1 (Setup) - ~15 minutes
2. Complete Phase 2 (Foundation) - ~1 hour
3. Complete User Story 1 - ~2-3 hours (includes testing)
4. Complete User Story 2 - ~2-3 hours (test updates + validation)
5. Complete User Story 3 - ~1-2 hours (documentation)
6. Complete Phase 6 (Polish) - ~1 hour

**Total estimated time**: 8-11 hours

For parallel team execution:

- Developer A: Phase 1-2, then User Story 1
- Developer B: User Story 2 (starts after Phase 2)
- Developer C: User Story 3 (starts after Phase 2)
- All: Phase 6 review together

**Total estimated time with 3 developers**: 4-6 hours

---

## Task Count Summary

- **Setup**: 2 tasks
- **Foundation**: 4 tasks (blocking)
- **User Story 1**: 5 tasks
- **User Story 2**: 9 tasks (5 tests + 4 implementation)
- **User Story 3**: 7 tasks
- **Polish**: 8 tasks

**Total**: 35 tasks

**Parallelizable**: 23 tasks marked [P] (66%)

**Tests Included**: 5 unit test tasks (US2 only) - tests are minimal since implementation already exists

---

## Success Validation

After completing all tasks, verify:

### User Story 1 Success Criteria

- [ ] Navigate to home page, leave, return → data appears instantly (<100ms)
- [ ] DevTools show cached queries
- [ ] README documents cache configuration

### User Story 2 Success Criteria

- [ ] Loading spinner appears within 50ms of query start
- [ ] Error messages display clearly when query fails
- [ ] All HomePage tests pass with new utilities

### User Story 3 Success Criteria

- [ ] New developer can follow README to add a query in <30 minutes
- [ ] Documentation has 3+ examples (query, mutation, cache invalidation)
- [ ] Quickstart guide validated end-to-end

### Overall Success Criteria

- [ ] All existing tests pass (npm test)
- [ ] Build succeeds with no errors (npm run build)
- [ ] DevTools visible in dev, absent in production
- [ ] No TypeScript errors
- [ ] All 35 tasks checked off
