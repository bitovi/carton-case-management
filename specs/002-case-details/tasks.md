# Tasks: Case Details View

**Branch**: `002-case-details`  
**Input**: Design documents from `/specs/002-case-details/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are included per project constitution (Test-Informed Development is mandatory)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Database schema and seed data setup

- [x] T001 Update Prisma schema with Comment model and Case/User relations in packages/server/prisma/schema.prisma
- [x] T002 Run Prisma migration for Comment model: `npx prisma migrate dev --name add-comments-and-case-fields`
- [x] T003 Update seed data with 2 users, 5 cases, 15-20 comments in packages/server/prisma/seed.ts
- [x] T004 Run seed script to populate database: `npm run db:seed --workspace=packages/server`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, validation schemas, and API infrastructure that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 [P] Add Comment, CommentWithAuthor, CaseWithComments interfaces to packages/shared/src/types.ts
- [x] T006 [P] Add CaseType enum to packages/shared/src/types.ts
- [x] T007 [P] Update Case interface with caseType and customerName in packages/shared/src/types.ts
- [x] T008 [P] Add createCommentSchema, getCaseByIdSchema, listCasesSchema Zod validation in packages/shared/src/types.ts
- [x] T009 [P] Add CreateCommentInput, GetCaseByIdInput, ListCasesInput type exports in packages/shared/src/types.ts
- [x] T010 Add cases router to tRPC appRouter in packages/server/src/router.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - View Case Details (Priority: P1) 🎯 MVP

**Goal**: Display complete case information including header, description, comments, and essential metadata

**Independent Test**: Navigate to a case and verify all case details display correctly (header, description, comments list, essential details panel)

### API Implementation for User Story 1

- [x] T011 [P] [US1] Implement cases.list query procedure in packages/server/src/router.ts
- [x] T012 [P] [US1] Implement cases.getById query procedure in packages/server/src/router.ts

### API Tests for User Story 1

- [x] T013 [P] [US1] Write integration test for cases.list in packages/server/src/router.test.ts
- [x] T014 [P] [US1] Write integration test for cases.getById in packages/server/src/router.test.ts
- [x] T015 [US1] Run integration tests and verify they pass

### UI Components for User Story 1

- [x] T016 [P] [US1] Create CaseHeader component in packages/client/src/components/case-details/CaseHeader.tsx
- [x] T017 [P] [US1] Create CaseHeader Storybook story in packages/client/src/components/case-details/CaseHeader.stories.tsx
- [x] T018 [P] [US1] Create CaseDescription component in packages/client/src/components/case-details/CaseDescription.tsx
- [x] T019 [P] [US1] Create CaseDescription Storybook story in packages/client/src/components/case-details/CaseDescription.stories.tsx
- [x] T020 [P] [US1] Create CommentItem component in packages/client/src/components/case-details/CommentItem.tsx
- [x] T021 [P] [US1] Create CommentItem Storybook story in packages/client/src/components/case-details/CommentItem.stories.tsx
- [x] T022 [P] [US1] Create EssentialDetailsPanel component in packages/client/src/components/case-details/EssentialDetailsPanel.tsx
- [x] T023 [P] [US1] Create EssentialDetailsPanel Storybook story in packages/client/src/components/case-details/EssentialDetailsPanel.stories.tsx
- [x] T024 [US1] Create CommentsList component in packages/client/src/components/case-details/CommentsList.tsx
- [x] T025 [US1] Create CommentsList Storybook story in packages/client/src/components/case-details/CommentsList.stories.tsx
- [x] T026 [US1] Create CaseDetailsView component in packages/client/src/components/case-details/CaseDetailsView.tsx
- [x] T027 [US1] Create CaseDetailsView Storybook story in packages/client/src/components/case-details/CaseDetailsView.stories.tsx

### Page Implementation for User Story 1

- [x] T028 [US1] Create CaseDetailsPage with tRPC queries in packages/client/src/pages/CaseDetailsPage.tsx
- [x] T029 [US1] Create CaseDetailsPage Storybook story in packages/client/src/pages/CaseDetailsPage.stories.tsx
- [x] T030 [US1] Update App.tsx to render CaseDetailsPage on base route in packages/client/src/App.tsx

### E2E Test for User Story 1

- [x] T031 [US1] Write E2E test for viewing case details in tests/e2e/case-details.spec.ts
- [x] T032 [US1] Run E2E test and verify it passes

**Checkpoint**: At this point, User Story 1 should be fully functional - users can view complete case details

---

## Phase 4: User Story 2 - Navigate Between Cases (Priority: P2)

**Goal**: Allow users to quickly switch between cases using a sidebar case list

**Independent Test**: Click different cases in sidebar and verify main content area updates to show selected case details

### UI Components for User Story 2

- [ ] T033 [P] [US2] Create CaseSidebar component with case list in packages/client/src/components/case-details/CaseSidebar.tsx
- [ ] T034 [P] [US2] Create CaseSidebar Storybook story in packages/client/src/components/case-details/CaseSidebar.stories.tsx

### Integration for User Story 2

- [ ] T035 [US2] Update CaseDetailsPage to include CaseSidebar and handle case selection in packages/client/src/pages/CaseDetailsPage.tsx
- [ ] T036 [US2] Add URL query param handling for selected case (?caseId=) in packages/client/src/pages/CaseDetailsPage.tsx
- [ ] T037 [US2] Update CaseDetailsPage story to show sidebar navigation in packages/client/src/pages/CaseDetailsPage.stories.tsx

### E2E Test for User Story 2

- [ ] T038 [US2] Add sidebar navigation test to E2E spec in tests/e2e/case-details.spec.ts
- [ ] T039 [US2] Run E2E test and verify sidebar navigation works

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - users can view cases and navigate between them

---

## Phase 5: User Story 3 - Add Case Comments (Priority: P3)

**Goal**: Enable users to add new comments to cases for documentation and collaboration

**Independent Test**: Type a comment in the input field and verify it appears in the comments list after submission

### API Implementation for User Story 3

- [ ] T040 [US3] Implement cases.addComment mutation procedure in packages/server/src/router.ts

### API Tests for User Story 3

- [ ] T041 [P] [US3] Write integration test for cases.addComment in packages/server/src/router.test.ts
- [ ] T042 [P] [US3] Write integration test for comment validation errors in packages/server/src/router.test.ts
- [ ] T043 [P] [US3] Write integration test for cache invalidation in packages/server/src/router.test.ts
- [ ] T044 [US3] Run integration tests and verify they pass

### UI Components for User Story 3

- [ ] T045 [P] [US3] Create AddCommentForm component with mutation hook in packages/client/src/components/case-details/AddCommentForm.tsx
- [ ] T046 [P] [US3] Create AddCommentForm Storybook story in packages/client/src/components/case-details/AddCommentForm.stories.tsx

### Integration for User Story 3

- [ ] T047 [US3] Add AddCommentForm to CaseDetailsView in packages/client/src/components/case-details/CaseDetailsView.tsx
- [ ] T048 [US3] Update CaseDetailsView story to include comment form in packages/client/src/components/case-details/CaseDetailsView.stories.tsx

### E2E Test for User Story 3

- [ ] T049 [US3] Add comment submission test to E2E spec in tests/e2e/case-details.spec.ts
- [ ] T050 [US3] Run E2E test and verify comment submission works

**Checkpoint**: All user stories should now be independently functional - complete case details feature is ready

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T051 [P] Verify all TypeScript compiles with no errors: `npm run build`
- [ ] T052 [P] Run ESLint and fix any issues: `npm run lint`
- [ ] T053 [P] Format all code with Prettier: `npm run format`
- [ ] T054 [P] Run all unit tests: `npm run test:server && npm run test:client`
- [ ] T055 [P] Run all E2E tests: `npm run test:e2e`
- [ ] T056 [P] Verify all Storybook stories render: `npm run storybook`
- [ ] T057 Add accessibility labels and ARIA attributes to interactive elements
- [ ] T058 Test keyboard navigation for sidebar and form
- [ ] T059 Verify color contrast meets WCAG 2.1 AA standards
- [ ] T060 Manual testing: Verify quickstart.md validation checklist

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (Phase 1) completion - BLOCKS all user stories
- **User Stories (Phases 3-5)**: All depend on Foundational (Phase 2) completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1 - View Case Details)**: Can start after Foundational - No dependencies on other stories
  - Delivers: Complete case viewing functionality (MVP)
- **User Story 2 (P2 - Navigate Between Cases)**: Can start after Foundational - Integrates with US1 but independently testable
  - Delivers: Sidebar navigation between cases
- **User Story 3 (P3 - Add Comments)**: Can start after Foundational - Integrates with US1 but independently testable
  - Delivers: Comment creation functionality

### Within Each User Story

1. API implementation before API tests
2. API tests pass before UI components
3. Atomic components (CaseHeader, CommentItem) before composite components (CommentsList, CaseDetailsView)
4. Components before page integration
5. Page integration before E2E tests
6. All Storybook stories created alongside components
7. E2E tests verify complete user journey

### Parallel Opportunities

**Phase 1 (Setup)**: Sequential - migration must complete before seed

**Phase 2 (Foundational)**: 
- T005-T009 (all type definitions) can run in parallel
- T010 (router setup) depends on T005-T009

**Phase 3 (US1)**:
- T011-T012 (API procedures) can run in parallel
- T013-T014 (API tests) can run in parallel after T011-T012
- T016-T023 (atomic components with stories) can run in parallel
- T024-T027 (composite components) sequential after atomics
- T028-T030 (page integration) sequential after components

**Phase 4 (US2)**:
- T033-T034 (sidebar component) can run in parallel

**Phase 5 (US3)**:
- T041-T043 (API tests) can run in parallel after T040
- T045-T046 (form component) can run in parallel

**Phase 6 (Polish)**:
- T051-T056 (all validation tasks) can run in parallel

---

## Parallel Example: User Story 1 - Components

```bash
# Terminal 1: CaseHeader
cd packages/client/src/components/case-details
# Create CaseHeader.tsx and CaseHeader.stories.tsx

# Terminal 2: CaseDescription  
cd packages/client/src/components/case-details
# Create CaseDescription.tsx and CaseDescription.stories.tsx

# Terminal 3: CommentItem
cd packages/client/src/components/case-details
# Create CommentItem.tsx and CommentItem.stories.tsx

# Terminal 4: EssentialDetailsPanel
cd packages/client/src/components/case-details
# Create EssentialDetailsPanel.tsx and EssentialDetailsPanel.stories.tsx

# All 4 components can be developed in parallel
# Then proceed to CommentsList → CaseDetailsView → CaseDetailsPage
```

---

## Implementation Strategy

### MVP Definition (Minimum Viable Product)

**MVP = User Story 1 (P1) Only**

At the end of Phase 3, you have a complete, deployable feature:
- Users can view case list
- Users can view case details (header, description, comments, metadata)
- All data loads from database via tRPC
- Fully tested (integration + E2E)

This delivers immediate value without navigation or comment creation.

### Incremental Delivery

- **Phase 3 Complete (US1)**: Deploy MVP - users can view cases
- **Phase 4 Complete (US1+US2)**: Deploy enhancement - users can navigate between cases
- **Phase 5 Complete (US1+US2+US3)**: Deploy full feature - users can add comments

Each phase delivers independently testable, deployable value.

---

## Task Summary

**Total Tasks**: 60  
**By User Story**:
- Setup: 4 tasks
- Foundational: 6 tasks (blocks all stories)
- User Story 1 (P1 - View): 22 tasks (MVP)
- User Story 2 (P2 - Navigate): 7 tasks
- User Story 3 (P3 - Comment): 11 tasks
- Polish: 10 tasks

**Parallel Opportunities**: 24 tasks marked [P] can run in parallel with others in same phase

**Critical Path**: Setup → Foundational → US1 API → US1 Components → US1 Page → US1 E2E (minimum for MVP)

**Suggested MVP Scope**: Complete Phases 1-3 only (32 tasks) for fastest time to value
