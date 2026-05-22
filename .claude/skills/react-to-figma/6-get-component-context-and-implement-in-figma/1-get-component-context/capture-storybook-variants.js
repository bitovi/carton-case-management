#!/usr/bin/env node

/**
 * capture-storybook-variants.js
 *
 * Reusable helper that captures screenshots, HTML structure, and computed CSS
 * for every Storybook story matching a given component prefix.
 *
 * Usage:
 *   node capture-storybook-variants.js \
 *     --component Accordion \
 *     --storybook-url http://localhost:6006 \
 *     --output-dir .temp/react-to-figma/components/Accordion/screenshots \
 *     [--story-prefix figma-variants-accordion] \
 *     [--timeout 15000] \
 *     [--play-wait 800]
 *
 * How it works:
 *   1. Fetches Storybook's index.json to discover story IDs matching the prefix
 *   2. For each story, navigates to the iframe URL, captures a screenshot,
 *      extracts the rendered HTML, and extracts computed CSS
 *   3. Writes a JSON manifest (screenshots-manifest.json) listing all captures
 *
 * The --story-prefix flag defaults to "figma-variants-{component-kebab}".
 * Override it if the story title slug differs.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    component: null,
    storybookUrl: 'http://localhost:6006',
    outputDir: null,
    storyPrefix: null,
    timeout: 15000,
    playWait: 800,
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--component':
        opts.component = args[++i];
        break;
      case '--storybook-url':
        opts.storybookUrl = args[++i];
        break;
      case '--output-dir':
        opts.outputDir = args[++i];
        break;
      case '--story-prefix':
        opts.storyPrefix = args[++i];
        break;
      case '--timeout':
        opts.timeout = parseInt(args[++i], 10);
        break;
      case '--play-wait':
        opts.playWait = parseInt(args[++i], 10);
        break;
      default:
        break;
    }
  }

  if (!opts.component) {
    console.error('Error: --component is required');
    process.exit(1);
  }

  if (!opts.storyPrefix) {
    const kebab = opts.component
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .toLowerCase();
    opts.storyPrefix = `figma-variants-${kebab}`;
  }

  if (!opts.outputDir) {
    opts.outputDir = `.temp/react-to-figma/components/${opts.component}/screenshots`;
  }

  return opts;
}

async function fetchStoryIndex(storybookUrl) {
  const url = `${storybookUrl}/index.json`;
  const resp = await fetch(url);
  if (!resp.ok) {
    throw new Error(`Failed to fetch Storybook index at ${url}: ${resp.status}`);
  }
  const data = await resp.json();
  return data.entries || data.v4 || data;
}

function extractExportName(storyId, prefix) {
  const suffix = storyId.replace(`${prefix}--`, '');
  return suffix
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

const FIGMA_CSS_PROPS = [
  'width',
  'height',
  'min-width',
  'min-height',
  'max-width',
  'max-height',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'gap',
  'row-gap',
  'column-gap',
  'display',
  'flex-direction',
  'align-items',
  'justify-content',
  'flex-wrap',
  'position',
  'top',
  'right',
  'bottom',
  'left',
  'color',
  'background-color',
  'opacity',
  'border-top-width',
  'border-right-width',
  'border-bottom-width',
  'border-left-width',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-right-radius',
  'border-bottom-left-radius',
  'box-shadow',
  'text-shadow',
  'font-family',
  'font-size',
  'font-weight',
  'line-height',
  'letter-spacing',
  'text-align',
  'text-decoration',
  'overflow-x',
  'overflow-y',
];

async function captureVariant(page, storyUrl, exportName, outputDir, opts) {
  await page.goto(storyUrl, { waitUntil: 'load', timeout: opts.timeout });
  await page.waitForTimeout(opts.playWait);

  await page
    .waitForFunction(
      () => {
        const root =
          document.querySelector('#storybook-root') || document.querySelector('#root');
        return root && root.children.length > 0;
      },
      { timeout: 5000 }
    )
    .catch(() => {});

  const screenshotPath = path.join(outputDir, `${exportName}.png`);
  await page.screenshot({ path: screenshotPath, fullPage: false });

  const htmlContent = await page.evaluate(() => {
    const root =
      document.querySelector('#storybook-root') ||
      document.querySelector('#root') ||
      document.body;

    function serialize(el, depth) {
      if (!el || depth > 10) return '';
      const indent = '  '.repeat(depth);
      const tag = el.tagName ? el.tagName.toLowerCase() : 'text';

      if (el.nodeType === 3) {
        const text = el.textContent ? el.textContent.trim() : '';
        return text ? indent + text + '\n' : '';
      }

      if (el.nodeType !== 1) return '';

      const attrs = [];
      if (el.className && typeof el.className === 'string') {
        attrs.push('class="' + el.className + '"');
      }
      var role = el.getAttribute('role');
      if (role) attrs.push('role="' + role + '"');
      var ariaLabel = el.getAttribute('aria-label');
      if (ariaLabel) attrs.push('aria-label="' + ariaLabel + '"');
      var dataState = el.getAttribute('data-state');
      if (dataState) attrs.push('data-state="' + dataState + '"');
      if (el.getAttribute('disabled') !== null) attrs.push('disabled');

      var attrStr = attrs.length ? ' ' + attrs.join(' ') : '';
      var result = indent + '<' + tag + attrStr + '>\n';

      for (var i = 0; i < el.childNodes.length; i++) {
        result += serialize(el.childNodes[i], depth + 1);
      }

      result += indent + '</' + tag + '>\n';
      return result;
    }

    return serialize(root, 0);
  });

  const htmlPath = path.join(outputDir, `${exportName}.html.md`);
  fs.writeFileSync(
    htmlPath,
    `# HTML Structure: ${exportName}\n\n\`\`\`html\n${htmlContent}\n\`\`\`\n`
  );

  const cssContent = await page.evaluate((cssProps) => {
    const root =
      document.querySelector('#storybook-root') ||
      document.querySelector('#root') ||
      document.body;

    function extract(el, depth) {
      if (!el || el.nodeType !== 1 || depth > 8) return '';
      var indent = '  '.repeat(depth);
      var tag = el.tagName ? el.tagName.toLowerCase() : '?';
      var cs = window.getComputedStyle(el);
      var rect = el.getBoundingClientRect();

      var result = indent + tag;
      if (el.className && typeof el.className === 'string') {
        var shortClass = el.className.split(' ').slice(0, 3).join(' ');
        result += ' .' + shortClass;
      }
      result +=
        ' (' + Math.round(rect.width) + 'x' + Math.round(rect.height) + ')\n';

      for (var i = 0; i < cssProps.length; i++) {
        var prop = cssProps[i];
        var val = cs.getPropertyValue(prop);
        if (
          val &&
          val !== 'none' &&
          val !== 'normal' &&
          val !== 'auto' &&
          val !== '0px' &&
          val !== 'rgba(0, 0, 0, 0)' &&
          val !== 'start'
        ) {
          result += indent + '  ' + prop + ': ' + val + '\n';
        }
      }

      for (var j = 0; j < el.children.length; j++) {
        result += extract(el.children[j], depth + 1);
      }

      return result;
    }

    return extract(root, 0);
  }, FIGMA_CSS_PROPS);

  const cssPath = path.join(outputDir, `${exportName}.styles.md`);
  fs.writeFileSync(
    cssPath,
    `# Computed CSS: ${exportName}\n\n\`\`\`\n${cssContent}\n\`\`\`\n`
  );

  return { screenshotPath, htmlPath, cssPath };
}

async function main() {
  const opts = parseArgs();
  const storybookUrl = opts.storybookUrl.replace(/\/$/, '');

  console.log(`\nFetching Storybook index from ${storybookUrl}/index.json ...`);
  const entries = await fetchStoryIndex(storybookUrl);

  const storyIds = Object.keys(entries).filter(
    (id) => id.startsWith(opts.storyPrefix + '--') && !id.endsWith('--docs')
  );

  if (storyIds.length === 0) {
    console.error(
      `No stories found matching prefix "${opts.storyPrefix}". Available prefixes:`
    );
    const prefixes = [
      ...new Set(Object.keys(entries).map((id) => id.replace(/--[^-].*$/, ''))),
    ];
    prefixes.sort().forEach((p) => console.error(`  ${p}`));
    process.exit(1);
  }

  console.log(
    `Found ${storyIds.length} stories matching prefix "${opts.storyPrefix}"\n`
  );

  fs.mkdirSync(opts.outputDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1024, height: 768 });

  const results = {
    component: opts.component,
    storyPrefix: opts.storyPrefix,
    storybookUrl: storybookUrl,
    outputDir: opts.outputDir,
    timestamp: new Date().toISOString(),
    total: storyIds.length,
    successful: 0,
    failed: [],
    captures: [],
  };

  for (const storyId of storyIds) {
    const exportName = extractExportName(storyId, opts.storyPrefix);
    const storyUrl = `${storybookUrl}/iframe.html?id=${storyId}&viewMode=story`;

    try {
      process.stdout.write(`  Capturing: ${exportName} ... `);
      const files = await captureVariant(page, storyUrl, exportName, opts.outputDir, opts);
      results.successful++;
      results.captures.push({
        storyId,
        exportName,
        storyUrl,
        status: 'ok',
        files,
      });
      console.log('ok');
    } catch (error) {
      console.log(`FAILED: ${error.message}`);
      results.failed.push({
        storyId,
        exportName,
        storyUrl,
        error: error.message,
      });
    }
  }

  await browser.close();

  const manifestPath = path.join(opts.outputDir, '..', 'screenshots-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(results, null, 2));

  console.log(`\nCapture summary:`);
  console.log(`  Total:      ${results.total}`);
  console.log(`  Successful: ${results.successful}`);
  console.log(`  Failed:     ${results.failed.length}`);
  console.log(`  Manifest:   ${manifestPath}`);

  if (results.failed.length > 0) {
    console.log(`\nFailed variants:`);
    results.failed.forEach((f) => console.log(`  - ${f.exportName}: ${f.error}`));
  }

  process.exit(results.failed.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
