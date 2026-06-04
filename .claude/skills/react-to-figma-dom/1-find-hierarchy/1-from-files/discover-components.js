#!/usr/bin/env node

/**
 * discover-components.js
 *
 * Statically analyzes a React source tree to discover all components,
 * build a barrel/re-export map, detect npm-imported components, and
 * classify props.
 *
 * Generic — no codebase-specific assumptions. Works with any React project
 * using function components, forwardRef, memo, default/named exports.
 *
 * Usage:
 *   node discover-components.js \
 *     --source-root packages/client/src \
 *     --output-dir .temp/react-to-figma-dom/component-hierarchy/from-files \
 *     [--ui-pattern "/ui/"] \
 *     [--exclude "*.test.*,*.spec.*,*.stories.*,*.d.ts"]
 *
 * Outputs (written to --output-dir):
 *   - components.json          JSON array of all discovered components
 *   - barrel-map.md            Re-export resolution map from index files
 *   - prop-classification.json Per-component prop categorization
 */

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// CLI parsing
// ---------------------------------------------------------------------------

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    sourceRoot: null,
    outputDir: null,
    uiPatterns: ['*/ui/*'],
    excludePatterns: ['*.test.*', '*.spec.*', '*.stories.*', '*.d.ts'],
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--source-root': opts.sourceRoot = args[++i]; break;
      case '--output-dir':  opts.outputDir  = args[++i]; break;
      case '--ui-pattern':  opts.uiPatterns = args[++i].split(',').map(s => s.trim()); break;
      case '--exclude':     opts.excludePatterns = args[++i].split(',').map(s => s.trim()); break;
      case '--help':        printUsage(); process.exit(0);
      default:
        console.error(`Unknown argument: ${args[i]}`);
        printUsage();
        process.exit(1);
    }
  }

  if (!opts.sourceRoot || !opts.outputDir) {
    console.error('Error: --source-root and --output-dir are required.');
    printUsage();
    process.exit(1);
  }

  if (!fs.existsSync(opts.sourceRoot)) {
    console.error(`Error: source root does not exist: ${opts.sourceRoot}`);
    process.exit(1);
  }

  return opts;
}

function printUsage() {
  console.error(`
Usage: node discover-components.js --source-root <dir> --output-dir <dir> [options]

Required:
  --source-root <dir>   Root directory to scan for .tsx/.jsx files
  --output-dir  <dir>   Where to write output files

Options:
  --ui-pattern <patterns>   Comma-separated substring patterns for ui-library classification
                            (default: "*/ui/*")
  --exclude <patterns>      Comma-separated filename patterns to skip
                            (default: "*.test.*,*.spec.*,*.stories.*,*.d.ts")
  --help                    Show this help
`.trim());
}

// ---------------------------------------------------------------------------
// File walking
// ---------------------------------------------------------------------------

const COMPONENT_EXTENSIONS = ['.tsx', '.jsx'];
const BARREL_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx'];
const SKIP_DIRS = new Set(['node_modules', '__tests__', '__mocks__', '.git', 'dist', 'build']);

function matchesPattern(filename, pattern) {
  if (pattern.startsWith('*.') && pattern.endsWith('.*')) {
    const middle = pattern.slice(2, -2);
    return filename.includes(`.${middle}.`);
  }
  if (pattern.startsWith('*.')) {
    return filename.endsWith(pattern.slice(1));
  }
  return filename.includes(pattern);
}

function walkDir(dir, extensions, excludePatterns) {
  const results = [];
  let items;
  try { items = fs.readdirSync(dir, { withFileTypes: true }); } catch { return results; }

  for (const item of items) {
    if (item.name.startsWith('.')) continue;
    if (SKIP_DIRS.has(item.name)) continue;

    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      results.push(...walkDir(fullPath, extensions, excludePatterns));
    } else if (extensions.some(ext => item.name.endsWith(ext))) {
      if (excludePatterns.some(pat => matchesPattern(item.name, pat))) continue;
      results.push(fullPath);
    }
  }
  return results;
}

// ---------------------------------------------------------------------------
// Component detection
// ---------------------------------------------------------------------------

function isPascalCase(name) {
  return /^[A-Z][a-zA-Z0-9]*$/.test(name);
}

function fileContainsJSX(content) {
  return /<[A-Z]/.test(content) || /React\.createElement\s*\(/.test(content);
}

function extractExportedComponents(content) {
  const names = new Set();

  const patterns = [
    /export\s+function\s+([A-Z][a-zA-Z0-9]*)\s*[<(]/g,
    /export\s+const\s+([A-Z][a-zA-Z0-9]*)\s*[=:]/g,
    /export\s+default\s+function\s+([A-Z][a-zA-Z0-9]*)/g,
  ];

  for (const re of patterns) {
    let m;
    while ((m = re.exec(content)) !== null) {
      names.add(m[1]);
    }
  }

  const braceExportRe = /export\s*\{([^}]+)\}/g;
  let m;
  while ((m = braceExportRe.exec(content)) !== null) {
    const inner = m[1];
    for (const part of inner.split(',')) {
      let name = part.trim();
      if (name.includes(' as ')) {
        name = name.split(' as ').pop().trim();
      }
      if (isPascalCase(name)) {
        names.add(name);
      }
    }
  }

  if (/export\s+default\s+[A-Z]/.test(content)) {
    const dm = content.match(/export\s+default\s+([A-Z][a-zA-Z0-9]*)\s*;/);
    if (dm) names.add(dm[1]);
  }

  return names;
}

function classifySourceType(relPath, uiPatterns) {
  for (const pat of uiPatterns) {
    const normalized = pat.replace(/\*/g, '');
    if (relPath.includes(normalized)) return 'ui-library';
  }
  return 'project';
}

function discoverComponents(files, cwd, uiPatterns) {
  const components = [];
  const seen = new Set();

  for (const filePath of files) {
    let content;
    try { content = fs.readFileSync(filePath, 'utf8'); } catch { continue; }
    if (!fileContainsJSX(content)) continue;

    const relPath = path.relative(cwd, filePath);
    const sourceType = classifySourceType(relPath, uiPatterns);
    const exportedNames = extractExportedComponents(content);

    for (const name of exportedNames) {
      const key = `${name}::${relPath}`;
      if (seen.has(key)) continue;
      seen.add(key);

      let exportType = 'named';
      if (new RegExp(`export\\s+default\\s+(function\\s+)?${name}\\b`).test(content)) {
        exportType = 'default';
      }

      components.push({ name, path: relPath, sourceType, exportType });
    }
  }

  return components;
}

// ---------------------------------------------------------------------------
// Barrel / re-export map
// ---------------------------------------------------------------------------

const RESOLVE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js'];

function resolveImportPath(fromDir, importPath) {
  for (const ext of RESOLVE_EXTENSIONS) {
    const candidate = path.join(fromDir, importPath + ext);
    if (fs.existsSync(candidate)) return candidate;
  }
  for (const ext of RESOLVE_EXTENSIONS) {
    const candidate = path.join(fromDir, importPath, 'index' + ext);
    if (fs.existsSync(candidate)) return candidate;
  }
  const direct = path.join(fromDir, importPath);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;

  return null;
}

function buildBarrelMap(sourceRoot, cwd, excludePatterns) {
  const allFiles = walkDir(sourceRoot, BARREL_EXTENSIONS, []);
  const indexFiles = allFiles.filter(f => {
    const base = path.basename(f);
    return base === 'index.ts' || base === 'index.tsx' || base === 'index.js' || base === 'index.jsx';
  });

  const barrelMap = {};

  for (const indexFile of indexFiles) {
    let content;
    try { content = fs.readFileSync(indexFile, 'utf8'); } catch { continue; }

    const relIndex = path.relative(cwd, indexFile);
    const dir = path.dirname(indexFile);
    const exports = {};

    const namedRe = /export\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g;
    let m;
    while ((m = namedRe.exec(content)) !== null) {
      const names = m[1].split(',').map(n => n.trim());
      const importPath = m[2];
      const resolved = resolveImportPath(dir, importPath);
      const resolvedRel = resolved ? path.relative(cwd, resolved) : importPath;

      for (const raw of names) {
        if (!raw) continue;
        let name = raw;
        if (name.includes(' as ')) name = name.split(' as ').pop().trim();
        else name = name.trim();
        if (name.startsWith('type ')) continue;
        if (isPascalCase(name)) {
          exports[name] = resolvedRel;
        }
      }
    }

    const wildcardRe = /export\s*\*\s*from\s*['"]([^'"]+)['"]/g;
    while ((m = wildcardRe.exec(content)) !== null) {
      const importPath = m[1];
      const resolved = resolveImportPath(dir, importPath);
      const resolvedRel = resolved ? path.relative(cwd, resolved) : importPath;
      exports['*'] = exports['*'] || [];
      if (Array.isArray(exports['*'])) {
        exports['*'].push(resolvedRel);
      }
    }

    if (Object.keys(exports).length > 0) {
      barrelMap[relIndex] = exports;
    }
  }

  return barrelMap;
}

// ---------------------------------------------------------------------------
// npm component detection
// ---------------------------------------------------------------------------

const NPM_EXCLUDE_PACKAGES = new Set([
  'react', 'react-dom', 'react-dom/client', 'react-dom/server',
  'react/jsx-runtime', 'react/jsx-dev-runtime',
  'react-router', 'react-router-dom', 'react-router/dom',
]);

function isLocalAlias(pkg) {
  return pkg.startsWith('@/') || pkg.startsWith('~/') || pkg.startsWith('#/');
}

function discoverNpmComponents(files, cwd) {
  const npmComponents = new Map();

  for (const filePath of files) {
    let content;
    try { content = fs.readFileSync(filePath, 'utf8'); } catch { continue; }

    const importRe = /import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/g;
    let m;
    while ((m = importRe.exec(content)) !== null) {
      const pkg = m[2];
      if (pkg.startsWith('.') || pkg.startsWith('/')) continue;
      if (isLocalAlias(pkg)) continue;
      if (NPM_EXCLUDE_PACKAGES.has(pkg)) continue;

      const names = m[1].split(',').map(n => n.trim());
      for (const raw of names) {
        if (!raw) continue;
        let name = raw;
        if (name.startsWith('type ')) continue;
        if (name.includes(' as ')) name = name.split(' as ').pop().trim();
        if (!isPascalCase(name)) continue;

        const jsxRe = new RegExp(`<${name}[\\s/>]`);
        if (jsxRe.test(content)) {
          const key = `${name}::${pkg}`;
          if (!npmComponents.has(key)) {
            npmComponents.set(key, { name, package: pkg, sourceType: 'npm', exportType: 'named' });
          }
        }
      }
    }

    const namespaceRe = /import\s*\*\s*as\s+(\w+)\s+from\s*['"]([^'"]+)['"]/g;
    while ((m = namespaceRe.exec(content)) !== null) {
      const alias = m[1];
      const pkg = m[2];
      if (pkg.startsWith('.') || pkg.startsWith('/')) continue;
      if (isLocalAlias(pkg)) continue;
      if (NPM_EXCLUDE_PACKAGES.has(pkg)) continue;

      const memberJsxRe = new RegExp(`<${alias}\\.([A-Z][a-zA-Z0-9]*)`, 'g');
      let mm;
      while ((mm = memberJsxRe.exec(content)) !== null) {
        const memberName = mm[1];
        const fullName = `${alias}.${memberName}`;
        const key = `${fullName}::${pkg}`;
        if (!npmComponents.has(key)) {
          npmComponents.set(key, { name: fullName, package: pkg, sourceType: 'npm', exportType: 'named' });
        }
      }
    }
  }

  return Array.from(npmComponents.values());
}

// ---------------------------------------------------------------------------
// Prop classification
// ---------------------------------------------------------------------------

const VARIANT_PATTERNS = /^(variant|size|state|type|kind|disabled|loading|error|status|open|checked|selected|active|orientation|direction|mode|color|severity|intent|appearance|shape|rounded|elevated|outlined|filled|compact|dense|fullWidth|block|fluid|truncate|wrap|align|justify)$/i;
const TEXT_PATTERNS = /^(label|title|placeholder|message|text|content|description|helperText|children|name|header|footer|caption|subtitle|heading|errorMessage|successMessage|displayValue|defaultValue)$/i;
const DATA_PATTERNS = /^(on[A-Z].*|id|className|style|ref|key|data-.*|aria-.*|role|tabIndex|htmlFor|as|asChild|slot|testId|data)$/;

function classifyProps(filePath, componentName) {
  let content;
  try { content = fs.readFileSync(filePath, 'utf8'); } catch { return null; }

  const propsBlockRe = new RegExp(
    `(?:interface|type)\\s+\\w*Props[^{]*\\{([^}]+(?:\\{[^}]*\\}[^}]*)*)\\}`,
    's'
  );
  const match = content.match(propsBlockRe);
  if (!match) return null;

  const propsBlock = match[1];
  const lines = propsBlock.split('\n');

  const variantProps = [];
  const textProps = [];
  const dataProps = [];
  const confidence = {};

  for (const line of lines) {
    const propMatch = line.match(/^\s*(\w+)\s*[?:]/) ;
    if (!propMatch) continue;
    const propName = propMatch[1];

    if (VARIANT_PATTERNS.test(propName)) {
      variantProps.push(propName);
      confidence[propName] = 0.9;
    } else if (TEXT_PATTERNS.test(propName)) {
      textProps.push(propName);
      confidence[propName] = 0.9;
    } else if (DATA_PATTERNS.test(propName)) {
      dataProps.push(propName);
      confidence[propName] = 0.9;
    }

    if (line.includes("'") && line.includes('|') && !DATA_PATTERNS.test(propName)) {
      if (!variantProps.includes(propName) && !textProps.includes(propName)) {
        variantProps.push(propName);
        confidence[propName] = 0.85;
      }
    }
  }

  if (variantProps.length === 0 && textProps.length === 0 && dataProps.length === 0) {
    return null;
  }

  return { variantProps, textProps, dataProps, confidence };
}

// ---------------------------------------------------------------------------
// Output writers
// ---------------------------------------------------------------------------

function writeComponentsJson(outputDir, projectComps, uiComps, npmComps) {
  const components = [
    ...projectComps.map(c => ({ name: c.name, path: c.path, sourceType: c.sourceType, exportType: c.exportType })),
    ...uiComps.map(c => ({ name: c.name, path: c.path, sourceType: c.sourceType, exportType: c.exportType })),
    ...npmComps.map(c => ({ name: c.name, path: c.package, sourceType: c.sourceType, exportType: c.exportType })),
  ];

  const output = {
    schemaVersion: 'react-to-figma-components@1',
    discoveryMethod: 'static-analysis',
    componentCount: components.length,
    components,
  };

  fs.writeFileSync(path.join(outputDir, 'components.json'), JSON.stringify(output, null, 2));
}

function writeBarrelMap(outputDir, barrelMap) {
  let out = '# Barrel Re-export Map\n';

  for (const [indexPath, exports] of Object.entries(barrelMap)) {
    if (Object.keys(exports).length === 0) continue;
    out += `\n## ${indexPath}\n`;
    for (const [name, target] of Object.entries(exports)) {
      if (name === '*' && Array.isArray(target)) {
        for (const t of target) {
          out += `- * → ${t}\n`;
        }
      } else {
        out += `- ${name} → ${target}\n`;
      }
    }
  }

  fs.writeFileSync(path.join(outputDir, 'barrel-map.md'), out);
}

function writePropClassification(outputDir, allComponents, cwd) {
  const classification = {
    generatedAt: new Date().toISOString(),
    components: {},
  };

  for (const comp of allComponents) {
    if (comp.sourceType === 'npm') continue;
    const filePath = path.join(cwd, comp.path);
    const result = classifyProps(filePath, comp.name);
    if (result) {
      classification.components[comp.name] = result;
    }
  }

  fs.writeFileSync(
    path.join(outputDir, 'prop-classification.json'),
    JSON.stringify(classification, null, 2)
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const opts = parseArgs();
  const cwd = process.cwd();

  fs.mkdirSync(opts.outputDir, { recursive: true });

  console.log(`Scanning ${opts.sourceRoot} ...`);

  const componentFiles = walkDir(opts.sourceRoot, COMPONENT_EXTENSIONS, opts.excludePatterns);
  console.log(`Found ${componentFiles.length} candidate files`);

  const allDiscovered = discoverComponents(componentFiles, cwd, opts.uiPatterns);
  const projectComps = allDiscovered.filter(c => c.sourceType === 'project');
  const uiComps = allDiscovered.filter(c => c.sourceType === 'ui-library');

  const npmComps = discoverNpmComponents(componentFiles, cwd);

  const barrelMap = buildBarrelMap(opts.sourceRoot, cwd, opts.excludePatterns);

  writeComponentsJson(opts.outputDir, projectComps, uiComps, npmComps);
  writeBarrelMap(opts.outputDir, barrelMap);
  writePropClassification(opts.outputDir, allDiscovered, cwd);

  const barrelCount = Object.keys(barrelMap).length;
  console.log(`\nDiscovery complete.`);
  console.log(`- Project components: ${projectComps.length}`);
  console.log(`- UI library components: ${uiComps.length}`);
  console.log(`- npm components: ${npmComps.length}`);
  console.log(`- Barrel files mapped: ${barrelCount}`);
  console.log(`- Output: ${opts.outputDir}`);
}

main();
