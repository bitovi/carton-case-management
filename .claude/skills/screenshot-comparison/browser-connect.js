/**
 * Shared browser acquisition for screenshot-comparison scripts.
 *
 * Attempts to connect to a pre-existing Playwright Chromium instance via a
 * WebSocket endpoint written to disk by the figma-from-code pipeline. Falls
 * back to launching a fresh Chromium instance when no endpoint is available.
 */

const { chromium } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ENDPOINT_FILE = path.resolve('.temp/figma-from-code/pw-endpoint.txt');

/**
 * Obtain a Playwright Browser instance.
 * Connects to a running Chromium if a WebSocket endpoint file exists,
 * otherwise launches a new headless browser.
 * @returns {Promise<import('@playwright/test').Browser>}
 */
async function getBrowser() {
  try {
    const wsEndpoint = fs.readFileSync(ENDPOINT_FILE, 'utf-8').trim();
    return await chromium.connect(wsEndpoint);
  } catch {
    return await chromium.launch();
  }
}

module.exports = { getBrowser };
