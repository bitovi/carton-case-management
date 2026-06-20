#!/usr/bin/env node

/**
 * generate-build-and-clone-scripts.js
 *
 * Unified IR generation + clone-batch generation for the react-to-figma-dom pipeline.
 * Replaces the old approach of generating individual build-scripts for every variant.
 *
 * Strategy:
 *   1. Generate figma-ir.json for ALL variants (from DOM captures)
 *   2. Compute structural fingerprint per IR (node types + child counts)
 *   3. Group variants by fingerprint → structural groups
 *   4. For each group: pick a base, generate build-script for base only
 *   5. For remaining variants: compute IR diff → render clone+patch code
 *   6. Greedy-pack clone code into batch files under 45KB
 *   7. Write build-manifest.json
 *
 * Usage:
 *   node generate-build-and-clone-scripts.js \
 *     --component-dir .temp/react-to-figma-dom/components/Input \
 *     --figma-variants .temp/react-to-figma-dom/components/Input/figma-variants.json \
 *     --pipeline-dir .temp/react-to-figma-dom
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BUDGET = 45000;
const HEADER_SIZE = 500;

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { componentDir: null, figmaVariants: null, pipelineDir: null };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--component-dir': opts.componentDir = args[++i]; break;
      case '--figma-variants': opts.figmaVariants = args[++i]; break;
      case '--pipeline-dir': opts.pipelineDir = args[++i]; break;
    }
  }
  if (!opts.componentDir) { console.error('Error: --component-dir required'); process.exit(1); }
  if (!opts.figmaVariants) { console.error('Error: --figma-variants required'); process.exit(1); }
  if (!opts.pipelineDir) { console.error('Error: --pipeline-dir required'); process.exit(1); }
  return opts;
}

function computeFingerprint(node) {
  if (!node) return '';
  const childPrints = (node.children || []).map(c => computeFingerprint(c)).join(',');
  return `${node.type}(${childPrints})`;
}

function generateIRForVariant(variantDir, opts) {
  const domFile = path.join(variantDir, 'dom.json');
  const fiberMap = path.join(variantDir, 'fiber-dom-map.json');
  const irOutput = path.join(variantDir, 'figma-ir.json');

  if (!fs.existsSync(domFile)) return null;

  const scriptsDir = path.dirname(__filename);
  const domToIr = path.join(scriptsDir, 'dom-to-figma-ir.js');
  const variablesMap = path.join(opts.pipelineDir, 'figma-variables-map.json');
  const designTokens = path.join(opts.pipelineDir, 'design-tokens.json');
  const iconsMap = path.join(opts.pipelineDir, 'figma-icons-map.json');
  const builtComponents = path.join(opts.pipelineDir, 'built-components.json');
  const componentName = path.basename(opts.componentDir);

  const cmdParts = [
    'node', JSON.stringify(domToIr),
    '--dom-file', JSON.stringify(domFile),
    '--component-name', JSON.stringify(componentName),
    '--output', JSON.stringify(irOutput),
  ];
  if (fs.existsSync(fiberMap)) cmdParts.push('--fiber-map', JSON.stringify(fiberMap));
  if (fs.existsSync(variablesMap)) cmdParts.push('--variables-map', JSON.stringify(variablesMap));
  if (fs.existsSync(designTokens)) cmdParts.push('--design-tokens', JSON.stringify(designTokens));
  if (fs.existsSync(iconsMap)) cmdParts.push('--icons-map', JSON.stringify(iconsMap));
  if (fs.existsSync(builtComponents)) cmdParts.push('--built-components', JSON.stringify(builtComponents));

  try {
    execSync(cmdParts.join(' '), { stdio: 'pipe', cwd: process.cwd() });
  } catch (e) {
    console.error(`  Failed to generate IR for ${path.basename(variantDir)}: ${e.message}`);
    return null;
  }

  if (!fs.existsSync(irOutput)) return null;
  return JSON.parse(fs.readFileSync(irOutput, 'utf8'));
}

function generateBuildScript(variantDir, irFile, opts, figmaName) {
  const scriptsDir = path.dirname(__filename);
  const irToCode = path.join(scriptsDir, 'ir-to-figma-code.js');
  const output = path.join(variantDir, 'build-script.js');
  const variantName = figmaName || path.basename(variantDir);

  const cmd = [
    'node', JSON.stringify(irToCode),
    '--ir-file', JSON.stringify(irFile),
    '--output', JSON.stringify(output),
    '--variant-name', JSON.stringify(variantName),
    '--variant-props', JSON.stringify(variantName),
  ].join(' ');

  try {
    execSync(cmd, { stdio: 'pipe', cwd: process.cwd() });
  } catch (e) {
    console.error(`  Failed to generate build-script for ${variantName}: ${e.message}`);
    return null;
  }
  return output;
}

function colorLiteral(color) {
  return `{ r: ${color.r.toFixed(4)}, g: ${color.g.toFixed(4)}, b: ${color.b.toFixed(4)} }`;
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return a == b;
  if (typeof a !== typeof b) return false;
  if (typeof a !== 'object') return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const k of keysA) {
    if (!deepEqual(a[k], b[k])) return false;
  }
  return true;
}

function computeDeltas(baseNode, targetNode, nodePath) {
  const deltas = [];
  if (!baseNode || !targetNode) return deltas;

  if (targetNode.type === 'TEXT') {
    if (targetNode.characters !== baseNode.characters) {
      deltas.push({ path: nodePath, prop: 'characters', value: targetNode.characters });
    }
    if (targetNode.typography && baseNode.typography) {
      const bt = baseNode.typography;
      const tt = targetNode.typography;
      if (tt.fontSize !== bt.fontSize) {
        deltas.push({ path: nodePath, prop: 'fontSize', value: tt.fontSize });
      }
      if (!deepEqual(tt.lineHeight, bt.lineHeight)) {
        deltas.push({ path: nodePath, prop: 'lineHeight', value: tt.lineHeight });
      }
      if (tt.fontFamily !== bt.fontFamily || tt.fontStyle !== bt.fontStyle) {
        deltas.push({ path: nodePath, prop: 'fontName', value: { family: tt.fontFamily, style: tt.fontStyle } });
      }
    }
    if (!deepEqual(targetNode.fills, baseNode.fills)) {
      deltas.push({ path: nodePath, prop: 'fills', value: targetNode.fills });
    }
    return deltas;
  }

  if (!deepEqual(targetNode.fills, baseNode.fills)) {
    deltas.push({ path: nodePath, prop: 'fills', value: targetNode.fills });
  }
  if (!deepEqual(targetNode.strokes, baseNode.strokes)) {
    deltas.push({ path: nodePath, prop: 'strokes', value: targetNode.strokes });
  }
  if (!deepEqual(targetNode.cornerRadius, baseNode.cornerRadius)) {
    deltas.push({ path: nodePath, prop: 'cornerRadius', value: targetNode.cornerRadius });
  }
  if (!deepEqual(targetNode.effects, baseNode.effects)) {
    deltas.push({ path: nodePath, prop: 'effects', value: targetNode.effects || [] });
  }
  if (targetNode.opacity !== baseNode.opacity) {
    deltas.push({ path: nodePath, prop: 'opacity', value: targetNode.opacity });
  }

  const bw = baseNode.width, bh = baseNode.height;
  const tw = targetNode.width, th = targetNode.height;
  if ((tw && bw && tw !== bw) || (th && bh && th !== bh)) {
    deltas.push({ path: nodePath, prop: 'resize', value: [tw || bw, th || bh] });
  }

  if (targetNode.paddingTop !== baseNode.paddingTop) {
    deltas.push({ path: nodePath, prop: 'paddingTop', value: targetNode.paddingTop });
  }
  if (targetNode.paddingRight !== baseNode.paddingRight) {
    deltas.push({ path: nodePath, prop: 'paddingRight', value: targetNode.paddingRight });
  }
  if (targetNode.paddingBottom !== baseNode.paddingBottom) {
    deltas.push({ path: nodePath, prop: 'paddingBottom', value: targetNode.paddingBottom });
  }
  if (targetNode.paddingLeft !== baseNode.paddingLeft) {
    deltas.push({ path: nodePath, prop: 'paddingLeft', value: targetNode.paddingLeft });
  }

  if (targetNode.itemSpacing !== baseNode.itemSpacing) {
    deltas.push({ path: nodePath, prop: 'itemSpacing', value: targetNode.itemSpacing });
  }

  const baseChildren = baseNode.children || [];
  const targetChildren = targetNode.children || [];
  for (let i = 0; i < Math.min(baseChildren.length, targetChildren.length); i++) {
    const childPath = `${nodePath}.children[${i}]`;
    deltas.push(...computeDeltas(baseChildren[i], targetChildren[i], childPath));
  }

  return deltas;
}

function renderFillsCode(varName, fills) {
  if (!fills || fills.length === 0) return `${varName}.fills = [];`;
  const parts = fills.map(f => {
    if (f.type === 'SOLID') {
      const opacity = (f.opacity !== undefined && f.opacity < 1) ? `, opacity: ${f.opacity}` : '';
      return `{ type: 'SOLID', color: ${colorLiteral(f.color)}${opacity} }`;
    }
    return null;
  }).filter(Boolean);
  let code = `${varName}.fills = [${parts.join(', ')}];`;
  for (let i = 0; i < fills.length; i++) {
    if (fills[i].variableId) {
      code += `\n  try { const v = figma.variables.getVariableById('${fills[i].variableId}'); if (v) ${varName}.setBoundVariable('fills/${i}/color', v); } catch(e) {}`;
    }
  }
  return code;
}

function renderStrokesCode(varName, strokes) {
  if (!strokes || !strokes.color) return '';
  let code = `${varName}.strokes = [{ type: 'SOLID', color: ${colorLiteral(strokes.color)} }];`;
  if (strokes.variableId) {
    code += `\n  try { const v = figma.variables.getVariableById('${strokes.variableId}'); if (v) ${varName}.setBoundVariable('strokes/0/color', v); } catch(e) {}`;
  }
  if (strokes.strokeWeight !== undefined) {
    code += `\n  ${varName}.strokeWeight = ${strokes.strokeWeight};`;
  }
  return code;
}

function renderCornerRadiusCode(varName, cr) {
  if (!cr) return '';
  if (cr.uniform) {
    let code = `${varName}.cornerRadius = ${cr.value};`;
    if (cr.variableId) {
      code += `\n  try { const v = figma.variables.getVariableById('${cr.variableId}'); if (v) { ${varName}.setBoundVariable('topLeftRadius', v); ${varName}.setBoundVariable('topRightRadius', v); ${varName}.setBoundVariable('bottomRightRadius', v); ${varName}.setBoundVariable('bottomLeftRadius', v); } } catch(e) {}`;
    }
    return code;
  }
  return `${varName}.topLeftRadius = ${cr.topLeft}; ${varName}.topRightRadius = ${cr.topRight}; ${varName}.bottomRightRadius = ${cr.bottomRight}; ${varName}.bottomLeftRadius = ${cr.bottomLeft};`;
}

function renderEffectsCode(varName, effects) {
  if (!effects || effects.length === 0) return `${varName}.effects = [];`;
  const literals = effects.map(e =>
    `{ type: '${e.type}', color: { ...${colorLiteral(e.color)}, a: ${e.opacity} }, offset: { x: ${e.offset.x}, y: ${e.offset.y} }, radius: ${e.radius}, spread: ${e.spread}, visible: ${e.visible}, blendMode: 'NORMAL' }`
  );
  return `${varName}.effects = [${literals.join(', ')}];`;
}

function renderPatchCode(varName, prop, value) {
  switch (prop) {
    case 'fills':
      return renderFillsCode(varName, value);
    case 'strokes':
      return renderStrokesCode(varName, value);
    case 'cornerRadius':
      return renderCornerRadiusCode(varName, value);
    case 'effects':
      return renderEffectsCode(varName, value);
    case 'resize':
      return `${varName}.resize(${value[0]}, ${value[1]});`;
    case 'opacity':
      return `${varName}.opacity = ${value};`;
    case 'characters':
      return `${varName}.characters = ${JSON.stringify(value)};`;
    case 'fontSize':
      return `${varName}.fontSize = ${value};`;
    case 'lineHeight':
      return value ? `${varName}.lineHeight = { value: ${value.value}, unit: '${value.unit}' };` : '';
    case 'fontName':
      return `${varName}.fontName = { family: '${value.family}', style: '${value.style}' };`;
    case 'paddingTop':
    case 'paddingRight':
    case 'paddingBottom':
    case 'paddingLeft':
    case 'itemSpacing':
      return `${varName}.${prop} = ${value};`;
    default:
      return `${varName}.${prop} = ${JSON.stringify(value)};`;
  }
}

function renderCloneBlock(variantName, deltas) {
  const lines = [];
  lines.push(`{`);
  lines.push(`  const clone = __base.clone();`);
  lines.push(`  clone.name = ${JSON.stringify(variantName)};`);
  lines.push(`  __set.appendChild(clone);`);

  const nodeVarCache = new Map();
  nodeVarCache.set('clone', true);

  for (const delta of deltas) {
    const pathParts = delta.path.split('.');
    let currentPath = pathParts[0];
    let varName = currentPath;

    for (let i = 1; i < pathParts.length; i++) {
      const segment = pathParts[i];
      const fullPath = `${currentPath}.${segment}`;
      if (!nodeVarCache.has(fullPath)) {
        const safeVar = fullPath.replace(/[.\[\]]/g, '_');
        lines.push(`  const ${safeVar} = ${varName}.${segment};`);
        nodeVarCache.set(fullPath, safeVar);
      }
      varName = nodeVarCache.get(fullPath);
      currentPath = fullPath;
    }

    const code = renderPatchCode(varName, delta.prop, delta.value);
    if (code) {
      code.split('\n').forEach(line => lines.push(`  ${line}`));
    }
  }

  lines.push(`}`);
  return lines.join('\n');
}

function renderBatchFile(componentName, baseName, cloneBlocks, fonts) {
  const lines = [];
  lines.push(`// Auto-generated clone-batch by generate-build-and-clone-scripts.js`);
  lines.push(`// Component: ${componentName}`);
  lines.push(`// Clones: ${cloneBlocks.length} variants from base "${baseName}"`);
  lines.push(`// Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push(`let __componentsPage = figma.root.children.find(p => p.name === 'Components');`);
  lines.push(`await figma.setCurrentPageAsync(__componentsPage);`);
  lines.push(`let __containerFrame = __componentsPage.children.find(n => n.type === 'FRAME' && n.name === 'Components');`);
  lines.push(`const __set = __containerFrame.findOne(n => n.type === 'COMPONENT_SET' && n.name === ${JSON.stringify(componentName)});`);
  lines.push(`if (!__set) return { error: 'ComponentSet ${componentName} not found' };`);
  lines.push(`const __base = __set.children.find(c => c.name === ${JSON.stringify(baseName)});`);
  lines.push(`if (!__base) return { error: 'Base variant ${baseName} not found in set' };`);
  lines.push('');

  if (fonts && fonts.length > 0) {
    for (const f of fonts) {
      lines.push(`await figma.loadFontAsync({ family: '${f.family}', style: '${f.style}' });`);
    }
    lines.push('');
  }

  lines.push(`const __created = [];`);
  lines.push('');

  for (const block of cloneBlocks) {
    lines.push(block);
    lines.push('');
  }

  lines.push(`return { cloned: ${cloneBlocks.length}, setChildren: __set.children.length, setId: __set.id };`);
  return lines.join('\n');
}

function buildFolderToFigmaNameMap(figmaVariants) {
  const map = new Map();
  const folderMap = figmaVariants.variantFolderMap || {};
  const axes = figmaVariants.variantAxes || [];
  const axisDefaults = axes.map(a => ({ axis: a.axis, default: a.default || a.values[0] }));

  for (const [figmaKey, folderPath] of Object.entries(folderMap)) {
    const folder = folderPath.replace(/^variants\//, '');
    const specifiedProps = new Map();
    for (const pair of figmaKey.split(',')) {
      const [prop, val] = pair.split('=');
      specifiedProps.set(prop, val);
    }
    const fullParts = axisDefaults.map(({ axis, default: def }) => {
      const val = specifiedProps.get(axis) || def;
      return `${axis}=${val}`;
    });
    const figmaName = fullParts.join(', ');
    map.set(folder, figmaName);
  }
  return map;
}

function main() {
  const opts = parseArgs();
  const componentDir = path.resolve(opts.componentDir);
  const figmaVariants = JSON.parse(fs.readFileSync(opts.figmaVariants, 'utf8'));
  const componentName = figmaVariants.componentName || path.basename(componentDir);
  const variantsDir = path.join(componentDir, 'variants');
  const folderToFigmaName = buildFolderToFigmaNameMap(figmaVariants);

  // Build the set of allowed folders:
  // 1. Folders listed as values in variantFolderMap (these are VARIANT-type combos)
  const mappedFolders = new Set(
    Object.values(figmaVariants.variantFolderMap || {}).map(v => v.replace(/^variants\//, ''))
  );
  // 2. Folders listed as referenceCapture in componentProperties (BOOLEAN/independent demos)
  //    These are NOT built as ComponentSet members — they only inform the injection script.
  //    Building them produces variants without proper Property=Value names.
  const refCaptureFolders = new Set();
  for (const prop of (figmaVariants.componentProperties || [])) {
    if (prop.referenceCapture) {
      refCaptureFolders.add(prop.referenceCapture);
    }
  }
  // Only mapped folders are built; referenceCapture folders are excluded
  const allowedFolders = mappedFolders;

  console.log(`\n=== generate-build-and-clone-scripts: ${componentName} ===\n`);

  const allVariantFolders = fs.readdirSync(variantsDir).filter(f => {
    const fullPath = path.join(variantsDir, f);
    return fs.statSync(fullPath).isDirectory()
      && fs.existsSync(path.join(fullPath, 'dom.json'))
      && allowedFolders.has(f);
  });

  const skippedFolders = fs.readdirSync(variantsDir).filter(f => {
    const fullPath = path.join(variantsDir, f);
    return fs.statSync(fullPath).isDirectory()
      && fs.existsSync(path.join(fullPath, 'dom.json'))
      && !allowedFolders.has(f);
  });
  if (skippedFolders.length > 0) {
    console.log(`Skipped ${skippedFolders.length} unmapped folder(s): ${skippedFolders.join(', ')}`);
  }

  console.log(`Found ${allVariantFolders.length} variant folders with DOM captures`);

  console.log(`\nStep 1: Generating IR for all variants...`);
  const variantIRs = new Map();
  for (const folder of allVariantFolders) {
    const variantDir = path.join(variantsDir, folder);
    const irPath = path.join(variantDir, 'figma-ir.json');

    let ir;
    if (fs.existsSync(irPath)) {
      ir = JSON.parse(fs.readFileSync(irPath, 'utf8'));
    } else {
      ir = generateIRForVariant(variantDir, opts);
    }

    if (ir) {
      variantIRs.set(folder, ir);
      process.stdout.write('.');
    } else {
      process.stdout.write('x');
    }
  }
  console.log(`\n  Generated/loaded ${variantIRs.size} IRs`);

  console.log(`\nStep 2: Computing structural fingerprints...`);
  const fingerprintGroups = new Map();
  for (const [folder, ir] of variantIRs) {
    const fp = computeFingerprint(ir.root);
    if (!fingerprintGroups.has(fp)) fingerprintGroups.set(fp, []);
    fingerprintGroups.get(fp).push(folder);
  }
  console.log(`  Found ${fingerprintGroups.size} structural group(s):`);
  let groupIdx = 0;
  for (const [fp, folders] of fingerprintGroups) {
    console.log(`    Group ${groupIdx}: ${folders.length} variants (fingerprint: ${fp.substring(0, 60)}...)`);
    groupIdx++;
  }

  console.log(`\nStep 3: Selecting bases and generating build-scripts...`);
  const manifest = { componentName, groups: [] };
  groupIdx = 0;

  for (const [fp, folders] of fingerprintGroups) {
    const isDependent = folders.length > 3;
    const label = isDependent ? 'dependent' : 'independent';

    const baseFolder = folders.find(f => f.includes('Regular') && f.includes('Default') && f.includes('False'))
      || folders.find(f => f.includes('Default'))
      || folders[0];

    console.log(`  Group ${groupIdx} (${label}): base = "${baseFolder}"`);

    const baseDir = path.join(variantsDir, baseFolder);
    const baseIrPath = path.join(baseDir, 'figma-ir.json');
    const baseIR = variantIRs.get(baseFolder);
    const baseFigmaName = folderToFigmaName.get(baseFolder) || baseFolder;
    const buildScriptPath = generateBuildScript(baseDir, baseIrPath, opts, baseFigmaName);
    if (!buildScriptPath) {
      console.error(`    ERROR: Could not generate build-script for base`);
      groupIdx++;
      continue;
    }

    const otherFolders = folders.filter(f => f !== baseFolder);

    console.log(`\nStep 4: Computing deltas for ${otherFolders.length} clones in group ${groupIdx}...`);
    const cloneData = [];
    for (const folder of otherFolders) {
      const targetIR = variantIRs.get(folder);
      const deltas = computeDeltas(baseIR.root, targetIR.root, 'clone');
      const figmaName = folderToFigmaName.get(folder) || folder;
      cloneData.push({ name: figmaName, deltas });
    }

    console.log(`\nStep 5: Rendering clone blocks and packing into batches...`);
    const fonts = baseIR.fonts || [];
    const cloneBlocks = cloneData.map(cd => renderCloneBlock(cd.name, cd.deltas));

    const batches = [];
    let currentBatch = [];
    let currentSize = HEADER_SIZE;

    for (let i = 0; i < cloneBlocks.length; i++) {
      const blockSize = cloneBlocks[i].length;
      if (currentSize + blockSize > BUDGET && currentBatch.length > 0) {
        batches.push(currentBatch);
        currentBatch = [];
        currentSize = HEADER_SIZE;
      }
      currentBatch.push(cloneBlocks[i]);
      currentSize += blockSize;
    }
    if (currentBatch.length > 0) batches.push(currentBatch);

    const batchFiles = [];
    for (let ci = 0; ci < batches.length; ci++) {
      const fileName = `clone-batch-${groupIdx}-${ci}.js`;
      const filePath = path.join(componentDir, fileName);
      const content = renderBatchFile(componentName, baseFigmaName, batches[ci], fonts);
      fs.writeFileSync(filePath, content);
      batchFiles.push(fileName);
      console.log(`    Wrote ${fileName} (${batches[ci].length} clones, ${content.length} bytes)`);
    }

    manifest.groups.push({
      groupIndex: groupIdx,
      label,
      base: baseFigmaName,
      baseFolder: baseFolder,
      baseScript: path.relative(componentDir, buildScriptPath),
      cloneBatches: batchFiles,
      variantCount: folders.length,
    });

    groupIdx++;
  }

  const manifestPath = path.join(componentDir, 'build-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n  Wrote build-manifest.json`);

  console.log(`\n=== Summary ===`);
  console.log(`  Component: ${componentName}`);
  console.log(`  Total variants: ${variantIRs.size}`);
  console.log(`  Structural groups: ${manifest.groups.length}`);
  for (const g of manifest.groups) {
    console.log(`    Group ${g.groupIndex} (${g.label}): 1 base build + ${g.cloneBatches.length} batch file(s) = ${g.variantCount} variants`);
  }
  const totalCalls = manifest.groups.reduce((sum, g) => sum + 1 + g.cloneBatches.length, 0);
  console.log(`  Estimated use_figma calls: ${totalCalls} (was ${variantIRs.size})`);
  console.log('');
}

main();
