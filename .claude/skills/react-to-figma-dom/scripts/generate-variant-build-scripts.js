#!/usr/bin/env node

/**
 * generate-variant-build-scripts.js
 *
 * Loops over variant folders and runs:
 *   1. dom-to-figma-ir.js  (DOM → Figma IR)
 *   2. ir-to-figma-code.js (Figma IR → executable build script)
 * Then writes preprocess-status.json summarizing what was processed.
 *
 * Supports two modes:
 *   --component <Name>  Process a single component (used by Phase H build-remaining)
 *   --all               Process ALL components in {pipelineDir}/components/
 *
 * Variant discovery: scans variants/ for subdirectories containing dom.json.
 * If figma-variants.json has a populated variantFolderMap, uses that instead
 * and automatically passes --variant-props to ir-to-figma-code.js.
 *
 * Usage:
 *   node generate-variant-build-scripts.js \
 *     --all \
 *     --pipeline-dir .temp/react-to-figma-dom \
 *     --skill-dir .claude/skills/react-to-figma-dom \
 *     [--force]
 *
 *   node generate-variant-build-scripts.js \
 *     --component Badge \
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
      'Usage: node generate-variant-build-scripts.js (--component <Name> | --all) --pipeline-dir <path> --skill-dir <path> [--force]'
    );
    process.exit(1);
  }
  if (opts.component && opts.all) {
    console.error('Error: --component and --all are mutually exclusive');
    process.exit(1);
  }
  return opts;
}

function discoverVariantFolders(componentDir) {
  const figmaVariantsPath = path.join(componentDir, 'figma-variants.json');
  if (fs.existsSync(figmaVariantsPath)) {
    const fv = JSON.parse(fs.readFileSync(figmaVariantsPath, 'utf8'));
    if (fv.variantFolderMap && Object.keys(fv.variantFolderMap).length > 0) {
      return Object.values(fv.variantFolderMap).map(p => path.basename(p));
    }
  }

  const variantsDir = path.join(componentDir, 'variants');
  if (!fs.existsSync(variantsDir)) return [];

  return fs.readdirSync(variantsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .filter(d => fs.existsSync(path.join(variantsDir, d.name, 'dom.json')))
    .map(d => d.name);
}

function buildVariantPropsMap(componentDir) {
  const figmaVariantsPath = path.join(componentDir, 'figma-variants.json');
  if (!fs.existsSync(figmaVariantsPath)) return {};

  const fv = JSON.parse(fs.readFileSync(figmaVariantsPath, 'utf8'));
  if (!fv.variantFolderMap || Object.keys(fv.variantFolderMap).length === 0) return {};

  const map = {};
  for (const [propsString, folderPath] of Object.entries(fv.variantFolderMap)) {
    map[path.basename(folderPath)] = propsString;
  }
  return map;
}

function discoverAllComponents(pipelineDir) {
  const componentsDir = path.join(pipelineDir, 'components');
  if (!fs.existsSync(componentsDir)) return [];
  return fs.readdirSync(componentsDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .filter(d => fs.existsSync(path.join(componentsDir, d.name, 'variants')))
    .map(d => d.name)
    .sort();
}

function processComponent(componentName, opts) {
  const componentDir = path.join(opts.pipelineDir, 'components', componentName);
  const variantsDir = path.join(componentDir, 'variants');
  const irScript = path.join(opts.skillDir, 'scripts', 'dom-to-figma-ir.js');
  const codeScript = path.join(opts.skillDir, 'scripts', 'ir-to-figma-code.js');

  if (!fs.existsSync(componentDir)) {
    console.error(`Component directory not found: ${componentDir}`);
    return { componentName, status: 'error', error: 'directory not found' };
  }

  const folders = discoverVariantFolders(componentDir);
  if (folders.length === 0) {
    console.error(`No variant folders with dom.json found in ${variantsDir}`);
    return { componentName, status: 'error', error: 'no variant folders' };
  }

  const variantPropsMap = buildVariantPropsMap(componentDir);

  const variablesMap = path.join(opts.pipelineDir, 'figma-variables-map.json');
  const designTokens = path.join(opts.pipelineDir, 'design-tokens.json');
  const iconsMap = path.join(opts.pipelineDir, 'figma-icons-map.json');
  const builtComponents = path.join(opts.pipelineDir, 'built-components.json');

  const status = {
    componentName,
    variantsProcessed: 0,
    variantsSkipped: 0,
    variantsFailed: 0,
    status: 'complete',
    variants: {},
  };

  let hasFailure = false;

  console.log(`Processing ${componentName}: ${folders.length} variant(s)`);

  for (const folder of folders) {
    const variantDir = path.join(variantsDir, folder);
    const domFile = path.join(variantDir, 'dom.json');
    const fiberMap = path.join(variantDir, 'fiber-dom-map.json');
    const irOutput = path.join(variantDir, 'figma-ir.json');
    const buildOutput = path.join(variantDir, 'build-script.js');

    if (!opts.force && fs.existsSync(irOutput) && fs.existsSync(buildOutput)) {
      console.log(`  [skip] ${folder} — already has IR + build script`);
      status.variantsSkipped++;
      status.variants[folder] = { ir: true, buildScript: true, skipped: true };
      continue;
    }

    let irOk = false;
    let buildOk = false;

    try {
      const irArgs = [
        irScript,
        '--dom-file', domFile,
        '--variables-map', variablesMap,
        '--design-tokens', designTokens,
        '--icons-map', iconsMap,
        '--component-name', componentName,
        '--output', irOutput,
      ];
      if (fs.existsSync(fiberMap)) {
        irArgs.push('--fiber-map', fiberMap);
      }
      if (fs.existsSync(builtComponents)) {
        irArgs.push('--built-components', builtComponents);
      }

      execFileSync('node', irArgs, { stdio: ['pipe', 'pipe', 'pipe'] });
      irOk = fs.existsSync(irOutput);
    } catch (err) {
      console.error(`  [FAIL] ${folder} — IR generation failed: ${err.stderr ? err.stderr.toString().trim() : err.message}`);
    }

    if (irOk) {
      try {
        const codeArgs = [
          codeScript,
          '--ir-file', irOutput,
          '--output', buildOutput,
        ];
        const propsString = variantPropsMap[folder];
        if (propsString) {
          codeArgs.push('--variant-props', propsString);
        }

        execFileSync('node', codeArgs, { stdio: ['pipe', 'pipe', 'pipe'] });
        buildOk = fs.existsSync(buildOutput);
      } catch (err) {
        console.error(`  [FAIL] ${folder} — build script generation failed: ${err.stderr ? err.stderr.toString().trim() : err.message}`);
      }
    }

    if (irOk && buildOk) {
      console.log(`  [ok]   ${folder}`);
      status.variantsProcessed++;
      status.variants[folder] = { ir: true, buildScript: true };
    } else {
      console.error(`  [FAIL] ${folder} — ir:${irOk} buildScript:${buildOk}`);
      status.variantsFailed++;
      status.variants[folder] = { ir: irOk, buildScript: buildOk };
      hasFailure = true;
    }
  }

  if (hasFailure) {
    status.status = 'partial';
  }

  const statusPath = path.join(componentDir, 'preprocess-status.json');
  fs.writeFileSync(statusPath, JSON.stringify(status, null, 2));

  console.log(`  ${componentName}: ${status.variantsProcessed} processed, ${status.variantsSkipped} skipped, ${status.variantsFailed} failed`);

  return status;
}

function main() {
  const opts = parseArgs();

  const irScript = path.join(opts.skillDir, 'scripts', 'dom-to-figma-ir.js');
  const codeScript = path.join(opts.skillDir, 'scripts', 'ir-to-figma-code.js');
  if (!fs.existsSync(irScript)) {
    console.error(`dom-to-figma-ir.js not found: ${irScript}`);
    process.exit(1);
  }
  if (!fs.existsSync(codeScript)) {
    console.error(`ir-to-figma-code.js not found: ${codeScript}`);
    process.exit(1);
  }

  let components;
  if (opts.all) {
    components = discoverAllComponents(opts.pipelineDir);
    if (components.length === 0) {
      console.error(`No component directories found in ${path.join(opts.pipelineDir, 'components')}`);
      process.exit(1);
    }
    console.log(`Batch mode: ${components.length} component(s) to process\n`);
  } else {
    components = [opts.component];
  }

  let totalProcessed = 0;
  let totalSkipped = 0;
  let totalFailed = 0;
  let componentErrors = 0;

  for (const componentName of components) {
    const result = processComponent(componentName, opts);
    if (result.error) {
      componentErrors++;
    } else {
      totalProcessed += result.variantsProcessed;
      totalSkipped += result.variantsSkipped;
      totalFailed += result.variantsFailed;
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Components: ${components.length - componentErrors} ok, ${componentErrors} errors`);
  console.log(`Variants: ${totalProcessed} processed, ${totalSkipped} skipped, ${totalFailed} failed`);

  if (totalFailed > 0 || componentErrors > 0) process.exit(1);
}

main();
