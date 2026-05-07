const { getBrowser } = require('./browser-connect');

(async () => {
  const browser = await getBrowser();
  const page = await browser.newPage();
  page.setViewportSize({ width: 1440, height: 900 });
  
  await page.goto('http://localhost:5173/cases/', { waitUntil: 'networkidle', timeout: 15000 });
  
  const textareas = await page.locator('textarea').count();
  console.log(`Total textareas: ${textareas}`);
  
  for (let i = 0; i < textareas; i++) {
    const vis = await page.locator('textarea').nth(i).isVisible();
    const box = await page.locator('textarea').nth(i).boundingBox();
    console.log(`  textarea[${i}] visible: ${vis}, box: ${JSON.stringify(box)}`);
  }
  
  // Try to scroll and find
  await page.locator('main').evaluate(el => el.scrollTop = el.scrollHeight);
  await page.waitForTimeout(500);
  
  console.log('\nAfter scroll:');
  for (let i = 0; i < textareas; i++) {
    const vis = await page.locator('textarea').nth(i).isVisible();
    const box = await page.locator('textarea').nth(i).boundingBox();
    console.log(`  textarea[${i}] visible: ${vis}, box: ${JSON.stringify(box)}`);
  }
  
  await browser.close();
})();
