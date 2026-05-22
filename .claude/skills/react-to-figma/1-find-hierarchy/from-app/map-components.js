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
 *   node map-components.js --url http://localhost:5173 --output component-map.json [--pages-output pages.json] [--max-routes 50] [--captures-dir path] [--max-captures-per-component 3] [--skip-captures]
 */

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const args = parseArgs(process.argv.slice(2));
const BASE_URL = args.url || "http://localhost:5173";
const OUTPUT_PATH = args.output || "component-map.json";
const PAGES_OUTPUT_PATH =
  args["pages-output"] ||
  path.join(path.dirname(OUTPUT_PATH), "pages.json");
const MAX_ROUTES = parseInt(args["max-routes"] || "50", 10);
const CAPTURES_DIR = args["captures-dir"] || null;
const MAX_CAPTURES_PER_COMPONENT = parseInt(
  args["max-captures-per-component"] || "3",
  10
);
const SKIP_CAPTURES = !!args["skip-captures"];

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
  captureCount,
  captureStats
) {
  const routeSlug = routeToSlug(route);
  const pageDir = path.join(CAPTURES_DIR, "pages", routeSlug);
  fs.mkdirSync(pageDir, { recursive: true });
  await page.screenshot({ path: path.join(pageDir, "screenshot-app.png") });
  captureStats.pages++;

  if (pageTree) {
    const capturedThisRoute = new Set();
    await captureTreeNodes(
      page,
      pageTree,
      routeSlug,
      captureCount,
      capturedThisRoute,
      captureStats
    );
  }
}

async function captureTreeNodes(
  page,
  node,
  routeSlug,
  captureCount,
  capturedThisRoute,
  captureStats
) {
  if (!node || !node.name) return;

  if (node.selector && !capturedThisRoute.has(node.name)) {
    const count = captureCount.get(node.name) || 0;
    if (count < MAX_CAPTURES_PER_COMPONENT) {
      try {
        const locator = page.locator(node.selector).first();
        const isVisible = await locator.isVisible().catch(() => false);
        const box = isVisible ? await locator.boundingBox().catch(() => null) : null;
        if (box && box.width > 0 && box.height > 0) {
          const childSelectors = (node.children || [])
            .map((c) => c.selector)
            .filter(Boolean);
          const compDir = path.join(
            CAPTURES_DIR,
            "components",
            node.name,
            "app-context"
          );
          fs.mkdirSync(compDir, { recursive: true });

          await locator.screenshot({
            path: path.join(compDir, `${routeSlug}.element.png`),
            timeout: 5000,
          });

          const result = await extractComponentDom(
            page,
            node.selector,
            childSelectors
          );

          if (result) {
            const htmlContent =
              `# ${node.name} \u2014 HTML Structure at ${routeSlug}\n\n` +
              "```html\n" +
              result.html +
              "```\n";
            fs.writeFileSync(
              path.join(compDir, `${routeSlug}.html.md`),
              htmlContent
            );

            let stylesContent = `# ${node.name} \u2014 Computed Styles at ${routeSlug}\n\n`;
            for (const entry of result.styleEntries) {
              stylesContent += `## ${entry.label}\n`;
              for (const [prop, val] of Object.entries(entry.styles)) {
                stylesContent += `- ${prop}: ${val}\n`;
              }
              stylesContent += "\n";
            }
            fs.writeFileSync(
              path.join(compDir, `${routeSlug}.styles.md`),
              stylesContent
            );
          }

          capturedThisRoute.add(node.name);
          captureCount.set(node.name, count + 1);
          captureStats.components++;
          console.log(
            `    Captured: ${node.name} at ${routeSlug} (${count + 1}/${MAX_CAPTURES_PER_COMPONENT})`
          );
        }
      } catch (err) {
        captureStats.failed++;
        console.warn(
          `    Warning: Capture failed for ${node.name} at ${routeSlug}: ${err.message}`
        );
      }
    }
  }

  for (const child of node.children || []) {
    await captureTreeNodes(
      page,
      child,
      routeSlug,
      captureCount,
      capturedThisRoute,
      captureStats
    );
  }
}

async function extractComponentDom(page, selector, childSelectors) {
  return await page.evaluate(
    ({ sel, childSels }) => {
      const root = document.querySelector(sel);
      if (!root) return null;

      const STYLE_PROPS = [
        "display", "flexDirection", "flexWrap", "alignItems", "justifyContent",
        "gap", "rowGap", "columnGap",
        "width", "height", "minWidth", "minHeight", "maxWidth", "maxHeight",
        "padding", "paddingTop", "paddingRight", "paddingBottom", "paddingLeft",
        "margin", "marginTop", "marginRight", "marginBottom", "marginLeft",
        "overflow", "overflowX", "overflowY", "position",
        "color", "backgroundColor",
        "borderWidth", "borderTopWidth", "borderRightWidth",
        "borderBottomWidth", "borderLeftWidth",
        "borderColor", "borderStyle", "borderRadius",
        "borderTopLeftRadius", "borderTopRightRadius",
        "borderBottomLeftRadius", "borderBottomRightRadius",
        "boxShadow", "opacity",
        "fontFamily", "fontSize", "fontWeight", "fontStyle",
        "lineHeight", "letterSpacing", "textAlign", "textDecoration",
        "textTransform", "whiteSpace", "textOverflow",
      ];

      function isBoundary(el) {
        if (el === root) return false;
        for (const cs of childSels) {
          try {
            if (el.matches(cs)) return true;
          } catch {}
        }
        return false;
      }

      function sigOf(el) {
        return (
          el.tagName +
          "|" +
          (el.className || "") +
          "|" +
          (el.getAttribute("role") || "")
        );
      }

      function keyAttrs(el) {
        const out = [];
        const names = [
          "id", "role", "aria-label", "aria-expanded", "aria-selected",
          "aria-checked", "aria-disabled", "data-testid", "data-state",
          "type", "name", "placeholder", "href",
        ];
        for (const a of names) {
          const v = el.getAttribute(a);
          if (v !== null) out.push(a + '="' + v + '"');
        }
        return out;
      }

      function elLabel(el) {
        const tag = el.tagName.toLowerCase();
        const cls =
          typeof el.className === "string" && el.className.trim()
            ? "." +
              el.className
                .trim()
                .split(/\s+/)
                .slice(0, 3)
                .join(".")
            : "";
        const role = el.getAttribute("role")
          ? ' [role="' + el.getAttribute("role") + '"]'
          : "";
        return tag + cls + role;
      }

      function serHtml(node, indent, depth) {
        if (depth > 50) return "";
        if (node.nodeType === 3) {
          const t = node.textContent.trim();
          return t ? indent + t + "\n" : "";
        }
        if (node.nodeType !== 1) return "";
        if (isBoundary(node))
          return indent + "<!-- Component boundary -->\n";
        const tag = node.tagName.toLowerCase();
        const attrs = keyAttrs(node);
        const aStr = attrs.length ? " " + attrs.join(" ") : "";
        const kids = Array.from(node.childNodes);
        if (!kids.length) return indent + "<" + tag + aStr + " />\n";
        let out = indent + "<" + tag + aStr + ">\n";
        let i = 0;
        while (i < kids.length) {
          const kid = kids[i];
          if (kid.nodeType === 1) {
            const sig = sigOf(kid);
            let run = 1;
            let j = i + 1;
            while (
              j < kids.length &&
              kids[j].nodeType === 1 &&
              sigOf(kids[j]) === sig
            ) {
              run++;
              j++;
            }
            if (run > 3) {
              for (let k = i; k < i + 3; k++)
                out += serHtml(kids[k], indent + "  ", depth + 1);
              out +=
                indent +
                "  <!-- " +
                (run - 3) +
                " more " +
                kids[i].tagName.toLowerCase() +
                " elements omitted -->\n";
              i = j;
            } else {
              out += serHtml(kid, indent + "  ", depth + 1);
              i++;
            }
          } else {
            out += serHtml(kid, indent + "  ", depth + 1);
            i++;
          }
        }
        return out + indent + "</" + tag + ">\n";
      }

      function extStyles(node, depth, entries) {
        if (depth > 50 || node.nodeType !== 1) return;
        if (node !== root && isBoundary(node)) return;
        const label = elLabel(node) + (node === root ? " [root]" : "");
        const cs = window.getComputedStyle(node);
        const s = {};
        for (const p of STYLE_PROPS) {
          const v = cs[p];
          if (
            v &&
            v !== "" &&
            v !== "none" &&
            v !== "normal" &&
            v !== "auto" &&
            v !== "0px" &&
            v !== "rgba(0, 0, 0, 0)" &&
            v !== "0" &&
            v !== "start" &&
            v !== "stretch"
          ) {
            s[p] = v;
          }
        }
        if (Object.keys(s).length) entries.push({ label, styles: s });
        const kids = Array.from(node.children);
        let i = 0;
        while (i < kids.length) {
          const kid = kids[i];
          const sig = sigOf(kid);
          let run = 1;
          let j = i + 1;
          while (j < kids.length && sigOf(kids[j]) === sig) {
            run++;
            j++;
          }
          if (run > 3) {
            for (let k = i; k < i + 3; k++)
              extStyles(kids[k], depth + 1, entries);
            i = j;
          } else {
            extStyles(kid, depth + 1, entries);
            i++;
          }
        }
      }

      const html = serHtml(root, "", 0);
      const styleEntries = [];
      extStyles(root, 0, styleEntries);
      return { html, styleEntries };
    },
    { sel: selector, childSels: childSelectors }
  );
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
  const captureCount = new Map();
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
          captureCount,
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

  console.log(`\nDiscovery complete.`);
  console.log(`  Routes crawled: ${visited.size}`);
  console.log(`  Components found: ${componentArray.length}`);
  console.log(`  Page trees captured: ${allRoutes.length}`);
  console.log(`  Layout components: ${layoutComponents.join(", ") || "(none)"}`);
  console.log(`  Component map: ${OUTPUT_PATH}`);
  console.log(`  Pages output: ${PAGES_OUTPUT_PATH}`);
  if (CAPTURES_DIR && !SKIP_CAPTURES) {
    console.log(`  Captures:`);
    console.log(`    Page screenshots: ${captureStats.pages}`);
    console.log(`    Component captures: ${captureStats.components}`);
    console.log(`    Failed captures: ${captureStats.failed}`);
    console.log(`    Captures dir: ${CAPTURES_DIR}`);
  }

  const byType = {};
  for (const c of componentArray) {
    byType[c.sourceType] = (byType[c.sourceType] || 0) + 1;
  }
  for (const [type, count] of Object.entries(byType)) {
    console.log(`    ${type}: ${count}`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
