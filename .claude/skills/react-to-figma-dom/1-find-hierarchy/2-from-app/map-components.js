#!/usr/bin/env node

/**
 * map-components.js
 *
 * Crawls a running React app via Playwright, walks the React fiber tree
 * using __REACT_DEVTOOLS_GLOBAL_HOOK__, and outputs:
 *   1. component-map.json — merged component data across all routes (for build-order)
 *   2. pages.json — per-route resolved component trees with props (for page composition)
 *
 * Usage:
 *   node map-components.js --url http://localhost:5173 --output component-map.json [--pages-output pages.json] [--max-routes 50] [--captures-dir path] [--prop-classification path] [--skip-captures]
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const {
  buildFiberDomMap,
  captureDomStructure,
  captureFiberData,
} = require("../../../react-to-figma-dom/scripts/capture-dom-core");

const args = parseArgs(process.argv.slice(2));
const BASE_URL = args.url || "http://localhost:5173";
const OUTPUT_PATH = args.output || "component-map.json";
const PAGES_OUTPUT_PATH =
  args["pages-output"] ||
  path.join(path.dirname(OUTPUT_PATH), "pages.json");
const MAX_ROUTES = parseInt(args["max-routes"] || "50", 10);
const CAPTURES_DIR = args["captures-dir"] || null;
const SKIP_CAPTURES = !!args["skip-captures"];
const PROP_CLASSIFICATION_PATH =
  args["prop-classification"] ||
  path.join(
    process.cwd(),
    ".temp/react-to-figma/component-hierarchy/prop-classification.json"
  );

function loadPropClassification() {
  if (!fs.existsSync(PROP_CLASSIFICATION_PATH)) {
    return null;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(PROP_CLASSIFICATION_PATH, "utf8"));
    return parsed && parsed.components ? parsed.components : null;
  } catch {
    return null;
  }
}

const PROP_CLASSIFICATION = loadPropClassification();

function toTitleCase(input) {
  return String(input)
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function sanitizeVariantDirName(name) {
  return name.replace(/[\\/:*?"<>|]/g, "_").trim();
}

function classifyPropsHeuristic(props) {
  const variantProps = {};
  const textProps = {};
  const dataProps = {};

  const textKeyPattern = /(label|text|title|placeholder|message|caption|content)/i;
  const dataKeyPattern = /^(id|key|ref|className|style)$|^on[A-Z]|^data-|^aria-/;

  for (const [key, value] of Object.entries(props || {})) {
    if (dataKeyPattern.test(key)) {
      dataProps[key] = value;
      continue;
    }

    if (textKeyPattern.test(key) && typeof value === "string") {
      textProps[key] = value;
      continue;
    }

    if (typeof value === "boolean") {
      variantProps[key] = value;
      continue;
    }

    if (
      typeof value === "string" &&
      value.length > 0 &&
      value.length <= 30 &&
      /^[a-zA-Z0-9-_]+$/.test(value)
    ) {
      variantProps[key] = value;
      continue;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
      variantProps[key] = value;
      continue;
    }

    dataProps[key] = value;
  }

  return { variantProps, textProps, dataProps };
}

function classifyProps(componentName, props) {
  const componentCfg = PROP_CLASSIFICATION?.[componentName];
  if (!componentCfg || !Array.isArray(componentCfg.variantProps)) {
    return classifyPropsHeuristic(props);
  }

  const variantKeySet = new Set(componentCfg.variantProps || []);
  const textKeySet = new Set(componentCfg.textProps || []);
  const variantProps = {};
  const textProps = {};
  const dataProps = {};

  for (const [key, value] of Object.entries(props || {})) {
    if (variantKeySet.has(key)) {
      variantProps[key] = value;
    } else if (textKeySet.has(key)) {
      textProps[key] = value;
    } else {
      dataProps[key] = value;
    }
  }

  return { variantProps, textProps, dataProps };
}

function buildVariantName(variantProps) {
  const entries = Object.entries(variantProps || {}).sort(([a], [b]) =>
    a.localeCompare(b)
  );
  if (entries.length === 0) {
    return "Variant Default";
  }
  const parts = ["Variant"];
  for (const [key, value] of entries) {
    parts.push(toTitleCase(key));
    parts.push(toTitleCase(value));
  }
  return parts.join(" ");
}

function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      if (i + 1 < argv.length && !argv[i + 1].startsWith("--")) {
        result[key] = argv[i + 1];
        i++;
      } else {
        result[key] = true;
      }
    }
  }
  return result;
}

async function discoverRoutes(page, baseUrl, visited, maxRoutes) {
  if (visited.size >= maxRoutes) return;

  const hrefs = await page.evaluate((base) => {
    const links = Array.from(document.querySelectorAll("a[href]"));
    return links
      .map((a) => {
        try {
          const url = new URL(a.getAttribute("href"), base);
          if (url.origin === new URL(base).origin) {
            return url.pathname;
          }
        } catch {}
        return null;
      })
      .filter(Boolean);
  }, baseUrl);

  const newRoutes = [...new Set(hrefs)].filter((r) => !visited.has(r));
  for (const route of newRoutes) {
    if (visited.size >= maxRoutes) break;
    visited.add(route);
  }
  return newRoutes;
}

function buildCssSelector(fiberNode) {
  return `[data-testid]`;
}

async function walkFiberTree(page) {
  return await page.evaluate(() => {
    const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
    if (!hook || !hook.getFiberRoots) {
      return { error: "React DevTools hook not available" };
    }

    const components = [];
    const seen = new Set();
    let selectorCounter = 0;

    function getDisplayName(fiber) {
      if (!fiber || !fiber.type) return null;
      if (typeof fiber.type === "string") return null;
      return (
        fiber.type.displayName ||
        fiber.type.name ||
        (fiber.type.render && fiber.type.render.displayName) ||
        (fiber.type.render && fiber.type.render.name) ||
        null
      );
    }

    function isPascalCase(name) {
      return name && /^[A-Z]/.test(name);
    }

    function getSourceInfo(fiber) {
      if (fiber._debugSource) {
        return {
          fileName: fiber._debugSource.fileName,
          lineNumber: fiber._debugSource.lineNumber,
        };
      }
      return null;
    }

    function getCssSelector(fiber) {
      let current = fiber;
      while (current) {
        if (current.stateNode && current.stateNode instanceof HTMLElement) {
          const el = current.stateNode;
          if (el.getAttribute("data-rtf-id")) {
            return `[data-rtf-id="${el.getAttribute("data-rtf-id")}"]`;
          }
          if (el.getAttribute("data-testid")) {
            return `[data-testid="${el.getAttribute("data-testid")}"]`;
          }
          if (el.id) {
            return `#${el.id}`;
          }
          const rtfId = "rtf-" + (selectorCounter++);
          el.setAttribute("data-rtf-id", rtfId);
          return `[data-rtf-id="${rtfId}"]`;
        }
        current = current.child;
      }
      return null;
    }

    function serializeValue(val, depth) {
      if (depth <= 0) return "[Truncated]";
      if (val === null || val === undefined) return val;
      const t = typeof val;
      if (t === "string" || t === "number" || t === "boolean") return val;
      if (t === "function") return "[Function]";
      if (t === "symbol") return "[Symbol]";
      if (val instanceof HTMLElement) return "[HTMLElement]";
      if (val && val.$$typeof) return "[ReactElement]";
      if (val && val.current !== undefined && Object.keys(val).length <= 2)
        return "[Ref]";
      if (Array.isArray(val)) {
        return val.slice(0, 5).map((item) => serializeValue(item, depth - 1));
      }
      if (t === "object") {
        const result = {};
        const keys = Object.keys(val).slice(0, 20);
        for (const k of keys) {
          try {
            result[k] = serializeValue(val[k], depth - 1);
          } catch {
            result[k] = "[Error]";
          }
        }
        return result;
      }
      return "[Unknown]";
    }

    function getSerializableProps(fiber) {
      const props = fiber.memoizedProps;
      if (!props || typeof props !== "object") return {};
      const result = {};
      for (const key of Object.keys(props)) {
        if (key === "children") continue;
        try {
          result[key] = serializeValue(props[key], 4);
        } catch {
          result[key] = "[Error]";
        }
      }
      return result;
    }

    function getChildComponents(fiber) {
      const children = [];
      let child = fiber.child;
      while (child) {
        const name = getDisplayName(child);
        if (name && isPascalCase(name)) {
          children.push(name);
        } else if (child.child) {
          const nested = [];
          let nestedChild = child.child;
          while (nestedChild) {
            const nestedName = getDisplayName(nestedChild);
            if (nestedName && isPascalCase(nestedName)) {
              nested.push(nestedName);
            }
            nestedChild = nestedChild.sibling;
          }
          children.push(...nested);
        }
        child = child.sibling;
      }
      return [...new Set(children)];
    }

    function findParentComponent(fiber) {
      let parent = fiber.return;
      while (parent) {
        const name = getDisplayName(parent);
        if (name && isPascalCase(name)) {
          return name;
        }
        parent = parent.return;
      }
      return null;
    }

    function walkFiber(fiber, depth) {
      if (!fiber || depth > 100) return;

      const name = getDisplayName(fiber);
      if (name && isPascalCase(name)) {
        const source = getSourceInfo(fiber);
        const selector = getCssSelector(fiber);
        const children = getChildComponents(fiber);
        const parent = findParentComponent(fiber);

        const key = name + (source ? `:${source.fileName}` : "");
        if (!seen.has(key)) {
          seen.add(key);
          components.push({
            name,
            sourceFile: source ? source.fileName : null,
            selector,
            children,
            parentComponent: parent,
          });
        }
      }

      walkFiber(fiber.child, depth + 1);
      walkFiber(fiber.sibling, depth);
    }

    function buildPageTree(fiber, depth) {
      if (!fiber || depth > 100) return null;

      const name = getDisplayName(fiber);
      if (name && isPascalCase(name)) {
        const selector = getCssSelector(fiber);
        const props = getSerializableProps(fiber);
        const source = getSourceInfo(fiber);

        const childNodes = [];
        let child = fiber.child;
        while (child) {
          const childTree = buildPageTree(child, depth + 1);
          if (childTree) {
            if (Array.isArray(childTree)) {
              childNodes.push(...childTree);
            } else {
              childNodes.push(childTree);
            }
          }
          child = child.sibling;
        }

        return {
          name,
          props,
          selector: selector || null,
          sourceFile: source ? source.fileName : null,
          children: childNodes,
        };
      }

      const passthrough = [];
      let child = fiber.child;
      while (child) {
        const childTree = buildPageTree(child, depth + 1);
        if (childTree) {
          if (Array.isArray(childTree)) {
            passthrough.push(...childTree);
          } else {
            passthrough.push(childTree);
          }
        }
        child = child.sibling;
      }
      return passthrough.length > 0 ? passthrough : null;
    }

    let pageTree = null;

    for (const rendererID of hook.getFiberRoots(1) || []) {
      if (rendererID && rendererID.current) {
        walkFiber(rendererID.current, 0);
        const tree = buildPageTree(rendererID.current, 0);
        if (tree) {
          pageTree = Array.isArray(tree)
            ? { name: "Root", props: {}, selector: null, sourceFile: null, children: tree }
            : tree;
        }
      }
    }

    if (components.length === 0) {
      const renderersMap =
        hook._fiberRoots || hook.getFiberRoots || hook.renderers;
      if (renderersMap) {
        for (const [id, renderer] of Object.entries(
          hook.renderers || {}
        )) {
          const roots = hook.getFiberRoots(parseInt(id));
          if (roots) {
            for (const root of roots) {
              if (root && root.current) {
                walkFiber(root.current, 0);
                if (!pageTree) {
                  const tree = buildPageTree(root.current, 0);
                  if (tree) {
                    pageTree = Array.isArray(tree)
                      ? { name: "Root", props: {}, selector: null, sourceFile: null, children: tree }
                      : tree;
                  }
                }
              }
            }
          }
        }
      }
    }

    return { components, pageTree };
  });
}

function routeToSlug(route) {
  if (route === "/") return "root";
  return route
    .replace(/^\//, "")
    .replace(/\//g, "-")
    .replace(/[^a-zA-Z0-9-]/g, "_");
}

async function captureRouteContext(
  page,
  route,
  pageTree,
  capturedVariants,
  manifestByComponent,
  captureStats
) {
  const routeSlug = routeToSlug(route);
  const pageDir = path.join(CAPTURES_DIR, "pages", routeSlug);
  fs.mkdirSync(pageDir, { recursive: true });
  await page.screenshot({ path: path.join(pageDir, "screenshot-app.png") });
  captureStats.pages++;

  if (pageTree) {
    await captureTreeNodes(
      page,
      pageTree,
      routeSlug,
      capturedVariants,
      manifestByComponent,
      captureStats
    );
  }
}

async function captureTreeNodes(
  page,
  node,
  routeSlug,
  capturedVariants,
  manifestByComponent,
  captureStats
) {
  if (!node || !node.name) return;

  if (node.selector) {
    const { variantProps, textProps } = classifyProps(node.name, node.props || {});
    const variantName = buildVariantName(variantProps);
    const variantDirName = sanitizeVariantDirName(variantName);
    const perComponentVariants =
      capturedVariants.get(node.name) || new Set();

    if (!capturedVariants.has(node.name)) {
      capturedVariants.set(node.name, perComponentVariants);
    }

    if (!perComponentVariants.has(variantName)) {
      try {
        const locator = page.locator(node.selector).first();
        const isVisible = await locator.isVisible().catch(() => false);
        const box = isVisible
          ? await locator.boundingBox().catch(() => null)
          : null;

        if (box && box.width > 0 && box.height > 0) {
          const compVariantsDir = path.join(
            CAPTURES_DIR,
            "components",
            node.name,
            "app-variants"
          );
          const variantDir = path.join(compVariantsDir, variantDirName);
          fs.mkdirSync(variantDir, { recursive: true });

          await locator.screenshot({
            path: path.join(variantDir, "screenshot.png"),
            timeout: 5000,
          });

          const fiberData = await captureFiberData(page, {
            rootSelector: node.selector,
          });
          const domStructure = await captureDomStructure(page, {
            rootSelector: node.selector,
          });

          const viewport = page.viewportSize() || { width: 1440, height: 900 };
          const domData = {
            structure: domStructure,
            fibers: fiberData?.length ? fiberData : null,
            portalContent: undefined,
            timestamp: new Date().toISOString(),
            viewport,
            sourceRoute: routeSlug,
            sourceProps: {
              variantProps,
              textProps,
            },
          };

          fs.writeFileSync(
            path.join(variantDir, "dom.json"),
            JSON.stringify(domData, null, 2)
          );
          fs.writeFileSync(
            path.join(variantDir, "fiber-dom-map.json"),
            JSON.stringify(buildFiberDomMap(fiberData), null, 2)
          );

          const manifest = manifestByComponent.get(node.name) || {
            component: node.name,
            timestamp: new Date().toISOString(),
            source: "app-crawl",
            total: 0,
            captured: [],
            failed: [],
          };
          manifest.captured.push({
            exportName: variantName,
            variant: variantName,
            sourceRoute: routeSlug,
            timestamp: new Date().toISOString(),
          });
          manifest.total = manifest.captured.length + manifest.failed.length;
          manifestByComponent.set(node.name, manifest);

          perComponentVariants.add(variantName);
          captureStats.components++;
          console.log(`    Captured: ${node.name} -> ${variantName} (${routeSlug})`);
        }
      } catch (err) {
        captureStats.failed++;

        const manifest = manifestByComponent.get(node.name) || {
          component: node.name,
          timestamp: new Date().toISOString(),
          source: "app-crawl",
          total: 0,
          captured: [],
          failed: [],
        };
        manifest.failed.push({
          exportName: variantName,
          variant: variantName,
          sourceRoute: routeSlug,
          error: err.message,
          timestamp: new Date().toISOString(),
        });
        manifest.total = manifest.captured.length + manifest.failed.length;
        manifestByComponent.set(node.name, manifest);

        console.warn(
          `    Warning: Capture failed for ${node.name} -> ${variantName} at ${routeSlug}: ${err.message}`
        );
      }
    }
  }

  for (const child of node.children || []) {
    await captureTreeNodes(
      page,
      child,
      routeSlug,
      capturedVariants,
      manifestByComponent,
      captureStats
    );
  }
}

async function main() {
  console.log(`Crawling ${BASE_URL} (max ${MAX_ROUTES} routes)...`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  await page.addInitScript(() => {
    if (!window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      const fiberRoots = new Map();
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
        supportsFiber: true,
        renderers: new Map(),
        onCommitFiberRoot(rendererID, root) {
          if (!fiberRoots.has(rendererID)) {
            fiberRoots.set(rendererID, new Set());
          }
          fiberRoots.get(rendererID).add(root);
        },
        onCommitFiberUnmount() {},
        onScheduleFiberRoot() {},
        inject(renderer) {
          const id = fiberRoots.size + 1;
          this.renderers.set(id, renderer);
          return id;
        },
        getFiberRoots(rendererID) {
          return fiberRoots.get(rendererID) || new Set();
        },
      };
    }
  });

  const visited = new Set(["/"]);
  const allComponents = new Map();
  const pageTrees = {};
  const routeQueue = ["/"];
  const capturedVariants = new Map();
  const manifestByComponent = new Map();
  const captureStats = { pages: 0, components: 0, failed: 0 };

  while (routeQueue.length > 0) {
    const route = routeQueue.shift();
    const url = new URL(route, BASE_URL).href;
    console.log(`  Visiting: ${route}`);

    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForTimeout(500);

      const result = await walkFiberTree(page);

      if (result.error) {
        console.error(`  Error on ${route}: ${result.error}`);
        continue;
      }

      if (result.pageTree) {
        pageTrees[route] = {
          url: route,
          tree: result.pageTree,
        };
      }

      for (const comp of result.components || []) {
        const existing = allComponents.get(comp.name);
        if (existing) {
          if (!existing.routes.includes(route)) {
            existing.routes.push(route);
          }
          if (comp.selector && !existing.selector) {
            existing.selector = comp.selector;
          }
          if (comp.sourceFile && !existing.sourceFile) {
            existing.sourceFile = comp.sourceFile;
          }
          for (const child of comp.children || []) {
            if (!existing.children.includes(child)) {
              existing.children.push(child);
            }
          }
        } else {
          allComponents.set(comp.name, {
            name: comp.name,
            sourceFile: comp.sourceFile,
            selector: comp.selector,
            routes: [route],
            children: comp.children || [],
            parentComponent: comp.parentComponent,
          });
        }
      }

      if (CAPTURES_DIR && !SKIP_CAPTURES) {
        await captureRouteContext(
          page,
          route,
          result.pageTree,
          capturedVariants,
          manifestByComponent,
          captureStats
        );
      }

      const newRoutes = await discoverRoutes(page, BASE_URL, visited, MAX_ROUTES);
      for (const r of newRoutes || []) {
        if (!routeQueue.includes(r)) {
          routeQueue.push(r);
        }
      }
    } catch (err) {
      console.error(`  Failed to crawl ${route}: ${err.message}`);
    }
  }

  await browser.close();

  const componentArray = Array.from(allComponents.values()).map((comp) => {
    let sourceType = "project";
    if (comp.sourceFile) {
      if (comp.sourceFile.includes("node_modules")) {
        sourceType = "npm";
      } else if (
        comp.sourceFile.includes("/ui/") ||
        comp.sourceFile.includes("/components/ui/")
      ) {
        sourceType = "ui-library";
      }
    }
    return { ...comp, sourceType };
  });

  const output = {
    schemaVersion: "react-to-figma-component-map@1",
    discoveryMethod: "app-crawl",
    devServerUrl: BASE_URL,
    routesCrawled: Array.from(visited),
    routeCount: visited.size,
    componentCount: componentArray.length,
    components: componentArray,
  };

  const outputDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));

  const allRoutes = Object.keys(pageTrees);
  const topLevelByRoute = allRoutes.map((r) => {
    const tree = pageTrees[r].tree;
    const names = tree.children
      ? tree.children.map((c) => c.name)
      : [tree.name];
    return new Set(names);
  });
  const layoutComponents =
    topLevelByRoute.length > 0
      ? [...topLevelByRoute[0]].filter((name) =>
          topLevelByRoute.every((s) => s.has(name))
        )
      : [];

  const pagesOutput = {
    schemaVersion: "react-to-figma-pages@1",
    devServerUrl: BASE_URL,
    routeCount: allRoutes.length,
    layoutComponents,
    pages: pageTrees,
  };

  const pagesOutputDir = path.dirname(PAGES_OUTPUT_PATH);
  if (!fs.existsSync(pagesOutputDir)) {
    fs.mkdirSync(pagesOutputDir, { recursive: true });
  }
  fs.writeFileSync(PAGES_OUTPUT_PATH, JSON.stringify(pagesOutput, null, 2));

  if (CAPTURES_DIR && !SKIP_CAPTURES) {
    for (const [componentName, manifest] of manifestByComponent.entries()) {
      const manifestDir = path.join(
        CAPTURES_DIR,
        "components",
        componentName,
        "app-variants"
      );
      fs.mkdirSync(manifestDir, { recursive: true });
      fs.writeFileSync(
        path.join(manifestDir, "capture-manifest.json"),
        JSON.stringify(manifest, null, 2)
      );
    }
  }

  const fromAppDir = path.join(path.dirname(OUTPUT_PATH), "from-app");
  fs.mkdirSync(fromAppDir, { recursive: true });

  const byType = { project: [], "ui-library": [], npm: [], "runtime-only": [] };
  for (const c of componentArray) {
    const resolvedPath = c.sourceFile
      ? c.sourceFile.replace(/^.*\/carton-case-management\//, "")
      : null;

    if (!c.sourceFile) {
      byType["runtime-only"].push(c);
    } else if (c.sourceType === "ui-library") {
      byType["ui-library"].push({ ...c, resolvedPath });
    } else if (c.sourceType === "npm") {
      byType["npm"].push({ ...c, resolvedPath });
    } else {
      byType["project"].push({ ...c, resolvedPath });
    }
  }

  const componentsJson = {
    schemaVersion: 'react-to-figma-components@1',
    discoveryMethod: 'app-crawl',
    devServerUrl: BASE_URL,
    routesCrawled: visited.size,
    componentCount: componentArray.length,
    components: componentArray.map(c => {
      const resolvedPath = c.sourceFile
        ? c.sourceFile.replace(/^.*\/carton-case-management\//, "")
        : null;
      return {
        name: c.name,
        path: resolvedPath || '(runtime-only — no file found)',
        sourceType: !c.sourceFile ? 'project' : c.sourceType,
        exportType: 'named',
      };
    }),
  };

  fs.writeFileSync(path.join(fromAppDir, "components.json"), JSON.stringify(componentsJson, null, 2));

  const barrelMapMd = `# Barrel Re-export Map\n\nDiscovery method: app-crawl (barrel map not available — use from-files strategy for barrel resolution)\n`;
  fs.writeFileSync(path.join(fromAppDir, "barrel-map.md"), barrelMapMd);

  const typeCounts = {};
  for (const [type, list] of Object.entries(byType)) {
    if (list.length > 0) typeCounts[type] = list.length;
  }

  console.log(`\nDiscovery complete.`);
  console.log(`  Routes crawled: ${visited.size}`);
  console.log(`  Components found: ${componentArray.length}`);
  console.log(`  Page trees captured: ${allRoutes.length}`);
  console.log(`  Layout components: ${layoutComponents.join(", ") || "(none)"}`);
  console.log(`  Component map: ${OUTPUT_PATH}`);
  console.log(`  Pages output: ${PAGES_OUTPUT_PATH}`);
  console.log(`  Components JSON: ${path.join(fromAppDir, "components.json")}`);
  if (CAPTURES_DIR && !SKIP_CAPTURES) {
    console.log(`  Captures:`);
    console.log(`    Page screenshots: ${captureStats.pages}`);
    console.log(`    Component captures: ${captureStats.components}`);
    console.log(`    Failed captures: ${captureStats.failed}`);
    console.log(`    Captures dir: ${CAPTURES_DIR}`);
  }
  for (const [type, count] of Object.entries(typeCounts)) {
    console.log(`    ${type}: ${count}`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
