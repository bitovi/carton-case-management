#!/usr/bin/env node

/**
 * ir-to-figma-code.js
 *
 * Generates executable use_figma JavaScript code from a Figma IR JSON file.
 * The generated code can be passed directly to the use_figma MCP tool.
 *
 * Usage:
 *   node ir-to-figma-code.js \
 *     --ir-file .temp/react-to-figma-dom/components/Badge/variants/PrimaryDefault/figma-ir.json \
 *     --output .temp/react-to-figma-dom/components/Badge/variants/PrimaryDefault/build-script.js
 *
 * The generated code:
 *   - Resolves the parent frame dynamically by name (Components page > Components frame)
 *   - Loads required fonts
 *   - Creates all nodes depth-first
 *   - Binds variables where available
 *   - Returns created node IDs
 *
 * Note: --parent-frame-id is accepted but ignored. Parent frame is always
 * resolved dynamically by name to avoid stale node ID issues across
 * separate use_figma sandbox sessions.
 */

const fs = require('fs');
const path = require('path');

const FIGMA_NODE_ID_RE = /^\d+:\d+$/;

function isValidFigmaNodeId(id) {
  return typeof id === 'string' && FIGMA_NODE_ID_RE.test(id);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    irFile: null,
    parentFrameId: null,
    output: null,
    variantName: null,
    variantProps: null,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--ir-file': opts.irFile = args[++i]; break;
      case '--parent-frame-id': opts.parentFrameId = args[++i]; break;
      case '--output': opts.output = args[++i]; break;
      case '--variant-name': opts.variantName = args[++i]; break;
      case '--variant-props': opts.variantProps = args[++i]; break;
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
    if (irNode.masterNodeId && isValidFigmaNodeId(irNode.masterNodeId)) {
      lines.push(`const ${varName}_rawMaster = figma.getNodeById('${irNode.masterNodeId}');`);
      lines.push(`if (!${varName}_rawMaster) return { error: 'Node ${irNode.masterNodeId} not found for ${(irNode.name || 'unknown').replace(/'/g, '')}' };`);
      lines.push(`const ${varName}_master = ${varName}_rawMaster.type === 'COMPONENT_SET' ? ${varName}_rawMaster.children[0] : ${varName}_rawMaster;`);
      lines.push(`const ${varName} = ${varName}_master.createInstance();`);
      if (irNode.resize) {
        lines.push(`${varName}.resize(${irNode.resize[0]}, ${irNode.resize[1]});`);
      }
      if (irNode.iconColor) {
        const c = irNode.iconColor;
        const colorVal = colorLiteral(c.color);
        lines.push(`(function recolor(n) {`);
        lines.push(`  if ('strokes' in n && n.strokes && n.strokes.length > 0) n.strokes = [{ type: 'SOLID', color: ${colorVal} }];`);
        lines.push(`  if ('fills' in n && n.fills && n.fills.length > 0 && (n.type === 'VECTOR' || n.type === 'LINE' || n.type === 'STAR' || n.type === 'ELLIPSE' || n.type === 'POLYGON' || n.type === 'BOOLEAN_OPERATION')) n.fills = [{ type: 'SOLID', color: ${colorVal} }];`);
        lines.push(`  if ('children' in n) { for (var i = 0; i < n.children.length; i++) recolor(n.children[i]); }`);
        lines.push(`})(${varName});`);
        if (c.variableId) {
          lines.push(`try { var __iconVar = figma.variables.getVariableById('${c.variableId}');`);
          lines.push(`  if (__iconVar) (function bindVar(n) {`);
          lines.push(`    if ('strokes' in n && n.strokes && n.strokes.length > 0) try { n.setBoundVariable('strokes/0/color', __iconVar); } catch(e) {}`);
          lines.push(`    if ('fills' in n && n.fills && n.fills.length > 0 && (n.type === 'VECTOR' || n.type === 'LINE' || n.type === 'STAR' || n.type === 'ELLIPSE' || n.type === 'POLYGON' || n.type === 'BOOLEAN_OPERATION')) try { n.setBoundVariable('fills/0/color', __iconVar); } catch(e) {}`);
          lines.push(`    if ('children' in n) { for (var i = 0; i < n.children.length; i++) bindVar(n.children[i]); }`);
          lines.push(`  })(${varName});`);
          lines.push(`} catch(e) {}`);
        }
      }
    } else {
      const reason = irNode.masterNodeId
        ? `invalid ID "${irNode.masterNodeId}"`
        : 'no masterNodeId';
      lines.push(`// WARNING: ${reason} for "${irNode.name}" — creating placeholder frame`);
      lines.push(`const ${varName} = figma.createFrame();`);
      lines.push(`${varName}.name = '${(irNode.name || 'unknown').replace(/'/g, '')} [MISSING]';`);
      lines.push(`${varName}.resize(${irNode.resize ? irNode.resize[0] : 100}, ${irNode.resize ? irNode.resize[1] : 32});`);
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

  if (isRoot && irNode.ring) {
    const ringSpread = irNode.ring.spread;
    const ringColor = colorLiteral(irNode.ring.color);
    lines.push(`${varName}.fills = [];`);
    lines.push(`${varName}.strokes = [{ type: 'SOLID', color: ${ringColor} }];`);
    lines.push(`${varName}.strokeWeight = ${ringSpread};`);
    lines.push(`${varName}.strokeAlign = 'OUTSIDE';`);
    if (irNode.ring.variableId) {
      lines.push(`try {`);
      lines.push(`  const v = figma.variables.getVariableById('${irNode.ring.variableId}');`);
      lines.push(`  if (v) ${varName}.setBoundVariable('strokes/0/color', v);`);
      lines.push(`} catch(e) {}`);
    }
    const innerRadius = irNode.cornerRadius
      ? (irNode.cornerRadius.uniform !== false ? (irNode.cornerRadius.value || 0) : Math.max(irNode.cornerRadius.topLeft || 0, irNode.cornerRadius.topRight || 0, irNode.cornerRadius.bottomRight || 0, irNode.cornerRadius.bottomLeft || 0))
      : 0;
    if (innerRadius > 0) {
      lines.push(`${varName}.cornerRadius = ${innerRadius};`);
    }

    if (irNode.children && irNode.children.length > 0) {
      const firstChild = irNode.children[0];
      if (!firstChild.fills && irNode.fills) firstChild.fills = irNode.fills;
      if (!firstChild.strokes && irNode.strokes) firstChild.strokes = irNode.strokes;
      if (!firstChild.cornerRadius && irNode.cornerRadius) firstChild.cornerRadius = irNode.cornerRadius;
    }
  } else {
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

function generateScript(ir, parentFrameId, variantName, variantProps) {
  nodeCounter = 0;
  const lines = [];

  const variantLabel = variantName || ir.componentName;
  const propsString = variantProps || ir.variantProps || variantLabel;
  const componentName = ir.componentName;

  lines.push('// Auto-generated by react-to-figma-dom ir-to-figma-code.js');
  lines.push(`// Component: ${componentName}`);
  lines.push(`// Variant: ${variantLabel}`);
  lines.push(`// Variant Props: ${propsString}`);
  lines.push(`// Generated: ${ir.generatedAt}`);
  lines.push(`// Nodes: ${ir.nodeCount}`);
  lines.push('');

  lines.push(`let __componentsPage = figma.root.children.find(p => p.name === 'Components');`);
  lines.push(`if (!__componentsPage) {`);
  lines.push(`  __componentsPage = figma.createPage();`);
  lines.push(`  __componentsPage.name = 'Components';`);
  lines.push(`}`);
  lines.push(`await figma.setCurrentPageAsync(__componentsPage);`);
  lines.push(`let __containerFrame = __componentsPage.children.find(n => n.type === 'FRAME' && n.name === 'Components');`);
  lines.push(`if (!__containerFrame) {`);
  lines.push(`  __containerFrame = figma.createFrame();`);
  lines.push(`  __containerFrame.name = 'Components';`);
  lines.push(`  __componentsPage.appendChild(__containerFrame);`);
  lines.push(`  __containerFrame.layoutMode = 'HORIZONTAL';`);
  lines.push(`  __containerFrame.layoutWrap = 'WRAP';`);
  lines.push(`  __containerFrame.itemSpacing = 40;`);
  lines.push(`  __containerFrame.counterAxisSpacing = 40;`);
  lines.push(`  __containerFrame.paddingTop = 40;`);
  lines.push(`  __containerFrame.paddingBottom = 40;`);
  lines.push(`  __containerFrame.paddingLeft = 40;`);
  lines.push(`  __containerFrame.paddingRight = 40;`);
  lines.push(`  __containerFrame.primaryAxisSizingMode = 'AUTO';`);
  lines.push(`  __containerFrame.counterAxisSizingMode = 'AUTO';`);
  lines.push(`  __containerFrame.fills = [];`);
  lines.push(`}`);
  lines.push('');

  lines.push(generateFontLoading(ir.fonts));
  lines.push('');

  const result = generateNodeCode(ir.root, null, true);
  lines.push(...result.lines);
  lines.push('');

  lines.push(`${result.varName}.name = ${JSON.stringify(propsString)};`);
  lines.push('');

  lines.push(`// --- Idempotent ComponentSet find-or-create ---`);
  lines.push(`const __setName = ${JSON.stringify(componentName)};`);
  lines.push(`const __existingSet = __containerFrame.findOne(n => n.type === 'COMPONENT_SET' && n.name === __setName);`);
  lines.push('');
  lines.push(`if (__existingSet) {`);
  lines.push(`  const __dup = __existingSet.findOne(n => n.name === ${JSON.stringify(propsString)});`);
  lines.push(`  if (__dup) __dup.remove();`);
  lines.push(`  __existingSet.appendChild(${result.varName});`);
  lines.push(`  return { rootNodeId: ${result.varName}.id, setId: __existingSet.id, name: ${result.varName}.name, mode: 'appended' };`);
  lines.push(`} else {`);
  lines.push(`  __containerFrame.appendChild(${result.varName});`);
  lines.push(`  const __newSet = figma.combineAsVariants([${result.varName}], __containerFrame);`);
  lines.push(`  __newSet.name = __setName;`);
  lines.push(`  __newSet.layoutMode = 'HORIZONTAL';`);
  lines.push(`  __newSet.layoutWrap = 'WRAP';`);
  lines.push(`  __newSet.itemSpacing = 40;`);
  lines.push(`  __newSet.counterAxisSpacing = 40;`);
  lines.push(`  __newSet.paddingTop = 40;`);
  lines.push(`  __newSet.paddingBottom = 40;`);
  lines.push(`  __newSet.paddingLeft = 40;`);
  lines.push(`  __newSet.paddingRight = 40;`);
  lines.push(`  __newSet.primaryAxisSizingMode = 'FIXED';`);
  lines.push(`  __newSet.counterAxisSizingMode = 'AUTO';`);
  lines.push(`  __newSet.fills = [{ type: 'SOLID', color: { r: 0.95, g: 0.95, b: 0.98 } }];`);
  lines.push(`  __newSet.cornerRadius = 8;`);
  lines.push(`  const __maxW = Math.max(...__newSet.children.map(c => c.width));`);
  lines.push(`  __newSet.resize(3 * (__maxW + 40) + 40, __newSet.height);`);
  lines.push(`  return { rootNodeId: ${result.varName}.id, setId: __newSet.id, name: ${result.varName}.name, mode: 'created-set' };`);
  lines.push(`}`);

  return lines.join('\n');
}

function main() {
  const opts = parseArgs();
  const ir = JSON.parse(fs.readFileSync(opts.irFile, 'utf8'));

  const script = generateScript(ir, opts.parentFrameId, opts.variantName, opts.variantProps);
  const outBase = opts.output || opts.irFile.replace('.figma-ir.json', '.build-script.js');

  fs.mkdirSync(path.dirname(outBase), { recursive: true });
  fs.writeFileSync(outBase, script);
  console.log(`Generated: ${outBase} (${ir.nodeCount} nodes)`);

  if (ir.warnings && ir.warnings.length > 0) {
    console.log(`\nWarnings from IR:`);
    ir.warnings.forEach((w) => console.log(`  ⚠ ${w}`));
  }
}

main();
