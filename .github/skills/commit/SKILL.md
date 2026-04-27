---
name: commit
description: "Commit and push code changes for carton-case-management to GitHub. Use when asked to: commit changes, commit my work, stage files, push to GitHub, push my changes, create a commit, or save changes to git. Covers the full git workflow including pre-commit checks."
argument-hint: "What do you want to commit? (e.g. commit all changes, commit with message 'feat: ...')"
---

# Commit and Push

## Full Workflow

### 1. Check what changed
```
git status
git diff --stat
```

Review what files are modified before staging anything.

### 2. Run pre-commit quality checks

Do not commit if any of these fail:
```
npm test && npm run typecheck && npm run lint
```

### 3. Stage changes

Stage specific files (preferred):
```
git add <file>
```

Stage interactively hunk-by-hunk:
```
git add -p
```

Stage all changes (use carefully — review `git status` first):
```
git add .
```

### 4. Commit

Use conventional commit format:
```
git commit -m "type: short description"
```

Types: `feat`, `fix`, `chore`, `refactor`, `test`, `docs`

Examples:
- `feat: add case assignment to users`
- `fix: correct date format in case list`
- `chore: update dependencies`
- `test: add e2e tests for customer creation`

### 5. Push
```
git push
```

## Quick Reference

| Command | Purpose |
|---|---|
| `git status` | See changed files |
| `git diff` | See line-level changes |
| `git log --oneline -10` | See recent commits |
| `git stash` | Temporarily shelve uncommitted changes |
| `git stash pop` | Restore stashed changes |
