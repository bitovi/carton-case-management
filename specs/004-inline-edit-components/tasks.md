# Tasks: Inline Editable Components

**Input**: Design documents from `/specs/004-inline-edit-components/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅

**Tests**: Unit tests and Storybook stories are REQUIRED per Constitution (Section III & IV).

**Component Pattern**: Each component MUST follow the **modlet pattern** (see `.github/instructions/client.instructions.md`):
```
ComponentName/
├── ComponentName.tsx          # Main component
├── ComponentName.test.tsx     # Unit tests
├── ComponentName.stories.tsx  # Storybook stories  
└── index.ts                   # Public exports
```

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Project structure, Figma design context, and shared type definitions

### Figma Design References (for MCP fetch during implementation)

| Component | Figma URL | Node ID |
|-----------|-----------|--------|
| All Components Overview | https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/branch/mPCNrycLkhncmjlVoYTBzT/Carton-Case-Management?node-id=1109-12982 | 1109-12982 |
| BaseEditable | https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/branch/mPCNrycLkhncmjlVoYTBzT/Carton-Case-Management?node-id=1252-9022 | 1252-9022 |
| EditableText | https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/branch/mPCNrycLkhncmjlVoYTBzT/Carton-Case-Management?node-id=1261-9396 | 1261-9396 |
| EditableSelect | https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/branch/mPCNrycLkhncmjlVoYTBzT/Carton-Case-Management?node-id=1065-13212 | 1065-13212 |
| EditableDate | https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/branch/mPCNrycLkhncmjlVoYTBzT/Carton-Case-Management?node-id=1252-8939 | 1252-8939 |
| EditableNumber | https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/branch/mPCNrycLkhncmjlVoYTBzT/Carton-Case-Management?node-id=1252-9102 | 1252-9102 |
| EditableCurrency | https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/branch/mPCNrycLkhncmjlVoYTBzT/Carton-Case-Management?node-id=1252-9136 | 1252-9136 |
| EditablePercent | https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/branch/mPCNrycLkhncmjlVoYTBzT/Carton-Case-Management?node-id=1252-9231 | 1252-9231 |
| EditableTextarea | https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/branch/mPCNrycLkhncmjlVoYTBzT/Carton-Case-Management?node-id=853-1802 | 853-1802 |

- [X] T001 Fetch Figma design context via MCP for all component variants: `mcp_figma_get_design_context` with nodeId `1109-12982` and fileKey `mPCNrycLkhncmjlVoYTBzT`
- [X] T002 Create inline-edit directory structure at `packages/client/src/components/inline-edit/`
- [X] T003 [P] Create shared types in `packages/client/src/components/inline-edit/types.ts`
- [X] T004 [P] Create barrel export in `packages/client/src/components/inline-edit/index.ts`

---

## Phase 2: Foundational (BaseEditable)

**Purpose**: Core BaseEditable component that ALL user stories depend on

**⚠️ CRITICAL**: No variant components can be implemented until BaseEditable is complete

**Figma Reference**: Fetch `mcp_figma_get_design_context` with nodeId `1252-9022`, fileKey `mPCNrycLkhncmjlVoYTBzT` before implementing

**Modlet Structure**: Create `packages/client/src/components/inline-edit/BaseEditable/` with all required files

- [X] T005 Create BaseEditable component in `packages/client/src/components/inline-edit/BaseEditable/BaseEditable.tsx` — **MUST fetch Figma node 1252-9022 first**
- [X] T006 [P] Create BaseEditable unit tests in `packages/client/src/components/inline-edit/BaseEditable/BaseEditable.test.tsx`
- [X] T007 [P] Create BaseEditable stories in `packages/client/src/components/inline-edit/BaseEditable/BaseEditable.stories.tsx`
- [X] T008 Create BaseEditable barrel export in `packages/client/src/components/inline-edit/BaseEditable/index.ts`
- [X] T008a [P] Create BaseEditable types in `packages/client/src/components/inline-edit/BaseEditable/types.ts` (shared state types)

**Checkpoint**: BaseEditable ready - variant component implementation can begin

---

## Phase 3: User Story 1 - Edit Field Values In Place (Priority: P1) 🎯 MVP

**Goal**: Users can click any editable field, modify its value, and save changes

**Independent Test**: Click EditableText field, modify value, click save, verify new value persists

### Implementation for User Story 1

**EditableText** — Figma: `mcp_figma_get_design_context` nodeId `1261-9396`, fileKey `mPCNrycLkhncmjlVoYTBzT`
- [X] T009 [P] [US1] Create EditableText component in `packages/client/src/components/inline-edit/EditableText/EditableText.tsx` — **MUST fetch Figma node 1261-9396 first**
- [X] T010 [P] [US1] Create EditableText unit tests in `packages/client/src/components/inline-edit/EditableText/EditableText.test.tsx`
- [X] T011 [P] [US1] Create EditableText stories in `packages/client/src/components/inline-edit/EditableText/EditableText.stories.tsx`
- [X] T012 [US1] Create EditableText barrel export in `packages/client/src/components/inline-edit/EditableText/index.ts`

**EditableSelect** — Figma: `mcp_figma_get_design_context` nodeId `1065-13212`, fileKey `mPCNrycLkhncmjlVoYTBzT`
- [X] T013 [P] [US1] Create EditableSelect component in `packages/client/src/components/inline-edit/EditableSelect/EditableSelect.tsx` — **MUST fetch Figma node 1065-13212 first**
- [X] T014 [P] [US1] Create EditableSelect unit tests in `packages/client/src/components/inline-edit/EditableSelect/EditableSelect.test.tsx`
- [X] T015 [P] [US1] Create EditableSelect stories in `packages/client/src/components/inline-edit/EditableSelect/EditableSelect.stories.tsx`
- [X] T016 [US1] Create EditableSelect barrel export in `packages/client/src/components/inline-edit/EditableSelect/index.ts`

**EditableTitle** — Figma: `mcp_figma_get_design_context` nodeId `1109-12982`, fileKey `mPCNrycLkhncmjlVoYTBzT` (part of main component set)
- [X] T017 [P] [US1] Create EditableTitle component in `packages/client/src/components/inline-edit/EditableTitle/EditableTitle.tsx` — **MUST fetch Figma node 1109-12982 first**
- [X] T018 [P] [US1] Create EditableTitle unit tests in `packages/client/src/components/inline-edit/EditableTitle/EditableTitle.test.tsx`
- [X] T019 [P] [US1] Create EditableTitle stories in `packages/client/src/components/inline-edit/EditableTitle/EditableTitle.stories.tsx`
- [X] T020 [US1] Create EditableTitle barrel export in `packages/client/src/components/inline-edit/EditableTitle/index.ts`

- [X] T021 [US1] Update inline-edit barrel export to include EditableText, EditableSelect, EditableTitle in `packages/client/src/components/inline-edit/index.ts`

**Checkpoint**: Core editing variants (Text, Select, Title) complete and testable

---

## Phase 4: User Story 2 - Keyboard-Accessible Editing (Priority: P1)

**Goal**: Users can navigate and edit fields using only keyboard (Tab, Enter, Escape)

**Independent Test**: Tab to focus field, Enter to edit, Escape to cancel, verify state changes

### Implementation for User Story 2

> Note: Keyboard accessibility is built into BaseEditable (Phase 2). This phase adds additional keyboard tests and stories.

- [ ] T022 [P] [US2] Add keyboard navigation tests to BaseEditable in `packages/client/src/components/inline-edit/BaseEditable/BaseEditable.test.tsx`
- [ ] T023 [P] [US2] Add keyboard interaction stories to BaseEditable in `packages/client/src/components/inline-edit/BaseEditable/BaseEditable.stories.tsx`
- [ ] T024 [P] [US2] Add keyboard tests to EditableText in `packages/client/src/components/inline-edit/EditableText/EditableText.test.tsx`
- [ ] T025 [P] [US2] Add keyboard tests to EditableSelect in `packages/client/src/components/inline-edit/EditableSelect/EditableSelect.test.tsx`

**Checkpoint**: All core components pass keyboard accessibility tests

---

## Phase 5: User Story 3 - Read-Only Mode (Priority: P2)

**Goal**: Fields with `readonly={true}` cannot be edited

**Independent Test**: Render field with readonly, verify no hover state, click does nothing

### Implementation for User Story 3

> Note: Read-only behavior is built into BaseEditable (Phase 2). This phase adds specific tests and stories.

- [ ] T026 [P] [US3] Add readonly tests to BaseEditable in `packages/client/src/components/inline-edit/BaseEditable/BaseEditable.test.tsx`
- [ ] T027 [P] [US3] Add readonly story to BaseEditable in `packages/client/src/components/inline-edit/BaseEditable/BaseEditable.stories.tsx`
- [ ] T028 [P] [US3] Add readonly tests to EditableText in `packages/client/src/components/inline-edit/EditableText/EditableText.test.tsx`
- [ ] T029 [P] [US3] Add readonly story to EditableText in `packages/client/src/components/inline-edit/EditableText/EditableText.stories.tsx`

**Checkpoint**: Read-only mode verified across all components

---

## Phase 6: User Story 4 - Loading State Feedback (Priority: P2)

**Goal**: Saving state shows spinner, success shows new value, failure shows error

**Independent Test**: Save field with slow Promise, verify spinner, then verify success/error states

### Implementation for User Story 4

> Note: Saving state is built into BaseEditable (Phase 2). This phase adds async save tests and error handling stories.

- [ ] T030 [P] [US4] Add saving state tests to BaseEditable in `packages/client/src/components/inline-edit/BaseEditable/BaseEditable.test.tsx`
- [ ] T031 [P] [US4] Add saving state stories to BaseEditable in `packages/client/src/components/inline-edit/BaseEditable/BaseEditable.stories.tsx`
- [ ] T032 [P] [US4] Add error state tests to BaseEditable in `packages/client/src/components/inline-edit/BaseEditable/BaseEditable.test.tsx`
- [ ] T033 [P] [US4] Add error state story to BaseEditable in `packages/client/src/components/inline-edit/BaseEditable/BaseEditable.stories.tsx`

**Checkpoint**: Loading and error states verified

---

## Phase 7: User Story 5 - Controlled State Mode (Priority: P3)

**Goal**: Developers can control edit mode via `isEditing` and `onEditingChange` props

**Independent Test**: Render with `isEditing={true}`, verify field starts in edit mode

### Implementation for User Story 5

- [ ] T034 [P] [US5] Add controlled state tests to BaseEditable in `packages/client/src/components/inline-edit/BaseEditable/BaseEditable.test.tsx`
- [ ] T035 [P] [US5] Add controlled state story to BaseEditable in `packages/client/src/components/inline-edit/BaseEditable/BaseEditable.stories.tsx`

**Checkpoint**: Controlled mode verified

---

## Phase 8: Additional Component Variants

**Purpose**: Complete the full component library (8 variants from Figma)

**EditableTextarea** — Figma: `mcp_figma_get_design_context` nodeId `853-1802`, fileKey `mPCNrycLkhncmjlVoYTBzT`
> ⚠️ Note: EditableTextarea has only 2 states (Rest/Edit, NO Hover) and uses Save/Cancel text buttons instead of check/x icons
- [X] T036 [P] Create EditableTextarea component in `packages/client/src/components/inline-edit/EditableTextarea/EditableTextarea.tsx` — **MUST fetch Figma node 853-1802 first**
- [X] T037 [P] Create EditableTextarea unit tests in `packages/client/src/components/inline-edit/EditableTextarea/EditableTextarea.test.tsx`
- [X] T038 [P] Create EditableTextarea stories in `packages/client/src/components/inline-edit/EditableTextarea/EditableTextarea.stories.tsx`
- [X] T039 Create EditableTextarea barrel export in `packages/client/src/components/inline-edit/EditableTextarea/index.ts`

**EditableDate** — Figma: `mcp_figma_get_design_context` nodeId `1252-8939`, fileKey `mPCNrycLkhncmjlVoYTBzT`
> ⚠️ Note: EditableDate auto-saves on selection (no check/x buttons)
- [X] T040 [P] Create EditableDate component in `packages/client/src/components/inline-edit/EditableDate/EditableDate.tsx` — **MUST fetch Figma node 1252-8939 first**
- [X] T041 [P] Create EditableDate unit tests in `packages/client/src/components/inline-edit/EditableDate/EditableDate.test.tsx`
- [X] T042 [P] Create EditableDate stories in `packages/client/src/components/inline-edit/EditableDate/EditableDate.stories.tsx`
- [X] T043 Create EditableDate barrel export in `packages/client/src/components/inline-edit/EditableDate/index.ts`

**EditableNumber** — Figma: `mcp_figma_get_design_context` nodeId `1252-9102`, fileKey `mPCNrycLkhncmjlVoYTBzT`
- [X] T044 [P] Create EditableNumber component in `packages/client/src/components/inline-edit/EditableNumber/EditableNumber.tsx` — **MUST fetch Figma node 1252-9102 first**
- [X] T045 [P] Create EditableNumber unit tests in `packages/client/src/components/inline-edit/EditableNumber/EditableNumber.test.tsx`
- [X] T046 [P] Create EditableNumber stories in `packages/client/src/components/inline-edit/EditableNumber/EditableNumber.stories.tsx`
- [X] T047 Create EditableNumber barrel export in `packages/client/src/components/inline-edit/EditableNumber/index.ts`

**EditableCurrency** — Figma: `mcp_figma_get_design_context` nodeId `1252-9136`, fileKey `mPCNrycLkhncmjlVoYTBzT`
> ⚠️ Note: EditableCurrency shows $ icon inside input on left, displays "$99.99" format in rest state
- [X] T048 [P] Create EditableCurrency component in `packages/client/src/components/inline-edit/EditableCurrency/EditableCurrency.tsx` — **MUST fetch Figma node 1252-9136 first**
- [X] T049 [P] Create EditableCurrency unit tests in `packages/client/src/components/inline-edit/EditableCurrency/EditableCurrency.test.tsx`
- [X] T050 [P] Create EditableCurrency stories in `packages/client/src/components/inline-edit/EditableCurrency/EditableCurrency.stories.tsx`
- [X] T051 Create EditableCurrency barrel export in `packages/client/src/components/inline-edit/EditableCurrency/index.ts`

**EditablePercent** — Figma: `mcp_figma_get_design_context` nodeId `1252-9231`, fileKey `mPCNrycLkhncmjlVoYTBzT`
> ⚠️ Note: EditablePercent shows % icon inside input on right, displays "15%" format in rest state
- [X] T052 [P] Create EditablePercent component in `packages/client/src/components/inline-edit/EditablePercent/EditablePercent.tsx` — **MUST fetch Figma node 1252-9231 first**
- [X] T053 [P] Create EditablePercent unit tests in `packages/client/src/components/inline-edit/EditablePercent/EditablePercent.test.tsx`
- [X] T054 [P] Create EditablePercent stories in `packages/client/src/components/inline-edit/EditablePercent/EditablePercent.stories.tsx`
- [X] T055 Create EditablePercent barrel export in `packages/client/src/components/inline-edit/EditablePercent/index.ts`

- [X] T056 Update inline-edit barrel export to include all components in `packages/client/src/components/inline-edit/index.ts`

**Checkpoint**: All 8 component variants complete with tests and stories

---

## Phase 9: Migration

**Purpose**: Replace existing EditableSelect and EditableTitle with new components

- [X] T057 Migrate CaseEssentialDetails to use new EditableSelect in `packages/client/src/components/CaseDetails/components/CaseEssentialDetails/CaseEssentialDetails.tsx`
- [X] T058 Migrate CaseInformation to use new EditableTitle in `packages/client/src/components/CaseDetails/components/CaseInformation/CaseInformation.tsx`
- [X] T059 Migrate CaseInformation to use new EditableSelect in `packages/client/src/components/CaseDetails/components/CaseInformation/CaseInformation.tsx`
- [X] T060 Run existing E2E tests to verify migration success
- [X] T061 [P] Remove deprecated EditableSelect from `packages/client/src/components/common/EditableSelect/`
- [X] T062 [P] Remove deprecated EditableTitle from `packages/client/src/components/common/EditableTitle/`

**Checkpoint**: Migration complete, old components removed ✅

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Final cleanup and validation

- [X] T063 Run all unit tests and fix any failures
- [X] T064 Run Storybook and verify all stories render without errors
- [X] T065 Run type check (`npm run typecheck --workspace=@carton/client`)
- [X] T066 Run linter (`npm run lint --workspace=@carton/client`)
- [X] T067 [P] Run E2E tests to verify no regressions
- [X] T068 Run quickstart.md validation commands

**Checkpoint**: All validation complete ✅

---

## Dependencies & Execution Order

### Phase Dependencies

```text
Phase 1: Setup ─────────────► Phase 2: Foundational (BaseEditable) ───┬──► Phase 3: US1 (MVP)
                                                                       │
                                                                       ├──► Phase 4: US2 (Keyboard)
                                                                       │
                                                                       ├──► Phase 5: US3 (Readonly)
                                                                       │
                                                                       ├──► Phase 6: US4 (Loading)
                                                                       │
                                                                       └──► Phase 7: US5 (Controlled)
                                                                       
Phase 8: Additional Variants ─► Phase 9: Migration ─► Phase 10: Polish
```

### User Story Dependencies

- **US1 (P1)**: Depends only on Phase 2 (BaseEditable) - Core MVP
- **US2 (P1)**: Depends only on Phase 2 - Can run parallel with US1
- **US3 (P2)**: Depends only on Phase 2 - Can run parallel with US1/US2
- **US4 (P2)**: Depends only on Phase 2 - Can run parallel
- **US5 (P3)**: Depends only on Phase 2 - Can run parallel

### Within Each Phase

- Components before tests before stories before barrel exports
- All [P] tasks within a phase can run in parallel

---

## Parallel Opportunities

### Phase 2 (Foundational)
```bash
# After T005 (BaseEditable component), run in parallel:
T006: BaseEditable unit tests
T007: BaseEditable stories
```

### Phase 3 (User Story 1 - MVP)
```bash
# All component tasks can run in parallel:
T009: EditableText component      T013: EditableSelect component      T017: EditableTitle component
T010: EditableText tests          T014: EditableSelect tests          T018: EditableTitle tests
T011: EditableText stories        T015: EditableSelect stories        T019: EditableTitle stories
```

### Phase 8 (Additional Variants)
```bash
# All 5 additional variants can be built in parallel:
EditableTextarea (T036-T039)
EditableDate (T040-T043)
EditableNumber (T044-T047)
EditableCurrency (T048-T051)
EditablePercent (T052-T055)
```

---

## Implementation Strategy

### MVP First (Phases 1-3 Only)

1. Complete Phase 1: Setup (3 tasks)
2. Complete Phase 2: Foundational (4 tasks)
3. Complete Phase 3: User Story 1 (13 tasks)
4. **STOP and VALIDATE**: Test EditableText, EditableSelect, EditableTitle
5. Deploy/demo if ready - Core inline editing works

### Full Feature Delivery

1. MVP (Phases 1-3)
2. Add US2-US5 for complete BaseEditable coverage (Phases 4-7)
3. Add remaining variants (Phase 8)
4. Migration (Phase 9)
5. Polish (Phase 10)

---

## Summary

| Phase | Tasks | Description |
|-------|-------|-------------|
| 1. Setup | 4 | Directory structure, Figma, and types |
| 2. Foundational | 4 | BaseEditable (blocking) |
| 3. US1 (MVP) | 13 | EditableText, EditableSelect, EditableTitle |
| 4. US2 | 4 | Keyboard accessibility tests |
| 5. US3 | 4 | Read-only mode tests |
| 6. US4 | 4 | Loading/error state tests |
| 7. US5 | 2 | Controlled state tests |
| 8. Variants | 21 | Textarea, Date, Number, Currency, Percent |
| 9. Migration | 6 | Replace old components |
| 10. Polish | 6 | Final validation |
| **Total** | **68** | |

**Parallel Opportunities**: ~46 tasks can run in parallel (68% parallelizable)
**MVP Scope**: 21 tasks (Phases 1-3)
**Independent Stories**: Each user story (4-7) can be implemented independently after Phase 2
