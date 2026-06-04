#!/usr/bin/env node
/**
 * capture-dom.js
 * Captures React component variants with DOM structure, Fiber tree, and coordinate mappings
 * 
 * Single-component mode:
 *   node capture-dom.js --component Button --output-dir .temp/.../Button/variants
 *
 * Batch mode (all components, one browser):
 *   node capture-dom.js --output-dir .temp/.../components
 *   node capture-dom.js --output-dir .temp/.../components --components Button,Badge,Input
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

function fetchStorybookIndex(storybookUrl) {
  return fetchUrl(`${storybookUrl}/index.json`);
}

function camelToTitleWords(key) {
  return key.replace(/([A-Z])/g, ' $1').trim().split(/\s+/).map(function(w) {
    return w.charAt(0).toUpperCase() + w.slice(1);
  });
}

function storyArgsToVariantProps(storyName, storyArgs) {
  if (!storyArgs || typeof storyArgs !== 'object') return null;

  const propTitles = Object.keys(storyArgs).map(function(key) {
    const words = camelToTitleWords(key);
    return { key: key, title: words.join(' '), words: words };
  });

  propTitles.sort(function(a, b) {
    return b.words.length - a.words.length || b.title.length - a.title.length;
  });

  const nameWords = storyName.trim().split(/\s+/);

  const firstWordMatchesProp = propTitles.some(function(pt) {
    return nameWords[0] && nameWords[0].toLowerCase() === pt.words[0].toLowerCase();
  });

  if (!firstWordMatchesProp) {
    return 'Variant=' + storyName;
  }

  const result = [];
  let i = 0;

  while (i < nameWords.length) {
    let matched = false;

    for (let pi = 0; pi < propTitles.length; pi++) {
      const pt = propTitles[pi];
      const wc = pt.words.length;
      if (i + wc + 1 <= nameWords.length) {
        const candidate = nameWords.slice(i, i + wc).join(' ');
        if (candidate.toLowerCase() === pt.title.toLowerCase()) {
          const value = nameWords[i + wc];
          result.push(pt.title + '=' + value);
          i += wc + 1;
          matched = true;
          break;
        }
      }
    }

    if (!matched) {
      if (i + 1 < nameWords.length) {
        result.push(nameWords[i] + '=' + nameWords[i + 1]);
        i += 2;
      } else {
        break;
      }
    }
  }

  return result.join(', ');
}

function discoverComponents(indexJson, filterComponents) {
  if (!indexJson || !indexJson.entries) {
    throw new Error('Invalid Storybook index format');
  }

  const componentMap = new Map();

  for (const [id, meta] of Object.entries(indexJson.entries)) {
    if (!id.startsWith('figma-variants-') || id.endsWith('--docs')) continue;

    const titleParts = (meta.title || '').split('/');
    const componentName = titleParts[titleParts.length - 1] || id.split('--')[0].replace('figma-variants-', '');

    if (filterComponents && !filterComponents.has(componentName)) continue;

    if (!componentMap.has(componentName)) {
      componentMap.set(componentName, []);
    }

    componentMap.get(componentName).push({
      id,
      title: meta.title,
      exportName: meta.name || id.split('--')[1] || id,
    });
  }

  return componentMap;
}

function getStoriesForComponent(indexJson, componentName) {
  const componentKebab = componentName.toLowerCase();
  const prefix = `figma-variants-${componentKebab}`;

  const matching = Object.entries(indexJson.entries)
    .filter(([id]) => id.startsWith(prefix + '--') && !id.endsWith('--docs'));

  return matching.map(([id, meta]) => ({
    id,
    title: meta.title,
    exportName: meta.name || id.split('--')[1] || id,
  }));
}

async function captureStory(page, story, variantsDir, storybookUrl, baselineFingerprints) {
  const storyUrl = `${storybookUrl}/iframe.html?id=${story.id}`;

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(storyUrl, { waitUntil: 'networkidle' });
  await page.waitForSelector('[role="main"], .sb-show-main, .docs-story', { timeout: 5000 }).catch(() => null);

  const storybookError = await page.evaluate(() => {
    const errorDisplay = document.querySelector('.sb-errordisplay, #error-message');
    const bodyHasError = document.body.classList.contains('sb-show-errordisplay');

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
    const reason = `Storybook error: ${storybookError.split('\n')[0]}`;
    return { status: 'failed', exportName: story.exportName, error: reason };
  }

  const fiberData = await captureFiberData(page, { rootSelector: '#storybook-root > *' });
  const domStructure = await captureDomStructure(page, { rootSelector: '#storybook-root > *' });
  const baselineFPs = baselineFingerprints ? [...baselineFingerprints] : [];
  const portalContent = await capturePortalContent(page, baselineFPs, {
    excludeRootSelectors: ['#storybook-root'],
  });
  const fiberDomMap = buildFiberDomMap(fiberData);

  const variantDir = path.join(variantsDir, story.exportName);
  if (!fs.existsSync(variantDir)) {
    fs.mkdirSync(variantDir, { recursive: true });
  }

  const screenshotPath = path.join(variantDir, 'screenshot.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });

  const storyArgsRaw = await page.evaluate(function(id) {
    try {
      var preview = window.__STORYBOOK_PREVIEW__;
      var storeVal = preview && preview.storyStoreValue;
      var initialArgs = storeVal && storeVal.args && storeVal.args.initialArgsByStoryId;
      return initialArgs ? JSON.stringify(initialArgs[id] || null) : null;
    } catch (e) {
      return null;
    }
  }, story.id).catch(function() { return null; });

  let variantProps = null;
  if (storyArgsRaw) {
    try {
      const storyArgs = JSON.parse(storyArgsRaw);
      variantProps = storyArgsToVariantProps(story.exportName, storyArgs);
    } catch (e) {
      variantProps = null;
    }
  }

  const domData = {
    structure: domStructure,
    portalContent: portalContent.length > 0 ? portalContent : undefined,
    fibers: fiberData && fiberData.length > 0 ? fiberData : null,
    timestamp: new Date().toISOString(),
    viewport: { width: 1280, height: 800 },
    variantProps: variantProps || undefined,
  };

  fs.writeFileSync(path.join(variantDir, 'dom.json'), JSON.stringify(domData, null, 2));
  fs.writeFileSync(path.join(variantDir, 'fiber-dom-map.json'), JSON.stringify(fiberDomMap, null, 2));

  const domChildCount = countChildren(domStructure);
  const portalChildCount = portalContent.reduce((sum, portal) => sum + countChildren(portal), 0);
  const totalChildCount = domChildCount + portalChildCount;
  const screenshotBytes = fs.statSync(screenshotPath).size;
  const quality = validateCaptureQuality(totalChildCount, screenshotBytes, domStructure, portalContent);

  if (quality.status === 'failed') {
    fs.rmSync(path.join(variantDir, 'dom.json'), { force: true });
    fs.rmSync(path.join(variantDir, 'fiber-dom-map.json'), { force: true });
    fs.rmSync(screenshotPath, { force: true });
    return { status: 'failed', exportName: story.exportName, error: quality.reason, domChildCount, portalChildCount, screenshotBytes };
  }

  return {
    status: 'ok',
    exportName: story.exportName,
    variant: story.exportName,
    portalNodes: portalContent.length,
    domChildCount,
    portalChildCount,
    totalChildCount,
    screenshotBytes,
    warning: quality.warning || undefined,
  };
}

async function captureComponent(browser, componentName, stories, variantsDir, storybookUrl, baselineFingerprints) {
  if (!fs.existsSync(variantsDir)) {
    fs.mkdirSync(variantsDir, { recursive: true });
  }

  const manifest = {
    component: componentName,
    timestamp: new Date().toISOString(),
    storybookUrl,
    total: stories.length,
    captured: [],
    failed: [],
  };

  for (const story of stories) {
    const page = await browser.newPage();
    try {
      console.log(`  ⏳ ${story.exportName}...`);
      const result = await captureStory(page, story, variantsDir, storybookUrl, baselineFingerprints);

      if (result.status === 'failed') {
        console.error(`  ❌ ${result.exportName} — ${result.error}`);
        manifest.failed.push({ ...result, timestamp: new Date().toISOString() });
      } else {
        const parts = [`${result.domChildCount} children`, `${formatBytes(result.screenshotBytes)} screenshot`];
        if (result.portalNodes > 0) parts.push(`${result.portalNodes} portal(s)`);
        if (result.warning) {
          console.log(`  ⚠️  ${result.exportName} (${parts.join(', ')}) — warning: ${result.warning}`);
        } else {
          console.log(`  ✅ ${result.exportName} (${parts.join(', ')})`);
        }
        manifest.captured.push({ ...result, timestamp: new Date().toISOString() });
      }
    } catch (err) {
      console.error(`  ❌ ${story.exportName}: ${err.message}`);
      manifest.failed.push({ exportName: story.exportName, error: err.message, timestamp: new Date().toISOString() });
    } finally {
      await page.close();
    }
  }

  const manifestPath = path.join(variantsDir, 'capture-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  return manifest;
}

async function main() {
  const args = process.argv.slice(2);
  const componentName = extractArg(args, '--component');
  const storybookUrl = extractArg(args, '--storybook-url') || 'http://localhost:6006';
  const outputDir = extractArg(args, '--output-dir');
  const storiesFile = extractArg(args, '--stories-file');
  const captureBaseline = args.includes('--capture-baseline');
  const baselineFile = extractArg(args, '--baseline');
  const componentsArg = extractArg(args, '--components');

  if (!outputDir) {
    console.error('Usage:');
    console.error('  Single:  node capture-dom.js --component NAME --output-dir PATH');
    console.error('  Batch:   node capture-dom.js --output-dir COMPONENTS_DIR [--components A,B,C]');
    process.exit(1);
  }

  let baselineFingerprints = null;
  if (baselineFile && fs.existsSync(baselineFile)) {
    const baseline = JSON.parse(fs.readFileSync(baselineFile, 'utf-8'));
    baselineFingerprints = new Set(baseline.fingerprints);
    console.log(`📋 Loaded ${baselineFingerprints.size} baseline fingerprint(s) from ${baselineFile}`);
  }

  const indexJson = storiesFile && fs.existsSync(storiesFile)
    ? JSON.parse(fs.readFileSync(storiesFile, 'utf-8'))
    : await fetchStorybookIndex(storybookUrl).catch(err => {
        console.error(`❌ Failed to fetch Storybook index: ${err.message}`);
        console.error(`   Hint: If Storybook returns HTTP 500 due to story parse errors,`);
        console.error(`         provide a --stories-file JSON with an "entries" object.`);
        process.exit(1);
      });

  // ── Single-component mode ───────────────────────────────────────────
  if (componentName) {
    const variantsDir = outputDir.replace('/screenshots$', '/variants');

    console.log(`\n📸 DOM Capture: ${componentName}`);
    console.log(`Storybook URL: ${storybookUrl}`);
    console.log(`Output directory: ${variantsDir}\n`);

    const stories = getStoriesForComponent(indexJson, componentName);

    if (stories.length === 0) {
      console.error(`❌ No stories found matching prefix figma-variants-${componentName.toLowerCase()}`);
      process.exit(1);
    }

    console.log(`Found ${stories.length} stories to capture:\n`);
    stories.forEach((s, i) => console.log(`  ${i + 1}. ${s.exportName}`));
    console.log();

    const browser = await chromium.launch();

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
      const baselineData = { fingerprints, timestamp: new Date().toISOString(), storybookUrl };
      fs.writeFileSync(baselineOutput, JSON.stringify(baselineData, null, 2));

      console.log(`✅ Baseline captured: ${fingerprints.length} fingerprint(s)`);
      fingerprints.forEach(fp => console.log(`   ${fp}`));
      console.log(`📄 Output: ${baselineOutput}\n`);

      await browser.close();
      process.exit(0);
    }

    const manifest = await captureComponent(browser, componentName, stories, variantsDir, storybookUrl, baselineFingerprints);

    const warningCount = manifest.captured.filter(c => c.warning).length;
    console.log(`\n📊 Capture complete: ${componentName}`);
    console.log(`   Captured: ${manifest.captured.length}/${manifest.total}`);
    if (warningCount > 0) console.log(`   Warnings: ${warningCount}`);
    console.log(`   Failed: ${manifest.failed.length}`);
    console.log(`   Output: ${variantsDir}\n`);

    await browser.close();
    process.exit(manifest.failed.length > 0 ? 1 : 0);
  }

  // ── Batch mode — all components, one browser ────────────────────────
  const filterSet = componentsArg ? new Set(componentsArg.split(',').map(s => s.trim())) : null;
  const componentMap = discoverComponents(indexJson, filterSet);

  if (componentMap.size === 0) {
    console.error('❌ No figma-variants stories found in Storybook');
    process.exit(1);
  }

  const componentNames = [...componentMap.keys()].sort();
  const totalStories = [...componentMap.values()].reduce((sum, s) => sum + s.length, 0);

  console.log(`\n📸 DOM Capture — Batch Mode`);
  console.log(`Storybook URL: ${storybookUrl}`);
  console.log(`Output base: ${outputDir}`);
  console.log(`Components: ${componentNames.length} (${totalStories} total stories)\n`);
  componentNames.forEach((name, i) => {
    console.log(`  ${i + 1}. ${name} (${componentMap.get(name).length} stories)`);
  });
  console.log();

  const browser = await chromium.launch();
  const batchSummary = {
    timestamp: new Date().toISOString(),
    storybookUrl,
    outputDir,
    components: [],
  };

  let totalCaptured = 0;
  let totalFailed = 0;

  for (const name of componentNames) {
    const stories = componentMap.get(name);
    const variantsDir = path.join(outputDir, name, 'variants');

    console.log(`\n── ${name} (${stories.length} stories) ──`);
    const manifest = await captureComponent(browser, name, stories, variantsDir, storybookUrl, baselineFingerprints);

    totalCaptured += manifest.captured.length;
    totalFailed += manifest.failed.length;

    batchSummary.components.push({
      name,
      captured: manifest.captured.length,
      failed: manifest.failed.length,
      total: manifest.total,
      failedVariants: manifest.failed.map(f => f.exportName),
    });
  }

  await browser.close();

  const summaryPath = path.join(outputDir, 'batch-capture-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(batchSummary, null, 2));

  const passedComponents = batchSummary.components.filter(c => c.failed === 0).length;
  const failedComponents = batchSummary.components.filter(c => c.failed > 0);

  console.log(`\n📊 Batch capture complete`);
  console.log(`   Components: ${componentNames.length} (${passedComponents} clean, ${failedComponents.length} with failures)`);
  console.log(`   Variants captured: ${totalCaptured}/${totalCaptured + totalFailed}`);
  console.log(`   Variants failed: ${totalFailed}`);
  if (failedComponents.length > 0) {
    console.log(`   Failed components:`);
    failedComponents.forEach(c => console.log(`     ${c.name}: ${c.failedVariants.join(', ')}`));
  }
  console.log(`   Summary: ${summaryPath}\n`);

  process.exit(totalFailed > 0 ? 1 : 0);
}

function countChildren(domStructure) {
  if (!domStructure) return 0;
  const children = domStructure.children || [];
  return children.length;
}

function validateCaptureQuality(totalChildCount, screenshotBytes, domStructure, portalContent) {
  if (totalChildCount === 0) {
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
