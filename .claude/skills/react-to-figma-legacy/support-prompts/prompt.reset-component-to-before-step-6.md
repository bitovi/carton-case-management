
# Reset Component to Before Step 6

Reset a component's output directory to its pre-step-6 state by removing all generated artifacts, and update the build-order.md checklist.

## Input

- **Component name** *(required)*: PascalCase name (e.g., `Badge`). Must match an entry in `build-order.md`.

## Procedure

### 1. Identify component and verify it exists

Read `.temp/react-to-figma/component-hierarchy/build-order.md` and search for a line matching the component name.

If not found, report:
```
ERROR: Component "{Name}" not found in build-order.md.
```

If the component is NOT marked with ✅ (not completed), report:
```
Component {Name} is not marked as complete in build-order.md. Nothing to reset.
```

If the component IS marked with ✅ (e.g. `| ✅ Badge |`), continue to step 2.

### 2. Identify all step 6 outputs to remove

Step 6 creates these artifacts (in addition to the prerequisite files from earlier steps):
- `variants.md` — from sub-step 1
- `stories-manifest.md` — from sub-step 2
- `screenshots/` — directory from sub-step 3
- `screenshots-manifest.json` — from sub-step 3
- `figma-variants.md` — from sub-step 4
- `build-plan.md` — from sub-step 5 build phase
- `figma-result.md` — from sub-step 5 final output
- `verification.md` — from sub-step 5 verification
- `variant-plans.md` — from sub-step 5 build analysis
- `verify-manifest.json` — from sub-step 5 verification
- `README.md` — pipeline summary / completion report
- `default-variant/` — directory from Phase 5 default-variant build
- `build/` — directory with IR files and build scripts from sub-step 5
- `diffs/` — directory from build debugging
- `diffs-new/` — directory from build debugging
- `figma-variants/` — directory from variant capture
- `screenshots-cropped/` — directory from debugging
- `run_all_diffs.sh` — script from debugging
- `component-set-screenshot.png` — from verification

**Starting files to preserve** (created by earlier steps 1-5):
- `analysis.md`
- `props.md`
- `*-source.txt` (component source filename, e.g. `badge-source.txt`)
- `app-context/` (if exists) — from Phase 1 `from-app` strategy

### 3. Remove all step 6 outputs

Run the cleanup in the component directory:

```bash
cd .temp/react-to-figma/components/{Name}
rm -f variants.md stories-manifest.md figma-variants.md build-plan.md figma-result.md verification.md variant-plans.md screenshots-manifest.json verify-manifest.json run_all_diffs.sh README.md component-set-screenshot.png
rm -rf screenshots diffs diffs-new figma-variants screenshots-cropped build default-variant
```

Verify that only the starting files remain:
```bash
ls -1
```

Expected output (may vary slightly):
```
analysis.md
app-context          (optional, only if from-app strategy was used)
props.md
{component}-source.txt
```

### 4. Update build-order.md

Open `.temp/react-to-figma/component-hierarchy/build-order.md` and find the line for this component.

The completion marker is a `✅` emoji prefix in the Component column. Find:
```
| ✅ {Name} | ... |
```

Change it to (remove the ✅ and space):
```
| {Name} | ... |
```

Use a direct string replacement to update only this line — do not rewrite the entire file.

### 5. Verify and report

List the remaining files to confirm the cleanup:
```bash
ls -1 .temp/react-to-figma/components/{Name}/
```

Log the result:
```
Component {Name} reset to pre-step-6 state.
  Remaining files: {list}
  build-order.md: Removed ✅ marker
  Ready to rerun step 6.
```
