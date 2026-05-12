const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ENDPOINT_FILE = path.resolve('.temp/figma-from-code/pw-endpoint.txt');

async function getBrowser() {
  try {
    const wsEndpoint = fs.readFileSync(ENDPOINT_FILE, 'utf-8').trim();
    return await chromium.connect(wsEndpoint);
  } catch {
    return await chromium.launch();
  }
}

module.exports = { getBrowser };
