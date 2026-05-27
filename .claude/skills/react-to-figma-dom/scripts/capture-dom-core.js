const PORTAL_SELECTORS = [
  "[data-radix-portal]",
  "[data-radix-popper-content-wrapper]",
  "[role=\"dialog\"]",
  "[role=\"alertdialog\"]",
  "[role=\"tooltip\"]",
  "[role=\"listbox\"]",
];

function buildFiberDomMap(fiberData) {
  if (!Array.isArray(fiberData)) {
    return [];
  }
  return fiberData.map((comp, idx) => ({
    index: idx,
    component: comp.name,
    bounds: comp.bounds,
    type: comp.type,
  }));
}

async function captureFiberData(page, options = {}) {
  const rootSelector = options.rootSelector || null;
  const maxDepth = options.maxDepth || 20;

  return await page.evaluate(
    ({ rootSelector: rootSel, maxDepth: maxD }) => {
      let rootElement = null;

      if (rootSel) {
        rootElement = document.querySelector(rootSel);
      }

      if (!rootElement) {
        const storyRoot = document.querySelector("#storybook-root");
        if (storyRoot && storyRoot.children.length > 0) {
          rootElement = storyRoot.children[0];
        }
      }

      if (!rootElement) {
        const selectors = ["[data-reactroot]", "#root", ".docs-story", "main"];
        for (const selector of selectors) {
          const el = document.querySelector(selector);
          if (el && el.tagName !== "BODY") {
            rootElement = el;
            break;
          }
        }
      }

      if (!rootElement) {
        return [];
      }

      let fiber = null;
      const keys = Object.keys(rootElement).filter((key) => key.startsWith("__"));
      for (const key of keys) {
        const value = rootElement[key];
        if (value && typeof value === "object" && (value._owner || value.memoizedProps || value.child)) {
          fiber = value;
          break;
        }
      }

      if (!fiber && rootElement._reactRootContainer) {
        fiber = rootElement._reactRootContainer._internalRoot.current;
      }

      if (!fiber && window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (hook.getFiber) {
          fiber = hook.getFiber(rootElement);
        }
      }

      if (!fiber && rootElement.children.length > 0) {
        for (const child of rootElement.children) {
          const childKeys = Object.keys(child).filter((key) => key.startsWith("__"));
          for (const key of childKeys) {
            const value = child[key];
            if (value && typeof value === "object" && (value._owner || value.memoizedProps || value.child)) {
              fiber = value;
              break;
            }
          }
          if (fiber) {
            break;
          }
        }
      }

      if (!fiber) {
        return [];
      }

      const components = [];
      const visited = new Set();
      let rtfIdCounter = 0;

      function traverseFiber(f, depth = 0) {
        if (!f || visited.has(f) || depth > maxD) {
          return;
        }
        visited.add(f);

        if (f.type) {
          let name = "Unknown";
          let elementType = "Element";

          if (typeof f.type === "function") {
            name = f.type.name || f.type.displayName || "Component";
            elementType = "Component";
          } else if (typeof f.type === "string") {
            elementType = f.type.toUpperCase();
            name = f.type;
          }

          const domNode = f.stateNode;
          if (domNode && domNode.getBoundingClientRect && domNode.nodeType === 1) {
            const rect = domNode.getBoundingClientRect();
            const styles = window.getComputedStyle(domNode);

            if (elementType === "Component" && /^[A-Z]/.test(name) && !domNode.getAttribute("data-rtf-component")) {
              const rtfId = "rtf-dom-" + rtfIdCounter++;
              domNode.setAttribute("data-rtf-component", name);
              domNode.setAttribute("data-rtf-id", rtfId);
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
                height: Math.round(rect.height),
              },
              styles: {
                display: styles.display,
                position: styles.position,
                "background-color": styles.backgroundColor,
                color: styles.color,
                "font-size": styles.fontSize,
                "flex-direction": styles.flexDirection,
                "align-items": styles.alignItems,
                "justify-content": styles.justifyContent,
                gap: styles.gap,
              },
            });
          }
        }

        if (f.child) {
          traverseFiber(f.child, depth + 1);
        }
        if (f.sibling) {
          traverseFiber(f.sibling, depth);
        }
      }

      traverseFiber(fiber);
      return components;
    },
    { rootSelector: rootSelector, maxDepth }
  );
}

async function captureDomStructure(page, options = {}) {
  const rootSelector = options.rootSelector || null;
  const maxDepth = options.maxDepth || 15;

  return await page.evaluate(
    ({ rootSelector: rootSel, maxDepth: maxD }) => {
      let main = null;

      if (rootSel) {
        main = document.querySelector(rootSel);
      }

      if (!main) {
        const storyRoot = document.querySelector("#storybook-root");
        if (storyRoot && storyRoot.children.length > 0) {
          main = storyRoot.children[0];
        }
      }

      if (!main) {
        const selectors = [
          "[data-reactroot]",
          "#root",
          ".docs-story",
          "body > div:not(.sb-preparing-story):not(.sb-wrapper)",
          "main",
        ];

        for (const selector of selectors) {
          const el = document.querySelector(selector);
          if (el && el.offsetHeight > 0 && el.tagName !== "BODY") {
            main = el;
            break;
          }
        }
      }

      if (!main) {
        main = document.body;
      }

      function getElement(el, depth = 0) {
        if (depth > maxD) {
          return null;
        }

        const styles = window.getComputedStyle(el);
        if (styles.display === "none" || styles.visibility === "hidden") {
          return null;
        }

        const rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0 && el.children.length === 0) {
          return null;
        }

        const children = [];
        for (const child of Array.from(el.childNodes).slice(0, 30)) {
          if (child.nodeType === 3) {
            const text = child.textContent.trim();
            if (text) {
              children.push({ type: "TEXT_NODE", text: text.substring(0, 200) });
            }
          } else if (child.nodeType === 1) {
            const mapped = getElement(child, depth + 1);
            if (mapped) {
              children.push(mapped);
            }
          }
        }

        const tagLower = el.tagName.toLowerCase();
        const svgAttrMap = {
          svg: ["viewBox", "fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"],
          path: ["d"],
          circle: ["cx", "cy", "r"],
          line: ["x1", "y1", "x2", "y2"],
          rect: ["x", "y", "width", "height", "rx", "ry"],
          polyline: ["points"],
          polygon: ["points"],
        };
        const svgAttrsToCapture = svgAttrMap[tagLower];
        const svgAttrs = {};
        if (svgAttrsToCapture) {
          for (const attr of svgAttrsToCapture) {
            const val = el.getAttribute(attr);
            if (val) {
              svgAttrs[attr] = val;
            }
          }
        }

        const rawClassName = el.className;
        const classNameStr = typeof rawClassName === "string" ? rawClassName : rawClassName && rawClassName.baseVal ? rawClassName.baseVal : "";
        const rtfComponent = el.getAttribute("data-rtf-component");
        const rtfId = el.getAttribute("data-rtf-id");

        return {
          type: "ELEMENT",
          tag: tagLower,
          id: el.id || undefined,
          className: classNameStr || undefined,
          attrs: Object.keys(svgAttrs).length > 0 ? svgAttrs : undefined,
          "data-rtf-component": rtfComponent || undefined,
          "data-rtf-id": rtfId || undefined,
          role: el.getAttribute("role") || undefined,
          dataState: el.getAttribute("data-state") || undefined,
          aria: Object.fromEntries(
            Array.from(el.attributes)
              .filter((a) => a.name.startsWith("aria-"))
              .map((a) => [a.name, a.value])
          ),
          text:
            el.childNodes.length === 1 && el.childNodes[0].nodeType === 3
              ? el.textContent.trim().substring(0, 200)
              : children.length === 0 && el.textContent.trim()
                ? el.textContent.trim().substring(0, 200)
                : null,
          bounds: {
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          },
          styles: {
            display: styles.display,
            position: styles.position,
            visibility: styles.visibility,
            opacity: styles.opacity,
            "pointer-events": styles.pointerEvents,
            "overflow-x": styles.overflowX,
            "overflow-y": styles.overflowY,
            "flex-direction": styles.flexDirection,
            "flex-wrap": styles.flexWrap,
            "flex-grow": styles.flexGrow,
            "flex-shrink": styles.flexShrink,
            "flex-basis": styles.flexBasis,
            "align-items": styles.alignItems,
            "align-self": styles.alignSelf,
            "justify-content": styles.justifyContent,
            gap: styles.gap,
            "row-gap": styles.rowGap,
            "column-gap": styles.columnGap,
            width: styles.width,
            height: styles.height,
            "min-width": styles.minWidth,
            "max-width": styles.maxWidth,
            "min-height": styles.minHeight,
            "max-height": styles.maxHeight,
            "padding-top": styles.paddingTop,
            "padding-right": styles.paddingRight,
            "padding-bottom": styles.paddingBottom,
            "padding-left": styles.paddingLeft,
            margin: styles.margin,
            "background-color": styles.backgroundColor,
            color: styles.color,
            "font-family": styles.fontFamily,
            "font-size": styles.fontSize,
            "font-weight": styles.fontWeight,
            "font-style": styles.fontStyle,
            "line-height": styles.lineHeight,
            "letter-spacing": styles.letterSpacing,
            "text-align": styles.textAlign,
            "text-decoration": styles.textDecoration,
            "text-overflow": styles.textOverflow,
            "white-space": styles.whiteSpace,
            "border-top-width": styles.borderTopWidth,
            "border-right-width": styles.borderRightWidth,
            "border-bottom-width": styles.borderBottomWidth,
            "border-left-width": styles.borderLeftWidth,
            "border-top-color": styles.borderTopColor,
            "border-right-color": styles.borderRightColor,
            "border-bottom-color": styles.borderBottomColor,
            "border-left-color": styles.borderLeftColor,
            "border-top-left-radius": styles.borderTopLeftRadius,
            "border-top-right-radius": styles.borderTopRightRadius,
            "border-bottom-right-radius": styles.borderBottomRightRadius,
            "border-bottom-left-radius": styles.borderBottomLeftRadius,
            "box-shadow": styles.boxShadow,
          },
          children: children.length > 0 ? children : undefined,
        };
      }

      return getElement(main);
    },
    { rootSelector: rootSelector, maxDepth }
  );
}

async function capturePortalContent(page, baselineFingerprints = [], options = {}) {
  const excludeRootSelectors = options.excludeRootSelectors || ["#storybook-root"];
  const maxDepth = options.maxDepth || 15;

  return await page.evaluate(
    ({ baselineFPsArg, excludeRootSelectorsArg, maxDepthArg, portalSelectorsArg }) => {
      const baselineSet = new Set(baselineFPsArg || []);
      const excludedRoots = new Set();
      for (const selector of excludeRootSelectorsArg || []) {
        const el = document.querySelector(selector);
        if (el) {
          excludedRoots.add(el);
        }
      }

      function fingerprint(el) {
        const tag = el.tagName.toLowerCase();
        const classes = el.classList.length ? "." + [...el.classList].sort().join(".") : "";
        return tag + classes;
      }

      function hasPortalDescendant(el) {
        for (const sel of portalSelectorsArg) {
          if (el.matches(sel) || el.querySelector(sel)) {
            return true;
          }
        }
        return false;
      }

      function getElement(el, depth = 0) {
        if (depth > maxDepthArg) {
          return null;
        }

        const styles = window.getComputedStyle(el);
        if (styles.display === "none" && styles.visibility === "hidden") {
          return null;
        }

        const rect = el.getBoundingClientRect();
        if (rect.width === 0 && rect.height === 0 && el.children.length === 0) {
          return null;
        }

        const children = [];
        for (const child of Array.from(el.childNodes).slice(0, 30)) {
          if (child.nodeType === 3) {
            const text = child.textContent.trim();
            if (text) {
              children.push({ type: "TEXT_NODE", text: text.substring(0, 200) });
            }
          } else if (child.nodeType === 1) {
            const mapped = getElement(child, depth + 1);
            if (mapped) {
              children.push(mapped);
            }
          }
        }

        const tagLower = el.tagName.toLowerCase();
        const svgAttrMap = {
          svg: ["viewBox", "fill", "stroke", "stroke-width", "stroke-linecap", "stroke-linejoin"],
          path: ["d"],
          circle: ["cx", "cy", "r"],
          line: ["x1", "y1", "x2", "y2"],
          rect: ["x", "y", "width", "height", "rx", "ry"],
          polyline: ["points"],
          polygon: ["points"],
        };
        const svgAttrsToCapture = svgAttrMap[tagLower];
        const svgAttrs = {};
        if (svgAttrsToCapture) {
          for (const attr of svgAttrsToCapture) {
            const val = el.getAttribute(attr);
            if (val) {
              svgAttrs[attr] = val;
            }
          }
        }

        const rawClassName = el.className;
        const classNameStr = typeof rawClassName === "string" ? rawClassName : rawClassName && rawClassName.baseVal ? rawClassName.baseVal : "";
        const rtfComponent = el.getAttribute("data-rtf-component");
        const rtfId = el.getAttribute("data-rtf-id");

        return {
          type: "ELEMENT",
          tag: tagLower,
          id: el.id || undefined,
          className: classNameStr || undefined,
          attrs: Object.keys(svgAttrs).length > 0 ? svgAttrs : undefined,
          "data-rtf-component": rtfComponent || undefined,
          "data-rtf-id": rtfId || undefined,
          role: el.getAttribute("role") || undefined,
          dataState: el.getAttribute("data-state") || undefined,
          aria: Object.fromEntries(
            Array.from(el.attributes)
              .filter((a) => a.name.startsWith("aria-"))
              .map((a) => [a.name, a.value])
          ),
          text:
            el.childNodes.length === 1 && el.childNodes[0].nodeType === 3
              ? el.textContent.trim().substring(0, 200)
              : children.length === 0 && el.textContent.trim()
                ? el.textContent.trim().substring(0, 200)
                : null,
          bounds: {
            x: Math.round(rect.x),
            y: Math.round(rect.y),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          },
          styles: {
            display: styles.display,
            position: styles.position,
            visibility: styles.visibility,
            opacity: styles.opacity,
            "pointer-events": styles.pointerEvents,
            "overflow-x": styles.overflowX,
            "overflow-y": styles.overflowY,
            "flex-direction": styles.flexDirection,
            "flex-wrap": styles.flexWrap,
            "flex-grow": styles.flexGrow,
            "flex-shrink": styles.flexShrink,
            "flex-basis": styles.flexBasis,
            "align-items": styles.alignItems,
            "align-self": styles.alignSelf,
            "justify-content": styles.justifyContent,
            gap: styles.gap,
            "row-gap": styles.rowGap,
            "column-gap": styles.columnGap,
            width: styles.width,
            height: styles.height,
            "min-width": styles.minWidth,
            "max-width": styles.maxWidth,
            "min-height": styles.minHeight,
            "max-height": styles.maxHeight,
            "padding-top": styles.paddingTop,
            "padding-right": styles.paddingRight,
            "padding-bottom": styles.paddingBottom,
            "padding-left": styles.paddingLeft,
            margin: styles.margin,
            "background-color": styles.backgroundColor,
            color: styles.color,
            "font-family": styles.fontFamily,
            "font-size": styles.fontSize,
            "font-weight": styles.fontWeight,
            "font-style": styles.fontStyle,
            "line-height": styles.lineHeight,
            "letter-spacing": styles.letterSpacing,
            "text-align": styles.textAlign,
            "text-decoration": styles.textDecoration,
            "text-overflow": styles.textOverflow,
            "white-space": styles.whiteSpace,
            "border-top-width": styles.borderTopWidth,
            "border-right-width": styles.borderRightWidth,
            "border-bottom-width": styles.borderBottomWidth,
            "border-left-width": styles.borderLeftWidth,
            "border-top-color": styles.borderTopColor,
            "border-right-color": styles.borderRightColor,
            "border-bottom-color": styles.borderBottomColor,
            "border-left-color": styles.borderLeftColor,
            "border-top-left-radius": styles.borderTopLeftRadius,
            "border-top-right-radius": styles.borderTopRightRadius,
            "border-bottom-right-radius": styles.borderBottomRightRadius,
            "border-bottom-left-radius": styles.borderBottomLeftRadius,
            "box-shadow": styles.boxShadow,
          },
          children: children.length > 0 ? children : undefined,
        };
      }

      const portalNodes = [];
      for (const child of document.body.children) {
        const tag = child.tagName.toLowerCase();
        if (["script", "style", "link"].includes(tag)) {
          continue;
        }
        if (excludedRoots.has(child)) {
          continue;
        }

        const fp = fingerprint(child);

        if (baselineSet.size > 0) {
          if (baselineSet.has(fp)) {
            continue;
          }
        } else if (!hasPortalDescendant(child)) {
          continue;
        }

        const tree = getElement(child, 0);
        if (tree) {
          portalNodes.push(tree);
        }
      }

      return portalNodes;
    },
    {
      baselineFPsArg: baselineFingerprints,
      excludeRootSelectorsArg: excludeRootSelectors,
      maxDepthArg: maxDepth,
      portalSelectorsArg: PORTAL_SELECTORS,
    }
  );
}

module.exports = {
  buildFiberDomMap,
  captureDomStructure,
  captureFiberData,
  capturePortalContent,
};
