---
description: 'Task list for Collapsible Navigation Menu feature implementation'
---

# Tasks: Collapsible Navigation Menu

**Input**: Design documents from `/specs/004-collapsible-menu/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: E2E tests and Storybook stories are included as they are explicitly mentioned in the feature specification and constitutional requirements.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- Client code: `packages/client/src/`
- Tests: `tests/e2e/`
- This is a monorepo structure (client/server/shared packages)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and branch setup

- [x] T001 Create feature branch `004-collapsible-menu` from main
- [x] T002 [P] Verify existing MenuList component structure in packages/client/src/components/MenuList/

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 Import required Lucide icons (ChevronLeft, ChevronRight) in packages/client/src/components/MenuList/MenuList.tsx
- [x] T004 Add React useState import in packages/client/src/components/MenuList/MenuList.tsx
- [x] T005 Add isCollapsed state with useState(true) default in packages/client/src/components/MenuList/MenuList.tsx
- [x] T006 Add toggleCollapse handler function in packages/client/src/components/MenuList/MenuList.tsx
- [x] T007 Add id="main-navigation" attribute to nav element in packages/client/src/components/MenuList/MenuList.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Collapse Expanded Menu (Priority: P1) 🎯 MVP

**Goal**: Desktop users can collapse the expanded navigation menu to gain screen space. When collapsed, menu shows only icons. Defaults to collapsed state on every page load.

**Independent Test**: Click collapse control on expanded menu, verify menu shows icons only and collapse button changes to expand button. Reload page and verify menu defaults to collapsed state.

### E2E Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T008 [US1] Create E2E test file tests/e2e/collapsible-menu.spec.ts with test suite setup
- [x] T009 [US1] Add test "should display collapsed menu by default on every page load" in tests/e2e/collapsible-menu.spec.ts
- [x] T010 [US1] Add test "should collapse menu when collapse button is clicked" in tests/e2e/collapsible-menu.spec.ts
- [x] T011 [US1] Add test "should hide text labels including 'Cases' when collapsed" in tests/e2e/collapsible-menu.spec.ts

### Implementation for User Story 1

- [x] T012 [US1] Update desktop navigation container div with transition classes (transition-all duration-300 ease-in-out) in packages/client/src/components/MenuList/MenuList.tsx
- [x] T013 [US1] Add conditional width classes (isCollapsed ? 'lg:w-[68px]' : 'lg:w-[240px]') to desktop nav container in packages/client/src/components/MenuList/MenuList.tsx
- [x] T014 [US1] Update menu item Link components to conditionally hide text labels with transition-opacity in packages/client/src/components/MenuList/MenuList.tsx
- [x] T015 [US1] Add aria-label to menu item Links for collapsed state accessibility in packages/client/src/components/MenuList/MenuList.tsx
- [x] T016 [US1] Create collapse/expand button element with conditional rendering (ChevronLeft + "Collapse" text when expanded) in packages/client/src/components/MenuList/MenuList.tsx
- [x] T017 [US1] Add ARIA attributes (aria-label, aria-expanded, aria-controls) to collapse/expand button in packages/client/src/components/MenuList/MenuList.tsx
- [x] T018 [US1] Add focus-visible ring styles for keyboard navigation to collapse/expand button in packages/client/src/components/MenuList/MenuList.tsx
- [x] T019 [US1] Verify "Cases" menu item text label is hidden when isCollapsed=true in packages/client/src/components/MenuList/MenuList.tsx

**Checkpoint**: At this point, User Story 1 should be fully functional - menu defaults to collapsed, can be collapsed from expanded state, and all text labels hide properly

---

## Phase 4: User Story 2 - Expand Collapsed Menu (Priority: P1)

**Goal**: Desktop users can expand the collapsed navigation menu to see full text labels alongside icons for clearer navigation.

**Independent Test**: Click expand control on collapsed menu, verify menu shows icons with text labels and expand button changes to collapse button.

### E2E Tests for User Story 2

- [x] T020 [US2] Add test "should expand menu when expand button is clicked" in tests/e2e/collapsible-menu.spec.ts
- [x] T021 [US2] Add test "should show text labels including 'Cases' when expanded" in tests/e2e/collapsible-menu.spec.ts
- [x] T022 [US2] Add test "should change expand button to collapse button after expansion" in tests/e2e/collapsible-menu.spec.ts
- [x] T023 [US2] Add test "should animate transition smoothly within 300ms" in tests/e2e/collapsible-menu.spec.ts

### Implementation for User Story 2

- [x] T024 [US2] Update collapse/expand button to show ChevronRight icon only when isCollapsed=true in packages/client/src/components/MenuList/MenuList.tsx
- [x] T025 [US2] Ensure menu item text labels display with opacity-100 when isCollapsed=false in packages/client/src/components/MenuList/MenuList.tsx
- [x] T026 [US2] Verify "Cases" menu item displays folder icon + "Cases" text when expanded in packages/client/src/components/MenuList/MenuList.tsx
- [x] T027 [US2] Test onClick handler triggers setIsCollapsed state toggle correctly in packages/client/src/components/MenuList/MenuList.tsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - full collapse/expand toggle functionality working

---

## Phase 5: User Story 3 - Mobile View Unchanged (Priority: P1)

**Goal**: Mobile users continue to experience the existing navigation behavior without any changes, ensuring zero regression on mobile.

**Independent Test**: View application on mobile viewport (<1024px), verify navigation shows existing horizontal bar behavior with no collapse/expand controls visible.

### E2E Tests for User Story 3

- [x] T028 [US3] Add test "should not display collapse/expand controls on mobile viewport" in tests/e2e/collapsible-menu.spec.ts
- [x] T029 [US3] Add test "should display mobile horizontal navigation bar on mobile viewport" in tests/e2e/collapsible-menu.spec.ts
- [x] T030 [US3] Add test "should maintain mobile behavior when resizing from desktop to mobile" in tests/e2e/collapsible-menu.spec.ts

### Implementation for User Story 3

- [x] T031 [US3] Verify collapse/expand button has "hidden lg:flex" classes to hide on mobile in packages/client/src/components/MenuList/MenuList.tsx
- [x] T032 [US3] Verify mobile navigation section remains unchanged with existing classes in packages/client/src/components/MenuList/MenuList.tsx
- [x] T033 [US3] Test viewport resize behavior from desktop (≥1024px) to mobile (<1024px) maintains correct display in packages/client/src/components/MenuList/MenuList.tsx

**Checkpoint**: All user stories should now be independently functional - full feature complete across desktop and mobile

---

## Phase 6: Storybook Stories (Component Development & Documentation)

**Purpose**: Provide isolated component development environment and visual documentation

- [x] T034 [P] Create MenuList.stories.tsx in packages/client/src/components/MenuList/ with Storybook meta configuration
- [x] T035 [P] Add "Default (Collapsed)" story showing menu in initial collapsed state in packages/client/src/components/MenuList/MenuList.stories.tsx
- [x] T036 [P] Add "Expanded" story showing menu with isCollapsed=false in packages/client/src/components/MenuList/MenuList.stories.tsx
- [x] T037 [P] Add "Mobile View" story with mobile viewport parameters in packages/client/src/components/MenuList/MenuList.stories.tsx
- [x] T038 [P] Add BrowserRouter decorator to all stories for Link component support in packages/client/src/components/MenuList/MenuList.stories.tsx
- [x] T039 [P] Configure menu items array with all 8 items (Dashboard, Cases, Tasks, Calendar, Clients, Documents, Reports, Settings) in packages/client/src/components/MenuList/MenuList.stories.tsx

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T040 [P] Verify keyboard navigation (Tab, Enter, Space) works for collapse/expand button in packages/client/src/components/MenuList/MenuList.tsx
- [x] T041 [P] Verify focus-visible ring styles meet WCAG 2.1 AA contrast requirements in packages/client/src/components/MenuList/MenuList.tsx
- [x] T042 Test color contrast for collapse/expand button against background (#bcecef focus ring on #fbfcfc background)
- [x] T043 Run E2E test suite with `npm run test:e2e` and verify all tests pass
- [x] T044 [P] Run Storybook with `npm run storybook` and verify all stories render correctly
- [x] T045 Verify quickstart.md implementation steps match actual implementation in packages/client/src/components/MenuList/MenuList.tsx
- [x] T046 Test edge case: rapid clicking of collapse/expand button doesn't cause visual glitches
- [x] T047 Test edge case: menu state resets to collapsed after navigation to different page
- [x] T048 Manual testing on physical desktop (1280px+) and mobile devices (<1024px)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User stories can proceed sequentially (recommended for this small feature)
  - Or in parallel if multiple developers available
- **Storybook (Phase 6)**: Can proceed after any user story is partially complete, recommended after US1/US2 completion
- **Polish (Phase 7)**: Depends on all user stories (US1, US2, US3) being complete

### User Story Dependencies

- **User Story 1 (P1) - Collapse**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1) - Expand**: Builds on US1 (shares same button component) but can be tested independently
- **User Story 3 (P1) - Mobile**: Can verify in parallel with US1/US2 - verification that existing code remains unchanged

### Within Each User Story

- E2E tests MUST be written and FAIL before implementation
- Core implementation (state + styles) before button implementation
- Button implementation before ARIA attributes
- All implementation before verification tests

### Parallel Opportunities

**Phase 2 (Foundational)**:

- T003 (import icons) and T004 (import useState) can run in parallel
- T005, T006, T007 must run sequentially (state setup before handler, then nav id)

**Phase 3 (User Story 1)**:

- Tests T008-T011 can run in parallel (different test scenarios)
- Implementation: T012-T013 (container styles) can run together
- T014-T015 (menu item updates) depend on container changes
- T016-T018 (button creation) can run after state is ready

**Phase 4 (User Story 2)**:

- Tests T020-T023 can run in parallel
- Implementation builds on US1, minimal new code

**Phase 5 (User Story 3)**:

- Tests T028-T030 can run in parallel
- Verification tasks T031-T033 can run in parallel

**Phase 6 (Storybook)**:

- All tasks T034-T039 can run in parallel (different stories in same file)

**Phase 7 (Polish)**:

- T040-T041 (accessibility) can run in parallel
- T043-T045 (testing/verification) should run after implementation complete
- T046-T048 (edge cases) can run in parallel

---

## Parallel Example: User Story 1 (Collapse)

```bash
# Terminal 1: Write E2E tests
$ code tests/e2e/collapsible-menu.spec.ts
# Add tests T008-T011 simultaneously

# Terminal 2: Watch tests fail
$ npm run test:e2e -- collapsible-menu

# Terminal 3: Implement core functionality
$ code packages/client/src/components/MenuList/MenuList.tsx
# Implement T012-T019 in sequence

# Terminal 4: Run dev server to manually verify
$ npm run dev
```

---

## Implementation Strategy

### MVP Scope (Minimum Viable Product)

**Deliver User Story 1 + User Story 2 first** (collapse/expand functionality):

- Phase 1: Setup (T001-T002)
- Phase 2: Foundational (T003-T007)
- Phase 3: User Story 1 (T008-T019) - Collapse functionality
- Phase 4: User Story 2 (T020-T027) - Expand functionality

**This MVP delivers**:

- Functional collapse/expand toggle on desktop
- Default collapsed state
- Text labels hide/show properly
- Smooth 300ms transitions
- Full accessibility support

**Then add**:

- Phase 5: User Story 3 (T028-T033) - Mobile regression testing
- Phase 6: Storybook (T034-T039) - Documentation
- Phase 7: Polish (T040-T048) - Edge cases and refinement

### Incremental Delivery

1. **Week 1**: Foundational + US1 (Collapse) - Users can collapse menu
2. **Week 1**: US2 (Expand) - Full toggle functionality working
3. **Week 1**: US3 (Mobile) - Verify no mobile regression
4. **Week 2**: Storybook + Polish - Documentation and edge cases

---

## Validation & Success Metrics

### Task Completeness Checklist

Each user story phase includes:

- ✅ Clear story goal and value proposition
- ✅ Independent test criteria
- ✅ E2E tests written first (fail before implementation)
- ✅ Implementation tasks with exact file paths
- ✅ Verification that story works independently
- ✅ Checkpoint confirming story completion

### Format Validation

All 48 tasks follow the required format:

- ✅ Checkbox prefix: `- [ ]`
- ✅ Task ID: Sequential (T001-T048)
- ✅ [P] marker: Added to parallelizable tasks
- ✅ [Story] label: US1, US2, US3 for user story tasks
- ✅ File paths: Exact paths included in descriptions
- ✅ No story labels for Setup/Foundational/Polish phases

### Total Task Count: 48 Tasks

- Phase 1 (Setup): 2 tasks
- Phase 2 (Foundational): 5 tasks
- Phase 3 (US1 - Collapse): 12 tasks (4 tests + 8 implementation)
- Phase 4 (US2 - Expand): 8 tasks (4 tests + 4 implementation)
- Phase 5 (US3 - Mobile): 6 tasks (3 tests + 3 verification)
- Phase 6 (Storybook): 6 tasks
- Phase 7 (Polish): 9 tasks

### Parallel Opportunities Identified

- 15 tasks marked with [P] for parallel execution
- Each user story designed for independent testing
- Storybook stories can be written in parallel
- E2E tests within each story can run in parallel

### Test Coverage

- 11 E2E test scenarios across all user stories
- 6 Storybook stories for visual documentation
- Edge case testing in Polish phase
- Manual testing on physical devices

### Success Criteria Mapping

- ✅ SC-001: Toggle in <1 second (T046 edge case testing)
- ✅ SC-002: Defaults to collapsed 100% (T009 E2E test)
- ✅ SC-003: 300ms animation (T012 implementation, T023 test)
- ✅ SC-004: Zero mobile regression (T028-T033 verification)
- ✅ SC-005: 90% usability (T040-T041 accessibility)
- ✅ SC-006: 100-150px space gain (T013 width implementation)

---

## Notes

- This feature is **desktop-only** (lg: 1024px+ breakpoint)
- State is **transient** - always defaults to collapsed on page load
- No localStorage or backend persistence required
- Mobile navigation remains completely unchanged
- All existing MenuList props remain backward compatible
- Animation duration: 300ms (meets SC-003 requirement)
- Focus on accessibility: WCAG 2.1 AA compliance required
