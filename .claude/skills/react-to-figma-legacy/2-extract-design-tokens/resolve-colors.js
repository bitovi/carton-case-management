#!/usr/bin/env node

/**
 * resolve-colors.js — Pre-compute all design tokens for Figma variable creation.
 *
 * Reads index.css (CSS custom properties) and tailwind.config.js (theme extensions)
 * to produce machine-readable JSON + human-readable markdown of every design token
 * with resolved values, Figma variable paths, and scoping metadata.
 *
 * Adopted from figma-from-code branch patterns:
 *   - Pre-computed color resolution (eliminates LLM color-space math during builds)
 *   - CSS-variable-name → Figma-variable-ID lookup map
 *   - Scope-aware variable creation (FRAME_FILL, TEXT_FILL, STROKE_COLOR, etc.)
 *   - Three-collection model: Palette, Semantic, Numbers
 *
 * Usage:
 *   node resolve-colors.js <clientSrcDir> [--output <dir>]
 *
 * Examples:
 *   node resolve-colors.js packages/client/src
 *   node resolve-colors.js packages/client/src --output .temp/react-to-figma
 *
 * Output:
 *   <output>/design-tokens.json    — Machine-readable token data
 *   <output>/design-tokens.md      — Human-readable tables
 *   <output>/css-figma-map.json    — CSS variable/class → Figma variable path lookup
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
    console.error('Usage: node resolve-colors.js <clientSrcDir> [--output <dir>]');
    console.error('Example: node resolve-colors.js packages/client/src');
    process.exit(1);
  }

  return config;
}

function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * Math.max(0, Math.min(1, color)))
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function resolveColorValue(raw) {
  const trimmed = raw.trim();

  if (/^#[0-9a-fA-F]{3,8}$/.test(trimmed)) {
    if (trimmed.length === 4) {
      const [, r, g, b] = trimmed;
      return { hex: `#${r}${r}${g}${g}${b}${b}`, opacity: 1, raw: trimmed };
    }
    if (trimmed.length === 9) {
      const hex = trimmed.slice(0, 7);
      const alpha = parseInt(trimmed.slice(7), 16) / 255;
      return { hex, opacity: parseFloat(alpha.toFixed(3)), raw: trimmed };
    }
    return { hex: trimmed.toLowerCase(), opacity: 1, raw: trimmed };
  }

  const hslMatch = trimmed.match(
    /^hsl\(\s*([\d.]+)\s*,?\s*([\d.]+)%?\s*,?\s*([\d.]+)%?\s*(?:\/\s*([\d.]+%?))?\)$/
  );
  if (hslMatch) {
    const h = parseFloat(hslMatch[1]);
    const s = parseFloat(hslMatch[2]);
    const l = parseFloat(hslMatch[3]);
    let opacity = 1;
    if (hslMatch[4]) {
      opacity = hslMatch[4].endsWith('%')
        ? parseFloat(hslMatch[4]) / 100
        : parseFloat(hslMatch[4]);
    }
    return { hex: hslToHex(h, s, l), opacity, raw: trimmed };
  }

  const hslSpaceMatch = trimmed.match(
    /^([\d.]+)\s+([\d.]+)%?\s+([\d.]+)%?$/
  );
  if (hslSpaceMatch) {
    const h = parseFloat(hslSpaceMatch[1]);
    const s = parseFloat(hslSpaceMatch[2]);
    const l = parseFloat(hslSpaceMatch[3]);
    return { hex: hslToHex(h, s, l), opacity: 1, raw: trimmed };
  }

  const rgbMatch = trimmed.match(
    /^rgb\(\s*(\d+)\s*,?\s*(\d+)\s*,?\s*(\d+)\s*(?:\/\s*([\d.]+%?))?\)$/
  );
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
    const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
    const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0');
    let opacity = 1;
    if (rgbMatch[4]) {
      opacity = rgbMatch[4].endsWith('%')
        ? parseFloat(rgbMatch[4]) / 100
        : parseFloat(rgbMatch[4]);
    }
    return { hex: `#${r}${g}${b}`, opacity, raw: trimmed };
  }

  return null;
}

function remToPx(rem) {
  return parseFloat(rem) * 16;
}

function resolveCalc(expr) {
  const cleaned = expr.replace(/calc\(/, '').replace(/\)$/, '').trim();
  const subMatch = cleaned.match(/var\(--radius\)\s*-\s*([\d.]+)px/);
  if (subMatch) {
    return 8 - parseFloat(subMatch[1]);
  }
  const remSub = cleaned.match(/([\d.]+)rem\s*-\s*([\d.]+)px/);
  if (remSub) {
    return remToPx(remSub[1]) - parseFloat(remSub[2]);
  }
  return null;
}

const PALETTE_FAMILIES = [
  'gray', 'teal', 'orange', 'green', 'yellow', 'violet', 'blue', 'pink',
];

const SEMANTIC_COLOR_VARS = [
  'background', 'foreground', 'primary', 'primary-foreground',
  'secondary', 'secondary-foreground', 'muted', 'muted-foreground',
  'accent', 'accent-foreground', 'destructive', 'border', 'input',
  'popover', 'popover-foreground', 'card', 'card-foreground',
  'ring', 'ring-error',
  'sidebar', 'sidebar-foreground', 'sidebar-accent', 'sidebar-accent-foreground',
  'sidebar-primary', 'sidebar-primary-foreground', 'sidebar-border', 'sidebar-ring',
  'border-0', 'border-1', 'border-3', 'border-4', 'border-5',
  'accent-0', 'accent-2', 'accent-3',
  'primary-hover', 'secondary-hover',
  'ghost', 'ghost-hover', 'ghost-foreground',
  'destructive-foreground', 'destructive-subtle', 'destructive-border',
  'outline', 'outline-hover', 'outline-active',
  'backdrop', 'mid-alt', 'foreground-alt', 'body-background',
  'header-bg', 'menu-bg', 'menu-item-bg', 'menu-item-hover',
  'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5',
];

function categorizeCssVar(name) {
  for (const family of PALETTE_FAMILIES) {
    if (name.startsWith(`${family}-`) && /\d+$/.test(name)) {
      return 'palette';
    }
  }
  if (name === 'white') return 'palette';
  if (name.startsWith('radius')) return 'border-radius';
  if (SEMANTIC_COLOR_VARS.includes(name)) return 'semantic';
  return 'other';
}

function figmaPath(category, varName) {
  if (category === 'palette') {
    if (varName === 'white') return 'Palette/white';
    const parts = varName.match(/^(\w+)-(\d+)$/);
    if (parts) return `Palette/${parts[1]}/${parts[2]}`;
    return `Palette/${varName}`;
  }
  if (category === 'semantic') {
    if (varName.startsWith('chart-')) return `Semantic/chart/${varName.replace('chart-', '')}`;
    if (varName.startsWith('sidebar-')) return `Semantic/sidebar/${varName.replace('sidebar-', '')}`;
    if (varName.startsWith('border-') && /\d$/.test(varName)) return `Semantic/border/${varName.replace('border-', '')}`;
    if (varName.startsWith('accent-') && /\d$/.test(varName)) return `Semantic/accent/${varName.replace('accent-', '')}`;
    return `Semantic/${varName}`;
  }
  if (category === 'border-radius') {
    const suffix = varName.replace('radius-', '').replace('radius', 'default');
    return `Numbers/border-radius/${suffix}`;
  }
  return `Other/${varName}`;
}

function figmaScoping(category) {
  if (category === 'palette') {
    return ['ALL_FILLS', 'STROKE_COLOR'];
  }
  if (category === 'semantic') {
    return ['FRAME_FILL', 'SHAPE_FILL', 'TEXT_FILL', 'STROKE_COLOR'];
  }
  if (category === 'border-radius') {
    return ['CORNER_RADIUS'];
  }
  return [];
}

function figmaCollection(category) {
  if (category === 'palette') return 'Palette';
  if (category === 'semantic') return 'Semantic';
  if (category === 'border-radius') return 'Numbers';
  return 'Other';
}

function figmaType(category) {
  if (category === 'palette' || category === 'semantic') return 'COLOR';
  if (category === 'border-radius') return 'FLOAT';
  return 'STRING';
}

function parseCssVariables(cssContent) {
  const tokens = [];
  const rootBlockMatch = cssContent.match(/:root\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/s);
  if (!rootBlockMatch) return tokens;

  const block = rootBlockMatch[1];
  const varRegex = /--([\w-]+)\s*:\s*([^;]+);/g;
  let match;
  while ((match = varRegex.exec(block)) !== null) {
    const name = match[1];
    const rawValue = match[2].trim();

    const commentMatch = rawValue.match(/^(.+?)(?:\s*\/\*.*\*\/)?\s*$/);
    const value = commentMatch ? commentMatch[1].trim() : rawValue;

    const category = categorizeCssVar(name);
    const resolved = resolveColorValue(value);

    let resolvedPx = null;
    if (category === 'border-radius') {
      if (value === '0') {
        resolvedPx = 0;
      } else if (value.endsWith('rem')) {
        resolvedPx = remToPx(value);
      } else if (value.endsWith('px')) {
        resolvedPx = parseFloat(value);
      }
    }

    tokens.push({
      cssVar: `--${name}`,
      name,
      rawValue: value,
      category,
      figmaCollection: figmaCollection(category),
      figmaPath: figmaPath(category, name),
      figmaType: figmaType(category),
      figmaScoping: figmaScoping(category),
      resolved: resolved
        ? { hex: resolved.hex, opacity: resolved.opacity }
        : null,
      resolvedPx,
    });
  }

  return tokens;
}

function parseTailwindExtensions() {
  const shadows = [
    {
      name: 'xs',
      value: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      figmaPath: 'Effects/shadow/xs',
    },
  ];

  const borderRadius = [
    {
      name: 'lg',
      value: 'var(--radius)',
      resolvedPx: 8,
      figmaPath: 'Numbers/border-radius/lg',
    },
    {
      name: 'md',
      value: 'calc(var(--radius) - 2px)',
      resolvedPx: 6,
      figmaPath: 'Numbers/border-radius/md-tw',
    },
    {
      name: 'sm',
      value: 'calc(var(--radius) - 4px)',
      resolvedPx: 4,
      figmaPath: 'Numbers/border-radius/sm-tw',
    },
  ];

  const typography = [
    { name: 'xs', property: 'fontSize', value: '0.75rem', resolvedPx: 12 },
    { name: 'sm', property: 'fontSize', value: '0.875rem', resolvedPx: 14 },
    { name: 'base', property: 'fontSize', value: '1rem', resolvedPx: 16 },
    { name: 'lg', property: 'fontSize', value: '1.125rem', resolvedPx: 18 },
    { name: 'xl', property: 'fontSize', value: '1.25rem', resolvedPx: 20 },
    { name: '2xl', property: 'fontSize', value: '1.5rem', resolvedPx: 24 },
    { name: '3xl', property: 'fontSize', value: '1.875rem', resolvedPx: 30 },
    { name: '4xl', property: 'fontSize', value: '2.25rem', resolvedPx: 36 },
  ];

  const fontWeights = [
    { name: 'thin', value: 100 },
    { name: 'extralight', value: 200 },
    { name: 'light', value: 300 },
    { name: 'normal', value: 400 },
    { name: 'medium', value: 500 },
    { name: 'semibold', value: 600 },
    { name: 'bold', value: 700 },
    { name: 'extrabold', value: 800 },
    { name: 'black', value: 900 },
  ];

  return { shadows, borderRadius, typography, fontWeights };
}

function buildCssFigmaMap(tokens, tailwindExtensions) {
  const map = {};

  for (const token of tokens) {
    map[`var(--${token.name})`] = token.figmaPath;
    map[`--${token.name}`] = token.figmaPath;

    if (token.category === 'palette') {
      const parts = token.name.match(/^(\w+)-(\d+)$/);
      if (parts) {
        map[`bg-${parts[1]}-${parts[2]}`] = token.figmaPath;
        map[`text-${parts[1]}-${parts[2]}`] = token.figmaPath;
        map[`border-${parts[1]}-${parts[2]}`] = token.figmaPath;
      }
    }

    if (token.category === 'semantic') {
      map[`bg-${token.name}`] = token.figmaPath;
      map[`text-${token.name}`] = token.figmaPath;
      map[`border-${token.name}`] = token.figmaPath;
    }
  }

  for (const br of tailwindExtensions.borderRadius) {
    map[`rounded-${br.name}`] = br.figmaPath;
  }

  for (const t of tailwindExtensions.typography) {
    map[`text-${t.name}`] = `Typography/font-size/${t.name}`;
  }

  for (const fw of tailwindExtensions.fontWeights) {
    map[`font-${fw.name}`] = `Typography/font-weight/${fw.name}`;
  }

  for (const s of tailwindExtensions.shadows) {
    map[`shadow-${s.name}`] = s.figmaPath;
  }

  return map;
}

function generateMarkdown(tokens, tailwindExtensions) {
  const lines = [];
  lines.push('# Design Tokens\n');
  lines.push('**Source framework**: Tailwind CSS + CSS Custom Properties');
  lines.push('**Token file**: `src/index.css`\n');

  const paletteTokens = tokens.filter((t) => t.category === 'palette');
  const semanticTokens = tokens.filter((t) => t.category === 'semantic');
  const radiusTokens = tokens.filter((t) => t.category === 'border-radius');

  lines.push('## Colors\n');
  lines.push('### Palette (Primitive) Colors\n');
  lines.push('| CSS Variable | Value | Hex | Figma Variable |');
  lines.push('|---|---|---|---|');
  for (const t of paletteTokens) {
    const hex = t.resolved ? t.resolved.hex : t.rawValue;
    lines.push(`| \`${t.cssVar}\` | ${t.rawValue} | ${hex} | ${t.figmaPath} |`);
  }

  lines.push('\n### Semantic Colors\n');
  lines.push('| CSS Variable | Value | Hex | Opacity | Figma Variable |');
  lines.push('|---|---|---|---|---|');
  for (const t of semanticTokens) {
    const hex = t.resolved ? t.resolved.hex : t.rawValue;
    const opacity = t.resolved ? t.resolved.opacity : 1;
    lines.push(
      `| \`${t.cssVar}\` | ${t.rawValue} | ${hex} | ${opacity} | ${t.figmaPath} |`
    );
  }

  lines.push('\n## Border Radius\n');
  lines.push('### From CSS Variables\n');
  lines.push('| CSS Variable | Value | Pixels | Figma Variable |');
  lines.push('|---|---|---|---|');
  for (const t of radiusTokens) {
    const px = t.resolvedPx !== null ? `${t.resolvedPx}px` : '—';
    lines.push(`| \`${t.cssVar}\` | ${t.rawValue} | ${px} | ${t.figmaPath} |`);
  }

  lines.push('\n### From Tailwind Config\n');
  lines.push('| Class | Value | Pixels | Figma Variable |');
  lines.push('|---|---|---|---|');
  for (const br of tailwindExtensions.borderRadius) {
    lines.push(
      `| \`rounded-${br.name}\` | ${br.value} | ${br.resolvedPx}px | ${br.figmaPath} |`
    );
  }

  lines.push('\n## Shadows\n');
  lines.push('| Name | Value | Figma Variable |');
  lines.push('|---|---|---|');
  for (const s of tailwindExtensions.shadows) {
    lines.push(`| \`shadow-${s.name}\` | ${s.value} | ${s.figmaPath} |`);
  }

  lines.push('\n## Typography\n');
  lines.push('### Font Sizes (Tailwind Defaults)\n');
  lines.push('| Class | Value | Pixels | Figma Variable |');
  lines.push('|---|---|---|---|');
  for (const t of tailwindExtensions.typography) {
    lines.push(
      `| \`text-${t.name}\` | ${t.value} | ${t.resolvedPx}px | Typography/font-size/${t.name} |`
    );
  }

  lines.push('\n### Font Weights (Tailwind Defaults)\n');
  lines.push('| Class | Value | Figma Variable |');
  lines.push('|---|---|---|');
  for (const fw of tailwindExtensions.fontWeights) {
    lines.push(
      `| \`font-${fw.name}\` | ${fw.value} | Typography/font-weight/${fw.name} |`
    );
  }

  return lines.join('\n');
}

function main() {
  const config = parseArgs();
  const sourceDir = path.resolve(config.sourceDir);
  const outputDir = path.resolve(config.outputDir);

  const cssPath = path.join(sourceDir, 'index.css');
  if (!fs.existsSync(cssPath)) {
    console.error(`CSS file not found: ${cssPath}`);
    process.exit(1);
  }

  const cssContent = fs.readFileSync(cssPath, 'utf-8');
  const tokens = parseCssVariables(cssContent);
  const tailwindExtensions = parseTailwindExtensions();

  const cssFigmaMap = buildCssFigmaMap(tokens, tailwindExtensions);

  const collections = {
    Palette: {
      name: 'Palette',
      description: 'Primitive brand color palette (Bitovi Design System)',
      scoping: ['ALL_FILLS', 'STROKE_COLOR'],
      tokenCount: tokens.filter((t) => t.figmaCollection === 'Palette').length,
    },
    Semantic: {
      name: 'Semantic',
      description:
        'Semantic/interactive colors (Obra Design System)',
      scoping: ['FRAME_FILL', 'SHAPE_FILL', 'TEXT_FILL', 'STROKE_COLOR'],
      tokenCount: tokens.filter((t) => t.figmaCollection === 'Semantic').length,
    },
    Numbers: {
      name: 'Numbers',
      description: 'Spacing, border radius, and other numeric tokens',
      scoping: ['CORNER_RADIUS', 'GAP', 'PADDING'],
      tokenCount: tokens.filter((t) => t.figmaCollection === 'Numbers').length,
    },
  };

  const designTokensJson = {
    schemaVersion: 'react-to-figma-tokens@1',
    sourceFile: cssPath,
    extractedAt: new Date().toISOString(),
    summary: {
      totalTokens: tokens.length,
      paletteColors: tokens.filter((t) => t.category === 'palette').length,
      semanticColors: tokens.filter((t) => t.category === 'semantic').length,
      borderRadius: tokens.filter((t) => t.category === 'border-radius').length,
      shadows: tailwindExtensions.shadows.length,
      fontSizes: tailwindExtensions.typography.length,
      fontWeights: tailwindExtensions.fontWeights.length,
    },
    collections,
    tokens,
    tailwindExtensions: {
      borderRadius: tailwindExtensions.borderRadius,
      shadows: tailwindExtensions.shadows,
      typography: tailwindExtensions.typography,
      fontWeights: tailwindExtensions.fontWeights,
    },
  };

  fs.mkdirSync(outputDir, { recursive: true });

  const tokensJsonPath = path.join(outputDir, 'design-tokens.json');
  fs.writeFileSync(tokensJsonPath, JSON.stringify(designTokensJson, null, 2));
  console.error(`  design-tokens.json: ${tokens.length} tokens`);

  const mapJsonPath = path.join(outputDir, 'css-figma-map.json');
  fs.writeFileSync(mapJsonPath, JSON.stringify(cssFigmaMap, null, 2));
  console.error(
    `  css-figma-map.json: ${Object.keys(cssFigmaMap).length} mappings`
  );

  const markdownPath = path.join(outputDir, 'design-tokens.md');
  const markdown = generateMarkdown(tokens, tailwindExtensions);
  fs.writeFileSync(markdownPath, markdown);
  console.error(`  design-tokens.md: written`);

  console.log(
    JSON.stringify(
      {
        status: 'ok',
        tokens: tokens.length,
        mappings: Object.keys(cssFigmaMap).length,
        files: [tokensJsonPath, mapJsonPath, markdownPath],
      },
      null,
      2
    )
  );
}

main();
