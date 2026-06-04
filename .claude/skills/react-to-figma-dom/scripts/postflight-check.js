#!/usr/bin/env node

/**
 * postflight-check.js
 *
 * Validates that a completed phase produced all expected output files with valid content.
 * Run after the last item in a phase section completes, before moving to the next phase.
 *
 * Usage:
 *   node postflight-check.js --phase <D|E|F> --pipeline-dir <path> --skill-dir <path>
 *
 * Exit 0 if all outputs valid, exit 1 with specific errors.
 */

const fs = require('fs');
const path = require('path');
const { validate } = require('./validate-output');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { phase: null, pipelineDir: null, skillDir: null };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--phase': opts.phase = args[++i]; break;
      case '--pipeline-dir': opts.pipelineDir = args[++i]; break;
      case '--skill-dir': opts.skillDir = args[++i]; break;
    }
  }
  if (!opts.phase || !opts.pipelineDir) {
    console.error('Usage: node postflight-check.js --phase <D|E|F> --pipeline-dir <path> --skill-dir <path>');
    process.exit(1);
  }
  if (!opts.skillDir) {
    opts.skillDir = path.resolve(path.dirname(__dirname));
  }
  return opts;
}

function schemaFile(skillDir, name) {
  return path.join(skillDir, 'scripts', 'schemas', `${name}.schema.json`);
}

function validateFile(dataPath, schemaPath, errors) {
  if (!fs.existsSync(dataPath)) {
    errors.push(`Missing: ${dataPath}`);
    return;
  }
  if (!fs.existsSync(schemaPath)) return;
  const result = validate(schemaPath, dataPath);
  if (!result.valid) {
    result.errors.forEach(e => errors.push(`${path.basename(dataPath)}: ${e}`));
  }
}

function checkPhaseD(pipelineDir, skillDir) {
  const errors = [];
  const warnings = [];

  validateFile(
    path.join(pipelineDir, 'page-priority-manifest.json'),
    schemaFile(skillDir, 'page-priority-manifest'),
    errors
  );

  const componentsDir = path.join(pipelineDir, 'components');
  if (!fs.existsSync(componentsDir)) {
    errors.push('components/ directory not found');
    return { errors, warnings };
  }

  const components = fs.readdirSync(componentsDir).filter(name =>
    fs.statSync(path.join(componentsDir, name)).isDirectory()
  );

  let diffCount = 0;
  let preprocessCount = 0;
  const missingDiff = [];
  const missingPreprocess = [];

  for (const name of components) {
    const compDir = path.join(componentsDir, name);
    if (fs.existsSync(path.join(compDir, 'variant-diffs.md'))) {
      diffCount++;
    } else {
      missingDiff.push(name);
    }
    if (fs.existsSync(path.join(compDir, 'preprocess-status.json'))) {
      preprocessCount++;
    } else {
      missingPreprocess.push(name);
    }
  }

  if (missingDiff.length > 0 && missingDiff.length <= 10) {
    warnings.push(`${missingDiff.length} components missing variant-diffs.md: ${missingDiff.join(', ')}`);
  } else if (missingDiff.length > 10) {
    warnings.push(`${missingDiff.length}/${components.length} components missing variant-diffs.md`);
  }

  if (missingPreprocess.length > 0 && missingPreprocess.length <= 10) {
    warnings.push(`${missingPreprocess.length} components missing preprocess-status.json: ${missingPreprocess.join(', ')}`);
  } else if (missingPreprocess.length > 10) {
    warnings.push(`${missingPreprocess.length}/${components.length} components missing preprocess-status.json`);
  }

  if (diffCount === 0) errors.push('No components have variant-diffs.md');
  if (preprocessCount === 0) errors.push('No components have preprocess-status.json');

  return { errors, warnings };
}

function checkPhaseE(pipelineDir, skillDir) {
  const errors = [];
  const warnings = [];

  const outputs = [
    { file: 'figma-file-setup.json', schema: 'figma-file-setup' },
    { file: 'figma-variables-map.json', schema: 'figma-variables-map' },
    { file: 'figma-icons-map.json', schema: 'figma-icons-map' },
    { file: 'figma-assets-map.json', schema: 'figma-assets-map' },
  ];

  for (const { file, schema } of outputs) {
    validateFile(
      path.join(pipelineDir, file),
      schemaFile(skillDir, schema),
      errors
    );
  }

  return { errors, warnings };
}

function checkPhaseF(pipelineDir, skillDir) {
  const errors = [];
  const warnings = [];

  const builtPath = path.join(pipelineDir, 'built-components.json');
  if (!fs.existsSync(builtPath)) {
    errors.push('Missing: built-components.json (Phase F should produce this)');
  } else {
    try {
      const built = JSON.parse(fs.readFileSync(builtPath, 'utf8'));
      if (typeof built !== 'object' || Object.keys(built).length === 0) {
        errors.push('built-components.json is empty');
      }
    } catch (e) {
      errors.push(`built-components.json: invalid JSON — ${e.message}`);
    }
  }

  return { errors, warnings };
}

function main() {
  const opts = parseArgs();
  const phase = opts.phase.toUpperCase();

  let result;
  switch (phase) {
    case 'D': result = checkPhaseD(opts.pipelineDir, opts.skillDir); break;
    case 'E': result = checkPhaseE(opts.pipelineDir, opts.skillDir); break;
    case 'F': result = checkPhaseF(opts.pipelineDir, opts.skillDir); break;
    default:
      console.error(`Unknown phase: ${phase}. Post-flight supports D, E, F.`);
      process.exit(1);
  }

  console.log(`Post-flight check for Phase ${phase}:`);

  if (result.warnings.length > 0) {
    console.log(`\nWarnings (${result.warnings.length}):`);
    result.warnings.forEach(w => console.log(`  ⚠ ${w}`));
  }

  if (result.errors.length === 0) {
    console.log('\nPASS — all expected outputs present and valid');
    process.exit(0);
  } else {
    console.error(`\nFAIL — ${result.errors.length} error(s):`);
    result.errors.forEach(e => console.error(`  ✗ ${e}`));
    console.error('\nPhase ' + phase + ' output is incomplete. Fix before proceeding.');
    process.exit(1);
  }
}

main();
