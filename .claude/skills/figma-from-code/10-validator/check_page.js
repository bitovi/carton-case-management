const fs = require('fs');
const path = require('path');
const { getBrowser } = require('./browser-connect');

(async () => {
  const browser = await getBrowser();
  const page = await browser.newPage();
  page.setViewportSize({ width: 1440, height: 900 });
  
  await page.goto('http://localhost:5173/cases/', { waitUntil: 'networkidle', timeout: 15000 });
  
  // Get the entire HTML to inspect structure
  const html = await page.content();
  
  // Try to find key elements
  const selectors = [
    'header',
    'nav',
    'main',
    'h1',
    'textarea',
    'button[aria-label*="option"]'
  ];
  
  for (const sel of selectors) {
    const count = await page.locator(sel).count();
    console.log(`${sel}: ${count}`);
  }
  
  console.log('\nSearching for nav with menu...');
  const navs = await page.locator('nav').count();
  console.log('Total navs:', navs);
  
  // Check if there are any elements with "menu" in attributes
  const menuElements = await page.locator('[*|aria-label*="menu"], [*|aria-label*="Menu"]').count();
  console.log('Elements with "menu" in aria-label:', menuElements);
  
  await browser.close();
})();
