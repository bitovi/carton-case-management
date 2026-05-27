/**
 * Batch variant verification: download Figma screenshots and run pixel diffs.
 *
 * Reads a verify-manifest.json that maps each variant to its Figma asset URL
 * and React reference screenshot. Downloads all Figma PNGs, runs compare.js
 * on each pair, and writes a consolidated verification-results.json.
 *
 * Usage:
 *   node verify-variants.js --manifest <path-to-verify-manifest.json>
 *
 * verify-manifest.json format:
 * {
 *   "componentName": "Badge",
 *   "componentDir": ".temp/react-to-figma/components/Badge",
 *   "variants": [
 *     {
 *       "name": "PrimaryDefault",
 *       "nodeId": "103:2",
 *       "assetUrl": "https://www.figma.com/api/mcp/asset/...",
 *       "reactScreenshot": "variants/PrimaryDefault/screenshot.png"
 *     }
 *   ]
 * }
 *
 * Outputs:
 *   {componentDir}/variants/{name}/figma.png          — downloaded Figma screenshots
 *   {componentDir}/variants/{name}/diff.png           — pixel diff images
 *   {componentDir}/variants/{name}/composite.png      — side-by-side comparison
 *   {componentDir}/variants/{name}/comparison.json    — per-variant match stats
 *   {componentDir}/verification-results.json          — consolidated results
 *
 * Exit codes:
 *   0 = all variants pass
 *   1 = some variants have minor diffs
 *   2 = some variants fail
 *   3 = error (missing manifest, download failures, etc.)
 */

const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
const https = require('https');
const http = require('http');

function detectEmptyImage(pngBuffer) {
  const sig = pngBuffer.slice(0, 8);
  if (sig[0] !== 0x89 || sig[1] !== 0x50) return false;

  let offset = 8;
  let width = 0;
  let height = 0;
  const rawPixels = [];

  while (offset < pngBuffer.length) {
    const len = pngBuffer.readUInt32BE(offset);
    const type = pngBuffer.slice(offset + 4, offset + 8).toString('ascii');
    if (type === 'IHDR') {
      width = pngBuffer.readUInt32BE(offset + 8);
      height = pngBuffer.readUInt32BE(offset + 12);
    }
    if (type === 'IDAT') {
      rawPixels.push(pngBuffer.slice(offset + 8, offset + 8 + len));
    }
    offset += 12 + len;
  }

  if (width * height < 4) return false;

  const totalPixels = width * height;
  const expectedMin = totalPixels * 4 * 0.01;
  const compressedSize = rawPixels.reduce((sum, b) => sum + b.length, 0);

  if (compressedSize < expectedMin && totalPixels > 100) {
    return true;
  }

  return false;
}

function parseArgs(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--manifest' && i + 1 < argv.length) {
      flags.manifest = argv[i + 1];
      i++;
    }
    if (argv[i] === '--match-threshold' && i + 1 < argv.length) {
      flags.matchThreshold = parseFloat(argv[i + 1]);
      i++;
    }
  }
  return flags;
}

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const dir = path.dirname(destPath);
    fs.mkdirSync(dir, { recursive: true });

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

async function main() {
  const flags = parseArgs(process.argv.slice(2));

  if (!flags.manifest) {
    console.error('Usage: node verify-variants.js --manifest <path-to-verify-manifest.json>');
    process.exit(3);
  }

  const manifestPath = path.resolve(flags.manifest);
  if (!fs.existsSync(manifestPath)) {
    console.error(`Manifest not found: ${manifestPath}`);
    process.exit(3);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const { componentName, componentDir, variants } = manifest;
  const absComponentDir = path.resolve(componentDir);
  const variantsDir = path.join(absComponentDir, 'variants');

  const compareScript = path.join(
    __dirname, 'compare.js'
  );

  if (!fs.existsSync(compareScript)) {
    console.error(`compare.js not found at: ${compareScript}`);
    process.exit(3);
  }

  console.log(`\nVerifying ${componentName}: ${variants.length} variants\n`);

  const results = [];
  let passCount = 0;
  let minorCount = 0;
  let failCount = 0;
  let errorCount = 0;

  for (const variant of variants) {
    const { name, nodeId, assetUrl, reactScreenshot } = variant;
    const variantDir = path.join(variantsDir, name);
    fs.mkdirSync(variantDir, { recursive: true });
    const figmaPng = path.join(variantDir, 'figma.png');
    const diffOutDir = variantDir;
    const reactRef = path.resolve(absComponentDir, reactScreenshot);

    process.stdout.write(`  ${name}: `);

    if (!assetUrl) {
      console.log('SKIP (no asset URL)');
      results.push({ name, nodeId, status: 'skip', reason: 'no asset URL' });
      errorCount++;
      continue;
    }

    if (!fs.existsSync(reactRef)) {
      console.log(`SKIP (react ref missing: ${reactScreenshot})`);
      results.push({ name, nodeId, status: 'skip', reason: `react ref missing: ${reactScreenshot}` });
      errorCount++;
      continue;
    }

    try {
      await downloadFile(assetUrl, figmaPng);
    } catch (err) {
      console.log(`DOWNLOAD FAILED (${err.message})`);
      results.push({ name, nodeId, status: 'error', reason: `download failed: ${err.message}` });
      errorCount++;
      continue;
    }

    const fileSize = fs.statSync(figmaPng).size;
    if (fileSize < 100) {
      console.log(`DOWNLOAD FAILED (file too small: ${fileSize} bytes)`);
      results.push({ name, nodeId, status: 'error', reason: `downloaded file too small: ${fileSize} bytes` });
      errorCount++;
      continue;
    }

    try {
      const pngBuf = fs.readFileSync(figmaPng);
      const isEmpty = detectEmptyImage(pngBuf);
      if (isEmpty) {
        console.log(`EMPTY (Figma screenshot appears blank/uniform)`);
        results.push({ name, nodeId, status: 'fail', matchPct: 0, reason: 'Figma screenshot is blank or uniform color' });
        failCount++;
        continue;
      }
    } catch (imgErr) {
      // non-fatal — proceed to pixel diff
    }

    try {
      const thresholdArg = flags.matchThreshold ? `--match-threshold ${flags.matchThreshold}` : '';
      execSync(
        `node "${compareScript}" "${reactRef}" "${figmaPng}" "${diffOutDir}" ${thresholdArg}`,
        { stdio: 'pipe', timeout: 30000 }
      );

      const compJson = JSON.parse(fs.readFileSync(path.join(diffOutDir, 'comparison.json'), 'utf-8'));
      console.log(`PASS (${compJson.matchPct}% match)`);
      results.push({ name, nodeId, status: 'pass', ...compJson });
      passCount++;
    } catch (execErr) {
      const compJsonPath = path.join(diffOutDir, 'comparison.json');
      if (fs.existsSync(compJsonPath)) {
        const compJson = JSON.parse(fs.readFileSync(compJsonPath, 'utf-8'));
        const verdict = compJson.verdict || 'unknown';
        if (verdict === 'minor_diff') {
          console.log(`MINOR_DIFF (${compJson.matchPct}% match)`);
          results.push({ name, nodeId, status: 'minor_diff', ...compJson });
          minorCount++;
        } else {
          console.log(`FAIL (${compJson.matchPct}% match)`);
          results.push({ name, nodeId, status: 'fail', ...compJson });
          failCount++;
        }
      } else {
        console.log(`ERROR (compare.js crashed: ${execErr.message})`);
        results.push({ name, nodeId, status: 'error', reason: `compare.js error: ${execErr.message}` });
        errorCount++;
      }
    }
  }

  const overallVerdict = failCount > 0 || errorCount > 0
    ? 'FAIL'
    : minorCount > 0
      ? 'PARTIAL'
      : 'PASS';

  const summary = {
    componentName,
    componentDir,
    variantCount: variants.length,
    pass: passCount,
    minorDiff: minorCount,
    fail: failCount,
    error: errorCount,
    overallVerdict,
    results,
  };

  const outputPath = path.join(absComponentDir, 'verification-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(summary, null, 2));

  console.log(`\n--- Summary ---`);
  console.log(`  Pass:       ${passCount}`);
  console.log(`  Minor diff: ${minorCount}`);
  console.log(`  Fail:       ${failCount}`);
  console.log(`  Error:      ${errorCount}`);
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
