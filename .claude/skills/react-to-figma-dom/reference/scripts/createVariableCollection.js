/**
 * createVariableCollection.js
 *
 * Creates a named Figma variable collection with specified modes.
 * Checks for existing collection by name first (idempotent).
 *
 * Usage: Embed in a use_figma call. Pass parameters as inlined constants.
 *
 * @param {string} name - Collection name (e.g., "Palette", "Semantic")
 * @param {string[]} modeNames - Mode names (e.g., ["Value"] or ["Light", "Dark"])
 * @returns {{ collectionId: string, modeIds: Record<string, string>, status: string }}
 */

async function createVariableCollection(name, modeNames) {
  const existing = await figma.variables.getLocalVariableCollectionsAsync();
  const found = existing.find(c => c.name === name);

  if (found) {
    const modeIds = {};
    for (const m of found.modes) {
      modeIds[m.name] = m.modeId;
    }
    return { collectionId: found.id, modeIds, status: 'already_exists' };
  }

  const collection = figma.variables.createVariableCollection(name);
  const modeIds = {};

  collection.renameMode(collection.modes[0].modeId, modeNames[0]);
  modeIds[modeNames[0]] = collection.modes[0].modeId;

  for (let i = 1; i < modeNames.length; i++) {
    const newModeId = collection.addMode(modeNames[i]);
    modeIds[modeNames[i]] = newModeId;
  }

  return { collectionId: collection.id, modeIds, status: 'created' };
}

// Example usage (inline in use_figma call):
// const result = await createVariableCollection('Palette', ['Value']);
// return result;
