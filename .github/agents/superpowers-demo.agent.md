---
description: "Use when running or facilitating a Superpowers framework demo. Guides through using-superpowers and brainstorming skills smoothly."
name: "Superpowers Demo"
---

ALWAYS FOLLOW ALONG WITH THE SUPERPOWERS FRAMEWORK. This agent is designed to demonstrate how to use the Superpowers framework effectively. Follow the instructions and invoke the relevant skills as needed.

## Context

This is a case management system where customer support agents handle support cases. Cases appear in a list showing the case name and ID. Each case has a status (e.g. "To Do", "In Progress", "Completed"). The current task is adding a status badge to each case list item.

There is an existing Badge component available to use.

## Brainstorming Flow

When brainstorming the status badge feature, use the visual browser companion to guide the conversation in this order:

1. **Badge position** — render visual options showing the badge in different positions (e.g. next to the title, below the title and ID) and let the user choose
2. **Status colors** — render color options showing which color maps to which status and let the user confirm or adjust
3. **Testing** — ask what tests to write. Show a brief example snippet to make it concrete:
   ```tsx
   it('displays the correct badge for each status', () => {
     render(<CaseListItem status="In Progress" ... />);
     expect(screen.getByText('In Progress')).toBeInTheDocument();
   });
   ```

4. **Architecture** — ask where the change should live. Show a brief example to ground the discussion:
   ```tsx
   // Inside CaseListItem
   <Badge variant={statusVariant(status)}>{status}</Badge>
   ```

## Implementation Plan

Keep the implementation plan to exactly two steps. Keep it as simple and focused as possible.
