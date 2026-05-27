#!/usr/bin/env node

/**
 * extract-children.js
 *
 * Fast static extraction of parent-child component relationships.
 * Reads components-todo.md, scans each source file for PascalCase JSX elements,
 * and outputs children-graph.json + minimal analysis.md per component.
 *
 * This replaces the slow per-component subagent calls (step 1.4) for the purpose
 * of generating build order. Props extraction is deferred to Phase 6.1.
 *
 * Usage:
 *   node extract-children.js \
 *     --components-todo .temp/react-to-figma/component-hierarchy/components-todo.md \
 *     --output-dir .temp/react-to-figma \
 *     [--source-root packages/client/src]
 *
 * Outputs:
 *   - {output-dir}/component-hierarchy/children-graph.json
 *   - {output-dir}/components/{Name}/analysis.md (minimal, for each component)
 */

const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = { componentsTodo: null, outputDir: null, sourceRoot: null };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--components-todo': opts.componentsTodo = args[++i]; break;
      case '--output-dir':      opts.outputDir = args[++i]; break;
      case '--source-root':     opts.sourceRoot = args[++i]; break;
      case '--help':            printUsage(); process.exit(0);
      default:
        console.error(`Unknown argument: ${args[i]}`);
        printUsage();
        process.exit(1);
    }
  }

  if (!opts.componentsTodo || !opts.outputDir) {
    console.error('Error: --components-todo and --output-dir are required.');
    printUsage();
    process.exit(1);
  }

  return opts;
}

function printUsage() {
  console.error(`
Usage: node extract-children.js --components-todo <file> --output-dir <dir> [--source-root <dir>]

Required:
  --components-todo <file>  Path to components-todo.md
  --output-dir <dir>        Pipeline output directory (e.g., .temp/react-to-figma)

Optional:
  --source-root <dir>       Source root for resolving relative paths
  --help                    Show this help
`.trim());
}

function parseComponentsTodo(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const components = [];
  const lineRe = /^- \[[ x]\] (.+?) \| (.+?) \| (.+?) \| .+? \| .+$/gm;
  let match;
  while ((match = lineRe.exec(content)) !== null) {
    components.push({
      name: match[1].trim(),
      path: match[2].trim(),
      sourceType: match[3].trim(),
    });
  }
  return components;
}

function removeComments(source) {
  let result = source;
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  result = result.replace(/\/\/.*$/gm, '');
  return result;
}

function removeStringLiterals(source) {
  return source
    .replace(/`(?:[^`\\]|\\.)*`/g, '""')
    .replace(/"(?:[^"\\]|\\.)*"/g, '""')
    .replace(/'(?:[^'\\]|\\.)*'/g, '""');
}

function removeTypeAnnotations(source) {
  let result = source;
  result = result.replace(/:\s*React\.[A-Z][A-Za-z0-9<>,\s|&\[\]]*(?=[,;)\s=}])/g, '');
  result = result.replace(/<(?:[A-Z][A-Za-z0-9]*(?:\s*,\s*[A-Z][A-Za-z0-9]*)*)>/g, '');
  return result;
}

function extractJsxReturn(source) {
  const returnRe = /return\s*\(/g;
  const regions = [];
  let match;
  while ((match = returnRe.exec(source)) !== null) {
    const start = match.index + match[0].length;
    let depth = 1;
    let i = start;
    while (i < source.length && depth > 0) {
      if (source[i] === '(') depth++;
      else if (source[i] === ')') depth--;
      i++;
    }
    if (depth === 0) {
      regions.push(source.slice(start, i - 1));
    }
  }

  const arrowJsxRe = /=>\s*(\([^)]*<[A-Z])/g;
  while ((match = arrowJsxRe.exec(source)) !== null) {
    const start = match.index + match[0].indexOf('(') + 1;
    let depth = 1;
    let i = start + 1;
    while (i < source.length && depth > 0) {
      if (source[i] === '(') depth++;
      else if (source[i] === ')') depth--;
      i++;
    }
    if (depth === 0) {
      regions.push(source.slice(start, i - 1));
    }
  }

  return regions.join('\n');
}

function isolateComponentBody(source, componentName) {
  const patterns = [
    new RegExp(`(?:export\\s+)?(?:const|let)\\s+${componentName}\\s*[=:]`),
    new RegExp(`(?:export\\s+)?function\\s+${componentName}\\s*[<(]`),
    new RegExp(`(?:export\\s+default\\s+)?function\\s+${componentName}\\s*[<(]`),
  ];

  let startIdx = -1;
  for (const pat of patterns) {
    const m = pat.exec(source);
    if (m) {
      startIdx = m.index;
      break;
    }
  }

  if (startIdx === -1) return null;

  const nextDeclRe = /\n(?:export\s+(?:const|let|function|default)|(?:const|let|function)\s+[A-Z])/g;
  nextDeclRe.lastIndex = startIdx + 1;
  const nextDecl = nextDeclRe.exec(source);
  const endIdx = nextDecl ? nextDecl.index : source.length;

  return source.slice(startIdx, endIdx);
}

function extractChildren(sourceContent, componentName) {
  const cleaned = removeStringLiterals(removeComments(sourceContent));

  const componentBody = isolateComponentBody(cleaned, componentName);
  if (!componentBody) {
    return [];
  }
  const jsxRegion = extractJsxReturn(componentBody) || componentBody;

  const jsxTagRe = /<([A-Z][A-Za-z0-9]*(?:\.[A-Z][A-Za-z0-9]*)?)\s/g;
  const selfClosingRe = /<([A-Z][A-Za-z0-9]*(?:\.[A-Z][A-Za-z0-9]*)?)\s*\/>/g;
  const children = new Set();

  let match;
  while ((match = jsxTagRe.exec(jsxRegion)) !== null) {
    const name = match[1];
    if (name !== componentName) {
      children.add(name);
    }
  }
  while ((match = selfClosingRe.exec(jsxRegion)) !== null) {
    const name = match[1];
    if (name !== componentName) {
      children.add(name);
    }
  }

  const openTagRe = /<([A-Z][A-Za-z0-9]*(?:\.[A-Z][A-Za-z0-9]*)?)>/g;
  while ((match = openTagRe.exec(jsxRegion)) !== null) {
    const name = match[1];
    if (name !== componentName) {
      children.add(name);
    }
  }

  return Array.from(children).sort();
}

function detectRelationship(sourceContent, childName) {
  const cleaned = removeComments(sourceContent);
  const childEscaped = childName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const tagPattern = new RegExp(`<${childEscaped}[\\s/>]`);

  const lines = cleaned.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (tagPattern.test(lines[i])) {
      const context = lines.slice(Math.max(0, i - 3), i + 1).join('\n');

      if (/\.map\s*\(/.test(context) || /\.flatMap\s*\(/.test(context)) {
        return 'list';
      }
      if (/&&\s*$/.test(lines.slice(Math.max(0, i - 2), i).join('\n')) ||
          /\?\s*$/.test(lines.slice(Math.max(0, i - 2), i).join('\n')) ||
          /{\s*\w+\s*&&/.test(context) ||
          /{\s*\w+\s*\?/.test(context)) {
        return 'conditional';
      }
    }
  }
  return 'renders';
}

function detectWrapsChildren(sourceContent) {
  const cleaned = removeComments(sourceContent);
  return /\{.*children.*\}/.test(cleaned) && /props.*children|{\s*children\s*}|children\s*[:,]/.test(cleaned);
}

function writeAnalysisMd(outputDir, componentName, sourcePath, sourceType, childrenWithRelationships, wrapsChildren) {
  const componentDir = path.join(outputDir, 'components', componentName);
  fs.mkdirSync(componentDir, { recursive: true });

  const isLeaf = childrenWithRelationships.length === 0;
  let md = `# ${componentName} Analysis\n\n`;
  md += `**Source**: \`${sourcePath}\`\n`;
  md += `**Source type**: ${sourceType}\n`;
  md += `**Leaf**: ${isLeaf}\n\n`;
  md += `## Rendered Children\n\n`;

  if (isLeaf) {
    md += `None — this is a leaf component.\n`;
  } else {
    md += `| Child | Relationship | Props Passed | Condition | List | Slot |\n`;
    md += `|-------|-------------|-------------|-----------|------|------|\n`;
    for (const { name, relationship } of childrenWithRelationships) {
      const condition = relationship === 'conditional' ? '(detected)' : 'always';
      const list = relationship === 'list' ? '.map()' : '—';
      md += `| ${name} | ${relationship} | (static extraction) | ${condition} | ${list} | children |\n`;
    }
  }

  md += `\n## Wraps Children\n\n`;
  md += wrapsChildren ? `yes` : `no`;
  md += `\n\n## Notes\n\nExtracted via static analysis (extract-children.js). Props and detailed slot info deferred to Phase 6.1.\n`;

  fs.writeFileSync(path.join(componentDir, 'analysis.md'), md);
}

function main() {
  const opts = parseArgs();
  const components = parseComponentsTodo(opts.componentsTodo);

  if (components.length === 0) {
    console.error('Error: No components found in components-todo.md');
    process.exit(1);
  }

  console.log(`Found ${components.length} components to analyze`);

  const graph = {};
  let leafCount = 0;
  let errorCount = 0;

  const projectRoot = process.cwd();

  for (const comp of components) {
    const filePath = path.resolve(projectRoot, comp.path);

    let sourceContent;
    try {
      sourceContent = fs.readFileSync(filePath, 'utf8');
    } catch (err) {
      console.warn(`  WARN: Cannot read ${comp.name} at ${filePath}: ${err.message}`);
      graph[comp.name] = { path: comp.path, sourceType: comp.sourceType, leaf: true, children: [] };
      errorCount++;
      continue;
    }

    const children = extractChildren(sourceContent, comp.name);

    const knownNames = new Set(components.map(c => c.name));
    const relevantChildren = children.filter(c => {
      const baseName = c.includes('.') ? c.split('.')[0] : c;
      return knownNames.has(c) || knownNames.has(baseName);
    });

    const componentBody = isolateComponentBody(removeStringLiterals(removeComments(sourceContent)), comp.name) || sourceContent;

    const childrenWithRelationships = relevantChildren.map(childName => ({
      name: childName,
      relationship: detectRelationship(componentBody, childName),
    }));

    const isLeaf = relevantChildren.length === 0;
    if (isLeaf) leafCount++;

    const wrapsChildren = detectWrapsChildren(componentBody);

    graph[comp.name] = {
      path: comp.path,
      sourceType: comp.sourceType,
      leaf: isLeaf,
      children: relevantChildren,
    };

    writeAnalysisMd(opts.outputDir, comp.name, comp.path, comp.sourceType, childrenWithRelationships, wrapsChildren);
  }

  const outputPath = path.join(opts.outputDir, 'component-hierarchy', 'children-graph.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify({
    schemaVersion: 'react-to-figma-children-graph@1',
    generatedAt: new Date().toISOString(),
    generatedBy: 'extract-children.js',
    componentCount: components.length,
    leafCount,
    errorCount,
    components: graph,
  }, null, 2));

  console.log(`\nComplete:`);
  console.log(`  Components analyzed: ${components.length}`);
  console.log(`  Leaves: ${leafCount}`);
  console.log(`  Errors: ${errorCount}`);
  console.log(`  Output: ${outputPath}`);
  console.log(`  Analysis files: ${opts.outputDir}/components/*/analysis.md`);
}

main();
