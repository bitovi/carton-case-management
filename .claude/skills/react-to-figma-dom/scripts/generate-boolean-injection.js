#!/usr/bin/env node

/**
 * generate-boolean-injection.js
 *
 * Generates a use_figma script that injects BOOLEAN property nodes (with actual
 * icon/content instances) into every variant of a Figma ComponentSet, then wires
 * their visibility to a component property toggle.
 *
 * For each BOOLEAN component property with a referenceCapture:
 *   1. Reads the reference capture DOM (shows the "true" state with the node present)
 *   2. Reads the base variant DOM (shows the "false" state without the node)
 *   3. Diffs to find structurally new nodes in the reference
 *   4. Reads the reference capture IR to find INSTANCE nodes (icons) within new nodes
 *   5. Generates Figma code to inject wrapper frames with icon instances into every variant
 *   6. Colors icons to match each variant's text fill
 *   7. Wires visibility to addComponentProperty('Show {name}', 'BOOLEAN', false)
 *   8. Sets visible=true on showcase variants so designers see the "on" state
 *
 * Usage:
 *   node generate-boolean-injection.js \
 *     --component-dir .temp/react-to-figma-dom/components/Button \
 *     --figma-variants .temp/react-to-figma-dom/components/Button/figma-variants.json \
 *     --variables-map .temp/react-to-figma-dom/figma-variables-map.json \
 *     --design-tokens .temp/react-to-figma-dom/design-tokens.json \
 *     --output .temp/react-to-figma-dom/components/Button/boolean-injection-script.js
 *
 * Output: A use_figma JavaScript script that can be executed directly.
 *         Returns null if no BOOLEAN properties need injection.
 */

const fs = require("fs");
const path = require("path");

function getArg(name) {
  const args = process.argv.slice(2);
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null;
}

const componentDir = getArg("component-dir");
const figmaVariantsPath = getArg("figma-variants");
const variablesMapPath = getArg("variables-map");
const designTokensPath = getArg("design-tokens");
const outputPath = getArg("output");

if (!componentDir || !outputPath) {
  console.error("Usage: node generate-boolean-injection.js --component-dir <path> --output <path>");
  console.error("  Optional: --figma-variants <path> --variables-map <path> --design-tokens <path>");
  process.exit(1);
}

const fvPath = figmaVariantsPath || path.join(componentDir, "figma-variants.json");
if (!fs.existsSync(fvPath)) {
  console.error(`Error: figma-variants.json not found at ${fvPath}`);
  process.exit(1);
}

const figmaVariants = JSON.parse(fs.readFileSync(fvPath, "utf8"));
const componentName = figmaVariants.componentName;

const booleanProps = (figmaVariants.componentProperties || []).filter(
  (p) => p.figmaType === "BOOLEAN" && p.referenceCapture
);

if (booleanProps.length === 0) {
  console.log(`${componentName}: No BOOLEAN properties with referenceCapture. Skipping.`);
  process.exit(0);
}

const firstDependentFolder = findFirstDependentFolder(componentDir, figmaVariants);
if (!firstDependentFolder) {
  console.error(`Error: No base variant DOM found in ${componentDir}/variants/`);
  process.exit(1);
}

const baseDomPath = path.join(componentDir, "variants", firstDependentFolder, "dom.json");
if (!fs.existsSync(baseDomPath)) {
  console.error(`Error: Base DOM not found at ${baseDomPath}`);
  process.exit(1);
}

const baseDom = JSON.parse(fs.readFileSync(baseDomPath, "utf8"));

const injections = [];

for (const prop of booleanProps) {
  const refFolder = prop.referenceCapture;
  const refDomPath = path.join(componentDir, "variants", refFolder, "dom.json");

  if (!fs.existsSync(refDomPath)) {
    console.warn(`⚠ Reference capture not found: ${refDomPath} — skipping ${prop.property}`);
    continue;
  }

  const refDom = JSON.parse(fs.readFileSync(refDomPath, "utf8"));
  const newNodes = findNewNodes(baseDom.structure, refDom.structure);

  if (newNodes.length === 0) {
    console.warn(`⚠ No structural differences found for ${prop.property} — skipping`);
    continue;
  }

  const refIrPath = path.join(componentDir, "variants", refFolder, "figma-ir.json");
  let iconInstance = null;
  if (fs.existsSync(refIrPath)) {
    const refIr = JSON.parse(fs.readFileSync(refIrPath, "utf8"));
    iconInstance = findIconInstance(refIr.root, newNodes[0].insertIndex);
  }

  injections.push({
    property: prop.property,
    controlledNode: prop.controlledNode,
    newNodes,
    parentPath: newNodes[0].parentPath,
    insertIndex: newNodes[0].insertIndex,
    iconInstance,
  });
}

if (injections.length === 0) {
  console.log(`${componentName}: No injectable BOOLEAN nodes found.`);
  process.exit(0);
}

injections.sort((a, b) => b.insertIndex - a.insertIndex);

// SHOWCASE DISABLED: designers toggle booleans on instances directly
// const showcaseFilter = computeShowcaseFilter(figmaVariants);
const showcaseFilter = null;

const script = generateInjectionScript(componentName, injections, showcaseFilter);
fs.writeFileSync(outputPath, script);
console.log(`Wrote ${outputPath}`);
console.log(`  Injections: ${injections.length} BOOLEAN properties`);
for (const inj of injections) {
  const iconInfo = inj.iconInstance ? ` (icon: ${inj.iconInstance.name}, node ${inj.iconInstance.masterNodeId})` : ' (no icon)';
  console.log(`    - ${inj.property}: ${inj.newNodes.length} node(s)${iconInfo}`);
}
// SHOWCASE DISABLED
// if (showcaseFilter) {
//   console.log(`  Showcase: variants matching ${JSON.stringify(showcaseFilter)}`);
// }

function findIconInstance(irNode, targetChildIndex) {
  if (!irNode || !irNode.children) return null;
  const targetChild = irNode.children[targetChildIndex];
  if (targetChild) {
    const found = findInstanceRecursive(targetChild);
    if (found) return found;
  }
  return findInstanceRecursive(irNode);
}

function findInstanceRecursive(node) {
  if (node.type === "INSTANCE" && node.masterNodeId) {
    return {
      name: node.name,
      masterNodeId: node.masterNodeId,
      resize: node.resize || [16, 16],
      iconColor: node.iconColor || null,
    };
  }
  if (node.children) {
    for (const child of node.children) {
      const found = findInstanceRecursive(child);
      if (found) return found;
    }
  }
  return null;
}

// SHOWCASE DISABLED: designers toggle booleans on instances directly
// function computeShowcaseFilter(figmaVariants) {
//   if (figmaVariants.booleanShowcaseFilter) {
//     return figmaVariants.booleanShowcaseFilter;
//   }
//   const axes = figmaVariants.variantAxes || [];
//   const binaryAxis = axes.find((a) => a.values && a.values.length === 2 && a.axis !== "Error");
//   if (binaryAxis) {
//     const nonDefault = binaryAxis.values.find((v) => v !== binaryAxis.default);
//     if (nonDefault) {
//       return { [binaryAxis.axis]: nonDefault };
//     }
//   }
//   if (axes.length > 0) {
//     const lastAxis = axes[axes.length - 1];
//     const nonDefault = lastAxis.values.find((v) => v !== lastAxis.default);
//     if (nonDefault) {
//       return { [lastAxis.axis]: nonDefault };
//     }
//   }
//   return null;
// }

// function variantMatchesFilter(variantName, filter) {
//   if (!filter) return false;
//   const props = new Map();
//   for (const pair of variantName.split(", ")) {
//     const [k, v] = pair.split("=");
//     props.set(k, v);
//   }
//   for (const [axis, value] of Object.entries(filter)) {
//     if (props.get(axis) !== value) return false;
//   }
//   return true;
// }

function findFirstDependentFolder(componentDir, figmaVariants) {
  const variantsDir = path.join(componentDir, "variants");
  if (!fs.existsSync(variantsDir)) return null;

  const folderMap = figmaVariants.variantFolderMap || {};
  const folders = Object.values(folderMap).map((p) => p.replace("variants/", ""));

  for (const folder of folders) {
    const domPath = path.join(variantsDir, folder, "dom.json");
    if (fs.existsSync(domPath)) return folder;
  }

  const entries = fs.readdirSync(variantsDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name.startsWith("With ")) continue;
    const domPath = path.join(variantsDir, entry.name, "dom.json");
    if (fs.existsSync(domPath)) return entry.name;
  }

  return null;
}

function findNewNodes(baseNode, refNode, parentPath, results) {
  parentPath = parentPath || "root";
  results = results || [];

  if (!baseNode || !refNode) return results;

  const baseChildren = baseNode.children || [];
  const refChildren = refNode.children || [];

  if (refChildren.length > baseChildren.length) {
    for (let i = 0; i < refChildren.length; i++) {
      const refChild = refChildren[i];
      const baseChild = baseChildren[i];

      if (!baseChild || !structurallyEqual(baseChild, refChild)) {
        const isNew = !baseChildren.some((bc) => structurallyEqual(bc, refChild));
        if (isNew) {
          results.push({
            node: refChild,
            parentPath,
            insertIndex: i,
          });
        }
      }
    }
  }

  const minLen = Math.min(baseChildren.length, refChildren.length);
  for (let i = 0; i < minLen; i++) {
    findNewNodes(baseChildren[i], refChildren[i], `${parentPath}[${i}]`, results);
  }

  return results;
}

function structurallyEqual(a, b) {
  if (!a || !b) return false;
  if ((a.tag || "") !== (b.tag || "")) return false;
  const aChildren = a.children || [];
  const bChildren = b.children || [];
  if (aChildren.length !== bChildren.length) return false;
  for (let i = 0; i < aChildren.length; i++) {
    if (!structurallyEqual(aChildren[i], bChildren[i])) return false;
  }
  return true;
}

function generateInjectionScript(componentName, injections, showcaseFilter) {
  const lines = [];
  lines.push(`// Auto-generated BOOLEAN injection script for ${componentName}`);
  lines.push(`// Injects nodes with icon content, wires component properties, and sets showcase visibility`);
  lines.push(`// Generated: ${new Date().toISOString()}`);
  lines.push(``);
  lines.push(`const componentsPage = figma.root.children.find(p => p.name === 'Components');`);
  lines.push(`if (!componentsPage) return { error: 'Components page not found' };`);
  lines.push(`await figma.setCurrentPageAsync(componentsPage);`);
  lines.push(``);
  lines.push(`const componentSet = componentsPage.findOne(n => n.type === 'COMPONENT_SET' && n.name === '${componentName}');`);
  lines.push(`if (!componentSet) return { error: 'ComponentSet "${componentName}" not found' };`);
  lines.push(``);

  const hasIcons = injections.some((inj) => inj.iconInstance);
  if (hasIcons) {
    lines.push(`function recolorIcon(instance, fillColor, variableId) {`);
    lines.push(`  (function recolor(n) {`);
    lines.push(`    if ('strokes' in n && n.strokes && n.strokes.length > 0) n.strokes = [{ type: 'SOLID', color: fillColor }];`);
    lines.push(`    if ('fills' in n && n.fills && n.fills.length > 0 && (n.type === 'VECTOR' || n.type === 'LINE' || n.type === 'STAR' || n.type === 'ELLIPSE' || n.type === 'POLYGON' || n.type === 'BOOLEAN_OPERATION')) n.fills = [{ type: 'SOLID', color: fillColor }];`);
    lines.push(`    if ('children' in n) { for (var i = 0; i < n.children.length; i++) recolor(n.children[i]); }`);
    lines.push(`  })(instance);`);
    lines.push(`  if (variableId) {`);
    lines.push(`    try {`);
    lines.push(`      var v = figma.variables.getVariableById(variableId);`);
    lines.push(`      if (v) (function bindVar(n) {`);
    lines.push(`        if ('strokes' in n && n.strokes && n.strokes.length > 0) try { n.setBoundVariable('strokes/0/color', v); } catch(e) {}`);
    lines.push(`        if ('fills' in n && n.fills && n.fills.length > 0 && (n.type === 'VECTOR' || n.type === 'LINE' || n.type === 'STAR' || n.type === 'ELLIPSE' || n.type === 'POLYGON' || n.type === 'BOOLEAN_OPERATION')) try { n.setBoundVariable('fills/0/color', v); } catch(e) {}`);
    lines.push(`        if ('children' in n) { for (var i = 0; i < n.children.length; i++) bindVar(n.children[i]); }`);
    lines.push(`      })(instance);`);
    lines.push(`    } catch(e) {}`);
    lines.push(`  }`);
    lines.push(`}`);
    lines.push(``);
    lines.push(`function getTextFill(variant) {`);
    lines.push(`  const textNode = variant.findOne(n => n.type === 'TEXT');`);
    lines.push(`  if (!textNode || !textNode.fills || textNode.fills.length === 0) return null;`);
    lines.push(`  const fill = textNode.fills[0];`);
    lines.push(`  let variableId = null;`);
    lines.push(`  try { const bound = textNode.boundVariables && textNode.boundVariables.fills && textNode.boundVariables.fills[0]; if (bound) variableId = bound.id; } catch(e) {}`);
    lines.push(`  return { color: fill.color, variableId };`);
    lines.push(`}`);
    lines.push(``);
  }

  if (showcaseFilter) {
    lines.push(`function isShowcase(variantName) {`);
    lines.push(`  const props = new Map();`);
    lines.push(`  for (const pair of variantName.split(', ')) { const [k, v] = pair.split('='); props.set(k, v); }`);
    const conditions = Object.entries(showcaseFilter)
      .map(([axis, value]) => `props.get('${axis}') === '${value}'`)
      .join(" && ");
    lines.push(`  return ${conditions};`);
    lines.push(`}`);
    lines.push(``);
  }

  for (const inj of injections) {
    const propName = inj.property;
    const varName = propName.replace(/[^a-zA-Z0-9]/g, "_");
    const icon = inj.iconInstance;

    lines.push(`// --- ${propName} ---`);

    if (icon) {
      lines.push(`const ${varName}_rawMaster = figma.getNodeById('${icon.masterNodeId}');`);
      lines.push(`if (!${varName}_rawMaster) return { error: 'Icon node ${icon.masterNodeId} not found for ${sanitizeName(icon.name)}' };`);
      lines.push(`const ${varName}_master = ${varName}_rawMaster.type === 'COMPONENT_SET' ? ${varName}_rawMaster.children[0] : ${varName}_rawMaster;`);
      lines.push(``);
    }

    lines.push(`const ${varName}_key = componentSet.addComponentProperty('${propName}', 'BOOLEAN', false);`);
    lines.push(``);
    lines.push(`for (const variant of componentSet.children) {`);

    if (showcaseFilter) {
      lines.push(`  const showcase = isShowcase(variant.name);`);
    }

    if (inj.newNodes.length === 1) {
      const node = inj.newNodes[0].node;
      const w = node.bounds ? Math.round(node.bounds.width || 16) : 16;
      const h = node.bounds ? Math.round(node.bounds.height || 16) : 16;

      lines.push(`  const ${varName}_wrapper = figma.createFrame();`);
      lines.push(`  ${varName}_wrapper.name = '${sanitizeName(inj.controlledNode || propName)}';`);
      lines.push(`  ${varName}_wrapper.visible = false;`);
      lines.push(`  ${varName}_wrapper.layoutMode = 'HORIZONTAL';`);
      lines.push(`  ${varName}_wrapper.primaryAxisAlignItems = 'CENTER';`);
      lines.push(`  ${varName}_wrapper.counterAxisAlignItems = 'CENTER';`);
      lines.push(`  ${varName}_wrapper.primaryAxisSizingMode = 'AUTO';`);
      lines.push(`  ${varName}_wrapper.counterAxisSizingMode = 'AUTO';`);
      lines.push(`  ${varName}_wrapper.fills = [];`);

      if (icon) {
        lines.push(`  const ${varName}_icon = ${varName}_master.createInstance();`);
        lines.push(`  ${varName}_icon.resize(${icon.resize[0]}, ${icon.resize[1]});`);
        lines.push(`  ${varName}_wrapper.appendChild(${varName}_icon);`);
        lines.push(`  const textFill = getTextFill(variant);`);
        lines.push(`  if (textFill) recolorIcon(${varName}_icon, textFill.color, textFill.variableId);`);
      }

      lines.push(`  variant.insertChild(${inj.insertIndex}, ${varName}_wrapper);`);
      lines.push(`  ${varName}_wrapper.componentPropertyReferences = { visible: ${varName}_key };`);
    } else {
      lines.push(`  const ${varName}_wrapper = figma.createFrame();`);
      lines.push(`  ${varName}_wrapper.name = '${sanitizeName(inj.controlledNode || propName)}';`);
      lines.push(`  ${varName}_wrapper.visible = false;`);
      lines.push(`  ${varName}_wrapper.layoutMode = 'HORIZONTAL';`);
      lines.push(`  ${varName}_wrapper.primaryAxisAlignItems = 'CENTER';`);
      lines.push(`  ${varName}_wrapper.counterAxisAlignItems = 'CENTER';`);
      lines.push(`  ${varName}_wrapper.primaryAxisSizingMode = 'AUTO';`);
      lines.push(`  ${varName}_wrapper.counterAxisSizingMode = 'AUTO';`);
      lines.push(`  ${varName}_wrapper.fills = [];`);

      if (icon) {
        lines.push(`  const ${varName}_icon = ${varName}_master.createInstance();`);
        lines.push(`  ${varName}_icon.resize(${icon.resize[0]}, ${icon.resize[1]});`);
        lines.push(`  ${varName}_wrapper.appendChild(${varName}_icon);`);
        lines.push(`  const textFill = getTextFill(variant);`);
        lines.push(`  if (textFill) recolorIcon(${varName}_icon, textFill.color, textFill.variableId);`);
      }

      lines.push(`  variant.insertChild(${inj.insertIndex}, ${varName}_wrapper);`);
      lines.push(`  ${varName}_wrapper.componentPropertyReferences = { visible: ${varName}_key };`);
    }

    lines.push(`}`);
    lines.push(``);
  }

  lines.push(`return {`);
  lines.push(`  componentName: '${componentName}',`);
  lines.push(`  injected: [${injections.map((i) => `'${i.property}'`).join(", ")}],`);
  lines.push(`  variantCount: componentSet.children.length`);
  lines.push(`};`);

  return lines.join("\n");
}

function sanitizeName(name) {
  return name.replace(/'/g, "\\'");
}
