// combine-variants.template.js
// ─────────────────────────────────────────────────────────────
// Standalone template for combining variant components into a component set.
// Usage: Read this file, replace __COMPONENT_NAME__ with the actual name,
//        then pass the result to use_figma as-is.
//
// DO NOT modify this code. DO NOT write combine code from scratch.
// This is the canonical, tested combine implementation.
// ─────────────────────────────────────────────────────────────

const COMPONENT_NAME = '__COMPONENT_NAME__';

const componentsPage = figma.root.children.find(p => p.name === 'Components');
if (!componentsPage) {
  return { error: 'FATAL: No Components page found' };
}
await figma.setCurrentPageAsync(componentsPage);

// Find the Components container frame (auto-layout wrapper for all component sets)
const containerFrame = componentsPage.children.find(n => n.type === 'FRAME' && n.name === 'Components');

const allComps = [];
function visit(n) {
  if (n.type === 'COMPONENT' && n.name && n.name.startsWith(COMPONENT_NAME + '\u2014')) {
    allComps.push(n);
  }
  if ('children' in n && n.type !== 'INSTANCE') {
    try { for (const c of n.children) visit(c); } catch(e) {}
  }
}
visit(componentsPage);

if (allComps.length === 0) {
  return { error: 'FATAL: No component variants found with prefix "' + COMPONENT_NAME + '\u2014"', hint: 'Ensure build-script.js named each component as "' + COMPONENT_NAME + '\u2014Variant=..."' };
}

if (allComps.length === 1) {
  allComps[0].name = 'Variant=' + allComps[0].name.split('Variant=')[1];
  if (containerFrame && allComps[0].parent !== containerFrame) {
    containerFrame.appendChild(allComps[0]);
  }
  return { result: 'single_component', componentId: allComps[0].id, componentName: COMPONENT_NAME };
}

// CRITICAL: second argument to combineAsVariants must be a PARENT NODE, not an options object.
// The Figma Plugin API signature is: figma.combineAsVariants(components[], parentNode)
// Use the Components container frame if available, otherwise fall back to the variant's current parent.
const targetParent = containerFrame || allComps[0].parent;
if (!targetParent) {
  return { error: 'FATAL: No parent node available — cannot combine.' };
}

// Move all variants into the target parent before combining (they may be scattered)
for (const comp of allComps) {
  if (comp.parent !== targetParent) {
    targetParent.appendChild(comp);
  }
}

const componentSet = figma.combineAsVariants(allComps, targetParent);
componentSet.name = COMPONENT_NAME;

componentSet.layoutMode = 'HORIZONTAL';
componentSet.layoutWrap = 'WRAP';
componentSet.itemSpacing = 20;
componentSet.counterAxisSpacing = 20;
componentSet.paddingTop = 20;
componentSet.paddingBottom = 20;
componentSet.paddingLeft = 20;
componentSet.paddingRight = 20;
componentSet.primaryAxisSizingMode = 'AUTO';
componentSet.counterAxisSizingMode = 'AUTO';

return {
  result: 'combined',
  setId: componentSet.id,
  setName: componentSet.name,
  variantCount: allComps.length,
  componentName: COMPONENT_NAME
};
