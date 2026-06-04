#!/usr/bin/env node
/**
 * generate-phase5-figma-code.js
 *
 * Reads design-tokens.json, icons.json, and css-figma-map.json from the pipeline
 * directory and generates self-contained JavaScript files that can be executed
 * via use_figma MCP calls. All data is inlined as JSON literals — no filesystem
 * access in the Figma plugin sandbox.
 *
 * Usage:
 *   node generate-phase5-figma-code.js --pipeline-dir .temp/react-to-figma-dom
 *
 * Output:
 *   {pipeline-dir}/phase5-figma-calls/
 *     00-probe.js
 *     01-create-pages.js
 *     02-create-containers.js
 *     03-palette-batch-N.js    (one per batch of ~30 tokens)
 *     04-semantic-batch-N.js   (one per batch of ~30 tokens)
 *     05-numbers.js
 *     06-icons-batch-N.js      (one per batch of ~10 icons)
 *     07-build-maps.js         (not a use_figma script — Node.js script to assemble maps)
 *     manifest.json            (ordered list of all calls with metadata)
 */

const fs = require('fs');
const path = require('path');

const VARIABLE_BATCH_SIZE = 30;
const ICON_BATCH_SIZE = 10;

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '');
    opts[key] = args[i + 1];
  }
  return opts;
}

function hexToRgb01(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  return { r: Math.round(r * 1000) / 1000, g: Math.round(g * 1000) / 1000, b: Math.round(b * 1000) / 1000 };
}

function batchArray(arr, size) {
  const batches = [];
  for (let i = 0; i < arr.length; i += size) {
    batches.push(arr.slice(i, i + size));
  }
  return batches;
}

function generateProbeCode() {
  return `// Phase 5 Step 0: Probe — verify use_figma connectivity
return { ok: true, timestamp: Date.now() };
`;
}

function generateCreatePagesCode() {
  return `// Phase 5 Step 1: Create pages
// Check existing pages and create missing ones
const existingPages = figma.root.children.map(p => ({ name: p.name, id: p.id }));
const pageNames = ['Foundations', 'Icons', 'Components', 'Screens'];
const results = {};

for (const name of pageNames) {
  const existing = existingPages.find(p => p.name === name);
  if (existing) {
    results[name] = { id: existing.id, status: 'exists' };
  } else {
    const page = figma.createPage();
    page.name = name;
    results[name] = { id: page.id, status: 'created' };
  }
}

return results;
`;
}

function generateCreateContainersCode() {
  return `// Phase 5 Step 2: Create container frames on Components, Screens, and Icons pages
// REQUIRES: pageIds from Step 1 — pass as argument to use_figma
// The subagent must replace COMPONENTS_PAGE_ID, SCREENS_PAGE_ID, and ICONS_PAGE_ID with real IDs from Step 1

const containerConfigs = [
  { pageIdPlaceholder: 'COMPONENTS_PAGE_ID', containerName: '_Components', spacing: 60, counterSpacing: 80, width: 4000 },
  { pageIdPlaceholder: 'SCREENS_PAGE_ID', containerName: '_Screens', spacing: 60, counterSpacing: 80, width: 4000 },
  { pageIdPlaceholder: 'ICONS_PAGE_ID', containerName: '_Icons', spacing: 24, counterSpacing: 24, width: 1200 }
];

const results = {};

for (const config of containerConfigs) {
  const page = figma.getNodeById(config.pageIdPlaceholder);
  if (!page) {
    results[config.containerName] = { error: 'Page not found: ' + config.pageIdPlaceholder };
    continue;
  }

  await figma.setCurrentPageAsync(page);

  const existing = page.children.find(c => c.name === config.containerName);
  if (existing) {
    results[config.containerName] = { id: existing.id, status: 'exists' };
    continue;
  }

  const container = figma.createFrame();
  container.name = config.containerName;
  container.layoutMode = 'HORIZONTAL';
  container.layoutWrap = 'WRAP';
  container.itemSpacing = config.spacing;
  container.counterAxisSpacing = config.counterSpacing;
  container.paddingTop = 40;
  container.paddingBottom = 40;
  container.paddingLeft = 40;
  container.paddingRight = 40;
  container.resize(config.width, container.height);
  container.primaryAxisSizingMode = 'FIXED';
  container.counterAxisSizingMode = 'AUTO';
  container.fills = [];

  page.appendChild(container);
  results[config.containerName] = { id: container.id, status: 'created' };
}

return results;
`;
}

function generatePaletteBatchCode(batchTokens, batchIndex, totalBatches) {
  const tokenData = batchTokens.map(t => ({
    name: t.figmaPath.replace('Palette/', ''),
    rgb: hexToRgb01(t.resolved.hex),
    opacity: t.resolved.opacity
  }));

  return `// Phase 5 Step 3a: Create Palette variables — batch ${batchIndex + 1}/${totalBatches}
// REQUIRES: The subagent must replace PALETTE_COLLECTION_ID with the real collection ID
// On the FIRST batch, create the collection. On subsequent batches, reuse the ID.

const tokens = ${JSON.stringify(tokenData, null, 2)};

${batchIndex === 0 ? `// First batch — create the collection
const collection = figma.variables.createVariableCollection('Palette');
const collectionId = collection.id;
const modeId = collection.modes[0].modeId;
` : `// Subsequent batch — reuse existing collection
const collectionId = 'PALETTE_COLLECTION_ID';
const collection = figma.variables.getVariableCollectionById(collectionId);
const modeId = collection.modes[0].modeId;
`}

const created = [];
for (const t of tokens) {
  const v = figma.variables.createVariable(t.name, collectionId, 'COLOR');
  v.setValueForMode(modeId, { r: t.rgb.r, g: t.rgb.g, b: t.rgb.b, a: t.opacity });
  created.push({ name: t.name, id: v.id, key: v.key });
}

return { collectionId, modeId, batch: ${batchIndex + 1}, total: ${totalBatches}, variables: created };
`;
}

function generateSemanticBatchCode(batchTokens, batchIndex, totalBatches) {
  const tokenData = batchTokens.map(t => ({
    name: t.figmaPath.replace('Semantic/', ''),
    rgb: hexToRgb01(t.resolved.hex),
    opacity: t.resolved.opacity
  }));

  return `// Phase 5 Step 3b: Create Semantic variables — batch ${batchIndex + 1}/${totalBatches}
// REQUIRES: The subagent must replace SEMANTIC_COLLECTION_ID with the real collection ID

const tokens = ${JSON.stringify(tokenData, null, 2)};

${batchIndex === 0 ? `// First batch — create the collection
const collection = figma.variables.createVariableCollection('Semantic');
const collectionId = collection.id;
const modeId = collection.modes[0].modeId;
` : `// Subsequent batch — reuse existing collection
const collectionId = 'SEMANTIC_COLLECTION_ID';
const collection = figma.variables.getVariableCollectionById(collectionId);
const modeId = collection.modes[0].modeId;
`}

const created = [];
for (const t of tokens) {
  const v = figma.variables.createVariable(t.name, collectionId, 'COLOR');
  v.setValueForMode(modeId, { r: t.rgb.r, g: t.rgb.g, b: t.rgb.b, a: t.opacity });
  created.push({ name: t.name, id: v.id, key: v.key });
}

return { collectionId, modeId, batch: ${batchIndex + 1}, total: ${totalBatches}, variables: created };
`;
}

function generateNumbersCode(tokens) {
  const tokenData = tokens.map(t => ({
    name: t.figmaPath.replace('Numbers/', ''),
    value: t.resolvedPx || 0
  }));

  return `// Phase 5 Step 3c: Create Numbers variables (single batch)

const tokens = ${JSON.stringify(tokenData, null, 2)};

const collection = figma.variables.createVariableCollection('Numbers');
const collectionId = collection.id;
const modeId = collection.modes[0].modeId;

const created = [];
for (const t of tokens) {
  const v = figma.variables.createVariable(t.name, collectionId, 'FLOAT');
  v.setValueForMode(modeId, t.value);
  created.push({ name: t.name, id: v.id, key: v.key });
}

return { collectionId, modeId, variables: created };
`;
}

function generateIconBatchCode(batchIcons, batchIndex, totalBatches) {
  const iconData = batchIcons.map(icon => ({
    name: icon.figmaName,
    svgString: icon.svgString
  }));

  return `// Phase 5 Step 4: Create icon components — batch ${batchIndex + 1}/${totalBatches}
// REQUIRES: The subagent must replace ICONS_PAGE_ID with the real page ID from Step 1
// Icons are appended into the _Icons auto-layout container (created in Step 2)

const page = figma.getNodeById('ICONS_PAGE_ID');
await figma.setCurrentPageAsync(page);

const container = page.children.find(c => c.name === '_Icons');
if (!container) {
  return { error: '_Icons container not found on Icons page. Run 02-create-containers first.' };
}

const icons = ${JSON.stringify(iconData, null, 2)};

const created = [];
for (const icon of icons) {
  try {
    const existing = container.children.find(c => c.name === icon.name);
    if (existing) {
      created.push({ name: icon.name, id: existing.id, status: 'exists' });
      continue;
    }

    const node = figma.createNodeFromSvg(icon.svgString);
    node.name = icon.name;

    const comp = figma.createComponent();
    comp.name = icon.name;
    comp.resize(node.width, node.height);

    while (node.children.length > 0) {
      comp.appendChild(node.children[0]);
    }
    node.remove();

    container.appendChild(comp);
    created.push({ name: icon.name, id: comp.id, status: 'created' });
  } catch (err) {
    created.push({ name: icon.name, error: err.message, status: 'failed' });
  }
}

return { batch: ${batchIndex + 1}, total: ${totalBatches}, icons: created };
`;
}

function generateBuildMapsScript(pipelineDir, cssFigmaMap) {
  return `#!/usr/bin/env node
/**
 * Phase 5 Step 7: Assemble output maps from use_figma results
 *
 * This is a Node.js script (NOT a use_figma script). Run it locally after
 * executing all use_figma calls. It reads the results written by the subagent
 * and produces the final map files.
 *
 * Usage:
 *   node phase5-figma-calls/07-build-maps.js
 *
 * The subagent should save results from each use_figma call to:
 *   phase5-figma-calls/results/NN-result.json
 *
 * This script reads those results and produces:
 *   figma-variables-map.json
 *   figma-icons-map.json
 *   figma-file-setup.json
 */

const fs = require('fs');
const path = require('path');

const pipelineDir = ${JSON.stringify(pipelineDir)};
const resultsDir = path.join(pipelineDir, 'phase5-figma-calls', 'results');
const cssFigmaMap = ${JSON.stringify(cssFigmaMap)};

// Read all result files
const resultFiles = fs.readdirSync(resultsDir).filter(f => f.endsWith('.json')).sort();
const results = {};
for (const f of resultFiles) {
  const key = f.replace('-result.json', '');
  results[key] = JSON.parse(fs.readFileSync(path.join(resultsDir, f), 'utf-8'));
}

// Build figma-variables-map.json
const variablesMap = {};
const allVariables = {};

// Collect all variables from palette, semantic, numbers results
for (const [key, result] of Object.entries(results)) {
  if (!result.variables) continue;
  for (const v of result.variables) {
    const collection = key.startsWith('03') ? 'Palette' :
                       key.startsWith('04') ? 'Semantic' :
                       key.startsWith('05') ? 'Numbers' : null;
    if (!collection) continue;
    const figmaPath = collection + '/' + v.name;
    allVariables[figmaPath] = { variableId: v.id, key: v.key };
  }
}

// Map CSS entries to variable IDs using css-figma-map
for (const [cssKey, figmaPath] of Object.entries(cssFigmaMap)) {
  const variable = allVariables[figmaPath];
  if (variable) {
    variablesMap[cssKey] = { figmaPath, variableId: variable.variableId };
  }
}

fs.writeFileSync(
  path.join(pipelineDir, 'figma-variables-map.json'),
  JSON.stringify(variablesMap, null, 2)
);

// Build figma-icons-map.json
const iconsMap = {};
for (const [key, result] of Object.entries(results)) {
  if (!result.icons) continue;
  for (const icon of result.icons) {
    if (icon.status !== 'failed' && icon.id) {
      const simpleName = icon.name.replace('Icon/', '');
      iconsMap[simpleName] = { figmaName: icon.name, componentId: icon.id };
    }
  }
}

fs.writeFileSync(
  path.join(pipelineDir, 'figma-icons-map.json'),
  JSON.stringify(iconsMap, null, 2)
);

// Build figma-file-setup.json from pages + containers results
const pages = results['01-create-pages'] || {};
const containers = results['02-create-containers'] || {};

const fileSetup = {
  fileKey: 'SET_BY_SUBAGENT',
  pages: {
    foundations: pages.Foundations?.id || null,
    icons: pages.Icons?.id || null,
    components: pages.Components?.id || null,
    screens: pages.Screens?.id || null
  },
  containerFrames: {
    componentsFrameId: containers._Components?.id || null,
    screensFrameId: containers._Screens?.id || null
  }
};

fs.writeFileSync(
  path.join(pipelineDir, 'figma-file-setup.json'),
  JSON.stringify(fileSetup, null, 2)
);

// Summary
const varCount = Object.keys(variablesMap).length;
const iconCount = Object.keys(iconsMap).length;
console.log('Phase 5 maps assembled:');
console.log('  figma-variables-map.json: ' + varCount + ' entries');
console.log('  figma-icons-map.json: ' + iconCount + ' entries');
console.log('  figma-file-setup.json: written');
`;
}

function main() {
  const opts = parseArgs();
  const pipelineDir = opts['pipeline-dir'];

  if (!pipelineDir) {
    console.error('Usage: node generate-phase5-figma-code.js --pipeline-dir <path>');
    process.exit(1);
  }

  const tokensPath = path.join(pipelineDir, 'design-tokens.json');
  const iconsPath = path.join(pipelineDir, 'icons.json');
  const cssMapPath = path.join(pipelineDir, 'css-figma-map.json');

  if (!fs.existsSync(tokensPath)) {
    console.error('design-tokens.json not found at', tokensPath);
    process.exit(1);
  }
  if (!fs.existsSync(iconsPath)) {
    console.error('icons.json not found at', iconsPath);
    process.exit(1);
  }
  if (!fs.existsSync(cssMapPath)) {
    console.error('css-figma-map.json not found at', cssMapPath);
    process.exit(1);
  }

  const designTokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));
  const iconsData = JSON.parse(fs.readFileSync(iconsPath, 'utf-8'));
  const cssFigmaMap = JSON.parse(fs.readFileSync(cssMapPath, 'utf-8'));

  const tokens = designTokens.tokens || [];
  const icons = iconsData.icons || [];

  const paletteTokens = tokens.filter(t => t.figmaCollection === 'Palette');
  const semanticTokens = tokens.filter(t => t.figmaCollection === 'Semantic');
  const numberTokens = tokens.filter(t => t.figmaCollection === 'Numbers');
  const iconsWithSvg = icons.filter(i => i.svgString);

  console.log(`Tokens: ${paletteTokens.length} palette, ${semanticTokens.length} semantic, ${numberTokens.length} numbers`);
  console.log(`Icons: ${iconsWithSvg.length} with SVG`);

  const outputDir = path.join(pipelineDir, 'phase5-figma-calls');
  const resultsDir = path.join(outputDir, 'results');
  fs.mkdirSync(outputDir, { recursive: true });
  fs.mkdirSync(resultsDir, { recursive: true });

  const manifest = [];

  // 00: Probe
  const probeFile = '00-probe.js';
  fs.writeFileSync(path.join(outputDir, probeFile), generateProbeCode());
  manifest.push({ file: probeFile, step: 'probe', description: 'Verify use_figma connectivity' });

  // 01: Create pages
  const pagesFile = '01-create-pages.js';
  fs.writeFileSync(path.join(outputDir, pagesFile), generateCreatePagesCode());
  manifest.push({ file: pagesFile, step: 'pages', description: 'Create Figma pages', saveResultAs: '01-create-pages' });

  // 02: Create containers
  const containersFile = '02-create-containers.js';
  fs.writeFileSync(path.join(outputDir, containersFile), generateCreateContainersCode());
  manifest.push({
    file: containersFile,
    step: 'containers',
    description: 'Create container frames on Components, Screens, and Icons pages',
    requires: ['01-create-pages'],
    placeholders: ['COMPONENTS_PAGE_ID', 'SCREENS_PAGE_ID', 'ICONS_PAGE_ID'],
    saveResultAs: '02-create-containers'
  });

  // 03: Palette batches
  const paletteBatches = batchArray(paletteTokens, VARIABLE_BATCH_SIZE);
  paletteBatches.forEach((batch, i) => {
    const fileName = `03-palette-batch-${i + 1}.js`;
    fs.writeFileSync(path.join(outputDir, fileName), generatePaletteBatchCode(batch, i, paletteBatches.length));
    const entry = {
      file: fileName,
      step: 'palette',
      description: `Create Palette variables batch ${i + 1}/${paletteBatches.length} (${batch.length} vars)`,
      saveResultAs: `03-palette-batch-${i + 1}`
    };
    if (i > 0) {
      entry.requires = [`03-palette-batch-1`];
      entry.placeholders = ['PALETTE_COLLECTION_ID'];
    }
    manifest.push(entry);
  });

  // 04: Semantic batches
  const semanticBatches = batchArray(semanticTokens, VARIABLE_BATCH_SIZE);
  semanticBatches.forEach((batch, i) => {
    const fileName = `04-semantic-batch-${i + 1}.js`;
    fs.writeFileSync(path.join(outputDir, fileName), generateSemanticBatchCode(batch, i, semanticBatches.length));
    const entry = {
      file: fileName,
      step: 'semantic',
      description: `Create Semantic variables batch ${i + 1}/${semanticBatches.length} (${batch.length} vars)`,
      saveResultAs: `04-semantic-batch-${i + 1}`
    };
    if (i > 0) {
      entry.requires = [`04-semantic-batch-1`];
      entry.placeholders = ['SEMANTIC_COLLECTION_ID'];
    }
    manifest.push(entry);
  });

  // 05: Numbers (single batch)
  if (numberTokens.length > 0) {
    const numbersFile = '05-numbers.js';
    fs.writeFileSync(path.join(outputDir, numbersFile), generateNumbersCode(numberTokens));
    manifest.push({
      file: numbersFile,
      step: 'numbers',
      description: `Create Numbers variables (${numberTokens.length} vars)`,
      saveResultAs: '05-numbers'
    });
  }

  // 06: Icon batches
  const iconBatches = batchArray(iconsWithSvg, ICON_BATCH_SIZE);
  iconBatches.forEach((batch, i) => {
    const fileName = `06-icons-batch-${i + 1}.js`;
    fs.writeFileSync(path.join(outputDir, fileName), generateIconBatchCode(batch, i, iconBatches.length));
    manifest.push({
      file: fileName,
      step: 'icons',
      description: `Create icon components batch ${i + 1}/${iconBatches.length} (${batch.length} icons)`,
      requires: ['01-create-pages', '02-create-containers'],
      placeholders: ['ICONS_PAGE_ID'],
      saveResultAs: `06-icons-batch-${i + 1}`
    });
  });

  // 07: Build maps (Node.js script, not use_figma)
  const buildMapsFile = '07-build-maps.js';
  fs.writeFileSync(path.join(outputDir, buildMapsFile), generateBuildMapsScript(pipelineDir, cssFigmaMap));
  manifest.push({
    file: buildMapsFile,
    step: 'build-maps',
    description: 'Assemble output maps from results (run with Node.js, NOT use_figma)',
    isNodeScript: true,
    requires: ['all use_figma calls']
  });

  // Write manifest
  fs.writeFileSync(
    path.join(outputDir, 'manifest.json'),
    JSON.stringify({ generatedAt: new Date().toISOString(), calls: manifest }, null, 2)
  );

  console.log(`\nGenerated ${manifest.length} files in ${outputDir}/`);
  console.log('Manifest written to manifest.json');
  console.log('\nExecution order:');
  manifest.forEach((m, i) => {
    const mode = m.isNodeScript ? '[Node.js]' : '[use_figma]';
    const placeholders = m.placeholders ? ` (replace: ${m.placeholders.join(', ')})` : '';
    console.log(`  ${i + 1}. ${m.file} ${mode} — ${m.description}${placeholders}`);
  });
}

main();
