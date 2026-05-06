/**
 * Visual diff helper for figma-rebuild-from-code-validator
 *
 * Loads two PNG screenshots into a headless browser canvas, scales both to the
 * same dimensions, and computes a pixel-level diff. Also runs a separate
 * border-region analysis (outer 4px ring) to catch subtle styling differences
 * like extra strokes, wrong border colors, or box-shadow issues that can be
 * masked by text-content diffs in the overall score.
 *
 * Usage:
 *   node compare.js <appPng> <figmaPng> <outputDir>
 *
 * Outputs (written to outputDir/):
 *   diff.png        — red pixels where the images differ (dimmed original for context)
 *   comparison.json — { matchPct, diffPct, borderMatchPct, verdict, borderVerdict, ... }
 *
 * Verdict thresholds (overall):
 *   >= 90%  → "match"
 *   75–90%  → "minor_diff"   (flag for review — show diff image)
 *   < 75%   → "mismatch"     (auto-defect)
 *
 * When Figma components are seeded with real app text (via extract-text.js),
 * the thresholds become meaningful: a score of 75–90% on a text-seeded component
 * is likely a real structural difference (layout, spacing, color), not a content delta.
 * For components still using placeholder text, scores < 75% may be text-content-only.
 *
 * Border-region verdict (outer BORDER_RING px):
 *   >= 85%  → "border_ok"
 *   < 85%   → "border_diff"  (flag as defect even if overall score is "match")
 *
 * The border check exists because text content differences (real data vs Figma
 * placeholder) inflate the overall diff score, allowing subtle border/shadow
 * defects to hide below the threshold. The border ring is almost never affected
 * by text content, so a lower threshold there catches styling regressions.
 */

const { chromium } = require('@playwright/test');
const path = require('path');
const fs   = require('fs');

const MATCH_THRESHOLD  = 90;  // % overall — below this is flagged for review
const DEFECT_THRESHOLD = 75;  // % overall — below this is auto-defect
const BORDER_RING      = 4;   // px — width of edge ring examined separately
const BORDER_THRESHOLD = 85;  // % — border-region match; below = border_diff defect

const [appPng, figmaPng, outputDir] = process.argv.slice(2);
if (!appPng || !figmaPng || !outputDir) {
  console.error('Usage: node compare.js <appPng> <figmaPng> <outputDir>');
  process.exit(1);
}

const appAbs   = path.resolve(appPng);
const figmaAbs = path.resolve(figmaPng);
fs.mkdirSync(outputDir, { recursive: true });

function toDataUrl(filePath) {
  const bytes = fs.readFileSync(filePath);
  return 'data:image/png;base64,' + bytes.toString('base64');
}

(async () => {
  const browser = await chromium.launch();
  const page    = await browser.newPage();
  await page.goto('about:blank');

  const result = await page.evaluate(async ({
    appUrl, figmaUrl,
    matchThreshold, defectThreshold, borderRing, borderThreshold,
  }) => {
    function loadImage(src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload  = () => resolve(img);
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = src;
      });
    }

    const [imgA, imgB] = await Promise.all([loadImage(appUrl), loadImage(figmaUrl)]);

    // Normalise to the Figma image's native dimensions.
    // The Figma screenshot is the designed/intended size; we scale the app screenshot
    // to match it so the full width is always compared — not just a cropped left edge.
    // This is critical for catching border/shadow differences that span the full width.
    const w = imgB.naturalWidth;
    const h = imgB.naturalHeight;

    const cvA = document.createElement('canvas'); cvA.width = w; cvA.height = h;
    const cvB = document.createElement('canvas'); cvB.width = w; cvB.height = h;
    const cvD = document.createElement('canvas'); cvD.width = w; cvD.height = h;

    cvA.getContext('2d').drawImage(imgA, 0, 0, w, h); // scale app → figma size
    cvB.getContext('2d').drawImage(imgB, 0, 0, w, h); // figma at native size

    const dataA   = cvA.getContext('2d').getImageData(0, 0, w, h);
    const dataB   = cvB.getContext('2d').getImageData(0, 0, w, h);
    const diffImg = cvD.getContext('2d').createImageData(w, h);

    const TOLERANCE = 28; // per-channel delta — accounts for renderer anti-aliasing

    let diffPixels   = 0;
    let borderDiff   = 0;
    let borderTotal  = 0;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const i = (y * w + x) * 4;
        const rD = Math.abs(dataA.data[i]     - dataB.data[i]);
        const gD = Math.abs(dataA.data[i + 1] - dataB.data[i + 1]);
        const bD = Math.abs(dataA.data[i + 2] - dataB.data[i + 2]);
        const maxDiff = Math.max(rD, gD, bD);
        const isDiff  = maxDiff > TOLERANCE;

        // Is this pixel in the border ring?
        const inBorder = x < borderRing || x >= w - borderRing
                      || y < borderRing || y >= h - borderRing;

        if (isDiff) diffPixels++;
        if (inBorder) {
          borderTotal++;
          if (isDiff) borderDiff++;
        }

        if (isDiff) {
          diffImg.data[i] = 255; diffImg.data[i+1] = 0; diffImg.data[i+2] = 0; diffImg.data[i+3] = 220;
        } else {
          diffImg.data[i]   = dataA.data[i]   >> 1;
          diffImg.data[i+1] = dataA.data[i+1] >> 1;
          diffImg.data[i+2] = dataA.data[i+2] >> 1;
          diffImg.data[i+3] = 255;
        }
      }
    }

    cvD.getContext('2d').putImageData(diffImg, 0, 0);

    const total          = w * h;
    const matchPct       = Math.round(((total - diffPixels) / total) * 10000) / 100;
    const borderMatchPct = borderTotal > 0
      ? Math.round(((borderTotal - borderDiff) / borderTotal) * 10000) / 100
      : 100;

    const verdict       = matchPct >= matchThreshold ? 'match'
                        : matchPct >= defectThreshold ? 'minor_diff'
                        : 'mismatch';
    const borderVerdict = borderMatchPct >= borderThreshold ? 'border_ok' : 'border_diff';

    return {
      matchPct, borderMatchPct,
      diffPixels, totalPixels: total,
      borderDiff, borderTotal,
      verdict, borderVerdict,
      w, h,
      diffDataUrl: cvD.toDataURL('image/png'),
    };
  }, { appUrl: toDataUrl(appAbs), figmaUrl: toDataUrl(figmaAbs),
       matchThreshold: MATCH_THRESHOLD, defectThreshold: DEFECT_THRESHOLD,
       borderRing: BORDER_RING, borderThreshold: BORDER_THRESHOLD });

  // Save diff PNG
  const b64 = result.diffDataUrl.replace(/^data:image\/png;base64,/, '');
  fs.writeFileSync(path.join(outputDir, 'diff.png'), Buffer.from(b64, 'base64'));

  // Save JSON
  const json = {
    matchPct:       result.matchPct,
    borderMatchPct: result.borderMatchPct,
    diffPixels:     result.diffPixels,
    totalPixels:    result.totalPixels,
    borderDiff:     result.borderDiff,
    borderTotal:    result.borderTotal,
    normalizedW:    result.w,
    normalizedH:    result.h,
    verdict:        result.verdict,
    borderVerdict:  result.borderVerdict,
    thresholds: {
      match: MATCH_THRESHOLD, defect: DEFECT_THRESHOLD,
      borderRing: BORDER_RING, border: BORDER_THRESHOLD,
    },
  };
  fs.writeFileSync(path.join(outputDir, 'comparison.json'), JSON.stringify(json, null, 2));

  await browser.close();

  // Determine effective verdict — border_diff overrides an overall "match"
  const effectiveVerdict = result.borderVerdict === 'border_diff' && result.verdict === 'match'
    ? 'minor_diff' : result.verdict;

  const icon = effectiveVerdict === 'match' ? '✅' : effectiveVerdict === 'minor_diff' ? '⚠️' : '❌';
  console.log(`${icon} ${effectiveVerdict.toUpperCase()} — overall ${result.matchPct}% | border ${result.borderMatchPct}% (${result.borderDiff}/${result.borderTotal} border px differ)`);
  console.log(`   diff → ${path.join(outputDir, 'diff.png')}`);

  process.exit(effectiveVerdict === 'mismatch' ? 2 : effectiveVerdict === 'minor_diff' ? 1 : 0);
})().catch(err => {
  console.error('compare.js error:', err.message);
  process.exit(3);
});
