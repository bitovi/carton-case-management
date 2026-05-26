#!/usr/bin/env node

/**
 * capture-dom.js
 *
 * Captures structured DOM tree, computed CSS, React fiber data, and screenshots
 * from Storybook stories. Outputs machine-readable JSON for the deterministic
 * DOM-to-Figma pipeline.
 *
 * Usage:
 *   node capture-dom.js \
 *     --component Badge \
 *     --storybook-url http://localhost:6006 \
 *     --output-dir .temp/react-to-figma/components/Badge/variants \
 *     [--story-prefix figma-variants-badge] \
 *     [--timeout 15000] \
 *     [--play-wait 800]
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const FIGMA_CSS_PROPS = [
  'width', 'height', 'min-width', 'min-height', 'max-width', 'max-height',
  'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'gap', 'row-gap', 'column-gap',
  'display', 'flex-direction', 'align-items', 'justify-content', 'flex-wrap',
  'flex-grow', 'flex-shrink', 'flex-basis', 'align-self',
  'position', 'top', 'right', 'bottom', 'left',
  'color', 'background-color', 'opacity',
  'border-top-width', 'border-right-width', 'border-bottom-width', 'border-left-width',
  'border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color',
  'border-top-left-radius', 'border-top-right-radius', 'border-bottom-right-radius', 'border-bottom-left-radius',
  'box-shadow', 'text-shadow',
  'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing',
  'text-align', 'text-decoration', 'text-overflow', 'white-space',
  'overflow-x', 'overflow-y',
];

const STORYBOOK_WRAPPER_NAMES = new Set([
  'Story', 'Canvas', 'ThemeProvider', 'MemoryRouter', 'Router',
  'BrowserRouter', 'QueryClientProvider', 'TrpcProvider', 'Provider',
  'StoryFn', 'Unstyled', 'MDXContent', 'DocsPage',
]);

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
      case '--component': opts.component = args[++i]; break;
      case '--storybook-url': opts.storybookUrl = args[++i]; break;
      case '--output-dir': opts.outputDir = args[++i]; break;
      case '--story-prefix': opts.storyPrefix = args[++i]; break;
      case '--timeout': opts.timeout = parseInt(args[++i], 10); break;
      case '--play-wait': opts.playWait = parseInt(args[++i], 10); break;
      default: break;
    }
  }

  if (!opts.component) {
    console.error('Error: --component is required');
    process.exit(1);
  }

  if (!opts.storyPrefix) {
    const kebab = opts.component.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    opts.storyPrefix = `figma-variants-${kebab}`;
  }

  if (!opts.outputDir) {
    opts.outputDir = `.temp/react-to-figma/components/${opts.component}/variants`;
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

async function walkFiberAndTagDom(page) {
  return await page.evaluate((wrapperNames) => {
    const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!hook || !hook.getFiberRoots) {
      return { success: false, error: 'React DevTools hook not available', components: {} };
    }

    const components = {};
    let idCounter = 0;

    function getDisplayName(fiber) {
      if (!fiber || !fiber.type) return null;
      if (typeof fiber.type === 'string') return null;
      const type = fiber.type;
      return (
        type.displayName ||
        type.name ||
        (type.render && (type.render.displayName || type.render.name)) ||
        (type.type && (type.type.displayName || type.type.name)) ||
        (type.type && type.type.render && (type.type.render.displayName || type.type.render.name)) ||
        null
      );
    }

    function isPascalCase(name) {
      return name && /^[A-Z]/.test(name);
    }

    function isWrapper(name) {
      return wrapperNames.includes(name);
    }

    function getDomNode(fiber) {
      let current = fiber;
      while (current) {
        if (current.stateNode && (current.stateNode instanceof HTMLElement || current.stateNode instanceof SVGElement)) {
          return current.stateNode;
        }
        current = current.child;
      }
      return null;
    }

    function serializeProps(fiber) {
      const props = fiber.memoizedProps;
      if (!props || typeof props !== 'object') return {};
      const result = {};
      for (const key of Object.keys(props)) {
        if (key === 'children') continue;
        const val = props[key];
        const t = typeof val;
        if (t === 'string' || t === 'number' || t === 'boolean') {
          result[key] = val;
        } else if (val === null || val === undefined) {
          result[key] = val;
        }
      }
      return result;
    }

    function walkFiber(fiber, depth, insideTarget) {
      if (!fiber || depth > 50) return;

      const name = getDisplayName(fiber);

      if (name && isPascalCase(name) && !isWrapper(name) && insideTarget) {
        const domNode = getDomNode(fiber);
        if (domNode && !domNode.getAttribute('data-rtf-component')) {
          const rtfId = 'rtf-dom-' + (idCounter++);
          domNode.setAttribute('data-rtf-component', name);
          domNode.setAttribute('data-rtf-id', rtfId);
          components[rtfId] = {
            componentName: name,
            props: serializeProps(fiber),
          };
        }
      }

      let child = fiber.child;
      while (child) {
        walkFiber(child, depth + 1, insideTarget || (name && isPascalCase(name) && !isWrapper(name)));
        child = child.sibling;
      }
    }

    const roots = hook.getFiberRoots ? hook.getFiberRoots(1) : null;
    if (!roots) {
      return { success: false, error: 'No fiber roots found', components: {} };
    }

    for (const root of roots) {
      if (root && root.current) {
        walkFiber(root.current, 0, false);
      }
    }

    return { success: true, error: null, components };
  }, [...STORYBOOK_WRAPPER_NAMES]);
}

async function captureDomTree(page) {
  return await page.evaluate((cssProps) => {
    const root =
      document.querySelector('#storybook-root') ||
      document.querySelector('#root') ||
      document.body;

    if (!root || !root.firstElementChild) {
      return null;
    }

    const target = root.firstElementChild;

    function buildNode(el, depth) {
      if (!el || depth > 15) return null;

      if (el.nodeType === 3) {
        const text = el.textContent ? el.textContent.trim() : '';
        if (!text) return null;
        return { type: 'TEXT_NODE', text };
      }

      if (el.nodeType !== 1) return null;

      const tag = el.tagName.toLowerCase();
      const cs = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      const styles = {};
      for (const prop of cssProps) {
        const val = cs.getPropertyValue(prop);
        if (val && val !== 'none' && val !== 'normal' && val !== 'auto' &&
            val !== '0px' && val !== 'rgba(0, 0, 0, 0)' && val !== 'start' &&
            val !== '0' && val !== '0%') {
          styles[prop] = val;
        }
      }

      const attrs = {};
      if (el.id) attrs.id = el.id;
      if (el.className) {
        // SVG elements have SVGAnimatedString for className, use baseVal
        const classStr = typeof el.className === 'string'
          ? el.className
          : (el.className.baseVal || '');
        if (classStr.trim()) attrs.class = classStr.trim();
      }
      const role = el.getAttribute('role');
      if (role) attrs.role = role;
      const ariaLabel = el.getAttribute('aria-label');
      if (ariaLabel) attrs['aria-label'] = ariaLabel;
      const dataState = el.getAttribute('data-state');
      if (dataState) attrs['data-state'] = dataState;
      if (el.getAttribute('disabled') !== null) attrs.disabled = true;

      const rtfComponent = el.getAttribute('data-rtf-component');
      const rtfId = el.getAttribute('data-rtf-id');
      if (rtfComponent) attrs['data-rtf-component'] = rtfComponent;
      if (rtfId) attrs['data-rtf-id'] = rtfId;

      const SVG_ATTR_TAGS = { svg: ['viewBox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'], path: ['d'], circle: ['cx', 'cy', 'r'], line: ['x1', 'y1', 'x2', 'y2'], rect: ['x', 'y', 'width', 'height', 'rx', 'ry'], polyline: ['points'], polygon: ['points'] };
      const svgAttrs = SVG_ATTR_TAGS[tag];
      if (svgAttrs) {
        for (const attr of svgAttrs) {
          const val = el.getAttribute(attr);
          if (val) attrs[attr] = val;
        }
      }

      const children = [];
      for (const child of el.childNodes) {
        const node = buildNode(child, depth + 1);
        if (node) children.push(node);
      }

      const INLINE_TEXT_TAGS = new Set([
        'span', 'p', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'label', 'button', 'td', 'th', 'li', 'em', 'strong', 'b', 'i', 'small',
      ]);
      if (children.length === 0 && INLINE_TEXT_TAGS.has(tag)) {
        const directText = el.textContent ? el.textContent.trim() : '';
        if (directText) {
          children.push({ type: 'TEXT_NODE', text: directText });
        }
      }

      const VOID_FORM_TAGS = new Set(['input', 'textarea', 'select']);
      if (children.length === 0 && VOID_FORM_TAGS.has(tag)) {
        let formValue = '';
        if (tag === 'select') {
          const selected = el.options && el.options[el.selectedIndex];
          formValue = selected ? selected.text.trim() : '';
        } else {
          formValue = el.value || '';
        }
        if (!formValue) {
          formValue = el.getAttribute('placeholder') || '';
        }
        if (formValue) {
          children.push({ type: 'TEXT_NODE', text: formValue });
        }
      }

      return {
        type: 'ELEMENT',
        tag,
        attrs,
        styles,
        bbox: {
          x: Math.round(rect.x * 100) / 100,
          y: Math.round(rect.y * 100) / 100,
          width: Math.round(rect.width * 100) / 100,
          height: Math.round(rect.height * 100) / 100,
        },
        children,
      };
    }

    return buildNode(target, 0);
  }, FIGMA_CSS_PROPS);
}

async function captureHtmlMarkdown(page) {
  return await page.evaluate(() => {
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
      const role = el.getAttribute('role');
      if (role) attrs.push('role="' + role + '"');
      const ariaLabel = el.getAttribute('aria-label');
      if (ariaLabel) attrs.push('aria-label="' + ariaLabel + '"');
      const dataState = el.getAttribute('data-state');
      if (dataState) attrs.push('data-state="' + dataState + '"');
      if (el.getAttribute('disabled') !== null) attrs.push('disabled');
      const rtfComponent = el.getAttribute('data-rtf-component');
      if (rtfComponent) attrs.push('data-rtf-component="' + rtfComponent + '"');

      const attrStr = attrs.length ? ' ' + attrs.join(' ') : '';
      let result = indent + '<' + tag + attrStr + '>\n';
      for (const child of el.childNodes) {
        result += serialize(child, depth + 1);
      }
      result += indent + '</' + tag + '>\n';
      return result;
    }

    return serialize(root, 0);
  });
}

async function captureCssMarkdown(page) {
  return await page.evaluate((cssProps) => {
    const root =
      document.querySelector('#storybook-root') ||
      document.querySelector('#root') ||
      document.body;

    function extract(el, depth) {
      if (!el || el.nodeType !== 1 || depth > 8) return '';
      const indent = '  '.repeat(depth);
      const tag = el.tagName.toLowerCase();
      const cs = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

      let result = indent + tag;
      if (el.className && typeof el.className === 'string') {
        const shortClass = el.className.split(' ').slice(0, 3).join(' ');
        result += ' .' + shortClass;
      }
      result += ' (' + Math.round(rect.width) + 'x' + Math.round(rect.height) + ')\n';

      for (const prop of cssProps) {
        const val = cs.getPropertyValue(prop);
        if (val && val !== 'none' && val !== 'normal' && val !== 'auto' &&
            val !== '0px' && val !== 'rgba(0, 0, 0, 0)' && val !== 'start') {
          result += indent + '  ' + prop + ': ' + val + '\n';
        }
      }

      for (const child of el.children) {
        result += extract(child, depth + 1);
      }
      return result;
    }

    return extract(root, 0);
  }, FIGMA_CSS_PROPS);
}

async function captureScreenshot(page, outputPath) {
  let elementScreenshot = false;
  try {
    const root = await page.$('#storybook-root') || await page.$('#root');
    if (root) {
      const child = await root.$(':first-child');
      if (child) {
        const box = await child.boundingBox();
        if (box && box.width > 1 && box.height > 1) {
          await child.screenshot({ path: outputPath });
          elementScreenshot = true;
        }
      }
    }
  } catch (_) {}

  if (!elementScreenshot) {
    await page.screenshot({ path: outputPath, fullPage: false });
  }
  return elementScreenshot;
}

async function captureVariant(page, storyUrl, exportName, outputDir, opts) {
  await page.goto(storyUrl, { waitUntil: 'load', timeout: opts.timeout });
  await page.waitForTimeout(opts.playWait);

  await page.waitForFunction(() => {
    const root = document.querySelector('#storybook-root') || document.querySelector('#root');
    return root && root.children.length > 0;
  }, { timeout: 5000 }).catch(() => {});

  const renderError = await page.evaluate(() => {
    const root = document.querySelector('#storybook-root') || document.querySelector('#root');
    const inner = root ? root.innerHTML.replace(/<!--[\s\S]*?-->/g, '').trim() : '';
    if (inner && inner !== '<div></div>' && inner.length >= 10) return null;

    const errorDisplay = document.querySelector('#error-message, .sb-errordisplay, [id*="error"]');
    if (errorDisplay && errorDisplay.textContent && errorDisplay.textContent.trim().length > 0) {
      return errorDisplay.textContent.trim().slice(0, 300);
    }
    const bodyText = document.body.innerText || '';
    if (bodyText.includes('Failed to fetch dynamically imported module')) {
      return 'Failed to fetch dynamically imported module';
    }
    if (bodyText.includes('TypeError') || bodyText.includes('Error')) {
      return bodyText.slice(0, 300);
    }
    return 'Storybook root is empty';
  });

  if (renderError) {
    throw new Error(`Render failed: ${renderError}`);
  }

  const fiberResult = await walkFiberAndTagDom(page);

  let domTree = await captureDomTree(page);
  if (!domTree) {
    throw new Error('Failed to capture DOM tree — root element empty');
  }

  if (domTree.tag === 'body' || domTree.tag === 'html') {
    const candidates = (domTree.children || []).filter((c) => {
      if (c.type !== 'ELEMENT') return false;
      const b = c.bbox || {};
      return b.width > 0 && b.height > 0;
    });
    if (candidates.length === 1) {
      console.warn(`    [warn] DOM root was <${domTree.tag}>, re-rooting to <${candidates[0].tag}>`);
      domTree = candidates[0];
    } else if (candidates.length > 1) {
      candidates.sort((a, b) => {
        const aArea = (a.bbox.width || 0) * (a.bbox.height || 0);
        const bArea = (b.bbox.width || 0) * (b.bbox.height || 0);
        return bArea - aArea;
      });
      console.warn(`    [warn] DOM root was <${domTree.tag}> with ${candidates.length} visible children, re-rooting to largest`);
      domTree = candidates[0];
    }
  }

  const variantDir = path.join(outputDir, exportName);
  fs.mkdirSync(variantDir, { recursive: true });

  const screenshotPath = path.join(variantDir, 'screenshot.png');
  await captureScreenshot(page, screenshotPath);

  const domPath = path.join(variantDir, 'dom.json');
  fs.writeFileSync(domPath, JSON.stringify(domTree, null, 2));

  const fiberMapPath = path.join(variantDir, 'fiber-dom-map.json');
  fs.writeFileSync(fiberMapPath, JSON.stringify(fiberResult.components, null, 2));

  const htmlContent = await captureHtmlMarkdown(page);
  const htmlPath = path.join(variantDir, 'html.md');
  fs.writeFileSync(htmlPath, `# HTML Structure: ${exportName}\n\n\`\`\`html\n${htmlContent}\n\`\`\`\n`);

  const cssContent = await captureCssMarkdown(page);
  const cssPath = path.join(variantDir, 'styles.md');
  fs.writeFileSync(cssPath, `# Computed CSS: ${exportName}\n\n\`\`\`\n${cssContent}\n\`\`\`\n`);

  return {
    screenshotPath,
    domPath,
    fiberMapPath,
    htmlPath,
    cssPath,
    fiberSuccess: fiberResult.success,
    fiberError: fiberResult.error,
    componentCount: Object.keys(fiberResult.components).length,
  };
}

async function main() {
  const opts = parseArgs();
  const storybookUrl = opts.storybookUrl.replace(/\/$/, '');

  console.log(`\nCapturing DOM for ${opts.component} from ${storybookUrl}`);
  console.log(`Output: ${opts.outputDir}\n`);

  const entries = await fetchStoryIndex(storybookUrl);
  const storyIds = Object.keys(entries).filter(
    (id) => id.startsWith(opts.storyPrefix + '--') && !id.endsWith('--docs')
  );

  if (storyIds.length === 0) {
    console.error(`No stories found matching prefix "${opts.storyPrefix}". Available:`);
    const prefixes = [...new Set(Object.keys(entries).map((id) => id.replace(/--[^-].*$/, '')))];
    prefixes.sort().forEach((p) => console.error(`  ${p}`));
    process.exit(1);
  }

  console.log(`Found ${storyIds.length} stories matching "${opts.storyPrefix}"\n`);
  fs.mkdirSync(opts.outputDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1024, height: 768 });

  await page.addInitScript(() => {
    if (!window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      let nextRendererId = 1;
      const fiberRoots = new Map();
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
        supportsFiber: true,
        inject: function(renderer) {
          const id = nextRendererId++;
          fiberRoots.set(id, new Set());
          return id;
        },
        onCommitFiberRoot: function(rendererId, root) {
          let roots = fiberRoots.get(rendererId);
          if (!roots) {
            roots = new Set();
            fiberRoots.set(rendererId, roots);
          }
          roots.add(root);
        },
        onCommitFiberUnmount: function() {},
        onPostCommitFiberRoot: function() {},
        getFiberRoots: function(rendererId) {
          return fiberRoots.get(rendererId) || new Set();
        },
        renderers: new Map(),
        checkDCE: function() {},
      };
    }
  });

  const manifest = {
    component: opts.component,
    storyPrefix: opts.storyPrefix,
    storybookUrl,
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
      process.stdout.write(`  ${exportName} ... `);
      const result = await captureVariant(page, storyUrl, exportName, opts.outputDir, opts);
      manifest.successful++;
      manifest.captures.push({
        storyId,
        exportName,
        storyUrl,
        status: 'ok',
        files: result,
        fiberSuccess: result.fiberSuccess,
        componentCount: result.componentCount,
      });
      const fiberTag = result.fiberSuccess ? `fiber:${result.componentCount}` : 'no-fiber';
      console.log(`ok (${fiberTag})`);
    } catch (error) {
      console.log(`FAILED: ${error.message}`);
      manifest.failed.push({ storyId, exportName, storyUrl, error: error.message });
    }
  }

  await browser.close();

  const manifestPath = path.join(opts.outputDir, 'capture-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`\nCapture summary:`);
  console.log(`  Total: ${manifest.total}`);
  console.log(`  OK: ${manifest.successful}`);
  console.log(`  Failed: ${manifest.failed.length}`);
  if (manifest.failed.length > 0) {
    manifest.failed.forEach((f) => console.log(`    ✗ ${f.exportName}: ${f.error}`));
  }
  console.log(`\nManifest: ${manifestPath}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
