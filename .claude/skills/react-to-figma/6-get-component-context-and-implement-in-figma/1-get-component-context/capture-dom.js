#!/usr/bin/env node
/**
 * capture-dom.js
 * Captures React component variants with DOM structure, Fiber tree, and coordinate mappings
 * 
 * Produces per-variant folders with:
 * - dom.json: React Fiber tree with element references
 * - fiber-dom-map.json: Coordinate mapping for layout analysis
 * - screenshot.png: Visual reference
 * - html.md: Component HTML structure
 * - styles.md: Computed CSS styles
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const https = require('https');
const http = require('http');

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error(`Failed to parse JSON: ${e.message}`));
        }
      });
    });
    req.on('error', reject);
  });
}

async function main() {
  const args = process.argv.slice(2);
  const componentName = extractArg(args, '--component');
  const storybookUrl = extractArg(args, '--storybook-url') || 'http://localhost:6006';
  const outputDir = extractArg(args, '--output-dir');
  const storiesFile = extractArg(args, '--stories-file');

  if (!componentName || !outputDir) {
    console.error('Usage: node capture-dom.js --component NAME --output-dir PATH [--storybook-url URL] [--stories-file PATH]');
    process.exit(1);
  }

  const variantsDir = outputDir.replace('/screenshots$', '/variants');
  const manifestPath = path.join(variantsDir, 'capture-manifest.json');

  // Ensure output directories exist
  if (!fs.existsSync(variantsDir)) {
    fs.mkdirSync(variantsDir, { recursive: true });
  }

  console.log(`\n📸 DOM Capture: ${componentName}`);
  console.log(`Storybook URL: ${storybookUrl}`);
  console.log(`Output directory: ${variantsDir}\n`);

  // Get list of stories
  let stories = [];
  try {
    const indexJson = await fetchUrl(`${storybookUrl}/index.json`);
    if (!indexJson || !indexJson.entries) {
      throw new Error('Invalid Storybook index format');
    }

    const componentKebab = componentName.toLowerCase();
    const prefix = `figma-variants-${componentKebab}`;

    const matching = Object.entries(indexJson.entries)
      .filter(([id]) => id.startsWith(prefix) && !id.endsWith('--docs'));

    stories = matching.map(([id, meta]) => ({
      id,
      title: meta.title,
      exportName: meta.name || id.split('--')[1] || id
    }));
  } catch (err) {
    console.error(`❌ Failed to fetch Storybook index: ${err.message}`);
    process.exit(1);
  }

  if (stories.length === 0) {
    console.error(`❌ No stories found matching prefix figma-variants-${componentName.toLowerCase()}`);
    process.exit(1);
  }

  console.log(`Found ${stories.length} stories to capture:\n`);
  stories.forEach((s, i) => console.log(`  ${i + 1}. ${s.exportName}`));
  console.log();

  // Launch browser
  const browser = await chromium.launch();

  const manifest = {
    component: componentName,
    timestamp: new Date().toISOString(),
    storybookUrl,
    total: stories.length,
    captured: [],
    failed: []
  };

  // Capture each story
  for (const story of stories) {
    try {
      console.log(`⏳ Capturing: ${story.exportName}...`);
      
      const storyUrl = `${storybookUrl}/iframe.html?id=${story.id}`;
      const page = await browser.newPage();
      
      // Set viewport
      await page.setViewportSize({ width: 1280, height: 800 });
      
      // Navigate to story
      await page.goto(storyUrl, { waitUntil: 'networkidle' });
      
      // Wait for component to render
      await page.waitForSelector('[role="main"], .sb-show-main, .docs-story', { timeout: 5000 }).catch(() => null);
      
      // Extract React Fiber data
      const fiberData = await page.evaluate(() => {
        // Find the React root element
        const rootElement = document.querySelector('[data-reactroot], #root, .sb-show-main, .docs-story');
        if (!rootElement) return null;

        // Try to access React Fiber
        const fiberKey = Object.keys(rootElement).find(key => key.startsWith('__react'));
        if (!fiberKey) return null;

        const fiber = rootElement[fiberKey];
        if (!fiber) return null;

        // Traverse Fiber tree and extract component instances
        const components = [];
        const visited = new Set();

        function traverseFiber(f, depth = 0) {
          if (!f || visited.has(f)) return;
          visited.add(f);

          // Only store component-level fibers, not DOM elements
          if (f.type && typeof f.type === 'function' && f.elementType) {
            const domNode = f.stateNode;
            if (domNode && domNode.getBoundingClientRect) {
              const rect = domNode.getBoundingClientRect();
              const styles = window.getComputedStyle(domNode);

              components.push({
                name: f.type.name || f.type.displayName || 'Unknown',
                type: f.elementType.name || 'Component',
                props: f.memoizedProps || {},
                state: f.memoizedState,
                bounds: {
                  x: Math.round(rect.x),
                  y: Math.round(rect.y),
                  width: Math.round(rect.width),
                  height: Math.round(rect.height)
                },
                styles: {
                  display: styles.display,
                  position: styles.position,
                  backgroundColor: styles.backgroundColor,
                  color: styles.color,
                  fontSize: styles.fontSize
                }
              });
            }
          }

          // Traverse child fibers
          if (f.child) traverseFiber(f.child, depth + 1);
          if (f.sibling) traverseFiber(f.sibling, depth);
        }

        traverseFiber(fiber);
        return components;
      });

      // Extract DOM structure and styles
      const domStructure = await page.evaluate(() => {
        const main = document.querySelector('[role="main"], .sb-show-main, .docs-story');
        if (!main) return null;

        function getElement(el, depth = 0) {
          if (depth > 10) return null; // Limit depth

          const styles = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();

          return {
            tag: el.tagName.toLowerCase(),
            role: el.getAttribute('role'),
            dataState: el.getAttribute('data-state'),
            aria: Object.fromEntries(
              Array.from(el.attributes)
                .filter(a => a.name.startsWith('aria-'))
                .map(a => [a.name, a.value])
            ),
            text: el.childNodes.length === 1 && el.childNodes[0].nodeType === 3
              ? el.textContent.trim().substring(0, 50)
              : null,
            bounds: {
              x: Math.round(rect.x),
              y: Math.round(rect.y),
              width: Math.round(rect.width),
              height: Math.round(rect.height)
            },
            styles: {
              display: styles.display,
              position: styles.position,
              visibility: styles.visibility,
              opacity: styles.opacity,
              pointerEvents: styles.pointerEvents,
              backgroundColor: styles.backgroundColor,
              color: styles.color,
              fontSize: styles.fontSize,
              fontWeight: styles.fontWeight,
              borderRadius: styles.borderRadius,
              border: styles.border,
              padding: styles.padding,
              margin: styles.margin
            },
            children: Array.from(el.children)
              .slice(0, 10) // Limit children
              .map(child => getElement(child, depth + 1))
              .filter(Boolean)
          };
        }

        return getElement(main);
      });

      // Generate fiber-DOM mapping
      const fiberDomMap = fiberData ? fiberData.map((comp, idx) => ({
        index: idx,
        component: comp.name,
        bounds: comp.bounds,
        depth: 0
      })) : [];

      // Capture screenshot
      const variantDir = path.join(variantsDir, story.exportName);
      if (!fs.existsSync(variantDir)) {
        fs.mkdirSync(variantDir, { recursive: true });
      }

      const screenshotPath = path.join(variantDir, 'screenshot.png');
      await page.screenshot({ path: screenshotPath, fullPage: false });

      // Save DOM data
      fs.writeFileSync(
        path.join(variantDir, 'dom.json'),
        JSON.stringify(fiberData || [], null, 2)
      );

      fs.writeFileSync(
        path.join(variantDir, 'fiber-dom-map.json'),
        JSON.stringify(fiberDomMap, null, 2)
      );

      // Save HTML structure
      fs.writeFileSync(
        path.join(variantDir, 'html.md'),
        `# ${story.exportName} - HTML Structure\n\n\`\`\`json\n${JSON.stringify(domStructure, null, 2)}\n\`\`\`\n`
      );

      // Save computed styles
      const allStyles = await page.evaluate(() => {
        const main = document.querySelector('[role="main"], .sb-show-main, .docs-story');
        if (!main) return [];

        const styles = [];
        const walk = (el, depth = 0) => {
          if (depth > 5) return;
          const computed = window.getComputedStyle(el);
          styles.push({
            tag: el.tagName.toLowerCase(),
            class: el.className,
            computed: {
              display: computed.display,
              position: computed.position,
              width: computed.width,
              height: computed.height,
              backgroundColor: computed.backgroundColor,
              color: computed.color,
              fontSize: computed.fontSize,
              padding: computed.padding,
              margin: computed.margin,
              borderRadius: computed.borderRadius
            }
          });
          Array.from(el.children).forEach(child => walk(child, depth + 1));
        };
        walk(main);
        return styles;
      });

      fs.writeFileSync(
        path.join(variantDir, 'styles.md'),
        `# ${story.exportName} - Computed Styles\n\n\`\`\`json\n${JSON.stringify(allStyles, null, 2)}\n\`\`\`\n`
      );

      await page.close();

      manifest.captured.push({
        exportName: story.exportName,
        variant: story.exportName,
        timestamp: new Date().toISOString()
      });

      console.log(`✅ ${story.exportName}`);
    } catch (err) {
      console.error(`❌ ${story.exportName}: ${err.message}`);
      manifest.failed.push({
        exportName: story.exportName,
        error: err.message,
        timestamp: new Date().toISOString()
      });
    }
  }

  // Save manifest
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`\n✅ Capture complete!`);
  console.log(`📊 Results:`);
  console.log(`   Captured: ${manifest.captured.length}/${manifest.total}`);
  console.log(`   Failed: ${manifest.failed.length}`);
  console.log(`   Output: ${variantsDir}`);
  console.log(`   Manifest: ${manifestPath}\n`);

  await browser.close();

  process.exit(manifest.failed.length > 0 ? 1 : 0);
}

function extractArg(args, flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : null;
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
