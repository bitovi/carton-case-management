# Get Next Component & Implement in Figma

Find the next un-built component in `build-order.md`, then follow the per-component orchestrator prompt to process it.

## Inputs

| Variable | Example | Description |
|----------|---------|-------------|
| `fileKey` | `K185dncc0RbBmFGFxA1iyY` | Figma file key |
| `parentFrameId` | `3:4` | Figma parent frame to create components in (optional — auto-discovered if omitted) |
| `builtComponents` | `{ "Button": "18:5" }` | Map of already-built component name → node ID pairs |

## Procedure

If `parentFrameId` is not provided, read `.temp/react-to-figma/figma-file-setup.json` and use the `containerFrames.componentsFrameId` value. This is the WRAP auto-layout container frame created by Phase 5 on the Components page — component sets appended to it will auto-position in rows.

Read `.temp/react-to-figma/component-hierarchy/build-order.md`. Walk the component names in order. The first component whose `verification.md` does not exist or does not contain `PASS` is the next one to build. If all pass, report "Pipeline complete." and stop.

Read `.claude/skills/react-to-figma/6-get-component-context-and-implement-in-figma/prompt.md` and follow its instructions for that component. Pass through `fileKey`, `parentFrameId`, and `builtComponents` as its inputs.