# Tasks: Comment Voting System

**Input**: Design documents from `/specs/001-comment-voting/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/vote-api.yaml ✅

**Tests**: This feature includes comprehensive testing at all levels (unit, integration, component, E2E) as specified in plan.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

This is a monorepo project with:
- **Shared**: `packages/shared/` (Prisma schema, types)
- **Server**: `packages/server/` (tRPC router, API)
- **Client**: `packages/client/` (React components, hooks)
- **Tests**: `tests/` at root (E2E tests)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Database schema and type generation for voting system

- [ ] T001 Add CommentVote model to Prisma schema in packages/shared/prisma/schema.prisma
- [ ] T002 Add VoteType enum to Prisma schema in packages/shared/prisma/schema.prisma
- [ ] T003 Update Comment model to include votes relationship in packages/shared/prisma/schema.prisma
- [ ] T004 Update User model to include commentVotes relationship in packages/shared/prisma/schema.prisma
- [ ] T005 Generate Prisma client and Zod schemas by running npm run db:generate --workspace=packages/shared
- [ ] T006 Create database migration by running npx prisma migrate dev --name add-comment-voting from packages/server
- [ ] T007 [P] Create vote-types.ts with VoteType enum and shared types in packages/shared/src/vote-types.ts
- [ ] T008 [P] Export vote types from packages/shared/src/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core voting infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T009 [P] Implement commentVote.getByCommentId query in packages/server/src/router.ts
- [ ] T010 [P] Implement commentVote.vote mutation in packages/server/src/router.ts
- [ ] T011 [P] Implement commentVote.removeVote mutation in packages/server/src/router.ts
- [ ] T012 Update case.getById query to include comment votes in packages/server/src/router.ts
- [ ] T013 Add sample vote data to seed script in packages/server/db/seed.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Express Support for Comments (Priority: P1) 🎯 MVP

**Goal**: Users can like comments and see like counts, providing immediate value by allowing users to express support

**Independent Test**: View a comment, click the like button, see the vote count increase, and verify the button shows as active. This delivers complete like functionality without requiring any other features.

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T014 [P] [US1] Create vote router unit tests for vote mutation in packages/server/src/router.test.ts
- [ ] T015 [P] [US1] Add vote router unit test for getByCommentId query in packages/server/src/router.test.ts
- [ ] T016 [P] [US1] Add vote router unit test for idempotent voting in packages/server/src/router.test.ts
- [ ] T017 [P] [US1] Add vote router unit test for UNAUTHORIZED error handling in packages/server/src/router.test.ts

### Implementation for User Story 1

- [ ] T018 [P] [US1] Create useCommentVoting custom hook with like functionality in packages/client/src/components/CaseDetails/components/CaseComments/hooks/useCommentVoting.ts
- [ ] T019 [US1] Integrate VoteButton component for likes in packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.tsx
- [ ] T020 [US1] Add optimistic update logic for like votes in useCommentVoting hook
- [ ] T021 [US1] Add error handling and rollback for failed like votes in useCommentVoting hook
- [ ] T022 [P] [US1] Add component tests for like button interaction in packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.test.tsx
- [ ] T023 [P] [US1] Update VoteButton component tests for like functionality in packages/client/src/components/common/VoteButton/VoteButton.test.tsx
- [ ] T024 [P] [US1] Verify VoteButton stories still work after integration in packages/client/src/components/common/VoteButton/VoteButton.stories.tsx
- [ ] T025 [US1] Add vote count aggregation logic (likes only) in useCommentVoting hook

**Checkpoint**: At this point, User Story 1 should be fully functional - users can like comments and see like counts independently

---

## Phase 4: User Story 2 - Express Disagreement with Comments (Priority: P2)

**Goal**: Users can dislike comments and see dislike counts, enabling negative feedback mechanism

**Independent Test**: Click the dislike button on a comment and verify the dislike count increases and the button shows as active. Works independently from likes.

### Tests for User Story 2 ⚠️

- [ ] T026 [P] [US2] Add vote router unit test for dislike votes in packages/server/src/router.test.ts
- [ ] T027 [P] [US2] Add component test for dislike button interaction in packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.test.tsx

### Implementation for User Story 2

- [ ] T028 [P] [US2] Add dislike functionality to useCommentVoting hook in packages/client/src/components/CaseDetails/components/CaseComments/hooks/useCommentVoting.ts
- [ ] T029 [US2] Integrate VoteButton component for dislikes in packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.tsx
- [ ] T030 [US2] Add optimistic update logic for dislike votes in useCommentVoting hook
- [ ] T031 [US2] Update vote count aggregation to include dislikes in useCommentVoting hook

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - users can both like and dislike comments

---

## Phase 5: User Story 3 - Change Vote Direction (Priority: P3)

**Goal**: Users can switch from like to dislike or vice versa in a single action, enhancing user flexibility

**Independent Test**: Like a comment, then click dislike, and verify the like is removed while the dislike is added. The counts should reflect this change accurately.

### Tests for User Story 3 ⚠️

- [ ] T032 [P] [US3] Add vote router unit test for vote type changes (LIKE to DISLIKE) in packages/server/src/router.test.ts
- [ ] T033 [P] [US3] Add vote router unit test for vote type changes (DISLIKE to LIKE) in packages/server/src/router.test.ts
- [ ] T034 [P] [US3] Add component test for vote direction changes in packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.test.tsx

### Implementation for User Story 3

- [ ] T035 [US3] Add vote toggle logic to handle opposite vote clicks in useCommentVoting hook
- [ ] T036 [US3] Update optimistic update logic to handle vote changes in useCommentVoting hook
- [ ] T037 [US3] Add visual feedback for vote direction changes in CaseComments component

**Checkpoint**: All vote change scenarios should now work - users can switch between like/dislike seamlessly

---

## Phase 6: User Story 4 - Remove Vote (Priority: P3)

**Goal**: Users can remove their vote entirely by clicking the same button again, allowing vote retraction

**Independent Test**: Like a comment, click like again, and verify the vote is removed and the count decreases. Works independently of other features.

### Tests for User Story 4 ⚠️

- [ ] T038 [P] [US4] Add vote router unit test for removeVote mutation in packages/server/src/router.test.ts
- [ ] T039 [P] [US4] Add vote router unit test for idempotent removeVote in packages/server/src/router.test.ts
- [ ] T040 [P] [US4] Add component test for vote removal interaction in packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.test.tsx

### Implementation for User Story 4

- [ ] T041 [US4] Add vote removal logic to useCommentVoting hook
- [ ] T042 [US4] Update vote toggle handler to remove vote when clicking same button in useCommentVoting hook
- [ ] T043 [US4] Add optimistic update logic for vote removal in useCommentVoting hook
- [ ] T044 [US4] Add error handling for failed vote removal in useCommentVoting hook

**Checkpoint**: Users can now fully control their votes - add, change, and remove as needed

---

## Phase 7: User Story 5 - Real-time Vote Updates (Priority: P2)

**Goal**: When votes change, all users viewing the same comment see the updated counts immediately without refresh, creating a dynamic experience

**Independent Test**: Open the same case in two browser windows, vote in one window, and verify the counts update in the second window without refresh. Delivers value by showing live community feedback.

### Tests for User Story 5 ⚠️

- [ ] T045 [P] [US5] Create E2E test for single user voting workflow in tests/e2e/comment-voting.spec.ts
- [ ] T046 [P] [US5] Add E2E test for multi-user real-time updates in tests/e2e/comment-voting.spec.ts
- [ ] T047 [P] [US5] Add E2E test for vote direction changes in tests/e2e/comment-voting.spec.ts
- [ ] T048 [P] [US5] Add E2E test for vote removal workflow in tests/e2e/comment-voting.spec.ts

### Implementation for User Story 5

- [ ] T049 [US5] Configure React Query polling for case.getById query in packages/client/src/components/CaseDetails/components/CaseComments/CaseComments.tsx
- [ ] T050 [US5] Add refetchInterval configuration (3 seconds) to case query
- [ ] T051 [US5] Add refetchIntervalInBackground: false to pause polling when tab inactive
- [ ] T052 [US5] Implement smart polling intervals based on activity in case query configuration
- [ ] T053 [US5] Add cache invalidation after vote mutations to trigger refetch in useCommentVoting hook
- [ ] T054 [P] [US5] Add E2E test for concurrent voting from multiple users in tests/e2e/comment-voting.spec.ts
- [ ] T055 [P] [US5] Add E2E test for optimistic update with rollback on error in tests/e2e/comment-voting.spec.ts

**Checkpoint**: All users viewing comments should now see updates within 2 seconds of any vote change

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and overall system quality

- [ ] T056 [P] Update quickstart.md with actual code examples for voting feature in specs/001-comment-voting/quickstart.md
- [ ] T057 [P] Add JSDoc comments to useCommentVoting hook in packages/client/src/components/CaseDetails/components/CaseComments/hooks/useCommentVoting.ts
- [ ] T058 [P] Add JSDoc comments to vote router procedures in packages/server/src/router.ts
- [ ] T059 [P] Add loading states for vote mutations in CaseComments component
- [ ] T060 [P] Add toast notifications for vote errors in useCommentVoting hook
- [ ] T061 [P] Add accessibility labels to vote buttons in CaseComments component
- [ ] T062 Performance test: Measure vote count queries with 100+ votes per comment
- [ ] T063 Performance test: Measure optimistic update render time (<200ms)
- [ ] T064 Performance test: Verify comment loading performance unchanged (<10% variance)
- [ ] T065 [P] Add debouncing to prevent rapid vote clicking in useCommentVoting hook
- [ ] T066 Code review: Verify all type safety (Prisma → Zod → tRPC → Client)
- [ ] T067 Code review: Verify unique constraint prevents duplicate votes
- [ ] T068 Code review: Verify cascade delete works for comment deletion
- [ ] T069 Security review: Verify authentication required for all vote operations
- [ ] T070 Security review: Verify users can only vote on accessible case comments
- [ ] T071 [P] Run quickstart.md validation with seed data
- [ ] T072 [P] Verify VoteButton component still matches Figma design
- [ ] T073 Update agent context with vote feature using .specify/scripts/bash/update-agent-context.sh copilot

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P2 → P3 → P3)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1) - Like Comments**: Can start after Foundational (Phase 2) - No dependencies on other stories ✅ MVP Ready
- **User Story 2 (P2) - Dislike Comments**: Can start after Foundational (Phase 2) - Builds on US1 but independently testable
- **User Story 3 (P3) - Change Vote Direction**: Depends on US1 and US2 being complete
- **User Story 4 (P3) - Remove Vote**: Can start after Foundational (Phase 2) - Independently testable
- **User Story 5 (P2) - Real-time Updates**: Can start after US1 complete - Works with any vote type

### Within Each User Story

1. Tests MUST be written and FAIL before implementation
2. Hook implementation before component integration
3. Optimistic updates after basic functionality
4. Error handling after optimistic updates
5. Story complete before moving to next priority

### Parallel Opportunities

**Setup Phase (can run together):**
- T007 (create vote-types.ts) + T008 (export from index.ts) - Different files

**Foundational Phase (can run together):**
- T009 + T010 + T011 (three router procedures) - Same file, sequential
- T012 (update case.getById) can run parallel with T009-T011 if different sections
- T013 (seed data) can run parallel with router work

**User Story 1 Tests (can run together):**
- T014 + T015 + T016 + T017 - All adding different test cases

**User Story 1 Implementation (can run together):**
- T018 (create hook) + T023 (VoteButton tests) + T024 (VoteButton stories) - Different files

**User Story 5 Tests (can run together):**
- T045 + T046 + T047 + T048 + T054 + T055 - All different E2E test scenarios

**Polish Phase (can run together):**
- T056 + T057 + T058 + T059 + T060 + T061 + T071 + T072 + T073 - All different files

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task T014: "Create vote router unit tests for vote mutation"
Task T015: "Add vote router unit test for getByCommentId query"
Task T016: "Add vote router unit test for idempotent voting"
Task T017: "Add vote router unit test for UNAUTHORIZED error handling"

# Launch independent implementation tasks together:
Task T018: "Create useCommentVoting custom hook"
Task T023: "Update VoteButton component tests"
Task T024: "Verify VoteButton stories"
```

---

## Parallel Example: User Story 5 (Real-time)

```bash
# Launch all E2E tests together:
Task T045: "E2E test for single user voting workflow"
Task T046: "E2E test for multi-user real-time updates"
Task T047: "E2E test for vote direction changes"
Task T048: "E2E test for vote removal workflow"
Task T054: "E2E test for concurrent voting"
Task T055: "E2E test for optimistic update rollback"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T008)
2. Complete Phase 2: Foundational (T009-T013) - CRITICAL
3. Complete Phase 3: User Story 1 (T014-T025)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready - Users can like comments! 🎯

**Result**: Working like functionality - users can express support for comments and see community agreement.

### Incremental Delivery

1. **Foundation** (Phases 1-2) → Database + API ready
2. **MVP** (Phase 3) → Like functionality → Deploy/Demo 🎯
3. **Iteration 2** (Phase 4) → Add dislikes → Deploy/Demo
4. **Iteration 3** (Phase 7) → Add real-time updates → Deploy/Demo
5. **Iteration 4** (Phase 5-6) → Add vote changes and removal → Deploy/Demo
6. **Polish** (Phase 8) → Performance, docs, accessibility → Deploy/Demo

Each iteration adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers:

**Week 1: Foundation (Everyone)**
- Team completes Setup + Foundational together (T001-T013)

**Week 2: User Stories (Parallel)**
Once Foundational is done:
- Developer A: User Story 1 (T014-T025) - Like functionality
- Developer B: User Story 2 (T026-T031) - Dislike functionality  
- Developer C: User Story 4 (T038-T044) - Remove vote functionality
- Developer D: E2E tests for User Story 5 (T045-T048)

**Week 3: Integration & Real-time**
- Developer A: User Story 5 implementation (T049-T055) - Real-time updates
- Developer B: User Story 3 (T032-T037) - Vote direction changes
- Developers C & D: Start Polish tasks (T056-T073)

**Week 4: Polish & Deploy**
- Everyone: Complete remaining Polish tasks
- Code review and testing
- Deploy complete feature

---

## Success Criteria Validation

After completing all tasks, verify:

- ✅ **SC-001**: Users see vote feedback within 200ms (T063 performance test)
- ✅ **SC-002**: Updates propagate within 2 seconds (T046 E2E test)
- ✅ **SC-003**: Zero vote loss during concurrent operations (T054 E2E test)
- ✅ **SC-004**: Users identify their votes within 1 second (T061 accessibility)
- ✅ **SC-005**: 95% intuitive voting (VoteButton component already validated)
- ✅ **SC-006**: Accurate vote counts (T067 code review)
- ✅ **SC-007**: 2-click vote changes (T034 component test)
- ✅ **SC-008**: No performance impact (<10% variance) (T064 performance test)

---

## Notes

- **[P] tasks** = different files or independent test cases, no dependencies
- **[Story] label** maps task to specific user story for traceability (US1-US5)
- Each user story should be independently completable and testable
- Tests written first (fail before implementation)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- VoteButton component already exists - no custom UI work needed
- Type safety guaranteed through Prisma → Zod → tRPC → Client
- All changes are additive - no breaking changes to existing APIs

---

## Total Task Count

- **Setup**: 8 tasks
- **Foundational**: 5 tasks (BLOCKS all stories)
- **User Story 1** (P1 - MVP): 12 tasks (5 tests + 7 implementation)
- **User Story 2** (P2): 6 tasks (2 tests + 4 implementation)
- **User Story 3** (P3): 6 tasks (3 tests + 3 implementation)
- **User Story 4** (P3): 7 tasks (3 tests + 4 implementation)
- **User Story 5** (P2): 11 tasks (6 tests + 5 implementation)
- **Polish**: 18 tasks

**Total**: 73 tasks

**Parallel Opportunities**: 38 tasks marked [P] can run in parallel with others

**Estimated Effort**: 24-38 hours (per plan.md timeline)

---

## MVP Scope Recommendation

**Suggested MVP**: Phases 1-3 only (T001-T025)

This delivers:
- ✅ Complete like functionality
- ✅ Vote counts displayed
- ✅ Optimistic UI updates
- ✅ Error handling
- ✅ Full test coverage for likes
- ✅ Independently deployable

**Time to MVP**: ~12-16 hours

**Value Delivered**: Users can express support for comments and see community agreement - a complete, valuable feature increment.

Later iterations add:
- Dislikes (Phase 4)
- Real-time updates (Phase 7)
- Vote changes and removal (Phases 5-6)
- Polish (Phase 8)
