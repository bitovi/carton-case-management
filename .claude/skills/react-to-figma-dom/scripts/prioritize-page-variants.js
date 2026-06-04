#!/usr/bin/env node

/**
 * prioritize-page-variants.js
 *
 * Cross-references pages.json (route → component tree with props) against each
 * component's figma-variants.json (prop combos → variant folder names) to
 * determine which variants appear in page views.
 *
 * Outputs page-priority-manifest.json so Phase 8 can build page-needed variants first.
 *
 * Usage:
 *   node prioritize-page-variants.js --pipeline-dir .temp/react-to-figma-dom
 */

const fs = require('fs');
const path = require('path');
const { validate } = require('./validate-output');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { pipelineDir: null };
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--pipeline-dir') opts.pipelineDir = args[++i];
  }
  if (!opts.pipelineDir) {
    console.error('Usage: node prioritize-page-variants.js --pipeline-dir <path>');
    process.exit(1);
  }
  return opts;
}

function loadPagesJson(pipelineDir) {
  const pagesPath = path.join(pipelineDir, 'component-hierarchy', 'pages.json');
  if (!fs.existsSync(pagesPath)) {
    console.error('pages.json not found at', pagesPath);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(pagesPath, 'utf8'));
}

function loadAllFigmaVariants(pipelineDir) {
  const componentsDir = path.join(pipelineDir, 'components');
  const map = {};
  if (!fs.existsSync(componentsDir)) return map;

  for (const compName of fs.readdirSync(componentsDir)) {
    const fvPath = path.join(componentsDir, compName, 'figma-variants.json');
    if (fs.existsSync(fvPath)) {
      try {
        map[compName] = JSON.parse(fs.readFileSync(fvPath, 'utf8'));
      } catch (_) {
        // skip malformed files
      }
    }
  }
  return map;
}

function collectComponentUsages(tree, route, usages) {
  if (!tree) return;
  const name = tree.name;
  if (name && /^[A-Z]/.test(name) && name !== 'Root') {
    if (!usages[name]) usages[name] = { propSets: [], routes: new Set() };
    usages[name].routes.add(route);
    if (tree.props && Object.keys(tree.props).length > 0) {
      usages[name].propSets.push(tree.props);
    }
  }
  if (tree.children) {
    for (const child of tree.children) {
      collectComponentUsages(child, route, usages);
    }
  }
}

function matchVariantFolder(fv, props) {
  const folderMap = fv.variantFolderMap;
  if (!folderMap || Object.keys(folderMap).length === 0) return null;

  const axes = (fv.variantAxes || []).map(a => typeof a === 'string' ? a : a.axis);
  if (axes.length === 0) return null;

  const keyParts = [];
  for (const axis of axes) {
    const lc = axis.toLowerCase();
    const val = props[lc] || props[axis];
    if (val !== undefined && typeof val === 'string') {
      keyParts.push(`${axis}=${val}`);
    }
  }
  if (keyParts.length === 0) return null;

  const key = keyParts.join(' ');
  return folderMap[key] || null;
}

function main() {
  const opts = parseArgs();
  const pagesJson = loadPagesJson(opts.pipelineDir);
  const variantsMap = loadAllFigmaVariants(opts.pipelineDir);

  const usages = {};
  const pages = pagesJson.pages || {};
  for (const [route, pageData] of Object.entries(pages)) {
    collectComponentUsages(pageData.tree, route, usages);
  }

  const manifest = {};
  const warnings = [];

  for (const [compName, usage] of Object.entries(usages)) {
    const fv = variantsMap[compName];
    const pageVariantSet = new Set();

    if (fv && fv.variantFolderMap && Object.keys(fv.variantFolderMap).length > 0) {
      for (const props of usage.propSets) {
        const folder = matchVariantFolder(fv, props);
        if (folder) pageVariantSet.add(folder);
      }
      if (pageVariantSet.size === 0) {
        const folders = Object.values(fv.variantFolderMap);
        if (folders.length > 0) pageVariantSet.add(folders[0]);
      }
    } else if (!fv) {
      warnings.push(`${compName}: no figma-variants.json`);
    }

    manifest[compName] = {
      pageVariants: [...pageVariantSet],
      usedOnRoutes: [...usage.routes].sort()
    };
  }

  let noPageCount = 0;
  for (const compName of Object.keys(variantsMap)) {
    if (!manifest[compName]) {
      manifest[compName] = { pageVariants: [], usedOnRoutes: [] };
      noPageCount++;
    }
  }

  const outPath = path.join(opts.pipelineDir, 'page-priority-manifest.json');
  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));

  const schemaPath = path.join(__dirname, 'schemas', 'page-priority-manifest.schema.json');
  if (fs.existsSync(schemaPath)) {
    const result = validate(schemaPath, outPath);
    if (!result.valid) {
      console.error('Output validation FAILED:');
      result.errors.forEach(e => console.error(`  - ${e}`));
      process.exit(1);
    }
  }

  const withPageVariants = Object.values(manifest).filter(v => v.pageVariants.length > 0).length;
  const totalPageVariants = Object.values(manifest).reduce((s, v) => s + v.pageVariants.length, 0);

  console.log('Page Priority Manifest:');
  console.log(`  Routes analyzed: ${Object.keys(pages).length}`);
  console.log(`  Components with page variants: ${withPageVariants}`);
  console.log(`  Components with no page variants (build in Phase H): ${noPageCount}`);
  console.log(`  Total page-needed variant builds: ${totalPageVariants}`);
  if (warnings.length > 0) {
    console.log(`\nWarnings (${warnings.length}):`);
    warnings.forEach(w => console.log(`  - ${w}`));
  }
  console.log(`\nWritten to: ${outPath}`);
}

main();
