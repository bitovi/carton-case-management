#!/usr/bin/env node
/**
 * aggregate-verification.js
 *
 * Reads all verification-results.json files from .temp/react-to-figma/components/
 * and produces a ranked scoreboard of worst components + common failure patterns.
 *
 * Usage:
 *   node aggregate-verification.js
 *   node aggregate-verification.js --components-dir .temp/react-to-figma/components
 *   node aggregate-verification.js --output .temp/react-to-figma/verification-scoreboard.md
 *
 * Output:
 *   .temp/react-to-figma/verification-scoreboard.md  — human-readable scoreboard
 *
 * Exit codes:
 *   0 = all components pass
 *   1 = some components have issues
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    componentsDir: null,
    output: null,
  };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--components-dir': opts.componentsDir = args[++i]; break;
      case '--output': opts.output = args[++i]; break;
    }
  }
  return opts;
}

const opts = parseArgs();

const projectRoot = path.resolve(__dirname, '../../../../');
const componentsDir = path.resolve(opts.componentsDir || path.join(projectRoot, '.temp/react-to-figma/components'));
const outputPath = path.resolve(opts.output || path.join(projectRoot, '.temp/react-to-figma/verification-scoreboard.md'));

// ---------------------------------------------------------------------------
// Collect all verification-results.json files
// ---------------------------------------------------------------------------
if (!fs.existsSync(componentsDir)) {
  console.error(`ERROR: components dir not found: ${componentsDir}`);
  process.exit(1);
}

const compDirs = fs.readdirSync(componentsDir)
  .filter(name => fs.statSync(path.join(componentsDir, name)).isDirectory());

const allResults = [];

for (const compName of compDirs) {
  const resultsFile = path.join(componentsDir, compName, 'verification-results.json');
  if (!fs.existsSync(resultsFile)) continue;

  let data;
  try {
    data = JSON.parse(fs.readFileSync(resultsFile, 'utf8'));
  } catch (e) {
    console.warn(`WARN: Could not parse ${resultsFile}: ${e.message}`);
    continue;
  }

  // Validate it's a real verification result (not hand-written)
  if (typeof data.variantCount !== 'number' || !Array.isArray(data.results)) {
    console.warn(`WARN: ${resultsFile} looks hand-written — skipping`);
    continue;
  }

  allResults.push(data);
}

if (allResults.length === 0) {
  console.error('No valid verification-results.json files found. Run the build+verify phase first.');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Sort by worst overall, then lowest avg matchPct
// ---------------------------------------------------------------------------
const verdictRank = { FAIL: 0, PARTIAL: 1, PASS: 2 };

function avgMatchPct(results) {
  if (!results || results.length === 0) return 0;
  const sum = results.reduce((acc, r) => acc + (r.matchPct || 0), 0);
  return sum / results.length;
}

allResults.sort((a, b) => {
  const rankA = verdictRank[a.overallVerdict] ?? 1;
  const rankB = verdictRank[b.overallVerdict] ?? 1;
  if (rankA !== rankB) return rankA - rankB;
  return avgMatchPct(a.results) - avgMatchPct(b.results);
});

// ---------------------------------------------------------------------------
// Collect all variants ranked worst-first
// ---------------------------------------------------------------------------
const allVariants = [];
for (const comp of allResults) {
  for (const v of comp.results || []) {
    allVariants.push({
      component: comp.componentName,
      name: v.name,
      status: v.status,
      matchPct: v.matchPct || 0,
      borderMatchPct: v.borderMatchPct,
      verdict: v.verdict,
      diffPixels: v.diffPixels,
      totalPixels: v.totalPixels,
      normalizedW: v.normalizedW,
      normalizedH: v.normalizedH,
      compositeRelPath: `components/${comp.componentName}/variants/${v.name}/composite.png`,
    });
  }
}
allVariants.sort((a, b) => a.matchPct - b.matchPct);

// ---------------------------------------------------------------------------
// Summary stats
// ---------------------------------------------------------------------------
let totalVariants = 0;
let passCount = 0;
let minorDiffCount = 0;
let failCount = 0;
let errorCount = 0;
let compPassCount = 0;
let compPartialCount = 0;
let compFailCount = 0;

for (const comp of allResults) {
  switch (comp.overallVerdict) {
    case 'PASS': compPassCount++; break;
    case 'PARTIAL': compPartialCount++; break;
    default: compFailCount++; break;
  }
  for (const v of comp.results || []) {
    totalVariants++;
    switch (v.status) {
      case 'pass': passCount++; break;
      case 'minor_diff': minorDiffCount++; break;
      case 'fail': failCount++; break;
      case 'error': errorCount++; break;
    }
  }
}

// ---------------------------------------------------------------------------
// Failure pattern analysis (simple heuristics on variant names)
// ---------------------------------------------------------------------------
const failedVariants = allVariants.filter(v => v.status === 'fail' || v.status === 'minor_diff');

function countMatching(variants, predicate) {
  return variants.filter(predicate).length;
}

const patterns = [];

const textOnlyComponents = ['Label', 'DialogTitle', 'DialogDescription'];
const textOnlyFails = countMatching(failedVariants, v => textOnlyComponents.includes(v.component));
if (textOnlyFails > 0) {
  patterns.push({ label: 'Text-only components (Label, DialogTitle, etc.)', count: textOnlyFails });
}

const withIconFails = countMatching(failedVariants, v =>
  /icon|left.*icon|right.*icon|with.*icon/i.test(v.name)
);
if (withIconFails > 0) {
  patterns.push({ label: 'Variants with icons', count: withIconFails });
}

const withErrorFails = countMatching(failedVariants, v =>
  /error|invalid|warning/i.test(v.name)
);
if (withErrorFails > 0) {
  patterns.push({ label: 'Error/invalid state variants', count: withErrorFails });
}

const smallSizeFails = countMatching(failedVariants, v =>
  v.normalizedW && v.normalizedH && (v.normalizedW * v.normalizedH) < 2000
);
if (smallSizeFails > 0) {
  patterns.push({ label: 'Small/compact variants (< 2000px²)', count: smallSizeFails });
}

const lowBorderMatch = countMatching(failedVariants, v =>
  v.borderMatchPct !== undefined && v.borderMatchPct < 85
);
if (lowBorderMatch > 0) {
  patterns.push({ label: 'Border/outline mismatch (borderMatchPct < 85%)', count: lowBorderMatch });
}

const highPixelDiff = countMatching(failedVariants, v =>
  v.diffPixels && v.totalPixels && (v.diffPixels / v.totalPixels) > 0.30
);
if (highPixelDiff > 0) {
  patterns.push({ label: 'Severe pixel diff (> 30% of pixels wrong)', count: highPixelDiff });
}

patterns.sort((a, b) => b.count - a.count);

// ---------------------------------------------------------------------------
// Build markdown
// ---------------------------------------------------------------------------
const lines = [];
const ts = new Date().toISOString();

lines.push(`# Verification Scoreboard`);
lines.push(`_Generated: ${ts}_`);
lines.push('');

lines.push('## Summary');
lines.push('');
lines.push(`| | Count |`);
lines.push(`|---|---|`);
lines.push(`| Components verified | ${allResults.length} |`);
lines.push(`| Components PASS | ${compPassCount} |`);
lines.push(`| Components PARTIAL | ${compPartialCount} |`);
lines.push(`| Components FAIL | ${compFailCount} |`);
lines.push(`| Total variants | ${totalVariants} |`);
lines.push(`| Variants pass | ${passCount} |`);
lines.push(`| Variants minor_diff | ${minorDiffCount} |`);
lines.push(`| Variants fail | ${failCount} |`);
lines.push(`| Variants error | ${errorCount} |`);
lines.push('');

// ---------------------------------------------------------------------------
// Component scoreboard
// ---------------------------------------------------------------------------
lines.push('## Component Scoreboard (worst first)');
lines.push('');
lines.push('| Rank | Component | Verdict | Avg Match% | Pass | Minor | Fail | Error |');
lines.push('|------|-----------|---------|-----------|------|-------|------|-------|');

for (let i = 0; i < allResults.length; i++) {
  const comp = allResults[i];
  const avg = avgMatchPct(comp.results).toFixed(1);
  const p = comp.results.filter(r => r.status === 'pass').length;
  const m = comp.results.filter(r => r.status === 'minor_diff').length;
  const f = comp.results.filter(r => r.status === 'fail').length;
  const e = comp.results.filter(r => r.status === 'error').length;
  const verdictEmoji = comp.overallVerdict === 'PASS' ? '✅' : comp.overallVerdict === 'PARTIAL' ? '⚠️' : '❌';
  lines.push(`| ${i + 1} | ${comp.componentName} | ${verdictEmoji} ${comp.overallVerdict} | ${avg}% | ${p} | ${m} | ${f} | ${e} |`);
}

lines.push('');

// ---------------------------------------------------------------------------
// Worst variants
// ---------------------------------------------------------------------------
lines.push('## Worst Variants (all components, sorted by matchPct)');
lines.push('');
lines.push('| Component | Variant | Match% | Status | Size | Composite |');
lines.push('|-----------|---------|--------|--------|------|-----------|');

const worstVariants = allVariants.slice(0, 30);
for (const v of worstVariants) {
  const size = v.normalizedW && v.normalizedH ? `${v.normalizedW}×${v.normalizedH}` : '—';
  const status = v.status === 'fail' ? '❌ fail' : v.status === 'minor_diff' ? '⚠️ minor' : v.status;
  lines.push(`| ${v.component} | ${v.name} | ${v.matchPct.toFixed(1)}% | ${status} | ${size} | ${v.compositeRelPath} |`);
}

if (allVariants.length > 30) {
  lines.push(`| _(${allVariants.length - 30} more variants not shown)_ | | | | | |`);
}

lines.push('');

// ---------------------------------------------------------------------------
// Failure patterns
// ---------------------------------------------------------------------------
if (patterns.length > 0) {
  lines.push('## Failure Pattern Analysis');
  lines.push('');
  lines.push('Patterns observed across failing/minor-diff variants:');
  lines.push('');
  lines.push('| Pattern | Failing Variants |');
  lines.push('|---------|-----------------|');
  for (const p of patterns) {
    lines.push(`| ${p.label} | ${p.count} |`);
  }
  lines.push('');
}

// ---------------------------------------------------------------------------
// Per-component detail (failing/partial only)
// ---------------------------------------------------------------------------
const problemComponents = allResults.filter(c => c.overallVerdict !== 'PASS');
if (problemComponents.length > 0) {
  lines.push('## Per-Component Detail (failing components only)');
  lines.push('');
  for (const comp of problemComponents) {
    lines.push(`### ${comp.componentName}`);
    lines.push('');
    lines.push(`- **Overall**: ${comp.overallVerdict}`);
    lines.push(`- **Dir**: \`.temp/react-to-figma/components/${comp.componentName}/\``);
    lines.push('');
    lines.push('| Variant | Match% | Status | Border% | DiffPx / TotalPx |');
    lines.push('|---------|--------|--------|---------|-----------------|');
    const sorted = [...comp.results].sort((a, b) => (a.matchPct || 0) - (b.matchPct || 0));
    for (const v of sorted) {
      const border = v.borderMatchPct !== undefined ? `${v.borderMatchPct.toFixed(1)}%` : '—';
      const diff = v.diffPixels !== undefined ? `${v.diffPixels} / ${v.totalPixels}` : '—';
      const statusIcon = v.status === 'pass' ? '✅' : v.status === 'minor_diff' ? '⚠️' : '❌';
      lines.push(`| ${v.name} | ${(v.matchPct || 0).toFixed(1)}% | ${statusIcon} ${v.status} | ${border} | ${diff} |`);
    }
    lines.push('');
    lines.push(`View composites: \`.temp/react-to-figma/components/${comp.componentName}/variants/*/composite.png\``);
    lines.push('');
  }
}

// ---------------------------------------------------------------------------
// Iteration guide
// ---------------------------------------------------------------------------
lines.push('## Iteration Workflow');
lines.push('');
lines.push('1. **Pick worst component** from scoreboard above');
lines.push('2. **View composite.png diffs** for failing variants to diagnose root cause');
lines.push('3. **Fix the relevant script** (`dom-to-figma-ir.js`, `css-to-figma.js`, `ir-to-figma-code.js`)');
lines.push('4. **Re-run just that component**:');
lines.push('   ```bash');
lines.push('   .claude/skills/react-to-figma-dom/support-prompts/reset-component-to-before-step-6.2.sh ComponentName');
lines.push('   .claude/skills/react-to-figma-dom/support-prompts/batch-build-1-preprocess.sh ComponentName');
lines.push('   # Then run batch-build-2-build-and-verify.md for just that component');
lines.push('   ```');
lines.push('5. **Re-run aggregate** to see if score improved:');
lines.push('   ```bash');
lines.push('   node .claude/skills/react-to-figma-dom/support-prompts/batch-build-3-aggregate-verification.js');
lines.push('   ```');
lines.push('6. If fix is generalizable, re-run all components');
lines.push('');

// ---------------------------------------------------------------------------
// Write output
// ---------------------------------------------------------------------------
const md = lines.join('\n');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, md, 'utf8');

console.log(`Scoreboard written to: ${outputPath}`);
console.log(`  ${allResults.length} components | ${totalVariants} variants | ${compPassCount} pass / ${compPartialCount} partial / ${compFailCount} fail`);

process.exit(compFailCount > 0 || compPartialCount > 0 ? 1 : 0);
