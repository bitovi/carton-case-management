#!/usr/bin/env node
/**
 * verify-story-index.js
 *
 * Fast validation that a .figma-variants.stories.tsx file:
 *   1. Has valid syntax (checked via Storybook's own Babel parser)
 *   2. Appears in Storybook's index.json with the expected ID prefix
 *
 * Usage:
 *   node verify-story-index.js \
 *     --component-name Button \
 *     --story-file packages/client/src/components/ui/Button/Button.figma-variants.stories.tsx \
 *     [--storybook-url http://localhost:6006] \
 *     [--timeout 15000] \
 *     [--interval 500]
 *
 * Exit codes:
 *   0 = stories found in index
 *   1 = failure (syntax error, not found, timeout)
 *
 * Stdout: JSON result object
 * Stderr: human-readable summary
 */

const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    componentName: null,
    storyFile: null,
    storybookUrl: 'http://localhost:6006',
    timeout: 15000,
    interval: 500,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--component-name': opts.componentName = args[++i]; break;
      case '--story-file': opts.storyFile = args[++i]; break;
      case '--storybook-url': opts.storybookUrl = args[++i]; break;
      case '--timeout': opts.timeout = parseInt(args[++i], 10); break;
      case '--interval': opts.interval = parseInt(args[++i], 10); break;
    }
  }

  if (!opts.componentName) {
    console.error('Missing required --component-name');
    process.exit(2);
  }
  if (!opts.storyFile) {
    console.error('Missing required --story-file');
    process.exit(2);
  }

  return opts;
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${e.message}`));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy(new Error('Request timeout'));
    });
  });
}

function syntaxCheck(storyFile) {
  const absPath = path.resolve(storyFile);
  if (!fs.existsSync(absPath)) {
    return { ok: false, error: `File not found: ${absPath}` };
  }

  try {
    const { loadCsf } = require('@storybook/core/csf-tools');
    const code = fs.readFileSync(absPath, 'utf-8');
    loadCsf(code, { fileName: absPath, makeTitle: () => 'test' });
    return { ok: true };
  } catch (csfError) {
    if (csfError.code === 'MODULE_NOT_FOUND') {
      return { ok: true };
    }

    const loc = csfError.loc || (csfError.pos != null ? { line: '?', column: csfError.pos } : null);
    const locStr = loc ? ` (${loc.line}:${loc.column})` : '';
    return {
      ok: false,
      error: `${csfError.message}`,
      location: locStr,
    };
  }
}

function findMatchingStories(indexJson, componentName) {
  if (!indexJson || !indexJson.entries) return [];

  const prefix = `figma-variants-${componentName.toLowerCase()}--`;
  return Object.entries(indexJson.entries)
    .filter(([id]) => id.startsWith(prefix) && !id.endsWith('--docs'))
    .map(([id, meta]) => ({
      id,
      title: meta.title,
      exportName: meta.name || id.split('--')[1] || id,
    }));
}

function findWrongPrefixStories(indexJson, componentName) {
  if (!indexJson || !indexJson.entries) return [];

  const nameLower = componentName.toLowerCase();
  return Object.entries(indexJson.entries)
    .filter(([id]) => id.includes(nameLower) && id.includes('figma') && !id.startsWith(`figma-variants-${nameLower}--`))
    .map(([id]) => id);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function pollForStories(opts) {
  const { componentName, storybookUrl, timeout, interval } = opts;
  const startTime = Date.now();
  const deadline = startTime + timeout;
  let lastError = null;
  let attempts = 0;

  while (Date.now() < deadline) {
    attempts++;
    try {
      const indexJson = await fetchJson(`${storybookUrl}/index.json`);
      const stories = findMatchingStories(indexJson, componentName);

      if (stories.length > 0) {
        return {
          status: 'pass',
          stories,
          attempts,
          elapsed: Date.now() - startTime,
        };
      }

      const wrongPrefix = findWrongPrefixStories(indexJson, componentName);
      if (wrongPrefix.length > 0) {
        return {
          status: 'wrong-prefix',
          wrongPrefix,
          attempts,
          suggestion: `Stories exist but under wrong ID. Expected prefix: figma-variants-${componentName.toLowerCase()}--. Fix the title field to: Figma Variants/${componentName}`,
        };
      }
    } catch (err) {
      lastError = err.message;
    }

    if (Date.now() + interval < deadline) {
      await sleep(interval);
    } else {
      break;
    }
  }

  return {
    status: lastError ? 'error' : 'timeout',
    error: lastError || `No stories found after ${timeout}ms (${attempts} attempts)`,
    attempts,
    suggestion: `Storybook may not have reindexed yet, or the story file has a different title. Expected: title: 'Figma Variants/${componentName}'`,
  };
}

function output(result) {
  process.stdout.write(JSON.stringify(result) + '\n');

  switch (result.status) {
    case 'pass':
      process.stderr.write(`✓ Found ${result.stories.length} stories for ${result.componentName} (${result.elapsed}ms, ${result.attempts} poll${result.attempts === 1 ? '' : 's'})\n`);
      break;
    case 'syntax-error':
      process.stderr.write(`✗ Syntax error in ${result.storyFile}${result.location || ''}: ${result.error}\n`);
      break;
    case 'file-not-found':
      process.stderr.write(`✗ Story file not found: ${result.storyFile}\n`);
      break;
    case 'wrong-prefix':
      process.stderr.write(`✗ Stories found under wrong prefix. ${result.suggestion}\n`);
      result.wrongPrefix.forEach(id => process.stderr.write(`  ${id}\n`));
      break;
    case 'timeout':
    case 'error':
      process.stderr.write(`✗ ${result.error}\n`);
      if (result.suggestion) process.stderr.write(`  → ${result.suggestion}\n`);
      break;
  }
}

async function main() {
  const opts = parseArgs();

  const absStoryFile = path.resolve(opts.storyFile);
  if (!fs.existsSync(absStoryFile)) {
    const result = { status: 'file-not-found', componentName: opts.componentName, storyFile: opts.storyFile };
    output(result);
    process.exit(1);
  }

  const syntaxResult = syntaxCheck(opts.storyFile);
  if (!syntaxResult.ok) {
    const result = {
      status: 'syntax-error',
      componentName: opts.componentName,
      storyFile: opts.storyFile,
      error: syntaxResult.error,
      location: syntaxResult.location || null,
    };
    output(result);
    process.exit(1);
  }

  const pollResult = await pollForStories(opts);
  const result = {
    ...pollResult,
    componentName: opts.componentName,
    storyFile: opts.storyFile,
  };
  output(result);
  process.exit(result.status === 'pass' ? 0 : 1);
}

main().catch(err => {
  console.error(`Fatal: ${err.message}`);
  process.exit(2);
});
