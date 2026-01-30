# Tasks: Like and Dislike Buttons

**Input**: Design documents from `/specs/001-case-voting/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are REQUIRED for this feature per constitutional requirement (Section III: Test-Informed Development)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a monorepo with npm workspaces:
- **Shared**: `packages/shared/` (Prisma schema, types)
- **Server**: `packages/server/src/` (tRPC API)
- **Client**: `packages/client/src/` (React components)
- **Tests**: `tests/e2e/` (Playwright E2E tests)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and database schema setup

- [X] T001 Add VoteType enum to packages/shared/prisma/schema.prisma
- [X] T002 Add CaseVote model with unique constraint to packages/shared/prisma/schema.prisma
- [X] T003 Add votes relation to User model in packages/shared/prisma/schema.prisma
- [X] T004 Add votes relation to Case model in packages/shared/prisma/schema.prisma
- [X] T005 Generate Prisma Client and Zod schemas with npm run db:generate
- [X] T006 Push schema to database with npm run db:push
- [ ] T007 Verify schema in Prisma Studio with npm run db:studio

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core type definitions and shared infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 [P] Add VoteType, VoteSummary, VoteAction, VoteResponse types to packages/shared/src/types.ts
- [X] T009 [P] Add VOTE_TYPE_OPTIONS constants to packages/shared/src/types.ts
- [X] T010 [P] Export vote types from packages/shared/src/index.ts
- [X] T011 Verify shared package builds successfully with npm run build in packages/shared

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Case Vote Counts (Priority: P1) 🎯 MVP

**Goal**: Display the current number of likes and dislikes on cases to show community sentiment

**Independent Test**: View any case in the case details view and verify that like and dislike counts are visible. Verify counts are displayed in the case list view.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T012 [P] [US1] Write tRPC router test for case.getById returns voteSummary in packages/server/src/router.test.ts
- [X] T013 [P] [US1] Write tRPC router test for case.list returns voteSummary in packages/server/src/router.test.ts

### Implementation for User Story 1

- [X] T014 [US1] Modify case.getById procedure to include votes relation in packages/server/src/router.ts
- [X] T015 [US1] Add vote count calculation to case.getById response in packages/server/src/router.ts
- [X] T016 [US1] Add voteSummary with likes, dislikes, userVote to case.getById return in packages/server/src/router.ts
- [X] T017 [US1] Modify case.list procedure to include votes relation in packages/server/src/router.ts
- [X] T018 [US1] Add vote count calculation to each case in case.list response in packages/server/src/router.ts
- [X] T019 [US1] Run tRPC router tests to verify US1 tests pass with npm run test:server
- [X] T020 [US1] Display vote counts in case list view in packages/client/src/components/CaseList/CaseListItem.tsx
- [ ] T021 [US1] Verify vote counts appear in case list by running npm run dev and viewing cases

**Checkpoint**: At this point, User Story 1 should be fully functional - vote counts visible in case list and details

---

## Phase 4: User Story 2 - Vote on a Case (Priority: P2)

**Goal**: Allow logged-in users to like or dislike cases with immediate visual feedback

**Independent Test**: Log in, view a case, click the like button, and verify the count increases by 1 and the button appears active

### Tests for User Story 2

- [X] T022 [P] [US2] Write tRPC test for creating a LIKE vote in packages/server/src/router.test.ts
- [X] T023 [P] [US2] Write tRPC test for creating a DISLIKE vote in packages/server/src/router.test.ts
- [X] T024 [P] [US2] Write tRPC test for UNAUTHORIZED error when not authenticated in packages/server/src/router.test.ts
- [ ] T025 [P] [US2] Write component test for VoteButtons rendering in packages/client/src/components/VoteButtons/VoteButtons.test.tsx
- [ ] T026 [P] [US2] Write component test for VoteButtons displaying vote counts in packages/client/src/components/VoteButtons/VoteButtons.test.tsx
- [ ] T027 [P] [US2] Write E2E test for user liking a case in tests/e2e/voting.spec.ts

### Implementation for User Story 2

- [X] T028 [US2] Implement case.vote mutation procedure with authentication check in packages/server/src/router.ts
- [X] T029 [US2] Add input validation for caseId and voteType in case.vote procedure in packages/server/src/router.ts
- [X] T030 [US2] Add logic to create new vote when user hasn't voted in case.vote procedure in packages/server/src/router.ts
- [X] T031 [US2] Return VoteResponse with action 'created' from case.vote in packages/server/src/router.ts
- [X] T032 [US2] Run tRPC tests to verify case.vote creation works with npm run test:server
- [X] T033 [P] [US2] Create VoteButtons component file structure in packages/client/src/components/VoteButtons/
- [X] T034 [P] [US2] Implement VoteButtons.tsx with like and dislike buttons using Shadcn UI Button in packages/client/src/components/VoteButtons/VoteButtons.tsx
- [X] T035 [P] [US2] Add ThumbsUp and ThumbsDown icons from lucide-react to VoteButtons in packages/client/src/components/VoteButtons/VoteButtons.tsx
- [X] T036 [US2] Implement trpc.case.vote.useMutation in VoteButtons component in packages/client/src/components/VoteButtons/VoteButtons.tsx
- [X] T037 [US2] Add optimistic UI update in onMutate callback for VoteButtons in packages/client/src/components/VoteButtons/VoteButtons.tsx
- [X] T038 [US2] Add error rollback in onError callback for VoteButtons in packages/client/src/components/VoteButtons/VoteButtons.tsx
- [X] T039 [US2] Add cache invalidation in onSettled callback for VoteButtons in packages/client/src/components/VoteButtons/VoteButtons.tsx
- [X] T040 [US2] Add aria-label and aria-pressed for accessibility in VoteButtons in packages/client/src/components/VoteButtons/VoteButtons.tsx
- [X] T041 [US2] Create VoteButtons index.ts export file in packages/client/src/components/VoteButtons/index.ts
- [X] T042 [US2] Integrate VoteButtons into CaseDetails component in packages/client/src/components/CaseDetails/CaseDetails.tsx
- [X] T043 [P] [US2] Create Storybook story for NotVoted state in packages/client/src/components/VoteButtons/VoteButtons.stories.tsx
- [X] T044 [P] [US2] Create Storybook story for Liked state in packages/client/src/components/VoteButtons/VoteButtons.stories.tsx
- [X] T045 [P] [US2] Create Storybook story for Disliked state in packages/client/src/components/VoteButtons/VoteButtons.stories.tsx
- [X] T046 [P] [US2] Create Storybook story for Disabled state in packages/client/src/components/VoteButtons/VoteButtons.stories.tsx
- [X] T047 [P] [US2] Create Storybook story for NoVotes state in packages/client/src/components/VoteButtons/VoteButtons.stories.tsx
- [ ] T048 [US2] Run component tests to verify VoteButtons with npm run test:client
- [ ] T049 [US2] Run Storybook to verify all stories with npm run storybook
- [ ] T050 [US2] Run E2E tests to verify voting flow with npm run test:e2e

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - users can view counts and cast votes

---

## Phase 5: User Story 3 - Change Vote (Priority: P3)

**Goal**: Allow users to change their vote or remove it entirely

**Independent Test**: Vote on a case, then click the opposite vote button and verify counts update correctly. Click the same button again to verify vote removal.

### Tests for User Story 3

- [X] T051 [P] [US3] Write tRPC test for changing vote from LIKE to DISLIKE in packages/server/src/router.test.ts
- [X] T052 [P] [US3] Write tRPC test for changing vote from DISLIKE to LIKE in packages/server/src/router.test.ts
- [X] T053 [P] [US3] Write tRPC test for removing LIKE vote by clicking again in packages/server/src/router.test.ts
- [X] T054 [P] [US3] Write tRPC test for removing DISLIKE vote by clicking again in packages/server/src/router.test.ts
- [ ] T055 [P] [US3] Write E2E test for changing vote in tests/e2e/voting.spec.ts
- [ ] T056 [P] [US3] Write E2E test for removing vote in tests/e2e/voting.spec.ts
- [ ] T057 [P] [US3] Write E2E test for vote persistence after page refresh in tests/e2e/voting.spec.ts

### Implementation for User Story 3

- [X] T058 [US3] Add logic to find existing vote in case.vote procedure in packages/server/src/router.ts
- [X] T059 [US3] Add logic to delete vote if same type clicked in case.vote procedure in packages/server/src/router.ts
- [X] T060 [US3] Return VoteResponse with action 'removed' when vote deleted in packages/server/src/router.ts
- [X] T061 [US3] Add logic to upsert vote if different type clicked in case.vote procedure in packages/server/src/router.ts
- [X] T062 [US3] Return VoteResponse with action 'changed' when vote updated in packages/server/src/router.ts
- [X] T063 [US3] Update VoteButtons optimistic logic to handle vote changes in packages/client/src/components/VoteButtons/VoteButtons.tsx
- [X] T064 [US3] Update VoteButtons optimistic logic to handle vote removal in packages/client/src/components/VoteButtons/VoteButtons.tsx
- [X] T065 [US3] Add visual feedback for vote state changes in VoteButtons in packages/client/src/components/VoteButtons/VoteButtons.tsx
- [X] T066 [US3] Run all tRPC tests to verify vote change and removal with npm run test:server
- [ ] T067 [US3] Run E2E tests to verify change and removal flows with npm run test:e2e

**Checkpoint**: All user stories should now be independently functional - users can view, vote, change, and remove votes

---

## Phase 6: User Story 4 - Unauthenticated User Voting (Priority: P4)

**Goal**: Handle unauthenticated users gracefully - show counts but prevent voting

**Independent Test**: Log out, view a case, and verify that vote counts are visible but vote buttons are disabled or hidden

### Tests for User Story 4

- [ ] T068 [P] [US4] Write E2E test for unauthenticated user seeing vote counts in tests/e2e/voting.spec.ts
- [ ] T069 [P] [US4] Write E2E test for unauthenticated user with disabled vote buttons in tests/e2e/voting.spec.ts

### Implementation for User Story 4

- [X] T070 [US4] Add disabled prop handling to VoteButtons component in packages/client/src/components/VoteButtons/VoteButtons.tsx
- [X] T071 [US4] Update CaseDetails to pass disabled=true when user not authenticated in packages/client/src/components/CaseDetails/CaseDetails.tsx
- [ ] T072 [US4] Run E2E tests to verify unauthenticated behavior with npm run test:e2e

**Checkpoint**: All user stories complete - feature handles both authenticated and unauthenticated users

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T073 [P] Add seed data for votes in packages/server/db/seed.ts
- [X] T074 Run seed script to populate test votes with npm run db:seed
- [ ] T075 [P] Add component test for VoteButtons highlights liked button in packages/client/src/components/VoteButtons/VoteButtons.test.tsx
- [ ] T076 [P] Add component test for VoteButtons highlights disliked button in packages/client/src/components/VoteButtons/VoteButtons.test.tsx
- [X] T077 Code cleanup: Remove console.logs and debug statements across all files
- [X] T078 Verify all ESLint rules pass with npm run lint
- [ ] T079 Verify all Prettier formatting with npm run format:check
- [X] T080 Run full test suite to ensure all tests pass with npm test
- [X] T081 Verify TypeScript compilation with npm run type-check
- [ ] T082 Manual verification using quickstart.md guide
- [ ] T083 Update README.md with voting feature documentation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (Setup) completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Phase 2 (Foundational) completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1 but independently testable
- **User Story 3 (P3)**: Depends on User Story 2 (need voting capability before changing votes)
- **User Story 4 (P4)**: Can start after User Story 1 (only needs vote display, not voting logic)

### Within Each User Story

- Tests MUST be written and FAIL before implementation
- Server-side logic before client components
- Core components before integration into pages
- Component implementation before Storybook stories
- Unit/integration tests before E2E tests
- Story complete before moving to next priority

### Parallel Opportunities

- **Setup Phase**: T001-T004 can run in parallel (different parts of same file - exercise caution)
- **Foundational Phase**: T008-T010 can run in parallel (different files)
- **User Story 1 Tests**: T012-T013 can run in parallel (same test file, different test cases)
- **User Story 2 Tests**: T022-T027 can run in parallel (different test files)
- **User Story 2 Components**: T033-T047 Storybook stories (T043-T047) can run in parallel
- **User Story 3 Tests**: T051-T057 can run in parallel (different test files)
- **User Story 4 Tests**: T068-T069 can run in parallel (different test cases)
- **Polish Phase**: T073, T075-T076 can run in parallel (different files)

---

## Parallel Example: User Story 2

```bash
# Launch all tests for User Story 2 together:
Task: "Write tRPC test for creating a LIKE vote in packages/server/src/router.test.ts"
Task: "Write tRPC test for creating a DISLIKE vote in packages/server/src/router.test.ts"
Task: "Write tRPC test for UNAUTHORIZED error in packages/server/src/router.test.ts"
Task: "Write component test for VoteButtons rendering in packages/client/src/components/VoteButtons/VoteButtons.test.tsx"
Task: "Write component test for VoteButtons displaying counts in packages/client/src/components/VoteButtons/VoteButtons.test.tsx"
Task: "Write E2E test for user liking a case in tests/e2e/voting.spec.ts"

# Launch all Storybook stories for User Story 2 together:
Task: "Create Storybook story for NotVoted state"
Task: "Create Storybook story for Liked state"
Task: "Create Storybook story for Disliked state"
Task: "Create Storybook story for Disabled state"
Task: "Create Storybook story for NoVotes state"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T007)
2. Complete Phase 2: Foundational (T008-T011) - CRITICAL - blocks all stories
3. Complete Phase 3: User Story 1 (T012-T021)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready - users can now see vote counts!

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (Vote counts visible! 👀)
3. Add User Story 2 → Test independently → Deploy/Demo (Users can vote! 👍)
4. Add User Story 3 → Test independently → Deploy/Demo (Vote changes work! ↔️)
5. Add User Story 4 → Test independently → Deploy/Demo (Unauthenticated handled! 🔒)
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (T012-T021)
   - Developer B: User Story 2 (T022-T050)
   - Developer C: User Story 4 (T068-T072) - can run parallel with US1
3. User Story 3 waits for US2 completion (depends on voting logic)
4. Stories integrate cleanly due to well-defined contracts

---

## Task Summary

**Total Tasks**: 83
- **Setup**: 7 tasks
- **Foundational**: 4 tasks  
- **User Story 1**: 10 tasks (2 test tasks, 8 implementation tasks)
- **User Story 2**: 29 tasks (6 test tasks, 23 implementation tasks)
- **User Story 3**: 17 tasks (7 test tasks, 10 implementation tasks)
- **User Story 4**: 5 tasks (2 test tasks, 3 implementation tasks)
- **Polish**: 11 tasks

**Test Coverage**: 
- Unit tests: tRPC router tests, React component tests
- Integration tests: Optimistic updates, cache management
- E2E tests: Full voting flows with authentication
- Storybook: All component visual states

**Estimated Effort**: 
- MVP (US1 only): 4-6 hours
- MVP + Voting (US1+US2): 12-16 hours
- Full Feature (US1-US4): 20-24 hours
- With Polish: 24-28 hours

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability (US1, US2, US3, US4)
- Each user story is independently completable and testable
- Tests are written FIRST and must FAIL before implementation (TDD)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Constitution compliant: Type safety, API contract integrity, test-informed development, component standards, E2E testing
