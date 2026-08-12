# figma-workflow plugin

The Figma-to-React skills that used to live in `.claude/skills/`.

They do real work against this codebase - the `packages/client/src/components/obra/` components have
committed Code Connect files (`*.figma.ts`), and `superconnect.toml` points at the Figma library.
They were moved out because they only apply when you have Figma access and are actively doing
design-to-code work, which is a subset of what this repo gets used for. Nothing was deleted.

## Status: dormant by default

Skills in a plugin are only active when the plugin is loaded. A normal session sees none of them.

## Loading it

```bash
claude --plugin-dir ./plugins/figma-workflow
```

Skills are then namespaced under the plugin name:

```
/figma-workflow:figma-design-react
/figma-workflow:figma-implement-component
```

## What it needs

- **Figma access** to the file you are working from. The Figma MCP server covers most of these;
  `figma-explore` uses the Figma REST API and needs a `FIGMA_ACCESS_TOKEN`.
- Publishing Code Connect mappings uses the Figma CLI via `npm run figma:publish`, which reads
  `superconnect.toml`.

## What's inside

| Skill | Purpose |
|---|---|
| `figma-design-react` | Analyse a Figma design and propose component architecture and props API. Does not write code |
| `figma-implement-component` | Build the component from that analysis, following the modlet pattern |
| `figma-component-sync` | Audit an existing component against its Figma source and report differences |
| `figma-connect-component` | Generate a Code Connect mapping so Figma Dev Mode shows real code |
| `figma-connect-shadcn` | The shadcn/ui variant of the above, for components added via `npx shadcn@latest add` |
| `figma-explore` | List pages, components, and node IDs in a Figma file |

Typical order: `figma-design-react` → `figma-implement-component` → `figma-connect-component`.

## Relationship to the active skills

These depend on two skills that remain active in `.claude/skills/`, so they keep working when the
plugin is loaded:

- `create-react-modlet` - the folder/file structure new components must follow
- `component-reuse` - the audit that should run *before* building anything new

`component-reuse` points at `figma-implement-component` as its "no existing component found" path.
That delegation only resolves when this plugin is loaded; otherwise treat it as "build the
component following `create-react-modlet`".

## Claude Code only

The plugin *wrapper* is a Claude Code feature. `--plugin-dir`, the `.claude-plugin/plugin.json`
manifest, and the `/figma-workflow:` namespace are all Claude Code mechanics.

GitHub Copilot ignores them. Copilot finds skills by scanning `.github/skills`, `.claude/skills`,
and `.agents/skills` - it does not scan `plugins/`. The `SKILL.md` files here are the same open
Agent Skills format Copilot understands, so the *content* is portable; only the loading mechanism
isn't.

To use one of these with Copilot, copy it into a directory Copilot scans (see below). Copying into
`.claude/skills/` works for **both** tools, so that is the one to prefer.

## If you revive these

The skill bodies refer to each other by bare name (for example "use the `figma-explore` skill").
Inside a plugin the real invocation name is namespaced
(`/figma-workflow:figma-explore`). Claude generally follows the intent, but update the
cross-references if you plan to maintain these properly.

To restore one as a normal project skill instead:

```bash
cp -r plugins/figma-workflow/skills/figma-design-react .claude/skills/
```
