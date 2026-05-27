#!/usr/bin/env node
/**
 * Batch screenshot download + pixel-diff verification for a component.
 *
 * Replaces the Verify Subagent workflow entirely:
 *   1. Reads figma-result.json (or parses figma-result.md as fallback)
 *   2. Calls Figma REST API /v1/images/:fileKey in ONE batch request
 *   3. Downloads all Figma PNGs in parallel
 *   4. Runs compare.js on each (react screenshot vs figma screenshot)
 *   5. Writes verification-results.json
 *
 * Requires FIGMA_ACCESS_TOKEN env var (or --token flag).
 *
 * Usage:
 *   node batch-screenshot-and-verify.js \
 *     --component-dir .temp/react-to-figma/components/Badge \
 *     --file-key K185dncc0RbBmFGFxA1iyY \
 *     [--token <figma-pat>] \
 *     [--scale 2] \
 *     [--concurrency 10] \
 *     [--match-threshold 90]
 *
 * Exit codes:  0 = all pass, 1 = minor diffs, 2 = failures, 3 = fatal error
 */

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const https = require('https');
const http = require('http');

function loadEnvFile() {
  const candidates = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(__dirname, '../../../../../.env'),
  ];
  for (const envPath of candidates) {
    if (fs.existsSync(envPath)) {
      const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
      for (const line of lines) {
        const match = line.match(/^([A-Z_]+)=(.+)$/);
        if (match && !process.env[match[1]]) {
          process.env[match[1]] = match[2].trim();
        }
      }
      return;
    }
  }
}
loadEnvFile();

function parseArgs(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--') && i + 1 < argv.length) {
      const key = argv[i].slice(2);
      flags[key] = argv[i + 1];
      i++;
    }
  }
  return flags;
}

function loadFigmaResultJSON(jsonPath) {
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const variants = (data.variantsBuilt || []).map(v => ({
    name: v.name || v.variantName,
    nodeId: v.nodeId || v.rootNodeId,
  }));
  return { variants, fileKey: data.fileKey || null };
}

function parseFigmaResultMD(mdPath) {
  const content = fs.readFileSync(mdPath, 'utf-8');
  const variants = [];

  let fileKey = null;
  const fileKeyMatch = content.match(/\*\*File Key:\*\*\s*(\S+)/);
  if (fileKeyMatch) fileKey = fileKeyMatch[1];

  const tableRegex = /^\|\s*\d+\s*\|\s*(.+?)\s*\|\s*(\d+:\d+)\s*\|$/gm;
  let match;
  while ((match = tableRegex.exec(content)) !== null) {
    variants.push({
      name: match[1].trim(),
      nodeId: match[2].trim(),
    });
  }
  return { variants, fileKey };
}

function fetchJSON(url, token) {
  return new Promise((resolve, reject) => {
    const parsed = new URL(url);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      headers: { 'X-FIGMA-TOKEN': token },
    };
    https.get(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`Figma API ${res.statusCode}: ${body}`));
          return;
        }
        try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    const protocol = url.startsWith('https') ? https : http;
    const request = protocol.get(url, (response) => {
      if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
        downloadFile(response.headers.location, destPath).then(resolve).catch(reject);
        return;
      }
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode} for ${url}`));
        return;
      }
      const file = fs.createWriteStream(destPath);
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', reject);
    });
    request.on('error', reject);
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error(`Timeout downloading ${url}`));
    });
  });
}

async function runConcurrent(tasks, concurrency) {
  const results = [];
  let idx = 0;
  async function worker() {
    while (idx < tasks.length) {
      const i = idx++;
      results[i] = await tasks[i]().catch(err => ({ error: err.message }));
    }
  }
  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

async function main() {
  const flags = parseArgs(process.argv.slice(2));
  const componentDir = flags['component-dir'];
  let fileKey = flags['file-key'];
  const token = flags['token'] || process.env.FIGMA_ACCESS_TOKEN;
  const scale = flags['scale'] || '2';
  const concurrency = parseInt(flags['concurrency'] || '10', 10);
  const matchThreshold = flags['match-threshold'];

  if (!componentDir) {
    console.error('Missing --component-dir');
    process.exit(3);
  }
  if (!token) {
    console.error('Missing FIGMA_ACCESS_TOKEN env var or --token flag');
    process.exit(3);
  }

  const absComponentDir = path.resolve(componentDir);
  const figmaResultJsonPath = path.join(absComponentDir, 'figma-result.json');
  const figmaResultMdPath = path.join(absComponentDir, 'figma-result.md');

  let parsed;
  if (fs.existsSync(figmaResultJsonPath)) {
    parsed = loadFigmaResultJSON(figmaResultJsonPath);
  } else if (fs.existsSync(figmaResultMdPath)) {
    console.warn('  figma-result.json not found, falling back to figma-result.md');
    parsed = parseFigmaResultMD(figmaResultMdPath);
  } else {
    console.error(`Neither figma-result.json nor figma-result.md found in: ${absComponentDir}`);
    process.exit(3);
  }
  if (!fileKey) fileKey = parsed.fileKey;
  if (!fileKey) {
    console.error('No --file-key and none found in figma-result.md');
    process.exit(3);
  }

  const { variants } = parsed;
  if (variants.length === 0) {
    console.error('No variants found in figma-result.md');
    process.exit(3);
  }

  const componentName = path.basename(absComponentDir);
  console.log(`\n${componentName}: ${variants.length} variants — fetching screenshots via REST API...\n`);

  const nodeIds = variants.map(v => v.nodeId).join(',');
  const apiUrl = `https://api.figma.com/v1/images/${fileKey}?ids=${encodeURIComponent(nodeIds)}&format=png&scale=${scale}`;

  let imageMap;
  try {
    const resp = await fetchJSON(apiUrl, token);
    if (resp.err) throw new Error(resp.err);
    imageMap = resp.images || {};
  } catch (err) {
    console.error(`Figma REST API error: ${err.message}`);
    process.exit(3);
  }

  const variantsWithUrls = variants.map(v => ({
    ...v,
    imageUrl: imageMap[v.nodeId] || null,
  }));

  const missing = variantsWithUrls.filter(v => !v.imageUrl);
  if (missing.length > 0) {
    console.warn(`  WARNING: ${missing.length} variants have no image URL: ${missing.map(v => v.name).join(', ')}`);
  }

  const variantsDir = path.join(absComponentDir, 'variants');
  const downloadTasks = variantsWithUrls
    .filter(v => v.imageUrl)
    .map(v => () => {
      const dest = path.join(variantsDir, v.name, 'figma.png');
      return downloadFile(v.imageUrl, dest).then(() => {
        process.stdout.write('.');
        return { name: v.name, ok: true };
      });
    });

  console.log(`  Downloading ${downloadTasks.length} screenshots (concurrency=${concurrency})...`);
  const downloadResults = await runConcurrent(downloadTasks, concurrency);
  console.log(` done.\n`);

  const downloadFails = downloadResults.filter(r => r && r.error);
  if (downloadFails.length > 0) {
    console.warn(`  ${downloadFails.length} download failures`);
  }

  const compareScript = path.join(__dirname, 'compare.js');
  if (!fs.existsSync(compareScript)) {
    console.error(`compare.js not found at: ${compareScript}`);
    process.exit(3);
  }

  console.log(`  Running pixel diffs...\n`);

  const results = [];
  let passCount = 0;
  let minorCount = 0;
  let failCount = 0;
  let errorCount = 0;

  for (const v of variantsWithUrls) {
    const variantDir = path.join(variantsDir, v.name);
    const figmaPng = path.join(variantDir, 'figma.png');
    const reactPng = path.join(variantDir, 'screenshot.png');

    process.stdout.write(`  ${v.name}: `);

    if (!v.imageUrl) {
      console.log('SKIP (no image from API)');
      results.push({ name: v.name, nodeId: v.nodeId, status: 'error', reason: 'no image URL from Figma API' });
      errorCount++;
      continue;
    }

    if (!fs.existsSync(figmaPng)) {
      console.log('SKIP (download failed)');
      results.push({ name: v.name, nodeId: v.nodeId, status: 'error', reason: 'download failed' });
      errorCount++;
      continue;
    }

    const fileSize = fs.statSync(figmaPng).size;
    if (fileSize < 100) {
      console.log(`SKIP (file too small: ${fileSize} bytes)`);
      results.push({ name: v.name, nodeId: v.nodeId, status: 'error', reason: `file too small: ${fileSize}B` });
      errorCount++;
      continue;
    }

    if (!fs.existsSync(reactPng)) {
      console.log(`SKIP (no react screenshot)`);
      results.push({ name: v.name, nodeId: v.nodeId, status: 'error', reason: 'react screenshot missing' });
      errorCount++;
      continue;
    }

    try {
      const thresholdArg = matchThreshold ? `--match-threshold ${matchThreshold}` : '';
      execSync(
        `node "${compareScript}" "${reactPng}" "${figmaPng}" "${variantDir}" ${thresholdArg}`,
        { stdio: 'pipe', timeout: 30000 }
      );
      const compJson = JSON.parse(fs.readFileSync(path.join(variantDir, 'comparison.json'), 'utf-8'));
      console.log(`PASS (${compJson.matchPct}% match)`);
      results.push({ name: v.name, nodeId: v.nodeId, status: 'pass', ...compJson });
      passCount++;
    } catch (execErr) {
      const compJsonPath = path.join(variantDir, 'comparison.json');
      if (fs.existsSync(compJsonPath)) {
        const compJson = JSON.parse(fs.readFileSync(compJsonPath, 'utf-8'));
        const verdict = compJson.verdict || 'unknown';
        if (verdict === 'minor_diff') {
          console.log(`MINOR_DIFF (${compJson.matchPct}% match)`);
          results.push({ name: v.name, nodeId: v.nodeId, status: 'minor_diff', ...compJson });
          minorCount++;
        } else {
          console.log(`FAIL (${compJson.matchPct}% match)`);
          results.push({ name: v.name, nodeId: v.nodeId, status: 'fail', ...compJson });
          failCount++;
        }
      } else {
        console.log(`ERROR (compare.js crashed: ${execErr.message})`);
        results.push({ name: v.name, nodeId: v.nodeId, status: 'error', reason: `compare error: ${execErr.message}` });
        errorCount++;
      }
    }
  }

  const overallVerdict = failCount > 0 || errorCount > 0
    ? 'FAIL'
    : minorCount > 0
      ? 'PARTIAL'
      : 'PASS';

  const avgMatch = results
    .filter(r => r.matchPct !== undefined)
    .reduce((sum, r, _, arr) => sum + r.matchPct / arr.length, 0);

  const summary = {
    componentName,
    componentDir,
    fileKey,
    variantCount: variants.length,
    pass: passCount,
    minorDiff: minorCount,
    fail: failCount,
    error: errorCount,
    avgMatchPct: Math.round(avgMatch * 10) / 10,
    overallVerdict,
    results,
  };

  const outputPath = path.join(absComponentDir, 'verification-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2));

  console.log(`\n--- ${componentName} Verification ---`);
  console.log(`  Pass:       ${passCount}`);
  console.log(`  Minor diff: ${minorCount}`);
  console.log(`  Fail:       ${failCount}`);
  console.log(`  Error:      ${errorCount}`);
  console.log(`  Avg match:  ${summary.avgMatchPct}%`);
  console.log(`  Verdict:    ${overallVerdict}`);
  console.log(`  Results:    ${outputPath}\n`);

  if (overallVerdict === 'FAIL') process.exit(2);
  if (overallVerdict === 'PARTIAL') process.exit(1);
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(3);
});
