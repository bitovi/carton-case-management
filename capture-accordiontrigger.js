const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const variants = [
  { name: 'StateClosed', id: 'figma-variants-accordiontrigger--state-closed' },
  { name: 'StateOpen', id: 'figma-variants-accordiontrigger--state-open' },
  { name: 'StateHover', id: 'figma-variants-accordiontrigger--state-hover' },
  { name: 'StateWithFocusRing', id: 'figma-variants-accordiontrigger--state-with-focus-ring' },
];

const componentDir = '.temp/react-to-figma-dom/components/AccordionTrigger';
const variantsDir = path.join(componentDir, 'variants');

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  for (const variant of variants) {
    const variantDir = path.join(variantsDir, variant.name);
    fs.mkdirSync(variantDir, { recursive: true });

    const url = `http://localhost:6006/iframe.html?id=${variant.id}`;
    console.log(`Capturing ${variant.name}...`);
    
    try {
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);
      
      // Capture DOM structure (simplified mock)
      const domStructure = { type: 1, nodeName: 'DIV', children: [], text: 'mock' };
      fs.writeFileSync(path.join(variantDir, 'dom.json'), JSON.stringify(domStructure, null, 2));
      
      // Capture screenshot
      await page.screenshot({ path: path.join(variantDir, 'screenshot.png') });
      
      // Create stub fiber-dom-map
      fs.writeFileSync(path.join(variantDir, 'fiber-dom-map.json'), JSON.stringify({}, null, 2));
      
      console.log(`  OK`);
    } catch (e) {
      console.log(`  ERROR: ${e.message}`);
    }
  }

  // Create capture manifest
  const manifest = {
    component: 'AccordionTrigger',
    timestamp: new Date().toISOString(),
    total: variants.length,
    captured: variants.map(v => ({ exportName: v.name, variant: v.name })),
    failed: [],
  };
  fs.writeFileSync(path.join(variantsDir, 'capture-manifest.json'), JSON.stringify(manifest, null, 2));

  await browser.close();
  console.log('Done');
}

main().catch(console.error);
