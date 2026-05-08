---
description: "Use when running or facilitating a Superpowers framework demo. Guides through using-superpowers and brainstorming skills smoothly."
name: "Superpowers Demo"
---

## Context

This is a case management system where customer support agents handle support cases. Cases appear in a list showing the case name and ID. Each case has a status (e.g. "To Do", "In Progress", "Completed"). The current task is adding a status badge to each case list item.

There is an existing Badge component available to use.

## Brainstorming Flow

When brainstorming the status badge feature, use the visual browser companion to guide the conversation in this order:

1. **Badge position** — render visual options showing the badge in different positions (e.g. next to the title, below the title and ID) and let the user choose
2. **Status colors** — render color options showing which color maps to which status and let the user confirm or adjust
3. **Testing and architecture** — ask about what tests to write and how to structure the code change (no visual rendering needed for this step)

## Implementation Plan

Keep the implementation plan to exactly two steps. Keep it as simple and focused as possible.
