# Proposed API: Task Feature

## Source

Screenshot-based design — 5 screenshots (Task List Desktop, Task List Mobile, Task View Mobile, Create Task Desktop, Create Task Mobile)

## Summary

A Task is a work item that belongs to a Case. Tasks have their own top-level page (list + detail), a creation form, inline editing on the detail page, delete with confirmation, and a "Related Tasks" accordion exposed in the Case detail view. The feature follows the exact same split-pane pattern established by Cases, Users, and Customers.

## Confidence

- **High-confidence decisions** (direct match with existing code patterns):
  - Split-pane layout (list + detail) — mirrors `CasePage`
  - `TaskList` component with "Create Task" secondary button
  - `TaskDetails` with inline-editable title, description, status
  - `TaskEssentialDetails` sidebar with priority/assignee/case selects
  - Delete in `MoreOptionsMenu` → `ConfirmationDialog`
  - `RelatedTasksAccordion` on the Case page uses `RelationshipManagerAccordion`
  - Optimistic updates pattern (cancel → snapshot → setData → rollback)
  - Route pattern `/tasks/`, `/tasks/:id`, `/tasks/new`
  - Nav icon added to `menuItems` in `App.tsx`

- **Assumption-based decisions**:
  - Task status enum values (TO_DO, IN_PROGRESS, COMPLETED)
  - Task priority mirrors CasePriority
  - `caseId` is required on Task
  - No comments section in initial scope
  - Due date is optional
  - Global task list (not filtered by assignee) by default

---

## Recommended Component Structure

```
packages/client/src/
├── pages/
│   ├── TaskPage/                        # Route container (list + detail split pane)
│   │   ├── TaskPage.tsx
│   │   ├── TaskPage.stories.tsx
│   │   └── index.ts
│   └── CreateTaskPage/                  # Standalone create form page
│       ├── CreateTaskPage.tsx
│       ├── CreateTaskPage.stories.tsx
│       └── index.ts
│
└── components/
    ├── TaskList/                         # Left-panel sidebar list
    │   ├── TaskList.tsx
    │   ├── TaskList.test.tsx
    │   ├── TaskList.stories.tsx
    │   ├── types.ts
    │   └── index.ts
    │
    ├── TaskDetails/                      # Right-panel detail area
    │   ├── TaskDetails.tsx
    │   ├── TaskDetails.test.tsx
    │   ├── TaskDetails.stories.tsx
    │   ├── index.ts
    │   └── components/
    │       ├── TaskInformation/          # Header: title, description, status, delete
    │       │   ├── TaskInformation.tsx
    │       │   ├── TaskInformation.test.tsx
    │       │   ├── TaskInformation.stories.tsx
    │       │   ├── types.ts
    │       │   └── index.ts
    │       └── TaskEssentialDetails/    # Sidebar: priority, assignee, case, due date
    │           ├── TaskEssentialDetails.tsx
    │           ├── TaskEssentialDetails.test.tsx
    │           ├── TaskEssentialDetails.stories.tsx
    │           ├── types.ts
    │           └── index.ts
    │
    └── common/
        └── RelatedTasksAccordion/        # Used in CaseDetails
            ├── RelatedTasksAccordion.tsx
            ├── RelatedTasksAccordion.test.tsx
            ├── RelatedTasksAccordion.stories.tsx
            └── index.ts
```

---

## Component: TaskPage

### Props Interface

```typescript
interface TaskPageProps {}
```

A route-level container with no external props. Reads `id` from `useParams` internally.

### Behaviour

- On desktop: renders `<TaskList />` in left sidebar + either `<TaskDetails />` (when `:id` is set) or `<CreateTaskPage />` (when `id === 'new'`) in the main area
- On mobile: shows only list OR detail, never both at once
- On desktop load with no `:id`, auto-redirects to `/tasks/<first-task-id>` (mirrors `CasePage` redirect)

### Routing

| Path         | Desktop                                  | Mobile                |
| ------------ | ---------------------------------------- | --------------------- |
| `/tasks/`    | TaskList (left) + empty state (right)    | TaskList (full)       |
| `/tasks/new` | TaskList (left) + CreateTaskPage (right) | CreateTaskPage (full) |
| `/tasks/:id` | TaskList (left) + TaskDetails (right)    | TaskDetails (full)    |

---

## Component: TaskList

### Props Interface

```typescript
interface TaskListProps {
  onTaskClick?: (taskId: string) => void;
}
```

### Prop Details

| Prop          | Type     | Default   | Source Evidence                       | Notes                                          |
| ------------- | -------- | --------- | ------------------------------------- | ---------------------------------------------- |
| `onTaskClick` | function | undefined | callback pattern from `CaseListProps` | Optional; navigation is primarily via `<Link>` |

### Behaviour

- Fetches `trpc.task.list.useQuery()`
- "Create Task" button (variant `secondary`) at top navigates to `/tasks/new`
- Active item highlighted with `bg-[#bcecef]` (matched from `useParams`)
- Loading: skeleton rows (5 placeholders)
- Error: error message + Retry button
- Empty: "No tasks found" message

### Example Usage

```tsx
<TaskList />
```

---

## Component: TaskListItem (internal to TaskList)

```typescript
interface TaskListItemProps {
  task: {
    id: string;
    title: string;
    status: TaskStatus;
    dueDate?: string | null;
  };
  isActive: boolean;
}
```

Each row shows: task title (bold), status or dueDate on a second line (smaller text).

---

## Component: TaskDetails

### Props Interface

```typescript
interface TaskDetailsProps {}
```

Reads `id` from `useParams`. Orchestrates `TaskInformation` and `TaskEssentialDetails`.

### Desktop layout

```
┌──────────────────────────────────────┬──────────────────┐
│  TaskInformation (flex-1)            │ TaskEssentialDet │
│  (title, description, status)        │ (priority,       │
│                                      │  assignee, case, │
│                                      │  dueDate)        │
└──────────────────────────────────────┴──────────────────┘
```

### Mobile layout

```
TaskInformation
TaskEssentialDetails
```

---

## Component: TaskInformation

### Props Interface

```typescript
interface TaskInformationProps {
  taskId: string;
  taskData: {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    createdAt: string | Date;
  };
}
```

### Prop Details

| Prop       | Type   | Default  | Source Evidence                       | Notes                               |
| ---------- | ------ | -------- | ------------------------------------- | ----------------------------------- |
| `taskId`   | string | required | mirrors `CaseInformationProps.caseId` | Used for tRPC mutation targets      |
| `taskData` | object | required | mirrors CaseInformation data shape    | Includes title, description, status |

### Behaviour

- `EditableTitle` for task title (saves on blur/enter)
- `EditableTextarea` for description (saves on blur)
- Inline `Select` for status (`TO_DO`, `IN_PROGRESS`, `COMPLETED`) — saves on change, same as case status select
- `MoreOptionsMenu` (`...` icon, top-right) with a single `MenuItem` for "Delete" (Trash icon)
- Delete opens `ConfirmationDialog`; on confirm calls `trpc.task.delete`, invalidates list, navigates to `/tasks/`
- Optimistic updates on all mutations (cancel → snapshot → setData → rollback)

### Example Usage

```tsx
<TaskInformation taskId={taskData.id} taskData={taskData} />
```

---

## Component: TaskEssentialDetails

### Props Interface

```typescript
interface TaskEssentialDetailsProps {
  taskId: string;
  taskData: {
    id: string;
    priority: TaskPriority;
    assignedTo: string | null;
    caseId: string;
    dueDate: string | null;
  };
}
```

### Prop Details

| Prop                  | Type           | Default  | Source Evidence                      | Notes                                    |
| --------------------- | -------------- | -------- | ------------------------------------ | ---------------------------------------- |
| `taskId`              | string         | required | mirrors CaseEssentialDetails pattern | Mutation target                          |
| `taskData.priority`   | TaskPriority   | MEDIUM   | mirrors CaseEssentialDetails         | Uses `TASK_PRIORITY_OPTIONS` from shared |
| `taskData.assignedTo` | string \| null | null     | mirrors `Case.assignedTo`            | Shown as optional user select            |
| `taskData.caseId`     | string         | required | assumption — task belongs to case    | Select or read-only                      |
| `taskData.dueDate`    | string \| null | null     | inferred from screenshot name        | Uses `EditableDate`                      |

### Behaviour

- Collapsible accordion/section ("Essential Details" header with chevron) — same pattern as `CaseEssentialDetails`
- `EditableSelect` for Priority (options from `TASK_PRIORITY_OPTIONS`)
- `EditableSelect` for Assignee (users list, nullable — uses `__unassigned__` sentinel)
- `EditableSelect` for Case (cases list, required)
- `EditableDate` for Due Date (nullable)
- Uses `trpc.task.update` with optimistic updates

### Example Usage

```tsx
<TaskEssentialDetails taskId={taskData.id} taskData={taskData} />
```

---

## Component: CreateTaskPage

### Props Interface

```typescript
interface CreateTaskPageProps {}
```

Reads optional `?caseId=` query param to pre-fill the Case select when navigated from `RelatedTasksAccordion`.

### Form Fields

| Field       | Component                        | Required | Default                   |
| ----------- | -------------------------------- | -------- | ------------------------- |
| Title       | `Input` (Label + Input)          | Yes      | ''                        |
| Description | `Textarea`                       | No       | ''                        |
| Case        | `Select` (from `trpc.case.list`) | Yes      | pre-filled from `?caseId` |
| Assignee    | `Select` (from `trpc.user.list`) | No       | ''                        |
| Priority    | `Select` (TASK_PRIORITY_OPTIONS) | No       | 'MEDIUM'                  |
| Due Date    | `Input type="date"`              | No       | null                      |

### Validation

- `title`: required, non-empty string
- `caseId`: required selection
- Inline error messages appear on field blur (same `touched` + `validationErrors` pattern as `CreateCasePage`)

### Behaviour

- On success: navigate to `/tasks/${data.id}` and `trpc.task.list.invalidate()`
- Cancel navigates back with `navigate(-1)` or to `/tasks/`

### Example Usage

```tsx
<CreateTaskPage />
```

---

## Component: RelatedTasksAccordion

### Props Interface

```typescript
interface RelatedTasksAccordionProps {
  tasks: Array<{
    id: string;
    title: string;
    status: string;
    dueDate: string | null;
  }>;
  caseId: string;
}
```

### Prop Details

| Prop     | Type   | Default  | Source Evidence                            | Notes                            |
| -------- | ------ | -------- | ------------------------------------------ | -------------------------------- |
| `tasks`  | array  | required | mirrors `RelatedCasesAccordionProps.cases` | Passed from CaseEssentialDetails |
| `caseId` | string | required | needed to pre-fill create form             | Passed to "Add Task" link        |

### Behaviour

- Renders `RelationshipManagerAccordion` with `accordionTitle="Related Tasks"` and `defaultOpen={true}`
- Each item shows: task title (link to `/tasks/:id`), status as subtitle
- `onAddClick` navigates to `/tasks/new?caseId={caseId}`

### Placement

Added to `CaseEssentialDetails` alongside existing selects, or as a sibling rendered in `CaseDetails` below `CaseEssentialDetails`.

### Example Usage

```tsx
<RelatedTasksAccordion tasks={caseData.tasks} caseId={caseData.id} />
```

---

## Navigation Change: App.tsx menuItems

```typescript
import { FolderClosed, Users, Bot, CheckSquare } from 'lucide-react';

const menuItems = [
  { id: 'home', label: 'Cases', path: '/cases/', icon: <FolderClosed size={20} />, isActive: ... },
  { id: 'tasks', label: 'Tasks', path: '/tasks/', icon: <CheckSquare size={20} />, isActive: location.pathname.startsWith('/tasks') },
  { id: 'users', label: 'Users', path: '/users/', icon: <Bot size={20} />, isActive: ... },
  { id: 'customers', label: 'Customers', path: '/customers/', icon: <Users size={20} />, isActive: ... },
];
```

Routes to add:

```tsx
<Route path="/tasks/" element={<TaskPage />} />
<Route path="/tasks/:id" element={<TaskPage />} />
```

> **Note**: `TaskPage` itself renders `CreateTaskPage` inline when `id === 'new'`, so no separate `/tasks/new` route is needed in `App.tsx` (mirrors CasePage pattern).

---

## Shared Package: Types and Constants

```typescript
export enum TaskStatus {
  TO_DO = 'TO_DO',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export const TASK_STATUS_OPTIONS = [
  { value: 'TO_DO', label: 'To Do' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
] as const;

export const TASK_PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
] as const;
```

> Mirrors `CASE_STATUS_OPTIONS` and `CASE_PRIORITY_OPTIONS` in `packages/shared/src/`.

---

## tRPC Router Endpoints (server)

| Procedure      | Input             | Response                    | Notes                                  |
| -------------- | ----------------- | --------------------------- | -------------------------------------- |
| `task.list`    | —                 | `Task[]`                    | All tasks, ordered by `createdAt` desc |
| `task.getById` | `{ id: string }`  | `Task & { case, assignee }` | Includes relations                     |
| `task.create`  | `CreateTaskInput` | `Task`                      | Validates required fields              |
| `task.update`  | `UpdateTaskInput` | `Task`                      | Partial update, id required            |
| `task.delete`  | `{ id: string }`  | `{ id: string }`            | Cascades from DB                       |

```typescript
interface CreateTaskInput {
  title: string;
  description?: string;
  caseId: string;
  assignedTo?: string | null;
  priority?: TaskPriority;
  dueDate?: Date | null;
}

interface UpdateTaskInput extends Partial<CreateTaskInput> {
  id: string;
  status?: TaskStatus;
}
```

---

## Excluded from Props (Handled Internally)

| Visual Detail                             | Reason                                     |
| ----------------------------------------- | ------------------------------------------ |
| Hover/focus ring on list items            | CSS pseudo-state                           |
| Skeleton variants                         | Internal to TaskList loading state         |
| Popover positioning for `MoreOptionsMenu` | Defaulted to `side="bottom" align="end"`   |
| Active item highlighting                  | Derived from `useParams` inside `TaskList` |

---

## Assumptions to Validate

1. **Task requires a Case**: Confirm `caseId` is always required (not optional). If standalone tasks are needed, the Create form and data model change.
2. **TaskStatus values**: Confirm TO_DO / IN_PROGRESS / COMPLETED are the only required statuses, or if a CLOSED/CANCELLED state is needed.
3. **No comments**: Confirm the Task detail page does NOT have a comments/activity feed in the initial scope.
4. **RelatedTasksAccordion location**: Confirm whether it sits inside `CaseEssentialDetails` or as a new sibling column/section in `CaseDetails`.
5. **Global vs. filtered task list**: Confirm whether the `/tasks/` page shows all tasks or only those assigned to the current user.
6. **"Add Task" behaviour**: Confirm whether clicking "Add Task" from the Related Tasks accordion navigates to the create page (pre-filled) vs. opens an inline quick-create form.
7. **Nav icon choice**: `CheckSquare` is proposed — confirm with design if a different lucide icon (e.g., `ClipboardList`, `ListTodo`) is preferred.
8. **Due date format**: Confirm display format expected in list items and detail view.
