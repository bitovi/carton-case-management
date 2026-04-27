# Bug Report: New Case Comments Saved in ALL CAPS

## Summary

When a user submits a new comment on a case, the comment is appears down below in all uppercase

## Environment

- Application: Carton Case Management
- Affected area: Case detail page — Comments section

## Steps to Reproduce

1. Navigate to any case detail page (e.g. `/cases/<id>`)
2. Scroll to the Comments section
3. Type a comment in mixed case, e.g. `This is a test comment`
4. Press Enter
5. The comment now reads `THIS IS A TEST COMMENT`
6. Refresh the page — the all-caps version persists

## Expected Behavior

Comments should be saved and displayed exactly as the user typed them.



