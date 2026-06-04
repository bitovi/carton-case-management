#!/usr/bin/env node

/**
 * dom-to-figma-ir.js
 *
 * Translates a captured DOM tree (.dom.json) + fiber map into a Figma
 * Intermediate Representation (IR) that can be deterministically converted
 * to use_figma JavaScript code.
 *
 * Usage:
 *   node dom-to-figma-ir.js \
 *     --dom-file .temp/react-to-figma-dom/components/Badge/variants/PrimaryDefault/dom.json \
 *     --fiber-map .temp/react-to-figma-dom/components/Badge/variants/PrimaryDefault/fiber-dom-map.json \
 *     --variables-map .temp/react-to-figma-dom/figma-variables-map.json \
 *     --design-tokens .temp/react-to-figma-dom/design-tokens.json \
 *     --icons-map .temp/react-to-figma-dom/figma-icons-map.json \
 *     --built-components .temp/react-to-figma-dom/built-components.json \
 *     --component-name Badge \
 *     --output .temp/react-to-figma-dom/components/Badge/variants/PrimaryDefault/figma-ir.json
 */

const fs = require('fs');
const path = require('path');
const {
  mapLayout, mapSizing, mapFills, mapStrokes, mapTypography,
  mapCornerRadius, mapEffects, mapOpacity, buildReverseColorMap,
  resolveColor, extractRing,
} = require('./css-to-figma');

const FIGMA_NODE_ID_RE = /^\d+:\d+$/;

function isValidFigmaNodeId(id) {
  return typeof id === 'string' && FIGMA_NODE_ID_RE.test(id);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const opts = {
    domFile: null,
    fiberMap: null,
    variablesMap: null,
    designTokens: null,
    iconsMap: null,
    builtComponents: null,
    componentName: null,
    output: null,
    rootType: 'COMPONENT',
  };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--dom-file': opts.domFile = args[++i]; break;
      case '--fiber-map': opts.fiberMap = args[++i]; break;
      case '--variables-map': opts.variablesMap = args[++i]; break;
      case '--design-tokens': opts.designTokens = args[++i]; break;
      case '--icons-map': opts.iconsMap = args[++i]; break;
      case '--built-components': opts.builtComponents = args[++i]; break;
      case '--component-name': opts.componentName = args[++i]; break;
      case '--output': opts.output = args[++i]; break;
      case '--root-type': opts.rootType = args[++i]; break;
      default: break;
    }
  }

  if (!opts.domFile) {
    console.error('Error: --dom-file is required');
    process.exit(1);
  }

  return opts;
}

function loadJsonOptional(filePath) {
  if (!filePath) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function normalizeCamelCaseToKebabCase(styles) {
  const normalized = {};
  for (const [key, value] of Object.entries(styles)) {
    // Convert camelCase to kebab-case
    // e.g., backgroundColor -> background-color, borderRadius -> border-radius
    const kebabKey = key.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
    normalized[kebabKey] = value;
  }
  return normalized;
}

function isElement(node) {
  return node.type === 'ELEMENT' || (node.tag && node.type !== 'TEXT_NODE');
}

function isStorybookWrapper(node) {
  if (!isElement(node)) return false;
  if (node.tag === 'div' && node.children && node.children.length === 1) {
    const styles = normalizeCamelCaseToKebabCase(node.styles || {});
    const display = styles['display'];
    if (display === 'block' && !styles['background-color'] && !styles['gap']) {
      const hasPadding = (styles['padding-top'] && styles['padding-top'] !== '0px') ||
                         (styles['padding-right'] && styles['padding-right'] !== '0px') ||
                         (styles['padding-bottom'] && styles['padding-bottom'] !== '0px') ||
                         (styles['padding-left'] && styles['padding-left'] !== '0px');
      if (hasPadding) return false;
      return true;
    }
  }
  return false;
}

function isSvgElement(node) {
  return isElement(node) && node.tag === 'svg';
}

function resolveIconColor(styles, variablesMap, reverseColorMap) {
  const colorCss = styles['color'];
  if (!colorCss || colorCss === 'rgb(0, 0, 0)') return null;
  const resolved = resolveColor(colorCss, variablesMap, reverseColorMap);
  if (!resolved) return null;
  if (resolved.color.r === 0 && resolved.color.g === 0 && resolved.color.b === 0) return null;
  return {
    color: resolved.color,
    opacity: resolved.opacity,
    variableId: resolved.variableId || null,
    figmaPath: resolved.figmaPath || null,
  };
}

function hasVisualContainer(node) {
  if (!isElement(node)) return false;
  const s = normalizeCamelCaseToKebabCase(node.styles || {});
  return !!(
    s['background-color'] && s['background-color'] !== 'rgba(0, 0, 0, 0)' ||
    s['border-top-width'] && s['border-top-width'] !== '0px' ||
    s['border-top-left-radius'] && s['border-top-left-radius'] !== '0px' ||
    (s['padding-top'] && s['padding-top'] !== '0px') ||
    (s['padding-right'] && s['padding-right'] !== '0px') ||
    (s['padding-bottom'] && s['padding-bottom'] !== '0px') ||
    (s['padding-left'] && s['padding-left'] !== '0px') ||
    s['box-shadow']
  );
}

function isTextOnlyElement(node) {
  if (node.type === 'TEXT_NODE') return true;
  if (!isElement(node)) return false;
  if (hasVisualContainer(node)) return false;
  if (node.text && (!node.children || node.children.length === 0)) return true;
  if (!node.children || node.children.length === 0) return false;
  return node.children.every((c) => c.type === 'TEXT_NODE' ||
    (isElement(c) && isTextOnlyElement(c)));
}

function extractAllText(node) {
  if (node.type === 'TEXT_NODE') return node.text;
  if (!isElement(node) && node.type) return '';
  if (node.text && (!node.children || node.children.length === 0)) return node.text;
  if (!node.children) return '';
  return node.children.map(extractAllText).join('').trim();
}

function findIconName(node, iconsMap) {
  if (!iconsMap || !isSvgElement(node)) return null;
  const svgWidth = node.bbox ? Math.round(node.bbox.width) : null;
  const svgHeight = node.bbox ? Math.round(node.bbox.height) : null;

  for (const [iconName, iconData] of Object.entries(iconsMap)) {
    const candidateId = iconData && typeof iconData === 'object'
      ? (iconData.componentId || iconData.nodeId)
      : null;
    if (candidateId && isValidFigmaNodeId(candidateId)) {
      return { name: iconName, nodeId: candidateId, width: svgWidth, height: svgHeight };
    }
  }
  return null;
}

function translateNode(domNode, context, isRoot, parentStyles) {
  const { variablesMap, reverseColorMap, iconsMap, builtComponents, componentName, rootType, warnings } = context;

  // NEW FORMAT DETECTION: type field may be absent in new DOM format
  // A text node has no tag and only text content (no children)
  const isTextNode = (domNode.type === 'TEXT_NODE') || 
                     (!domNode.tag && domNode.text && !domNode.children);

  if (isTextNode && !domNode.tag) {
    const inheritedStyles = normalizeCamelCaseToKebabCase(parentStyles || {});
    const typography = Object.keys(inheritedStyles).length > 0 ? mapTypography(inheritedStyles) : null;
    const textColor = inheritedStyles['color'];
    const textFills = textColor ? (() => {
      const resolved = resolveColor(textColor, context.variablesMap, context.reverseColorMap);
      return resolved ? [{
        type: 'SOLID',
        color: resolved.color,
        opacity: resolved.opacity,
        variableId: resolved.variableId,
        figmaPath: resolved.figmaPath,
      }] : [];
    })() : [];
    return {
      type: 'TEXT',
      characters: domNode.text,
      typography,
      fills: textFills,
    };
  }

  // NEW FORMAT: type field may be absent, so check for ELEMENT explicitly
  if (domNode.type && domNode.type !== 'ELEMENT' && !domNode.tag) return null;

  const styles = normalizeCamelCaseToKebabCase(domNode.styles || {});
  const attrs = domNode.attrs || {};
  // NEW FORMAT: use 'bounds' instead of 'bbox'
  const bbox = domNode.bbox || domNode.bounds || {};

  // Check both old format (top-level property) and new format (inside attrs)
  const rtfComponent = attrs['data-rtf-component'] || domNode['data-rtf-component'];
  if (rtfComponent && !isRoot && rtfComponent !== componentName) {
    const masterNodeId = builtComponents ? builtComponents[rtfComponent] : null;
    if (masterNodeId && isValidFigmaNodeId(masterNodeId)) {
      return {
        type: 'INSTANCE',
        name: rtfComponent,
        masterNodeId,
        resize: null,
      };
    }
    let iconEntry = null;
    if (iconsMap) {
      iconEntry = iconsMap[`Icon/${rtfComponent}`] || iconsMap[rtfComponent];
    }
    const iconNodeId = iconEntry ? (iconEntry.componentId || iconEntry.nodeId) : null;
    if (iconNodeId && isValidFigmaNodeId(iconNodeId)) {
      return {
        type: 'INSTANCE',
        name: `Icon/${rtfComponent}`,
        masterNodeId: iconNodeId,
        resize: bbox.width && bbox.height ? [Math.round(bbox.width), Math.round(bbox.height)] : null,
        iconColor: resolveIconColor(styles, variablesMap, reverseColorMap),
      };
    }
    if (iconNodeId && !isValidFigmaNodeId(iconNodeId)) {
      warnings.push(`Icon "${rtfComponent}" has invalid Figma node ID "${iconNodeId}" — processing children inline`);
    }
    // Component not found in builtComponents or iconsMap — fall through and
    // process its children normally instead of creating an unresolvable INSTANCE
    warnings.push(`Component "${rtfComponent}" not in builtComponents/iconsMap, processing children inline`);
  }

  if (isSvgElement(domNode)) {
    const w = Math.round(bbox.width || 16);
    const h = Math.round(bbox.height || 16);

    // Try to match SVG to a known icon by checking CSS class names
    // Lucide icons have class pattern: "lucide lucide-{icon-name} h-4 w-4"
    // Handle old format (className may be {} for SVG elements due to SVGAnimatedString serialization)
    const rawClassName = domNode.className;
    const classFromAttrs = domNode.attrs?.class || '';
    const classValue = (typeof rawClassName === 'string' && rawClassName) ? rawClassName : classFromAttrs;
    const svgClasses = (typeof classValue === 'string' ? classValue : '').toLowerCase();
    let inferredIconName = null;
    if (svgClasses) {
      // Match "lucide-{name}" specifically (the second class, not the bare "lucide" prefix)
      const lucideMatch = svgClasses.match(/\blucide-([a-z0-9][a-z0-9-]*)/);
      if (lucideMatch) {
        // Convert kebab-case to PascalCase: 'loader-circle' -> 'LoaderCircle', 'check' -> 'Check'
        inferredIconName = lucideMatch[1]
          .split('-')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1))
          .join('');
      }
    }

    // Fallback: try to infer icon from path 'd' attribute signature
    // Common Lucide icons have recognizable path data
    if (!inferredIconName && domNode.children && domNode.children.length > 0) {
      const paths = domNode.children.filter(c => c.tag === 'path');
      // Try both formats: new format stores in attrs.d, old format may store in domNode.attrs.d
      const pathDs = paths.map(p => (p.attrs?.d || p.d || '')).filter(Boolean);
      if (pathDs.length > 0) {
        const LUCIDE_PATH_SIGNATURES = {
          'M20 6 9 17l-5-5': 'Check',
          'M20 6L9 17l-5-5': 'Check',
          'M18 6 6 18': 'X',
          'M6 18L18 6': 'X',
          'M6 18 18 6': 'X',
          'M21 12a9 9': 'Loader2',
          'path d="M21 12a9': 'Loader2',
        };
        for (const [sig, name] of Object.entries(LUCIDE_PATH_SIGNATURES)) {
          if (pathDs.some(d => d.includes(sig) || d.replace(/\s+/g, ' ').includes(sig))) {
            inferredIconName = name;
            warnings.push(`Icon "${name}" inferred from path signature (className unavailable)`);
            break;
          }
        }
      }
    }

    // Common Lucide icon rename aliases (newer icon names → older names in icons map)
    const LUCIDE_ALIASES = {
      'LoaderCircle': 'Loader2',
      'SquareCheckBig': 'CheckSquare',
      'EllipsisVertical': 'MoreVertical',
      'Pencil': 'Edit2',
    };
    if (inferredIconName && LUCIDE_ALIASES[inferredIconName]) {
      const aliased = LUCIDE_ALIASES[inferredIconName];
      if (iconsMap && (iconsMap[aliased] || iconsMap[`Icon/${aliased}`])) {
        warnings.push(`Icon "${inferredIconName}" aliased to "${aliased}" via LUCIDE_ALIASES`);
        inferredIconName = aliased;
      }
    }

    if (inferredIconName && iconsMap) {
      const iconEntry = iconsMap[inferredIconName] || iconsMap[`Icon/${inferredIconName}`];
      const entryId = iconEntry ? (iconEntry.componentId || iconEntry.nodeId) : null;
      if (entryId && isValidFigmaNodeId(entryId)) {
        return {
          type: 'INSTANCE',
          name: `Icon/${inferredIconName}`,
          masterNodeId: entryId,
          resize: [w, h],
          iconColor: resolveIconColor(styles, variablesMap, reverseColorMap),
        };
      }
      if (entryId && !isValidFigmaNodeId(entryId)) {
        warnings.push(`Icon "${inferredIconName}" has invalid Figma node ID "${entryId}" — using SVG placeholder`);
      }
    }

    return {
      type: 'SVG_PLACEHOLDER',
      name: inferredIconName ? `icon-${inferredIconName}` : 'icon',
      width: w,
      height: h,
      inferredIcon: inferredIconName || null,
      hint: inferredIconName
        ? `Inferred icon "${inferredIconName}" from CSS class but not found in iconsMap.`
        : (typeof rawClassName === 'object'
          ? 'SVG className is object (old capture format — SVGAnimatedString serialized as {}). Re-capture with capture-dom.js for proper icon resolution.'
          : 'SVG detected but no fiber component match. Ensure capture-dom.js fiber walker tagged this element.'),
    };
  }

  if (isTextOnlyElement(domNode) && domNode.tag !== 'div' && domNode.tag !== 'section') {
    const text = extractAllText(domNode);
    if (text) {
      const typography = mapTypography(styles);
      const textColor = styles['color'];
      const textFills = textColor ? (() => {
        const resolved = resolveColor(textColor, variablesMap, reverseColorMap);
        return resolved ? [{
          type: 'SOLID',
          color: resolved.color,
          opacity: resolved.opacity,
          variableId: resolved.variableId,
          figmaPath: resolved.figmaPath,
        }] : [];
      })() : [];

      return {
        type: 'TEXT',
        characters: text,
        typography,
        fills: textFills,
        sizing: mapSizing(styles, bbox, parentStyles),
      };
    }
  }

  if (!isRoot && domNode.text && domNode.text.trim() && (!domNode.children || domNode.children.length === 0) && !hasVisualContainer(domNode)) {
    const text = domNode.text.trim();
    {
      const typography = mapTypography(styles);
      const textColor = styles['color'];
      const textFills = textColor ? (() => {
        const resolved = resolveColor(textColor, variablesMap, reverseColorMap);
        return resolved ? [{
          type: 'SOLID',
          color: resolved.color,
          opacity: resolved.opacity,
          variableId: resolved.variableId,
          figmaPath: resolved.figmaPath,
        }] : [];
      })() : [];

      return {
        type: 'TEXT',
        characters: text,
        typography,
        fills: textFills,
        sizing: mapSizing(styles, bbox, parentStyles),
      };
    }
  }

  // Handle form input elements: synthesize placeholder text and preserve height
  const FORM_INPUT_TAGS = new Set(['input', 'textarea']);
  if (FORM_INPUT_TAGS.has(domNode.tag) && !isRoot) {
    const layout = mapLayout(styles);
    const sizing = mapSizing(styles, bbox, parentStyles || null);
    const fills = mapFills(styles, variablesMap, reverseColorMap);
    const strokes = mapStrokes(styles, variablesMap, reverseColorMap);
    const cornerRadius = mapCornerRadius(styles, variablesMap);
    const effects = mapEffects(styles);
    const opacity = mapOpacity(styles);

    // Extract text: first from captured placeholder attribute, then from TEXT_NODE children
    let inputText = domNode.placeholder || '';
    if (!inputText) {
      for (const child of (domNode.children || [])) {
        if (child.type === 'TEXT_NODE' && child.text) {
          inputText = child.text;
          break;
        }
      }
    }
    // Fallback: use a generic placeholder if no text was captured
    if (!inputText) {
      inputText = 'Enter value';
    }

    // Build the input frame with a text child
    const textColor = styles['color'] || (parentStyles ? normalizeCamelCaseToKebabCase(parentStyles)['color'] : null);
    const textFills = textColor ? (() => {
      const resolved = resolveColor(textColor, variablesMap, reverseColorMap);
      return resolved ? [{
        type: 'SOLID',
        color: resolved.color,
        opacity: resolved.opacity,
        variableId: resolved.variableId,
        figmaPath: resolved.figmaPath,
      }] : [];
    })() : [];

    const textChild = {
      type: 'TEXT',
      characters: inputText,
      typography: mapTypography(styles),
      fills: textFills,
    };

    const figmaNode = {
      type: 'FRAME',
      name: domNode.tag,
    };

    if (layout.layoutMode) {
      figmaNode.layoutMode = layout.layoutMode;
      figmaNode.primaryAxisAlignItems = layout.primaryAxisAlignItems;
      figmaNode.counterAxisAlignItems = 'CENTER';
      figmaNode.paddingTop = layout.paddingTop;
      figmaNode.paddingRight = layout.paddingRight;
      figmaNode.paddingBottom = layout.paddingBottom;
      figmaNode.paddingLeft = layout.paddingLeft;
    } else {
      figmaNode.layoutMode = 'HORIZONTAL';
      figmaNode.counterAxisAlignItems = 'CENTER';
      figmaNode.paddingTop = parseInt(styles['padding-top']) || 0;
      figmaNode.paddingRight = parseInt(styles['padding-right']) || 0;
      figmaNode.paddingBottom = parseInt(styles['padding-bottom']) || 0;
      figmaNode.paddingLeft = parseInt(styles['padding-left']) || 0;
    }

    // Preserve explicit height from DOM (input height includes border-box)
    const domHeight = bbox.height ? Math.round(bbox.height) : null;
    const domWidth = bbox.width ? Math.round(bbox.width) : null;
    if (domWidth && domHeight) {
      figmaNode.width = domWidth;
      figmaNode.height = domHeight;
      figmaNode.primaryAxisSizingMode = 'FIXED';
      figmaNode.counterAxisSizingMode = 'FIXED';
    } else {
      figmaNode.primaryAxisSizingMode = sizing.primaryAxisSizingMode || 'AUTO';
      figmaNode.counterAxisSizingMode = sizing.counterAxisSizingMode || 'AUTO';
    }

    if (fills.length > 0) figmaNode.fills = fills;
    if (strokes) figmaNode.strokes = strokes;
    if (cornerRadius.value > 0 || !cornerRadius.uniform) figmaNode.cornerRadius = cornerRadius;
    if (effects.length > 0) figmaNode.effects = effects;
    if (opacity < 1) figmaNode.opacity = opacity;

    figmaNode.children = [textChild];
    return figmaNode;
  }

  const layout = mapLayout(styles);
  const sizing = mapSizing(styles, bbox, parentStyles || null);
  const fills = mapFills(styles, variablesMap, reverseColorMap);
  const strokes = mapStrokes(styles, variablesMap, reverseColorMap);
  const cornerRadius = mapCornerRadius(styles, variablesMap);
  const effects = mapEffects(styles);
  const opacity = mapOpacity(styles);

  const children = [];
  for (const child of (domNode.children || [])) {
    if (isElement(child)) {
      const cb = child.bbox || child.bounds || {};
      if (cb.width === 0 && cb.height === 0 && !child.text) {
        continue;
      }
    }

    if (isRoot && isStorybookWrapper(child)) {
      for (const grandchild of (child.children || [])) {
        const translated = translateNode(grandchild, context, false, styles);
        if (translated) children.push(translated);
      }
      continue;
    }

    const translated = translateNode(child, context, false, styles);
    if (translated) children.push(translated);
  }

  const figmaNode = {
    type: isRoot ? rootType : 'FRAME',
    name: isRoot ? componentName : (attrs.role || attrs['aria-label'] || domNode.tag),
  };

  if (layout.layoutMode) {
    figmaNode.layoutMode = layout.layoutMode;
    figmaNode.itemSpacing = layout.itemSpacing;
    if (layout.counterAxisSpacing) figmaNode.counterAxisSpacing = layout.counterAxisSpacing;
    figmaNode.primaryAxisAlignItems = layout.primaryAxisAlignItems;
    figmaNode.counterAxisAlignItems = layout.counterAxisAlignItems;
    figmaNode.paddingTop = layout.paddingTop;
    figmaNode.paddingRight = layout.paddingRight;
    figmaNode.paddingBottom = layout.paddingBottom;
    figmaNode.paddingLeft = layout.paddingLeft;
    if (layout.clipsContent) figmaNode.clipsContent = true;
  }

  figmaNode.primaryAxisSizingMode = sizing.primaryAxisSizingMode || 'AUTO';
  figmaNode.counterAxisSizingMode = sizing.counterAxisSizingMode || 'AUTO';
  if (sizing.layoutSizingHorizontal) figmaNode.layoutSizingHorizontal = sizing.layoutSizingHorizontal;
  if (sizing.layoutSizingVertical) figmaNode.layoutSizingVertical = sizing.layoutSizingVertical;
  if (sizing.width) figmaNode.width = sizing.width;
  if (sizing.height) figmaNode.height = sizing.height;
  if (sizing.minWidth) figmaNode.minWidth = sizing.minWidth;
  if (sizing.minHeight) figmaNode.minHeight = sizing.minHeight;

  if (fills.length > 0) figmaNode.fills = fills;
  if (strokes) figmaNode.strokes = strokes;
  if (cornerRadius.value > 0 || !cornerRadius.uniform) figmaNode.cornerRadius = cornerRadius;
  if (effects.length > 0) {
    if (isRoot) {
      const { ring, remaining } = extractRing(effects);
      if (ring.length > 0) {
        const largest = ring.reduce((a, b) => b.spread > a.spread ? b : a, ring[0]);
        figmaNode.ring = {
          color: largest.color,
          opacity: largest.opacity,
          spread: largest.spread,
        };
      }
      if (remaining.length > 0) figmaNode.effects = remaining;
    } else {
      figmaNode.effects = effects;
    }
  }
  if (opacity < 1) figmaNode.opacity = opacity;

  if (children.length > 0) figmaNode.children = children;

  return figmaNode;
}

function collectFonts(irNode) {
  const fonts = new Set();
  fonts.add('Inter|Regular');

  function walk(node) {
    if (!node) return;
    if (node.type === 'TEXT' && node.typography) {
      fonts.add(`${node.typography.fontFamily}|${node.typography.fontStyle}`);
    }
    if (node.children) {
      node.children.forEach(walk);
    }
  }
  walk(irNode);

  return [...fonts].map((f) => {
    const [family, style] = f.split('|');
    return { family, style };
  });
}

function countNodes(irNode) {
  let count = 1;
  if (irNode.children) {
    for (const child of irNode.children) {
      count += countNodes(child);
    }
  }
  return count;
}

function detectPortalDirection(rawDom) {
  const struct = rawDom.structure || rawDom;
  const portal = (rawDom.portalContent || [])[0];
  if (!portal) return 'RIGHT';
  let trigBounds = struct.bounds || struct.bbox;
  for (const c of (struct.children || [])) {
    const b = c.bounds || c.bbox;
    if (b) { trigBounds = b; break; }
  }
  const portBounds = portal.bounds || portal.bbox;
  if (!trigBounds || !portBounds) return 'RIGHT';
  const dx = (portBounds.x + portBounds.width / 2) - (trigBounds.x + trigBounds.width / 2);
  const dy = (portBounds.y + portBounds.height / 2) - (trigBounds.y + trigBounds.height / 2);
  if (Math.abs(dy) > Math.abs(dx)) {
    return dy < 0 ? 'TOP' : 'BOTTOM';
  } else {
    return dx < 0 ? 'LEFT' : 'RIGHT';
  }
}

function main() {
  const opts = parseArgs();

  const rawDom = JSON.parse(fs.readFileSync(opts.domFile, 'utf8'));
  // Handle both old format (direct structure) and new format (wrapped in 'structure' field)
  const domTree = rawDom.structure ? rawDom.structure : rawDom;

  const variablesMap = loadJsonOptional(opts.variablesMap);
  const designTokens = loadJsonOptional(opts.designTokens);
  const iconsMap = loadJsonOptional(opts.iconsMap);
  const builtComponents = loadJsonOptional(opts.builtComponents);

  const reverseColorMap = designTokens ? buildReverseColorMap(designTokens) : {};

  const warnings = [];

  const context = {
    variablesMap,
    reverseColorMap,
    iconsMap,
    builtComponents: builtComponents || {},
    componentName: opts.componentName || 'Component',
    rootType: opts.rootType,
    warnings,
  };

  let ir = translateNode(domTree, context, true, null);

  if (!ir) {
    console.error('Failed to translate DOM tree — result is null');
    process.exit(1);
  }

  // Process portal content (elements rendered outside #storybook-root)
  const portalContent = rawDom.portalContent || [];
  if (portalContent.length > 0) {
    const rootIsEmpty = !ir.children || ir.children.length === 0;
    const rootIsHidden = domTree.aria && domTree.aria['aria-hidden'] === 'true';
    const rootBounds = domTree.bbox || domTree.bounds || {};
    const rootIsSmall = (rootBounds.width || 0) <= 64 && (rootBounds.height || 0) <= 64;
    const isPortalOnlyComponent = rootIsEmpty && (rootIsHidden || rootIsSmall);

    if (isPortalOnlyComponent) {
      const viewport = rawDom.viewport || { width: 1280, height: 800 };
      let overlayFills = [];
      const panelChildren = [];

      for (const portalNode of portalContent) {
        const pBounds = portalNode.bbox || portalNode.bounds || {};
        const isFullScreen = pBounds.width >= viewport.width * 0.9 && pBounds.height >= viewport.height * 0.9;
        const hasNoChildren = !portalNode.children || portalNode.children.length === 0;

        if (isFullScreen && hasNoChildren) {
          const portalStyles = normalizeCamelCaseToKebabCase(portalNode.styles || {});
          const bgColor = portalStyles['background-color'];
          if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)') {
            overlayFills = mapFills(portalStyles, variablesMap, reverseColorMap);
          }
        } else {
          const portalIr = translateNode(portalNode, context, false, null);
          if (portalIr) panelChildren.push(portalIr);
        }
      }

      ir = {
        type: opts.rootType,
        name: opts.componentName || 'Component',
        layoutMode: 'VERTICAL',
        primaryAxisAlignItems: 'CENTER',
        counterAxisAlignItems: 'CENTER',
        itemSpacing: 0,
        paddingTop: 0,
        paddingRight: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        primaryAxisSizingMode: 'FIXED',
        counterAxisSizingMode: 'FIXED',
        width: viewport.width,
        height: viewport.height,
        fills: overlayFills.length > 0 ? overlayFills : [],
        children: panelChildren,
      };

      warnings.push(`Portal-only component detected (root is ${rootIsHidden ? 'aria-hidden' : 'empty/small'}): promoted ${panelChildren.length} portal panel(s) as root content, sized to viewport ${viewport.width}x${viewport.height}`);
    } else {
      const portalGroup = {
        type: 'FRAME',
        name: 'Portal Content',
        layoutMode: 'VERTICAL',
        primaryAxisSizingMode: 'AUTO',
        counterAxisSizingMode: 'AUTO',
        itemSpacing: 0,
        fills: [],
        children: [],
      };

      for (const portalNode of portalContent) {
        const portalIr = translateNode(portalNode, context, false, null);
        if (portalIr) {
          portalGroup.children.push(portalIr);
        }
      }

      if (portalGroup.children.length > 0) {
        if (!ir.children) ir.children = [];
        const portalDirection = detectPortalDirection(rawDom);
        if (portalDirection === 'TOP' || portalDirection === 'BOTTOM') {
          ir.layoutMode = 'VERTICAL';
        } else {
          ir.layoutMode = 'HORIZONTAL';
        }
        if (portalDirection === 'TOP' || portalDirection === 'LEFT') {
          ir.children.unshift(portalGroup);
        } else {
          ir.children.push(portalGroup);
        }
        warnings.push(`Portal content detected: direction=${portalDirection}, ${portalGroup.children.length} portal node(s) positioned ${portalDirection}`);
      }
    }
  }

  const fonts = collectFonts(ir);
  const nodeCount = countNodes(ir);

  const output = {
    schemaVersion: 'react-to-figma-dom-ir@1',
    componentName: opts.componentName || 'Component',
    generatedAt: new Date().toISOString(),
    nodeCount,
    fonts,
    warnings,
    variantProps: rawDom.variantProps || null,
    root: ir,
  };

  const outPath = opts.output || opts.domFile.replace('.dom.json', '.figma-ir.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(output, null, 2));

  console.log(`Generated IR: ${outPath}`);
  console.log(`  Nodes: ${nodeCount}`);
  console.log(`  Fonts: ${fonts.map((f) => `${f.family} ${f.style}`).join(', ')}`);
  if (warnings.length > 0) {
    console.log(`  Warnings (${warnings.length}):`);
    warnings.forEach((w) => console.log(`    ⚠ ${w}`));
  }
}

main();
