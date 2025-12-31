# Tasks: Rich Text Case Description

**Input**: Design documents from `/specs/003-rich-text-description/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: REQUIRED per constitution Section III (NON-NEGOTIABLE) - test tasks included following TDD workflow (write tests first, ensure they fail, then implement)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Monorepo structure**: `packages/client/src/`, `packages/server/src/`, `packages/shared/src/`
- Paths below follow the monorepo structure defined in plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency installation

- [x] T001 Install Slate.js dependencies (slate, slate-react, slate-history) in packages/client/package.json
- [x] T002 [P] Install TypeScript types (@types/slate, @types/slate-react) in packages/client/package.json
- [x] T003 [P] Verify existing dependencies (Zod, tRPC, React) per research.md Section 1

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core shared types and utilities that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Create shared rich text type definitions in packages/shared/src/richText.ts (BaseElement, FormattedText, ParagraphElement, HeadingElement, BulletedListElement, NumberedListElement, ListItemElement, LinkElement, CodeBlockElement, Element union, Descendant, RichTextDocument) per contracts/rich-text-types.md
- [x] T005 [P] Add Zod validation schemas in packages/shared/src/richText.ts (formattedTextSchema, paragraphSchema, headingSchema, bulletedListSchema, numberedListSchema, listItemSchema, linkSchema, codeBlockSchema, elementSchema, richTextDocumentSchema) per data-model.md
- [x] T006 [P] Export rich text types from packages/shared/src/index.ts
- [x] T007 Create serializeToPlainText utility in packages/shared/src/richText.ts for character counting per research.md Section 3
- [x] T008 Create base Slate plugins directory structure packages/client/src/components/RichText/plugins/
- [x] T009 Create base utility directory structure packages/client/src/components/RichText/utils/
- [x] T010 Update tRPC case.update mutation in packages/server/src/router.ts to validate rich text structure (JSON parse, Zod validation, character count ≤10000, empty content check) per contracts/case-update-mutation.md
- [x] T010a [P] Unit tests for serializeToPlainText utility in packages/shared/src/richText.ts (test character counting with plain text, formatted text, nested lists, links)
- [x] T010b [P] Unit tests for Zod validation schemas in packages/shared/src/richText.ts (test valid documents, invalid structures, edge cases)
- [x] T010c Integration tests for case.update mutation in packages/server/src/router.test.ts (test valid rich text saves, character limit exceeded returns error, empty description rejected, invalid JSON rejected, malformed structure rejected) per contracts/case-update-mutation.md

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Format Case Description Text (Priority: P1) 🎯 MVP

**Goal**: Enable case managers to apply basic text formatting (bold, italic, underline) to case descriptions using toolbar buttons or keyboard shortcuts

**Independent Test**: Create/edit a case description, select text, apply bold/italic/underline formatting using toolbar or keyboard shortcuts (Cmd/Ctrl+B/I/U), save changes, verify formatting preserved when viewing case later

### Implementation for User Story 1

- [x] T011 [P] [US1] Create withFormatting Slate plugin in packages/client/src/components/RichText/plugins/withFormatting.ts for bold, italic, underline marks per research.md Section 1
- [x] T012 [P] [US1] Create serialization utilities in packages/client/src/components/RichText/utils/serialization.ts (serializeToJSON, deserializeFromJSON, createEmptyDocument) per quickstart.md Phase 4.3
- [x] T013 [P] [US1] Create character count hook in packages/client/src/components/RichText/utils/characterCount.ts (useCharacterCount, getCharacterCount) per research.md Section 3
- [x] T014 [P] [US1] Create validation utilities in packages/client/src/components/RichText/utils/validation.ts (validateRichText) per quickstart.md Phase 4.3
- [x] T015 [US1] Create RichTextToolbar component in packages/client/src/components/RichText/RichTextToolbar.tsx with Bold, Italic, Underline buttons using shadcn Button components matching Figma design per contracts/rich-text-editor-component.md
- [x] T016 [US1] Implement toolbar button handlers (toggleBold, toggleItalic, toggleUnderline) in packages/client/src/components/RichText/RichTextToolbar.tsx using Slate Transforms API
- [x] T017 [US1] Create RichTextEditor component in packages/client/src/components/RichText/RichTextEditor.tsx with Slate/Editable setup, withReact/withHistory/withFormatting plugins, keyboard shortcut handlers (Cmd/Ctrl+B/I/U), character count display per contracts/rich-text-editor-component.md
- [x] T018 [US1] Implement renderLeaf function in packages/client/src/components/RichText/RichTextEditor.tsx for rendering bold/italic/underline marks
- [x] T019 [US1] Add character count display below editor showing "X / 10,000 characters" with warning (orange 9000-10000) and error (red >10000) states per contracts/rich-text-editor-component.md
- [x] T020 [US1] Create RichTextRenderer component in packages/client/src/components/RichText/RichTextRenderer.tsx for read-only formatted text display per quickstart.md Phase 4.6
- [x] T021 [US1] Update CaseInformation component in packages/client/src/components/CaseDetails/components/CaseInformation/CaseInformation.tsx to replace Textarea with RichTextEditor in edit mode and RichTextRenderer in view mode per quickstart.md Phase 5.1
- [x] T022 [US1] Implement handleSave in packages/client/src/components/CaseDetails/components/CaseInformation/CaseInformation.tsx to serialize rich text to JSON before tRPC mutation per quickstart.md Phase 5.1
- [x] T023 [US1] Add paste handler in packages/client/src/components/RichText/RichTextEditor.tsx to sanitize HTML and strip unsupported formatting per research.md Section 4
- [x] T023a [US1] Component tests for RichTextEditor in packages/client/src/components/RichText/RichTextEditor.test.tsx (test renders with initial value, calls onChange when content changes, shows character count, enforces character limit, keyboard shortcuts work, paste handler strips formatting)
- [x] T023b [US1] Component tests for RichTextToolbar in packages/client/src/components/RichText/RichTextToolbar.test.tsx (test bold/italic/underline buttons toggle formatting, buttons show active state when format applied)
- [x] T023c [US1] Component tests for RichTextRenderer in packages/client/src/components/RichText/RichTextRenderer.test.tsx (test renders formatted text correctly, handles empty content, renders all text marks)
- [x] T023d [US1] Integration tests for CaseInformation in packages/client/src/components/CaseDetails/components/CaseInformation/CaseInformation.test.tsx (test rich text editor renders in edit mode, renderer shows in view mode, save serializes to JSON, cancel reverts changes)

**Checkpoint**: At this point, User Story 1 should be fully functional - case managers can format text (bold/italic/underline), save, and view formatted descriptions

---

## Phase 4: User Story 2 - Create Structured Lists (Priority: P2)

**Goal**: Enable case managers to organize information using bulleted and numbered lists

**Independent Test**: Edit a case description, click bullet/numbered list button, add multiple items, save description, verify list structure maintained when viewing case

### Implementation for User Story 2

- [x] T024 [P] [US2] Create withLists Slate plugin in packages/client/src/components/RichText/plugins/withLists.ts for list normalization and behavior per research.md Section 1
- [x] T025 [US2] Add list buttons (Bulleted List, Numbered List) to RichTextToolbar in packages/client/src/components/RichText/RichTextToolbar.tsx per contracts/rich-text-editor-component.md
- [x] T026 [US2] Implement list toggle handlers (toggleBulletedList, toggleNumberedList) in packages/client/src/components/RichText/RichTextToolbar.tsx using Slate Transforms API
- [x] T027 [US2] Add Enter key handler in packages/client/src/components/RichText/RichTextEditor.tsx for creating new list items within lists per contracts/rich-text-editor-component.md
- [x] T028 [US2] Add Tab/Shift+Tab handlers in packages/client/src/components/RichText/RichTextEditor.tsx for list indentation per contracts/rich-text-editor-component.md
- [x] T029 [US2] Implement renderElement function in packages/client/src/components/RichText/RichTextEditor.tsx for rendering bulleted-list, numbered-list, and list-item elements
- [x] T030 [US2] Update RichTextRenderer in packages/client/src/components/RichText/RichTextRenderer.tsx to render list elements (ul, ol, li) per quickstart.md Phase 4.6
- [x] T030a [US2] Component tests for list functionality in packages/client/src/components/RichText/RichTextEditor.test.tsx (test creates bulleted list, creates numbered list, Enter adds new list item, Tab indents list, Shift+Tab outdents list, list structure preserved)
- [x] T030b [US2] Component tests for list rendering in packages/client/src/components/RichText/RichTextRenderer.test.tsx (test renders bulleted lists, renders numbered lists, renders nested lists)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - case managers can format text AND create structured lists

---

## Phase 5: User Story 3 - Insert Links and Format Headings (Priority: P3)

**Goal**: Enable case managers to add hyperlinks to external resources and use heading levels to structure lengthy case descriptions

**Independent Test**: Edit a case description, select text, click link button, enter URL, verify link formatted correctly and opens in new tab when clicked; format text as Heading 2 to create section breaks

### Implementation for User Story 3

- [x] T031 [P] [US3] Create withLinks Slate plugin in packages/client/src/components/RichText/plugins/withLinks.ts for link normalization and inline behavior per research.md Section 1
- [x] T032 [P] [US3] Create link dialog component or use inline prompt for URL input in packages/client/src/components/RichText/ per contracts/rich-text-editor-component.md Link Dialog section
- [x] T033 [US3] Add Link button to RichTextToolbar in packages/client/src/components/RichText/RichTextToolbar.tsx per contracts/rich-text-editor-component.md
- [x] T034 [US3] Add Heading dropdown to RichTextToolbar in packages/client/src/components/RichText/RichTextToolbar.tsx with Heading 2 option per contracts/rich-text-editor-component.md
- [x] T035 [US3] Implement link insertion handler (insertLink) in packages/client/src/components/RichText/RichTextToolbar.tsx using Slate Transforms API and link dialog
- [x] T036 [US3] Implement heading toggle handler (toggleHeading) in packages/client/src/components/RichText/RichTextToolbar.tsx using Slate Transforms API
- [x] T037 [US3] Add Cmd/Ctrl+K keyboard shortcut in packages/client/src/components/RichText/RichTextEditor.tsx to open link dialog per contracts/rich-text-editor-component.md
- [x] T038 [US3] Update renderElement function in packages/client/src/components/RichText/RichTextEditor.tsx to render link and heading-two elements
- [x] T039 [US3] Update RichTextRenderer in packages/client/src/components/RichText/RichTextRenderer.tsx to render link (a tag with target="\_blank" rel="noopener noreferrer") and heading elements per quickstart.md Phase 4.6- [X] T039a [US3] Component tests for link/heading functionality in packages/client/src/components/RichText/RichTextEditor.test.tsx (test inserts link with URL, Cmd/Ctrl+K opens link dialog, formats as Heading 2, links are clickable)
- [x] T039b [US3] Component tests for link/heading rendering in packages/client/src/components/RichText/RichTextRenderer.test.tsx (test renders links with correct attributes, renders Heading 2 elements, links open in new tab)
      **Checkpoint**: All user stories should now be independently functional - case managers can format text, create lists, add links, and use headings

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and complete the feature

- [ ] T040 [P] Add Storybook story for RichTextEditor in packages/client/src/components/RichText/RichTextEditor.stories.tsx (Empty, WithContent, WithList, NearCharacterLimit, ReadOnly, Disabled) per contracts/rich-text-editor-component.md Stories section
- [ ] T041 [P] Update CaseInformation Storybook stories in packages/client/src/components/CaseDetails/components/CaseInformation/CaseInformation.stories.tsx to include rich text examples per quickstart.md Phase 5.3
- [ ] T041a E2E test for rich text editing workflow in tests/e2e/rich-text-description.spec.ts (test create case with formatted description, edit existing case, format text bold/italic/underline, create lists, insert links, add headings, save and verify formatting preserved, test character limit enforcement, test mobile responsive rendering) per plan.md constitution check
- [ ] T042 [P] Add optional Strikethrough button to RichTextToolbar if time permits (P4 priority) per spec.md FR-006 and clarifications
- [ ] T043 [P] Add optional Code Block button to RichTextToolbar if time permits (P4 priority) per spec.md FR-006 and clarifications
- [ ] T044 [P] Add optional Inline Code button to RichTextToolbar if time permits (P4 priority) per spec.md FR-006 and clarifications
- [ ] T045 Verify mobile responsive toolbar behavior (essential buttons visible, overflow menu for optional buttons) per research.md Section 6
- [ ] T046 Add CSS styling to match Figma design (toolbar background, button hover states, editor border, rounded corners, min-height 150px) per contracts/rich-text-editor-component.md Styling section
- [ ] T047 Verify character count accuracy with complex formatting (nested lists, links, headings) per research.md Section 3
- [ ] T048 Verify paste handling with Word documents, Google Docs, and web pages per research.md Section 4
- [ ] T049 Add error message display when character limit exceeded preventing save per spec.md FR-011
- [ ] T050 Verify empty description validation and error message per spec.md FR-010
- [ ] T051 Add Cmd/Ctrl+S keyboard shortcut handler in packages/client/src/components/RichText/RichTextEditor.tsx to call onSave prop per contracts/rich-text-editor-component.md
- [ ] T052 Run quickstart.md validation checklist (constitution compliance, quality checks, manual testing)
- [ ] T053 Update feature documentation if needed

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-5)**: All depend on Foundational phase completion
  - User Story 1 (P1): Can start after Foundational - No dependencies on other stories
  - User Story 2 (P2): Can start after Foundational - No dependencies on US1 (independent)
  - User Story 3 (P3): Can start after Foundational - No dependencies on US1/US2 (independent)
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independently testable (adds list functionality to existing editor)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independently testable (adds links/headings to existing editor)

Note: While US2 and US3 build upon the editor created in US1, they are independently testable because they add distinct functionality (lists, links, headings) that can be verified without breaking existing formatting capabilities.

### Within Each User Story

**User Story 1 (Text Formatting)**:

- T011-T014 (plugins, utilities) can run in parallel [P]
- T015-T016 (toolbar) depends on T011 (withFormatting plugin)
- T017 (editor) depends on T015 (toolbar), T011-T014 (plugins/utils)
- T018-T019 (rendering, character count) depends on T017 (editor)
- T020 (renderer) can be parallel with T017-T019 [P]
- T021-T022 (integration) depends on T017, T020 (editor + renderer)
- T023 (paste handler) depends on T017 (editor)

**User Story 2 (Lists)**:

- T024 (list plugin) must come before toolbar
- T025-T026 (toolbar buttons) can be parallel
- T027-T028 (keyboard handlers) depends on T024 (list plugin)
- T029 (renderElement) depends on T024 (list plugin)
- T030 (renderer update) can be parallel with T025-T029

**User Story 3 (Links & Headings)**:

- T031-T032 (link plugin, dialog) can run in parallel [P]
- T033-T034 (toolbar buttons) can be parallel
- T035-T036 (handlers) depends on T031-T034
- T037 (keyboard shortcut) depends on T031-T032
- T038 (renderElement) depends on T031
- T039 (renderer update) can be parallel with T033-T038

**Polish Phase**:

- T040-T044 (stories, optional buttons) can all run in parallel [P]
- T045-T051 (verification, styling, validation) can run in parallel once T040-T044 complete
- T052-T053 (documentation) must be last

### Parallel Opportunities

- **Setup tasks**: T002, T003 can run in parallel [P]
- **Foundational tasks**: T005, T006 can run in parallel after T004 [P]
- Once Foundational phase completes, all three user stories can be developed in parallel by different team members:
  - Developer A: User Story 1 (T011-T023)
  - Developer B: User Story 2 (T024-T030)
  - Developer C: User Story 3 (T031-T039)
- Within each story, tasks marked [P] can run in parallel
- Polish tasks T040-T044 can all run in parallel [P]

---

## Parallel Example: User Story 1

```bash
# Launch all plugins and utilities in parallel (no dependencies):
Task: "Create withFormatting Slate plugin in packages/client/src/components/RichText/plugins/withFormatting.ts"
Task: "Create serialization utilities in packages/client/src/components/RichText/utils/serialization.ts"
Task: "Create character count hook in packages/client/src/components/RichText/utils/characterCount.ts"
Task: "Create validation utilities in packages/client/src/components/RichText/utils/validation.ts"

# After plugins complete, toolbar can be built:
Task: "Create RichTextToolbar component with Bold, Italic, Underline buttons"

# After toolbar and plugins complete, editor can be assembled:
Task: "Create RichTextEditor component with Slate/Editable setup"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (text formatting)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Can format text bold/italic/underline
   - Character count works
   - Save/load preserves formatting
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
   - Case managers can format text in descriptions
3. Add User Story 2 → Test independently → Deploy/Demo
   - Case managers can also create lists
4. Add User Story 3 → Test independently → Deploy/Demo
   - Case managers can also add links and headings
5. Polish phase → Final improvements and verification
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together (T001-T010)
2. Once Foundational is done (after T010):
   - Developer A: User Story 1 (T011-T023) - Text formatting
   - Developer B: User Story 2 (T024-T030) - Lists
   - Developer C: User Story 3 (T031-T039) - Links & Headings
3. Stories complete and integrate independently
4. Team completes Polish phase together (T040-T053)

---

## Notes

- [P] tasks = different files, no dependencies on incomplete work
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Tests REQUIRED per constitution Section III - test tasks follow TDD workflow (write first, ensure fail, then implement)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Character limit: 10,000 chars hard limit enforced server-side
- Keyboard shortcuts don't override browser defaults (may not work if browser captures them first)
- No image/table buttons (removed from scope per clarifications)
- Strikethrough/code buttons are optional P4 priority (tasks T042-T044)
