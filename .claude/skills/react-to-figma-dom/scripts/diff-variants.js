#!/usr/bin/env node
/**
 * diff-variants.js
 * Compares all captured variant DOM trees to identify visually identical pairs.
 *
 * Reads every dom.json under a variants/ directory, diffs every pair on:
 *   - structure (tag tree shape, child counts)
 *   - styles   (computed CSS on every corresponding node)
 *   - bounds   (width/height on every corresponding node)
 *   - text     (text content on every corresponding node)
 *
 * Outputs:
 *   - Per-pair verdicts (IDENTICAL / STYLE_ONLY / TEXT_ONLY / STRUCTURE_DIFFERENT)
 *   - Visual equivalence groups (sets of variants that are IDENTICAL)
 *   - A markdown summary written to the component directory
 *
 * Usage:
 *   node diff-variants.js --variants-dir .temp/react-to-figma-dom/components/Badge/variants
 *
 * Options:
 *   --variants-dir <path>   Path to the variants/ directory (required)
 *   --tolerance <px>        Numeric tolerance for style values, default 1
 *   --format <json|md>      Output format, default md (markdown to stdout + file)
 *   --output <path>         Output file path (default: ../variant-diffs.md relative to variants-dir)
 */

const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { tolerance: 1, format: 'md', variantsDir: null, output: null };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--variants-dir' && args[i + 1]) opts.variantsDir = args[++i];
    else if (args[i] === '--tolerance' && args[i + 1]) opts.tolerance = parseFloat(args[++i]);
    else if (args[i] === '--format' && args[i + 1]) opts.format = args[++i];
    else if (args[i] === '--output' && args[i + 1]) opts.output = args[++i];
  }
  if (!opts.variantsDir) {
    console.error('Usage: node diff-variants.js --variants-dir <path>');
    process.exit(1);
  }
  if (!opts.output) {
    opts.output = path.join(path.dirname(opts.variantsDir), 'variant-diffs.md');
  }
  return opts;
}

function loadVariants(variantsDir) {
  const entries = fs.readdirSync(variantsDir, { withFileTypes: true });
  const variants = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const domPath = path.join(variantsDir, entry.name, 'dom.json');
    if (!fs.existsSync(domPath)) continue;
    const raw = JSON.parse(fs.readFileSync(domPath, 'utf-8'));
    variants.push({
      name: entry.name,
      structure: raw.structure,
      portalContent: raw.portalContent || []
    });
  }
  return variants.sort((a, b) => a.name.localeCompare(b.name));
}

// Parse a CSS numeric value, stripping units. Returns NaN for non-numeric.
function parseNumeric(val) {
  if (typeof val !== 'string') return NaN;
  const match = val.match(/^(-?[\d.]+)/);
  return match ? parseFloat(match[1]) : NaN;
}

// Compare two style values with optional numeric tolerance.
function stylesEqual(valA, valB, tolerance) {
  if (valA === valB) return true;
  const numA = parseNumeric(valA);
  const numB = parseNumeric(valB);
  if (!isNaN(numA) && !isNaN(numB)) {
    return Math.abs(numA - numB) <= tolerance;
  }
  return false;
}

// Recursively diff two DOM structure nodes.
// Returns { structureMatch, styleDiffs, boundsDiffs, textDiffs }
function diffNodes(nodeA, nodeB, tolerance, nodePath) {
  const result = {
    structureMatch: true,
    styleDiffs: [],
    boundsDiffs: [],
    textDiffs: [],
  };

  if (!nodeA && !nodeB) return result;
  if (!nodeA || !nodeB) {
    result.structureMatch = false;
    return result;
  }

  // Tag mismatch = structural difference
  if ((nodeA.tag || '') !== (nodeB.tag || '')) {
    result.structureMatch = false;
    return result;
  }

  // Text content diff (ignoring null vs undefined)
  const textA = nodeA.text || null;
  const textB = nodeB.text || null;
  if (textA !== textB) {
    result.textDiffs.push({ path: nodePath, a: textA, b: textB });
  }

  // Style diffs
  const stylesA = nodeA.styles || {};
  const stylesB = nodeB.styles || {};
  const allKeys = new Set([...Object.keys(stylesA), ...Object.keys(stylesB)]);
  for (const key of allKeys) {
    const vA = stylesA[key] || '';
    const vB = stylesB[key] || '';
    if (!stylesEqual(vA, vB, tolerance)) {
      result.styleDiffs.push({ path: nodePath, property: key, a: vA, b: vB });
    }
  }

  // Bounds diffs
  const boundsA = nodeA.bounds || {};
  const boundsB = nodeB.bounds || {};
  const wDelta = Math.abs((boundsA.width || 0) - (boundsB.width || 0));
  const hDelta = Math.abs((boundsA.height || 0) - (boundsB.height || 0));
  if (wDelta > tolerance || hDelta > tolerance) {
    result.boundsDiffs.push({
      path: nodePath,
      a: { width: boundsA.width, height: boundsA.height },
      b: { width: boundsB.width, height: boundsB.height },
    });
  }

  // Children: compare count then recurse
  const childrenA = nodeA.children || [];
  const childrenB = nodeB.children || [];
  if (childrenA.length !== childrenB.length) {
    result.structureMatch = false;
    return result;
  }

  for (let i = 0; i < childrenA.length; i++) {
    const childPath = `${nodePath} > ${childrenA[i].tag || '?'}[${i}]`;
    const childDiff = diffNodes(childrenA[i], childrenB[i], tolerance, childPath);
    if (!childDiff.structureMatch) result.structureMatch = false;
    result.styleDiffs.push(...childDiff.styleDiffs);
    result.boundsDiffs.push(...childDiff.boundsDiffs);
    result.textDiffs.push(...childDiff.textDiffs);
  }

  return result;
}

function classifyDiff(diff) {
  if (!diff.structureMatch) return 'STRUCTURE_DIFFERENT';
  const hasStyleDiffs = diff.styleDiffs.length > 0;
  const hasBoundsDiffs = diff.boundsDiffs.length > 0;
  const hasTextDiffs = diff.textDiffs.length > 0;

  if (!hasStyleDiffs && !hasBoundsDiffs && !hasTextDiffs) return 'IDENTICAL';
  if (!hasStyleDiffs && !hasBoundsDiffs && hasTextDiffs) return 'TEXT_ONLY';
  if (hasTextDiffs && !hasStyleDiffs && !hasBoundsDiffs) return 'TEXT_ONLY';
  if (!hasTextDiffs && (hasStyleDiffs || hasBoundsDiffs)) return 'STYLE_ONLY';
  return 'DIFFERENT';
}

function buildGroups(variants, pairResults) {
  // Union-find for equivalence groups (IDENTICAL or TEXT_ONLY pairs)
  const parent = {};
  for (const v of variants) parent[v.name] = v.name;

  function find(x) {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  }
  function union(a, b) {
    const ra = find(a), rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  }

  for (const pr of pairResults) {
    if (pr.verdict === 'IDENTICAL' || pr.verdict === 'TEXT_ONLY') {
      union(pr.a, pr.b);
    }
  }

  const groups = {};
  for (const v of variants) {
    const root = find(v.name);
    if (!groups[root]) groups[root] = [];
    groups[root].push(v.name);
  }
  return Object.values(groups).sort((a, b) => a[0].localeCompare(b[0]));
}

function formatMarkdown(variants, pairResults, groups) {
  const lines = [];
  lines.push('# Variant Diff Report');
  lines.push('');
  lines.push(`**Variants compared**: ${variants.length}`);
  lines.push(`**Pairs analyzed**: ${pairResults.length}`);
  lines.push(`**Visual groups**: ${groups.length}`);
  lines.push('');

  // Summary matrix
  lines.push('## Verdict Matrix');
  lines.push('');
  const names = variants.map(v => v.name);
  // Abbreviated names for column headers
  const abbrev = names.map((n, i) => `V${i + 1}`);
  lines.push(`| | ${abbrev.join(' | ')} |`);
  lines.push(`|---|${abbrev.map(() => '---').join('|')}|`);

  const verdictMap = {};
  for (const pr of pairResults) {
    verdictMap[`${pr.a}|${pr.b}`] = pr.verdict;
    verdictMap[`${pr.b}|${pr.a}`] = pr.verdict;
  }
  for (let i = 0; i < names.length; i++) {
    const cells = [];
    for (let j = 0; j < names.length; j++) {
      if (i === j) { cells.push('—'); continue; }
      const v = verdictMap[`${names[i]}|${names[j]}`] || '?';
      const symbol = v === 'IDENTICAL' ? '=' : v === 'TEXT_ONLY' ? 'T' : v === 'STYLE_ONLY' ? 'S' : v === 'STRUCTURE_DIFFERENT' ? 'X' : 'D';
      cells.push(symbol);
    }
    lines.push(`| **V${i + 1}** ${names[i]} | ${cells.join(' | ')} |`);
  }
  lines.push('');
  lines.push('Legend: `=` IDENTICAL, `T` TEXT_ONLY, `S` STYLE_ONLY, `X` STRUCTURE_DIFFERENT, `D` DIFFERENT');
  lines.push('');

  // Visual groups
  lines.push('## Visual Equivalence Groups');
  lines.push('');
  groups.forEach((group, i) => {
    lines.push(`### Group ${String.fromCharCode(65 + i)}: ${group.length} variant(s)`);
    for (const name of group) {
      lines.push(`- ${name}`);
    }
    lines.push('');
  });

  // Pair details (only non-identical)
  const nonIdentical = pairResults.filter(pr => pr.verdict !== 'IDENTICAL' && pr.verdict !== 'TEXT_ONLY');
  if (nonIdentical.length > 0) {
    lines.push('## Pair Details (non-identical only)');
    lines.push('');
    for (const pr of nonIdentical) {
      lines.push(`### ${pr.a} vs ${pr.b}`);
      lines.push(`**Verdict**: ${pr.verdict}`);
      lines.push('');

      if (!pr.diff.structureMatch) {
        lines.push('**Structure**: Different tag tree (different tags or child counts)');
        lines.push('');
      }

      if (pr.diff.styleDiffs.length > 0) {
        lines.push('**Style differences**:');
        lines.push('| Node Path | Property | A | B |');
        lines.push('|-----------|----------|---|---|');
        for (const sd of pr.diff.styleDiffs.slice(0, 20)) {
          lines.push(`| \`${sd.path}\` | ${sd.property} | \`${sd.a}\` | \`${sd.b}\` |`);
        }
        if (pr.diff.styleDiffs.length > 20) {
          lines.push(`| ... | ... | ... | ... |`);
          lines.push(`*${pr.diff.styleDiffs.length - 20} more style differences omitted*`);
        }
        lines.push('');
      }

      if (pr.diff.boundsDiffs.length > 0) {
        lines.push('**Bounds differences**:');
        lines.push('| Node Path | A (w×h) | B (w×h) |');
        lines.push('|-----------|---------|---------|');
        for (const bd of pr.diff.boundsDiffs) {
          lines.push(`| \`${bd.path}\` | ${bd.a.width}×${bd.a.height} | ${bd.b.width}×${bd.b.height} |`);
        }
        lines.push('');
      }

      if (pr.diff.textDiffs.length > 0) {
        lines.push('**Text differences**:');
        lines.push('| Node Path | A | B |');
        lines.push('|-----------|---|---|');
        for (const td of pr.diff.textDiffs) {
          lines.push(`| \`${td.path}\` | ${td.a || '(none)'} | ${td.b || '(none)'} |`);
        }
        lines.push('');
      }
    }
  }

  return lines.join('\n');
}

function formatJson(variants, pairResults, groups) {
  return JSON.stringify({
    variantCount: variants.length,
    pairCount: pairResults.length,
    groupCount: groups.length,
    groups: groups.map((g, i) => ({
      id: String.fromCharCode(65 + i),
      variants: g,
    })),
    pairs: pairResults.map(pr => ({
      a: pr.a,
      b: pr.b,
      verdict: pr.verdict,
      styleDiffCount: pr.diff.styleDiffs.length,
      boundsDiffCount: pr.diff.boundsDiffs.length,
      textDiffCount: pr.diff.textDiffs.length,
      structureMatch: pr.diff.structureMatch,
      styleDiffs: pr.diff.styleDiffs,
      boundsDiffs: pr.diff.boundsDiffs,
      textDiffs: pr.diff.textDiffs,
    })),
  }, null, 2);
}

function main() {
  const opts = parseArgs();
  const variants = loadVariants(opts.variantsDir);

  if (variants.length === 0) {
    console.error('No variants found in', opts.variantsDir);
    process.exit(1);
  }

  console.error(`Loaded ${variants.length} variants, computing ${variants.length * (variants.length - 1) / 2} pairs...`);

  const pairResults = [];
  for (let i = 0; i < variants.length; i++) {
    for (let j = i + 1; j < variants.length; j++) {
      const diff = diffNodes(
        variants[i].structure,
        variants[j].structure,
        opts.tolerance,
        variants[i].structure.tag || 'root'
      );

      const portalA = variants[i].portalContent || [];
      const portalB = variants[j].portalContent || [];
      if (portalA.length !== portalB.length) {
        diff.structureMatch = false;
      } else {
        for (let p = 0; p < portalA.length; p++) {
          const portalDiff = diffNodes(portalA[p], portalB[p], opts.tolerance, `portal[${p}]`);
          if (!portalDiff.structureMatch) diff.structureMatch = false;
          diff.styleDiffs.push(...portalDiff.styleDiffs);
          diff.boundsDiffs.push(...portalDiff.boundsDiffs);
          diff.textDiffs.push(...portalDiff.textDiffs);
        }
      }

      const verdict = classifyDiff(diff);
      pairResults.push({
        a: variants[i].name,
        b: variants[j].name,
        verdict,
        diff,
      });
    }
  }

  const groups = buildGroups(variants, pairResults);

  let output;
  if (opts.format === 'json') {
    output = formatJson(variants, pairResults, groups);
  } else {
    output = formatMarkdown(variants, pairResults, groups);
  }

  fs.writeFileSync(opts.output, output, 'utf-8');
  console.error(`Written to ${opts.output}`);

  // Print summary to stdout
  console.log(`Variants: ${variants.length} | Pairs: ${pairResults.length} | Groups: ${groups.length}`);
  const verdictCounts = {};
  for (const pr of pairResults) {
    verdictCounts[pr.verdict] = (verdictCounts[pr.verdict] || 0) + 1;
  }
  console.log(`Verdicts: ${Object.entries(verdictCounts).map(([k, v]) => `${k}=${v}`).join(', ')}`);
  console.log('Groups:');
  groups.forEach((g, i) => {
    console.log(`  ${String.fromCharCode(65 + i)}: [${g.join(', ')}]`);
  });
}

main();
