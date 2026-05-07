const { getBrowser } = require('./browser-connect');

(async () => {
  const browser = await getBrowser();
  const page = await browser.newPage();
  page.setViewportSize({ width: 1440, height: 900 });
  
  await page.goto('http://localhost:5173/cases/', { waitUntil: 'networkidle', timeout: 15000 });
  
  // Check for buttons with aria-label="More options"
  console.log('Buttons with aria-label containing "option":');
  const buttons = await page.locator('button[aria-label*="option"]').count();
  console.log(`  Count: ${buttons}`);
  
  for (let i = 0; i < buttons; i++) {
    const label = await page.locator('button[aria-label*="option"]').nth(i).getAttribute('aria-label');
    const vis = await page.locator('button[aria-label*="option"]').nth(i).isVisible();
    console.log(`    [${i}] "${label}" visible: ${vis}`);
  }
  
  // Check for dialogs
  console.log('\nDialogs:');
  const dialogs = await page.locator('[role="dialog"]').count();
  console.log(`  Count: ${dialogs}`);
  
  // Check for VoteButton-like elements
  console.log('\nButtons with vote in class:');
  const voteButtons = await page.locator('button[class*="vote"]').count();
  console.log(`  Count: ${voteButtons}`);
  
  // Check any elements with ReactionStatistics
  console.log('\nElements with ReactionStatistics in class:');
  const reaction = await page.locator('[class*="ReactionStatistics"]').count();
  console.log(`  Count: ${reaction}`);
  
  // Look at the sidebar/options area
  console.log('\nLooking for buttons with visible text around options:');
  const allButtons = await page.locator('button').count();
  console.log(`  Total buttons: ${allButtons}`);
  
  // Log first 15 visible buttons
  for (let i = 0; i < Math.min(15, allButtons); i++) {
    const vis = await page.locator('button').nth(i).isVisible();
    const text = await page.locator('button').nth(i).textContent();
    const ariaLabel = await page.locator('button').nth(i).getAttribute('aria-label');
    if (vis) {
      console.log(`    button[${i}] text="${text.substring(0,30)}" label="${ariaLabel}"`);
    }
  }
  
  await browser.close();
})();
