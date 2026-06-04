#!/usr/bin/env node
/**
 * register-built-component.js
 * Registers a built component's Figma node ID in built-components.json.
 * 
 * Usage:
 *   node register-built-component.js \
 *     --name Badge \
 *     --node-id 123:456 \
 *     --built-components .temp/react-to-figma-dom/built-components.json
 *
 * The built-components.json file maps component names to their Figma component set
 * (or single component) node IDs. Parent components use these IDs to create instances
 * of child components via the INSTANCE IR node type.
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
let name = null;
let nodeId = null;
let filePath = null;

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--name': name = args[++i]; break;
    case '--node-id': nodeId = args[++i]; break;
    case '--built-components': filePath = args[++i]; break;
  }
}

if (!name || !nodeId || !filePath) {
  console.error('Usage: register-built-component.js --name <ComponentName> --node-id <figmaNodeId> --built-components <path>');
  process.exit(1);
}

let existing = {};
if (fs.existsSync(filePath)) {
  try {
    existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    existing = {};
  }
}

existing[name] = nodeId;

fs.mkdirSync(path.dirname(filePath), { recursive: true });
fs.writeFileSync(filePath, JSON.stringify(existing, null, 2) + '\n');

console.log(`Registered ${name} → ${nodeId} (${Object.keys(existing).length} total)`);
