/**
 * Evaluation harness for the screenshot-comparison pipeline.
 *
 * Reads synthetic test cases from evaluate-cases.json, renders a pair of
 * canvas images per case (base + mutation), runs compare.js on each pair,
 * and asserts that the reported matchPct, borderMatchPct, verdict, and
 * borderVerdict fall within expected ranges. Produces a JSON and Markdown
 * report under .temp/evaluate/.
 */

const { getBrowser } = require('./browser-connect');
const { execFileSync } = require('child_process');
const path = require('path');
const fs   = require('fs');

const COMPARE_PATH = path.join(__dirname, 'compare.js');
const CASES_PATH   = path.join(__dirname, 'evaluate-cases.json');
const OUTPUT_ROOT  = path.resolve('.temp/evaluate');

const args = process.argv.slice(2);
const verbose  = args.includes('--verbose');
const caseFlag = args.indexOf('--case');
const caseFilter = caseFlag !== -1 ? args[caseFlag + 1] : null;

/**
 * Deep-clone a JSON-serializable object via round-trip stringify/parse.
 * @param {Object} obj
 * @returns {Object}
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Apply a declarative mutation to a canvas spec, producing a modified copy.
 * Supported mutation types: pixel_set, border_color_shift, translate,
 * color_replace, remove_element, spacing_shift, opacity_change, add_shadow.
 * @param {Object} base - The base canvas spec (with `elements` array).
 * @param {{ type: string, [key: string]: * }} mutation - Mutation descriptor.
 * @returns {Object} A new spec with the mutation applied.
 */
function applyMutation(base, mutation) {
  if (mutation.type === 'none') return deepClone(base);

  const mutated = deepClone(base);

  switch (mutation.type) {
    case 'pixel_set':
      for (const [px, py] of mutation.coords) {
        mutated.elements.push({
          type: 'rect', x: px, y: py, w: 1, h: 1,
          fill: mutation.color, radius: 0,
        });
      }
      break;

    case 'border_color_shift':
      for (const el of mutated.elements) {
        if (el.stroke === mutation.from) el.stroke = mutation.to;
      }
      break;

    case 'translate':
      for (const el of mutated.elements) {
        if ('x' in el) el.x += mutation.dx;
        if ('y' in el) el.y += mutation.dy;
      }
      break;

    case 'color_replace':
      for (const el of mutated.elements) {
        if (el.fill === mutation.from) el.fill = mutation.to;
        if (el.stroke === mutation.from) el.stroke = mutation.to;
      }
      break;

    case 'remove_element':
      mutated.elements.splice(mutation.index, 1);
      break;

    case 'spacing_shift': {
      const sorted = mutated.elements
        .map((el, i) => ({ el, i }))
        .filter(({ el }) => mutation.axis in el)
        .sort((a, b) => a.el[mutation.axis] - b.el[mutation.axis]);
      for (let s = 1; s < sorted.length; s++) {
        sorted[s].el[mutation.axis] += mutation.increase * s;
      }
      break;
    }

    case 'opacity_change':
      if (mutated.elements[mutation.index]) {
        mutated.elements[mutation.index].alpha = mutation.alpha;
      }
      break;

    case 'add_shadow':
      if (mutated.elements.length > 0) {
        mutated.elements[0].shadow = {
          color: mutation.color,
          blur: mutation.blur,
          offsetX: mutation.offsetX,
          offsetY: mutation.offsetY,
        };
      }
      break;

    default:
      break;
  }

  return mutated;
}

/**
 * Render a declarative canvas spec to a PNG buffer using an in-browser canvas.
 * @param {import('@playwright/test').Page} page - Playwright page for canvas rendering.
 * @param {{ width: number, height: number, background: string, elements: Object[] }} spec - Canvas drawing spec.
 * @returns {Promise<Buffer>} PNG image buffer.
 */
async function renderSpec(page, spec) {
  const dataUrl = await page.evaluate(({ width, height, background, elements }) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    for (const el of elements) {
      ctx.save();
      ctx.globalAlpha = el.alpha ?? 1;

      if (el.type === 'rect') {
        if (el.shadow) {
          ctx.shadowColor = el.shadow.color;
          ctx.shadowBlur = el.shadow.blur;
          ctx.shadowOffsetX = el.shadow.offsetX;
          ctx.shadowOffsetY = el.shadow.offsetY;
        }
        const r = el.radius || 0;
        ctx.beginPath();
        ctx.roundRect(el.x, el.y, el.w, el.h, r);
        if (el.fill) { ctx.fillStyle = el.fill; ctx.fill(); }
        if (el.stroke) {
          ctx.shadowColor = 'transparent';
          ctx.strokeStyle = el.stroke;
          ctx.lineWidth = el.strokeWidth || 1;
          ctx.stroke();
        }
      } else if (el.type === 'text') {
        ctx.font = el.font;
        ctx.fillStyle = el.fill;
        ctx.textAlign = el.align || 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(el.text, el.x, el.y);
      }

      ctx.restore();
    }

    return canvas.toDataURL('image/png');
  }, spec);

  return Buffer.from(dataUrl.replace(/^data:image\/png;base64,/, ''), 'base64');
}

/**
 * Run compare.js as a child process on two PNG files.
 * @param {string} aPng - Path to the first image.
 * @param {string} bPng - Path to the second image.
 * @param {string} outDir - Directory for diff.png and comparison.json output.
 * @returns {{ exitCode: number, stdout: string, stderr?: string }}
 */
function runCompare(aPng, bPng, outDir) {
  try {
    const stdout = execFileSync('node', [COMPARE_PATH, aPng, bPng, outDir], {
      timeout: 30000,
      stdio: 'pipe',
    });
    return { exitCode: 0, stdout: stdout.toString() };
  } catch (err) {
    return {
      exitCode: err.status ?? 3,
      stdout: err.stdout?.toString() ?? '',
      stderr: err.stderr?.toString() ?? '',
    };
  }
}

/**
 * Assert that a numeric value falls within an inclusive range.
 * @param {number} actual - The observed value.
 * @param {[number, number]} range - [min, max] inclusive bounds.
 * @param {string} label - Human-readable assertion name.
 * @returns {{ pass: boolean, label: string, actual: number, expected: string }}
 */
function assertRange(actual, [min, max], label) {
  const pass = actual >= min && actual <= max;
  return { pass, label, actual, expected: `${min}–${max}` };
}

/**
 * Assert strict equality between two values. Skips if expected is null.
 * @param {*} actual - The observed value.
 * @param {*} expected - The expected value, or null to skip the check.
 * @param {string} label - Human-readable assertion name.
 * @returns {{ pass: boolean, label: string, actual: *, expected: *, skipped?: boolean }}
 */
function assertEqual(actual, expected, label) {
  if (expected === null) return { pass: true, label, actual, expected: '(any)', skipped: true };
  const pass = actual === expected;
  return { pass, label, actual, expected };
}

/**
 * Map a verdict string to its display emoji.
 * @param {string} v - One of 'match', 'minor_diff', or 'mismatch'.
 * @returns {string}
 */
function verdictIcon(v) {
  if (v === 'match') return '✅';
  if (v === 'minor_diff') return '⚠️';
  if (v === 'mismatch') return '❌';
  return '—';
}

/**
 * Build a Markdown evaluation report from test results.
 * Includes a summary table, per-case results, and detailed sections for
 * failed cases with inline image references.
 * @param {Object[]} results - Array of per-case result objects.
 * @param {number} passCount - Number of passing cases.
 * @param {number} failCount - Number of failing cases.
 * @param {number} total - Total number of cases evaluated.
 * @param {string} timestamp - ISO 8601 timestamp for the report header.
 * @returns {string} Complete Markdown document.
 */
function buildMarkdownReport(results, passCount, failCount, total, timestamp) {
  const lines = [];
  lines.push('# Screenshot Comparison — Evaluation Report');
  lines.push('');
  lines.push(`**Generated:** ${timestamp}`);
  lines.push('');
  lines.push('## Summary');
  lines.push('');
  lines.push(`| | Count |`);
  lines.push(`|---|---|`);
  lines.push(`| Total cases | ${total} |`);
  lines.push(`| Passed | ${passCount} |`);
  lines.push(`| Failed | ${failCount} |`);
  lines.push('');

  lines.push('## Results');
  lines.push('');
  lines.push('| # | Test | Match % | Border % | Verdict | Border | Result |');
  lines.push('|---|------|---------|----------|---------|--------|--------|');

  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const c = r.actual;
    const matchStr   = c.matchPct != null ? `${c.matchPct}%` : 'ERR';
    const borderStr  = c.borderMatchPct != null ? `${c.borderMatchPct}%` : 'ERR';
    const vIcon      = c.verdict ? verdictIcon(c.verdict) : '—';
    const bIcon      = c.borderVerdict === 'border_ok' ? '✅' : c.borderVerdict === 'border_diff' ? '⚠️' : '—';
    const result     = r.pass ? '✅ PASS' : '❌ FAIL';
    lines.push(`| ${i + 1} | ${r.name} | ${matchStr} | ${borderStr} | ${vIcon} ${c.verdict ?? 'ERR'} | ${bIcon} ${c.borderVerdict ?? 'ERR'} | ${result} |`);
  }
  lines.push('');

  const failed = results.filter(r => !r.pass);
  if (failed.length > 0) {
    lines.push('## Failed Cases');
    lines.push('');
    for (const r of failed) {
      lines.push(`### ${r.name} (\`${r.id}\`)`);
      lines.push('');
      lines.push('| Image A | Image B | Diff |');
      lines.push('|---------|---------|------|');
      lines.push(`| ![a](${r.id}/a.png) | ![b](${r.id}/b.png) | ![diff](${r.id}/diff.png) |`);
      lines.push('');
      lines.push('| Assertion | Actual | Expected | Result |');
      lines.push('|-----------|--------|----------|--------|');
      for (const a of r.assertions) {
        if (a.skipped) continue;
        lines.push(`| ${a.label} | ${a.actual} | ${a.expected} | ${a.pass ? '✅' : '❌'} |`);
      }
      lines.push('');
    }
  }

  lines.push('## All Cases Detail');
  lines.push('');
  for (const r of results) {
    const icon = r.pass ? '✅' : '❌';
    lines.push(`### ${icon} ${r.name} (\`${r.id}\`)`);
    lines.push('');
    lines.push('| Image A | Image B | Diff |');
    lines.push('|---------|---------|------|');
    lines.push(`| ![a](${r.id}/a.png) | ![b](${r.id}/b.png) | ![diff](${r.id}/diff.png) |`);
    lines.push('');
    lines.push('| Assertion | Actual | Expected | Result |');
    lines.push('|-----------|--------|----------|--------|');
    for (const a of r.assertions) {
      if (a.skipped) continue;
      lines.push(`| ${a.label} | ${a.actual} | ${a.expected} | ${a.pass ? '✅' : '❌'} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

(async () => {
  const cases = JSON.parse(fs.readFileSync(CASES_PATH, 'utf-8'));
  const filtered = caseFilter ? cases.filter(c => c.id === caseFilter) : cases;

  if (filtered.length === 0) {
    console.error(`No test case found with id "${caseFilter}"`);
    process.exit(2);
  }

  const browser = await getBrowser();
  const page = await browser.newPage();
  await page.goto('about:blank');

  fs.mkdirSync(OUTPUT_ROOT, { recursive: true });

  const results = [];
  let passCount = 0;
  let failCount = 0;

  const padId   = 24;
  const padPct  = 10;
  const padVerd = 12;

  console.log('Screenshot Comparison Evaluation');
  console.log('================================\n');
  console.log(
    ' #  ' +
    'ID'.padEnd(padId) +
    'matchPct'.padEnd(padPct) +
    'border%'.padEnd(padPct) +
    'verdict'.padEnd(padVerd) +
    'border_v'.padEnd(padVerd) +
    'result'
  );
  console.log(
    '--- ' +
    '-'.repeat(padId) +
    '-'.repeat(padPct) +
    '-'.repeat(padPct) +
    '-'.repeat(padVerd) +
    '-'.repeat(padVerd) +
    '------'
  );

  for (let i = 0; i < filtered.length; i++) {
    const tc = filtered[i];
    const outDir = path.join(OUTPUT_ROOT, tc.id);
    fs.mkdirSync(outDir, { recursive: true });

    const specA = tc.baseA ?? tc.base;
    const specB = tc.mutation.type === 'use_baseB'
      ? tc.baseB
      : applyMutation(tc.base, tc.mutation);

    const bufA = await renderSpec(page, specA);
    const bufB = await renderSpec(page, specB);

    const pathA = path.join(outDir, 'a.png');
    const pathB = path.join(outDir, 'b.png');
    fs.writeFileSync(pathA, bufA);
    fs.writeFileSync(pathB, bufB);

    const { exitCode, stdout, stderr } = runCompare(pathA, pathB, outDir);

    let comparison = null;
    const jsonPath = path.join(outDir, 'comparison.json');
    try {
      comparison = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    } catch {
      // comparison.json may not exist on error
    }

    const assertions = [];
    if (comparison) {
      assertions.push(assertRange(comparison.matchPct, tc.expect.matchPct, 'matchPct in range'));
      assertions.push(assertRange(comparison.borderMatchPct, tc.expect.borderMatchPct, 'borderMatchPct in range'));
      assertions.push(assertEqual(comparison.verdict, tc.expect.verdict, 'verdict'));
      assertions.push(assertEqual(comparison.borderVerdict, tc.expect.borderVerdict, 'borderVerdict'));
    } else {
      assertions.push({ pass: false, label: 'compare.js produced output', actual: 'no comparison.json', expected: 'comparison.json' });
    }

    const allPass = assertions.every(a => a.pass);
    if (allPass) passCount++; else failCount++;

    const matchStr   = comparison ? `${comparison.matchPct}%` : 'ERR';
    const borderStr  = comparison ? `${comparison.borderMatchPct}%` : 'ERR';
    const verdStr    = comparison?.verdict ?? 'ERR';
    const bVerdStr   = comparison?.borderVerdict ?? 'ERR';
    const resultStr  = allPass ? 'PASS' : 'FAIL';

    console.log(
      `${String(i + 1).padStart(2)}  ` +
      tc.id.padEnd(padId) +
      matchStr.padEnd(padPct) +
      borderStr.padEnd(padPct) +
      verdStr.padEnd(padVerd) +
      bVerdStr.padEnd(padVerd) +
      resultStr
    );

    if (verbose || !allPass) {
      for (const a of assertions) {
        if (a.skipped) continue;
        const icon = a.pass ? '  ✓' : '  ✗';
        console.log(`${icon} ${a.label}: ${a.actual} (expected ${a.expected})`);
      }
    }

    results.push({
      id: tc.id,
      name: tc.name,
      actual: comparison ?? { error: 'no output' },
      expected: tc.expect,
      assertions,
      pass: allPass,
    });
  }

  await browser.close();

  console.log(`\n================================`);
  console.log(`Results: ${passCount}/${filtered.length} passed, ${failCount} failed`);

  const timestamp = new Date().toISOString();

  const report = {
    timestamp,
    totalCases: filtered.length,
    passed: passCount,
    failed: failCount,
    cases: results,
  };
  fs.writeFileSync(path.join(OUTPUT_ROOT, 'report.json'), JSON.stringify(report, null, 2));

  const md = buildMarkdownReport(results, passCount, failCount, filtered.length, timestamp);
  fs.writeFileSync(path.join(OUTPUT_ROOT, 'report.md'), md);

  console.log(`JSON:     ${path.join(OUTPUT_ROOT, 'report.json')}`);
  console.log(`Markdown: ${path.join(OUTPUT_ROOT, 'report.md')}`);

  process.exit(failCount > 0 ? 1 : 0);
})().catch(err => {
  console.error('evaluate.js error:', err.message);
  process.exit(2);
});
