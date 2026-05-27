#!/usr/bin/env node

/**
 * extract-static-assets.js — Inventory static images and SVGs in the project.
 *
 * Scans public/ and src/assets/ for image files, records metadata,
 * and searches source files for references to determine which components use each.
 *
 * Usage:
 *   node extract-static-assets.js <clientDir> [--output <dir>]
 *
 * Examples:
 *   node extract-static-assets.js packages/client
 *   node extract-static-assets.js packages/client --output .temp/react-to-figma
 *
 * Output:
 *   <output>/assets/static-assets.json — Machine-readable asset inventory
 *   <output>/assets/static-assets.md   — Human-readable asset table
 */

const fs = require('fs');
const path = require('path');

const DEFAULT_OUTPUT_DIR = '.temp/react-to-figma';
const IMAGE_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.avif',
]);

function parseArgs() {
  const args = process.argv.slice(2);
  const config = { clientDir: null, outputDir: DEFAULT_OUTPUT_DIR };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--output' && args[i + 1]) {
      config.outputDir = args[i + 1];
      i++;
    } else if (!config.clientDir) {
      config.clientDir = args[i];
    }
  }

  if (!config.clientDir) {
    console.error(
      'Usage: node extract-static-assets.js <clientDir> [--output <dir>]'
    );
    console.error('Example: node extract-static-assets.js packages/client');
    process.exit(1);
  }

  return config;
}

function findImageFiles(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findImageFiles(fullPath, results);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (IMAGE_EXTENSIONS.has(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

function findSourceFiles(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.temp') continue;
      findSourceFiles(fullPath, results);
    } else if (/\.(tsx?|jsx?|css|html)$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

function findUsages(fileName, sourceFiles) {
  const usedIn = [];
  const searchTerms = [fileName, fileName.replace(path.extname(fileName), '')];

  for (const srcFile of sourceFiles) {
    const content = fs.readFileSync(srcFile, 'utf-8');
    for (const term of searchTerms) {
      if (content.includes(term)) {
        const dirName = path.basename(path.dirname(srcFile));
        const baseName = path.basename(srcFile, path.extname(srcFile));
        const label = dirName !== 'src' ? dirName : baseName;
        if (!usedIn.includes(label)) {
          usedIn.push(label);
        }
        break;
      }
    }
  }

  return usedIn;
}

function main() {
  const config = parseArgs();
  const clientDir = path.resolve(config.clientDir);
  const outputDir = path.resolve(config.outputDir);
  const projectRoot = path.resolve('.');

  const scanDirs = [
    path.join(clientDir, 'public'),
    path.join(clientDir, 'src', 'assets'),
  ];

  console.error(`Scanning for static assets...`);
  const allImages = [];
  for (const dir of scanDirs) {
    const images = findImageFiles(dir);
    allImages.push(...images);
  }
  console.error(`  Found ${allImages.length} image files`);

  const srcDir = path.join(clientDir, 'src');
  const sourceFiles = findSourceFiles(srcDir);

  const assets = [];
  for (const imgPath of allImages) {
    const relativePath = path.relative(clientDir, imgPath);
    const fileName = path.basename(imgPath);
    const ext = path.extname(imgPath).toLowerCase().slice(1);
    const stats = fs.statSync(imgPath);
    const usedIn = findUsages(fileName, sourceFiles);

    let svgContent = null;
    if (ext === 'svg') {
      svgContent = fs.readFileSync(imgPath, 'utf-8');
    }

    assets.push({
      fileName,
      relativePath,
      type: ext,
      sizeBytes: stats.size,
      usedIn,
      figmaName: `Asset/${fileName.replace(/\.\w+$/, '').replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\s/g, '')}`,
      svgContent,
    });
  }

  const assetsDir = path.join(outputDir, 'assets');
  fs.mkdirSync(assetsDir, { recursive: true });

  const jsonPath = path.join(assetsDir, 'static-assets.json');
  const jsonOutput = {
    schemaVersion: 'react-to-figma-assets@1',
    extractedAt: new Date().toISOString(),
    summary: {
      totalAssets: assets.length,
      byType: {},
    },
    assets,
  };

  for (const asset of assets) {
    jsonOutput.summary.byType[asset.type] =
      (jsonOutput.summary.byType[asset.type] || 0) + 1;
  }

  fs.writeFileSync(jsonPath, JSON.stringify(jsonOutput, null, 2));
  console.error(`  static-assets.json: ${assets.length} assets`);

  const mdLines = [];
  mdLines.push('# Static Assets\n');
  mdLines.push(`**Total assets**: ${assets.length}\n`);
  mdLines.push('| File | Path | Type | Size | Used In | Figma Name |');
  mdLines.push('|---|---|---|---|---|---|');
  for (const asset of assets) {
    const size =
      asset.sizeBytes > 1024
        ? `${(asset.sizeBytes / 1024).toFixed(1)}KB`
        : `${asset.sizeBytes}B`;
    const usedIn = asset.usedIn.length > 0 ? asset.usedIn.join(', ') : '—';
    mdLines.push(
      `| ${asset.fileName} | ${asset.relativePath} | ${asset.type} | ${size} | ${usedIn} | ${asset.figmaName} |`
    );
  }

  const mdPath = path.join(assetsDir, 'static-assets.md');
  fs.writeFileSync(mdPath, mdLines.join('\n'));
  console.error(`  static-assets.md: written`);

  console.log(
    JSON.stringify(
      {
        status: 'ok',
        assets: assets.length,
        files: [jsonPath, mdPath],
      },
      null,
      2
    )
  );
}

main();
