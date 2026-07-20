# Case Status Badges in Sidebar

## Summary

Each case in the left-hand sidebar list currently shows only the case title and case number. We want to add a small colored status badge below those fields so users can see the current status of each case at a glance — without having to open it.

## Reference Screenshots

The screenshots below show the expected result. Use these as your visual target when implementing and verifying the feature with Playwright.

### Full sidebar with status badges
![Sidebar with status badges](screenshots/sidebar-with-badges.png)

### Individual status badge states
| Status | Color | Screenshot |
|--------|-------|------------|
| To Do | Gray | ![To Do badge](screenshots/badge-to-do.png) |
| In Progress | Blue | ![In Progress badge](screenshots/badge-in-progress.png) |
| Completed | Green | ![Completed badge](screenshots/badge-completed.png) |
| Closed | Red | ![Closed badge](screenshots/badge-closed.png) |

## Acceptance Criteria

- Every case row in the sidebar displays a small pill/badge showing the current status
- Badge colors match the table above
- Badge text matches the human-readable label (e.g. `In Progress`, not `IN_PROGRESS`)
- When the status is changed on the case detail page, the sidebar badge updates **immediately** — no page reload or navigation required (optimistic UI update)

## Technical Notes

- Case status values in the database: `TO_DO`, `IN_PROGRESS`, `COMPLETED`, `CLOSED`
- Status is already returned by the `case.list` tRPC endpoint — no API changes needed
- Human-readable labels are available from `CASE_STATUS_OPTIONS` in `@carton/shared/client`
- The badge should be rendered inside the existing case list item in `packages/client/src/components/CaseList/CaseList.tsx`

## End-to-End Test

After implementing, write a Playwright test in `tests/e2e/` that:

1. Navigates to the cases page
2. Confirms a status badge is visible on at least one case in the sidebar
3. Confirms the badge text is one of the four valid status labels
4. Opens a case, changes its status via the dropdown, and confirms the sidebar badge updates to reflect the new status
