/**
 * inspectFileStructure.js
 *
 * Read-only inspection of a Figma file's structure. Returns pages, components,
 * component sets, variable collections, and styles. Use as the first step
 * before any creation to understand what already exists.
 *
 * Usage: Embed in a use_figma call and return the result.
 */

const pages = figma.root.children.map(p => ({
  name: p.name,
  id: p.id,
  childCount: p.children ? p.children.length : 0
}));

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const collectionSummary = collections.map(c => ({
  name: c.name,
  id: c.id,
  variableCount: c.variableIds.length,
  modes: c.modes.map(m => ({ name: m.name, id: m.modeId }))
}));

const allVars = await figma.variables.getLocalVariablesAsync();

const components = [];
const componentSets = [];

function walkNode(node) {
  if (node.type === 'COMPONENT') {
    components.push({ name: node.name, id: node.id, parent: node.parent?.name });
  } else if (node.type === 'COMPONENT_SET') {
    componentSets.push({
      name: node.name,
      id: node.id,
      variantCount: node.children?.length || 0,
      parent: node.parent?.name
    });
  }
  if ('children' in node && node.children) {
    for (const child of node.children) {
      walkNode(child);
    }
  }
}

for (const page of figma.root.children) {
  walkNode(page);
}

return {
  pages,
  collections: collectionSummary,
  totalVariables: allVars.length,
  components: components.length,
  componentSets: componentSets.length,
  componentList: components.slice(0, 50),
  componentSetList: componentSets.slice(0, 50)
};
