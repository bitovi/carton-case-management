# Feature Specification: Rich Text Case Description

**Feature Branch**: `003-rich-text-description`  
**Created**: December 30, 2025  
**Status**: Draft  
**Input**: User description: "Update the case description field to support rich text with formatting toolbar resembling the Figma design. The case should save the structured rich text content and render it appropriately in the frontend."

## Clarifications

### Session 2025-12-30

- Q: Should image upload and table insertion buttons be included in this feature, or deferred to future work? → A: Remove image and table buttons entirely from this feature
- Q: How should keyboard shortcuts behave when they conflict with browser shortcuts? → A: Keyboard shortcuts work but don't prevent browser defaults (e.g., Ctrl+B opens bookmarks if browser captures it first)
- Q: When should legacy plain text descriptions be converted to rich text format? → A: no legacy support, db is fresh
- Q: Should the 10,000 character limit be a hard limit, soft warning, or just a testing boundary? → A: Hard limit: Block saving if description exceeds 10,000 characters
- Q: Should strikethrough, code block, and inline code formatting be fully implemented or treated as lower priority? → A: Include buttons but prioritize after P1-P3; implement if time permits

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Format Case Description Text (Priority: P1)

Case managers need to format case descriptions with basic text styling (bold, italic, underline) to emphasize important information, highlight critical details, and improve readability for team members reviewing cases.

**Why this priority**: This is the core value of rich text editing. Without basic formatting, users cannot differentiate important information, making case descriptions harder to scan and understand. This directly impacts team efficiency and case handling speed.

**Independent Test**: A case manager can create or edit a case description, select text, apply formatting (bold, italic, underline), save the changes, and see the formatted text preserved when viewing the case later or on different devices.

**Acceptance Scenarios**:

1. **Given** a case manager is editing a case description, **When** they select text and click the Bold button, **Then** the selected text appears bold in the editor
2. **Given** a case manager has formatted text in the description editor, **When** they click Save, **Then** the formatting is preserved when the case is viewed later
3. **Given** a case description contains formatted text, **When** the case is viewed by any team member, **Then** all formatting (bold, italic, underline) is displayed correctly

---

### User Story 2 - Create Structured Lists (Priority: P2)

Case managers need to organize information using bulleted and numbered lists to create structured case notes, outline action items, or list evidence and documentation in a clear, scannable format.

**Why this priority**: Lists significantly improve information organization and readability. After basic text formatting, lists are the most commonly used feature for structured documentation in case management scenarios.

**Independent Test**: A case manager can insert bulleted or numbered lists into a case description, add multiple items, nest lists if needed, save the description, and see the list structure maintained when viewing the case.

**Acceptance Scenarios**:

1. **Given** a case manager is editing a description, **When** they click the bullet list button and type items, **Then** each line appears as a bulleted list item
2. **Given** a case manager is editing a description, **When** they click the numbered list button and type items, **Then** each line appears as a numbered list item with sequential numbering
3. **Given** a case description contains lists, **When** the case is saved and reopened, **Then** all list formatting and structure is preserved

---

### User Story 3 - Insert Links and Format Headings (Priority: P3)

Case managers need to add hyperlinks to external resources and use heading levels to structure lengthy case descriptions, creating clearer sections for complex cases with multiple topics or phases.

**Why this priority**: While valuable for complex cases, links and headings are less frequently needed than basic formatting and lists. They provide enhanced organization for detailed cases but aren't essential for basic case documentation.

**Independent Test**: A case manager can select text, click the link button, enter a URL, see the link formatted correctly, and verify the link opens correctly when clicked. They can also format text as Heading 2 to create section breaks in long descriptions.

**Acceptance Scenarios**:

1. **Given** a case manager is editing a description, **When** they select text, click the link button, and enter a URL, **Then** the text becomes a clickable hyperlink
2. **Given** a case description contains a link, **When** a team member views the case and clicks the link, **Then** the link opens in a new tab to the correct URL
3. **Given** a case manager is editing a description, **When** they select the Heading 2 format from the dropdown, **Then** the text is formatted as a prominent heading

---

### Edge Cases

- What happens when a case manager pastes formatted text from external sources (Word, email, websites)?
  - System should strip unsupported formatting and preserve only supported styles (bold, italic, underline, lists, links, headings)
  - System should sanitize pasted content to prevent malicious code injection
- What happens when the rich text content becomes very large?
  - System must enforce a hard limit of 10,000 characters and prevent saving beyond this limit
  - Editor should display character count and show error message when limit is reached
  - Editor should remain responsive during typing and formatting operations within the limit
- What happens when viewing a case with rich text on mobile devices?
  - Formatted text should display correctly and be readable on small screens
  - All formatting (bold, italic, lists, links) should render properly in mobile view
- What happens when a user tries to save a completely empty description?
  - System should prevent saving empty descriptions and show a validation message
- What happens when multiple users edit the same case description simultaneously?
  - Last save wins (standard optimistic locking behavior)
  - Users should see updated content when they refresh or reopen the case

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST provide a rich text editor for case descriptions with a formatting toolbar
- **FR-002**: System MUST support the following text formatting options: Bold, Italic, Underline, and text alignment (left align only based on Figma design)
- **FR-003**: System MUST support the following list formats: Bullet lists and Numbered lists
- **FR-004**: System MUST support Heading 2 format from a heading dropdown selector
- **FR-005**: System MUST support inserting hyperlinks with clickable link functionality
- **FR-006**: System MAY provide optional buttons for: Strikethrough, Code block, and Code formatting (inline). These are lower priority features to implement after P1-P3 user stories if time permits
- **FR-007**: System MUST store the rich text content in a structured format that preserves all formatting information
- **FR-008**: System MUST render saved rich text content with all formatting preserved
- **FR-009**: System MUST sanitize user input to prevent XSS attacks and malicious content injection
- **FR-010**: System MUST validate that case descriptions are not empty before saving
- **FR-011**: System MUST enforce a maximum description length of 10,000 characters and prevent saving when exceeded
- **FR-012**: System MUST display the rich text editor in place of the current textarea when editing case descriptions
- **FR-013**: System MUST maintain the existing Save and Cancel button functionality with the rich text editor
- **FR-014**: System MUST display read-only formatted content when not in edit mode
- **FR-015**: System MUST support keyboard shortcuts for common formatting operations (Ctrl/Cmd+B for bold, Ctrl/Cmd+I for italic, Ctrl/Cmd+U for underline) when the editor is focused, without overriding browser default shortcuts. Mobile users rely on toolbar buttons exclusively
- **FR-016**: System MUST handle pasted content by stripping unsupported formatting while preserving supported styles

### Key Entities _(include if feature involves data)_

- **Case**: The Case entity's description field will store a structured representation of rich text content
- **Rich Text Content**: Represents the formatted text structure including text nodes, formatting marks (bold, italic, underline), list structures (bulleted/numbered), headings, links, and other supported elements stored in a structured format

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Case managers can format text (bold, italic, underline) in under 5 seconds using toolbar buttons or keyboard shortcuts
- **SC-002**: Case descriptions with rich text formatting render correctly within 500ms of page load
- **SC-003**: All case descriptions display without errors or data loss
- **SC-004**: Users can paste formatted content from external sources without system errors or performance degradation
- **SC-005**: Rich text editor maintains responsive performance (no lag during typing) with descriptions up to 10,000 characters
- **SC-006**: Case descriptions with formatting are readable and properly formatted on mobile devices without horizontal scrolling
