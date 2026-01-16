# Feature Specification: Inline Editable Components

**Feature Branch**: `004-inline-edit-components`  
**Created**: 2026-01-14  
**Status**: Draft  
**Input**: User description: "Build inline editable components for case management UI"

---

## Overview

Create a comprehensive library of inline editable components that allow users to edit field values directly in place without navigating to separate edit forms. These components will replace the existing `EditableSelect` and `EditableTitle` components with a more flexible, composable architecture built around a shared `BaseEditable` foundation.

---

## Design References

### Overview

| Component | Figma Link | Key Visual Requirements |
|-----------|------------|------------------------|
| Inline Editing (All Components) | [Figma](https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/branch/mPCNrycLkhncmjlVoYTBzT/Carton-Case-Management?node-id=1109-12982&m=dev) | Complete component library showing all variants |
| EditableField (Base) | [Figma](https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/branch/mPCNrycLkhncmjlVoYTBzT/Carton-Case-Management?node-id=1252-9022&m=dev) | Rest state: label (12px gray-950) + content (14px). Hover/Interest state: gray-200 background on content area |

### Individual Component Designs

| Component | Figma Link | Node ID | Key Visual Requirements |
|-----------|------------|---------|------------------------|
| EditableText | [Figma](https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/branch/mPCNrycLkhncmjlVoYTBzT/Carton-Case-Management?node-id=1261-9396&m=dev) | 1261-9396 | 3 states (Rest/Hover/Edit). Edit: Input (36px height, 8px radius) + check/x icon buttons (36x36px ghost buttons) |
| EditableSelect | [Figma](https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/branch/mPCNrycLkhncmjlVoYTBzT/Carton-Case-Management?node-id=1065-13212&m=dev) | 1065-13212 | 3 states (Rest/Hover/Edit). Edit: Select with chevron-down icon (16px). Auto-save on selection (no check/x buttons) |
| EditableDate | [Figma](https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/branch/mPCNrycLkhncmjlVoYTBzT/Carton-Case-Management?node-id=1252-8939&m=dev) | 1252-8939 | 3 states (Rest/Hover/Edit). Edit: DatePicker input with calendar icon (20px) on left. Auto-save on selection |
| EditableNumber | [Figma](https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/branch/mPCNrycLkhncmjlVoYTBzT/Carton-Case-Management?node-id=1252-9102&m=dev) | 1252-9102 | 3 states (Rest/Hover/Edit). Edit: Input (36px height) + check/x icon buttons. No decoration icons |
| EditableCurrency | [Figma](https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/branch/mPCNrycLkhncmjlVoYTBzT/Carton-Case-Management?node-id=1252-9136&m=dev) | 1252-9136 | 3 states (Rest/Hover/Edit). Edit: Input with $ icon (20px) on left + check/x buttons. Rest displays "$99.99" |
| EditablePercent | [Figma](https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/branch/mPCNrycLkhncmjlVoYTBzT/Carton-Case-Management?node-id=1252-9231&m=dev) | 1252-9231 | 3 states (Rest/Hover/Edit). Edit: Input with % icon (20px) on right + check/x buttons. Rest displays "15%" |
| EditableTextarea | [Figma](https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/branch/mPCNrycLkhncmjlVoYTBzT/Carton-Case-Management?node-id=853-1802&m=dev) | 853-1802 | 2 states (Rest/Edit). No Hover state. Edit: Resizable textarea (min-height 68px) + Save/Cancel text buttons. Save button: teal-600 (#00848b). Cancel button: white bg, gray-700 text |

### Figma to Code Terminology Mapping

**Naming Convention**: Figma designs use "InlineEdit*" naming while code uses "Editable*" naming for consistency with React component conventions.

| Figma Name | Code Name | Notes |
|------------|-----------|-------|
| InlineEditTextfield | EditableText | Single-line text |
| InlineEditDropdown | EditableSelect | Dropdown select |
| InlineEditDate | EditableDate | Date picker |
| InlineEditNumber | EditableNumber | Numeric input |
| InlineEditCurrency | EditableCurrency | Currency with $ prefix |
| InlineEditPercent | EditablePercent | Percent with % suffix |
| InlineEditTextarea | EditableTextarea | Multi-line text |
| InlineEditTitle | EditableTitle | Large heading text |
| EditableField (Base) | BaseEditable | Abstract foundation |

### State & Behavior Summary

| Variant | States | Edit UI | Save Behavior |
|---------|--------|---------|---------------|
| EditableField (Base) | Rest, Hover | N/A (abstract) | N/A |
| InlineEditTextfield | Rest, Hover, Edit | Text input + check/x icons | Explicit save |
| InlineEditDropdown | Rest, Hover, Edit | Select dropdown | Auto-save on selection |
| InlineEditDate | Rest, Hover, Edit | Date picker | Auto-save on selection |
| InlineEditNumber | Rest, Hover, Edit | Numeric input + check/x icons | Explicit save |
| InlineEditCurrency | Rest, Hover, Edit | Input with $ prefix + check/x icons | Explicit save |
| InlineEditPercent | Rest, Hover, Edit | Input with % suffix + check/x icons | Explicit save |
| InlineEditTextarea | Rest, Edit | Multi-line textarea + Save/Cancel buttons | Explicit save |
| InlineEditTitle | Rest, Hover, Edit | Large heading input + check/x icons | Explicit save |

### Shared Visual Specifications (from Figma)

**Typography**:
- Label: 12px, Inter Regular, gray-950 (#192627), letter-spacing 0.18px, line-height 16px
- Content: 14px, Inter Regular, foreground (#020617), letter-spacing 0.07px, line-height 21px
- Textarea label: 16px, Inter Semibold, gray-950 (#192627)

**Spacing**:
- Gap between label and content: 4px (semantic/2xs)
- Content area padding: 4px horizontal, 2px vertical
- Content area border-radius: 4px
- Input height: 36px (min-height)
- Input padding: 12px horizontal, 7.5px vertical
- Input border-radius: 8px (semantic/rounded-lg)

**Colors**:
- Rest state content area: transparent
- Hover/Interest state content area: gray-200 (#dfe2e2)
- Input background: white
- Input border: gray-200 (#e2e8f0) or gray-300 (#cbd5e1)
- Save button: teal-600 (#00848b) background, white text
- Cancel button: white background, gray-700 (#4c5b5c) text
- Icon buttons (check/x): ghost (transparent), 36x36px, 8px padding

**Icons**:
- Check icon: Lucide `check` - for save/confirm action
- X icon: Lucide `x` - for cancel action  
- Chevron-down: Lucide `chevron-down` - for select dropdown
- Calendar: Lucide `calendar` - for date picker
- Dollar-sign: Lucide `dollar-sign` - for currency prefix
- Percent: Lucide `percent` - for percent suffix

**Shadows**:
- Input shadow: 0px 1px 2px rgba(0,0,0,0.05) (shadow-xs)

---

## User Scenarios & Testing

### User Story 1 - Edit Field Values In Place (Priority: P1)

As a case worker viewing case details, I want to edit field values directly on the page without navigating away, so I can quickly update information while maintaining context.

**Why this priority**: Core functionality - all other inline editing capabilities depend on this working correctly.

**Independent Test**: Can be tested by clicking any editable field, modifying its value, and confirming the change persists.

**Acceptance Scenarios**:

1. **Given** a case detail page with editable fields in rest state, **When** I hover over an editable field, **Then** the field shows visual feedback (gray background) indicating it is editable
2. **Given** a field in hover/interest state, **When** I click the field or press Enter, **Then** the field enters edit mode showing the appropriate input control
3. **Given** a field in edit mode, **When** I modify the value and save, **Then** the new value is persisted and displayed in rest state
4. **Given** a field in edit mode, **When** I press Escape or click cancel, **Then** the field returns to rest state with original value unchanged

---

### User Story 2 - Keyboard-Accessible Editing (Priority: P1)

As a user navigating with keyboard, I want to edit fields using only keyboard controls, so I can efficiently update information without using a mouse.

**Why this priority**: Accessibility is a core requirement, not an enhancement.

**Independent Test**: Can be tested by tabbing through fields and using Enter/Escape to enter/exit edit mode.

**Acceptance Scenarios**:

1. **Given** an editable field, **When** I Tab to focus on it, **Then** the field enters interest state (visual feedback)
2. **Given** a focused field in interest state, **When** I press Enter, **Then** the field enters edit mode with the input focused
3. **Given** a text field in edit mode, **When** I press Enter, **Then** the value is saved and field exits edit mode
4. **Given** any field in edit mode, **When** I press Escape, **Then** changes are discarded and field exits edit mode

---

### User Story 3 - Read-Only Mode (Priority: P2)

As a system administrator, I want certain fields to be read-only based on user permissions, so unauthorized users cannot modify protected data.

**Why this priority**: Important for data integrity but depends on core editing working first.

**Independent Test**: Can be tested by rendering a field with `readonly={true}` and verifying it cannot be edited.

**Acceptance Scenarios**:

1. **Given** a field with `readonly={true}`, **When** I hover over it, **Then** no visual feedback is shown (stays in rest state)
2. **Given** a field with `readonly={true}`, **When** I click on it, **Then** nothing happens (field does not enter edit mode)
3. **Given** a field with `readonly={true}`, **When** I Tab to focus on it, **Then** the field is skipped in tab order

---

### User Story 4 - Loading State Feedback (Priority: P2)

As a user saving a field value, I want to see loading feedback while the save is in progress, so I know my change is being processed.

**Why this priority**: Important for UX but core editing must work first.

**Independent Test**: Can be tested by saving a field with a delayed API call and verifying loading indicator appears.

**Acceptance Scenarios**:

1. **Given** a field in edit mode, **When** I save a value and the save is in progress, **Then** a loading indicator is shown
2. **Given** a field with save in progress, **When** the save completes successfully, **Then** the field exits edit mode showing the new value
3. **Given** a field with save in progress, **When** the save fails, **Then** appropriate error feedback is shown

---

### User Story 5 - Controlled State Mode (Priority: P3)

As a developer building forms, I want to programmatically control whether a field is in edit mode, so I can build "always editing" create forms or coordinate multiple fields.

**Why this priority**: Advanced use case for developers, not end-user facing.

**Independent Test**: Can be tested by passing `isEditing={true}` and verifying field renders in edit mode.

**Acceptance Scenarios**:

1. **Given** a field with `isEditing={true}`, **When** rendered, **Then** the field displays in edit mode immediately
2. **Given** a field with controlled state, **When** edit state changes, **Then** `onEditingChange` callback is invoked with new state

---

### Edge Cases

- What happens when a field value is empty? → Display placeholder text in rest state
- How does the system handle very long text values? → Text should truncate with ellipsis in rest state
- What happens if user clicks outside while in edit mode? → Field should cancel and return to rest state
- How are concurrent edits handled? → Show optimistic update, handle API errors gracefully
- What happens if the save callback throws an error? → Keep field in edit mode, show error state

---

## Requirements

### Functional Requirements

- **FR-001**: System MUST provide a `BaseEditable` component that manages the three states: rest, interest, and edit
- **FR-002**: System MUST transition to interest state on mouse hover over the content area
- **FR-003**: System MUST transition to interest state on keyboard focus
- **FR-004**: System MUST transition to edit state when user clicks or presses Enter in interest state
- **FR-005**: System MUST render the edit mode content provided via `renderEditMode` prop when in edit state
- **FR-006**: System MUST pass `value`, `onSave`, `onCancel`, and `inputRef` to the edit mode render function
- **FR-007**: System MUST auto-focus the input element (via `inputRef`) when entering edit state
- **FR-008**: System MUST support `readonly` prop that locks the component in rest state
- **FR-009**: System MUST support controlled state mode via `isEditing` and `onEditingChange` props
- **FR-010**: System MUST display saving state (spinner beside value) while `onSave` Promise is pending
- **FR-011**: System MUST inherit width from parent container (no fixed width)

### Validation Requirements

- **FR-028**: Each editable component MUST accept an optional `validate` prop for consumer-provided validation (e.g., Zod schema or function)
- **FR-029**: System MUST run validation before calling `onSave`; if validation fails, the save MUST be blocked
- **FR-030**: System MUST display inline error message below the input when validation fails
- **FR-031**: System MUST clear the error message when the user modifies the input value
- **FR-032**: System MUST keep the field in edit mode when validation fails (not revert to rest state)

### Save State & Error Handling Requirements

- **FR-033**: When save is initiated, system MUST exit edit mode and display rest-like state with a small spinner beside the value
- **FR-034**: The `onSave` callback MUST return `Promise<void>` to support async save operations
- **FR-035**: On successful save (promise resolves), system MUST remove spinner and remain in rest state with new value
- **FR-036**: On save failure (promise rejects), system MUST re-enter edit mode with the attempted value pre-filled
- **FR-037**: On save failure, system MUST display the error message (from rejected promise) below the input
- **FR-038**: System MUST catch rejected promises from `onSave` and extract `Error.message` for display

### Component Requirements

- **FR-012**: System MUST provide `EditableText` component for single-line text editing with check/x icon controls
- **FR-013**: System MUST provide `EditableTextarea` component for multi-line text with Save/Cancel button controls
- **FR-014**: System MUST provide `EditableSelect` component with auto-save on selection behavior
- **FR-015**: System MUST provide `EditableDate` component with date picker and auto-save behavior
- **FR-016**: System MUST provide `EditableNumber` component for numeric input with check/x icon controls
- **FR-017**: System MUST provide `EditableCurrency` component with $ prefix decoration
- **FR-018**: System MUST provide `EditablePercent` component with % suffix decoration
- **FR-019**: System MUST provide `EditableTitle` component for large heading text editing

### Visual Requirements (from Figma)

- **FR-020**: Label text MUST be 12px, color gray-950 (#192627)
- **FR-021**: Content text MUST be 14px, color foreground (#020617)
- **FR-022**: Interest state MUST show gray-200 (#dfe2e2) background on content area
- **FR-023**: Content area MUST have 4px horizontal padding, 2px vertical padding, 4px border radius
- **FR-024**: Gap between label and content MUST be 4px

### Migration Requirements

- **FR-025**: New components MUST replace existing `EditableSelect` in `packages/client/src/components/common/EditableSelect`
- **FR-026**: New components MUST replace existing `EditableTitle` in `packages/client/src/components/common/EditableTitle`
- **FR-027**: All existing usages of old components MUST be migrated to new components

---

### Key Entities

- **BaseEditable**: Foundation component managing state machine (rest → interest → edit), keyboard/mouse interactions, and composition with edit mode components
- **EditableField Variants**: Specialized components (Text, Textarea, Select, Date, Number, Currency, Percent, Title) that compose BaseEditable with specific edit mode UIs
- **EditableState**: The three possible states: `rest` (default display), `interest` (hover/focus feedback), `edit` (input active)

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can edit any inline editable field and save changes in under 5 seconds
- **SC-002**: All editable fields are fully keyboard accessible (Tab, Enter, Escape)
- **SC-003**: Visual state transitions (rest → interest → edit) occur within 100ms of user action
- **SC-004**: 100% of existing `EditableSelect` and `EditableTitle` usages are migrated to new components
- **SC-005**: Component library provides all 8 variants identified in Figma designs
- **SC-006**: All components pass accessibility audit (WCAG 2.1 AA)

---

## Assumptions

- The existing Shadcn UI components (Input, Select, Button, etc.) will be used as building blocks for edit mode UIs
- The teal color (#00848b) used for Save buttons matches the existing design system
- Date picker will use the existing DatePicker component from `packages/client/src/components/ui/date-picker.tsx`
- Check and X icons will use Lucide icons (already in the project)

---

## Clarifications

### Session 2026-01-14

- Q: How should validation be handled for inline editable fields? → A: Components accept a `validate` prop (e.g., Zod schema) from the consumer; validation runs before save, displaying inline error if invalid
- Q: How should saving state and save errors be displayed? → A: Saving shows rest-like state with spinner; on error, re-enter edit mode with attempted value and show error below input
- Q: How to communicate async save errors back to component? → A: `onSave` returns `Promise<void>`; rejected promise with Error message is caught and displayed
- Q: Should error messages cause layout shift? → A: Yes, inline text below input is acceptable in edit mode

---

## Out of Scope

- Inline editing for complex nested data structures
- Drag-and-drop reordering of editable fields
- Undo/redo functionality for field edits
- Batch editing of multiple fields simultaneously
- Real-time collaborative editing (multiple users editing same field)
