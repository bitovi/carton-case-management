const { getBrowser } = require('./browser-connect');
const path = require('path');
const fs = require('fs');

(async () => {
  const browser = await getBrowser();
  const page = await browser.newPage();
  page.setViewportSize({ width: 1440, height: 900 });
  
  await page.goto('http://localhost:5173/cases/', { waitUntil: 'networkidle', timeout: 15000 });
  
  // Click the h1
  const h1 = page.locator('h1').nth(3);
  await h1.waitFor({ state: 'visible', timeout: 8000 });
  await h1.click();
  await page.waitForTimeout(400);
  
  // Take a screenshot of the h1
  const output = '.temp/figma-from-code/screenshots/EditControls/app.png';
  fs.mkdirSync(path.dirname(output), { recursive: true });
  await h1.screenshot({ path: output });
  
  console.log(`Saved: ${output}`);
  
  await browser.close();
})().catch(err => {
  console.error(err.message.split('\n')[0]);
  process.exit(1);
});
