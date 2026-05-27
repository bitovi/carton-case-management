#!/usr/bin/env node

/**
 * extract-icons.js — Extract icon SVGs and per-component usage from the codebase.
 *
 * Scans all .tsx/.ts files for lucide-react imports, extracts SVG data from
 * node_modules, normalizes for Figma consumption, and maps icons to components.
 *
 * Adopted from figma-from-code branch patterns:
 *   - SVG string extraction ready for figma.createNodeFromSvg()
 *   - Per-component icon mapping (iconsByComponent)
 *   - Figma-convention naming: Icon/{PascalName}
 *
 * Usage:
 *   node extract-icons.js <clientSrcDir> [--output <dir>]
 *
 * Examples:
 *   node extract-icons.js packages/client/src
 *   node extract-icons.js packages/client/src --output .temp/react-to-figma
 *
 * Output:
 *   <output>/icons.json              — Machine-readable icon data + per-component mapping
 *   <output>/assets/icons.md         — Human-readable icon inventory table
 *   <output>/assets/icons/<Name>.svg — Individual normalized SVG files
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_OUTPUT_DIR = '.temp/react-to-figma';

function parseArgs() {
  const args = process.argv.slice(2);
  const config = { sourceDir: null, outputDir: DEFAULT_OUTPUT_DIR };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output' && args[i + 1]) {
      config.outputDir = args[i + 1];
      i++;
    } else if (!config.sourceDir) {
      config.sourceDir = args[i];
    }
  }

  if (!config.sourceDir) {
    console.error('Usage: node extract-icons.js <clientSrcDir> [--output <dir>]');
    console.error('Example: node extract-icons.js packages/client/src');
    process.exit(1);
  }

  return config;
}

function pascalToKebab(name) {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-zA-Z])(\d)/g, '$1-$2')
    .replace(/(\d)([a-zA-Z])/g, '$1-$2')
    .toLowerCase();
}

function findTsxFiles(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.temp') continue;
      findTsxFiles(fullPath, results);
    } else if (/\.(tsx?|jsx?)$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function scanForLucideImports(files) {
  const iconUsage = {};
  const importRegex =
    /import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"]/g;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    let match;
    importRegex.lastIndex = 0;
    while ((match = importRegex.exec(content)) !== null) {
      const imports = match[1].split(',').map((s) => s.trim());
      for (let imp of imports) {
        const aliasMatch = imp.match(/^(\w+)\s+as\s+(\w+)$/);
        const iconName = aliasMatch ? aliasMatch[1] : imp;
        if (!iconName || iconName === 'LucideIcon' || iconName === 'LucideProps')
          continue;

        if (!iconUsage[iconName]) {
          iconUsage[iconName] = { usedIn: [], usageCount: 0 };
        }
        const componentName = path.basename(path.dirname(file));
        const fileName = path.basename(file, path.extname(file));
        const label =
          componentName !== 'src' ? componentName : fileName;
        if (!iconUsage[iconName].usedIn.includes(label)) {
          iconUsage[iconName].usedIn.push(label);
        }
        iconUsage[iconName].usageCount++;
      }
    }
  }

  return iconUsage;
}

function elementToSvgString(tag, attrs) {
  const attrStr = Object.entries(attrs)
    .filter(([k]) => k !== 'key')
    .map(([k, v]) => {
      const svgAttr = k.replace(/([A-Z])/g, (m) => '-' + m.toLowerCase());
      return `${svgAttr}="${v}"`;
    })
    .join(' ');
  if (tag === 'circle' || tag === 'line' || tag === 'path' || tag === 'polyline' || tag === 'ellipse') {
    return `<${tag} ${attrStr} />`;
  }
  return `<${tag} ${attrStr} />`;
}

function extractSvgFromIconModule(iconName, projectRoot) {
  const kebabName = pascalToKebab(iconName);
  const esmDir = path.join(
    projectRoot,
    'node_modules',
    'lucide-react',
    'dist',
    'esm',
    'icons'
  );

  const tryFiles = [
    path.join(esmDir, `${kebabName}.js`),
    path.join(esmDir, `${iconName.toLowerCase()}.js`),
  ];

  for (const filePath of tryFiles) {
    if (!fs.existsSync(filePath)) continue;
    const result = resolveIconFile(filePath, esmDir, 0);
    if (result) return result;
  }

  return null;
}

function resolveIconFile(filePath, esmDir, depth) {
  if (depth > 5) return null;
  const content = fs.readFileSync(filePath, 'utf-8');

  const reExportMatch = content.match(
    /export\s*\{\s*default\s*\}\s*from\s*['"]\.\/([\w-]+)\.js['"]/
  );
  if (reExportMatch) {
    const targetFile = path.join(esmDir, `${reExportMatch[1]}.js`);
    if (fs.existsSync(targetFile)) {
      return resolveIconFile(targetFile, esmDir, depth + 1);
    }
  }

  return parseLucideModule(filePath);

  return null;
}

function parseLucideModule(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  const arrayMatch = content.match(
    /createLucideIcon\(\s*"[^"]+"\s*,\s*(\[[\s\S]*?\])\s*\)/
  );
  if (!arrayMatch) return null;

  try {
    const elementsStr = arrayMatch[1]
      .replace(/key:\s*"[^"]*"/g, '')
      .replace(/,\s*\}/g, '}')
      .replace(/,\s*]/g, ']');

    const elements = parseIconElements(elementsStr);
    if (!elements) return null;

    const innerSvg = elements
      .map(([tag, attrs]) => elementToSvgString(tag, attrs))
      .join('\n  ');

    const svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">',
      `  ${innerSvg}`,
      '</svg>',
    ].join('\n');

    return svg;
  } catch {
    return null;
  }
}

function parseIconElements(str) {
  try {
    const normalized = str
      .replace(/(['"])?(\w+)\1\s*:/g, '"$2":')
      .replace(/'/g, '"')
      .replace(/"key"\s*:\s*"[^"]*"\s*,?\s*/g, '')
      .replace(/,\s*\}/g, '}')
      .replace(/,\s*]/g, ']');

    const parsed = JSON.parse(normalized);
    return parsed;
  } catch {
    return parseIconElementsManual(str);
  }
}

function parseIconElementsManual(str) {
  const elements = [];
  const elementRegex =
    /\[\s*"(\w+)"\s*,\s*\{([^}]*)\}\s*\]/g;
  let match;
  while ((match = elementRegex.exec(str)) !== null) {
    const tag = match[1];
    const attrsStr = match[2];
    const attrs = {};

    const attrRegex = /(\w+)\s*:\s*"([^"]*)"/g;
    let attrMatch;
    while ((attrMatch = attrRegex.exec(attrsStr)) !== null) {
      if (attrMatch[1] !== 'key') {
        attrs[attrMatch[1]] = attrMatch[2];
      }
    }

    elements.push([tag, attrs]);
  }

  return elements.length > 0 ? elements : null;
}

function main() {
  const config = parseArgs();
  const sourceDir = path.resolve(config.sourceDir);
  const outputDir = path.resolve(config.outputDir);
  const projectRoot = path.resolve('.');

  console.error(`Scanning ${sourceDir} for lucide-react imports...`);
  const files = findTsxFiles(sourceDir);
  console.error(`  Found ${files.length} source files`);

  const iconUsage = scanForLucideImports(files);
  const iconNames = Object.keys(iconUsage).sort();
  console.error(`  Found ${iconNames.length} unique icons`);

  const iconsDir = path.join(outputDir, 'assets', 'icons');
  fs.mkdirSync(iconsDir, { recursive: true });

  const icons = [];
  let svgCount = 0;

  for (const name of iconNames) {
    const svg = extractSvgFromIconModule(name, projectRoot);
    const figmaName = `Icon/${name}`;

    const icon = {
      name,
      figmaName,
      kebabName: pascalToKebab(name),
      svgString: svg,
      usedIn: iconUsage[name].usedIn,
      usageCount: iconUsage[name].usageCount,
    };
    icons.push(icon);

    if (svg) {
      const svgPath = path.join(iconsDir, `${name}.svg`);
      fs.writeFileSync(svgPath, svg);
      svgCount++;
    }
  }

  const iconsByComponent = {};
  for (const icon of icons) {
    for (const comp of icon.usedIn) {
      if (!iconsByComponent[comp]) {
        iconsByComponent[comp] = [];
      }
      iconsByComponent[comp].push(icon.name);
    }
  }

  const iconsJson = {
    schemaVersion: 'react-to-figma-icons@1',
    extractedAt: new Date().toISOString(),
    iconLibrary: 'lucide-react',
    summary: {
      totalIcons: icons.length,
      svgsExtracted: svgCount,
      componentsCovered: Object.keys(iconsByComponent).length,
    },
    icons,
    iconsByComponent,
  };

  const iconsJsonPath = path.join(outputDir, 'icons.json');
  fs.writeFileSync(iconsJsonPath, JSON.stringify(iconsJson, null, 2));
  console.error(`  icons.json: ${icons.length} icons`);

  const mdLines = [];
  mdLines.push('# Icon Inventory\n');
  mdLines.push(`**Icon library**: lucide-react`);
  mdLines.push(`**Total icons used**: ${icons.length}`);
  mdLines.push(`**SVGs extracted**: ${svgCount}\n`);
  mdLines.push('## Icons\n');
  mdLines.push('| Icon | Figma Name | Used In | Usage Count | SVG |');
  mdLines.push('|---|---|---|---|---|');
  for (const icon of icons) {
    const usedIn = icon.usedIn.join(', ');
    const hasSvg = icon.svgString ? `\`icons/${icon.name}.svg\`` : '—';
    mdLines.push(
      `| ${icon.name} | ${icon.figmaName} | ${usedIn} | ${icon.usageCount} | ${hasSvg} |`
    );
  }
  mdLines.push('\n## Icons by Component\n');
  mdLines.push('| Component | Icons |');
  mdLines.push('|---|---|');
  for (const [comp, compIcons] of Object.entries(iconsByComponent).sort()) {
    mdLines.push(`| ${comp} | ${compIcons.join(', ')} |`);
  }

  const mdPath = path.join(outputDir, 'assets', 'icons.md');
  fs.writeFileSync(mdPath, mdLines.join('\n'));
  console.error(`  assets/icons.md: written`);
  console.error(`  assets/icons/: ${svgCount} SVG files`);

  console.log(
    JSON.stringify(
      {
        status: 'ok',
        icons: icons.length,
        svgsExtracted: svgCount,
        componentsCovered: Object.keys(iconsByComponent).length,
        files: [iconsJsonPath, mdPath, iconsDir],
      },
      null,
      2
    )
  );
}

main();
