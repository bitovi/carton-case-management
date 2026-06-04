/**
 * css-to-figma.js
 *
 * Pure function library that translates computed CSS properties into Figma
 * Plugin API properties. No side effects, no filesystem, no network.
 *
 * Usage:
 *   const { mapLayout, mapSizing, mapFills, mapStrokes, mapTypography,
 *           mapCornerRadius, mapEffects, resolveColor } = require('./css-to-figma');
 */

function parsePixels(val) {
  if (val === undefined || val === null) return null;
  if (typeof val === 'number') return val;
  const str = String(val).trim();
  if (str === '0' || str === '0px') return 0;
  const match = str.match(/^(-?[\d.]+)px$/);
  return match ? parseFloat(match[1]) : null;
}

function parseRgb(val) {
  if (!val || typeof val !== 'string') return null;
  const rgbMatch = val.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1], 10) / 255,
      g: parseInt(rgbMatch[2], 10) / 255,
      b: parseInt(rgbMatch[3], 10) / 255,
      a: 1,
    };
  }
  const rgbaMatch = val.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/);
  if (rgbaMatch) {
    return {
      r: parseInt(rgbaMatch[1], 10) / 255,
      g: parseInt(rgbaMatch[2], 10) / 255,
      b: parseInt(rgbaMatch[3], 10) / 255,
      a: parseFloat(rgbaMatch[4]),
    };
  }
  return null;
}

function colorKey(r, g, b) {
  return `${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)}`;
}

function buildReverseColorMap(designTokens) {
  const map = {};
  if (!designTokens || !designTokens.tokens) return map;
  for (const token of designTokens.tokens) {
    if (token.figmaType !== 'COLOR' || !token.resolved) continue;
    const hex = token.resolved.hex;
    if (!hex) continue;
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const key = `${r},${g},${b}`;
    if (!map[key]) {
      map[key] = {
        cssVar: token.cssVar,
        figmaPath: token.figmaPath,
        figmaCollection: token.figmaCollection,
      };
    }
  }
  return map;
}

function resolveColor(rgbString, variablesMap, reverseColorMap) {
  const parsed = parseRgb(rgbString);
  if (!parsed) return null;
  if (parsed.a === 0) return null;

  const figmaColor = { r: parsed.r, g: parsed.g, b: parsed.b };
  let variableId = null;
  let figmaPath = null;

  if (reverseColorMap) {
    const key = colorKey(parsed.r, parsed.g, parsed.b);
    const match = reverseColorMap[key];
    if (match && variablesMap) {
      const varEntry = variablesMap[`var(${match.cssVar})`] || variablesMap[match.cssVar];
      if (varEntry) {
        variableId = varEntry.variableId;
        figmaPath = varEntry.figmaPath || match.figmaPath;
      }
    }
  }

  return {
    color: figmaColor,
    opacity: parsed.a,
    variableId,
    figmaPath,
  };
}

function mapLayout(styles) {
  const result = {
    layoutMode: null,
    itemSpacing: 0,
    counterAxisSpacing: null,
    primaryAxisAlignItems: 'MIN',
    counterAxisAlignItems: 'MIN',
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    clipsContent: false,
  };

  const display = styles['display'];
  const flexDirection = styles['flex-direction'];

  if (display === 'flex' || display === 'inline-flex') {
    if (flexDirection === 'column' || flexDirection === 'column-reverse') {
      result.layoutMode = 'VERTICAL';
    } else {
      result.layoutMode = 'HORIZONTAL';
    }
  } else if (display === 'block' || display === 'inline-block' || display === 'inline') {
    result.layoutMode = 'VERTICAL';
  }

  const gap = parsePixels(styles['gap']);
  if (gap !== null) result.itemSpacing = gap;

  const rowGap = parsePixels(styles['row-gap']);
  const colGap = parsePixels(styles['column-gap']);
  if (result.layoutMode === 'VERTICAL') {
    if (rowGap !== null) result.itemSpacing = rowGap;
    if (colGap !== null) result.counterAxisSpacing = colGap;
  } else {
    if (colGap !== null) result.itemSpacing = colGap;
    if (rowGap !== null) result.counterAxisSpacing = rowGap;
  }

  const alignItems = styles['align-items'];
  switch (alignItems) {
    case 'center': result.counterAxisAlignItems = 'CENTER'; break;
    case 'flex-start': case 'start': result.counterAxisAlignItems = 'MIN'; break;
    case 'flex-end': case 'end': result.counterAxisAlignItems = 'MAX'; break;
    case 'baseline': result.counterAxisAlignItems = 'BASELINE'; break;
    case 'stretch': result.counterAxisAlignItems = 'MIN'; break;
  }

  const justifyContent = styles['justify-content'];
  switch (justifyContent) {
    case 'center': result.primaryAxisAlignItems = 'CENTER'; break;
    case 'flex-start': case 'start': result.primaryAxisAlignItems = 'MIN'; break;
    case 'flex-end': case 'end': result.primaryAxisAlignItems = 'MAX'; break;
    case 'space-between': result.primaryAxisAlignItems = 'SPACE_BETWEEN'; break;
  }

  result.paddingTop = parsePixels(styles['padding-top']) || 0;
  result.paddingRight = parsePixels(styles['padding-right']) || 0;
  result.paddingBottom = parsePixels(styles['padding-bottom']) || 0;
  result.paddingLeft = parsePixels(styles['padding-left']) || 0;

  const overflowX = styles['overflow-x'];
  const overflowY = styles['overflow-y'];
  if (overflowX === 'hidden' || overflowY === 'hidden') {
    result.clipsContent = true;
  }

  return result;
}

function mapSizing(styles, bbox, parentStyles) {
  const width = parsePixels(styles['width']);
  const height = parsePixels(styles['height']);
  const minW = parsePixels(styles['min-width']);
  const minH = parsePixels(styles['min-height']);
  const maxW = parsePixels(styles['max-width']);
  const maxH = parsePixels(styles['max-height']);

  const flexGrow = parseFloat(styles['flex-grow']) || 0;
  const flexBasis = styles['flex-basis'];
  const alignSelf = styles['align-self'];

  const display = styles['display'];
  const isAutoLayout = display === 'flex' || display === 'inline-flex';

  const parentDisplay = parentStyles ? parentStyles['display'] : null;
  const insideAutoLayout = parentDisplay === 'flex' || parentDisplay === 'inline-flex';
  const parentDirection = parentStyles ? parentStyles['flex-direction'] : null;
  const parentIsVertical = parentDirection === 'column' || parentDirection === 'column-reverse';
  const parentAlignItems = parentStyles ? parentStyles['align-items'] : null;

  let primaryAxisSizingMode = 'AUTO';
  let counterAxisSizingMode = 'AUTO';

  if (!isAutoLayout) {
    if (width !== null && width > 0) primaryAxisSizingMode = 'FIXED';
    if (height !== null && height > 0) counterAxisSizingMode = 'FIXED';
  }

  let layoutSizingHorizontal = null;
  let layoutSizingVertical = null;

  if (insideAutoLayout) {
    if (parentIsVertical) {
      layoutSizingVertical = flexGrow > 0 ? 'FILL' : 'HUG';
      const stretchH = alignSelf === 'stretch' ||
        ((!alignSelf || alignSelf === 'auto') && parentAlignItems === 'stretch');
      layoutSizingHorizontal = stretchH ? 'FILL' : 'HUG';
    } else {
      layoutSizingHorizontal = flexGrow > 0 ? 'FILL' : 'HUG';
      const stretchV = alignSelf === 'stretch' ||
        ((!alignSelf || alignSelf === 'auto') && parentAlignItems === 'stretch');
      layoutSizingVertical = stretchV ? 'FILL' : 'HUG';
    }

    if (layoutSizingHorizontal !== 'FILL' && width !== null && width > 0 && flexGrow === 0) {
      if (!isAutoLayout) {
        layoutSizingHorizontal = 'FIXED';
      }
    }
    if (layoutSizingVertical !== 'FILL' && height !== null && height > 0 && flexGrow === 0) {
      if (!isAutoLayout) {
        layoutSizingVertical = 'FIXED';
      }
    }
  }

  return {
    primaryAxisSizingMode,
    counterAxisSizingMode,
    layoutSizingHorizontal,
    layoutSizingVertical,
    width: width !== null && width > 0 ? width : null,
    height: height !== null && height > 0 ? height : null,
    minWidth: minW,
    minHeight: minH,
    maxWidth: maxW,
    maxHeight: maxH,
  };
}

function mapFills(styles, variablesMap, reverseColorMap) {
  const bgColor = styles['background-color'];
  if (!bgColor) return [];

  const resolved = resolveColor(bgColor, variablesMap, reverseColorMap);
  if (!resolved) return [];

  return [{
    type: 'SOLID',
    color: resolved.color,
    opacity: resolved.opacity,
    variableId: resolved.variableId,
    figmaPath: resolved.figmaPath,
  }];
}

function mapStrokes(styles, variablesMap, reverseColorMap) {
  const topW = parsePixels(styles['border-top-width']);
  const rightW = parsePixels(styles['border-right-width']);
  const bottomW = parsePixels(styles['border-bottom-width']);
  const leftW = parsePixels(styles['border-left-width']);

  const hasStroke = (topW && topW > 0) || (rightW && rightW > 0) ||
                    (bottomW && bottomW > 0) || (leftW && leftW > 0);
  if (!hasStroke) return null;

  const uniform = topW === rightW && rightW === bottomW && bottomW === leftW;

  const borderColor = styles['border-top-color'] || styles['border-right-color'] ||
                      styles['border-bottom-color'] || styles['border-left-color'];
  const resolved = borderColor ? resolveColor(borderColor, variablesMap, reverseColorMap) : null;

  return {
    strokeWeight: uniform ? topW : null,
    strokeTopWeight: topW || 0,
    strokeRightWeight: rightW || 0,
    strokeBottomWeight: bottomW || 0,
    strokeLeftWeight: leftW || 0,
    strokeAlign: 'OUTSIDE',
    uniform,
    color: resolved ? resolved.color : null,
    opacity: resolved ? resolved.opacity : 1,
    variableId: resolved ? resolved.variableId : null,
    figmaPath: resolved ? resolved.figmaPath : null,
  };
}

function mapTypography(styles) {
  const result = {
    fontFamily: 'Inter',
    fontStyle: 'Regular',
    fontSize: 14,
    lineHeight: null,
    letterSpacing: null,
    textAlignHorizontal: 'LEFT',
    textDecoration: 'NONE',
    textTruncation: null,
  };

  const fontFamily = styles['font-family'];
  if (fontFamily) {
    const first = fontFamily.split(',')[0].trim().replace(/["']/g, '');
    if (first === 'ui-sans-serif' || first === 'system-ui' || first === 'sans-serif') {
      result.fontFamily = 'Inter';
    } else if (first === 'ui-monospace' || first === 'monospace' || first === 'SFMono-Regular') {
      result.fontFamily = 'Source Code Pro';
    } else if (first === 'ui-serif' || first === 'serif' || first === 'Georgia') {
      result.fontFamily = 'Source Serif Pro';
    } else {
      result.fontFamily = first;
    }
  }

  const fontWeight = styles['font-weight'];
  if (fontWeight) {
    const w = parseInt(fontWeight, 10);
    if (w <= 100) result.fontStyle = 'Thin';
    else if (w <= 200) result.fontStyle = 'Extra Light';
    else if (w <= 300) result.fontStyle = 'Light';
    else if (w <= 400) result.fontStyle = 'Regular';
    else if (w <= 500) result.fontStyle = 'Medium';
    else if (w <= 600) result.fontStyle = 'Semi Bold';
    else if (w <= 700) result.fontStyle = 'Bold';
    else if (w <= 800) result.fontStyle = 'Extra Bold';
    else result.fontStyle = 'Black';
  }

  const fontSize = parsePixels(styles['font-size']);
  if (fontSize !== null) result.fontSize = fontSize;

  const lineHeight = parsePixels(styles['line-height']);
  if (lineHeight !== null) {
    result.lineHeight = { value: lineHeight, unit: 'PIXELS' };
  }

  const letterSpacing = parsePixels(styles['letter-spacing']);
  if (letterSpacing !== null && letterSpacing !== 0) {
    result.letterSpacing = { value: letterSpacing, unit: 'PIXELS' };
  }

  const textAlign = styles['text-align'];
  switch (textAlign) {
    case 'center': result.textAlignHorizontal = 'CENTER'; break;
    case 'right': result.textAlignHorizontal = 'RIGHT'; break;
    case 'justify': result.textAlignHorizontal = 'JUSTIFIED'; break;
    default: result.textAlignHorizontal = 'LEFT'; break;
  }

  const textDecoration = styles['text-decoration'];
  if (textDecoration && textDecoration.includes('underline')) {
    result.textDecoration = 'UNDERLINE';
  } else if (textDecoration && textDecoration.includes('line-through')) {
    result.textDecoration = 'STRIKETHROUGH';
  }

  const textOverflow = styles['text-overflow'];
  const whiteSpace = styles['white-space'];
  if (textOverflow === 'ellipsis' || whiteSpace === 'nowrap') {
    result.textTruncation = 'ENDING';
  }

  return result;
}

function mapCornerRadius(styles, variablesMap) {
  const tl = parsePixels(styles['border-top-left-radius']) || 0;
  const tr = parsePixels(styles['border-top-right-radius']) || 0;
  const br = parsePixels(styles['border-bottom-right-radius']) || 0;
  const bl = parsePixels(styles['border-bottom-left-radius']) || 0;

  const uniform = tl === tr && tr === br && br === bl;

  let variableId = null;
  if (uniform && tl > 0 && variablesMap) {
    const radiusKey = `radius-${tl}`;
    const entry = variablesMap[radiusKey];
    if (entry) {
      variableId = entry.variableId;
    }
  }

  return {
    uniform,
    topLeft: tl,
    topRight: tr,
    bottomRight: br,
    bottomLeft: bl,
    value: uniform ? tl : null,
    variableId,
  };
}

function mapEffects(styles) {
  const effects = [];
  const boxShadow = styles['box-shadow'];

  if (!boxShadow || boxShadow === 'none') return effects;

  const shadowRegex = /(?:^|,\s*)((?:inset\s+)?(?:(?:rgba?\([^)]+\)|[\w#]+)\s+)?-?[\d.]+px\s+-?[\d.]+px\s+-?[\d.]+px(?:\s+-?[\d.]+px)?(?:\s+(?:rgba?\([^)]+\)|[\w#]+))?)/g;
  let match;
  while ((match = shadowRegex.exec(boxShadow)) !== null) {
    const shadow = match[1].trim();
    const isInset = shadow.startsWith('inset');

    const colorMatch = shadow.match(/rgba?\([^)]+\)/);
    let color = { r: 0, g: 0, b: 0 };
    let opacity = 0.25;
    if (colorMatch) {
      const parsed = parseRgb(colorMatch[0]);
      if (parsed) {
        color = { r: parsed.r, g: parsed.g, b: parsed.b };
        opacity = parsed.a;
      }
    }

    const numbers = shadow.replace(/rgba?\([^)]+\)/, '').replace('inset', '').trim();
    const parts = numbers.split(/\s+/).map((s) => parseFloat(s) || 0);
    const [offsetX = 0, offsetY = 0, blur = 0, spread = 0] = parts;

    effects.push({
      type: isInset ? 'INNER_SHADOW' : 'DROP_SHADOW',
      color,
      opacity,
      offset: { x: offsetX, y: offsetY },
      radius: blur,
      spread,
      visible: true,
    });
  }

  return effects;
}

function mapOpacity(styles) {
  const opacity = styles['opacity'];
  if (opacity === undefined || opacity === null) return 1;
  const val = parseFloat(opacity);
  return isNaN(val) ? 1 : val;
}

function extractRing(effects) {
  const ring = [];
  const remaining = [];
  for (const e of effects) {
    const isRing = e.type === 'DROP_SHADOW'
      && e.offset.x === 0 && e.offset.y === 0
      && e.radius === 0
      && e.spread > 0
      && e.opacity > 0;
    if (isRing) {
      ring.push(e);
    } else {
      remaining.push(e);
    }
  }
  return { ring, remaining };
}

module.exports = {
  parsePixels,
  parseRgb,
  colorKey,
  buildReverseColorMap,
  resolveColor,
  mapLayout,
  mapSizing,
  mapFills,
  mapStrokes,
  mapTypography,
  mapCornerRadius,
  mapEffects,
  extractRing,
  mapOpacity,
};
