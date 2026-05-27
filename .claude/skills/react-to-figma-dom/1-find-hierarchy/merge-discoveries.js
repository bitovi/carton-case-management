#!/usr/bin/env node

/**
 * merge-discoveries.js
 *
 * Reconciles component discovery results from the `from-files` (static analysis)
 * and `from-app` (browser crawl) strategies into a single unified component list.
 *
 * Usage:
 *   node merge-discoveries.js \
 *     --from-files .temp/react-to-figma/component-hierarchy/from-files/components.json \
 *     --from-app   .temp/react-to-figma/component-hierarchy/from-app/components.json \
 *     --output-dir .temp/react-to-figma/component-hierarchy \
 *     [--source-root packages/client/src]
 *
 * Outputs (written to --output-dir):
 *   - components-todo.md   Unified checklist with origin tracking (for LLM consumption)
 *   - barrel-map.md        Copied from from-files (if it exists)
 */

const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    fromFiles: null,
    fromApp: null,
    outputDir: null,
    sourceRoot: null,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--from-files':  opts.fromFiles  = args[++i]; break;
      case '--from-app':    opts.fromApp    = args[++i]; break;
      case '--output-dir':  opts.outputDir  = args[++i]; break;
      case '--source-root': opts.sourceRoot = args[++i]; break;
      case '--help':        printUsage(); process.exit(0);
      default:
        console.error(`Unknown argument: ${args[i]}`);
        printUsage();
        process.exit(1);
    }
  }

  if (!opts.fromFiles || !opts.fromApp || !opts.outputDir) {
    console.error('Error: --from-files, --from-app, and --output-dir are required.');
    printUsage();
    process.exit(1);
  }

  if (!fs.existsSync(opts.fromFiles)) {
    console.error(`Error: from-files path does not exist: ${opts.fromFiles}`);
    process.exit(1);
  }
  if (!fs.existsSync(opts.fromApp)) {
    console.error(`Error: from-app path does not exist: ${opts.fromApp}`);
    process.exit(1);
  }

  return opts;
}

function printUsage() {
  console.error(`
Usage: node merge-discoveries.js --from-files <path> --from-app <path> --output-dir <dir> [options]

Required:
  --from-files <path>   Path to from-files/components.json
  --from-app   <path>   Path to from-app/components.json
  --output-dir <dir>    Where to write merged output files

Options:
  --source-root <dir>   Source root for resolving runtime-only component paths
  --help                Show this help
`.trim());
}

function loadComponents(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!data.components || !Array.isArray(data.components)) {
    console.error(`Error: ${filePath} missing "components" array`);
    process.exit(1);
  }
  return data.components;
}

function tryResolveRuntimePath(name, sourceRoot) {
  if (!sourceRoot || !fs.existsSync(sourceRoot)) return null;

  const patterns = [
    new RegExp(`(?:function|const)\\s+${name}\\b`),
  ];

  const results = [];
  walkForResolve(sourceRoot, patterns, name, results);
  return results.length > 0 ? results[0] : null;
}

function walkForResolve(dir, patterns, name, results) {
  let items;
  try { items = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }

  for (const item of items) {
    if (item.name.startsWith('.') || item.name === 'node_modules') continue;

    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      walkForResolve(fullPath, patterns, name, results);
    } else if (/\.(tsx|jsx)$/.test(item.name) && !/\.(test|spec|stories)\.(tsx|jsx)$/.test(item.name)) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (patterns.some(p => p.test(content))) {
          results.push(fullPath);
        }
      } catch {}
    }
  }
}

function main() {
  const opts = parseArgs();

  const filesComps = loadComponents(opts.fromFiles);
  const appComps = loadComponents(opts.fromApp);

  const filesMap = new Map();
  for (const c of filesComps) {
    filesMap.set(c.name, c);
  }
  const appMap = new Map();
  for (const c of appComps) {
    if (!appMap.has(c.name)) appMap.set(c.name, c);
  }

  const merged = new Map();
  const allNames = new Set([...filesMap.keys(), ...appMap.keys()]);

  let bothCount = 0, filesOnlyCount = 0, appOnlyCount = 0;

  for (const name of allNames) {
    const fromFiles = filesMap.get(name);
    const fromApp = appMap.get(name);

    if (fromFiles && fromApp) {
      merged.set(name, {
        name,
        path: fromFiles.path,
        sourceType: fromFiles.sourceType,
        exportType: fromFiles.exportType,
        origin: 'both',
      });
      bothCount++;
    } else if (fromFiles) {
      merged.set(name, { ...fromFiles, origin: 'files' });
      filesOnlyCount++;
    } else {
      let comp = { ...fromApp, origin: 'app' };
      if (comp.path === '(runtime-only — no file found)' && opts.sourceRoot) {
        const resolved = tryResolveRuntimePath(name, opts.sourceRoot);
        if (resolved) {
          comp.path = path.relative(process.cwd(), resolved);
        }
      }
      merged.set(name, comp);
      appOnlyCount++;
    }
  }

  const project = [], uiLib = [], npm = [], runtimeOnly = [];

  for (const c of merged.values()) {
    if (c.path === '(runtime-only — no file found)') {
      runtimeOnly.push(c);
    } else if (c.sourceType === 'npm') {
      npm.push(c);
    } else if (c.sourceType === 'ui-library') {
      uiLib.push(c);
    } else {
      project.push(c);
    }
  }

  const sorter = (a, b) => a.name.localeCompare(b.name);
  project.sort(sorter);
  uiLib.sort(sorter);
  npm.sort(sorter);
  runtimeOnly.sort(sorter);

  const total = merged.size;
  const formatLine = (c) => `- [ ] ${c.name} | ${c.path} | ${c.sourceType} | ${c.exportType} | ${c.origin}`;

  let md = `# Components To Analyze

Total: ${total}
Discovery method: reconciled (files + app)
From-files found: ${filesComps.length}
From-app found: ${appComps.length}
Both strategies: ${bothCount}
Files-only: ${filesOnlyCount}
App-only: ${appOnlyCount}

## Project Components
${project.map(formatLine).join('\n')}
`;

  if (uiLib.length > 0) {
    md += `\n## UI Library Components\n${uiLib.map(formatLine).join('\n')}\n`;
  }

  if (npm.length > 0) {
    md += `\n## npm Components\n${npm.map(formatLine).join('\n')}\n`;
  }

  if (runtimeOnly.length > 0) {
    md += `\n## Runtime-Only Components\n${runtimeOnly.map(formatLine).join('\n')}\n`;
  }

  fs.mkdirSync(opts.outputDir, { recursive: true });
  fs.writeFileSync(path.join(opts.outputDir, 'components-todo-raw.md'), md.trimEnd() + '\n');

  const barrelSrc = path.join(path.dirname(opts.fromFiles), 'barrel-map.md');
  const barrelDest = path.join(opts.outputDir, 'barrel-map.md');
  if (fs.existsSync(barrelSrc)) {
    fs.copyFileSync(barrelSrc, barrelDest);
  } else {
    fs.writeFileSync(barrelDest, `# Barrel Re-export Map

Discovery method: app-crawl only (barrel map not available — re-run with strategy "both" or "files" for barrel resolution)
`);
  }

  console.log(`Reconciliation complete.`);
  console.log(`- Total unified components: ${total}`);
  console.log(`- Found by both strategies: ${bothCount}`);
  console.log(`- Found by files only: ${filesOnlyCount}`);
  console.log(`- Found by app only: ${appOnlyCount}`);
  console.log(`- Unresolved file paths: ${runtimeOnly.length}`);
  console.log(`- Output: ${path.join(opts.outputDir, 'components-todo-raw.md')}`);
  console.log(`- Barrel map: ${barrelDest}`);
}

main();
