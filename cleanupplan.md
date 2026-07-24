# Carton Case Management — Cleanup Execution Plan

**Purpose:** This is the step-by-step execution plan derived from all the research and decisions in [cleanup.md](cleanup.md). Review each phase and confirm — once approved, execution happens phase by phase on the working branch below.

**Working branch:** `main-cleanup`, created off `main`. **`main` itself is never touched directly** — this whole plan lands on `main-cleanup`, gets reviewed, and only then gets merged into `main`.

**Explicitly out of scope (not touched by this plan):** `infra/` (Terraform), `.github/workflows/deploy*.yaml`, `.github/workflows/db_reset*.yaml` — production deployment concerns, confirmed out of scope in [cleanup.md §17](cleanup.md#17-additional-questions-round-3--before-starting-execution).

**Status key:** ☐ not started · 🔄 in progress · ✅ done

---

## Phase 0 — Branch setup

- ☐ Create `main-cleanup` branch off current `main`.
- ☐ All subsequent phases commit to this branch (suggest one commit per phase for easy review, but open to squashing at the end).

---

## Phase 1 — Node.js version standardization

Reference: [cleanup.md §4 Node.js version audit](cleanup.md), [§15 Q14](cleanup.md).

- ☐ Add to root `package.json`: `"engines": { "node": ">=24 <25" }`.
- ☐ Fix `.github/workflows/ci.yml`: change all 3 `node-version: '20'` → `'24'`.
- ☐ Bump `packages/server/package.json`'s `@types/node` from `^22.10.5` to the `^24.x` line matching Node 24.
- ☐ Verify `.nvmrc` (already `24`) and all Dockerfiles (already `node:24-*`) need no change.

---

## Phase 2 — `DATABASE_URL` fix + `.env` elimination

Reference: [cleanup.md §3](cleanup.md), [§16.2](cleanup.md).

**Canonical value going forward:** `file:../../server/db/dev.db` (relative to `packages/shared/prisma/schema.prisma`, resolves to `packages/server/db/dev.db` — matches where the db file actually lives today).

- ☐ Create a small, dependency-free cross-platform helper (e.g. `scripts/with-db-env.mjs`) that sets `process.env.DATABASE_URL` to the canonical value **only if not already set** (`??=`), then spawns the rest of the command — this is what lets `DATABASE_URL` be supplied without any `.env` file, while still being overridable (e.g. by Playwright's `webServer.env` in Phase 3, or an advanced user's own shell export).
- ☐ Update root `package.json` scripts that touch the database (`dev:server`, `db:generate`, `db:push`, `db:seed`, `db:setup`, `db:studio`, `build:server`) to run through this helper instead of relying on a loaded `.env` file.
- ☐ Confirm `packages/server/src/index.ts`'s existing `PORT`/`CLIENT_URL` env-var defaults (`3001`/`http://localhost:5173`) need no change for the default dev path — no `.env` needed for these either.
- ☐ Delete `.env`, `.env.example`, `packages/server/.env.example`.
- ☐ Update `.gitignore`: the `.env` ignore rules can stay (harmless if unused) or be removed — low priority either way.
- ☐ Update `.devcontainer/devcontainer.json`: remove the `postCreateCommand`'s `cp -n packages/server/.env.example packages/server/.env` step (file no longer exists) and fix `containerEnv.DATABASE_URL` to the canonical value (or remove it now that the helper script supplies it).
- ☐ `MOCK_USER_EMAIL`: no code change — already defaults to "first seeded user" when unset. Document the optional one-off override (`MOCK_USER_EMAIL=someone@carton.com npm run dev:server`) in the new README (Phase 9). No UI switcher (decided against, for now).

---

## Phase 3 — E2E test isolation (database + ports)

Reference: [cleanup.md §13](cleanup.md), [§16.3](cleanup.md), [§16.4](cleanup.md).

**Canonical e2e values:** test db file `packages/server/db/test.db`; server port `3101`; client port `5273` (adjust if you'd prefer different numbers — not load-bearing).

- ☐ Extract the wipe-and-reseed logic in [packages/server/db/seed.ts](packages/server/db/seed.ts) into a small reusable exported function (e.g. `resetAndSeed()`), keeping `db:seed`'s current behavior identical.
- ☐ Make `packages/client/vite.config.ts`'s `server.port` and the `/trpc` proxy `target` read from env vars with today's values (`5173`, `http://localhost:3001`) as defaults — no behavior change for normal `npm run dev`.
- ☐ Add a Playwright `globalSetup` that, once per e2e run: pushes the schema to `packages/server/db/test.db` and calls `resetAndSeed()` against it.
- ☐ Update `playwright.config.ts`:
  - `webServer` entries get an `env` block setting `DATABASE_URL` (test db path), `PORT: '3101'`, `CLIENT_URL: 'http://localhost:5273'`, `VITE_PORT: '5273'`, `VITE_PROXY_TARGET: 'http://localhost:3101'`.
  - `use.baseURL` and the `webServer[].url` health-check targets updated to the new e2e ports.
  - Set `workers: 1` for local runs (not just CI) so tests never run concurrently against the shared test db file — per the researched standard-practice decision in §16.3.
- ☐ Update `tests/e2e/create-case.spec.ts` (and any other test that creates data with fixed literal names) to use a unique value per test run (timestamp/random suffix) rather than a hardcoded string.
- ☐ Update `.github/workflows/ci.yml`'s `e2e-tests` job to just call `npm run test:e2e` instead of hand-rolling its own `DATABASE_URL`/`db:setup` steps — the isolation is now baked into the script/config itself.
- ☐ Result to verify at the end of this phase: `npm run dev` and `npm run test:e2e` can run at the same time, in two terminals, without any port conflict or shared data.

---

## Phase 4 — Port pre-flight check + `/help` skill

Reference: [cleanup.md §11](cleanup.md), [§12](cleanup.md).

- ☐ Write a small, dependency-free cross-platform script (e.g. `scripts/free-ports.mjs`) that, for each of the known app ports (5173, 3001, 6006, 9323 — plus the new e2e ports 5273/3101 if relevant), detects what's holding it:
  - Native process → macOS/Linux via `lsof`, Windows via `netstat`/`taskkill`.
  - Docker container → `docker ps --filter publish=<port>`.
  - Prints what it found before freeing it (transparency, per your teaching-tool preference from §12), then frees it without requiring confirmation (per §15 Q11 decision).
- ☐ Wire this script in as an optional pre-flight step before `npm run dev` (e.g. a `predev` script), and make it callable standalone too.
- ☐ Create `.claude/skills/help/SKILL.md`:
  - `name: help`, `description` written to trigger proactively on any setup/runtime error, not just literal `/help` invocations.
  - Body: the decision-tree from §11 (detect runtime → check Node version/deps/db/ports → map common error signatures to fixes → always show the exact commands, don't silently fix things).
  - References the port pre-flight script and the canonical `DATABASE_URL`/Node-version facts from Phases 1–2.

---

## Phase 5 — Agent context consolidation

Reference: [cleanup.md §7](cleanup.md), [§15 Q3, Q4, Q8](cleanup.md).

- ☐ Delete `.github/copilot-instructions.md` (root `CLAUDE.md` becomes the single always-on file, already read by both Copilot and Claude Code).
- ☐ Confirmed: nested `packages/{client,server,shared}/CLAUDE.md` already exist and are already more detailed than their `.github/instructions/*.instructions.md` counterparts — no content needs to be created, just re-pointed.
- ☐ For each of `.github/instructions/client.instructions.md`, `server.instructions.md`, `shared.instructions.md`: diff quickly against the corresponding nested `CLAUDE.md` to confirm no unique content would be lost, then replace the body with a one-line pointer (keeping the existing `applyTo` frontmatter so Copilot still auto-attaches it), e.g.:
  ```markdown
  ---
  applyTo: packages/client/**
  ---
  See [packages/client/CLAUDE.md](../../packages/client/CLAUDE.md) for guidelines for this package.
  ```
- ☐ Remove legacy spec-kit: delete `.specify/`, `specs/` (including `specs/context/`), `.github/prompts/speckit.*.prompt.md` (8 files), `.claude/agents/speckit-*.md` (7 files).
- ☐ Remove the 13 "cascade" Jira/Figma skills from `.claude/skills/`: `cascade-analyze-feature-scope`, `cascade-analyze-figma-frame`, `cascade-analyze-figma-frame-mcp`, `cascade-answer-design-questions-post-to-figma`, `cascade-answer-design-questions-post-to-jira`, `cascade-load-linked-resource-content`, `cascade-post-design-questions-to-figma`, `cascade-post-design-questions-to-jira`, `cascade-summarize-document-content`, `generate-behavior-questions`, `write-jira-story`, `write-next-story-from-shell-story`, `write-shell-stories`.
- ☐ Keep everything else: `figma:parse`/`figma:publish` scripts, `figma-*` skills (component-reuse, figma-component-sync, figma-connect-component, figma-connect-shadcn, figma-design-react, figma-explore, figma-implement-component), `create-react-modlet`, `cross-package-types`, `validate-implementation`, `create-skill`.
- ☐ Update root `CLAUDE.md`'s "Skills" table to remove references to the deleted cascade skills and spec-kit prompts/agents.

---

## Phase 6 — Docker & Docker Compose consolidation

Reference: [cleanup.md §16.1](cleanup.md) (agreed as-is).

- ☐ Delete `Dockerfile.original` (dead duplicate, not referenced anywhere).
- ☐ Create one consolidated multi-stage `Dockerfile` with targets:
  - `base` — shared system + Playwright `apt-get` packages on `node:24-bookworm`.
  - `devcontainer` — `= base`, nothing more (used by `.devcontainer/devcontainer.json`).
  - `dev` — `base` + copy source + `npm run setup` + `CMD npm run dev` (used by the standalone `docker compose` path).
  - `test` — `base` + Playwright Chromium install + build (used by the Docker-based test path).
- ☐ Delete `Dockerfile.test` (folded into the `test` target above).
- ☐ Leave `Dockerfile.aws` untouched (genuinely different, minimal production build, out of scope per Phase 0's deployment carve-out).
- ☐ Merge `docker-compose.dev.yaml` + `docker-compose.local.yaml` into one file with two services (`app` targeting `devcontainer`, `app-standalone` targeting `dev`), sharing common `build`/`volumes`/`ports` config via a YAML anchor.
- ☐ Fix `DATABASE_URL` in every remaining compose file (including `docker-compose.test.yaml`) to the canonical value from Phase 2.
- ☐ Fix `docker-compose.test.yaml`'s hardcoded `sleep 5` wait-hack to use a proper health-check wait (matching the approach `playwright.config.ts` already uses) instead of a fixed sleep.
- ☐ Update `.devcontainer/devcontainer.json`'s `dockerComposeFile` reference and `package.json`'s `docker:up`/`docker:dev`/`docker:down` scripts if the merged filename changes.
- ☐ Net result to verify: **5 Dockerfiles → 2**, **4 compose files → 3**.

---

## Phase 7 — Root directory cleanup

Reference: [cleanup.md §2](cleanup.md), [§10](cleanup.md).

- ☐ Delete `superconnect.toml`, `superconnect.old.toml` (unmaintained internal tool, unrelated to Figma Code Connect which stays).
- ☐ Delete `AI_RULES.md` (stale pre-monorepo scaffold doc, contradicted by reality).
- ☐ Delete `TODO.md` (fold anything still-true into the new README/ARCHITECTURE in Phase 9 first, then delete).
- ☐ Confirm `.npmrc`/`.nvmrc` need no changes.

---

## Phase 8 — `package.json` script trim

Reference: [cleanup.md §5](cleanup.md).

- ☐ Collapse the per-package `test:coverage:*` and `typecheck:*` variants into general-purpose `--workspace=` usage (documented in README/CLAUDE.md instead of a named script each).
- ☐ Split Playwright browser installation out of `test:e2e` into its own explicit one-time setup step (e.g. `test:e2e:install`), so `test:e2e` itself doesn't reinstall browsers on every run.
- ☐ Keep `figma:parse`/`figma:publish` (confirmed still-used, Phase 5).
- ☐ Re-verify the final script list reads cleanly end-to-end against the new README (Phase 9).

---

## Phase 9 — Documentation rewrite

Reference: [cleanup.md §10](cleanup.md).

- ☐ Rewrite `README.md`: single accurate "how to run this" doc covering all 4 supported runtimes (bare Node as default, devcontainer, plain `docker compose`, Codespaces — with a note to smoke-test Codespaces per [cleanup.md §15 Q2](cleanup.md)), correct the Jest→Vitest error, document the canonical `DATABASE_URL`/ports/Node version, remove the stray scratch-note lines pasted above the title.
- ☐ Update `ARCHITECTURE.md`: add the runtime/env-option summary and the mock-auth system explanation currently only in the (soon rewritten) README.
- ☐ Confirm `CLAUDE.md` (root) and all nested `packages/*/CLAUDE.md` are internally consistent with the final state of this plan (ports, db path, scripts, skills list).

---

## Phase 10 — Branch cleanup

Reference: [cleanup.md §9](cleanup.md), [§15 Q7](cleanup.md).

- ☐ Delete all remote branches matching `copilot/*` (~90 branches — automated retry noise).
- ☐ Delete all remote branches matching `dependabot/npm_and_yarn/*` (10 branches).
- ☐ Leave every other branch untouched (training branches, named/person branches, spec-kit feature branches, misc) — no action taken on these without your separate triage.
- ☐ This phase requires an explicit go-ahead at execution time since deleting remote branches is a destructive, hard-to-reverse action on shared infrastructure.

---

## Phase 11 — Dependency prune pass

Reference: [cleanup.md §6](cleanup.md), [§15 Q10](cleanup.md).

- ☐ Run an actual unused-dependency check (e.g. `depcheck` or `knip`) per package rather than relying on manual inspection.
- ☐ Specifically verify: is `zod-prisma-types` actually imported at runtime in `packages/client` (flagged as likely-misplaced in dependencies instead of devDependencies)?
- ☐ Keep Storybook (explicitly confirmed to stay).
- ☐ Report findings before removing anything, since this phase is more exploratory than the others.

---

## Phase 12 — Application code cleanup (new, per your request)

This is a different category from Phases 1–11 — those are tooling/config/docs; this one is the actual application source in `packages/client`, `packages/server`, `packages/shared`. Placed last because it depends on everything above already being stable: a working, fast test suite (Phase 3) and a consistent Node/script setup (Phases 1, 8) are what let changes here be validated safely instead of just "looks right." It also shares tooling with Phase 11 — `knip` finds unused dependencies *and* unused files/exports/dead code in the same pass, so these two phases can be done together.

- ☐ Run `knip` (or equivalent) across all three packages specifically for **dead code**, not just dependencies: unused exports, unreferenced files/components, orphaned types.
- ☐ Run `eslint --fix` and `prettier --write` across all packages — mechanical, low-risk, catches a lot on its own.
- ☐ Run the existing [`validate-implementation`](.claude/skills/validate-implementation/SKILL.md) skill (kept per Phase 5) against the client to catch runtime/accessibility/API-compliance issues as part of this pass, since that's exactly what it's built for.
- ☐ Manual pass for consistency with this repo's own documented conventions (from `CLAUDE.md`/nested package `CLAUDE.md` files) that automated tools won't catch: modlet-pattern compliance, no inline comments in `.ts`/`.tsx` files, Tailwind-only styling in external CSS (not inline), custom-hook extraction thresholds (>3 related state pieces, >100 lines, etc.), leftover `console.log`/debug code, stale comments referencing the now-deleted spec-kit features (001–004).
- ☐ **Guardrail:** do this incrementally per package (`shared` → `server` → `client`, matching the dependency direction), running `typecheck`/`lint`/unit tests after each package, and the full e2e suite (now isolated per Phase 3, so it's safe to run freely) before considering this phase done. Scope to *safe* cleanup (dead code removal, formatting, obvious convention fixes) rather than deep behavioral refactors unless something specific comes up worth flagging separately.
- ☐ Report findings/diff summary before/as you go, given this is the most open-ended, judgment-heavy phase of the plan.

---

## Suggested execution order & checkpoints

Phases 1–2 (Node + db/env) are foundational — everything else assumes a single canonical `DATABASE_URL` and Node version, so these go first. Phase 3 (e2e isolation) builds directly on Phase 2. Phases 4–9 are largely independent of each other and could be reordered if you want to see results in a different sequence. Phase 10 (branch deletion), Phase 11 (dependency prune), and Phase 12 (application code cleanup) are best done last: 10 is independent of the rest, and 11/12 benefit from a stable, working test suite (Phase 3) to validate against safely.

**Recommended checkpoint cadence:** given this touches a lot of surface area, suggest a quick check-in after Phase 2 (db/env — the highest-value, most foundational fix), after Phase 6 (Docker — the phase you're least familiar with), and after Phase 12 (the most open-ended/judgment-heavy phase, worth reviewing the diff before it's considered final) before continuing. Let me know if you'd rather review after each one instead.
