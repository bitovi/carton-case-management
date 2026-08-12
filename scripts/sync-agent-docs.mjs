#!/usr/bin/env node
/**
 * Generates the path-scoped GitHub Copilot instruction files from the package CLAUDE.md files.
 *
 * Why this exists: Copilot reads the root `CLAUDE.md` directly, so no root mirror is needed. What
 * it does not do is apply a nested `packages/<pkg>/CLAUDE.md` only to files in that package -
 * that path scoping comes from the `applyTo` frontmatter on `.github/instructions/*.instructions.md`.
 * Those files used to be hand-maintained copies and had already drifted from their CLAUDE.md
 * counterparts, so they are generated instead.
 *
 * The only difference between a source file and its mirror is the frontmatter and this banner.
 *
 *   npm run sync:agent-docs         regenerate the mirrors
 *   npm run sync:agent-docs:check   fail if the mirrors are stale (used in CI)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const checkOnly = process.argv.includes('--check');

const PACKAGES = ['client', 'server', 'shared'];

function banner(source) {
  return [
    '<!--',
    '  GENERATED FILE - DO NOT EDIT.',
    '',
    '  Edit the source CLAUDE.md instead, then run:  npm run sync:agent-docs',
    `  Source of truth for this file: ${source}`,
    '-->',
  ].join('\n');
}

/** A package mirror is its CLAUDE.md verbatim, plus Copilot's `applyTo` frontmatter. */
function buildPackageDoc(pkg) {
  const source = readFileSync(join(repoRoot, 'packages', pkg, 'CLAUDE.md'), 'utf8');
  const frontmatter = `---\napplyTo: packages/${pkg}/**\n---\n`;
  return `${frontmatter}\n${banner(`packages/${pkg}/CLAUDE.md`)}\n\n${source}`;
}

const targets = PACKAGES.map((pkg) => ({
  path: join('.github', 'instructions', `${pkg}.instructions.md`),
  content: buildPackageDoc(pkg),
}));

const stale = [];
for (const { path, content } of targets) {
  const absolute = join(repoRoot, path);
  let current = null;
  try {
    current = readFileSync(absolute, 'utf8');
  } catch {
    current = null;
  }

  if (current === content) continue;

  if (checkOnly) {
    stale.push(path);
  } else {
    writeFileSync(absolute, content);
    console.log(`[sync-agent-docs] wrote ${path}`);
  }
}

if (checkOnly) {
  if (stale.length > 0) {
    console.error('[sync-agent-docs] These generated files are out of date:');
    for (const path of stale) console.error(`  - ${path}`);
    console.error('\nFix with:  npm run sync:agent-docs');
    process.exit(1);
  }
  console.log('[sync-agent-docs] generated Copilot docs are up to date');
} else {
  console.log('[sync-agent-docs] done');
}
