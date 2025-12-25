# Feature Specification: Case Details View

**Feature Branch**: `002-case-details`  
**Created**: December 24, 2025  
**Status**: Draft  
**Input**: User description: "Create a case details component that will load on the base route following based on this figma design"  
**Figma Design**: https://www.figma.com/design/7QW0kJ07DcM36mgQUJ5Dtj/Carton-Case-Management?node-id=9-825

## User Scenarios & Testing _(mandatory)_

### User Story 1 - View Case Details (Priority: P1)

Case workers need to view complete case information including the case description, timeline of comments, and essential metadata when they access a case from the case list.

**Why this priority**: This is the core functionality that enables case workers to understand case context and make informed decisions. Without this, users cannot perform their primary job function.

**Independent Test**: Can be fully tested by navigating to a case and verifying all case details (header, description, comments, metadata) are displayed correctly. Delivers immediate value by allowing users to read case information.

**Acceptance Scenarios**:

1. **Given** a user is viewing the case list, **When** they click on a case, **Then** the case details view displays the case header with case type and ID
2. **Given** the case details view is loaded, **When** the page renders, **Then** the case description section shows the full case narrative
3. **Given** the case details view is loaded, **When** the page renders, **Then** the essential details panel shows customer name, date opened, assigned user, and last updated timestamp
4. **Given** the case has existing comments, **When** the case details view loads, **Then** all comments are displayed in chronological order with author and timestamp

---

### User Story 2 - Navigate Between Cases (Priority: P2)

Case workers need to quickly switch between cases using the sidebar case list without losing their place in the application.

**Why this priority**: Improves workflow efficiency by allowing quick case-to-case navigation, which is a common task for case workers handling multiple cases.

**Independent Test**: Can be tested by clicking different cases in the sidebar and verifying the main content area updates to show the selected case details.

**Acceptance Scenarios**:

1. **Given** the case details view is displayed, **When** the user clicks a different case in the sidebar, **Then** the main content area updates to show the new case details
2. **Given** multiple cases are listed in the sidebar, **When** a case is selected, **Then** the sidebar highlights the currently active case

---

### User Story 3 - Add Case Comments (Priority: P3)

Case workers need to add comments to cases to document actions, decisions, or communicate with team members about case progress.

**Why this priority**: Enables collaboration and documentation but is secondary to viewing existing case information. Users can initially work without adding comments.

**Independent Test**: Can be tested by typing a comment in the comment input field and verifying it appears in the comments list after submission.

**Acceptance Scenarios**:

1. **Given** the case details view is loaded, **When** the user types text in the "Add a comment" field and submits, **Then** the new comment appears in the comments section with the current user's name and timestamp
2. **Given** a comment is successfully added, **When** the page updates, **Then** the comment input field is cleared and ready for a new comment

---

### Edge Cases

- What happens when a case has no comments yet?
- What happens when the case description is very long (multiple paragraphs)?
- How does the system handle cases with missing metadata (e.g., no assigned user)?
- What happens when comment timestamps are from different time zones?
- How does the sidebar handle a very long list of cases (scrolling behavior)?
- What happens when the user's name is very long?
- How does the system behave on smaller screen sizes?

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST display a case details view on the base route that shows case header, description, comments, and essential details
- **FR-002**: System MUST display the case type name and case ID in the header section
- **FR-003**: System MUST display the full case description in a dedicated section
- **FR-004**: System MUST display a sidebar list of cases with case type names and case IDs
- **FR-005**: System MUST display essential case metadata including customer name, date opened, assigned user, and last updated date
- **FR-006**: System MUST display all case comments in chronological order with author name and timestamp
- **FR-007**: System MUST provide a text input area for adding new comments
- **FR-008**: System MUST display the main navigation bar with the application name and user avatar
- **FR-009**: Users MUST be able to click on cases in the sidebar to navigate between different case details
- **FR-010**: System MUST visually indicate which case is currently active in the sidebar
- **FR-011**: System MUST allow users to submit new comments that are then displayed in the comments list
- **FR-012**: System MUST display comment timestamps in a consistent, readable format

### Key Entities

- **Case**: Represents a case management record with properties including case ID, case type, description, customer name, date opened, assigned user, last updated date, and a collection of comments
- **Comment**: Represents a comment on a case with properties including comment text, author name, and timestamp
- **User**: Represents a case worker with properties including name and avatar

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Users can view complete case details within 1 second of clicking a case in the sidebar
- **SC-002**: 100% of case metadata fields (customer name, date opened, assigned user, last updated) are displayed when present
- **SC-003**: Users can successfully add a comment and see it appear in the comments list within 2 seconds
- **SC-004**: The interface correctly displays cases with 0 to 100+ comments without performance degradation
