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
        // For Storybook: prioritize the actual component inside #storybook-root, NOT the body
        let rootElement = null;
        
        // Strategy 1: Storybook - get component inside #storybook-root
        const storyRoot = document.querySelector('#storybook-root');
        if (storyRoot && storyRoot.children.length > 0) {
          rootElement = storyRoot.children[0];
        }
        
        // Strategy 2: Standard React mount points
        if (!rootElement) {
          const selectors = [
            '[data-reactroot]',
            '#root',
            '.docs-story'
          ];
          
          for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el && el.tagName !== 'BODY') {
              rootElement = el;
              break;
            }
          }
        }
        
        if (!rootElement) return [];

        // Try to access React Fiber from multiple possible keys
        let fiber = null;
        let fiberKey = null;
        
        // Method 1: Direct fiber key on element
        const keys = Object.keys(rootElement).filter(key => key.startsWith('__'));
        for (const key of keys) {
          const value = rootElement[key];
          if (value && typeof value === 'object' && (value._owner || value.memoizedProps || value.child)) {
            fiberKey = key;
            fiber = value;
            break;
          }
        }
        
        // Method 2: Search for fiber in element's property chain
        if (!fiber && rootElement._reactRootContainer) {
          fiber = rootElement._reactRootContainer._internalRoot.current;
        }
        
        // Method 3: Look for React DevTools hook
        if (!fiber && window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
          const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
          if (hook.getFiber) {
            fiber = hook.getFiber(rootElement);
          }
        }
        
        // If still no fiber, try all children
        if (!fiber && rootElement.children.length > 0) {
          for (const child of rootElement.children) {
            const childKeys = Object.keys(child).filter(key => key.startsWith('__'));
            for (const key of childKeys) {
              const value = child[key];
              if (value && typeof value === 'object' && (value._owner || value.memoizedProps || value.child)) {
                fiber = value;
                break;
              }
            }
            if (fiber) break;
          }
        }
        
        if (!fiber) return [];

        // Traverse Fiber tree and extract component instances
        const components = [];
        const visited = new Set();
        let rtfIdCounter = 0;

        function traverseFiber(f, depth = 0) {
          if (!f || visited.has(f) || depth > 20) return;
          visited.add(f);

          // Store both component-level and DOM element fibers with useful data
          if (f.type) {
            let name = 'Unknown';
            let elementType = 'Element';
            
            if (typeof f.type === 'function') {
              name = f.type.name || f.type.displayName || 'Component';
              elementType = 'Component';
            } else if (typeof f.type === 'string') {
              elementType = f.type.toUpperCase();
              name = f.type;
            }
            
            const domNode = f.stateNode;
            if (domNode && domNode.getBoundingClientRect && domNode.nodeType === 1) {
              const rect = domNode.getBoundingClientRect();
              const styles = window.getComputedStyle(domNode);

              // Tag DOM elements with React component names for icon resolution
              // PascalCase names = React components (Check, X, Loader2, etc.)
              if (elementType === 'Component' && /^[A-Z]/.test(name) && !domNode.getAttribute('data-rtf-component')) {
                const rtfId = 'rtf-dom-' + (rtfIdCounter++);
                domNode.setAttribute('data-rtf-component', name);
                domNode.setAttribute('data-rtf-id', rtfId);
              }

              components.push({
                name,
                type: elementType,
                tag: f.type.toString ? f.type : elementType,
                props: f.memoizedProps ? Object.keys(f.memoizedProps) : [],
                bounds: {
                  x: Math.round(rect.x),
                  y: Math.round(rect.y),
                  width: Math.round(rect.width),
                  height: Math.round(rect.height)
                },
                styles: {
                  'display': styles.display,
                  'position': styles.position,
                  'background-color': styles.backgroundColor,
                  'color': styles.color,
                  'font-size': styles.fontSize,
                  'flex-direction': styles.flexDirection,
                  'align-items': styles.alignItems,
                  'justify-content': styles.justifyContent,
                  'gap': styles.gap
                }
              });
            }
          }

          // Traverse child fibers
          if (f.child) traverseFiber(f.child, depth + 1);
          if (f.sibling) traverseFiber(f.sibling, depth);
        }

        traverseFiber(fiber);
        return components.length > 0 ? components : [];
      });

      // Extract DOM structure and styles
      const domStructure = await page.evaluate(() => {
        // Look for the main component container
        // For Storybook: prioritize #storybook-root > first child (the actual component)
        // NOT the body/iframe wrapper
        let main = null;
        
        // Strategy 1: Storybook - get the actual component inside #storybook-root
        const storyRoot = document.querySelector('#storybook-root');
        if (storyRoot && storyRoot.children.length > 0) {
          main = storyRoot.children[0];
        }
        
        // Strategy 2: Standard React mount points
        if (!main) {
          const selectors = [
            '[data-reactroot]',
            '#root',
            '.docs-story',
            'body > div:not(.sb-preparing-story):not(.sb-wrapper)'
          ];
          
          for (const selector of selectors) {
            const el = document.querySelector(selector);
            if (el && el.offsetHeight > 0 && el.tagName !== 'BODY') {
              main = el;
              break;
            }
          }
        }
        
        if (!main) main = document.body;

        function getElement(el, depth = 0) {
          if (depth > 15) return null; // Limit depth

          // Skip display:none elements
          const styles = window.getComputedStyle(el);
          if (styles.display === 'none' || styles.visibility === 'hidden') {
            return null;
          }

          const rect = el.getBoundingClientRect();
          
          // Skip elements with zero size (unless they're container-type)
          if (rect.width === 0 && rect.height === 0 && el.children.length === 0) {
            return null;
          }

          const children = [];
          for (const child of Array.from(el.childNodes).slice(0, 30)) {
            if (child.nodeType === 3) {
              const text = child.textContent.trim();
              if (text) children.push({ type: 'TEXT_NODE', text: text.substring(0, 200) });
            } else if (child.nodeType === 1) {
              const mapped = getElement(child, depth + 1);
              if (mapped) children.push(mapped);
            }
          }

          // Capture SVG-specific attributes (d, viewBox, fill, etc.)
          const tagLower = el.tagName.toLowerCase();
          const svgAttrMap = {
            svg: ['viewBox', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'],
            path: ['d'],
            circle: ['cx', 'cy', 'r'],
            line: ['x1', 'y1', 'x2', 'y2'],
            rect: ['x', 'y', 'width', 'height', 'rx', 'ry'],
            polyline: ['points'],
            polygon: ['points']
          };
          const svgAttrsToCapture = svgAttrMap[tagLower];
          const svgAttrs = {};
          if (svgAttrsToCapture) {
            for (const attr of svgAttrsToCapture) {
              const val = el.getAttribute(attr);
              if (val) svgAttrs[attr] = val;
            }
          }

          // Handle SVG className (SVGAnimatedString serializes as {} — use baseVal)
          const rawClassName = el.className;
          const classNameStr = typeof rawClassName === 'string'
            ? rawClassName
            : (rawClassName && rawClassName.baseVal ? rawClassName.baseVal : '');

          // Capture data-rtf-component from fiber walker
          const rtfComponent = el.getAttribute('data-rtf-component');
          const rtfId = el.getAttribute('data-rtf-id');

          return {
            type: 'ELEMENT',
            tag: tagLower,
            id: el.id || undefined,
            className: classNameStr || undefined,
            attrs: Object.keys(svgAttrs).length > 0 ? svgAttrs : undefined,
            'data-rtf-component': rtfComponent || undefined,
            'data-rtf-id': rtfId || undefined,
            role: el.getAttribute('role') || undefined,
            dataState: el.getAttribute('data-state') || undefined,
            aria: Object.fromEntries(
              Array.from(el.attributes)
                .filter(a => a.name.startsWith('aria-'))
                .map(a => [a.name, a.value])
            ),
            text: el.childNodes.length === 1 && el.childNodes[0].nodeType === 3
              ? el.textContent.trim().substring(0, 200)
              : (children.length === 0 && el.textContent.trim() ? el.textContent.trim().substring(0, 200) : null),
            bounds: {
              x: Math.round(rect.x),
              y: Math.round(rect.y),
              width: Math.round(rect.width),
              height: Math.round(rect.height)
            },
            styles: {
              'display': styles.display,
              'position': styles.position,
              'visibility': styles.visibility,
              'opacity': styles.opacity,
              'pointer-events': styles.pointerEvents,
              'overflow-x': styles.overflowX,
              'overflow-y': styles.overflowY,

              'flex-direction': styles.flexDirection,
              'flex-wrap': styles.flexWrap,
              'flex-grow': styles.flexGrow,
              'flex-shrink': styles.flexShrink,
              'flex-basis': styles.flexBasis,
              'align-items': styles.alignItems,
              'align-self': styles.alignSelf,
              'justify-content': styles.justifyContent,
              'gap': styles.gap,
              'row-gap': styles.rowGap,
              'column-gap': styles.columnGap,

              'width': styles.width,
              'height': styles.height,
              'min-width': styles.minWidth,
              'max-width': styles.maxWidth,
              'min-height': styles.minHeight,
              'max-height': styles.maxHeight,

              'padding-top': styles.paddingTop,
              'padding-right': styles.paddingRight,
              'padding-bottom': styles.paddingBottom,
              'padding-left': styles.paddingLeft,
              'margin': styles.margin,

              'background-color': styles.backgroundColor,
              'color': styles.color,

              'font-family': styles.fontFamily,
              'font-size': styles.fontSize,
              'font-weight': styles.fontWeight,
              'font-style': styles.fontStyle,
              'line-height': styles.lineHeight,
              'letter-spacing': styles.letterSpacing,
              'text-align': styles.textAlign,
              'text-decoration': styles.textDecoration,
              'text-overflow': styles.textOverflow,
              'white-space': styles.whiteSpace,

              'border-top-width': styles.borderTopWidth,
              'border-right-width': styles.borderRightWidth,
              'border-bottom-width': styles.borderBottomWidth,
              'border-left-width': styles.borderLeftWidth,
              'border-top-color': styles.borderTopColor,
              'border-right-color': styles.borderRightColor,
              'border-bottom-color': styles.borderBottomColor,
              'border-left-color': styles.borderLeftColor,
              'border-top-left-radius': styles.borderTopLeftRadius,
              'border-top-right-radius': styles.borderTopRightRadius,
              'border-bottom-right-radius': styles.borderBottomRightRadius,
              'border-bottom-left-radius': styles.borderBottomLeftRadius,

              'box-shadow': styles.boxShadow
            },
            children: children.length > 0 ? children : undefined
          };
        }

        return getElement(main);
      });

      // Generate fiber-DOM mapping
      const fiberDomMap = fiberData && fiberData.length > 0
        ? fiberData.map((comp, idx) => ({
            index: idx,
            component: comp.name,
            bounds: comp.bounds,
            type: comp.type
          }))
        : [];

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
