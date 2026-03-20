# Design Context: Task

## Source

Screenshot-based design (no Figma URL)

## Inputs

- `Screenshot-Task-List-Desktop.png`: Task list page on desktop — left sidebar list panel + right details panel (inferred from CasePage pattern)
- `Screenshot-Task-List-Mobile.png`: Task list page on mobile — full-width list with navigation back to individual task
- `Screenshot-Task-View-Mobile.png`: Task detail view on mobile — shows task fields, inline editable areas, and `...` more-options menu
- `Screenshot-Create-Task-Desktop.png`: Task creation form on desktop — form panel inside the split layout
- `Screenshot-Create-Task-Mobile.png`: Task creation form on mobile — full-width create form

## Observed Facts

### Navigation

- A new nav icon for "Tasks" is needed alongside Cases, Users, Customers in the `MenuList`
- Desktop: icon-only vertical sidebar (`lg:fixed left-0`)
- Mobile: horizontal tab-style nav bar at the top

### Task List (desktop + mobile)

- Narrow left panel (~200px on desktop) with a scrollable list of tasks, matching `CaseList` width
- A "Create Task" button at the top of the list panel (same position and secondary variant as `CaseList`'s "Create Case" button)
- Each list item shows task title and a secondary data point (e.g., status badge or due date)
- Active item has a highlighted background (`bg-[#bcecef]` based on existing patterns)
- Loading skeleton rows during fetch
- Empty state with contextual message when no tasks exist
- Error state with retry button when fetch fails

### Task Detail View (desktop + mobile)

- Header area with editable title (`EditableTitle`), status selector (inline dropdown), and `...` more-options menu in the top-right
- `...` menu contains "Delete" option with a Trash icon
- Delete triggers a `ConfirmationDialog` before proceeding
- On desktop: two-column layout — main content area (title, description, comments/notes) + right essential details sidebar (~200px)
- On mobile: single-column stacked layout
- Essential Details sidebar/accordion includes: priority (EditableSelect), assignee user (EditableSelect), related case (EditableSelect or read-only link), due date (EditableDate)
- Description region uses `EditableTextarea`

### Create Task Form

- Full form with fields: title (Input), description (Textarea), case (Select — required), assignee (Select — optional), priority (Select, default MEDIUM), due date (date Input — optional)
- Form validation: title and caseId are required; shows inline error messages on blur
- Cancel (or navigate-back) and Save buttons
- On success, navigates to new task detail page (`/tasks/:id`)

### Related Tasks on Cases Page

- A new accordion section in `CaseEssentialDetails` or alongside it, titled "Related Tasks"
- Uses `RelationshipManagerAccordion` (or a wrapper) to list tasks by title + status
- Each task item links to `/tasks/:id`
- Has an "Add Task" button in the accordion footer that navigates to `/tasks/new?caseId=...`

## Assumptions

- **Task–Case relationship**: Tasks belong to exactly one Case (based on "Showing related Tasks on the cases page"). A `caseId` foreign key on Task is required.
- **Task–User relationship**: Tasks may be optionally assigned to a User (`assignedTo`), same nullable pattern as `Case.assignedTo`.
- **Task status enum**: Visible statuses are assumed to mirror or subset `CaseStatus` — proposed values: `TO_DO`, `IN_PROGRESS`, `COMPLETED`.
- **Task priority enum**: Mirrors `CasePriority`: `LOW`, `MEDIUM`, `HIGH`, `URGENT`.
- **Due date field**: A task detail screenshot filename implies a date field is present; assumed optional `dueDate`.
- **No comments section**: There is no `Screenshot-Task-Comments` screenshot; comments are assumed not part of the initial Task feature (unlike `CaseComments`).
- **Route pattern**: `/tasks/`, `/tasks/:id`, `/tasks/new` — mirrors `/cases/`, `/cases/:id`, `/cases/new`.
- **Desktop auto-select**: On desktop when navigating to `/tasks/` with no ID, the app auto-selects the first task (mirrors `CasePage` redirect behavior).
- **Mobile list-first**: On mobile, `/tasks/` shows the list; tapping a task navigates to `/tasks/:id`.
- **Nav icon**: A lucide icon appropriate for tasks (e.g., `CheckSquare` or `ClipboardList`) will be added to `App.tsx`'s `menuItems`.
- **RelatedTasksAccordion placement**: Added alongside `RelatedCasesAccordion` in `CaseEssentialDetails` (or as a sibling in `CaseDetails`), using the same `RelationshipManagerAccordion` pattern.
- **Task title uniqueness**: Not enforced — titles are free-form strings.
- **Optimistic updates**: Follow the same pattern used in `CaseInformation` and `CaseEssentialDetails` (cancel, snapshot, setData, rollback on error).

## Open Questions

1. **Task–Case cardinality**: Can a task belong to zero cases (standalone task), or is a case always required? Screenshots show tasks from the Cases page context — assumed required, but may be optional.
2. **Task list grouping**: Does the task list on the Tasks page show all tasks globally, or is it pre-filtered by the currently-logged-in user's assigned tasks?
3. **Visible status values**: Are there any statuses beyond TO_DO / IN_PROGRESS / COMPLETED? Screenshots may show additional options.
4. **Is there a priority visible in the task list item?** Desktop screenshot may show a priority indicator (color badge/dot) in list rows.
5. **Due date format**: Is the due date displayed as relative ("in 3 days") or absolute ("Apr 5, 2026")?
6. **"Add Task" quick-add from case page**: Does the accordion footer go to a standalone create page pre-filled with `caseId`, or is it an inline quick-create form?
7. **Task list sort order**: Newest first? By due date? By status?
8. **Edit vs. read-only on task view**: Is status the only inline-editable select in the header, or are there others (priority also in header)?
9. **Who sees all tasks?**: Global list (all agents) vs. filtered (only assigned to me)?
10. **Does the Create Task form include a quantity / effort field?** Not standard in case management but occasionally present.
