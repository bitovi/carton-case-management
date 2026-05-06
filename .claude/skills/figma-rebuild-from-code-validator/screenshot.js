/**
 * Component screenshot helper for figma-rebuild-from-code-validator
 *
 * Usage — element screenshot:
 *   node screenshot.js <url> <output> --selector "css" [--click "css"] [--hover "css"] [width] [height]
 *
 * Usage — full page:
 *   node screenshot.js <url> <output> [width] [height]
 *
 * Flags:
 *   --selector "css"   Target a specific DOM element (uses Playwright CSS + text pseudo-classes)
 *   --click "css"      Click this element before screenshotting (to open overlays, enter edit mode, etc.)
 *   --hover "css"      Hover over this element before screenshotting (for tooltips, hover cards, etc.)
 *   --nth N            Use the Nth matching element (0-indexed, default: 0)
 *   --variant "name"   Label printed in output message (no effect on screenshot, for logging only)
 */
const { chromium } = require('@playwright/test');
const path = require('path');
const fs   = require('fs');

const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node screenshot.js <url> <output> [--selector "sel"] [--click "sel"] [--hover "sel"] [--nth N] [--variant "name"] [width] [height]');
  process.exit(1);
}

const url    = args[0];
const output = args[1];

let selector  = null;
let clickSel  = null;
let hoverSel  = null;
let nthIndex  = 0;
let variantLabel = null;
let width     = 1440;
let height    = 900;

const numericArgs = [];
for (let i = 2; i < args.length; i++) {
  if (args[i] === '--selector')    { selector     = args[++i]; }
  else if (args[i] === '--click')  { clickSel     = args[++i]; }
  else if (args[i] === '--hover')  { hoverSel     = args[++i]; }
  else if (args[i] === '--nth')    { nthIndex     = Number(args[++i]); }
  else if (args[i] === '--variant'){ variantLabel = args[++i]; }
  else if (!isNaN(Number(args[i]))){ numericArgs.push(Number(args[i])); }
}
if (numericArgs[0] != null) width  = numericArgs[0];
if (numericArgs[1] != null) height = numericArgs[1];

fs.mkdirSync(path.dirname(output), { recursive: true });

(async () => {
  const browser = await chromium.launch();
  const page    = await browser.newPage();
  await page.setViewportSize({ width, height });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });

  if (clickSel) {
    const trigger = page.locator(clickSel).first();
    await trigger.waitFor({ state: 'visible', timeout: 8000 });
    await trigger.click();
    await page.waitForTimeout(400);
  }

  if (hoverSel) {
    const hoverTarget = page.locator(hoverSel).first();
    await hoverTarget.waitFor({ state: 'visible', timeout: 8000 });
    await hoverTarget.hover();
    await page.waitForTimeout(600);
  }

  if (selector) {
    const el = page.locator(selector).nth(nthIndex);
    await el.waitFor({ state: 'visible', timeout: 8000 });
    await el.screenshot({ path: output });
  } else {
    await page.screenshot({ path: output });
  }

  await browser.close();
  const label = variantLabel ? ` [${variantLabel}]` : '';
  console.log(`Saved${label}: ${output}`);
})().catch(err => {
  console.error(err.message.split('\n')[0]);
  process.exit(1);
});
