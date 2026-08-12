#!/usr/bin/env node
/**
 * Creates and seeds the database if it is missing, then gets out of the way.
 *
 * Runs automatically before `npm run dev` (as npm's `predev` hook). It exists so that pulling
 * new changes and restarting never leaves you staring at
 * "The table `main.Case` does not exist in the current database" - if the database the current
 * DATABASE_URL points at is not there, this pushes the schema and seeds it.
 *
 * Silent and fast when the database already exists, which is the normal case.
 *
 * Note on path resolution: Prisma resolves a relative `file:` URL against the directory holding
 * the schema (packages/shared/prisma/), NOT the project root or the CWD. This script deliberately
 * mirrors that rule so it always checks the same file Prisma will actually open.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const schemaDir = join(repoRoot, 'packages', 'shared', 'prisma');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('[ensure-db] DATABASE_URL is not set; skipping database check.');
  console.error('[ensure-db] Run `npm run setup` if the app cannot reach its database.');
  process.exit(0);
}

if (!databaseUrl.startsWith('file:')) {
  process.exit(0);
}

const rawPath = databaseUrl.slice('file:'.length);
const dbPath = isAbsolute(rawPath) ? rawPath : resolve(schemaDir, rawPath);

const present = existsSync(dbPath) && statSync(dbPath).size > 0;
if (present) {
  process.exit(0);
}

console.log(`[ensure-db] No database found at ${dbPath}`);
console.log('[ensure-db] Creating and seeding it now (this happens once)...');

const result = spawnSync('npm', ['run', 'db:setup'], {
  cwd: repoRoot,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.status !== 0) {
  console.error('\n[ensure-db] Could not set up the database automatically.');
  console.error('[ensure-db] Try running `npm run setup` manually.');
  process.exit(result.status ?? 1);
}

console.log('[ensure-db] Database ready.');
