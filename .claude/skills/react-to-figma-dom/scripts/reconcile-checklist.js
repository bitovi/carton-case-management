#!/usr/bin/env node

/**
 * reconcile-checklist.js
 *
 * Scans actual disk state and patches checklist.md to reflect what's already done.
 * Additive only — flips `- [ ]` → `- [x]` for items with existing output, never unchecks.
 *
 * Usage:
 *   node reconcile-checklist.js --pipeline-dir <path> --checklist <checklist.md> [--dry-run]
 *
 * Exit 0 with summary of reconciled items.
 */

const fs = require('fs');
const path = require('path');
const { validate } = require('./validate-output');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { pipelineDir: null, checklist: null, dryRun: false };
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--pipeline-dir': opts.pipelineDir = args[++i]; break;
      case '--checklist': opts.checklist = args[++i]; break;
      case '--dry-run': opts.dryRun = true; break;
    }
  }
  if (!opts.pipelineDir || !opts.checklist) {
    console.error('Usage: node reconcile-checklist.js --pipeline-dir <path> --checklist <checklist.md> [--dry-run]');
    process.exit(1);
  }
  return opts;
}

function extractComponentName(line) {
  const match = line.match(/componentName=(\S+?)(?:,|$)/);
  return match ? match[1] : null;
}

function extractPromptFile(line) {
  const match = line.match(/\|\s*([^\s|]+\.md)\s*\|/);
  return match ? match[1].trim() : null;
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function checkDiffClassify(pipelineDir, componentName) {
  return fileExists(path.join(pipelineDir, 'components', componentName, 'variant-diffs.md'));
}

function checkPreprocess(pipelineDir, componentName) {
  return fileExists(path.join(pipelineDir, 'components', componentName, 'preprocess-status.json'));
}

function checkPrioritizePageVariants(pipelineDir) {
  return fileExists(path.join(pipelineDir, 'page-priority-manifest.json'));
}

function checkPhaseE(pipelineDir, skillDir) {
  const schemasDir = path.join(skillDir, 'scripts', 'schemas');
  const files = [
    { file: 'figma-file-setup.json', schema: 'figma-file-setup.schema.json' },
    { file: 'figma-variables-map.json', schema: 'figma-variables-map.schema.json' },
    { file: 'figma-icons-map.json', schema: 'figma-icons-map.schema.json' },
  ];

  for (const { file, schema } of files) {
    const dataPath = path.join(pipelineDir, file);
    const schemaFile = path.join(schemasDir, schema);
    if (!fileExists(dataPath)) return false;
    if (fileExists(schemaFile)) {
      const result = validate(schemaFile, dataPath);
      if (!result.valid) return false;
    }
  }
  return true;
}

function checkBuildComponent(pipelineDir, componentName) {
  return fileExists(path.join(pipelineDir, 'components', componentName, 'figma-result.json'));
}

function checkVerifyComponent(pipelineDir, componentName) {
  return fileExists(path.join(pipelineDir, 'components', componentName, 'verification-results.json'));
}

function isItemDone(line, pipelineDir, skillDir) {
  const promptFile = extractPromptFile(line);
  if (!promptFile) return false;

  const componentName = extractComponentName(line);

  if (promptFile.includes('1-prompt.diff-and-classify')) {
    return componentName && checkDiffClassify(pipelineDir, componentName);
  }
  if (promptFile.includes('2-prompt.generate-build-scripts-for-all-components')) {
    return componentName && checkPreprocess(pipelineDir, componentName);
  }
  if (promptFile.includes('3-prompt.prioritize-page-variants')) {
    return checkPrioritizePageVariants(pipelineDir);
  }
  if (promptFile.includes('5-setup-figma-file/prompt')) {
    return checkPhaseE(pipelineDir, skillDir);
  }
  if (promptFile.includes('build-a-component')) {
    return componentName && checkBuildComponent(pipelineDir, componentName);
  }
  if (promptFile.includes('verify-a-component')) {
    return componentName && checkVerifyComponent(pipelineDir, componentName);
  }

  return false;
}

function main() {
  const opts = parseArgs();

  const skillDir = path.resolve(path.dirname(__dirname));
  const checklistContent = fs.readFileSync(opts.checklist, 'utf8');
  const lines = checklistContent.split('\n');

  let flipped = 0;
  let alreadyDone = 0;
  let remaining = 0;
  let total = 0;

  const newLines = lines.map(line => {
    if (line.startsWith('- [x]')) {
      alreadyDone++;
      total++;
      return line;
    }
    if (!line.startsWith('- [ ]')) {
      return line;
    }

    total++;

    if (isItemDone(line, opts.pipelineDir, skillDir)) {
      flipped++;
      return line.replace('- [ ]', '- [x]');
    }

    remaining++;
    return line;
  });

  if (!opts.dryRun && flipped > 0) {
    fs.writeFileSync(opts.checklist, newLines.join('\n'));
  }

  console.log('Checklist Reconciliation:');
  console.log(`  Total items: ${total}`);
  console.log(`  Already checked: ${alreadyDone}`);
  console.log(`  Reconciled (flipped [ ] → [x]): ${flipped}`);
  console.log(`  Remaining: ${remaining}`);

  if (opts.dryRun) {
    console.log('\n  (dry-run — no changes written)');
  } else if (flipped > 0) {
    console.log(`\n  Updated: ${opts.checklist}`);
  } else {
    console.log('\n  No changes needed.');
  }
}

main();
