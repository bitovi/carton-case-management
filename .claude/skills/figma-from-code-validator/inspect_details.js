const { getBrowser } = require('./browser-connect');

(async () => {
  const browser = await getBrowser();
  const page = await browser.newPage();
  page.setViewportSize({ width: 1440, height: 900 });
  
  await page.goto('http://localhost:5173/cases/', { waitUntil: 'networkidle', timeout: 15000 });
  
  // Check h1 elements
  console.log('H1 elements:');
  const h1Count = await page.locator('h1').count();
  for (let i = 0; i < h1Count; i++) {
    const text = await page.locator('h1').nth(i).textContent();
    const classes = await page.locator('h1').nth(i).getAttribute('class');
    console.log(`  [${i}] "${text}" class="${classes}"`);
  }
  
  // Check textarea elements
  console.log('\nTextarea elements:');
  const taCount = await page.locator('textarea').count();
  for (let i = 0; i < taCount; i++) {
    const placeholder = await page.locator('textarea').nth(i).getAttribute('placeholder');
    const classes = await page.locator('textarea').nth(i).getAttribute('class');
    console.log(`  [${i}] placeholder="${placeholder}" class="${classes}"`);
  }
  
  // Check nav element
  console.log('\nNav element:');
  const navClasses = await page.locator('nav').first().getAttribute('class');
  const navAria = await page.locator('nav').first().getAttribute('aria-label');
  console.log(`  aria-label="${navAria}" class="${navClasses}"`);
  
  // Check for buttons with specific aria attributes
  console.log('\nButtons with aria attributes:');
  const buttons = await page.locator('button[aria-label]').count();
  for (let i = 0; i < Math.min(5, buttons); i++) {
    const label = await page.locator('button[aria-label]').nth(i).getAttribute('aria-label');
    console.log(`  [${i}] aria-label="${label}"`);
  }
  
  // Check main structure
  console.log('\nMain structure:');
  const mainDivs = await page.locator('main > div').count();
  console.log(`  main > div count: ${mainDivs}`);
  
  const mainMainDivs = await page.locator('main > div > div').count();
  console.log(`  main > div > div count: ${mainMainDivs}`);
  
  const mainMainMainDivs = await page.locator('main > div > div > div').count();
  console.log(`  main > div > div > div count: ${mainMainMainDivs}`);
  
  await browser.close();
})();
