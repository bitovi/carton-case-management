#!/usr/bin/env node

/**
 * validate-phase5-outputs.js
 *
 * Validates that Phase 5 output files contain real Figma IDs (not placeholder
 * strings). Checks figma-file-setup.json, figma-icons-map.json, and
 * figma-variables-map.json.
 *
 * Usage:
 *   node validate-phase5-outputs.js --pipeline-dir .temp/react-to-figma-dom/
 *
 * Exit codes:
 *   0 = all valid
 *   1 = invalid (placeholder or missing IDs detected)
 *   2 = file not found
 */

const fs = require('fs');
const path = require('path');

const FIGMA_NODE_ID_RE = /^\d+:\d+$/;
const FIGMA_VARIABLE_ID_RE = /^VariableID:\d+:\d+$/;

function parseArgs() {
  const args = process.argv.slice(2);
  let pipelineDir = null;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--pipeline-dir') pipelineDir = args[++i];
  }
  if (!pipelineDir) {
    console.error('Error: --pipeline-dir is required');
    process.exit(2);
  }
  return { pipelineDir };
}

function readJsonSafe(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return null;
  }
}

function validateFileSetup(pipelineDir) {
  const errors = [];
  const filePath = path.join(pipelineDir, 'figma-file-setup.json');
  const data = readJsonSafe(filePath);

  if (!data) {
    errors.push(`figma-file-setup.json: file missing or invalid JSON`);
    return errors;
  }

  if (data.pages) {
    for (const [name, id] of Object.entries(data.pages)) {
      if (typeof id !== 'string' || !FIGMA_NODE_ID_RE.test(id)) {
        errors.push(`figma-file-setup.json: pages.${name} = "${id}" is not a valid Figma node ID (expected digits:digits)`);
      }
    }
  }

  if (data.containerFrames) {
    for (const [name, id] of Object.entries(data.containerFrames)) {
      if (typeof id !== 'string' || !FIGMA_NODE_ID_RE.test(id)) {
        errors.push(`figma-file-setup.json: containerFrames.${name} = "${id}" is not a valid Figma node ID`);
      }
    }
  }

  return errors;
}

function validateIconsMap(pipelineDir) {
  const errors = [];
  const filePath = path.join(pipelineDir, 'figma-icons-map.json');
  const data = readJsonSafe(filePath);

  if (!data) {
    errors.push(`figma-icons-map.json: file missing or invalid JSON`);
    return errors;
  }

  let total = 0;
  let invalid = 0;
  for (const [name, entry] of Object.entries(data)) {
    total++;
    const id = entry && (entry.componentId || entry.nodeId);
    if (!id || !FIGMA_NODE_ID_RE.test(id)) {
      invalid++;
      if (invalid <= 3) {
        errors.push(`figma-icons-map.json: ${name}.componentId = "${id}" is not a valid Figma node ID`);
      }
    }
  }

  if (invalid > 3) {
    errors.push(`figma-icons-map.json: ... and ${invalid - 3} more invalid entries (${invalid}/${total} total)`);
  }

  return errors;
}

function validateVariablesMap(pipelineDir) {
  const errors = [];
  const filePath = path.join(pipelineDir, 'figma-variables-map.json');
  const data = readJsonSafe(filePath);

  if (!data) {
    errors.push(`figma-variables-map.json: file missing or invalid JSON`);
    return errors;
  }

  let total = 0;
  let invalid = 0;
  const seenIds = new Set();
  for (const [key, entry] of Object.entries(data)) {
    if (!entry || typeof entry !== 'object' || !entry.variableId) continue;
    total++;
    seenIds.add(entry.variableId);
    if (!FIGMA_VARIABLE_ID_RE.test(entry.variableId)) {
      invalid++;
      if (invalid <= 3) {
        errors.push(`figma-variables-map.json: ${key}.variableId = "${entry.variableId}" is not a valid Figma variable ID`);
      }
    }
  }

  if (invalid > 3) {
    errors.push(`figma-variables-map.json: ... and ${invalid - 3} more invalid entries (${invalid}/${total} total)`);
  }

  const uniqueIds = [...seenIds];
  const suspiciouslySequential = uniqueIds.length > 3 && uniqueIds.every((id) => {
    const match = id.match(/^VariableID:(\d+):(\d+)$/);
    return match && parseInt(match[2], 10) <= uniqueIds.length + 5;
  });
  if (suspiciouslySequential) {
    errors.push(`figma-variables-map.json: WARNING — all ${uniqueIds.length} variable IDs appear sequentially numbered (likely fabricated)`);
  }

  return errors;
}

function main() {
  const { pipelineDir } = parseArgs();
  const allErrors = [];

  allErrors.push(...validateFileSetup(pipelineDir));
  allErrors.push(...validateIconsMap(pipelineDir));
  allErrors.push(...validateVariablesMap(pipelineDir));

  if (allErrors.length === 0) {
    console.log('✓ Phase 5 outputs valid: all Figma IDs match expected formats');
    process.exit(0);
  } else {
    console.error('✗ Phase 5 output validation FAILED:');
    allErrors.forEach((e) => console.error(`  • ${e}`));
    console.error(`\n${allErrors.length} issue(s) found. Re-run Phase 5 to generate real Figma IDs.`);
    process.exit(1);
  }
}

main();
