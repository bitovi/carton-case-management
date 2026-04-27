---
name: debug-e2e
description: "Trace and debug a reported bug across the full stack using console logs, browser tools, and Playwright. Use when asked to: debug an issue, trace a bug, add logs to debug, find where a bug is happening, trace code execution, use console logs to debug, or investigate unexpected behavior."
argument-hint: "Describe the bug to debug (e.g. 'comments are being uppercased')"
---

# Full-Stack Debug Workflow

At the end of every step, summarize what you did and use `vscode_askQuestions` to ask the user whether to proceed to the next step before continuing.

---

## Step 1 — Restart the dev servers

Kill any running processes, then start the server and client in **separate async terminals**. Save both terminal IDs so you can read their output throughout the session.

```
pkill -f "tsx watch"; pkill -f "vite"; sleep 1
npm run dev:server   # async — save as SERVER_TERMINAL
npm run dev:client   # async — save as CLIENT_TERMINAL
```

Confirm each is ready using `get_terminal_output` before continuing.

**End of step:** Summarize which terminals are running and their IDs. Use `vscode_askQuestions` to ask the user if they want to proceed to replicating the bug.

---

## Step 2 — Replicate the bug in the built-in browser

Use `open_browser_page`, `click_element`, `type_in_page`, and `screenshot_page` to walk through the affected flow. Take screenshots and note the exact inputs and wrong outputs — these become your test case.

**End of step:** Summarize the exact steps taken, the input used, and the incorrect output observed. Show the screenshot. Use `vscode_askQuestions` to ask the user if they want to proceed to adding debug logs.

---

## Step 3 — Add debug logs across the codebase

Add `console.log` statements at every layer of the data flow. Each log must be prefixed with the file name, function name, and any useful values so you can trace the exact path data takes:

```ts
console.log('[FileName:functionName] label:', value);
```

Cover all layers — React components, tRPC router, shared utilities, and Prisma extensions/middleware. Cast a wide net.

**End of step:** List every file and function where logs were added. Use `vscode_askQuestions` to ask the user if they want to proceed to writing the Playwright test.

---

## Step 4 — Write a failing Playwright test

Based on what you observed in Step 2, write a spec file in `tests/e2e/` that replicates the exact steps and asserts the correct behavior. It should fail at this point.

**End of step:** Show the test file path and the assertion it makes. Use `vscode_askQuestions` to ask the user if they want to proceed to running the test.

---

## Step 5 — Run the test using `run_playwright_code` and collect all logs

Execute the test in the built-in browser using `run_playwright_code`. Set up a console log listener to capture all browser-side logs, then use `get_terminal_output` with SERVER_TERMINAL to collect server-side logs. 

```js
const browserLogs = [];
page.on('console', msg => browserLogs.push(msg.text()));
// ... run the test steps ...
return browserLogs;
```

Be sure to adds multiple logs to both the client and server to trace the full path of data.

**End of step:** Confirm the test failed. Present all collected logs as a combined chronological trace, clearly highlighting the specific log lines that reveal where the data changes incorrectly — call out the file, function, and the before/after values. Use `vscode_askQuestions` to ask the user if they want to proceed to fixing the bug.

---

## Step 6 — Fix the bug

Fix only the layer identified in Step 5.

**End of step:** Show exactly what was changed and why. Use `vscode_askQuestions` to ask the user if they want to proceed to verifying the fix.

---

## Step 7 — Re-run the Playwright test using `run_playwright_code`

Run the same test again in the command line this time. Confirm it passes and take a screenshot to visually verify the correct behavior. If the test still fails, repeat Steps 5-7 until it passes.

**End of step:** Confirm the test passed. Show the screenshot. Use `vscode_askQuestions` to ask the user if they want to proceed to cleaning up debug logs.

---

## Step 8 — Remove debug logs

Remove all temporary logs added in Step 3:

```
grep -rn '\[FileName\]' packages/
```

Keep the Playwright test file as a regression test.

**End of step:** List every log that was removed. Confirm the codebase is clean.

