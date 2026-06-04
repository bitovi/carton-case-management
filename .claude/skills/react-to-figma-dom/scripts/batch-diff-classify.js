#!/usr/bin/env node

/**
 * batch-diff-classify.js
 *
 * Chains diff-variants.js → classify-variants.js for one or all components.
 * For each component:
 *   1. Runs diff-variants.js to compare DOM trees across variants
 *   2. Runs classify-variants.js to produce figma-variants.json
 *   3. Reports NEEDS_REVIEW axes as warnings (does not fail)
 *
 * Usage:
 *   node batch-diff-classify.js \
 *     --component Badge \
 *     --pipeline-dir .temp/react-to-figma-dom \
 *     --skill-dir .claude/skills/react-to-figma-dom \
 *     [--force]
 *
 *   node batch-diff-classify.js \
 *     --all \
 *     --pipeline-dir .temp/react-to-figma-dom \
 *     --skill-dir .claude/skills/react-to-figma-dom \
 *     [--force]
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { component: null, all: false, pipelineDir: null, skillDir: null, force: false };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--component': opts.component = args[++i]; break;
      case '--all': opts.all = true; break;
      case '--pipeline-dir': opts.pipelineDir = args[++i]; break;
      case '--skill-dir': opts.skillDir = args[++i]; break;
      case '--force': opts.force = true; break;
    }
  }
  if ((!opts.component && !opts.all) || !opts.pipelineDir || !opts.skillDir) {
    console.error(
      'Usage: node batch-diff-classify.js (--component <Name> | --all) --pipeline-dir <path> --skill-dir <path> [--force]'
    );
    process.exit(1);
  }
  return opts;
}

function discoverComponents(componentsDir) {
  if (!fs.existsSync(componentsDir)) return [];
  return fs.readdirSync(componentsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .filter(d => {
      const hasVariantsMd = fs.existsSync(path.join(componentsDir, d.name, 'variants.md'));
      const hasVariantsDir = fs.existsSync(path.join(componentsDir, d.name, 'variants'));
      return hasVariantsMd && hasVariantsDir;
    })
    .map(d => d.name);
}

function hasVariantSubdirs(variantsDir) {
  if (!fs.existsSync(variantsDir)) return false;
  return fs.readdirSync(variantsDir, { withFileTypes: true })
    .some(d => d.isDirectory());
}

function processComponent(name, opts) {
  const componentDir = path.join(opts.pipelineDir, 'components', name);
  const variantsDir = path.join(componentDir, 'variants');
  const variantsMd = path.join(componentDir, 'variants.md');
  const variantDiffs = path.join(componentDir, 'variant-diffs.md');
  const captureManifest = path.join(variantsDir, 'capture-manifest.json');
  const figmaVariants = path.join(componentDir, 'figma-variants.json');

  const diffScript = path.join(opts.skillDir, 'scripts', 'diff-variants.js');
  const classifyScript = path.join(opts.skillDir, '7-generate-build-scripts', 'scripts', 'classify-variants.js');

  if (!opts.force && fs.existsSync(figmaVariants)) {
    return { status: 'skipped', reason: 'figma-variants.json exists' };
  }

  if (!fs.existsSync(variantsMd)) {
    return { status: 'skipped', reason: 'no variants.md' };
  }

  if (!hasVariantSubdirs(variantsDir)) {
    return { status: 'skipped', reason: 'no variant subdirectories' };
  }

  try {
    execFileSync('node', [diffScript, '--variants-dir', variantsDir], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });
  } catch (err) {
    return { status: 'failed', phase: 'diff', error: err.stderr ? err.stderr.toString().trim() : err.message };
  }

  if (!fs.existsSync(variantDiffs)) {
    return { status: 'failed', phase: 'diff', error: 'variant-diffs.md not created' };
  }

  const classifyArgs = [
    classifyScript,
    '--variants-md', variantsMd,
    '--variant-diffs', variantDiffs,
    '--output', figmaVariants,
  ];
  if (fs.existsSync(captureManifest)) {
    classifyArgs.splice(classifyArgs.indexOf('--output'), 0, '--capture-manifest', captureManifest);
  }

  try {
    execFileSync('node', classifyArgs, { stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (err) {
    return { status: 'failed', phase: 'classify', error: err.stderr ? err.stderr.toString().trim() : err.message };
  }

  if (!fs.existsSync(figmaVariants)) {
    return { status: 'failed', phase: 'classify', error: 'figma-variants.json not created' };
  }

  let needsReviewCount = 0;
  try {
    const fv = JSON.parse(fs.readFileSync(figmaVariants, 'utf8'));
    if (fv.variantAxes) {
      needsReviewCount = fv.variantAxes.filter(a => a.classification === 'NEEDS_REVIEW' || a.type === 'NEEDS_REVIEW').length;
    }
  } catch (_) {}

  return { status: 'ok', needsReview: needsReviewCount };
}

function main() {
  const opts = parseArgs();
  const componentsDir = path.join(opts.pipelineDir, 'components');

  const components = opts.all
    ? discoverComponents(componentsDir)
    : [opts.component];

  if (components.length === 0) {
    console.error('No eligible components found.');
    process.exit(1);
  }

  console.log(`Processing ${components.length} component(s)\n`);

  let passed = 0, failed = 0, skipped = 0, needsReviewTotal = 0;

  for (const name of components) {
    const result = processComponent(name, opts);
    switch (result.status) {
      case 'ok':
        passed++;
        if (result.needsReview > 0) {
          needsReviewTotal += result.needsReview;
          console.log(`  [ok]   ${name} (⚠ ${result.needsReview} NEEDS_REVIEW)`);
        } else {
          console.log(`  [ok]   ${name}`);
        }
        break;
      case 'skipped':
        skipped++;
        console.log(`  [skip] ${name} — ${result.reason}`);
        break;
      case 'failed':
        failed++;
        console.error(`  [FAIL] ${name} — ${result.phase}: ${result.error}`);
        break;
    }
  }

  console.log(`\nSummary: ${passed} passed, ${skipped} skipped, ${failed} failed`);
  if (needsReviewTotal > 0) {
    console.log(`⚠ ${needsReviewTotal} total NEEDS_REVIEW axes across all components`);
  }

  if (failed > 0) process.exit(1);
}

main();
