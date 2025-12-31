---
description: 'Task list for Responsive Header and Menu Components implementation'
---

# Tasks: Responsive Header and Menu Components

**Feature**: 002-header-menu-components  
**Input**: Design documents from `/specs/002-header-menu-components/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **Checkbox**: `- [ ]` for uncompleted tasks
- **[ID]**: Task identifier (T001, T002, T003...)
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- **Description**: Clear action with exact file paths

## Path Conventions

This is a **web application monorepo**:

- Header component: `packages/client/src/components/Header/`
- MenuList component: `packages/client/src/components/MenuList/`
- Client assets: `packages/client/src/assets/`
- Client styles: `packages/client/src/index.css`
- E2E tests: `tests/e2e/`
- Package root: `packages/client/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and component directory structure

- [ ] T001 Create Header and MenuList component directories at packages/client/src/components/Header and packages/client/src/components/MenuList
- [ ] T002 Create assets directory at packages/client/src/assets
- [ ] T003 [P] Add CSS color variables to packages/client/src/index.css for header and menu
- [ ] T004 [P] Install Shadcn UI dropdown-menu component via npx shadcn@latest add dropdown-menu
- [ ] T005 [P] Install lucide-react icons package via npm install lucide-react (if not already installed)

**Checkpoint**: Directory structure and dependencies ready

---

## Phase 2: Foundational (Component Infrastructure)

**Purpose**: Shared component files and barrel exports that all user stories depend on

**⚠️ CRITICAL**: These files must exist before ANY user story implementation can begin

- [ ] T006 Create Header component skeleton at packages/client/src/components/Header/Header.tsx
- [ ] T007 [P] Create Header Storybook story at packages/client/src/components/Header/Header.stories.tsx
- [ ] T008 [P] Create Header test file at packages/client/src/components/Header/Header.test.tsx
- [ ] T009 [P] Create MenuList component skeleton at packages/client/src/components/MenuList/MenuList.tsx
- [ ] T010 [P] Create MenuList Storybook story at packages/client/src/components/MenuList/MenuList.stories.tsx
- [ ] T011 [P] Create MenuList test file at packages/client/src/components/MenuList/MenuList.test.tsx
- [ ] T012 [P] Create barrel exports at packages/client/src/components/Header/index.ts and packages/client/src/components/MenuList/index.ts

**Checkpoint**: All component files created - ready for user story implementation

---

## Phase 3: User Story 1 - Basic Navigation via Header (Priority: P1) 🎯 MVP

**Goal**: Persistent header on all pages with logo navigation to home page and responsive text display

**Independent Test**: View any page, see header with logo and text. Click logo, navigate to home page. Resize viewport, see "Carton" on mobile and "Carton Case Management" on desktop.

### Storybook Stories for User Story 1 (Component-First Development)

- [ ] T013 [P] [US1] Implement Desktop Header story in packages/client/src/components/Header/Header.stories.tsx showing full "Carton Case Management" text
- [ ] T014 [P] [US1] Implement Mobile Header story in packages/client/src/components/Header/Header.stories.tsx showing abbreviated "Carton" text

### Implementation for User Story 1

- [ ] T015 [US1] Create Carton logo inline SVG (34x34px, teal background, white package graphic) in packages/client/src/components/Header/Header.tsx
- [ ] T016 [US1] Implement HeaderProps TypeScript interface in packages/client/src/components/Header/Header.tsx
- [ ] T017 [US1] Implement Header component structure with dark teal background and full-width layout in packages/client/src/components/Header/Header.tsx
- [ ] T018 [US1] Implement logo section with React Router Link to "/" in packages/client/src/components/Header/Header.tsx
- [ ] T019 [US1] Implement responsive application name text (hidden md:inline pattern for "Case Management") in packages/client/src/components/Header/Header.tsx
- [ ] T020 [US1] Add keyboard navigation support (Tab to logo, Enter to navigate) in packages/client/src/components/Header/Header.tsx
- [ ] T021 [US1] Add ARIA labels (aria-label="Navigate to home" on logo link) in packages/client/src/components/Header/Header.tsx
- [ ] T022 [US1] Integrate Header component into packages/client/src/App.tsx to appear on all pages

### Unit Tests for User Story 1

- [ ] T023 [P] [US1] Write test for Header renders logo and application name in packages/client/src/components/Header/Header.test.tsx
- [ ] T024 [P] [US1] Write test for Header renders responsive text (full vs abbreviated) in packages/client/src/components/Header/Header.test.tsx
- [ ] T025 [P] [US1] Write test for logo Link has correct path and ARIA label in packages/client/src/components/Header/Header.test.tsx

### E2E Tests for User Story 1

- [ ] T026 [US1] Create E2E test file at tests/e2e/navigation.spec.ts
- [ ] T027 [US1] Write E2E test for clicking logo navigates to home page in tests/e2e/navigation.spec.ts
- [ ] T028 [US1] Write E2E test for header appears on all pages in tests/e2e/navigation.spec.ts

**Checkpoint**: User Story 1 complete - header with logo navigation fully functional and tested

---

## Phase 4: User Story 2 - User Account Access (Priority: P2)

**Goal**: User avatar in header with dropdown menu that opens/closes on click

**Independent Test**: Click user avatar on top-right of header, see dropdown menu open. Click avatar again or outside dropdown, see dropdown close. Verify keyboard interaction (Tab to avatar, Enter to open/close, Escape to close).

### Storybook Stories for User Story 2

- [ ] T029 [P] [US2] Implement Dropdown Closed story in packages/client/src/components/Header/Header.stories.tsx
- [ ] T030 [P] [US2] Implement Dropdown Open story in packages/client/src/components/Header/Header.stories.tsx
- [ ] T031 [P] [US2] Implement Custom Initials story in packages/client/src/components/Header/Header.stories.tsx

### Implementation for User Story 2

- [ ] T032 [US2] Add userInitials prop to HeaderProps interface (default: "AM") in packages/client/src/components/Header/Header.tsx
- [ ] T033 [US2] Add onAvatarClick optional callback prop to HeaderProps in packages/client/src/components/Header/Header.tsx
- [ ] T034 [US2] Implement user avatar circle with initials display in packages/client/src/components/Header/Header.tsx
- [ ] T035 [US2] Integrate Shadcn UI DropdownMenu component (Trigger, Content) in packages/client/src/components/Header/Header.tsx
- [ ] T036 [US2] Implement dropdown open/close state with useState in packages/client/src/components/Header/Header.tsx
- [ ] T037 [US2] Implement empty dropdown content (placeholder for future items) in packages/client/src/components/Header/Header.tsx
- [ ] T038 [US2] Add ARIA attributes (aria-label="User menu", aria-expanded, aria-haspopup) in packages/client/src/components/Header/Header.tsx
- [ ] T039 [US2] Implement keyboard support (Enter to toggle, Escape to close) in packages/client/src/components/Header/Header.tsx
- [ ] T040 [US2] Add click-outside-to-close functionality via Shadcn UI dropdown behavior in packages/client/src/components/Header/Header.tsx

### Unit Tests for User Story 2

- [ ] T041 [P] [US2] Write test for avatar renders user initials in packages/client/src/components/Header/Header.test.tsx
- [ ] T042 [P] [US2] Write test for dropdown toggles on avatar click in packages/client/src/components/Header/Header.test.tsx
- [ ] T043 [P] [US2] Write test for dropdown has correct ARIA attributes in packages/client/src/components/Header/Header.test.tsx
- [ ] T044 [P] [US2] Write test for onAvatarClick callback fires when provided in packages/client/src/components/Header/Header.test.tsx

### E2E Tests for User Story 2

- [ ] T045 [US2] Write E2E test for avatar dropdown opens on click in tests/e2e/navigation.spec.ts
- [ ] T046 [US2] Write E2E test for dropdown closes on outside click in tests/e2e/navigation.spec.ts
- [ ] T047 [US2] Write E2E test for dropdown closes on Escape key in tests/e2e/navigation.spec.ts

**Checkpoint**: User Story 2 complete - avatar dropdown fully functional and tested independently

---

## Phase 5: User Story 3 - Menu Navigation (Priority: P2)

**Goal**: Responsive menu list with home page navigation item (vertical sidebar on desktop, horizontal on mobile)

**Independent Test**: View menu list on desktop, see vertical sidebar with home item. Click home item, navigate to home page. Resize to mobile, see horizontal full-width menu item. Verify keyboard navigation (Tab to menu item, Enter to navigate).

### Storybook Stories for User Story 3

- [ ] T048 [P] [US3] Implement Desktop MenuList story in packages/client/src/components/MenuList/MenuList.stories.tsx showing vertical sidebar
- [ ] T049 [P] [US3] Implement Mobile MenuList story in packages/client/src/components/MenuList/MenuList.stories.tsx showing horizontal layout
- [ ] T050 [P] [US3] Implement Single Item story in packages/client/src/components/MenuList/MenuList.stories.tsx
- [ ] T051 [P] [US3] Implement Active Item story in packages/client/src/components/MenuList/MenuList.stories.tsx

### Implementation for User Story 3

- [ ] T052 [P] [US3] Implement MenuItem TypeScript interface in packages/client/src/components/MenuList/MenuList.tsx
- [ ] T053 [P] [US3] Implement MenuListProps TypeScript interface in packages/client/src/components/MenuList/MenuList.tsx
- [ ] T054 [US3] Implement MenuList component with semantic nav element in packages/client/src/components/MenuList/MenuList.tsx
- [ ] T055 [US3] Implement responsive layout (vertical sidebar md:flex-col, horizontal flex-row) in packages/client/src/components/MenuList/MenuList.tsx
- [ ] T056 [US3] Implement menu item rendering with icon and label in packages/client/src/components/MenuList/MenuList.tsx
- [ ] T057 [US3] Integrate React Router Link for menu item navigation in packages/client/src/components/MenuList/MenuList.tsx
- [ ] T058 [US3] Implement light blue/teal background colors for menu items in packages/client/src/components/MenuList/MenuList.tsx
- [ ] T059 [US3] Add hover states for desktop (darker background on hover) in packages/client/src/components/MenuList/MenuList.tsx
- [ ] T060 [US3] Implement active item indicator (aria-current="page") in packages/client/src/components/MenuList/MenuList.tsx
- [ ] T061 [US3] Add ARIA attributes (aria-label="Main menu" on nav) in packages/client/src/components/MenuList/MenuList.tsx
- [ ] T062 [US3] Add keyboard navigation support (Tab through items, Enter to navigate) in packages/client/src/components/MenuList/MenuList.tsx
- [ ] T063 [US3] Create hardcoded menu items array with Home navigation in packages/client/src/App.tsx or layout wrapper
- [ ] T064 [US3] Integrate MenuList component into application layout in packages/client/src/App.tsx

### Unit Tests for User Story 3

- [ ] T065 [P] [US3] Write test for MenuList renders all menu items in packages/client/src/components/MenuList/MenuList.test.tsx
- [ ] T066 [P] [US3] Write test for MenuList renders icons for each item in packages/client/src/components/MenuList/MenuList.test.tsx
- [ ] T067 [P] [US3] Write test for MenuList calls onItemClick callback in packages/client/src/components/MenuList/MenuList.test.tsx
- [ ] T068 [P] [US3] Write test for MenuList marks active item with aria-current in packages/client/src/components/MenuList/MenuList.test.tsx
- [ ] T069 [P] [US3] Write test for MenuList validates MenuItem properties in packages/client/src/components/MenuList/MenuList.test.tsx

### E2E Tests for User Story 3

- [ ] T070 [US3] Write E2E test for clicking menu item navigates to home page in tests/e2e/navigation.spec.ts
- [ ] T071 [US3] Write E2E test for menu adapts to mobile viewport in tests/e2e/navigation.spec.ts
- [ ] T072 [US3] Write E2E test for keyboard navigation through menu items in tests/e2e/navigation.spec.ts

**Checkpoint**: User Story 3 complete - menu navigation fully functional and tested independently

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final integration, visual design refinement, and quality validation

- [ ] T073 [P] Verify Header component matches Figma desktop design (node-id=9-826) with 95% accuracy
- [ ] T074 [P] Verify Header component matches Figma mobile design (node-id=854-1325) with 95% accuracy
- [ ] T075 [P] Verify MenuList matches Figma desktop design (node-id=9-828) with 95% accuracy
- [ ] T076 [P] Verify MenuList matches Figma mobile design (node-id=892-2436) with 95% accuracy
- [ ] T077 [P] Run ESLint and Prettier on all new component files
- [ ] T078 [P] Verify TypeScript strict mode compliance (no any types)
- [ ] T079 Test responsive transitions at 768px breakpoint (no layout shift)
- [ ] T080 [P] Verify all interactive elements have visible focus indicators
- [ ] T081 [P] Verify WCAG 2.1 AA color contrast ratios for header and menu
- [ ] T082 [P] Test keyboard navigation flow across all components
- [ ] T083 Run full E2E test suite via Playwright
- [ ] T084 Run unit test suite via Vitest with coverage report
- [ ] T085 Verify all Storybook stories render without errors
- [ ] T086 [P] Verify barrel exports at packages/client/src/components/Header/index.ts and packages/client/src/components/MenuList/index.ts
- [ ] T087 Add component documentation comments (JSDoc) to Header and MenuList

**Checkpoint**: All quality checks passed - feature ready for review

---

## Dependencies & Execution Strategy

### User Story Dependency Graph

```
Setup (Phase 1)
  ↓
Foundational (Phase 2)
  ↓
├─→ User Story 1 (P1) 🎯 MVP - Can implement first, no dependencies
├─→ User Story 2 (P2) - Can implement in parallel with US3, depends on US1 Header skeleton
└─→ User Story 3 (P2) - Can implement in parallel with US2, depends on foundational files
  ↓
Polish (Phase 6)
```

### Parallel Execution Examples

**After Phase 1 & 2 complete**, the following can run in parallel:

**User Story 1 Team**: T013-T028 (Header with logo navigation)
**User Story 2 Team**: Wait for T015-T022, then T029-T047 (Avatar dropdown in existing Header)
**User Story 3 Team**: T048-T072 (MenuList component independent of Header)

**Within each User Story**, these can parallelize:

- **US1**: Storybook stories (T013, T014) + Unit tests (T023-T025) can be written while implementation (T015-T022) is in progress
- **US2**: Storybook stories (T029-T031) + Unit tests (T041-T044) can be written in parallel
- **US3**: Storybook stories (T048-T051) + Unit tests (T065-T069) can be written in parallel

**Polish Phase**: Most tasks (T073-T082, T084-T087) can run in parallel after all user stories complete

### MVP Scope (Recommended Initial Delivery)

**Minimum Viable Product**: User Story 1 only (T001-T028)

This delivers:

- ✅ Header on all pages
- ✅ Logo navigation to home
- ✅ Responsive text display
- ✅ Keyboard accessible
- ✅ Fully tested (unit + E2E + Storybook)

**Rationale**: User Story 1 provides core navigation value and can be delivered independently. User Stories 2 and 3 add progressive enhancements.

---

## Implementation Strategy

1. **Storybook-First Approach**: Write Storybook stories BEFORE implementation to visualize component behavior
2. **Test-Informed Development**: Write unit tests alongside implementation (not strict TDD, but test-informed)
3. **Component Isolation**: Each user story delivers independently testable components
4. **Incremental Delivery**:
   - Sprint 1: US1 only (MVP - 2-3 days)
   - Sprint 2: US2 (Avatar dropdown - 1-2 days)
   - Sprint 3: US3 (MenuList - 1-2 days)
   - Sprint 4: Polish (1 day)

---

## Task Summary

**Total Tasks**: 87

**By Phase**:

- Phase 1 (Setup): 5 tasks
- Phase 2 (Foundational): 7 tasks
- Phase 3 (US1): 16 tasks
- Phase 4 (US2): 19 tasks
- Phase 5 (US3): 25 tasks
- Phase 6 (Polish): 15 tasks

**By User Story**:

- User Story 1: 16 tasks (Header logo navigation)
- User Story 2: 19 tasks (Avatar dropdown)
- User Story 3: 25 tasks (Menu navigation)
- Infrastructure: 12 tasks (Setup + Foundational)
- Polish: 15 tasks

**Parallelization Opportunities**:

- 52 tasks marked [P] can run in parallel (60% of total)
- User Stories 2 and 3 can partially parallelize
- Within each story: Storybook + Tests can parallelize with implementation

**Test Coverage**:

- Unit tests: 14 test tasks (Vitest)
- E2E tests: 8 test scenarios (Playwright)
- Storybook stories: 9 story tasks
- Total testing tasks: 31 (36% of all tasks)

---

## Quality Gates

Each phase has checkpoints to ensure quality before proceeding:

- **Phase 1**: Directory structure verified, dependencies installed
- **Phase 2**: All component files exist, barrel exports work
- **Phase 3**: US1 tests pass, Storybook renders, E2E navigation works
- **Phase 4**: US2 tests pass, dropdown interaction verified
- **Phase 5**: US3 tests pass, menu navigation verified
- **Phase 6**: All quality checks pass (ESLint, TypeScript, accessibility, visual design)

**Final Gate**: Feature complete when all 87 tasks checked off and quality gates passed.
