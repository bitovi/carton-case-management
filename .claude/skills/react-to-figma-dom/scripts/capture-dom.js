#!/usr/bin/env node
/**
 * capture-dom.js
 * Captures React component variants with DOM structure, Fiber tree, and coordinate mappings
 * 
 * Produces per-variant folders with:
 * - dom.json: React Fiber tree with element references
 * - fiber-dom-map.json: Coordinate mapping for layout analysis
 * - screenshot.png: Visual reference
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const https = require('https');
const http = require('http');
const {
  buildFiberDomMap,
  captureDomStructure,
  captureFiberData,
  capturePortalContent,
} = require('./capture-dom-core');

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
  const captureBaseline = args.includes('--capture-baseline');
  const baselineFile = extractArg(args, '--baseline');

  if (!componentName || !outputDir) {
    console.error('Usage: node capture-dom.js --component NAME --output-dir PATH [--storybook-url URL] [--stories-file PATH] [--capture-baseline] [--baseline PATH]');
    process.exit(1);
  }

  // Load baseline fingerprints if provided
  let baselineFingerprints = null;
  if (baselineFile && fs.existsSync(baselineFile)) {
    const baseline = JSON.parse(fs.readFileSync(baselineFile, 'utf-8'));
    baselineFingerprints = new Set(baseline.fingerprints);
    console.log(`📋 Loaded ${baselineFingerprints.size} baseline fingerprint(s) from ${baselineFile}`);
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
      .filter(([id]) => id.startsWith(prefix + '--') && !id.endsWith('--docs'));

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

  // ── Baseline capture mode ─────────────────────────────────────────────
  if (captureBaseline) {
    console.log('📋 Capturing baseline fingerprints...');
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 800 });

    const baselineStoryId = stories[0]?.id || `figma-variants-${componentName.toLowerCase()}--blank`;
    const storyUrl = `${storybookUrl}/iframe.html?id=${baselineStoryId}`;
    await page.goto(storyUrl, { waitUntil: 'networkidle' });
    await page.waitForSelector('#storybook-root', { timeout: 5000 }).catch(() => null);

    const fingerprints = await page.evaluate(() => {
      const fps = [];
      for (const child of document.body.children) {
        const tag = child.tagName.toLowerCase();
        if (child.id === 'storybook-root') continue;
        if (['script', 'style', 'link'].includes(tag)) continue;
        const classes = child.classList.length
          ? '.' + [...child.classList].sort().join('.')
          : '';
        fps.push(tag + classes);
      }
      return fps;
    });

    await page.close();

    const baselineOutput = path.join(path.dirname(variantsDir), 'baseline-body.json');
    const baselineData = {
      fingerprints,
      timestamp: new Date().toISOString(),
      storybookUrl
    };
    fs.writeFileSync(baselineOutput, JSON.stringify(baselineData, null, 2));

    console.log(`✅ Baseline captured: ${fingerprints.length} fingerprint(s)`);
    fingerprints.forEach(fp => console.log(`   ${fp}`));
    console.log(`📄 Output: ${baselineOutput}\n`);

    await browser.close();
    process.exit(0);
  }

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
      
      // Check for Storybook error display before capturing
      const storybookError = await page.evaluate(() => {
        const errorDisplay = document.querySelector('.sb-errordisplay, #error-message');
        const bodyHasError = document.body.classList.contains('sb-show-errordisplay');

        // Storybook keeps a hidden error container in the iframe template.
        // Only treat it as a real error when the element is visible.
        const isVisible = (el) => {
          if (!el) return false;
          const style = window.getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
        };

        if (bodyHasError || isVisible(errorDisplay)) {
          const text = (errorDisplay || document.body).textContent || '';
          return text.trim().slice(0, 300);
        }
        return null;
      });

      if (storybookError) {
        await page.close();
        const reason = `Storybook error: ${storybookError.split('\n')[0]}`;
        console.error(`❌ ${story.exportName} — ${reason}`);
        manifest.failed.push({
          exportName: story.exportName,
          error: reason,
          timestamp: new Date().toISOString()
        });
        continue;
      }

      const fiberData = await captureFiberData(page, { rootSelector: '#storybook-root > *' });
      const domStructure = await captureDomStructure(page, { rootSelector: '#storybook-root > *' });
      const baselineFPs = baselineFingerprints ? [...baselineFingerprints] : [];
      const portalContent = await capturePortalContent(page, baselineFPs, {
        excludeRootSelectors: ['#storybook-root'],
      });
      const fiberDomMap = buildFiberDomMap(fiberData);

      // Capture screenshot
      const variantDir = path.join(variantsDir, story.exportName);
      if (!fs.existsSync(variantDir)) {
        fs.mkdirSync(variantDir, { recursive: true });
      }

      const screenshotPath = path.join(variantDir, 'screenshot.png');
      await page.screenshot({ path: screenshotPath, fullPage: false });

      // Save DOM data - use domStructure as primary data with fiberData as enrichment
      const domData = {
        structure: domStructure,
        portalContent: portalContent.length > 0 ? portalContent : undefined,
        fibers: fiberData && fiberData.length > 0 ? fiberData : null,
        timestamp: new Date().toISOString(),
        viewport: { width: 1280, height: 800 }
      };

      fs.writeFileSync(
        path.join(variantDir, 'dom.json'),
        JSON.stringify(domData, null, 2)
      );

      fs.writeFileSync(
        path.join(variantDir, 'fiber-dom-map.json'),
        JSON.stringify(fiberDomMap, null, 2)
      );

      await page.close();

      const domChildCount = countChildren(domStructure);
      const screenshotBytes = fs.statSync(screenshotPath).size;
      const quality = validateCaptureQuality(domChildCount, screenshotBytes, domStructure);

      if (quality.status === 'failed') {
        console.error(`❌ ${story.exportName} — ${quality.reason}`);
        fs.rmSync(path.join(variantDir, 'dom.json'), { force: true });
        fs.rmSync(path.join(variantDir, 'fiber-dom-map.json'), { force: true });
        fs.rmSync(screenshotPath, { force: true });
        manifest.failed.push({
          exportName: story.exportName,
          error: quality.reason,
          domChildCount,
          screenshotBytes,
          timestamp: new Date().toISOString()
        });
      } else {
        const warning = quality.warning || undefined;
        const parts = [];
        parts.push(`${domChildCount} children`);
        parts.push(`${formatBytes(screenshotBytes)} screenshot`);
        if (portalContent.length > 0) parts.push(`${portalContent.length} portal(s)`);

        if (warning) {
          console.log(`⚠️  ${story.exportName} (${parts.join(', ')}) — warning: ${warning}`);
        } else {
          console.log(`✅ ${story.exportName} (${parts.join(', ')})`);
        }

        manifest.captured.push({
          exportName: story.exportName,
          variant: story.exportName,
          portalNodes: portalContent.length,
          domChildCount,
          screenshotBytes,
          warning,
          timestamp: new Date().toISOString()
        });
      }
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

  const warningCount = manifest.captured.filter(c => c.warning).length;
  console.log(`\n📊 Capture complete: ${componentName}`);
  console.log(`   Captured: ${manifest.captured.length}/${manifest.total}`);
  if (warningCount > 0) console.log(`   Warnings: ${warningCount}`);
  console.log(`   Failed: ${manifest.failed.length}`);
  console.log(`   Output: ${variantsDir}`);
  console.log(`   Manifest: ${manifestPath}\n`);

  await browser.close();

  process.exit(manifest.failed.length > 0 ? 1 : 0);
}

function countChildren(domStructure) {
  if (!domStructure) return 0;
  const children = domStructure.children || [];
  return children.length;
}

function validateCaptureQuality(domChildCount, screenshotBytes, domStructure) {
  if (domChildCount === 0) {
    return { status: 'failed', reason: 'empty content (0 DOM children)' };
  }
  if (domStructure && domStructure.className && /sb-errordisplay|sb-show-errordisplay/.test(domStructure.className)) {
    return { status: 'failed', reason: 'captured Storybook error display instead of component' };
  }
  if (domStructure && domStructure.children) {
    const firstChild = domStructure.children[0];
    if (firstChild && firstChild.className && /sb-errordisplay/.test(firstChild.className)) {
      return { status: 'failed', reason: 'captured Storybook error display instead of component' };
    }
  }
  if (screenshotBytes < 1024) {
    return { status: 'ok', warning: 'small screenshot (<1KB)' };
  }
  return { status: 'ok' };
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  return `${Math.round(bytes / 1024)}KB`;
}

function extractArg(args, flag) {
  const idx = args.indexOf(flag);
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : null;
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
