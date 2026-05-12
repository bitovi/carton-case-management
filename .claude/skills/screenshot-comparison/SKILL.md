---
name: screenshot-comparison
description: Compare any two screenshots using pixel-level visual diff with LLM-generated difference description. Produces a diff image, match percentage, border analysis, verdict, and natural-language summary of visual differences. Includes an evaluation tool with synthetic test cases. Use when comparing screenshots for visual fidelity (design vs implementation, regression testing, before/after).
---

# Skill: Screenshot Comparison

Compares two PNG screenshots using pixel-level analysis and produces both a quantitative score and a qualitative LLM-generated description of the visual differences. Includes an evaluation tool for validating the comparison pipeline.

## When to Use

- Comparing a design tool screenshot against a live web app screenshot
- Visual regression testing (before/after screenshots)
- Auditing design-to-implementation fidelity
- Any scenario where two images need a structured visual diff

## Workflow

```
Step 1: Quantitative  → run compare.js to get pixel-level metrics
Step 2: Qualitative   → read both images + diff, write description.md
Step 3: Evaluate       → (optional) run evaluate.js to validate the pipeline
```

---

## Step 1: Pixel-Level Comparison

Run the comparison script:

```bash
node .claude/skills/screenshot-comparison/compare.js \
  <imageA.png> <imageB.png> <outputDir/> \
  [--match-threshold 90] [--defect-threshold 75] \
  [--border-ring 4] [--border-threshold 85] [--tolerance 28]
```

### Inputs

| Arg         | Description                                                |
| ----------- | ---------------------------------------------------------- |
| `imageA`    | Path to first PNG screenshot                               |
| `imageB`    | Path to second PNG (reference — dimensions used as target) |
| `outputDir` | Directory for output files (created if missing)            |

### Optional Flags

| Flag                 | Default | Description                                                     |
| -------------------- | ------- | --------------------------------------------------------------- |
| `--match-threshold`  | 90      | Overall % above which verdict is "match"                        |
| `--defect-threshold` | 75      | Overall % below which verdict is "mismatch"                     |
| `--border-ring`      | 4       | Pixel width of edge ring examined separately                    |
| `--border-threshold` | 85      | Border-region % above which is "border_ok"                      |
| `--tolerance`        | 28      | Per-channel color delta below which pixels are considered equal |

### Outputs

**`diff.png`** — Visual diff image. Red pixels mark differences; matching pixels are dimmed.

**`comparison.json`**:

```json
{
  "matchPct": 94.32,
  "borderMatchPct": 87.5,
  "diffPixels": 12345,
  "totalPixels": 1440000,
  "borderDiff": 45,
  "borderTotal": 500,
  "normalizedW": 1440,
  "normalizedH": 900,
  "verdict": "match",
  "borderVerdict": "border_ok",
  "thresholds": {
    "match": 90,
    "defect": 75,
    "borderRing": 4,
    "border": 85,
    "tolerance": 28
  }
}
```

**Exit codes**: `0` = match, `1` = minor_diff, `2` = mismatch, `3` = error

### Verdict Logic

| Overall %          | Verdict                          |
| ------------------ | -------------------------------- |
| >= match-threshold | **match**                        |
| defect–match range | **minor_diff** (flag for review) |
| < defect-threshold | **mismatch** (auto-defect)       |

| Border %            | Border Verdict                                     |
| ------------------- | -------------------------------------------------- |
| >= border-threshold | **border_ok**                                      |
| < border-threshold  | **border_diff** (overrides "match" → "minor_diff") |

The border-ring check catches subtle styling defects (strokes, border colors, box-shadows) that are masked by content differences in the overall score.

### Algorithm

1. Load both PNGs into headless browser canvas
2. Scale image A to match image B's dimensions (image B is the reference)
3. Compare each pixel's R, G, B channels — if max channel delta > tolerance, pixel is "different"
4. Calculate overall match percentage
5. Separately calculate match percentage for the outer N-pixel border ring
6. Border_diff overrides an overall "match" verdict to "minor_diff"

---

## Step 2: LLM Difference Description

After running compare.js, generate a natural-language description of the differences.

**Recommended model for subagent:** Use `sonnet` when delegating this step to a subagent — it handles multimodal image analysis well and is cost-effective for structured description tasks. Opus is unnecessary here.

### Procedure

1. **Read all three images in parallel** using the Read tool (Claude is multimodal):
   - Image A (source)
   - Image B (reference)
   - diff.png — red regions mark pixel differences
2. **Analyze** the differences, focusing on:
   - Layout differences (position, alignment, spacing)
   - Color differences (fills, backgrounds, text color)
   - Typography differences (font size, weight, line height)
   - Spacing differences (padding, margins, gaps)
   - Missing or extra elements
   - Border and shadow differences
3. **Write** the description to `{outputDir}/description.md`

### Output Format

```markdown
## Visual Difference Summary

**Score**: {matchPct}% match | **Verdict**: {verdict}

### Differences Found

- {specific visual difference 1}
- {specific visual difference 2}
- ...

### Areas of Agreement

- {what matches well 1}
- {what matches well 2}
- ...
```

When the verdict is "match" (>= 90%), the description should note that the images are visually equivalent with only minor rendering differences.

---

## Step 3: Evaluation Tool (Optional)

Validates the comparison pipeline using synthetic test image pairs with known, controlled differences.

### Run All Tests

```bash
node .claude/skills/screenshot-comparison/evaluate.js
```

### Run Single Test

```bash
node .claude/skills/screenshot-comparison/evaluate.js --case identical
```

### Verbose Mode

```bash
node .claude/skills/screenshot-comparison/evaluate.js --verbose
```

### Test Cases

The evaluation tool generates image pairs programmatically using Playwright's canvas API and validates compare.js output against expected score ranges. Test cases are defined in `evaluate-cases.json`.

| Test                 | Mutation                      | Expected                            |
| -------------------- | ----------------------------- | ----------------------------------- |
| Identical images     | none                          | 100% match                          |
| Single pixel change  | 1px color change              | ~99.9% match                        |
| Border color shift   | Border stroke color changed   | match overall, border_diff          |
| Layout shift 10px    | All content shifted right     | minor_diff                          |
| Global hue shift     | Blue → green                  | minor_diff                          |
| Element removed      | One rect removed              | minor_diff/mismatch                 |
| Completely different | Two unrelated images          | mismatch                            |
| Spacing increase     | Gaps between elements widened | minor_diff                          |
| Opacity change       | Element faded to 50%          | minor_diff                          |
| Box shadow added     | Drop shadow on card           | match overall, possible border_diff |

### Validate LLM Descriptions

After generating description.md files for test cases, validate them against expected keywords:

```bash
node .claude/skills/screenshot-comparison/evaluate-describe.js \
  .temp/evaluate/{id}/description.md --keywords "border,color,shift"
```

Outputs JSON with `found`, `missing`, and `pass` fields. This is a soft validation — LLM output is non-deterministic, so keyword presence is a heuristic.

### Output

- Console table with per-case scores and PASS/FAIL
- `.temp/evaluate/report.json` — full structured report
- `.temp/evaluate/{id}/` — per-case artifacts (a.png, b.png, diff.png, comparison.json)
- Exit code: `0` all pass, `1` any fail

---

## Dependencies

- `@playwright/test` — headless browser for canvas-based image comparison
- Node.js built-ins (`fs`, `path`, `child_process`)

---

## Integration

This skill is used by:

- `figma-from-code-validator` — Phase 2e pixel diff comparison
- `figma-from-code` — Phase 5 validation loop
