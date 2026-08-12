#!/usr/bin/env node
/**
 * Keeps the root `.env` usable:
 *   1. Creates it from `.env.example` if it does not exist.
 *   2. Repairs a DATABASE_URL left over from an older version of this repo.
 *
 * Why (1): Prisma needs DATABASE_URL both at CLI time (`db:push`, `db:seed`) and at runtime
 * (`@prisma/client` bundles no dotenv loader). Docker Compose and the devcontainer inject it, so
 * only host runs need the file - creating it automatically means nobody has to know that.
 *
 * Why (2): this repo previously shipped several different DATABASE_URL values, each of which
 * resolved to a different (wrong) location. An existing `.env` would otherwise keep a machine
 * pinned to its old database path forever, silently, because step 1 never overwrites.
 * Only the specific values this repo used to ship are migrated - a genuinely custom value is
 * left alone.
 *
 * Real environment variables always win over this file, so Compose and CI keep full control.
 */
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = join(repoRoot, '.env');
const examplePath = join(repoRoot, '.env.example');

/** DATABASE_URL values this repo shipped before the paths were unified. Safe to migrate. */
const SUPERSEDED_DATABASE_URLS = [
  'file:./packages/server/db/dev.db',
  'file:./prisma/dev.db',
  'file:./db/dev.db',
  'file:./dev.db',
];

if (!existsSync(examplePath)) {
  console.error('[ensure-env] .env.example is missing; cannot create or check .env');
  process.exit(1);
}

const exampleText = readFileSync(examplePath, 'utf8');

if (!existsSync(envPath)) {
  copyFileSync(examplePath, envPath);
  console.log('[ensure-env] created .env from .env.example');
  process.exit(0);
}

const DATABASE_URL_LINE = /^\s*DATABASE_URL\s*=\s*(.*)$/;
const unquote = (value) => value.trim().replace(/^["']|["']$/g, '');

const canonicalLine = exampleText
  .split('\n')
  .find((line) => DATABASE_URL_LINE.test(line));

if (!canonicalLine) {
  process.exit(0);
}

const canonicalValue = unquote(canonicalLine.match(DATABASE_URL_LINE)[1]);

const envLines = readFileSync(envPath, 'utf8').split('\n');
const index = envLines.findIndex((line) => DATABASE_URL_LINE.test(line));

if (index === -1) {
  const needsNewline = envLines[envLines.length - 1] !== '';
  writeFileSync(envPath, `${envLines.join('\n')}${needsNewline ? '\n' : ''}${canonicalLine}\n`);
  console.log('[ensure-env] .env had no DATABASE_URL; added the standard one');
  process.exit(0);
}

const currentValue = unquote(envLines[index].match(DATABASE_URL_LINE)[1]);

if (currentValue === canonicalValue) {
  process.exit(0);
}

if (!SUPERSEDED_DATABASE_URLS.includes(currentValue)) {
  process.exit(0);
}

envLines[index] = canonicalLine;
writeFileSync(envPath, envLines.join('\n'));
console.log('[ensure-env] Updated an outdated DATABASE_URL in your .env:');
console.log(`             was: ${currentValue}`);
console.log(`             now: ${canonicalValue}`);
console.log('[ensure-env] Your database now lives at packages/server/db/dev.db');
