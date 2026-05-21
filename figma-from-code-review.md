# figma-from-code Skill System — Critical Review

## Executive Summary

Three independent reviewers analyzed the figma-from-code pipeline across **efficiency**, **accuracy**, and **quality** dimensions. The system is architecturally ambitious and well-documented in its orchestrator SKILL.md, but suffers from several cross-cutting issues that compound across phases. The most impactful findings fall into three categories:

1. **State management gaps** — `builtComponents.json` vs `state.json` divergence means the prerequisite gate may never fire correctly
2. **Fidelity loss** — Figma variables are created but never bound to components; color conversion relies on LLM arithmetic instead of programmatic resolution
3. **Redundant work** — Style inspection, normalization, and validation each run twice where once would suffice

---

## Part 1: Efficiency Review

### 1.1 Token/Cost Efficiency

| Issue | Location | Impact |
|-------|----------|--------|
| Every opus subagent re-reads the multi-KB `figma-from-code-build-component/SKILL.md` independently — no shared pre-load | `figma-from-code-build-tier/SKILL.md` subagent prompt template | High — multiplied by every component in every tier |
| `code.json` stores bulky `computedStyles`, `textContent`, and `states` blobs that are written and immediately re-read | `step-1-analyze.md` step 1h → `step-2-build.md` | Medium — hundreds of lines of JSON per component |
| `figma.json` embeds child dependencies recursively, but `check-instances.js` only reads one level deep | `step-2-build.md` step 2f, `check-instances.js` | Low-Medium — grows with tree depth |
| Phase 5 always re-validates all components even when Phase 3 reported all matches | Orchestrator `SKILL.md` lines 461–497 | High — full round of `get_screenshot` + compare per component |

### 1.2 Subagent Orchestration

| Issue | Location | Impact |
|-------|----------|--------|
| Haiku used for Step 1 analysis despite judgment-heavy tasks (parent-context sizing, CSS variable chains, conditional inspection) | `figma-from-code-build-component/SKILL.md` | High — malformed `code.json` triggers expensive opus fix loops |
| Step 4b Haiku compare agent calls `use_figma` for sizing check; build step already knows the dimensions | `step-4-compare.md` step 4b | Medium — one unnecessary MCP roundtrip per component per iteration |
| Phase 2.5 browser-server fallback silently launches duplicate Chromium if endpoint file not found | `figma-from-code-precapture/SKILL.md`, `browser-connect.js` | Medium — defeats shared browser optimization |

### 1.3 Redundant Work

| Issue | Location | Impact |
|-------|----------|--------|
| `inspect-styles.js` runs per-component in Phase 3 despite Phase 2.5 already having an open Playwright session on the same routes | `step-1-analyze.md` step 1g vs `figma-from-code-precapture/SKILL.md` | High — N extra page navigations |
| `check-prereqs.js` and `check-instances.js` both derive the same child-component list from source imports | `check-prereqs.js`, `check-instances.js`, `step-1-analyze.md` step 1h | Low — three derivations of the same data |
| `normalize-component-map.js` runs twice when 0a completes before 0b (common sequential case) | `figma-from-code-discovery-components/SKILL.md` step 4 | Low — could be avoided by parallelizing 0a/0b |
| Phase 0a seeds `.figma/figma.json` for all matched components; Phase 3 immediately overwrites them for rebuilt ones | `discovery-components/SKILL.md` step 6b | Low |

### 1.4 File I/O Overhead

| Issue | Location | Impact |
|-------|----------|--------|
| State serialized after every phase AND tier boundary — includes stable data (`buildOrder`) that never changes | Orchestrator `SKILL.md` checkpoint protocol | Medium |
| Per-component result files + tier summary files + `state.json` = triple redundancy for node IDs | `build-results/`, `build-tier{N}.json`, `state.json` | Medium — tier files are never read on resume |
| `code.json` written fresh every run into `.figma/` (source tree), generating git noise for every component | `step-1-analyze.md` line ~256 | Medium — 30+ file modifications per run |

### 1.5 Pipeline Design Recommendations

1. **Batch `inspect-styles.js` into Phase 2.5** — capture computed styles and state screenshots during precapture. Eliminates N browser navigations from Phase 3.
2. **Parallelize Phase 0a and 0b** — they share no input dependencies. Normalize once when both complete.
3. **Make Phase 5 conditional** — skip entirely if all Phase 3 results are `verdict: "match"`. For failures, reuse existing screenshots instead of re-capturing.
4. **Strip large blobs from `code.json`** — remove `computedStyles`, `textContent`, `states`. Read pre-captured files directly. Reduces to ~20 lines.
5. **Upgrade Step 1 from Haiku to Sonnet** — the cost delta is small compared to an avoidable opus fix iteration caused by bad analysis.
6. **Pass node dimensions from Step 2 return value** — eliminates the `use_figma` call in Step 4b.
7. **Eliminate tier summary files** — derive tier status from `state.json` + presence of component result files.
8. **Flatten recursive `figma.json` dependencies** — use a flat array of direct-child names only.

---

## Part 2: Accuracy Review

### 2.1 Information Loss

| What's Lost | Details | Severity |
|-------------|---------|----------|
| Responsive behavior | Fixed 1440x900 viewport; Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) ignored; no documentation of this limitation | High |
| Group/child hover states | `inspect-styles.js` emulates hover on the element itself, not CSS children; `group-hover:` Tailwind classes produce no state screenshot | High |
| Figma variable bindings | Phase 1 creates variable collections but Phase 3 hardcodes RGB values — `setBoundVariable()` never called | Critical |
| Pseudo-elements | `::before`, `::after` not captured by `inspect-styles.js` | Medium |
| Arbitrary Tailwind values | `rounded-[10px]` falls through static mapping table; relies on LLM inference | Medium |
| Dark mode | Pipeline always runs light mode; no verification path for dark variants | Medium |
| Transitions/animations | `transition` captured in styles but never consumed for Figma prototyping | Low |

### 2.2 Component Discovery Gaps

| Gap | Details | Severity |
|-----|---------|----------|
| Portal components in wrong tier | DOM-depth-based hierarchy places portal-mounted elements (dialogs, sheets) at root level instead of under their logical parent | High |
| Routes behind auth/programmatic navigation missed | Crawler only follows anchor `href` links; no retry or coverage check | High |
| HOC-wrapped components hidden | Fiber walker breaks on first match; `React.memo`, `forwardRef` wrappers consume the slot | Medium |
| Library filter incomplete | Radix composite components (`SelectContent`, `SelectItem`) pass the filter and get queued for builds that will fail | Medium |
| Icon rename restricted to leaf nodes | `normalize-component-map.js` line 101: `if (!isLeaf) return` — wrapped icons miss the `Icon/` prefix | Medium |

### 2.3 Color/Token Accuracy

**The OKLCH problem is the largest systematic accuracy issue.** The pipeline relies on Haiku LLM inference to convert OKLCH/HSL color strings to Figma RGB values. OKLCH (shadcn/ui's default) involves a non-trivial color space transform that Haiku frequently gets wrong by several percent per channel. `computed-styles.json` provides resolved RGB as a fallback, but only for the root element — child element colors are not captured.

Variable scoping in Phase 1 is guessed from naming patterns alone (`--sidebar-foreground` vs `--card` vs `--chart-1`), with no actual usage analysis since no components are inspected yet.

### 2.4 Visual Comparison Reliability

| Issue | Details |
|-------|---------|
| Scale mismatch | No coordination between `get_screenshot` output resolution and Playwright screenshot size; canvas zoom level not enforced |
| Text rendering noise | Font anti-aliasing differences produce 85–92% match scores for correct components; 28/channel tolerance is too blunt |
| Scrolled content | Components taller than viewport are cropped in `app.png` but full in `figma.png` — unfixable mismatch |
| No dark mode comparison | Only light mode verified |

### 2.5 Dependency/Instance Resolution

| Issue | Details |
|-------|---------|
| Circular dependencies silently absorbed | `map-components.js` dumps stalled nodes into current tier with no diagnostic; causes `missing_children` in Phase 3 |
| Name matching is exact and case-sensitive | `button` vs `Button` will not match; component gets rebuilt over the existing node |
| Instance counting by name only | Two different `Button` variants (primary/ghost) counted as one; `check-instances.js` verifies presence not count |
| Flat component name map | `components/CaseDetails/components/Header` and `components/Header` both key as `Header`; second build overwrites first |

### 2.6 Accuracy Recommendations

1. **Bind Figma variables in component builds** — call `setBoundVariable()` when setting fills/strokes/radius. Without this, the token system is decorative.
2. **Programmatic OKLCH/HSL→RGB conversion** — replace LLM color math with a Node.js script parsing `index.css` and `tailwind.config.js`.
3. **Deduplicate component names** — add a pre-Phase-3 step that disambiguates collisions across source paths.
4. **Fix portal tier assignment** — second pass cross-referencing import structure against DOM hierarchy.
5. **Add duplicate node cleanup** — before creating any component, check if `parentFrameId` already contains a node with that name.
6. **Enforce consistent screenshot scale** — document and enforce 1x Figma export; size Playwright screenshots to match.
7. **Fix leaf-only icon normalization** — remove the `if (!isLeaf) return` guard.
8. **Surface cycle detection** — emit warnings with component names instead of silently absorbing.

---

## Part 3: Quality Review

### 3.1 Code Quality Issues

| File | Issue | Severity |
|------|-------|----------|
| `browser-connect.js:9` | Silent `catch {}` swallows all connection errors — shared-server failures are invisible | High |
| `browser-server.js` | No stale PID cleanup; SIGKILL leaves endpoint file on disk; next run uses dead endpoint silently | High |
| `inspect-styles.js:255` | `setAttribute('disabled', '')` does nothing for React-controlled components; false negatives for disabled state | Medium |
| `inspect-styles.js:304–325` | Failed `goto()` in batch mode doesn't reset page state; subsequent entries get corrupted data | Medium |
| `normalize-component-map.js:59–62` | Lucide alias-map regex depends on ESM bundle line formatting; `catch {}` suppresses parse failures | Medium |
| `check-prereqs.js:76–108` | `COMPONENT_ORIGIN_RE` regex misses barrel imports (`@/components/ui`) and over-fires on utility imports | Low |
| `check-instances.js` | "Unexpected instances" list computed but never acted upon; script exits 0 regardless | Low |

### 3.2 SKILL.md Quality

| Issue | Location | Severity |
|-------|----------|----------|
| **`builtComponents.json` vs `state.json` divergence** — `check-prereqs.js` reads `builtComponents.json` but orchestrator stores data in `state.json`. No instruction to materialize the extract. | `check-prereqs.js:44`, orchestrator SKILL.md | Critical |
| **Re-normalization after Phase 0b never instructed** — orchestrator SKILL.md Phase 0 section omits the re-run step that `discovery-components/SKILL.md` says the orchestrator will handle | Orchestrator SKILL.md Phase 0, discovery-components step 4 | High |
| **Pre-Existing Components Rule missing from Haiku prompts** — subagent prompt template doesn't pass `preExistingComponents` or reference the rule | `figma-from-code-build-tier/SKILL.md` prompt template | High |
| **Component App Map construction undocumented in precapture** — agents must navigate to validator SKILL.md Phase 1c mid-execution | `figma-from-code-precapture/SKILL.md` | Medium |
| **Phase 5 fix loop duplicates Phase 3** — different iteration semantics (report.md vs JSON files); combined could produce 6 fix iterations | Validator SKILL.md Phase 5, `step-5-fix-loop.md` | Medium |
| `step-2-build.md:98` variant example hardcodes `['primary', 'secondary', 'ghost']` — LLMs cargo-cult specific values | `step-2-build.md` | Low |
| `step-4-compare.md` does not note that Haiku agents need `use_figma` access for the sizing check | `step-4-compare.md` step 4b | Low |

### 3.3 Error Handling & Recovery

| Issue | Details | Severity |
|-------|---------|----------|
| Partial-tier resume algorithm unspecified | SKILL.md says "trust build file over state.json" but gives no enumeration algorithm for identifying missing components | High |
| No subagent timeout instruction | Playwright `waitFor` hang in a subagent blocks the pipeline indefinitely | High |
| `use_figma` incremental limit leaves orphan frames | No cleanup instruction for partial builds when the limit is hit | Medium |
| Browser server stale PID/endpoint files persist across runs | Silent resource leak; parallel browser conflict | Medium |
| Icon creation preamble not checkpointed per batch | Interruption mid-preamble leaves some icons in Figma but not in `builtComponents` | Medium |

### 3.4 State Management

The **`builtComponents.json` / `state.json` split** is the most critical structural gap. `check-prereqs.js` reads `builtComponents.json` as a standalone file, but the orchestrator only maintains `builtComponents` inside `state.json`. Unless something separately materializes this file, the prerequisite gate never successfully loads the built component map. This is a latent integration bug that could cause every component build to fail the prereq check or (worse) silently skip it.

Parallel subagent writes within a tier are correctly isolated to per-component result files. Icon creation in the preamble is the exception — `builtComponents` should be written after each icon batch, not after all icons complete.

### 3.5 Maintainability Concerns

| Issue | Details |
|-------|---------|
| Tailwind-to-Figma mapping table duplicated | `step-2-build.md` and `figma-from-code-build-screens/SKILL.md` — must update both |
| `fixSizing()` defined in three places | Component SKILL.md, screens SKILL.md (with `exemptRoot` variant), and `step-5-fix-loop.md` |
| Adding a new phase touches 5+ files | `state.json` schema, SKILL.md, skill-tree.md, skill-graph.md, checkpoint protocol |
| 8-file spread for build-component | Agent executing one step may miss constraints in another step's file |

### 3.6 Quality Recommendations

1. **Resolve `builtComponents.json` / `state.json` split** — either materialize the extract explicitly or modify `check-prereqs.js` to read `state.json` directly.
2. **Add re-normalization instruction after Phase 0b** in orchestrator SKILL.md.
3. **Include Pre-Existing Components Rule in Haiku subagent prompts**.
4. **Centralize Tailwind mapping and `fixSizing()`** into a shared reference file.
5. **Fix `browser-connect.js` silent fallback** — log the error before launching a new browser.
6. **Document partial-tier resume algorithm** — enumerate `build-results/` to find missing components.
7. **Add subagent timeout to orchestrator dispatch** — prevent indefinite hangs.
8. **Consolidate Component App Map construction** into a shared document.

---

## Priority Matrix

### Critical (fix before next run) — ALL RESOLVED

| # | Issue | Dimension | Fix |
|---|-------|-----------|-----|
| 1 | `builtComponents.json` never materialized — prereq gate broken | Quality | `check-prereqs.js` now reads `state.json` first with fallback; orchestrator materializes `builtComponents.json` after preamble and between tiers |
| 2 | Figma variables created but never bound to components | Accuracy | Added variable map extraction post-Phase 1, variable map in subagent prompts, and `setBoundVariable()` workflow in step-2-build.md §2e |
| 3 | Re-normalization after Phase 0b not instructed in orchestrator | Quality | Added explicit normalization step + `buildOrder`/`builtComponents` update in orchestrator Phase 0b section |

### High (fix soon — significant waste or inaccuracy)

| # | Issue | Dimension | Status |
|---|-------|-----------|--------|
| 4 | `inspect-styles.js` runs twice per component (Phase 2.5 + Phase 3) | Efficiency | |
| 5 | OKLCH color conversion via LLM arithmetic — systematic color drift | Accuracy | DONE — Created `resolve-colors.js` for programmatic OKLCH/HSL/hex→sRGB conversion; orchestrator runs it post-Phase 1; step-2-build.md uses pre-computed values |
| 6 | Pre-Existing Components Rule missing from Haiku subagent prompts | Quality | DONE — Added `preExistingComponents` to Sonnet analyze subagent prompt + early rejection gate |
| 7 | Phase 5 always runs even when Phase 3 passed all components | Efficiency | |
| 8 | Portal components placed in wrong tier | Accuracy | DONE — `detect-components.js` now captures React fiber parent; `buildTree` re-parents portal-mounted components using fiber ancestry |
| 9 | Flat component name map causes overwrites on name collisions | Accuracy | DONE — `map-components.js` disambiguates collisions by qualifying nested components as `ParentName/ChildName` |
| 10 | Haiku too weak for Step 1 analysis — cascades to expensive fix loops | Efficiency | DONE — Upgraded Step 1 from Haiku to Sonnet across SKILL.md, step-1-analyze.md, workflow table, and subagent architecture diagram |

### Medium (improve incrementally)

| # | Issue | Dimension | Status |
|---|-------|-----------|--------|
| 11 | `code.json` stores unnecessary large blobs | Efficiency | |
| 12 | Silent browser-connect fallback makes debugging impossible | Quality | DONE — `browser-connect.js` now logs reason (missing endpoint file vs unreachable endpoint) before launching standalone browser |
| 13 | No subagent timeout — Playwright hangs block pipeline | Quality | DONE — `screenshot.js` gets 60s process timeout, `inspect-styles.js` gets 90s process timeout; orchestrator and build-tier error tables updated with timeout guidance |
| 14 | Tailwind mapping / `fixSizing()` duplicated across files | Quality | |
| 15 | Responsive behavior entirely absent (1440x900 only) | Accuracy | |
| 16 | Screenshot scale mismatch between Playwright and Figma | Accuracy | DONE — `screenshot.js` enforces `deviceScaleFactor: 1`; skill docs require `scale: 1` for all `get_screenshot` calls; orchestrator documents the 1x scale convention |
| 17 | Triple redundancy in result storage (per-component + tier + state) | Efficiency | |
| 18 | Partial-tier resume algorithm unspecified | Quality | 
