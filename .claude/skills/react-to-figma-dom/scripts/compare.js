/**
 * Pixel-level visual comparison of two screenshot images.
 *
 * Uses pixelmatch + pngjs (pure JS, no native deps) to compare images,
 * compute an overall match percentage and a separate border-ring match
 * percentage, then writes:
 *   - diff.png        — red-highlighted pixel differences
 *   - composite.png   — side-by-side [React | Diff | Figma] with labels
 *   - comparison.json — match stats and verdict
 *
 * Exit code signals the verdict:
 *   0 = match, 1 = minor_diff, 2 = mismatch, 3 = error.
 *
 * Usage:
 *   node compare.js <imageA> <imageB> <outputDir>
 *     [--match-threshold N]   default 90   — % pixels that must match for PASS
 *     [--defect-threshold N]  default 75   — % pixels for PARTIAL (below = FAIL)
 *     [--border-ring N]       default 4    — pixel width of border region
 *     [--border-threshold N]  default 85   — % border pixels that must match
 *     [--tolerance N]         default 0.1  — pixelmatch threshold (0–1, lower = stricter)
 */

const pixelmatch = require('pixelmatch').default;
const { PNG }    = require('pngjs');
const path       = require('path');
const fs         = require('fs');

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--') && i + 1 < argv.length) {
      flags[argv[i].slice(2)] = parseFloat(argv[i + 1]);
      i++;
    } else {
      positional.push(argv[i]);
    }
  }
  return { positional, flags };
}

const { positional, flags } = parseArgs(process.argv.slice(2));
const [imageA, imageB, outputDir] = positional;

if (!imageA || !imageB || !outputDir) {
  console.error('Usage: node compare.js <imageA> <imageB> <outputDir> [--match-threshold N] [--defect-threshold N] [--border-ring N] [--border-threshold N] [--tolerance N]');
  process.exit(1);
}

const MATCH_THRESHOLD  = flags['match-threshold']  ?? 90;
const DEFECT_THRESHOLD = flags['defect-threshold'] ?? 75;
const BORDER_RING      = flags['border-ring']      ?? 4;
const BORDER_THRESHOLD = flags['border-threshold'] ?? 85;
const TOLERANCE        = flags['tolerance']         ?? 0.1;

const absA = path.resolve(imageA);
const absB = path.resolve(imageB);
fs.mkdirSync(outputDir, { recursive: true });

const UNIFORMITY_THRESHOLD = 0.85;

function readPng(filePath) {
  return PNG.sync.read(fs.readFileSync(filePath));
}

function getDominantColor(png) {
  const { width, height, data } = png;
  const total = width * height;
  let transparentCount = 0;
  for (let i = 0; i < total; i++) {
    if (data[i * 4 + 3] < 10) transparentCount++;
  }
  if (transparentCount / total > 0.3) {
    return { R: 255, G: 255, B: 255, fraction: transparentCount / total };
  }
  const buckets = new Map();
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (data[i + 3] < 10) continue;
      const qR = (data[i] >> 4) << 4;
      const qG = (data[i + 1] >> 4) << 4;
      const qB = (data[i + 2] >> 4) << 4;
      const key = (qR << 16) | (qG << 8) | qB;
      buckets.set(key, (buckets.get(key) || 0) + 1);
    }
  }
  let maxCount = 0, maxKey = 0;
  for (const [key, count] of buckets) {
    if (count > maxCount) { maxCount = count; maxKey = key; }
  }
  return {
    R: (maxKey >> 16) & 0xFF,
    G: (maxKey >> 8) & 0xFF,
    B: maxKey & 0xFF,
    fraction: maxCount / total,
  };
}

function getContentBounds(png, bgColor, bgTolerance) {
  const tol = bgTolerance ?? 15;
  const { width, height, data } = png;
  let t = height, b = 0, l = width, r = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const R = data[i], G = data[i + 1], B = data[i + 2], A = data[i + 3];
      if (A < 10) continue;
      if (bgColor) {
        if (Math.abs(R - bgColor.R) <= tol &&
            Math.abs(G - bgColor.G) <= tol &&
            Math.abs(B - bgColor.B) <= tol) continue;
      } else {
        if (R > 245 && G > 245 && B > 245) continue;
      }
      if (y < t) t = y;
      if (y > b) b = y;
      if (x < l) l = x;
      if (x > r) r = x;
    }
  }
  if (b < t) return { x: 0, y: 0, w: width, h: height };
  const pad = 2;
  return {
    x: Math.max(0, l - pad),
    y: Math.max(0, t - pad),
    w: Math.min(width, r - l + 1 + pad * 2),
    h: Math.min(height, b - t + 1 + pad * 2),
  };
}

function cropToRgba(png, bounds, targetW, targetH) {
  const out = new Uint8Array(targetW * targetH * 4);
  const { width, data } = png;
  const copyW = Math.min(bounds.w, targetW);
  const copyH = Math.min(bounds.h, targetH);
  for (let y = 0; y < copyH; y++) {
    for (let x = 0; x < copyW; x++) {
      const srcI = ((bounds.y + y) * width + (bounds.x + x)) * 4;
      const dstI = (y * targetW + x) * 4;
      out[dstI]     = data[srcI];
      out[dstI + 1] = data[srcI + 1];
      out[dstI + 2] = data[srcI + 2];
      out[dstI + 3] = data[srcI + 3];
    }
  }
  return out;
}

function flattenToWhite(rgba, w, h) {
  const out = new Uint8Array(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const si = i * 4;
    const a = rgba[si + 3] / 255;
    out[si]     = Math.round(rgba[si]     * a + 255 * (1 - a));
    out[si + 1] = Math.round(rgba[si + 1] * a + 255 * (1 - a));
    out[si + 2] = Math.round(rgba[si + 2] * a + 255 * (1 - a));
    out[si + 3] = 255;
  }
  return out;
}

function resizeBilinear(src, srcW, srcH, dstW, dstH) {
  const dst = new Uint8Array(dstW * dstH * 4);
  for (let y = 0; y < dstH; y++) {
    for (let x = 0; x < dstW; x++) {
      const sx = (x + 0.5) * srcW / dstW - 0.5;
      const sy = (y + 0.5) * srcH / dstH - 0.5;
      const x0 = Math.max(0, Math.floor(sx));
      const y0 = Math.max(0, Math.floor(sy));
      const x1 = Math.min(srcW - 1, x0 + 1);
      const y1 = Math.min(srcH - 1, y0 + 1);
      const fx = sx - x0;
      const fy = sy - y0;
      const di = (y * dstW + x) * 4;
      for (let c = 0; c < 4; c++) {
        const v00 = src[(y0 * srcW + x0) * 4 + c];
        const v10 = src[(y0 * srcW + x1) * 4 + c];
        const v01 = src[(y1 * srcW + x0) * 4 + c];
        const v11 = src[(y1 * srcW + x1) * 4 + c];
        dst[di + c] = Math.round(
          v00 * (1 - fx) * (1 - fy) +
          v10 * fx * (1 - fy) +
          v01 * (1 - fx) * fy +
          v11 * fx * fy
        );
      }
    }
  }
  return dst;
}

function countBorderDiffs(diffData, w, h, ring) {
  let borderTotal = 0;
  let borderDiff  = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const inBorder = x < ring || x >= w - ring || y < ring || y >= h - ring;
      if (!inBorder) continue;
      borderTotal++;
      const i = (y * w + x) * 4;
      if (diffData[i] === 255 && diffData[i + 1] === 106 && diffData[i + 2] === 0) {
        borderDiff++;
      }
    }
  }
  return { borderTotal, borderDiff };
}

const LABEL_HEIGHT = 20;
const GAP = 4;

function drawLabel(data, compositeW, xOffset, yOffset, label) {
  const CHAR_W = 6;
  const CHAR_H = 10;
  const GLYPHS = {
    'R': [0x7C,0x42,0x42,0x7C,0x48,0x44,0x42,0x42,0x00,0x00],
    'e': [0x00,0x00,0x3C,0x42,0x7E,0x40,0x3C,0x00,0x00,0x00],
    'a': [0x00,0x00,0x3C,0x02,0x3E,0x42,0x3E,0x00,0x00,0x00],
    'c': [0x00,0x00,0x3C,0x40,0x40,0x40,0x3C,0x00,0x00,0x00],
    't': [0x10,0x10,0x7C,0x10,0x10,0x10,0x0C,0x00,0x00,0x00],
    'D': [0x78,0x44,0x42,0x42,0x42,0x44,0x78,0x00,0x00,0x00],
    'i': [0x10,0x00,0x30,0x10,0x10,0x10,0x38,0x00,0x00,0x00],
    'f': [0x0C,0x10,0x10,0x7C,0x10,0x10,0x10,0x00,0x00,0x00],
    'F': [0x7E,0x40,0x40,0x7C,0x40,0x40,0x40,0x00,0x00,0x00],
    'g': [0x00,0x00,0x3E,0x42,0x42,0x3E,0x02,0x3C,0x00,0x00],
    'm': [0x00,0x00,0x76,0x49,0x49,0x49,0x49,0x00,0x00,0x00],
    ' ': [0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00],
  };
  const startX = xOffset + 4;
  const startY = yOffset + 5;
  for (let ci = 0; ci < label.length; ci++) {
    const glyph = GLYPHS[label[ci]];
    if (!glyph) continue;
    for (let row = 0; row < CHAR_H; row++) {
      const bits = glyph[row] || 0;
      for (let col = 0; col < CHAR_W; col++) {
        if (bits & (0x80 >> col)) {
          const px = startX + ci * CHAR_W + col;
          const py = startY + row;
          if (px < compositeW && py < yOffset + LABEL_HEIGHT) {
            const idx = (py * compositeW + px) * 4;
            data[idx] = 255; data[idx+1] = 255; data[idx+2] = 255; data[idx+3] = 255;
          }
        }
      }
    }
  }
}

function buildComposite(dataA, diffBuf, dataB, w, h) {
  const compositeW = w * 3 + GAP * 2;
  const compositeH = h + LABEL_HEIGHT;
  const composite = new PNG({ width: compositeW, height: compositeH });

  for (let y = 0; y < LABEL_HEIGHT; y++) {
    for (let x = 0; x < compositeW; x++) {
      const i = (y * compositeW + x) * 4;
      composite.data[i] = 40; composite.data[i+1] = 40;
      composite.data[i+2] = 40; composite.data[i+3] = 255;
    }
  }

  drawLabel(composite.data, compositeW, 0, 0, 'React');
  drawLabel(composite.data, compositeW, w + GAP, 0, 'Diff');
  drawLabel(composite.data, compositeW, w * 2 + GAP * 2, 0, 'Figma');

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const srcI = (y * w + x) * 4;
      const dstY = y + LABEL_HEIGHT;

      const iA = (dstY * compositeW + x) * 4;
      composite.data[iA]     = dataA[srcI];
      composite.data[iA + 1] = dataA[srcI + 1];
      composite.data[iA + 2] = dataA[srcI + 2];
      composite.data[iA + 3] = dataA[srcI + 3];

      const iD = (dstY * compositeW + (w + GAP + x)) * 4;
      composite.data[iD]     = diffBuf[srcI];
      composite.data[iD + 1] = diffBuf[srcI + 1];
      composite.data[iD + 2] = diffBuf[srcI + 2];
      composite.data[iD + 3] = diffBuf[srcI + 3];

      const iB = (dstY * compositeW + (w * 2 + GAP * 2 + x)) * 4;
      composite.data[iB]     = dataB[srcI];
      composite.data[iB + 1] = dataB[srcI + 1];
      composite.data[iB + 2] = dataB[srcI + 2];
      composite.data[iB + 3] = dataB[srcI + 3];
    }
  }

  for (let y = 0; y < compositeH; y++) {
    for (let g = 0; g < GAP; g++) {
      const i1 = (y * compositeW + w + g) * 4;
      composite.data[i1] = 30; composite.data[i1+1] = 30;
      composite.data[i1+2] = 30; composite.data[i1+3] = 255;

      const i2 = (y * compositeW + w * 2 + GAP + g) * 4;
      composite.data[i2] = 30; composite.data[i2+1] = 30;
      composite.data[i2+2] = 30; composite.data[i2+3] = 255;
    }
  }

  return composite;
}

try {
  const pngA = readPng(absA);
  const pngB = readPng(absB);

  const domColorA = getDominantColor(pngA);
  const domColorB = getDominantColor(pngB);

  const boundsA = getContentBounds(pngA, domColorA, 15);
  const boundsB = getContentBounds(pngB, domColorB, 15);

  const uniformityA = 1 - (boundsA.w * boundsA.h) / (pngA.width * pngA.height);
  const uniformityB = 1 - (boundsB.w * boundsB.h) / (pngB.width * pngB.height);
  const hasNonWhiteBgA = domColorA.R < 240 || domColorA.G < 240 || domColorA.B < 240;
  const hasNonWhiteBgB = domColorB.R < 240 || domColorB.G < 240 || domColorB.B < 240;
  const highUniformity = (uniformityA > UNIFORMITY_THRESHOLD && hasNonWhiteBgA) ||
                         (uniformityB > UNIFORMITY_THRESHOLD && hasNonWhiteBgB);

  let croppedA = cropToRgba(pngA, boundsA, boundsA.w, boundsA.h);
  let croppedB = cropToRgba(pngB, boundsB, boundsB.w, boundsB.h);

  if (boundsA.w !== boundsB.w || boundsA.h !== boundsB.h) {
    croppedB = resizeBilinear(croppedB, boundsB.w, boundsB.h, boundsA.w, boundsA.h);
  }

  const w = boundsA.w;
  const h = boundsA.h;

  const dataA = flattenToWhite(croppedA, w, h);
  const dataB = flattenToWhite(croppedB, w, h);
  const diffBuf = new Uint8Array(w * h * 4);

  const diffPixels = pixelmatch(dataA, dataB, diffBuf, w, h, {
    threshold: TOLERANCE,
    includeAA: false,
  });

  const { borderTotal, borderDiff } = countBorderDiffs(diffBuf, w, h, BORDER_RING);

  const total    = w * h;
  const matchPct = Math.round(((total - diffPixels) / total) * 10000) / 100;
  const borderMatchPct = borderTotal > 0
    ? Math.round(((borderTotal - borderDiff) / borderTotal) * 10000) / 100
    : 100;

  let verdict         = matchPct >= MATCH_THRESHOLD ? 'match'
                      : matchPct >= DEFECT_THRESHOLD ? 'minor_diff'
                      : 'mismatch';
  const borderVerdict = borderMatchPct >= BORDER_THRESHOLD ? 'border_ok' : 'border_diff';

  if (highUniformity && verdict === 'match') {
    verdict = 'needs_review';
  }

  const diffPng = new PNG({ width: w, height: h });
  diffPng.data = Buffer.from(diffBuf);
  fs.writeFileSync(path.join(outputDir, 'diff.png'), PNG.sync.write(diffPng));

  const composite = buildComposite(dataA, diffBuf, dataB, w, h);
  fs.writeFileSync(path.join(outputDir, 'composite.png'), PNG.sync.write(composite));

  const json = {
    matchPct,
    borderMatchPct,
    diffPixels,
    totalPixels: total,
    borderDiff,
    borderTotal,
    normalizedW: w,
    normalizedH: h,
    uniformityA: Math.round(uniformityA * 10000) / 100,
    uniformityB: Math.round(uniformityB * 10000) / 100,
    verdict,
    borderVerdict,
    thresholds: {
      match: MATCH_THRESHOLD, defect: DEFECT_THRESHOLD,
      borderRing: BORDER_RING, border: BORDER_THRESHOLD,
      tolerance: TOLERANCE,
      uniformity: UNIFORMITY_THRESHOLD * 100,
    },
  };
  fs.writeFileSync(path.join(outputDir, 'comparison.json'), JSON.stringify(json, null, 2));

  const effectiveVerdict = verdict === 'needs_review' ? 'needs_review'
    : borderVerdict === 'border_diff' && verdict === 'match' ? 'minor_diff'
    : verdict;

  const icon = effectiveVerdict === 'match' ? '✅' : effectiveVerdict === 'needs_review' ? '🔍' : effectiveVerdict === 'minor_diff' ? '⚠️' : '❌';
  const uniformNote = highUniformity ? ` | uniformity A=${Math.round(uniformityA*100)}% B=${Math.round(uniformityB*100)}%` : '';
  console.log(`${icon} ${effectiveVerdict.toUpperCase()} — overall ${matchPct}% | border ${borderMatchPct}% (${borderDiff}/${borderTotal} border px differ)${uniformNote}`);
  console.log(`   diff → ${path.join(outputDir, 'diff.png')}`);

  process.exit(effectiveVerdict === 'mismatch' ? 2 : effectiveVerdict === 'needs_review' || effectiveVerdict === 'minor_diff' ? 1 : 0);
} catch (err) {
  console.error('compare.js error:', err.message);
  process.exit(3);
}
