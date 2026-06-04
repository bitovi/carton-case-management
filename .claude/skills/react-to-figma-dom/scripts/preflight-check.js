#!/usr/bin/env node

/**
 * preflight-check.js
 *
 * Validates that all required input files exist and are valid before a phase starts.
 * Prevents silent failures from missing or incomplete prerequisites.
 *
 * Usage:
 *   node preflight-check.js --phase <E|F|G> --pipeline-dir <path> [--skill-dir <path>]
 *
 * Exit 0 if all inputs present and valid, exit 1 with actionable list of what's missing.
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
    console.error('Usage: node preflight-check.js --phase <E|F|G> --pipeline-dir <path> [--skill-dir <path>]');
    process.exit(1);
  }
  if (!opts.skillDir) {
    opts.skillDir = path.join(path.dirname(__dirname));
  }
  return opts;
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function schemaPath(skillDir, name) {
  return path.join(skillDir, 'scripts', 'schemas', `${name}.schema.json`);
}

function checkFileExists(filePath, errors) {
  if (!fileExists(filePath)) {
    errors.push(`Missing: ${filePath}`);
    return false;
  }
  return true;
}

function checkFileValid(filePath, schemaFile, errors) {
  if (!checkFileExists(filePath, errors)) return false;
  if (!fileExists(schemaFile)) {
    errors.push(`Schema not found: ${schemaFile} (cannot validate ${path.basename(filePath)})`);
    return false;
  }
  const result = validate(schemaFile, filePath);
  if (!result.valid) {
    result.errors.forEach(e => errors.push(`${path.basename(filePath)}: ${e}`));
    return false;
  }
  return true;
}

function getComponentNames(pipelineDir) {
  const componentsDir = path.join(pipelineDir, 'components');
  if (!fs.existsSync(componentsDir)) return [];
  return fs.readdirSync(componentsDir).filter(name => {
    const stat = fs.statSync(path.join(componentsDir, name));
    return stat.isDirectory();
  });
}

function checkPhaseE(pipelineDir, skillDir) {
  const errors = [];
  const warnings = [];

  checkFileExists(path.join(pipelineDir, 'design-tokens.json'), errors);
  checkFileExists(path.join(pipelineDir, 'css-figma-map.json'), errors);
  checkFileExists(path.join(pipelineDir, 'icons.json'), errors);

  const assetsFile = path.join(pipelineDir, 'assets', 'static-assets.json');
  if (!fileExists(assetsFile)) {
    warnings.push(`Optional: ${assetsFile} (static assets won't be created)`);
  }

  return { errors, warnings };
}

function checkPhaseF(pipelineDir, skillDir) {
  const errors = [];
  const warnings = [];

  checkFileValid(
    path.join(pipelineDir, 'figma-file-setup.json'),
    schemaPath(skillDir, 'figma-file-setup'),
    errors
  );
  checkFileValid(
    path.join(pipelineDir, 'figma-variables-map.json'),
    schemaPath(skillDir, 'figma-variables-map'),
    errors
  );
  checkFileValid(
    path.join(pipelineDir, 'figma-icons-map.json'),
    schemaPath(skillDir, 'figma-icons-map'),
    errors
  );

  const components = getComponentNames(pipelineDir);
  if (components.length === 0) {
    errors.push('No component directories found in components/');
  } else {
    let preprocessed = 0;
    let missing = [];
    for (const name of components) {
      const statusFile = path.join(pipelineDir, 'components', name, 'preprocess-status.json');
      if (fileExists(statusFile)) {
        preprocessed++;
      } else {
        missing.push(name);
      }
    }
    if (missing.length > 0 && missing.length <= 10) {
      warnings.push(`${missing.length} components missing preprocess-status.json: ${missing.join(', ')}`);
    } else if (missing.length > 10) {
      warnings.push(`${missing.length}/${components.length} components missing preprocess-status.json`);
    }
    if (preprocessed === 0) {
      errors.push('No components have preprocess-status.json — Phase D step 2 not run');
    }
  }

  return { errors, warnings };
}

function checkPhaseG(pipelineDir, skillDir) {
  const { errors, warnings } = checkPhaseF(pipelineDir, skillDir);

  checkFileValid(
    path.join(pipelineDir, 'page-priority-manifest.json'),
    schemaPath(skillDir, 'page-priority-manifest'),
    errors
  );

  const builtComponents = path.join(pipelineDir, 'built-components.json');
  if (!checkFileExists(builtComponents, errors)) {
    errors.push('built-components.json is written by Phase F — Phase F must complete first');
  }

  return { errors, warnings };
}

function main() {
  const opts = parseArgs();
  const phase = opts.phase.toUpperCase();

  let result;
  switch (phase) {
    case 'E': result = checkPhaseE(opts.pipelineDir, opts.skillDir); break;
    case 'F': result = checkPhaseF(opts.pipelineDir, opts.skillDir); break;
    case 'G': result = checkPhaseG(opts.pipelineDir, opts.skillDir); break;
    default:
      console.error(`Unknown phase: ${phase}. Expected E, F, or G.`);
      process.exit(1);
  }

  console.log(`Pre-flight check for Phase ${phase}:`);

  if (result.warnings.length > 0) {
    console.log(`\nWarnings (${result.warnings.length}):`);
    result.warnings.forEach(w => console.log(`  ⚠ ${w}`));
  }

  if (result.errors.length === 0) {
    console.log('\nPASS — all required inputs present and valid');
    process.exit(0);
  } else {
    console.error(`\nFAIL — ${result.errors.length} error(s):`);
    result.errors.forEach(e => console.error(`  ✗ ${e}`));
    console.error('\nFix these before starting Phase ' + phase + '.');
    process.exit(1);
  }
}

main();
