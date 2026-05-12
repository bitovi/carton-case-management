const { getBrowser } = require('./browser-connect');

(async () => {
  const browser = await getBrowser();
  const page = await browser.newPage();
  page.setViewportSize({ width: 1440, height: 900 });
  
  await page.goto('http://localhost:5173/cases/', { waitUntil: 'networkidle', timeout: 15000 });
  
  const h1 = page.locator('h1').first();
  const isVisible = await h1.isVisible();
  console.log(`h1[0] is visible: ${isVisible}`);
  
  const box = await h1.boundingBox();
  console.log(`h1[0] bounding box: ${JSON.stringify(box)}`);
  
  // Check scroll position
  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const scrollTop = await page.evaluate(() => window.scrollY);
  
  console.log(`scrollHeight: ${scrollHeight}, scrollTop: ${scrollTop}`);
  
  // Try to get all h1s visibility
  const h1s = await page.locator('h1').count();
  console.log(`Total h1s: ${h1s}`);
  
  for (let i = 0; i < h1s; i++) {
    const vis = await page.locator('h1').nth(i).isVisible();
    const box = await page.locator('h1').nth(i).boundingBox();
    console.log(`  h1[${i}] visible: ${vis}, box: ${JSON.stringify(box)}`);
  }
  
  await browser.close();
})();
