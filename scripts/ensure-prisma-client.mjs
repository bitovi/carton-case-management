#!/usr/bin/env node
/**
 * Regenerates Prisma Client (and the Zod schemas) when what is on disk is missing or stale.
 *
 * Why this exists: `@prisma/client`'s own postinstall only finds a schema at the default
 * `prisma/schema.prisma`. Ours lives at `packages/shared/prisma/schema.prisma`, so npm leaves an
 * un-generated stub behind and *every* `npm install` silently resets it. The symptom is confusing
 * and unrelated-looking:
 *
 *   Error: @prisma/client did not initialize yet. Please run "prisma generate"
 *   TS7006: Parameter 'user' implicitly has an 'any' type      <- tRPC inference collapsing
 *
 * Runs from `postinstall`, and again before `dev`/`test` so a stale checkout heals itself.
 * Silent and fast in the normal case: two file reads, no subprocess.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const sourceSchema = join(repoRoot, 'packages', 'shared', 'prisma', 'schema.prisma');

/** `prisma generate` drops a copy of the schema next to the client it generated, which makes it a
 *  reliable "did it run?" marker. Compare by mtime, not content: the copy is reformatted, so it is
 *  never byte-identical to the source. */
const generatedSchema = join(repoRoot, 'node_modules', '.prisma', 'client', 'schema.prisma');

/** The `zod` generator's output. Gitignored, so a fresh clone never has it. */
const generatedZod = join(repoRoot, 'packages', 'shared', 'src', 'generated', 'index.ts');

const mtime = (path) => (existsSync(path) ? statSync(path).mtimeMs : null);

const sourceMtime = mtime(sourceSchema);
if (sourceMtime === null) {
  console.error(`[ensure-prisma-client] No schema at ${sourceSchema}; skipping.`);
  process.exit(0);
}

const generatedMtime = mtime(generatedSchema);

let reason = null;
if (generatedMtime === null) {
  reason = 'Prisma Client has not been generated yet';
} else if (sourceMtime > generatedMtime) {
  reason = 'the schema changed since Prisma Client was last generated';
} else if (!existsSync(generatedZod)) {
  reason = 'the generated Zod schemas are missing';
}

if (!reason) {
  process.exit(0);
}

console.log(`[ensure-prisma-client] ${reason}.`);
console.log('[ensure-prisma-client] Running `npm run db:generate`...');

const result = spawnSync('npm', ['run', 'db:generate'], {
  cwd: repoRoot,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.status !== 0) {
  console.error('\n[ensure-prisma-client] Could not generate Prisma Client.');
  console.error('[ensure-prisma-client] Try running `npm run db:generate` manually.');
  process.exit(result.status ?? 1);
}
