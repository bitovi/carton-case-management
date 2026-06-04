/**
 * createSemanticTokens.js
 *
 * Creates a batch of Figma variables in a collection. Supports raw values
 * and variable alias references. Returns a map of token name → variable info.
 *
 * Usage: Embed in a use_figma call with inlined token data.
 *
 * @param {VariableCollection} collection - Target collection
 * @param {string} modeId - Mode ID to set values for
 * @param {Array<{name: string, type: string, value: any, scopes?: string[]}>} tokens
 * @returns {{ variables: Array<{name: string, id: string}> }}
 */

function hexToFigmaColor(hex) {
  const c = hex.replace('#', '');
  return {
    r: parseInt(c.slice(0, 2), 16) / 255,
    g: parseInt(c.slice(2, 4), 16) / 255,
    b: parseInt(c.slice(4, 6), 16) / 255,
    a: 1
  };
}

async function createSemanticTokens(collection, modeId, tokens) {
  const created = [];

  for (const token of tokens) {
    const variable = figma.variables.createVariable(token.name, collection, token.type);

    let value = token.value;

    if (token.type === 'COLOR' && typeof value === 'string' && value.startsWith('#')) {
      value = hexToFigmaColor(value);
    }

    variable.setValueForMode(modeId, value);

    if (token.scopes) {
      variable.scopes = token.scopes;
    }

    if (token.codeSyntax) {
      variable.setVariableCodeSyntax('WEB', token.codeSyntax);
    }

    created.push({ name: token.name, id: variable.id, key: variable.key });
  }

  return { variables: created };
}

// Example usage (inline in use_figma call):
// const collection = figma.variables.getVariableCollectionById('COLLECTION_ID');
// const result = await createSemanticTokens(collection, 'MODE_ID', [
//   { name: 'primary', type: 'COLOR', value: '#019AAF', scopes: ['FRAME_FILL', 'SHAPE_FILL'] },
//   { name: 'spacing/md', type: 'FLOAT', value: 16, scopes: ['GAP'] }
// ]);
// return result;
