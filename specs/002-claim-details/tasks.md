---
description: 'Task list for Claim Details Component implementation'
---

# Tasks: Claim Details Component

**Feature Branch**: `002-claim-details`  
**Created**: December 24, 2025

**Input**: Design documents from `/specs/002-claim-details/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: E2E tests are included as they are part of the feature specification

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

This is a monorepo with:

- **Shared types**: `packages/shared/src/`
- **Backend**: `packages/server/src/`, `packages/server/prisma/`
- **Frontend**: `packages/client/src/`
- **E2E tests**: `tests/e2e/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, database schema, and shared types

- [x] T001 Update Prisma schema with ClaimStatus enum in packages/server/prisma/schema.prisma
- [x] T002 Add caseNumber and customerName fields to Case model in packages/server/prisma/schema.prisma
- [x] T003 Create Comment model with relationships in packages/server/prisma/schema.prisma
- [x] T004 Generate Prisma client types with `npx prisma generate` in packages/server
- [x] T005 Delete existing database and run migration with `npx prisma migrate dev --name add-comments-and-claims` in packages/server
- [x] T006 Update seed data with 5 users and 5 cases in packages/server/prisma/seed.ts
- [x] T007 Run seed data with `npx prisma db seed` in packages/server
- [x] T008 [P] Create Zod schemas for getClaim, getClaimsList, addComment in packages/shared/src/schemas.ts
- [x] T009 [P] Export ClaimStatus enum from @prisma/client in packages/shared/src/types.ts
- [x] T010 [P] Create Claim interface in packages/shared/src/types.ts
- [x] T011 [P] Create Comment and CommentWithAuthor interfaces in packages/shared/src/types.ts
- [x] T012 [P] Create ClaimWithDetails interface in packages/shared/src/types.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core backend infrastructure and utilities that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T013 Implement getClaim tRPC procedure in packages/server/src/router.ts
- [x] T014 Implement getClaimsList tRPC procedure in packages/server/src/router.ts
- [x] T015 Implement addComment tRPC procedure in packages/server/src/router.ts
- [x] T016 [P] Write getClaim tests (success, not found, invalid ID) in packages/server/src/router.test.ts
- [x] T017 [P] Write getClaimsList tests in packages/server/src/router.test.ts
- [x] T018 [P] Write addComment tests in packages/server/src/router.test.ts
- [x] T019 [P] Create formatDate utility in packages/client/src/lib/utils/date.ts
- [x] T020 [P] Create formatTimestamp utility in packages/client/src/lib/utils/date.ts
- [x] T021 [P] Write date utility tests in packages/client/src/lib/utils/date.test.ts
- [x] T022 [P] Create getInitials utility in packages/client/src/lib/utils/avatar.ts
- [x] T023 [P] Create getAvatarColor utility in packages/client/src/lib/utils/avatar.ts
- [x] T024 [P] Write avatar utility tests in packages/client/src/lib/utils/avatar.test.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Claim Information (Priority: P1) 🎯 MVP

**Goal**: Display essential claim details including title, case number, status, customer name, dates, and description so case workers can quickly understand the claim's current state.

**Independent Test**: Render a claim detail view with mock data and verify all required fields (title, case number, status, customer name, date opened, assigned agent, last updated, description) are visible and correctly formatted.

### Implementation for User Story 1

- [x] T025 [P] [US1] Create StatusBadge component in packages/client/src/components/claim/StatusBadge.tsx
- [x] T026 [P] [US1] Create StatusBadge stories with all status variants in packages/client/src/components/claim/StatusBadge.stories.tsx
- [x] T027 [P] [US1] Create ClaimHeader component in packages/client/src/components/claim/ClaimHeader.tsx
- [x] T028 [P] [US1] Create ClaimHeader stories in packages/client/src/components/claim/ClaimHeader.stories.tsx
- [x] T029 [P] [US1] Create ClaimDescription component in packages/client/src/components/claim/ClaimDescription.tsx
- [x] T030 [P] [US1] Create ClaimDescription stories in packages/client/src/components/claim/ClaimDescription.stories.tsx
- [x] T031 [P] [US1] Create EssentialDetails component in packages/client/src/components/claim/EssentialDetails.tsx
- [x] T032 [P] [US1] Create EssentialDetails stories in packages/client/src/components/claim/EssentialDetails.stories.tsx
- [x] T033 [US1] Create ClaimDetailsPage integrating ClaimHeader, ClaimDescription, EssentialDetails in packages/client/src/pages/ClaimDetailsPage.tsx
- [x] T034 [US1] Add /claims/:id route in packages/client/src/App.tsx
- [x] T035 [US1] Create ClaimDetailsPage stories with MSW mocks in packages/client/src/pages/ClaimDetailsPage.stories.tsx
- [x] T036 [US1] Write E2E test for viewing claim details in tests/e2e/claim-details.spec.ts

**Checkpoint**: User Story 1 is fully functional - users can view complete claim information with all essential details

---

## Phase 4: User Story 2 - View Claim Comments History (Priority: P2)

**Goal**: Display the history of comments on a claim with author information and timestamps so case workers can understand the context and progress of the case.

**Independent Test**: Load a claim with existing comments and verify they display with correct author name, avatar initials, timestamp, and content in chronological order (most recent first).

### Implementation for User Story 2

- [x] T037 [P] [US2] Create CommentItem component with avatar and timestamp in packages/client/src/components/claim/CommentItem.tsx
- [x] T038 [P] [US2] Create CommentItem stories with different authors in packages/client/src/components/claim/CommentItem.stories.tsx
- [x] T039 [US2] Create CommentList component composing CommentItem in packages/client/src/components/claim/CommentList.tsx
- [x] T040 [US2] Create CommentList stories with empty and multiple comments states in packages/client/src/components/claim/CommentList.stories.tsx
- [x] T041 [US2] Integrate CommentList into ClaimDetailsPage in packages/client/src/pages/ClaimDetailsPage.tsx
- [x] T042 [US2] Update ClaimDetailsPage stories to include comments data in packages/client/src/pages/ClaimDetailsPage.stories.tsx
- [x] T043 [US2] Add E2E test for viewing comments history in tests/e2e/claim-details.spec.ts

**Checkpoint**: User Stories 1 AND 2 are both functional - users can view claim details and comments history independently

---

## Phase 5: User Story 3 - Add New Comment (Priority: P3)

**Goal**: Enable case workers to add comments to a claim so they can document actions and communicate with team members.

**Independent Test**: Enter text in the comment field, submit, and verify the new comment appears in the comment history with the current user's name and timestamp.

### Implementation for User Story 3

- [x] T044 [P] [US3] Create CommentInput component with textarea and submit button in packages/client/src/components/claim/CommentInput.tsx
- [x] T045 [P] [US3] Create CommentInput stories with empty and filled states in packages/client/src/components/claim/CommentInput.stories.tsx
- [x] T046 [US3] Integrate CommentInput into ClaimDetailsPage with addComment mutation in packages/client/src/pages/ClaimDetailsPage.tsx
- [x] T047 [US3] Handle optimistic updates and error states for addComment in packages/client/src/pages/ClaimDetailsPage.tsx
- [x] T048 [US3] Update ClaimDetailsPage stories to include comment submission flow in packages/client/src/pages/ClaimDetailsPage.stories.tsx
- [x] T049 [US3] Write E2E test for adding a comment in tests/e2e/claim-details.spec.ts

**Checkpoint**: User Stories 1, 2, AND 3 are all functional - users can view claims, read comments, and add new comments

---

## Phase 6: User Story 4 - Navigate Between Claims (Priority: P3)

**Goal**: Provide a sidebar list of claims so case workers can quickly switch between related claims without returning to the main listing.

**Independent Test**: Render a list of claims in the sidebar, click on a different claim, and verify the details panel updates to show the selected claim's information with the selected claim highlighted in the sidebar.

### Implementation for User Story 4

- [x] T050 [P] [US4] Create ClaimSidebar component displaying list of claims in packages/client/src/components/claim/ClaimSidebar.tsx
- [x] T051 [P] [US4] Create ClaimSidebar stories with empty and multiple claims states in packages/client/src/components/claim/ClaimSidebar.stories.tsx
- [x] T052 [US4] Integrate ClaimSidebar into ClaimDetailsPage with getClaimsList query in packages/client/src/pages/ClaimDetailsPage.tsx
- [x] T053 [US4] Implement navigation on claim selection with URL updates in packages/client/src/pages/ClaimDetailsPage.tsx
- [x] T054 [US4] Add visual highlighting for selected claim in ClaimSidebar in packages/client/src/components/claim/ClaimSidebar.tsx
- [x] T055 [US4] Update ClaimDetailsPage stories to include sidebar navigation flow in packages/client/src/pages/ClaimDetailsPage.stories.tsx
- [x] T056 [US4] Write E2E test for claim navigation in tests/e2e/claim-details.spec.ts

**Checkpoint**: All user stories are now independently functional - complete claim details feature with viewing, commenting, and navigation

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Loading states, error handling, responsive design, and final integration testing

- [x] T057 [P] Create LoadingSpinner component in packages/client/src/components/ui/LoadingSpinner.tsx
- [x] T058 [P] Create ErrorMessage component in packages/client/src/components/ui/ErrorMessage.tsx
- [x] T059 [P] Create NotFound component in packages/client/src/components/ui/NotFound.tsx
- [x] T060 Integrate loading states into ClaimDetailsPage in packages/client/src/pages/ClaimDetailsPage.tsx
- [x] T061 Integrate error states into ClaimDetailsPage in packages/client/src/pages/ClaimDetailsPage.tsx
- [x] T062 [P] Verify responsive design for all components in Storybook
- [x] T063 [P] Add accessibility attributes (ARIA labels) to all interactive components
- [x] T064 Run full test suite with `npm test` and verify all tests pass
- [x] T065 Run E2E tests with `npm run test:e2e` and verify all scenarios pass
- [x] T066 Build all packages with `npm run build` and verify no TypeScript errors
- [x] T067 Manual testing of complete user journey in development environment

---

## Dependencies & Execution Strategy

### Story Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundation) → Phase 3-6 (User Stories) → Phase 7 (Polish)
                                              ↓
                                    ┌─────────┼─────────┐
                                    ↓         ↓         ↓
                                  US1 ──→   US2 ──→   US3 ──→ US4
                                 (MVP)   (depends)  (depends) (independent)
```

**Key Dependencies**:

- **Phase 1 & 2 are blocking**: Must complete before any user story work
- **US1 → US2**: US2 (view comments) depends on US1 (page structure exists)
- **US2 → US3**: US3 (add comment) depends on US2 (comment display exists)
- **US4 is independent**: Can be implemented in parallel with US2/US3

### Parallel Execution Opportunities

**Phase 1 (Setup)** - Sequential due to database dependencies:

- T001-T007: Sequential (database schema and seeding)
- T008-T012: Parallel (shared types, all independent files)

**Phase 2 (Foundation)** - Mostly parallel:

- T013-T015: Sequential (tRPC procedures may share context)
- T016-T018: Parallel (test files are independent)
- T019-T024: Parallel (utilities are independent files)

**Phase 3 (US1)** - High parallelism:

- T025-T032: Parallel (8 component+story files, all independent)
- T033-T035: Sequential (page integration depends on components)
- T036: After page is complete

**Phase 4 (US2)** - Parallel then sequential:

- T037-T040: Parallel (component files independent)
- T041-T043: Sequential (integration depends on components)

**Phase 5 (US3)** - Parallel then sequential:

- T044-T045: Parallel (component files independent)
- T046-T049: Sequential (integration depends on component)

**Phase 6 (US4)** - Parallel then sequential:

- T050-T051: Parallel (component files independent)
- T052-T056: Sequential (integration depends on component)

**Phase 7 (Polish)** - Mix:

- T057-T059: Parallel (utility components independent)
- T060-T061: Sequential (depends on T057-T059)
- T062-T063: Parallel (different concerns)
- T064-T067: Sequential (validation pipeline)

### Example Parallel Batches

**Batch 1** (Phase 1 shared types):

```bash
# After database setup complete, run in parallel:
T008 + T009 + T010 + T011 + T012
```

**Batch 2** (Phase 2 tests + utilities):

```bash
# After tRPC procedures complete, run in parallel:
T016 + T017 + T018 + T019 + T020 + T021 + T022 + T023 + T024
```

**Batch 3** (Phase 3 components):

```bash
# Run all component pairs in parallel:
T025 + T026 + T027 + T028 + T029 + T030 + T031 + T032
```

**Batch 4** (Phase 7 polish):

```bash
# Run utility components in parallel:
T057 + T058 + T059 + T062 + T063
```

---

## Implementation Strategy

### MVP Scope (Recommended First Delivery)

**User Story 1 only** (Tasks T001-T036):

- Complete database setup and shared types
- Complete foundational backend and utilities
- Implement basic claim viewing with all essential details
- Delivers immediate value: users can view claim information

**Estimated effort**: ~2-3 days for experienced developer

### Incremental Delivery Plan

1. **Sprint 1**: MVP (US1) - View claim information
2. **Sprint 2**: US2 - Add comments history display
3. **Sprint 3**: US3 - Enable comment submission
4. **Sprint 4**: US4 + Polish - Navigation and final touches

### Task Completion Checklist

For each task, verify:

- [ ] Code follows TypeScript strict mode and type safety
- [ ] Storybook stories created for all components
- [ ] Unit tests pass for utilities
- [ ] Integration tests pass for tRPC procedures
- [ ] E2E tests pass for user journeys
- [ ] No console errors or warnings
- [ ] Linting passes with no errors
- [ ] Component matches Figma design

---

## Validation Criteria

### Phase 1 Complete When:

- [ ] Prisma schema includes ClaimStatus enum, Comment model, updated Case model
- [ ] Database seeded with 5 users, 5 cases, and comments
- [ ] Shared types exported and available to client and server packages
- [ ] `npm run build` succeeds in shared package

### Phase 2 Complete When:

- [ ] All three tRPC procedures (getClaim, getClaimsList, addComment) implemented
- [ ] Server tests pass: `npm test` in packages/server
- [ ] Date and avatar utilities implemented with tests passing
- [ ] Client utility tests pass: `npm test` in packages/client

### User Story 1 Complete When:

- [ ] Can navigate to `/claims/:id` and view claim details
- [ ] Header shows title, case number, and status badge
- [ ] Essential details panel shows all required fields
- [ ] Description displays correctly
- [ ] E2E test passes for viewing claim details
- [ ] All components visible in Storybook

### User Story 2 Complete When:

- [ ] Comments display in chronological order (most recent first)
- [ ] Each comment shows avatar initials, author name, and formatted timestamp
- [ ] Empty state displays appropriately when no comments exist
- [ ] E2E test passes for viewing comments

### User Story 3 Complete When:

- [ ] Can type in comment textarea
- [ ] Submitting comment adds it to the list
- [ ] Comment appears with current user's name and timestamp
- [ ] Textarea clears after successful submission
- [ ] E2E test passes for adding comment

### User Story 4 Complete When:

- [ ] Sidebar displays list of claims
- [ ] Clicking a claim updates the detail view
- [ ] Selected claim is highlighted in sidebar
- [ ] URL updates to reflect selected claim
- [ ] E2E test passes for navigation

### Phase 7 Complete When:

- [ ] Loading states display during data fetching
- [ ] Error states display appropriately on failures
- [ ] All components are responsive on mobile/tablet/desktop
- [ ] Accessibility attributes present on interactive elements
- [ ] Full test suite passes: `npm test`
- [ ] E2E tests pass: `npm run test:e2e`
- [ ] Production build succeeds: `npm run build`
- [ ] Manual testing checklist complete (see quickstart.md Phase 8)

---

**Total Tasks**: 67  
**Parallel Tasks**: 34 (marked with [P])  
**Sequential Tasks**: 33

**Task Breakdown by Phase**:

- Phase 1 (Setup): 12 tasks
- Phase 2 (Foundation): 12 tasks
- Phase 3 (US1): 12 tasks
- Phase 4 (US2): 7 tasks
- Phase 5 (US3): 6 tasks
- Phase 6 (US4): 7 tasks
- Phase 7 (Polish): 11 tasks

**Estimated Timeline**:

- MVP (US1): 2-3 days
- Full Feature (US1-US4 + Polish): 5-7 days

---

**Status**: ✅ READY FOR IMPLEMENTATION  
**Last Updated**: December 24, 2025
