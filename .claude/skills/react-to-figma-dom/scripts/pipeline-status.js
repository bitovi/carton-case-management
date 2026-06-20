#!/usr/bin/env node

/**
 * pipeline-status.js
 *
 * Scans the react-to-figma-dom pipeline output directory and reports
 * per-component artifact completeness across all pipeline phases.
 *
 * Usage:
 *   node pipeline-status.js --pipeline-dir .temp/react-to-figma-dom
 *   node pipeline-status.js --pipeline-dir .temp/react-to-figma-dom --component Badge
 *   node pipeline-status.js --pipeline-dir .temp/react-to-figma-dom --format json --output status.json
 *
 * Options:
 *   --pipeline-dir <path>   Root pipeline output directory (required)
 *   --component <name>      Report on a single component (default: all)
 *   --format <table|json>   Output format (default: table)
 *   --output <path>         Write output to file (default: stdout)
 */

const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { pipelineDir: null, component: null, format: 'table', output: null };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--pipeline-dir': opts.pipelineDir = args[++i]; break;
      case '--component': opts.component = args[++i]; break;
      case '--format': opts.format = args[++i]; break;
      case '--output': opts.output = args[++i]; break;
    }
  }
  if (!opts.pipelineDir) {
    console.error('Usage: node pipeline-status.js --pipeline-dir <path> [--component <name>] [--format table|json] [--output <path>]');
    process.exit(1);
  }
  return opts;
}

function countFiles(dir, filename) {
  if (!fs.existsSync(dir)) return 0;
  let count = 0;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (fs.existsSync(path.join(dir, entry.name, filename))) count++;
    }
  }
  return count;
}

function fileExists(p) {
  return fs.existsSync(p);
}

function analyzeComponent(name, componentsDir) {
  const dir = path.join(componentsDir, name);
  const variantsDir = path.join(dir, 'variants');

  const domCount = countFiles(variantsDir, 'dom.json');
  const irCount = countFiles(variantsDir, 'figma-ir.json');
  const buildCount = countFiles(variantsDir, 'build-script.js');
  const screenshotCount = countFiles(variantsDir, 'screenshot.png');

  const artifacts = {
    analysis_md: fileExists(path.join(dir, 'analysis.md')),
    props_md: fileExists(path.join(dir, 'props.md')),
    variants_md: fileExists(path.join(dir, 'code-variants.json')),
    capture_manifest: fileExists(path.join(variantsDir, 'capture-manifest.json')),
    variant_diffs_md: fileExists(path.join(dir, 'variant-diffs.md')),
    figma_variants_json: fileExists(path.join(dir, 'figma-variants.json')),
    preprocess_status: fileExists(path.join(dir, 'preprocess-status.json')),
    figma_result: fileExists(path.join(dir, 'figma-result.json')),
  };

  let status = 'not-started';
  if (artifacts.analysis_md || artifacts.props_md) status = 'analyzed';
  if (artifacts.variants_md) status = 'variants-defined';
  if (domCount > 0) status = 'captured';
  if (artifacts.figma_variants_json) status = 'classified';
  if (irCount > 0) status = 'preprocessed';
  if (buildCount > 0) status = 'ready-to-build';
  if (artifacts.figma_result) status = 'built';

  let level = null;
  let preprocessStatus = null;
  if (artifacts.preprocess_status) {
    try {
      preprocessStatus = JSON.parse(fs.readFileSync(path.join(dir, 'preprocess-status.json'), 'utf8'));
    } catch (_) {}
  }

  return {
    name,
    status,
    level,
    variants: {
      captured: domCount,
      screenshots: screenshotCount,
      ir: irCount,
      buildScripts: buildCount,
    },
    artifacts,
    preprocessStatus: preprocessStatus ? preprocessStatus.status : null,
  };
}

function loadBuildOrder(pipelineDir) {
  const buildOrderPath = path.join(pipelineDir, 'build-order.json');
  if (!fs.existsSync(buildOrderPath)) return {};

  const data = JSON.parse(fs.readFileSync(buildOrderPath, 'utf8'));
  const levels = {};
  for (const level of data.levels || []) {
    for (const comp of level.components || []) {
      levels[comp.name] = level.level;
    }
  }
  return levels;
}

function formatTable(results, pipelineSummary) {
  const lines = [];
  lines.push('# Pipeline Status Report\n');

  if (pipelineSummary) {
    lines.push('## Pipeline-Level Artifacts\n');
    for (const [key, exists] of Object.entries(pipelineSummary)) {
      lines.push(`- ${exists ? '✓' : '✗'} ${key}`);
    }
    lines.push('');
  }

  lines.push('## Per-Component Status\n');
  lines.push('| Component | Level | Status | Captured | IR | Build | Artifacts |');
  lines.push('|-----------|-------|--------|----------|----|-------|-----------|');

  for (const r of results) {
    const artifactFlags = [
      r.artifacts.analysis_md ? 'A' : '',
      r.artifacts.props_md ? 'P' : '',
      r.artifacts.variants_md ? 'V' : '',
      r.artifacts.figma_variants_json ? 'C' : '',
      r.artifacts.preprocess_status ? 'S' : '',
      r.artifacts.figma_result ? 'B' : '',
    ].filter(Boolean).join('');

    lines.push(
      `| ${r.name} | ${r.level ?? '-'} | ${r.status} | ${r.variants.captured} | ${r.variants.ir} | ${r.variants.buildScripts} | ${artifactFlags} |`
    );
  }

  lines.push('');
  lines.push('Legend: A=analysis.md P=props.md V=code-variants.json C=figma-variants.json S=preprocess-status.json B=figma-result.json');

  const statusCounts = {};
  for (const r of results) {
    statusCounts[r.status] = (statusCounts[r.status] || 0) + 1;
  }
  lines.push('\n## Summary\n');
  lines.push(`Total components: ${results.length}`);
  for (const [status, count] of Object.entries(statusCounts).sort()) {
    lines.push(`- ${status}: ${count}`);
  }

  return lines.join('\n');
}

function main() {
  const opts = parseArgs();
  const componentsDir = path.join(opts.pipelineDir, 'components');

  if (!fs.existsSync(componentsDir)) {
    console.error(`Components directory not found: ${componentsDir}`);
    process.exit(1);
  }

  const componentNames = opts.component
    ? [opts.component]
    : fs.readdirSync(componentsDir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name)
        .sort();

  if (componentNames.length === 0) {
    console.error('No components found.');
    process.exit(1);
  }

  const buildLevels = loadBuildOrder(opts.pipelineDir);
  const results = componentNames.map(name => {
    const r = analyzeComponent(name, componentsDir);
    r.level = buildLevels[name] ?? null;
    return r;
  });

  const pipelineSummary = {
    'design-tokens.json': fileExists(path.join(opts.pipelineDir, 'design-tokens.json')),
    'figma-variables-map.json': fileExists(path.join(opts.pipelineDir, 'figma-variables-map.json')),
    'figma-icons-map.json': fileExists(path.join(opts.pipelineDir, 'figma-icons-map.json')),
    'built-components.json': fileExists(path.join(opts.pipelineDir, 'built-components.json')),
    'build-order.md': fileExists(path.join(opts.pipelineDir, 'build-order.md')),
    'state.json': fileExists(path.join(opts.pipelineDir, 'state.json')),
    'page-priority-manifest.json': fileExists(path.join(opts.pipelineDir, 'page-priority-manifest.json')),
    'scoreboard.md': fileExists(path.join(opts.pipelineDir, 'scoreboard.md')),
  };

  let output;
  if (opts.format === 'json') {
    output = JSON.stringify({ pipeline: pipelineSummary, components: results }, null, 2);
  } else {
    output = formatTable(results, pipelineSummary);
  }

  if (opts.output) {
    fs.writeFileSync(opts.output, output);
    console.log(`Status written to ${opts.output}`);
  } else {
    console.log(output);
  }
}

main();
