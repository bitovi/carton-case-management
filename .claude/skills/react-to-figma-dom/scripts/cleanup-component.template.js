// cleanup-component.template.js
// ─────────────────────────────────────────────────────────────
// Standalone template for removing existing component set / loose variants.
// Usage: Read this file, replace __COMPONENT_NAME__ with the actual name,
//        then pass the result to use_figma as-is.
//
// DO NOT modify this code. DO NOT write cleanup code from scratch.
// ─────────────────────────────────────────────────────────────

const COMPONENT_NAME = '__COMPONENT_NAME__';

const componentsPage = figma.root.children.find(p => p.name === 'Components');
if (!componentsPage) return { error: 'FATAL: No Components page found' };
await figma.setCurrentPageAsync(componentsPage);

const toRemove = [];
function visit(n) {
  if (n.name === COMPONENT_NAME && (n.type === 'COMPONENT_SET' || n.type === 'COMPONENT')) {
    toRemove.push(n);
  }
  if (n.name && n.name.startsWith(COMPONENT_NAME + '\u2014') && n.type === 'COMPONENT') {
    toRemove.push(n);
  }
  if ('children' in n && n.type !== 'INSTANCE') {
    try { for (const c of n.children) visit(c); } catch(e) {}
  }
}
visit(componentsPage);
toRemove.forEach(n => { try { n.remove(); } catch(e) {} });

return { cleaned: toRemove.length, componentName: COMPONENT_NAME };
