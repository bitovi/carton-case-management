# cascade-workflow plugin

The Jira-story and Figma-design-question skills that used to live in `.claude/skills/`.

They were moved here because they are **not about this codebase**. They automate a delivery
workflow (epic → scoped stories → behaviour questions) and depend on external services, so they
added noise for anyone using this repo to learn about the app itself. Nothing was deleted.

## Status: dormant by default

Skills in a plugin are only active when the plugin is loaded. Nothing here runs unless you ask
for it, and none of these skills appear in a normal session.

## Loading it

```bash
claude --plugin-dir ./plugins/cascade-workflow
```

Skills are then namespaced under the plugin name:

```
/cascade-workflow:write-jira-story
/cascade-workflow:write-shell-stories
```

## Required MCP servers

These skills call tools that this repo does **not** configure. Without them the skills will load
but fail when they try to reach Jira, Confluence, or Figma. Configure them yourself (claude.ai
connectors, or `claude mcp add`) before using the plugin:

| Tools the skills call | Provided by |
|---|---|
| `extract-linked-resources`, `figma-frame-data`, `figma-post-comment` | Cascade MCP |
| `atlassian-get-issue`, `atlassian-create-issue`, `atlassian-update-issue-description`, `atlassian-add-comment`, `atlassian-update-comment` | Atlassian MCP |

No `.mcp.json` is committed here on purpose - the correct server endpoints depend on your
organisation, and guessing them would produce a config that silently fails.

## What's inside

Four entry points, backed by nine sub-skills:

**Entry points**

| Skill | Purpose |
|---|---|
| `write-jira-story` | Write or refine a single Jira story from an issue plus its linked context |
| `write-shell-stories` | Break an epic into a prioritised list of shell-story outlines |
| `write-next-story-from-shell-story` | Expand the next unwritten shell story into a full story |
| `generate-behavior-questions` | Produce frame-specific clarifying questions about ambiguous UI behaviour |

**Sub-skills** (called by the above, not usually invoked directly)

`cascade-analyze-feature-scope`, `cascade-analyze-figma-frame`, `cascade-analyze-figma-frame-mcp`,
`cascade-load-linked-resource-content`, `cascade-summarize-document-content`,
`cascade-post-design-questions-to-figma`, `cascade-post-design-questions-to-jira`,
`cascade-answer-design-questions-post-to-figma`, `cascade-answer-design-questions-post-to-jira`

## Claude Code only

The plugin *wrapper* is a Claude Code feature. `--plugin-dir`, the `.claude-plugin/plugin.json`
manifest, and the `/cascade-workflow:` namespace are all Claude Code mechanics.

GitHub Copilot ignores them. Copilot finds skills by scanning `.github/skills`, `.claude/skills`,
and `.agents/skills` - it does not scan `plugins/`. The `SKILL.md` files here are the same open
Agent Skills format Copilot understands, so the *content* is portable; only the loading mechanism
isn't.

To use one of these with Copilot, copy it into a directory Copilot scans (see below). Copying into
`.claude/skills/` works for **both** tools, so that is the one to prefer.

## If you revive these

Two things to know:

1. The skill bodies refer to each other by bare name (for example "use the
   `cascade-analyze-figma-frame` skill"). Inside a plugin the real invocation name is
   namespaced (`/cascade-workflow:cascade-analyze-figma-frame`). Claude generally follows the
   intent, but update the cross-references if you plan to maintain these properly.
2. To restore one as a normal project skill instead, copy it back:

   ```bash
   cp -r plugins/cascade-workflow/skills/write-jira-story .claude/skills/
   ```
