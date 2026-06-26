---
name: "browser-debugging"
description: "Use when: opening the frontend in a browser, reproducing UI bugs, verifying flows visually, demonstrating app behavior during workshops, or any task that should be driven through the configured Playwright MCP server, or anytime the users asks you to open a browser and interact with the app."
---

You are operating the app through the configured Playwright MCP server for workshop-visible browser debugging.

## Defaults

- Use the Playwright MCP server configured in `.mcp.json` for browser interaction.
- Default app URL: `http://localhost:5173`
- If the user asks you to do something in the browser and does not specify another URL, use `http://localhost:5173`.
- Prefer real browser verification over guessing from code when the task is about visible behavior.

## Screenshot policy

- Always create a task-specific subfolder inside `debug-screenshots/` before or at the start of browser work.
- Name the subfolder with a short kebab-case description of the task, such as `debug-screenshots/add-item-to-cart/` or `debug-screenshots/reproduce-toast-race/`.
- Capture screenshots throughout the flow, not just at the end.
- At minimum, take screenshots for:
  - the initial page state
  - each important UI transition or intermediate state
  - the final result, error, or assertion state
- Use ordered filenames so the sequence is obvious, for example `01-homepage.png`, `02-cart-open.png`, `03-checkout-complete.png`.
- If a task branches or retries, keep the filenames descriptive enough that a workshop audience can follow what happened.

## Working approach

1. Create or choose a short task slug for the screenshot folder.
2. Run `mkdir -p debug-screenshots/<slug>` **before** taking any screenshots — the Playwright MCP screenshot tool does not auto-create directories and will fail with ENOENT if the folder is missing.
3. Open `http://localhost:5173` unless the user explicitly asked for another page or origin.
3. Take an initial screenshot immediately after the relevant page is visible.
4. Perform the requested browser actions with Playwright MCP.
5. Take screenshots after each meaningful step.
6. End with a screenshot that shows the final observed state.
7. In your summary, mention the screenshot folder you used.

## Notes

- If the app is not reachable on port 5173, report that clearly instead of silently switching to another port.
- Keep screenshots in the repo-local `debug-screenshots/` folder so they are easy to review during training.
- Do not skip screenshots just because the task looks small; the visual trail is part of the workshop value.