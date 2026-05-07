const { getBrowser } = require('./browser-connect');

(async () => {
  const browser = await getBrowser();
  const page = await browser.newPage();
  page.setViewportSize({ width: 1440, height: 900 });
  
  await page.goto('http://localhost:5173/cases/', { waitUntil: 'networkidle', timeout: 15000 });
  
  const nav = page.locator('nav').first();
  const isVisible = await nav.isVisible();
  console.log(`nav is visible: ${isVisible}`);
  
  const display = await nav.evaluate(el => window.getComputedStyle(el).display);
  const visibility = await nav.evaluate(el => window.getComputedStyle(el).visibility);
  const hidden = await nav.evaluate(el => el.hidden);
  
  console.log(`display: ${display}`);
  console.log(`visibility: ${visibility}`);
  console.log(`hidden: ${hidden}`);
  
  const box = await nav.boundingBox();
  console.log(`bounding box: ${JSON.stringify(box)}`);
  
  await browser.close();
})();
