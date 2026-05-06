/**
 * Text content extractor for figma-rebuild-from-code
 *
 * Navigates to a page, waits for an element, and returns a structured
 * summary of the text content visible in that element. Used by Phase 3
 * of figma-rebuild-from-code so Figma components are seeded with the
 * same text strings the app renders — not generic placeholders.
 *
 * Usage:
 *   node extract-text.js <url> --selector "css" [--click "css"] [--nth N]
 *
 * Output (stdout JSON):
 *   {
 *     "full": "complete innerText of the element",
 *     "lines": ["line1", "line2", ...],   // non-empty lines, trimmed
 *     "inputs": ["placeholder1", ...],    // input/textarea placeholder attrs
 *     "buttons": ["label1", ...],         // visible button texts
 *     "headings": ["h1 text", ...],
 *     "labels": ["label text", ...]
 *   }
 */

const { chromium } = require('@playwright/test');

const args = process.argv.slice(2);
if (args.length < 1) {
  process.stderr.write('Usage: node extract-text.js <url> --selector "css" [--click "css"] [--nth N]\n');
  process.exit(1);
}

const url = args[0];
let selector = null;
let clickSel = null;
let nthIndex = 0;

for (let i = 1; i < args.length; i++) {
  if (args[i] === '--selector') selector = args[++i];
  else if (args[i] === '--click') clickSel = args[++i];
  else if (args[i] === '--nth') nthIndex = Number(args[++i]);
}

(async () => {
  const browser = await chromium.launch();
  const page    = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });

  if (clickSel) {
    const trigger = page.locator(clickSel).first();
    await trigger.waitFor({ state: 'visible', timeout: 8000 });
    await trigger.click();
    await page.waitForTimeout(400);
  }

  const root = selector
    ? page.locator(selector).nth(nthIndex)
    : page.locator('body');

  await root.waitFor({ state: 'visible', timeout: 8000 });

  const result = await root.evaluate(el => {
    const lines = (el.innerText ?? '')
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    const inputs = [...el.querySelectorAll('input, textarea')]
      .map(i => i.placeholder || i.value || '')
      .filter(Boolean);

    const buttons = [...el.querySelectorAll('button')]
      .map(b => b.innerText?.trim())
      .filter(t => t && t.length > 0 && t.length < 60);

    const headings = [...el.querySelectorAll('h1,h2,h3,h4,h5,h6')]
      .map(h => h.innerText?.trim())
      .filter(Boolean);

    const labels = [...el.querySelectorAll('label')]
      .map(l => l.innerText?.trim())
      .filter(Boolean);

    return {
      full: el.innerText?.trim().slice(0, 500) ?? '',
      lines,
      inputs,
      buttons,
      headings,
      labels,
    };
  });

  await browser.close();
  process.stdout.write(JSON.stringify(result, null, 2));
})().catch(err => {
  process.stderr.write('extract-text.js error: ' + err.message + '\n');
  process.exit(1);
});
