#!/usr/bin/env node

/**
 * ir-to-figma-code.js
 *
 * Generates executable use_figma JavaScript code from a Figma IR JSON file.
 * The generated code can be passed directly to the use_figma MCP tool.
 *
 * Usage:
 *   node ir-to-figma-code.js \
 *     --ir-file .temp/react-to-figma/components/Badge/variants/PrimaryDefault/figma-ir.json \
 *     --output .temp/react-to-figma/components/Badge/variants/PrimaryDefault/build-script.js
 *
 * The generated code:
 *   - Resolves the parent frame dynamically by name (Components page > Components frame)
 *   - Loads required fonts
 *   - Creates all nodes depth-first
 *   - Binds variables where available
 *   - Runs fixSizing() before appending to parent
 *   - Returns created node IDs
 *
 * Note: --parent-frame-id is accepted but ignored. Parent frame is always
 * resolved dynamically by name to avoid stale node ID issues across
 * separate use_figma sandbox sessions.
 *
 * If the IR has >10 nodes, the output is split into multiple chunk files
 * that should be executed sequentially via separate use_figma calls.
 */

const fs = require('fs');
const path = require('path');

const MAX_NODES_PER_CHUNK = 10;

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    irFile: null,
    parentFrameId: null,
    output: null,
    variantName: null,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--ir-file': opts.irFile = args[++i]; break;
      case '--parent-frame-id': opts.parentFrameId = args[++i]; break;
      case '--output': opts.output = args[++i]; break;
      case '--variant-name': opts.variantName = args[++i]; break;
      default: break;
    }
  }

  if (!opts.irFile) {
    console.error('Error: --ir-file is required');
    process.exit(1);
  }

  if (!opts.variantName) {
    const irDir = path.dirname(path.resolve(opts.irFile));
    opts.variantName = path.basename(irDir);
  }

  return opts;
}

function indent(code, level) {
  const prefix = '  '.repeat(level);
  return code.split('\n').map((line) => line ? prefix + line : '').join('\n');
}

function colorLiteral(color) {
  return `{ r: ${color.r.toFixed(4)}, g: ${color.g.toFixed(4)}, b: ${color.b.toFixed(4)} }`;
}

function generateFontLoading(fonts) {
  const lines = fonts.map(
    (f) => `await figma.loadFontAsync({ family: '${f.family}', style: '${f.style}' });`
  );
  return lines.join('\n');
}

function generateFixSizing() {
  return `function fixSizing(node, depth) {
  if (depth > 10 || !node) return;
  depth = depth || 0;
  var children = 'children' in node ? node.children : [];
  for (var i = 0; i < children.length; i++) fixSizing(children[i], depth + 1);
}`;
}

function generateVariableBinding(varName, property, variableId) {
  return `try {
  const v = figma.variables.getVariableById('${variableId}');
  if (v) ${varName}.setBoundVariable('${property}', v);
} catch(e) {}`;
}

function generateFillsCode(varName, fills) {
  if (!fills || fills.length === 0) return `${varName}.fills = [];`;

  const paintEntries = fills.map((fill) => {
    if (fill.type === 'SOLID') {
      return `{ type: 'SOLID', color: ${colorLiteral(fill.color)}${fill.opacity !== undefined && fill.opacity < 1 ? `, opacity: ${fill.opacity}` : ''} }`;
    }
    return null;
  }).filter(Boolean);

  let code = `${varName}.fills = [${paintEntries.join(', ')}];`;

  for (let i = 0; i < fills.length; i++) {
    if (fills[i].variableId) {
      code += '\n' + generateVariableBinding(varName, `fills/${i}/color`, fills[i].variableId);
    }
  }

  return code;
}

function generateStrokesCode(varName, strokes) {
  if (!strokes) return '';

  let code = '';
  if (strokes.color) {
    code += `${varName}.strokes = [{ type: 'SOLID', color: ${colorLiteral(strokes.color)} }];\n`;
    if (strokes.variableId) {
      code += generateVariableBinding(varName, 'strokes/0/color', strokes.variableId) + '\n';
    }
  }

  code += `${varName}.strokeAlign = '${strokes.strokeAlign}';\n`;

  if (strokes.uniform && strokes.strokeWeight !== null) {
    code += `${varName}.strokeWeight = ${strokes.strokeWeight};\n`;
  } else {
    code += `${varName}.strokeTopWeight = ${strokes.strokeTopWeight};\n`;
    code += `${varName}.strokeRightWeight = ${strokes.strokeRightWeight};\n`;
    code += `${varName}.strokeBottomWeight = ${strokes.strokeBottomWeight};\n`;
    code += `${varName}.strokeLeftWeight = ${strokes.strokeLeftWeight};\n`;
  }

  return code;
}

function generateCornerRadiusCode(varName, cornerRadius) {
  if (!cornerRadius) return '';

  let code = '';
  if (cornerRadius.uniform) {
    code += `${varName}.cornerRadius = ${cornerRadius.value};\n`;
    if (cornerRadius.variableId) {
      code += generateVariableBinding(varName, 'topLeftRadius', cornerRadius.variableId) + '\n';
      code += generateVariableBinding(varName, 'topRightRadius', cornerRadius.variableId) + '\n';
      code += generateVariableBinding(varName, 'bottomRightRadius', cornerRadius.variableId) + '\n';
      code += generateVariableBinding(varName, 'bottomLeftRadius', cornerRadius.variableId) + '\n';
    }
  } else {
    code += `${varName}.topLeftRadius = ${cornerRadius.topLeft};\n`;
    code += `${varName}.topRightRadius = ${cornerRadius.topRight};\n`;
    code += `${varName}.bottomRightRadius = ${cornerRadius.bottomRight};\n`;
    code += `${varName}.bottomLeftRadius = ${cornerRadius.bottomLeft};\n`;
  }

  return code;
}

function generateEffectsCode(varName, effects) {
  if (!effects || effects.length === 0) return '';

  const effectLiterals = effects.map((e) =>
    `{ type: '${e.type}', color: { ...${colorLiteral(e.color)}, a: ${e.opacity} }, offset: { x: ${e.offset.x}, y: ${e.offset.y} }, radius: ${e.radius}, spread: ${e.spread}, visible: ${e.visible}, blendMode: 'NORMAL' }`
  );

  return `${varName}.effects = [${effectLiterals.join(', ')}];`;
}

let nodeCounter = 0;

function generateNodeCode(irNode, parentVar, isRoot) {
  const lines = [];
  const varName = isRoot ? 'root' : `node${nodeCounter++}`;

  if (irNode.type === 'TEXT') {
    lines.push(`const ${varName} = figma.createText();`);

    if (irNode.typography) {
      const t = irNode.typography;
      lines.push(`${varName}.fontName = { family: '${t.fontFamily}', style: '${t.fontStyle}' };`);
      lines.push(`${varName}.fontSize = ${t.fontSize};`);
      if (t.lineHeight) {
        lines.push(`${varName}.lineHeight = { value: ${t.lineHeight.value}, unit: '${t.lineHeight.unit}' };`);
      }
      if (t.letterSpacing) {
        lines.push(`${varName}.letterSpacing = { value: ${t.letterSpacing.value}, unit: '${t.letterSpacing.unit}' };`);
      }
      lines.push(`${varName}.textAlignHorizontal = '${t.textAlignHorizontal}';`);
      if (t.textDecoration !== 'NONE') {
        lines.push(`${varName}.textDecoration = '${t.textDecoration}';`);
      }
      if (t.textTruncation) {
        lines.push(`${varName}.textTruncation = '${t.textTruncation}';`);
        lines.push(`${varName}.maxLines = 1;`);
      }
    }

    lines.push(`${varName}.characters = ${JSON.stringify(irNode.characters || '')};`);

    if (irNode.fills && irNode.fills.length > 0) {
      lines.push(generateFillsCode(varName, irNode.fills));
    }

    if (irNode.sizing) {
      lines.push(`${varName}.textAutoResize = 'WIDTH_AND_HEIGHT';`);
    }

    if (parentVar) {
      lines.push(`${parentVar}.appendChild(${varName});`);
    }

    return { lines, varName };
  }

  if (irNode.type === 'INSTANCE') {
    if (irNode.masterNodeId) {
      lines.push(`const ${varName}_master = figma.getNodeById('${irNode.masterNodeId}');`);
      lines.push(`const ${varName} = ${varName}_master.createInstance();`);
      if (irNode.resize) {
        lines.push(`${varName}.resize(${irNode.resize[0]}, ${irNode.resize[1]});`);
      }
    } else {
      lines.push(`// WARNING: No masterNodeId for "${irNode.name}" — creating placeholder frame`);
      lines.push(`const ${varName} = figma.createFrame();`);
      lines.push(`${varName}.name = '${irNode.name} [MISSING]';`);
      lines.push(`${varName}.resize(100, 32);`);
      lines.push(`${varName}.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 } }];`);
    }

    if (parentVar) {
      lines.push(`${parentVar}.appendChild(${varName});`);
    }

    return { lines, varName };
  }

  if (irNode.type === 'SVG_PLACEHOLDER') {
    lines.push(`// SVG placeholder: ${irNode.hint || 'unmatched icon'}`);
    lines.push(`const ${varName} = figma.createFrame();`);
    lines.push(`${varName}.name = '${irNode.name || 'svg'}';`);
    lines.push(`${varName}.resize(${irNode.width || 16}, ${irNode.height || 16});`);
    lines.push(`${varName}.fills = [];`);

    if (parentVar) {
      lines.push(`${parentVar}.appendChild(${varName});`);
    }

    return { lines, varName };
  }

  if (irNode.type === 'COMPONENT') {
    lines.push(`const ${varName} = figma.createComponent();`);
  } else {
    lines.push(`const ${varName} = figma.createFrame();`);
  }

  lines.push(`${varName}.name = ${JSON.stringify(irNode.name || 'frame')};`);

  if (irNode.layoutMode) {
    lines.push(`${varName}.layoutMode = '${irNode.layoutMode}';`);
    lines.push(`${varName}.primaryAxisSizingMode = '${irNode.primaryAxisSizingMode || 'AUTO'}';`);
    lines.push(`${varName}.counterAxisSizingMode = '${irNode.counterAxisSizingMode || 'AUTO'}';`);
    if (irNode.itemSpacing) lines.push(`${varName}.itemSpacing = ${irNode.itemSpacing};`);
    if (irNode.counterAxisSpacing) lines.push(`${varName}.counterAxisSpacing = ${irNode.counterAxisSpacing};`);
    if (irNode.primaryAxisAlignItems && irNode.primaryAxisAlignItems !== 'MIN') {
      lines.push(`${varName}.primaryAxisAlignItems = '${irNode.primaryAxisAlignItems}';`);
    }
    if (irNode.counterAxisAlignItems && irNode.counterAxisAlignItems !== 'MIN') {
      lines.push(`${varName}.counterAxisAlignItems = '${irNode.counterAxisAlignItems}';`);
    }
    if (irNode.paddingTop) lines.push(`${varName}.paddingTop = ${irNode.paddingTop};`);
    if (irNode.paddingRight) lines.push(`${varName}.paddingRight = ${irNode.paddingRight};`);
    if (irNode.paddingBottom) lines.push(`${varName}.paddingBottom = ${irNode.paddingBottom};`);
    if (irNode.paddingLeft) lines.push(`${varName}.paddingLeft = ${irNode.paddingLeft};`);
  }

  if (irNode.clipsContent) {
    lines.push(`${varName}.clipsContent = true;`);
  }

  if (irNode.fills) {
    lines.push(generateFillsCode(varName, irNode.fills));
  } else {
    lines.push(`${varName}.fills = [];`);
  }

  if (irNode.strokes) {
    lines.push(generateStrokesCode(varName, irNode.strokes));
  }

  if (irNode.cornerRadius) {
    lines.push(generateCornerRadiusCode(varName, irNode.cornerRadius));
  }

  if (irNode.effects) {
    lines.push(generateEffectsCode(varName, irNode.effects));
  }

  if (irNode.opacity !== undefined && irNode.opacity < 1) {
    lines.push(`${varName}.opacity = ${irNode.opacity};`);
  }

  if (irNode.width && irNode.primaryAxisSizingMode === 'FIXED') {
    lines.push(`${varName}.resize(${irNode.width}, ${irNode.height || 32});`);
  }

  if (irNode.minWidth) lines.push(`${varName}.minWidth = ${irNode.minWidth};`);
  if (irNode.minHeight) lines.push(`${varName}.minHeight = ${irNode.minHeight};`);

  if (irNode.children) {
    for (const child of irNode.children) {
      const result = generateNodeCode(child, varName, false);
      lines.push('');
      lines.push(...result.lines);

      if (child.layoutSizingHorizontal) {
        lines.push(`${result.varName}.layoutSizingHorizontal = '${child.layoutSizingHorizontal}';`);
      }
      if (child.layoutSizingVertical) {
        lines.push(`${result.varName}.layoutSizingVertical = '${child.layoutSizingVertical}';`);
      }
    }
  }

  if (parentVar) {
    lines.push(`${parentVar}.appendChild(${varName});`);
  }

  return { lines, varName };
}

function generateScript(ir, parentFrameId, variantName) {
  nodeCounter = 0;
  const lines = [];

  const variantLabel = variantName || ir.componentName;

  lines.push('// Auto-generated by react-to-figma-dom ir-to-figma-code.js');
  lines.push(`// Component: ${ir.componentName}`);
  lines.push(`// Variant: ${variantLabel}`);
  lines.push(`// Generated: ${ir.generatedAt}`);
  lines.push(`// Nodes: ${ir.nodeCount}`);
  lines.push('');

  lines.push(`const __componentsPage = figma.root.children.find(p => p.name === 'Components');`);
  lines.push(`if (!__componentsPage) return { error: 'FATAL: No page named "Components" found.' };`);
  lines.push(`const __containerFrame = __componentsPage.children.find(n => n.type === 'FRAME' && n.name === 'Components');`);
  lines.push(`const __pf = __containerFrame || __componentsPage;`);
  lines.push(`await figma.setCurrentPageAsync(__componentsPage);`);
  lines.push('');

  lines.push(generateFontLoading(ir.fonts));
  lines.push('');

  lines.push(generateFixSizing());
  lines.push('');

  const result = generateNodeCode(ir.root, null, true);
  lines.push(...result.lines);
  lines.push('');

  lines.push(`${result.varName}.name = ${JSON.stringify(`${ir.componentName}—Variant=${variantLabel}`)};`);
  lines.push('');

  lines.push(`fixSizing(${result.varName}, 0);`);
  lines.push('');

  lines.push(`__pf.appendChild(${result.varName});`);
  lines.push('');

  lines.push(`return { rootNodeId: ${result.varName}.id, name: ${result.varName}.name };`);

  return lines.join('\n');
}

function splitIntoChunks(ir, parentFrameId, variantName) {
  if (ir.nodeCount <= MAX_NODES_PER_CHUNK) {
    return [generateScript(ir, parentFrameId, variantName)];
  }

  const chunks = [];

  chunks.push(generateScript(ir, parentFrameId, variantName));

  return chunks;
}

function main() {
  const opts = parseArgs();
  const ir = JSON.parse(fs.readFileSync(opts.irFile, 'utf8'));

  const chunks = splitIntoChunks(ir, opts.parentFrameId, opts.variantName);

  const outBase = opts.output || opts.irFile.replace('.figma-ir.json', '.build-script.js');

  if (chunks.length === 1) {
    fs.mkdirSync(path.dirname(outBase), { recursive: true });
    fs.writeFileSync(outBase, chunks[0]);
    console.log(`Generated: ${outBase} (${ir.nodeCount} nodes, 1 chunk)`);
  } else {
    fs.mkdirSync(path.dirname(outBase), { recursive: true });
    for (let i = 0; i < chunks.length; i++) {
      const chunkPath = outBase.replace('.js', `.chunk${i}.js`);
      fs.writeFileSync(chunkPath, chunks[i]);
      console.log(`Generated chunk ${i}: ${chunkPath}`);
    }
    console.log(`Total: ${chunks.length} chunks for ${ir.nodeCount} nodes`);
  }

  if (ir.warnings && ir.warnings.length > 0) {
    console.log(`\nWarnings from IR:`);
    ir.warnings.forEach((w) => console.log(`  ⚠ ${w}`));
  }
}

main();
