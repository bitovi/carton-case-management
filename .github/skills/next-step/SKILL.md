---
name: next-step
description: "Advance to the next step in the AI debugging training. Use when asked to: next step, go to next step, next branch, advance training, move on, or /next-step. Commits current work and checks out the next training branch after showing a preview of what's coming."
argument-hint: "No argument needed — the skill detects your current branch automatically."
---

# Next Step

This skill advances training participants to the next branch in the AI debugging training series.

## Branch Progression

| Current Branch | Next Branch | What's Next |
|---|---|---|
| `ai-training-debugging` | `ai-training-debugging-2` | Debugging linter errors and unit tests — the "test → fix → repeat" loop |
| `ai-training-debugging-2` | `ai-training-debugging-3` | Debugging a UI issue and tracing a bug across the client and server |
| `ai-training-debugging-3` | `ai-training-debugging-4` | Databases — using an MCP server to interact with and query a database |
| `ai-training-debugging-4` | _(end)_ | Training complete! |

## Workflow

### 1. Identify the current branch

```bash
git branch --show-current
```

Use the table above to determine the next branch and what participants will learn there.

### 2. Handle end-of-training

If the current branch is `ai-training-debugging-4`, inform the user that the training is complete and skip the remaining steps.

If the current branch is **not** one of the four training branches, tell the user this skill only works on training branches and stop.

### 3. Show a preview dialog using vscode_askQuestions

Use the `vscode_askQuestions` tool to show a dialog with:
- **header**: `"Ready for the next step?"`
- **question**: Describe what participants will learn in the next section (use the table above).
- **options**: `"Yes, let's go!"` and `"Not yet — stay here"`

Do NOT proceed if the user selects "Not yet — stay here".

### 4. Commit current changes (skip if working tree is clean)

First check if there is anything to commit:
```bash
git status --porcelain
```

If there are changes, stage and commit them:
```bash
git add .
git commit -m "chore: save training progress"
```

Do NOT run tests, linting, or type checks — the training branches may intentionally have broken code.

Do NOT push.

### 5. Checkout the next branch

```bash
git checkout <next-branch>
```

### 6. Confirm success

Briefly tell the user which branch they are now on and what they will be working on in this section.
